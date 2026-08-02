"use client";

import { useEffect, useState } from "react";
import { money } from "@/lib/config";

export default function CountUp({ to, isMoney = false }: { to: number; isMoney?: boolean }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 600);
      const v = Math.round(to * (1 - Math.pow(1 - p, 3)));
      setValue(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);

  return <>{isMoney ? money(value) : value}</>;
}
