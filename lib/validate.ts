export type FieldErrors = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normaliseEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/** Keeps a leading +, strips everything else that is not a digit. */
export function normalisePhone(raw: string): string {
  const t = raw.trim();
  const plus = t.startsWith("+");
  const digits = t.replace(/\D/g, "");
  return plus ? `+${digits}` : digits;
}

export type SignupInput = { name: string; email: string; phone: string };

export function validateSignup(body: unknown): {
  ok: boolean;
  errors: FieldErrors;
  value: SignupInput;
} {
  const b = (body ?? {}) as Record<string, unknown>;
  const errors: FieldErrors = {};

  const name = typeof b.name === "string" ? b.name.trim().replace(/\s+/g, " ") : "";
  const email = typeof b.email === "string" ? normaliseEmail(b.email) : "";
  const phone = typeof b.phone === "string" ? normalisePhone(b.phone) : "";

  if (name.length < 2) errors.name = "Enter your full name.";
  else if (name.length > 120) errors.name = "That name is too long.";

  if (!email) errors.email = "Enter your email.";
  else if (!EMAIL_RE.test(email) || email.length > 254)
    errors.email = "That email does not look right.";

  const digits = phone.replace(/\D/g, "");
  if (!digits) errors.phone = "Enter your phone number.";
  else if (digits.length < 10 || digits.length > 15)
    errors.phone = "That phone number does not look right.";

  return { ok: Object.keys(errors).length === 0, errors, value: { name, email, phone } };
}
