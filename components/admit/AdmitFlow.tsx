"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  QUESTIONS,
  TIERS,
  PROGRAM,
  money,
  tierIndex,
  capstoneFor,
  diagnosisFor,
  type Answers,
} from "@/lib/config";
import QuestionStage from "./QuestionStage";
import MidStep from "./MidStep";
import BuildLoader from "./BuildLoader";
import CountUp from "./CountUp";
import DoneVisual from "./DoneVisual";

type Step = "signup" | "q" | "mid" | "build" | "report" | "pay" | "done";

type SignupData = { name: string; email: string; phone: string };

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, cb: (response: unknown) => void) => void;
    };
  }
}

const feeLabel = money(PROGRAM.fee);

export default function AdmitFlow() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("signup");
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<Answers>([]);
  const [locked, setLocked] = useState(false);
  const [barPercent, setBarPercent] = useState(0);
  const [midSeen, setMidSeen] = useState(false);

  const [signup, setSignup] = useState<SignupData>({ name: "", email: "", phone: "" });
  const [signupId, setSignupId] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [seats, setSeats] = useState(PROGRAM.seats);
  const [payError, setPayError] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);

  const ti = tierIndex(answers);
  const tier = TIERS[ti];
  const capstone = capstoneFor(answers);
  const diagnosis = diagnosisFor(answers);

  async function handleSignupSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!signup.name.trim() || !signup.email.trim() || !signup.phone.trim()) {
      setSignupError("All three fields are required.");
      return;
    }
    setSubmitting(true);
    setSignupError(null);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signup),
      });
      if (!res.ok) throw new Error("signup failed");
      const data = await res.json();
      setSignupId(data.id);
      setStep("q");
      setQi(0);
    } catch {
      setSignupError("Could not save your details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function handlePickStart() {
    setLocked(true);
  }

  function handlePick(idx: number) {
    const next = answers.slice();
    next[qi] = idx;
    setAnswers(next);
    setLocked(false);
    if (qi === 2 && !midSeen) {
      setMidSeen(true);
      setStep("mid");
      return;
    }
    if (qi >= QUESTIONS.length - 1) {
      setStep("build");
      return;
    }
    setQi(qi + 1);
    setStep("q");
  }

  function handleMidAdvance() {
    if (step !== "mid") return;
    setStep("q");
    setQi(3);
  }

  async function handleBuildDone() {
    setStep("report");
    if (signupId) {
      fetch("/api/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signupId, answers }),
      }).catch(() => {});
    }
    try {
      const res = await fetch("/api/seats");
      if (res.ok) {
        const data = await res.json();
        if (typeof data.seats === "number") setSeats(data.seats);
      }
    } catch {
      // keep static default
    }
  }

  function goPay() {
    setStep("pay");
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  async function payNow() {
    setPayError(null);
    if (!razorpayReady || typeof window.Razorpay === "undefined") {
      setPayError("Payment is still loading. Try again in a moment.");
      return;
    }
    setPaying(true);
    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signupId }),
      });
      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        throw new Error(err.error || "Could not start payment");
      }
      const order = await orderRes.json();

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Deservv",
        description: `Applied & Agentic AI — ${PROGRAM.duration}`,
        order_id: order.orderId,
        prefill: {
          name: signup.name,
          email: signup.email,
          contact: signup.phone,
        },
        theme: { color: "#e5342a" },
        handler: async (response: unknown) => {
          const r = response as {
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
          };
          try {
            const verifyRes = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                signupId,
                razorpay_order_id: r.razorpay_order_id,
                razorpay_payment_id: r.razorpay_payment_id,
                razorpay_signature: r.razorpay_signature,
                email: signup.email,
                name: signup.name,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.verified) {
              setStep("done");
              window.scrollTo({ top: 0, behavior: "auto" });
            } else {
              setPayError("Payment could not be verified. Please contact us before retrying.");
            }
          } catch {
            setPayError("Payment could not be verified. Please contact us before retrying.");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      });
      rzp.open();
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Could not start payment");
      setPaying(false);
    }
  }

  const showStepper = step !== "signup";
  const stepIdx = step === "signup" || step === "q" || step === "mid" || step === "build" ? 0 : step === "report" ? 1 : 2;

  function stepPaint(i: number) {
    if (i < stepIdx) return { c: "#d9b978", b: "#d9b978", m: "✓" };
    if (i === stepIdx) return { c: "#f3f1ec", b: "#d9b978", m: "›" };
    return { c: "#605d57", b: "rgba(255, 255, 255, 0.1)", m: "·" };
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center relative overflow-hidden"
      style={{ padding: "clamp(96px,12vh,132px) 20px 70px" }}
    >
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayReady(true)}
        strategy="afterInteractive"
      />
      <div
        className="absolute -top-[190px] -right-[150px] w-[540px] h-[540px] rounded-full border border-dashed border-gold/[0.12] pointer-events-none"
      />

      {showStepper && (
        <div className="w-full max-w-[720px] grid grid-cols-3 gap-3" style={{ marginBottom: "clamp(30px,5vh,52px)" }}>
          {["Assessment", "Fit report", "Reserve seat"].map((label, i) => {
            const p = stepPaint(i);
            return (
              <div key={label} className="flex flex-col gap-2.5">
                <div className="h-0.5" style={{ background: p.b }} />
                <div
                  className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] uppercase"
                  style={{ color: p.c }}
                >
                  <span>{p.m}</span>
                  <span>{label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {step === "signup" && (
        <div className="w-full max-w-[520px] border border-white/[0.12] bg-ink-alt" style={{ padding: "clamp(28px,4vw,44px)" }}>
          <div className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-4">Admission</div>
          <h1
            className="font-display font-semibold leading-[1.05] mb-3.5"
            style={{ fontSize: "clamp(28px,3.4vw,40px)", letterSpacing: "-0.03em" }}
          >
            Six questions. Then your fit report.
          </h1>
          <p className="text-[15.5px] leading-[1.6] text-muted-100 mb-7.5">
            No essays, no interview call. Answer honestly and you will see
            exactly which path you land on.
          </p>
          <form onSubmit={handleSignupSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-400">Name</span>
              <input
                type="text"
                value={signup.name}
                onChange={(e) => setSignup((s) => ({ ...s, name: e.target.value }))}
                className="bg-white/[0.03] border border-white/[0.14] text-ivory px-4 py-3.5 text-[15.5px] outline-none focus:border-gold"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-400">Email</span>
              <input
                type="email"
                value={signup.email}
                onChange={(e) => setSignup((s) => ({ ...s, email: e.target.value }))}
                className="bg-white/[0.03] border border-white/[0.14] text-ivory px-4 py-3.5 text-[15.5px] outline-none focus:border-gold"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-400">
                WhatsApp number
              </span>
              <input
                type="tel"
                placeholder="+91"
                value={signup.phone}
                onChange={(e) => setSignup((s) => ({ ...s, phone: e.target.value }))}
                className="bg-white/[0.03] border border-white/[0.14] text-ivory px-4 py-3.5 text-[15.5px] outline-none focus:border-gold"
              />
            </label>
            {signupError && <p className="text-red text-sm m-0">{signupError}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 bg-red text-white border-0 rounded-full px-8 py-4 cursor-pointer font-mono text-[12.5px] tracking-[0.1em] uppercase font-medium hover:bg-red-hover disabled:opacity-60"
            >
              {submitting ? "Saving…" : "Start assessment"}
            </button>
          </form>
        </div>
      )}

      {step === "q" && (
        <div className="w-full max-w-[720px]">
          <div className="h-0.5 bg-white/[0.08]">
            <div
              className="h-0.5 bg-gold"
              style={{ width: `${barPercent}%`, transition: "width 520ms cubic-bezier(0.16, 1, 0.3, 1)" }}
            />
          </div>
          <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-muted-400 mt-3.5">
            Question {qi + 1} of {QUESTIONS.length}
          </div>
          <QuestionStage
            key={qi}
            question={QUESTIONS[qi]}
            qi={qi}
            total={QUESTIONS.length}
            locked={locked}
            onPickStart={handlePickStart}
            onPick={handlePick}
            onBarUpdate={setBarPercent}
          />
        </div>
      )}

      {step === "mid" && <MidStep onAdvance={handleMidAdvance} />}

      {step === "build" && <BuildLoader onDone={handleBuildDone} />}

      {step === "report" && (
        <div className="w-full max-w-[900px]">
          <div className="flex flex-col items-center text-center">
            <div className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-muted-400 mb-3.5">
              Your tier
            </div>
            <div className="inline-flex items-center gap-3 border border-gold/50 bg-gold/[0.08] px-7.5 py-4">
              <span className="w-1.5 h-1.5 bg-gold block" />
              <span
                className="font-display font-semibold text-gold"
                style={{ fontSize: "clamp(24px,3.2vw,38px)", letterSpacing: "-0.025em" }}
              >
                {tier}
              </span>
            </div>
            <div className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-400 mt-3.5">
              Rung {ti + 1} of {TIERS.length} on the build ladder
            </div>
          </div>

          <p
            className="max-w-[46ch] mx-auto text-center"
            style={{ marginTop: "clamp(28px,4vh,44px)", fontSize: "clamp(17px,1.5vw,21px)", lineHeight: 1.55 }}
          >
            {diagnosis}
          </p>

          <div
            className="border border-white/[0.12] bg-ink-alt"
            style={{ marginTop: "clamp(30px,5vh,52px)", padding: "clamp(26px,3.5vw,40px)" }}
          >
            <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-gold mb-3.5">
              Your capstone build
            </div>
            <p className="m-0 text-[16.5px] leading-[1.6] text-muted-50">{capstone}</p>
          </div>

          <div className="mt-4.5 grid gap-4.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
            <div className="border border-white/10 py-6.5 px-6">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-4">
                The market
              </div>
              <div className="flex flex-col gap-2.5 font-mono text-[13px] text-muted-400">
                <span className="line-through decoration-red/50">6 months of lectures</span>
                <span className="line-through decoration-red/50">₹1,00,000 – ₹3,00,000</span>
                <span className="line-through decoration-red/50">1 PDF certificate</span>
              </div>
            </div>
            <div className="border border-gold/40 bg-gold/5 py-6.5 px-6">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-gold mb-4">Deservv</div>
              <div className="flex flex-col gap-2.5 font-mono text-[13px] text-ivory">
                <span>{PROGRAM.duration} of building</span>
                <span className="font-display text-2xl font-semibold text-gold" style={{ letterSpacing: "-0.02em" }}>
                  <CountUp to={PROGRAM.fee} isMoney />
                </span>
                <span>Systems that run after day 15</span>
              </div>
            </div>
          </div>

          <div className="mt-6.5 flex flex-wrap items-center justify-center gap-4.5">
            <button
              onClick={goPay}
              className="bg-red text-white border-0 rounded-full px-8.5 py-4.5 cursor-pointer font-mono text-[12.5px] tracking-[0.1em] uppercase font-medium hover:bg-red-hover"
            >
              Reserve your seat, {feeLabel}
            </button>
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-400">
              <CountUp to={seats} /> seats per cohort
            </span>
          </div>
        </div>
      )}

      {step === "pay" && (
        <div
          className="w-full max-w-[900px] grid items-start"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(24px,4vw,48px)" }}
        >
          <div className="border border-white/[0.14] bg-ink-alt" style={{ padding: "clamp(26px,3.5vw,40px)" }}>
            <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-muted-400 mb-5">
              Razorpay — secure checkout
            </div>
            <div className="flex justify-between py-3.5 border-t border-white/[0.08] font-mono text-[13px] text-muted-50">
              <span>Applied &amp; Agentic AI — {PROGRAM.duration}</span>
              <span>{feeLabel}</span>
            </div>
            <div className="flex justify-between py-3.5 border-t border-b border-white/[0.08] font-mono text-[13px] text-ivory">
              <span>Total due today</span>
              <span className="text-gold">{feeLabel}</span>
            </div>
            {payError && <p className="text-red text-sm mt-3 mb-0">{payError}</p>}
            <button
              onClick={payNow}
              disabled={paying}
              className="w-full mt-6 bg-red text-white border-0 rounded-full px-7.5 py-4 cursor-pointer font-mono text-[12.5px] tracking-[0.1em] uppercase font-medium hover:bg-red-hover disabled:opacity-60"
            >
              {paying ? "Processing…" : `Pay ${feeLabel}`}
            </button>
          </div>
          <div className="flex flex-col gap-4.5">
            <div className="border border-gold/35 bg-gold/[0.06] px-5 py-4.5 font-mono text-[11.5px] tracking-[0.12em] uppercase text-gold">
              {seats} seats per cohort
            </div>
            <p className="m-0 text-base leading-[1.6] text-muted-100">
              Vikas Patel teaches every session himself — eight years of
              backend and scale, now shipping with AI daily at a global
              learning platform.
            </p>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="w-full max-w-[640px] relative">
          <DoneVisual />
          <h1
            className="font-display font-semibold leading-[1.06] text-center"
            style={{ fontSize: "clamp(28px,3.6vw,44px)", letterSpacing: "-0.03em", margin: "26px 0 12px" }}
          >
            Seat reserved.
          </h1>
          <p className="mx-auto text-center max-w-[42ch] text-[16.5px] leading-[1.6] text-muted-100 mb-8.5">
            Invoice is on its way to your inbox. Everything else happens in
            the group.
          </p>
          <div className="flex flex-col border-t border-white/[0.08]">
            {[
              ["Cohort starts", PROGRAM.cohortStart],
              ["WhatsApp group", <a key="wa" href="https://chat.whatsapp.com/">Join the cohort room</a>],
              ["Before day one", "Vikas sends your pre-work — one task from your own week"],
              ["Invoice", <span key="inv" className="text-gold">{feeLabel} — emailed now</span>],
            ].map(([label, value], i, arr) => (
              <div
                key={String(label)}
                className={`flex justify-between gap-5 py-3.5 ${i < arr.length - 1 ? "border-b border-white/[0.08]" : ""}`}
              >
                <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-400 shrink-0">
                  {label}
                </span>
                <span className="text-[15.5px] text-right">{value}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => router.push("/")}
              className="bg-transparent text-ivory border border-white/[0.18] rounded-full px-7 py-3.5 cursor-pointer font-mono text-xs tracking-[0.1em] uppercase hover:border-gold hover:text-gold"
            >
              Back to site
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
