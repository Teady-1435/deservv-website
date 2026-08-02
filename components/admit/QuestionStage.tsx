"use client";

import { useLayoutEffect, useRef } from "react";
import type { Question } from "@/lib/config";

function burst(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 14; i++) {
    const dot = document.createElement("span");
    const size = 3 + Math.random() * 3;
    dot.style.cssText = `position:absolute;left:${18 + Math.random() * 10}px;top:${r.height / 2}px;width:${size}px;height:${size}px;background:${
      i % 2 ? "#d9b978" : "#e5342a"
    };pointer-events:none;border-radius:50%;`;
    el.appendChild(dot);
    const a = Math.random() * Math.PI * 2;
    const d = 30 + Math.random() * 70;
    dot.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        {
          transform: `translate(${Math.cos(a) * d}px,${Math.sin(a) * d * 0.5}px) scale(0.2)`,
          opacity: 0,
        },
      ],
      { duration: 400, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" }
    );
    setTimeout(() => dot.remove(), 480);
  }
}

export default function QuestionStage({
  question,
  qi,
  total,
  locked,
  onPickStart,
  onPick,
  onBarUpdate,
}: {
  question: Question;
  qi: number;
  total: number;
  locked: boolean;
  onPickStart: () => void;
  onPick: (idx: number) => void;
  onBarUpdate: (percent: number) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    optionRefs.current.forEach((b) => {
      if (!b) return;
      b.style.transition = "none";
      b.style.transitionDelay = "0ms";
      b.style.opacity = "1";
      b.style.transform = "none";
      b.style.borderColor = "rgba(255, 255, 255, 0.12)";
      b.style.background = "rgba(255, 255, 255, 0.02)";
      requestAnimationFrame(() => {
        b.style.transition =
          "border-color 200ms ease, background 200ms ease, transform 260ms cubic-bezier(0.2, 1.4, 0.35, 1)";
      });
    });
    if (stage) {
      stage.style.transition = "none";
      stage.style.opacity = "0";
      stage.style.transform = "translateX(70px)";
      requestAnimationFrame(() => {
        stage.style.transition = "opacity 340ms ease-out, transform 560ms cubic-bezier(0.16, 1, 0.3, 1)";
        stage.style.opacity = "1";
        stage.style.transform = "none";
      });
    }
  }, [qi]);

  function handlePick(idx: number) {
    if (locked) return;
    onPickStart();
    const btns = optionRefs.current;
    const sel = btns[idx];
    if (sel) {
      sel.style.borderColor = "#d9b978";
      sel.style.background = "rgba(217, 185, 120, 0.09)";
      sel.style.transform = "scale(1.02)";
      burst(sel);
    }
    btns.forEach((b, i) => {
      if (i === idx || !b) return;
      b.style.transition = "opacity 260ms ease, transform 320ms cubic-bezier(0.2, 0.9, 0.2, 1)";
      b.style.transitionDelay = Math.abs(i - idx) * 40 + "ms";
      b.style.opacity = "0";
      b.style.transform = "translateX(-16px)";
    });
    setTimeout(() => {
      onBarUpdate(Math.round(((qi + 1) / total) * 100));
      const stage = stageRef.current;
      if (stage) {
        stage.style.transition = "opacity 280ms ease, transform 380ms cubic-bezier(0.3, 0, 0.2, 1)";
        stage.style.opacity = "0";
        stage.style.transform = "translateX(-70px)";
      }
    }, 480);
    setTimeout(() => onPick(idx), 800);
  }

  return (
    <div ref={stageRef} style={{ marginTop: "clamp(24px, 4vh, 40px)" }}>
      <h2
        className="font-display font-semibold leading-[1.08] m-0"
        style={{ fontSize: "clamp(26px,3.4vw,40px)", letterSpacing: "-0.03em" }}
      >
        {question.t}
      </h2>
      <div className="flex flex-col gap-3" style={{ marginTop: "clamp(22px, 3vh, 34px)" }}>
        {question.o.map((label, i) => (
          <button
            key={label}
            ref={(el) => {
              optionRefs.current[i] = el;
            }}
            onClick={() => handlePick(i)}
            className="relative overflow-hidden text-left bg-white/[0.02] border border-white/[0.12] text-ivory px-5 py-4.5 cursor-pointer text-base leading-[1.4] hover:border-gold/55 hover:bg-white/[0.04]"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
