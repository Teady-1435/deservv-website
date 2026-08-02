"use client";

import { useEffect, useRef, useState, useCallback, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useMotionValue, animate } from "framer-motion";
import { useRouter } from "next/navigation";
import { useNavTone } from "./NavToneContext";
import { useHomeReel } from "./HomeReelContext";
import { PROGRAM, money } from "@/lib/config";

const BRAND_EASE = [0.16, 1, 0.3, 1] as const;
const EXIT_EASE = [0.7, 0, 0.84, 0] as const;
const CUES = [7000, 9200, 11400, 13600, 15800];

type Frame =
  | { kind: "lines"; invert?: boolean; lines: { text: string; color?: string }[] }
  | { kind: "angled"; heading: string; ruleWidth: string; subLines: string[] };

const FRAMES: Frame[] = [
  {
    kind: "lines",
    lines: [
      { text: "Twelve years" },
      { text: "of courses." },
      { text: "Nothing changed", color: "#605d57" },
      { text: "on Monday.", color: "#605d57" },
    ],
  },
  {
    kind: "lines",
    invert: true,
    lines: [{ text: "So we stopped" }, { text: "teaching." }],
  },
  {
    kind: "angled",
    heading: "New method.",
    ruleWidth: "62%",
    subLines: ["Build, don't watch.", "Fifteen days, not six months."],
  },
  {
    kind: "angled",
    heading: "New price.",
    ruleWidth: "54%",
    subLines: [`${money(PROGRAM.fee)}, not three lakh.`, "One payment. No EMI."],
  },
  {
    kind: "lines",
    lines: [
      { text: "Eight systems" },
      { text: "already running", color: "#d9b978" },
      { text: "inside your job." },
    ],
  },
];

const SQUARE_SPOTS: [string, string][] = [
  ["13%", "94%"],
  ["87%", "3%"],
  ["11%", "3%"],
  ["88%", "95%"],
  ["12%", "90%"],
];

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

function LineFrame({ frame }: { frame: Extract<Frame, { kind: "lines" }> }) {
  return (
    <div
      className={`w-full max-w-[1180px] font-display font-bold uppercase leading-[0.96] text-[clamp(34px,6.6vw,104px)] ${
        frame.invert ? "text-white leading-[0.94] text-[clamp(40px,8.6vw,140px)]" : ""
      }`}
      style={{ letterSpacing: "-0.035em" }}
    >
      {frame.lines.map((line, i) => (
        <div key={i} className="overflow-hidden pb-[0.04em]">
          <motion.span
            className="block"
            style={{ color: line.color }}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "-110%" }}
            transition={{
              duration: 0.7,
              delay: i * 0.12,
              ease: BRAND_EASE,
            }}
          >
            {line.text}
          </motion.span>
        </div>
      ))}
    </div>
  );
}

