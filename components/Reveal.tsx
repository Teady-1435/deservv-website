"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const BRAND_EASE = [0.16, 1, 0.3, 1] as const;

export default function Reveal({
  children,
  className,
  style,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: "div" | "h1" | "h2" | "h3" | "p";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      style={style}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.75, ease: BRAND_EASE }}
    >
      {children}
    </MotionTag>
  );
}
