import crypto from "crypto";

/**
 * Cashfree Payment Gateway helper.
 *
 * Spec: https://www.cashfree.com/docs/api-reference/payments/latest/orders/create
 * API version is pinned deliberately. Cashfree ships breaking changes behind
 * the x-api-version header, so bumping this is an explicit decision.
 */
export const CASHFREE_API_VERSION = "2026-01-01";

export type CashfreeMode = "sandbox" | "production";

export function cashfreeMode(): CashfreeMode {
  return process.env.CASHFREE_MODE === "production" ? "production" : "sandbox";
}

function baseUrl(): string {
  return cashfreeMode() === "production"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";
}

export function cashfreeConfigured(): boolean {
  return Boolean(process.env.CASHFREE_APP_ID && process.env.CASHFREE_SECRET_KEY);
}

function headers(extra: Record<string, string> = {}): Record<string, string> {
  const appId = process.env.CASHFREE_APP_ID;
  const secret = process.env.CASHFREE_SECRET_KEY;
  if (!appId || !secret) throw new Error("Cashfree credentials are not configured");
  return {
    "Content-Type": "application/json",
    "x-api-version": CASHFREE_API_VERSION,
    "x-client-id": appId,
    "x-client-secret": secret,
    ...extra,
  };
}

async function call<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, { ...init, cache: "no-store" });
  const text = await res.text();
  let json: unknown;
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Cashfree returned a non-JSON response (${res.status})`);
  }
  if (!res.ok) {
    const msg =
      (json as { message?: string })?.message ?? `Cashfree request failed (${res.status})`;
    throw new Error(msg);
  }
  return json as T;
}

/** Cashfree requires exactly 10 digits, so strip any country code. */
export function toCashfreePhone(raw: string): string {
  const d = raw.replace(/\D/g, "");
  return d.length > 10 ? d.slice(-10) : d;
}

/** customer_id must be alphanumeric, 3–50 chars. */
export function toCustomerId(signupId: string | null | undefined): string {
  const cleaned = (signupId ?? "").replace(/[^a-zA-Z0-9]/g, "");
  return (cleaned || `guest${Date.now()}`).slice(0, 50);
}

export type CreateOrderInput = {
  orderId: string;
  amount: number; // major units, e.g. 10000 for ₹10,000
  currency?: string;
  customer: { id: string; name: string; email: string; phone: string };
  returnUrl?: string;
  notifyUrl?: string;
  note?: string;
  tags?: Record<string, string>;
};

export type CreateOrderResult = {
  cf_order_id: string;
  order_id: string;
  order_status: string;
  order_amount: number;
  order_currency: string;
  payment_session_id: string;
};

export function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  return call<CreateOrderResult>("/orders", {
    method: "POST",
    headers: headers({ "x-idempotency-key": input.orderId }),
    body: JSON.stringify({
      order_id: input.orderId,
      order_amount: input.amount,
      order_currency: input.currency ?? "INR",
      customer_details: {
        customer_id: input.customer.id,
        customer_name: input.customer.name,
        customer_email: input.customer.email,
        customer_phone: toCashfreePhone(input.customer.phone),
      },
      order_meta: {
        return_url: input.returnUrl,
        notify_url: input.notifyUrl,
      },
      order_note: input.note,
      order_tags: input.tags,
    }),
  });
}

export type OrderStatus =
  | "ACTIVE"
  | "PAID"
  | "EXPIRED"
  | "TERMINATED"
  | "TERMINATION_REQUESTED";

export type FetchedOrder = {
  cf_order_id: string;
  order_id: string;
  order_status: OrderStatus;
  order_amount: number;
  order_currency: string;
};

export function getOrder(orderId: string): Promise<FetchedOrder> {
  return call<FetchedOrder>(`/orders/${encodeURIComponent(orderId)}`, {
    method: "GET",
    headers: headers(),
  });
}

export type OrderPayment = {
  cf_payment_id: string | number;
  payment_status: "SUCCESS" | "FAILED" | "PENDING" | "USER_DROPPED" | "CANCELLED" | "VOID";
  payment_amount: number;
  payment_time?: string;
  payment_group?: string;
};

export function getOrderPayments(orderId: string): Promise<OrderPayment[]> {
  return call<OrderPayment[]>(`/orders/${encodeURIComponent(orderId)}/payments`, {
    method: "GET",
    headers: headers(),
  });
}

/**
 * Webhook signature: base64(HMAC-SHA256(timestamp + rawBody, clientSecret)).
 * rawBody must be the untouched request body, not re-serialised JSON.
 */
export function verifyWebhookSignature(
  rawBody: string,
  timestamp: string,
  signature: string
): boolean {
  const secret = process.env.CASHFREE_SECRET_KEY;
  if (!secret || !timestamp || !signature) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(timestamp + rawBody)
    .digest("base64");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/** Rejects webhooks older than the tolerance to blunt replay attempts. */
export function timestampFresh(timestamp: string, toleranceSeconds = 300): boolean {
  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) return false;
  const seconds = ts > 1e12 ? ts / 1000 : ts;
  return Math.abs(Date.now() / 1000 - seconds) <= toleranceSeconds;
}
