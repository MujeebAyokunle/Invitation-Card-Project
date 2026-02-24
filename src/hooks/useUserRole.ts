import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "scanner";

export const useUserRole = (userId: string | undefined) => {
    return useQuery({
        queryKey: ["user_role", userId],
        queryFn: async () => {
            if (!userId) return null;

            const { data, error } = await supabase
                .from("user_roles")
                .select("role")
                .eq("user_id", userId)
                .maybeSingle();

            if (error) throw error;
            // return data?.role as AppRole | null;
             return (data?.role ?? null) as AppRole | null; 
        },
        enabled: !!userId,
    });
};

export const useIsAdmin = (userId: string | undefined) => {
    const { data: role, isLoading } = useUserRole(userId);
    return { isAdmin: role === "admin", isLoading };
};

export const useIsScanner = (userId: string | undefined) => {
    const { data: role, isLoading } = useUserRole(userId);
    return { isScanner: role === "scanner" || role === "admin", isLoading };
};