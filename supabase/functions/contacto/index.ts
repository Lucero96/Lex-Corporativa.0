// Supabase Edge Function: contacto
// - Persists a contact form submission to `public.lex_contactos`
// - Sends an email via Resend
//
// Secrets required (Supabase Dashboard -> Edge Functions -> Secrets):
// - SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY
// - RESEND_API_KEY
// Optional:
// - CONTACT_TO_EMAIL (default: erhos1402@gmail.com)
// - RESEND_FROM_EMAIL (default: onboarding@resend.dev)

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ContactPayload = {
  nombre?: string;
  email?: string;
  asunto?: string;
  mensaje?: string;
  origen?: string | null;
};

function jsonResponse(body: unknown, status = 200, extraHeaders: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let payload: ContactPayload;
  try {
    payload = (await req.json()) as ContactPayload;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const nombre = String(payload.nombre ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const asunto = String(payload.asunto ?? "").trim();
  const mensaje = String(payload.mensaje ?? "").trim();
  const origen = payload.origen ? String(payload.origen) : null;

  if (nombre.length < 2) return jsonResponse({ error: "nombre is required" }, 400);
  if (!isValidEmail(email)) return jsonResponse({ error: "email is invalid" }, 400);
  if (!asunto) return jsonResponse({ error: "asunto is required" }, 400);
  if (mensaje.length < 10) return jsonResponse({ error: "mensaje is too short" }, 400);

  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return jsonResponse({ error: "Supabase secrets not configured" }, 500);
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });

  const { error: insertError } = await supabaseAdmin.from("lex_contactos").insert([
    {
      nombre,
      email,
      asunto,
      mensaje,
      origen,
    },
  ]);

  if (insertError) {
    return jsonResponse({ error: "Database insert failed" }, 500);
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";
  if (!resendApiKey) {
    return jsonResponse({ error: "RESEND_API_KEY not configured" }, 500);
  }

  const toEmail = Deno.env.get("CONTACT_TO_EMAIL") ?? "erhos1402@gmail.com";
  const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") ?? "onboarding@resend.dev";

  const subject = `[Lex Corporativa] Contacto: ${asunto}`;
  const text = [
    `Nombre: ${nombre}`,
    `Email: ${email}`,
    `Asunto: ${asunto}`,
    origen ? `Origen: ${origen}` : null,
    "",
    "Mensaje:",
    mensaje,
  ]
    .filter(Boolean)
    .join("\n");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject,
      text,
    }),
  });

  if (!resendResponse.ok) {
    const details = await resendResponse.text().catch(() => "");
    return jsonResponse(
      { error: "Email send failed", details: details.slice(0, 500) },
      502,
    );
  }

  return jsonResponse({ ok: true });
});

