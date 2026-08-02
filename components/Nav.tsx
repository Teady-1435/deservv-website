"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useNavTone } from "./NavToneContext";
import { useHomeReel } from "./HomeReelContext";

function useClock() {
  const [time, setTime] = useState("--:--:--");
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { inverted } = useNavTone();
  const { replay } = useHomeReel();
  const time = useClock();

  const isHome = pathname === "/";
  const isApply = pathname === "/apply";
  const isHire = pathname === "/hire";

  const handleLogoClick = () => {
    if (isHome) {
      replay();
    } else {
      router.push("/?replay=1");
    }
  };

  const linkColor = inverted ? "text-white" : "text-muted-50";

  return (
    <nav
      className={`sticky top-0 z-50 flex items-center justify-between gap-6 h-[70px] px-5 md:px-14 border-b transition-colors duration-[260ms] ${
        inverted
          ? "bg-red border-white/30"
          : "bg-ink/82 backdrop-blur-[14px] border-white/[0.07]"
      }`}
    >
      <button
        onClick={handleLogoClick}
        className={`flex items-baseline gap-2 bg-transparent border-0 p-0 cursor-pointer ${
          inverted ? "text-white" : "text-ivory"
        }`}
      >
        <Logo />
      </button>

      <div className="flex items-center gap-1.5 md:gap-6">
        <div
          className={`hidden md:flex items-center gap-3 mr-2.5 font-mono text-[10.5px] tracking-[0.12em] uppercase ${
            inverted ? "text-white/78" : "text-muted-300"
          }`}
        >
          <span className={`w-1.5 h-1.5 block ${inverted ? "bg-white" : "bg-red"}`} />
          <span>Bengaluru</span>
          <span className={inverted ? "text-white" : "text-muted-50"}>{time}</span>
          <span className={inverted ? "text-white/78" : "text-muted-500"}>IST</span>
        </div>

        <Link
          href="/"
          className={`relative bg-transparent border-0 cursor-pointer font-mono text-[11.5px] tracking-[0.14em] uppercase px-1 py-2.5 hover:text-ivory transition-colors ${
            isHome ? "text-ivory" : linkColor
          }`}
        >
          Home
          {isHome && (
            <span className="absolute left-1 right-1 bottom-0.5 h-px bg-gold block" />
          )}
        </Link>
        <Link
          href="/apply"
          className={`relative bg-transparent border-0 cursor-pointer font-mono text-[11.5px] tracking-[0.14em] uppercase px-1 py-2.5 hover:text-ivory transition-colors ${
            isApply ? "text-ivory" : linkColor
          }`}
        >
          Apply
          {isApply && (
            <span className="absolute left-1 right-1 bottom-0.5 h-px bg-gold block" />
          )}
        </Link>
        <Link
          href="/hire"
          className={`relative bg-transparent border-0 cursor-pointer font-mono text-[11.5px] tracking-[0.14em] uppercase px-1 py-2.5 hover:text-ivory transition-colors ${
            isHire ? "text-ivory" : linkColor
          }`}
        >
          Hire
          {isHire && (
            <span className="absolute left-1 right-1 bottom-0.5 h-px bg-gold block" />
          )}
        </Link>
        <Link
          href="/apply/start"
          className={`ml-2 rounded-full px-5 py-2.5 cursor-pointer font-mono text-[11.5px] tracking-[0.1em] uppercase font-medium transition-colors ${
            inverted ? "bg-white text-red hover:bg-gold-hover" : "bg-ivory text-ink hover:bg-gold"
          }`}
        >
          Take a seat
        </Link>
      </div>
    </nav>
  );
}
