import "@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
const supabase = createClient(supabaseUrl, supabaseKey)

console.log("Create Operator Function Started!")

// Global CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // change to your frontend in production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json",
}

Deno.serve(async (req: Request) => {
  try {
    // Respond immediately to OPTIONS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders, status: 204 })
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: corsHeaders }
      )
    }

    // Parse request body
    const body = await req.json()
    const { email, password, displayName, role } = body

    if (!email || !password || !displayName || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: corsHeaders }
      )
    }

    // 1️⃣ Create the authentication user
    const { user, error: authError } = await supabase.auth.admin.createUser({
      email: email.trim(),
      password,
      email_confirm: true, // auto-confirm
      user_metadata: { displayName: displayName.trim(), role }
    })

    if (authError) {
      return new Response(
        JSON.stringify({ error: `Auth error: ${authError.message}` }),
        { status: 500, headers: corsHeaders }
      )
    }

    // Insert into user_roles
    const { data, error } = await supabase
      .from("user_roles")
      .insert([{ app_role: displayName, role }])
      .select()

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: corsHeaders }
      )
    }

    return new Response(
      JSON.stringify({ message: "User role created successfully", data }),
      { status: 200, headers: corsHeaders }
    )
  } catch (err: any) {
    console.error("Function error:", err)
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    )
  }
})
