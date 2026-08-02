import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone } = body as {
    name?: string;
    email?: string;
    phone?: string;
  };

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "name, email and phone are required" },
      { status: 400 }
    );
  }

  try {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("signups")
      .insert({ name, email, phone })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("signup insert failed", err);
    return NextResponse.json(
      { error: "Could not save signup" },
      { status: 500 }
    );
  }
}
