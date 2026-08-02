import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/server";
import { sendConfirmationEmail } from "@/lib/email";
import { PROGRAM } from "@/lib/config";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    signupId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    email,
    name,
  } = body as {
    signupId?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    email?: string;
    name?: string;
  };

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    return NextResponse.json(
      { error: "Razorpay is not configured" },
      { status: 500 }
    );
  }

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { error: "Missing payment verification fields" },
      { status: 400 }
    );
  }

  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const verified = expectedSignature === razorpay_signature;

  const supabase = supabaseAdmin();

  if (!verified) {
    await supabase.from("payments").insert({
      signup_id: signupId,
      razorpay_order_id,
      razorpay_payment_id,
      status: "failed",
      amount: PROGRAM.fee * 100,
    });
    return NextResponse.json({ verified: false }, { status: 400 });
  }

  const { error } = await supabase.from("payments").insert({
    signup_id: signupId,
    razorpay_order_id,
    razorpay_payment_id,
    status: "paid",
    amount: PROGRAM.fee * 100,
  });

  if (error) {
    console.error("payment insert failed", error);
    return NextResponse.json(
      { error: "Could not record payment" },
      { status: 500 }
    );
  }

  if (email) {
    sendConfirmationEmail({
      to: email,
      name: name ?? "",
      amount: PROGRAM.fee,
      paymentId: razorpay_payment_id,
    }).catch((err) => console.error("confirmation email failed", err));
  }

  return NextResponse.json({ verified: true });
}
