import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { sendConfirmationEmail } from "@/lib/email";
import { PROGRAM } from "@/lib/config";
import { cashfreeConfigured, getOrder, getOrderPayments } from "@/lib/cashfree";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Confirms a payment by asking Cashfree directly. The browser is never trusted
 * to report success, so nothing the client sends can mark an order paid.
 */
export async function POST(request: Request) {
  if (!cashfreeConfigured()) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  }

  const { orderId, signupId, email, name } = (await request
    .json()
    .catch(() => ({}))) as {
    orderId?: string;
    signupId?: string;
    email?: string;
    name?: string;
  };

  if (!orderId) {
    return NextResponse.json({ error: "orderId is required" }, { status: 400 });
  }

  try {
    const order = await getOrder(orderId);
    const paid = order.order_status === "PAID";

    let cfPaymentId: string | null = null;
    if (paid) {
      const payments = await getOrderPayments(orderId).catch(() => []);
      const success = payments.find((p) => p.payment_status === "SUCCESS");
      cfPaymentId = success ? String(success.cf_payment_id) : null;
    }

    const supabase = supabaseAdmin();
    const { data: existing } = await supabase
      .from("payments")
      .select("id, status")
      .eq("cf_order_id", orderId)
      .maybeSingle();

    const alreadyPaid = existing?.status === "paid";

    await supabase.from("payments").upsert(
      {
        signup_id: signupId ?? null,
        provider: "cashfree",
        cf_order_id: orderId,
        cf_payment_id: cfPaymentId,
        status: paid ? "paid" : order.order_status.toLowerCase(),
        amount: Math.round(order.order_amount * 100),
        currency: order.order_currency,
      },
      { onConflict: "cf_order_id" }
    );

    // Only send the receipt on the transition into paid, never on a refresh.
    if (paid && !alreadyPaid && email) {
      sendConfirmationEmail({
        to: email,
        name: name ?? "",
        amount: PROGRAM.fee,
        paymentId: cfPaymentId ?? orderId,
      }).catch((e) => console.error("confirmation email failed", e));
    }

    return NextResponse.json({ verified: paid, status: order.order_status });
  } catch (err) {
    console.error("cashfree verify failed", err);
    return NextResponse.json({ error: "Could not confirm the payment." }, { status: 502 });
  }
}
