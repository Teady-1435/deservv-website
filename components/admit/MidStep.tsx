"use client";

import { useEffect, useState } from "react";

export default function MidStep({ onAdvance }: { onAdvance: () => void }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setShown(true));
    const t = setTimeout(onAdvance, 1500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={onAdvance}
      className="w-full max-w-[720px] flex flex-col items-center justify-center cursor-pointer text-center"
      style={{ minHeight: "40vh" }}
    >
      <div
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : "translateY(14px)",
          transition: "opacity 500ms ease-out, transform 620ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="font-mono text-[10.5px] tracking-[0.2em] uppercase text-gold mb-4.5">
          Halfway
        </div>
        <div
          className="font-display font-semibold leading-[1.1] max-w-[18ch]"
          style={{ fontSize: "clamp(26px,3.6vw,42px)", letterSpacing: "-0.03em" }}
        >
          You&apos;re already ahead of most who start this.
        </div>
      </div>
    </div>
  );
}
