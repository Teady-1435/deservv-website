import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { sendConfirmationEmail } from "@/lib/email";
import { PROGRAM } from "@/lib/config";
import {
  cashfreeConfigured,
  timestampFresh,
  verifyWebhookSignature,
} from "@/lib/cashfree";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type WebhookPayload = {
  type?: string;
  data?: {
    order?: { order_id?: string; order_amount?: number; order_currency?: string };
    payment?: {
      cf_payment_id?: string | number;
      payment_status?: string;
      payment_amount?: number;
      payment_currency?: string;
    };
    customer_details?: { customer_email?: string; customer_name?: string };
  };
};

/**
 * Source of truth for payment state. The browser can close mid-redirect, so
 * this webhook, not the return URL, is what reconciles the order.
 */
export async function POST(request: Request) {
  if (!cashfreeConfigured()) {
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const raw = await request.text();
  const signature = request.headers.get("x-webhook-signature") ?? "";
  const timestamp = request.headers.get("x-webhook-timestamp") ?? "";

  if (!verifyWebhookSignature(raw, timestamp, signature)) {
    console.warn("cashfree webhook rejected: bad signature");
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }
  if (!timestampFresh(timestamp)) {
    console.warn("cashfree webhook rejected: stale timestamp");
    return NextResponse.json({ error: "stale timestamp" }, { status: 401 });
  }

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const orderId = payload.data?.order?.order_id;
  if (!orderId) return NextResponse.json({ ok: true, ignored: "no order id" });

  const paymentStatus = payload.data?.payment?.payment_status;
  const status =
    paymentStatus === "SUCCESS"
      ? "paid"
      : paymentStatus
        ? paymentStatus.toLowerCase()
        : "unknown";

  const amountMajor =
    payload.data?.payment?.payment_amount ?? payload.data?.order?.order_amount ?? PROGRAM.fee;

  try {
    const supabase = supabaseAdmin();

    const { data: existing } = await supabase
      .from("payments")
      .select("id, status, signup_id")
      .eq("cf_order_id", orderId)
      .maybeSingle();

    const alreadyPaid = existing?.status === "paid";

    await supabase.from("payments").upsert(
      {
        signup_id: existing?.signup_id ?? null,
        provider: "cashfree",
        cf_order_id: orderId,
        cf_payment_id: payload.data?.payment?.cf_payment_id
          ? String(payload.data.payment.cf_payment_id)
          : null,
        status,
        amount: Math.round(amountMajor * 100),
        currency:
          payload.data?.payment?.payment_currency ??
          payload.data?.order?.order_currency ??
          "INR",
        webhook_event: payload.type ?? null,
      },
      { onConflict: "cf_order_id" }
    );

    const email = payload.data?.customer_details?.customer_email;
    if (status === "paid" && !alreadyPaid && email) {
      sendConfirmationEmail({
        to: email,
        name: payload.data?.customer_details?.customer_name ?? "",
        amount: PROGRAM.fee,
        paymentId: String(payload.data?.payment?.cf_payment_id ?? orderId),
      }).catch((e) => console.error("confirmation email failed", e));
    }

    // Always 200 on a verified webhook, otherwise Cashfree keeps retrying.
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("cashfree webhook persistence failed", err);
    return NextResponse.json({ error: "storage failed" }, { status: 500 });
  }
}
