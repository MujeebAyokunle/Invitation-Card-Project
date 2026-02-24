// File: functions/add-event/index.ts
import "@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Add Event Function Started!");

// Global CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // change to your frontend in production
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

Deno.serve(async (req: Request) => {
  try {
    // Respond immediately to OPTIONS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: corsHeaders }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      name,
      date,
      time,
      venue,
      honoree,
      dress_code,
      colors,
      enabled_categories,
    } = body;

    // Validate required field
    if (!name || name.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Event name is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          name: name.trim(),
          date: date ?? null,
          time: time ?? null,
          venue: venue ?? null,
          honoree: honoree ?? null,
          dress_code: dress_code ?? null,
          colors: colors ?? null,
          enabled_categories: enabled_categories ?? null,
          created_at: new Date().toISOString(),
        },
      ])
      .select(); // return the inserted row

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    if (enabled_categories) {
      const splitCategories = enabled_categories.split(",")

      for (let i = 0; i < splitCategories.length; i++) {
        const category = splitCategories[i].trim();
        if (category) {
          await supabase.from("categories").insert([
            {
              event_id: data[0].id,
              name: category,
              color: null,
              created_at: new Date().toISOString(),
            }
          ]);
        }
      }
    }

    return new Response(
      JSON.stringify({ message: "Event created successfully", data }),
      { status: 201, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error("Function error:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});