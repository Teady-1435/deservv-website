import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { PROGRAM } from "@/lib/config";
import {
  cashfreeConfigured,
  cashfreeMode,
  createOrder,
  toCustomerId,
} from "@/lib/cashfree";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!cashfreeConfigured()) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    signupId?: string;
    name?: string;
    email?: string;
    phone?: string;
  };

  const { signupId, name, email, phone } = body;
  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: "Name, email and phone are required to start a payment." },
      { status: 400 }
    );
  }

  const orderId = `deservv_${toCustomerId(signupId).slice(0, 24)}_${Date.now()}`;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  try {
    const order = await createOrder({
      orderId,
      amount: PROGRAM.fee,
      currency: "INR",
      customer: { id: toCustomerId(signupId), name, email, phone },
      returnUrl: `${siteUrl}/apply/start?order_id={order_id}`,
      notifyUrl: `${siteUrl}/api/cashfree/webhook`,
      note: `Deservv ${PROGRAM.cohort}`,
      tags: signupId ? { signup_id: signupId } : undefined,
    });

    // Record the attempt up front so an abandoned checkout is still visible.
    try {
      const supabase = supabaseAdmin();
      await supabase.from("payments").upsert(
        {
          signup_id: signupId ?? null,
          provider: "cashfree",
          cf_order_id: order.order_id,
          status: "created",
          amount: Math.round(PROGRAM.fee * 100),
          currency: "INR",
        },
        { onConflict: "cf_order_id" }
      );
    } catch (dbErr) {
      // A logging failure must not block the customer from paying.
      console.error("cashfree order pre-record failed", dbErr);
    }

    return NextResponse.json({
      orderId: order.order_id,
      paymentSessionId: order.payment_session_id,
      amount: order.order_amount,
      currency: order.order_currency,
      mode: cashfreeMode(),
    });
  } catch (err) {
    console.error("cashfree order creation failed", err);
    return NextResponse.json({ error: "Could not start the payment." }, { status: 502 });
  }
}
