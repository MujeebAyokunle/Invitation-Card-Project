import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type UserRole = Tables<"user_roles">;
export type Profile = Tables<"profiles">;

export interface Operator {
    id: string;
    user_id: string;
    role: "admin" | "scanner";
    display_name: string | null;
    created_at: string;
}

export const useOperators = () => {
    return useQuery({
        queryKey: ["operators"],
        queryFn: async () => {
            // Get all user roles
            const { data: roles, error: rolesError } = await supabase
                .from("user_roles")
                .select("*")
                .order("created_at", { ascending: false });

            if (rolesError) throw rolesError;
            if (!roles || roles.length === 0) return [];

            // Get profiles for these users
            const userIds = roles.map(r => r.user_id);
            const { data: profiles, error: profilesError } = await supabase
                .from("profiles")
                .select("*")
                .in("user_id", userIds);

            if (profilesError) throw profilesError;

            // Combine data
            const operators: Operator[] = roles.map((role: any) => {
                const profile = profiles?.find(p => p.user_id === role.user_id);

                return {
                    id: role.id,
                    user_id: role.user_id,
                    role: role.role as "admin" | "scanner",
                    display_name: profile?.display_name || role?.display_name || null,
                    created_at: role.created_at,
                };
            });

            return operators;
        },
    });
};