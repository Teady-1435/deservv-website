type ConfirmationEmailInput = {
  to: string;
  name: string;
  amount: number;
  paymentId: string;
};

/**
 * Stub — no email provider is connected yet. Swap this body for a real
 * provider call (Resend, Postmark, SES, ...) once credentials exist; the
 * call site in /api/razorpay/verify already passes everything an invoice
 * email needs.
 */
export async function sendConfirmationEmail(input: ConfirmationEmailInput): Promise<void> {
  console.log("[email:stub] would send confirmation + invoice", input);
}
