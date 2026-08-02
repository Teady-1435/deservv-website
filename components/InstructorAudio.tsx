"use client";

import { useState } from "react";

export default function InstructorAudio() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex items-center gap-4 mt-7.5 px-4.5 py-4 border border-white/10 bg-white/[0.02]">
      <div className="relative w-[42px] h-[42px] shrink-0">
        <span
          className="absolute inset-0 rounded-full border border-gold block"
          style={{ animation: "pulseRing 2.6s ease-out infinite" }}
        />
        <button
          onClick={() => setPlaying((p) => !p)}
          className="relative w-[42px] h-[42px] rounded-full bg-gold text-ink border-0 cursor-pointer font-mono text-[13px]"
        >
          {playing ? "❚❚" : "▶"}
        </button>
      </div>
      <div className="flex-1">
        <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-400 mb-2">
          90 seconds — why this program exists
        </div>
        <div className="flex items-center gap-[3px] h-6">
          {Array.from({ length: 44 }).map((_, i) => {
            const h = 6 + Math.abs(Math.sin(i * 0.7)) * 18;
            return (
              <span
                key={i}
                className="block w-0.5"
                style={{
                  height: `${h}px`,
                  background: playing ? "#d9b978" : "#3b3833",
                  transformOrigin: "center",
                  animation: playing ? "wave 1.1s ease-in-out infinite" : "none",
                  animationDelay: `${i * 0.045}s`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
