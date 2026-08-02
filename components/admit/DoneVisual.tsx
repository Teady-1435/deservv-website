"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const CONFETTI_COLORS = ["#e5342a", "#d9b978", "#f3f1ec"];

export default function DoneVisual() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const pieces: HTMLSpanElement[] = [];
    for (let i = 0; i < 26; i++) {
      const p = document.createElement("span");
      p.style.cssText = `position:absolute;left:50%;top:40px;width:5px;height:9px;background:${CONFETTI_COLORS[i % 3]};pointer-events:none;`;
      host.appendChild(p);
      pieces.push(p);
      const dx = (Math.random() - 0.5) * 460;
      const dy = 160 + Math.random() * 260;
      p.animate(
        [
          { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(${dx}px,${dy}px) rotate(${Math.random() * 720 - 360}deg)`,
            opacity: 0,
          },
        ],
        { duration: 1600 + Math.random() * 400, easing: "cubic-bezier(0.2, 0.6, 0.3, 1)", fill: "forwards" }
      );
      setTimeout(() => p.remove(), 2000);
    }
    return () => pieces.forEach((p) => p.remove());
  }, []);

  return (
    <div ref={hostRef} className="relative flex justify-center">
      <svg viewBox="0 0 80 80" style={{ width: 76, height: 76 }} fill="none">
        <circle cx="40" cy="40" r="37" stroke="rgba(217, 185, 120, 0.35)" strokeWidth="1.5" />
        <motion.path
          d="M25 41 L36 52 L56 30"
          stroke="#d9b978"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}
