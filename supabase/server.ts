// lib/supabase-client.ts
import { createBrowserClient } from '@supabase/ssr'
import Cookies from 'js-cookie'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return Cookies.get(name)
                },
                set(name: string, value: string, options: any) {
                    Cookies.set(name, value, options)
                },
                remove(name: string, options: any) {
                    Cookies.remove(name, options)
                },
            },
        }
    )
}