function AngledFrame({ frame }: { frame: Extract<Frame, { kind: "angled" }> }) {
  return (
    <div className="w-full max-w-[1180px]">
      <div
        className="flex flex-col gap-[0.06em] font-display font-bold uppercase leading-none"
        style={{ transform: "rotate(-11deg)", transformOrigin: "left center", letterSpacing: "-0.03em" }}
      >
        <motion.div
          className="text-[clamp(30px,5.6vw,88px)]"
          initial={{ opacity: 0, x: "-34%", y: "12%" }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: "38%", y: "-14%" }}
          transition={{ duration: 0.7, ease: BRAND_EASE }}
        >
          {frame.heading}
        </motion.div>
        <motion.div
          className="h-0.5 bg-red my-[0.14em]"
          style={{ transformOrigin: "left center", width: frame.ruleWidth }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ duration: 0.6, delay: 0.09, ease: BRAND_EASE }}
        />
        {frame.subLines.map((line, i) => (
          <motion.div
            key={i}
            className="text-[clamp(20px,3vw,46px)] text-muted-50"
            initial={{ opacity: 0, x: "-34%", y: "12%" }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: "38%", y: "-14%" }}
            transition={{ duration: 0.7, delay: (i + 1) * 0.09, ease: BRAND_EASE }}
          >
            {line}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function HomeReel() {
  const reduced = usePrefersReducedMotion();
  const { setInverted } = useNavTone();
  const { registerReplay } = useHomeReel();
  const router = useRouter();

  const [phase, setPhase] = useState<"cover" | "year" | "frames" | "settled">("cover");
  const [frameIndex, setFrameIndex] = useState(-1);
  const [showSkip, setShowSkip] = useState(false);
  const [square, setSquare] = useState<{ top: string; left: string; invert: boolean } | null>(null);

  const yearMV = useMotionValue(2014);
  const [yearDisplay, setYearDisplay] = useState(2014);
  const [yearFinal, setYearFinal] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const playedRef = useRef(false);
  const yearControlsRef = useRef<ReturnType<typeof animate> | null>(null);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    yearControlsRef.current?.stop();
    yearControlsRef.current = null;
  }, []);

  const settleFinal = useCallback(() => {
    clearTimers();
    setPhase("settled");
    setFrameIndex(FRAMES.length - 1);
    setYearFinal(true);
    setYearDisplay(2026);
    setShowSkip(false);
    setInverted(false);
    setSquare({ top: SQUARE_SPOTS[4][0], left: SQUARE_SPOTS[4][1], invert: false });
  }, [clearTimers, setInverted]);

  const runSequence = useCallback(() => {
    clearTimers();
    setPhase("cover");
    setFrameIndex(-1);
    setYearFinal(false);
    setYearDisplay(2014);
    yearMV.set(2014);
    setInverted(false);
    setShowSkip(false);

    if (reduced) {
      settleFinal();
      return;
    }

    timers.current.push(setTimeout(() => setPhase("year"), 50));
    timers.current.push(setTimeout(() => setShowSkip(true), 1000));

    timers.current.push(
      setTimeout(() => {
        yearControlsRef.current = animate(yearMV, 2026, {
          duration: 2.6,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (v) => setYearDisplay(Math.round(v)),
          onComplete: () => setYearFinal(true),
        });
      }, 800)
    );

    timers.current.push(
      setTimeout(() => {
        setPhase("frames");
      }, 7000)
    );

    CUES.forEach((at, i) => {
      timers.current.push(
        setTimeout(() => {
          setFrameIndex(i);
          const f = FRAMES[i];
          const invert = f.kind === "lines" && !!f.invert;
          setInverted(invert);
          setSquare({ top: SQUARE_SPOTS[i][0], left: SQUARE_SPOTS[i][1], invert });
          if (i === FRAMES.length - 1) setShowSkip(false);
        }, at)
      );
    });

    timers.current.push(
      setTimeout(() => setPhase("settled"), CUES[CUES.length - 1] + 200)
    );
  }, [clearTimers, reduced, settleFinal, setInverted, yearMV]);

  useEffect(() => {
    registerReplay(() => {
      playedRef.current = true;
      runSequence();
    });
  }, [registerReplay, runSequence]);

  // This effect's job is to kick off the intro's timer-driven animation sequence
  // on mount (and clean it up on unmount) — the setState calls inside runSequence
  // are the point of the effect, not an accidental side effect of it.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("replay=1")) {
      playedRef.current = true;
      runSequence();
      router.replace("/");
      return;
    }
    playedRef.current = true;
    runSequence();
    return () => clearTimers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (phase === "settled") return;
    const onScroll = () => {
      if ((window.scrollY || 0) > 40) settleFinal();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [phase, settleFinal]);

  useEffect(() => {
    if (phase === "settled") return;
    const onVisibility = () => {
      if (document.hidden) settleFinal();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [phase, settleFinal]);

  const activeFrame = frameIndex >= 0 ? FRAMES[frameIndex] : null;

  return (
    <section className="relative h-[calc(100vh-70px)] min-h-[470px] overflow-hidden border-b border-white/[0.07]">
      <AnimatePresence>
        {phase === "cover" && (
          <motion.div
            className="fixed inset-0 z-[90] bg-ink pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {square && (
        <motion.div
          className="fixed z-40 w-[9px] h-[9px] pointer-events-none"
          animate={{
            top: square.top,
            left: square.left,
            background: square.invert ? "#fff" : "#e5342a",
            opacity: 1,
          }}
          transition={{ duration: 0.9, ease: BRAND_EASE }}
        />
      )}

      <AnimatePresence>
        {(phase === "cover" || phase === "year") && (
          <motion.div
            className="absolute inset-0 flex flex-col justify-center items-center px-5 md:px-14"
            style={{ paddingTop: "clamp(78px,9vh,116px)", paddingBottom: "clamp(34px,5vh,64px)" }}
            exit={{ y: "-16vh", opacity: 0 }}
            transition={{ duration: 0.7, ease: EXIT_EASE }}
          >
            <motion.div
              className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-gold text-center"
              style={{ marginBottom: "clamp(16px,3vh,34px)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "year" ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              Twelve years of upskilling
            </motion.div>
            <div
              className="relative w-full font-display font-bold text-center leading-none"
              style={{ fontSize: "clamp(48px, min(15vw, 17vh), 250px)", letterSpacing: "-0.045em" }}
            >
              <span style={{ color: yearFinal ? "#e5342a" : "#605d57", transition: "color 200ms" }}>
                {yearDisplay}
              </span>
            </div>
            <motion.div
              className="max-w-[44ch] mx-auto text-center text-muted-100"
              style={{ marginTop: "clamp(18px,3vh,38px)", fontSize: "clamp(15px,1.4vw,19px)", lineHeight: 1.6 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "year" ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Every one of those years, someone sold you a certificate. This one,
              you build the systems instead.
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 grid place-items-center px-5 md:px-20">
        <AnimatePresence mode="wait">
          {activeFrame && (phase === "frames" || phase === "settled") && (
            <motion.div
              key={frameIndex}
              className="contents"
              exit={{ transition: { duration: 0.001 } }}
            >
              {activeFrame.kind === "lines" ? (
                <LineFrame frame={activeFrame} />
              ) : (
                <AngledFrame frame={activeFrame} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showSkip && (
          <motion.button
            onClick={settleFinal}
            className="absolute right-4 md:right-8 bottom-4 md:bottom-8 z-[5] bg-ink/50 text-muted-50 border border-white/[0.18] rounded-full px-4.5 py-2.5 cursor-pointer font-mono text-[10.5px] tracking-[0.14em] uppercase hover:text-ivory hover:border-gold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            Skip intro
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
