import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";

export interface Category {
    id: string;
    event_id: string;
    name: string;
    color: string;
    created_at: string;
    updated_at: string;
}

export const useCategories = (eventId: string | undefined) => {
    return useQuery({
        queryKey: ["categories", eventId],
        queryFn: async () => {
            if (!eventId) return [];

            const { data, error } = await supabase
                .from("categories")
                .select("*")
                .eq("event_id", eventId)
                .order("name");

            if (error) throw error;
            return data as Category[];
        },
        enabled: !!eventId,
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ event_id, name, color }: { event_id: string; name: string; color: string }) => {
            // const { data, error } = await supabase
            //     .from("categories")
            //     .insert({ event_id, name, color })
            //     .select()
            //     .single();

            // if (error) throw error;
            // return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["categories", variables.event_id] });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, name, color, event_id }: { id: string; name: string; color: string; event_id: string }) => {
            // const { data, error } = await supabase
            //     .from("categories")
            //     .update({ name, color })
            //     .eq("id", id)
            //     .select()
            //     .single();

            // if (error) throw error;
            // return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["categories", variables.event_id] });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, event_id }: { id: string; event_id: string }) => {
            // const { error } = await supabase
            //     .from("categories")
            //     .delete()
            //     .eq("id", id);

            // if (error) throw error;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["categories", variables.event_id] });
        },
    });
};
