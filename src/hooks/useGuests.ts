import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Tables, TablesInsert } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";


export type Guest = Tables<"guests">;
export type GuestInsert = TablesInsert<"guests">;
// Category is now a TEXT column - no longer using enum
export type GuestCategory = string;
export type CheckIn = Tables<"check_ins">;

export type Event = Tables<"events">;

// Fetch the default event
export const useEvent = () => {
    return useQuery({
        queryKey: ["event"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("events")
                .select("*")
            // .limit(1)
            // .maybeSingle();

            if (error) throw error;
            return data as Event[] | null;
        },
    });
};

// Fetch all guests for an event
export const useGuests = (eventId: string | undefined) => {
    if (!eventId) return useQuery({ queryKey: ["guests", eventId], queryFn: async () => [] });
    return useQuery({
        queryKey: ["guests", eventId],
        queryFn: async () => {
            if (!eventId) return [];

            const { data, error } = await supabase
                .from("guests")
                .select("*")
                .eq("event_id", eventId)
                .order("name");

            if (error) throw error;
            return data as Guest[];
        },
        enabled: !!eventId,
    });
};

// Fetch a single guest by access token (for public card view)
export const useGuestByToken = (token: string | undefined) => {
    return useQuery({
        queryKey: ["guest", token],
        queryFn: async () => {
            if (!token) return null;

            const { data, error } = await supabase
                .from("guests")
                .select(`
        id,
        event_id,
        name,
        category,
        access_token,
        created_at,
        events (
          id,
          name,
          date,
          time,
          venue,
          honoree,
          dress_code,
          colors
        )
      `)
                .eq("access_token", token)
                .maybeSingle();

            if (error) throw error;
            console.log({ data })
            return data ?? null;
        },
        enabled: !!token,
    });
};

// Fetch check-ins for an event
export const useCheckIns = (eventId: string | undefined) => {
    return useQuery({
        queryKey: ["check_ins", eventId],
        queryFn: async () => {
            if (!eventId) return [];

            const { data, error } = await supabase
                .from("check_ins")
                .select("*, guests!inner(*)")
                .eq("guests.event_id", eventId);

            if (error) throw error;
            return data as (CheckIn & { guests: Guest })[];
        },
        enabled: !!eventId,
    });
};

// Create a new guest
export const useCreateGuest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (guest: { event_id: string; name: string; phone?: string | null; email?: string | null; category: string, access_token: string }) => {
            const { data, error } = await supabase
                .from("guests")
                .insert(guest as any) // Cast to any since category is now text in DB but types still show enum
                .select()
                .single();

            if (error) throw error;
            return data as Guest;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["guests", variables.event_id] });
        },
    });
};

// Update a guest
export const useUpdateGuest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...updates }: Partial<Guest> & { id: string }) => {
            const { data, error } = await supabase
                .from("guests")
                .update(updates)
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data as Guest;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["guests", data.event_id] });
        },
    });
};

// Delete a guest
export const useDeleteGuest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, eventId }: { id: string; eventId: string }) => {
            const { error } = await supabase
                .from("guests")
                .delete()
                .eq("id", id);

            if (error) throw error;
            return { id, eventId };
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["guests", data.eventId] });
        },
    });
};

// Create a check-in
export const useCreateCheckIn = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ guestId, scannedBy }: { guestId: string; scannedBy?: string }) => {
            const { data, error } = await supabase
                .from("check_ins")
                .insert({
                    guest_id: guestId,
                    scanned_by: scannedBy,
                })
                .select("*, guests(*)")
                .single();

            if (error) throw error;
            return data as CheckIn & { guests: Guest };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["check_ins"] });
            queryClient.invalidateQueries({ queryKey: ["guests"] });
        },
    });
};

// Check if guest is already checked in
export const useGuestCheckInStatus = (guestId: string | undefined) => {
    return useQuery({
        queryKey: ["check_in_status", guestId],
        queryFn: async () => {
            if (!guestId) return null;

            const { data, error } = await supabase
                .from("check_ins")
                .select("*")
                .eq("guest_id", guestId)
                .maybeSingle();

            if (error) throw error;
            return data as CheckIn | null;
        },
        enabled: !!guestId,
    });
};

// Get check-in stats
export const useCheckInStats = (eventId: string | undefined) => {
    if (!eventId) return useQuery({ queryKey: ["check_in_stats", eventId], queryFn: async () => ({ total: 0, checkedIn: 0, vip: 0, pending: 0 }) });
    return useQuery({
        queryKey: ["check_in_stats", eventId],
        queryFn: async () => {
            if (!eventId) return { total: 0, checkedIn: 0, vip: 0, pending: 0 };

            // Get total guests
            const { count: totalGuests, error: guestsError } = await supabase
                .from("guests")
                .select("*", { count: "exact", head: true })
                .eq("event_id", eventId);

            if (guestsError) throw guestsError;

            // Get VIP count
            const { count: vipCount, error: vipError } = await supabase
                .from("guests")
                .select("*", { count: "exact", head: true })
                .eq("event_id", eventId)
                .eq("category", "VIP");

            if (vipError) throw vipError;

            // Get check-ins count
            const { data: checkedInGuests, error: checkInsError } = await supabase
                .from("check_ins")
                .select("guest_id, guests!inner(event_id)")
                .eq("guests.event_id", eventId);

            if (checkInsError) throw checkInsError;

            const checkedInCount = checkedInGuests?.length || 0;

            return {
                total: totalGuests || 0,
                checkedIn: checkedInCount,
                vip: vipCount || 0,
                pending: (totalGuests || 0) - checkedInCount,
            };
        },
        enabled: !!eventId,
    });
};