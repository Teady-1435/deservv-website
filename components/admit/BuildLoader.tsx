"use client";

import { useEffect, useState } from "react";

const ROWS = [
  "Reading your inputs",
  "Matching your goal to a build path",
  "Compiling your fit report",
];

export default function BuildLoader({ onDone }: { onDone: () => void }) {
  const [visibleRows, setVisibleRows] = useState(0);
  const [checkedRows, setCheckedRows] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    ROWS.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleRows((v) => Math.max(v, i + 1)), i * 700));
      timers.push(setTimeout(() => setCheckedRows((v) => Math.max(v, i + 1)), i * 700 + 480));
    });
    timers.push(setTimeout(onDone, 2600));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-[560px] flex flex-col justify-center" style={{ minHeight: "40vh" }}>
      <div className="flex flex-col gap-4 font-mono text-[13.5px] text-muted-50">
        {ROWS.map((label, i) => (
          <div
            key={label}
            className="flex items-center gap-3 transition-opacity duration-[320ms]"
            style={{ opacity: i < visibleRows ? 1 : 0 }}
          >
            <span
              className="text-gold transition-opacity duration-[260ms]"
              style={{ opacity: i < checkedRows ? 1 : 0 }}
            >
              ✓
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
