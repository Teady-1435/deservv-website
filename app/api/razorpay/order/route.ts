import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { PROGRAM } from "@/lib/config";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { signupId } = body as { signupId?: string };

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay is not configured" },
      { status: 500 }
    );
  }

  try {
    const instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await instance.orders.create({
      amount: PROGRAM.fee * 100,
      currency: "INR",
      receipt: `deservv_${signupId ?? "guest"}_${Date.now()}`,
      notes: signupId ? { signupId } : undefined,
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (err) {
    console.error("razorpay order creation failed", err);
    return NextResponse.json(
      { error: "Could not create order" },
      { status: 500 }
    );
  }
}
