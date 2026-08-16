import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { validateSignup } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { ok, errors, value } = validateSignup(body);
  if (!ok) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fields: errors },
      { status: 400 }
    );
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const source = typeof raw.source === "string" ? raw.source.slice(0, 200) : null;

  try {
    const supabase = supabaseAdmin();

    // Same email applying twice should update the existing row, not fork the
    // record, so assessment and payment rows stay attached to one signup.
    const { data, error } = await supabase
      .from("signups")
      .upsert(
        {
          name: value.name,
          email: value.email,
          phone: value.phone,
          source,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("signup upsert failed", err);
    return NextResponse.json({ error: "Could not save your details. Try again." }, { status: 500 });
  }
}
