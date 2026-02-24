// lib/auth.ts (or wherever your signIn is)

import { supabase } from "@/integrations/supabase/client";
import { createClient } from "./server";

// import { supabase } from "@/integrations/supabase/client"

export async function signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    return { data, error }
}

export async function signIn(email: string, password: string) {

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        console.error('Login error:', error)
        return { data: null, error }
    }

    console.log('Login success:', data)
    return { data, error: null }
}