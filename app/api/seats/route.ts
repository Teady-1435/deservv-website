import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { PROGRAM } from "@/lib/config";

export async function GET() {
  const capacity = Number(process.env.COHORT_CAPACITY) || PROGRAM.seats;

  try {
    const supabase = supabaseAdmin();
    const { count, error } = await supabase
      .from("payments")
      .select("id", { count: "exact", head: true })
      .eq("status", "paid");

    if (error) throw error;

    const remaining = Math.max(0, capacity - (count ?? 0));
    return NextResponse.json({ seats: remaining, capacity });
  } catch {
    return NextResponse.json({ seats: capacity, capacity, fallback: true });
  }
}
