"use client";

import { useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useNavTone } from "./NavToneContext";
import { useHomeReel } from "./HomeReelContext";
import { PROGRAM, money } from "@/lib/config";
import Logo from "./Logo";

declare global {
  interface Window {
    __deservvReelPlayed?: boolean;
  }
}

const YEARS = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

function yearColor(y: number) {
  if (y <= 2023) return "#2e2b27";
  if (y === 2024) return "#3b3833";
  return "#605d57";
}

const SPOTS: [string, string][] = [
  ["13%", "94%"],
  ["87%", "3%"],
  ["11%", "3%"],
  ["88%", "95%"],
  ["12%", "90%"],
];

const CUES = [
  { at: 7000, show: 0 },
  { at: 9200, show: 1 },
  { at: 11400, show: 2 },
  { at: 13600, show: 3 },
  { at: 15800, show: 4 },
];

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function resetStatement(el: HTMLElement) {
  el.style.opacity = "0";
  el.style.pointerEvents = "none";
  el.querySelectorAll<HTMLElement>("[data-line] > span").forEach((s) => {
    s.style.transition = "none";
    s.style.transform = "translateY(110%)";
  });
  el.querySelectorAll<HTMLElement>("[data-aline]").forEach((s) => {
    s.style.transition = "none";
    s.style.opacity = "0";
    s.style.transform = "translate(-34%, 12%)";
  });
  el.querySelectorAll<HTMLElement>("[data-rule]").forEach((r) => {
    r.style.transition = "none";
    r.style.transform = "scaleX(0)";
  });
}

function enterStatement(el: HTMLElement) {
  void el.offsetHeight;
  el.style.opacity = "1";
  el.style.pointerEvents = "auto";
  el.querySelectorAll<HTMLElement>("[data-line] > span").forEach((s, i) => {
    s.style.transition = "transform 700ms cubic-bezier(0.16,1,0.3,1)";
    s.style.transitionDelay = i * 120 + "ms";
    s.style.transform = "none";
  });
  el.querySelectorAll<HTMLElement>("[data-aline]").forEach((s, i) => {
    s.style.transition = "transform 700ms cubic-bezier(0.16,1,0.3,1), opacity 400ms ease-out";
    s.style.transitionDelay = i * 90 + "ms";
    s.style.opacity = "1";
    s.style.transform = "none";
  });
  el.querySelectorAll<HTMLElement>("[data-rule]").forEach((r) => {
    r.style.transition = "transform 600ms cubic-bezier(0.16,1,0.3,1)";
    r.style.transitionDelay = "90ms";
    r.style.transform = "scaleX(1)";
  });
}

function LineFrame({
  ref,
  index,
  invert,
  lines,
}: {
  ref: React.Ref<HTMLDivElement>;
  index: number;
  invert?: boolean;
  lines: { text: string; color?: string }[];
}) {
  return (
    <div
      ref={ref}
      data-frame={index}
      {...(invert ? { "data-invert": "1" } : {})}
      className="absolute inset-0 grid place-items-center px-5 md:px-20"
      style={{ opacity: 0 }}
    >
      <div
        className="w-full max-w-[1180px] font-display font-bold uppercase"
        style={{
          letterSpacing: "-0.035em",
          lineHeight: invert ? 0.94 : 0.96,
          fontSize: invert ? "clamp(40px,8.6vw,140px)" : "clamp(34px,6.6vw,104px)",
          color: invert ? "#fff" : undefined,
        }}
      >
        {lines.map((line, i) => (
          <div key={i} data-line style={{ overflow: "hidden", paddingBottom: "0.04em" }}>
            <span style={{ display: "block", color: line.color }}>{line.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AngledFrame({
  ref,
  index,
  heading,
  ruleWidth,
  subLines,
}: {
  ref: React.Ref<HTMLDivElement>;
  index: number;
  heading: string;
  ruleWidth: string;
  subLines: string[];
}) {
  return (
    <div
      ref={ref}
      data-frame={index}
      data-angled="1"
      className="absolute inset-0 grid place-items-center px-5 md:px-20"
      style={{ opacity: 0 }}
    >
      <div className="w-full max-w-[1180px]">
        <div
          className="flex flex-col font-display font-bold uppercase leading-none"
          style={{ transform: "rotate(-11deg)", transformOrigin: "left center", gap: "0.06em", letterSpacing: "-0.03em" }}
        >
          <div data-aline style={{ fontSize: "clamp(30px,5.6vw,88px)" }}>
            {heading}
          </div>
          <div
            data-rule
            style={{ height: 2, background: "#e5342a", transformOrigin: "left center", width: ruleWidth, margin: "0.14em 0" }}
          />
          {subLines.map((l, i) => (
            <div key={i} data-aline style={{ fontSize: "clamp(20px,3vw,46px)", color: "#b9b6ae" }}>
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomeReel() {
  const router = useRouter();
  const { setInverted: setNavInverted } = useNavTone();
  const { registerReplay, navLogoRef, navLinksRef } = useHomeReel();

  const coverRef = useRef<HTMLDivElement>(null);
  const flyMarkRef = useRef<HTMLDivElement>(null);
  const accentSquareRef = useRef<HTMLDivElement>(null);
  const reelSectionRef = useRef<HTMLElement>(null);
  const yearFrameRef = useRef<HTMLDivElement>(null);
  const heroLabelRef = useRef<HTMLDivElement>(null);
  const heroSubRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const rollRefs = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const frameRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null]);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onScrollRef = useRef<(() => void) | null>(null);
  const activeFrameRef = useRef<HTMLElement | null>(null);
  const exitTimersRef = useRef(new Map<HTMLElement, ReturnType<typeof setTimeout>>());
  const rollMainRef = useRef<Animation | null>(null);
  const skipReelRef = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    function timer(fn: () => void, ms: number) {
      timersRef.current.push(setTimeout(fn, ms));
    }

    function detach() {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
      if (onScrollRef.current) {
        window.removeEventListener("scroll", onScrollRef.current, true);
        document.removeEventListener("scroll", onScrollRef.current, true);
        onScrollRef.current = null;
      }
    }

    function setInverted(on: boolean) {
      if (reelSectionRef.current) reelSectionRef.current.style.background = on ? "#e5342a" : "transparent";
      setNavInverted(on);
    }

    function exitStatement(el: HTMLElement) {
      el.querySelectorAll<HTMLElement>("[data-line] > span").forEach((s) => {
        s.style.transition = "transform 500ms cubic-bezier(0.7,0,0.84,0)";
        s.style.transitionDelay = "0ms";
        s.style.transform = "translateY(-110%)";
      });
      el.querySelectorAll<HTMLElement>("[data-aline]").forEach((s) => {
        s.style.transition = "transform 500ms cubic-bezier(0.7,0,0.84,0), opacity 300ms linear";
        s.style.transitionDelay = "0ms";
        s.style.opacity = "0";
        s.style.transform = "translate(38%, -14%)";
      });
      el.querySelectorAll<HTMLElement>("[data-rule]").forEach((r) => {
        r.style.transition = "transform 400ms cubic-bezier(0.7,0,0.84,0)";
        r.style.transform = "scaleX(0)";
      });
      const existing = exitTimersRef.current.get(el);
      if (existing) clearTimeout(existing);
      const t = setTimeout(() => {
        exitTimersRef.current.delete(el);
        if (el !== activeFrameRef.current) resetStatement(el);
      }, 520);
      exitTimersRef.current.set(el, t);
    }

    function paintFinalYear() {
      document.querySelectorAll<HTMLElement>('[data-roll][data-ghost="0"] [data-final]').forEach((el) => {
        el.style.transition = "none";
        el.style.color = "#e5342a";
      });
    }

    function exitYearFrame() {
      const yf = yearFrameRef.current;
      if (!yf) return;
      yf.style.transition = "transform 700ms cubic-bezier(0.7,0,0.84,0), opacity 450ms linear";
      yf.style.transform = "translateY(-16vh)";
      yf.style.opacity = "0";
      timer(() => {
        yf.style.visibility = "hidden";
      }, 760);
    }

    function activate(i: number) {
      const frames = frameRefs.current;
      const next = frames[i];
      if (!next) return;
      const prev = activeFrameRef.current;
      activeFrameRef.current = next;
      frames.forEach((f) => {
        if (!f) return;
        if (f === next) f.setAttribute("data-active", "1");
        else f.removeAttribute("data-active");
      });
      if (prev && prev !== next) exitStatement(prev);
      const pending = exitTimersRef.current.get(next);
      if (pending) {
        clearTimeout(pending);
        exitTimersRef.current.delete(next);
      }
      resetStatement(next);
      enterStatement(next);
      setInverted(next.hasAttribute("data-invert"));
      const sq = accentSquareRef.current;
      if (sq) {
        const p = SPOTS[i % SPOTS.length];
        sq.style.top = p[0];
        sq.style.left = p[1];
        sq.style.background = next.hasAttribute("data-invert") ? "#fff" : "#e5342a";
        sq.style.opacity = "1";
      }
      if (i === frames.length - 1) {
        const skip = skipRef.current;
        if (skip) {
          skip.style.opacity = "0";
          skip.style.pointerEvents = "none";
        }
      }
    }

    function rollYears() {
      const cols = rollRefs.current.filter(Boolean) as HTMLElement[];
      if (!cols.length) return;
      const END = -11,
        OVER = -11.33,
        DUR = 2600,
        DELAY = 3400;
      const TRAIL = [0, 0.34, 0.68];
      if (reducedMotion() || !cols[0].animate) {
        cols.forEach((c, i) => {
          c.style.transform = `translateY(${END}em)`;
          if (i) c.style.opacity = "0";
        });
        paintFinalYear();
        return;
      }
      cols.forEach((c) => {
        c.style.willChange = "transform";
      });
      const frames = (lag: number): Keyframe[] => [
        { transform: "translateY(0em)", easing: "cubic-bezier(0.22, 1, 0.36, 1)", offset: 0 },
        { transform: `translateY(${OVER * 0.08 + lag}em)`, offset: 0.08 },
        { transform: `translateY(${OVER * 0.4 + lag}em)`, offset: 0.4 },
        { transform: `translateY(${OVER * 0.7 + lag * 0.45}em)`, offset: 0.7 },
        { transform: `translateY(${OVER}em)`, easing: "cubic-bezier(0.33, 0, 0.67, 1)", offset: 0.915 },
        { transform: `translateY(${END}em)`, offset: 1 },
      ];
      let main: Animation | null = null;
      cols.forEach((c, i) => {
        const a = c.animate(frames(TRAIL[i] || 0), { duration: DUR, delay: DELAY, fill: "both", easing: "linear" });
        if (i === 0) main = a;
        if (i > 0) {
          const base = i === 1 ? 0.42 : 0.18;
          c.animate(
            [
              { opacity: base, offset: 0 },
              { opacity: base, offset: 0.7 },
              { opacity: 0, offset: 1 },
            ],
            { duration: DUR, delay: DELAY, fill: "both" }
          );
        }
      });
      rollMainRef.current = main;
      const settle = () => {
        cols.forEach((c) => {
          c.style.willChange = "auto";
        });
        paintFinalYear();
      };
      timer(settle, DELAY + DUR);
      if (main) {
        (main as Animation).onfinish = settle;
        const anyMain = main as Animation & { finished?: Promise<Animation> };
        if (anyMain.finished && anyMain.finished.then) anyMain.finished.then(settle, () => {});
      }
    }

    function watchAbort() {
      const kill = () => {
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        if (y > 40) skipReel();
      };
      onScrollRef.current = kill;
      window.addEventListener("scroll", kill, { passive: true, capture: true });
      document.addEventListener("scroll", kill, { passive: true, capture: true });
      pollRef.current = setInterval(kill, 120);
    }

    function skipReel() {
      detach();
      settleFinal();
    }
    skipReelRef.current = skipReel;

    function settleFinal() {
      const yf = yearFrameRef.current;
      if (yf) {
        yf.style.transition = "none";
        yf.style.opacity = "0";
        yf.style.visibility = "hidden";
      }
      const cols = rollRefs.current.filter(Boolean) as HTMLElement[];
      cols.forEach((c, i) => {
        if (rollMainRef.current) {
          try {
            c.getAnimations().forEach((a) => a.finish());
          } catch {
            /* noop */
          }
        }
        if (i) c.style.opacity = "0";
      });
      paintFinalYear();
      const chrome = document.querySelector<HTMLElement>("[data-chrome]");
      if (chrome) chrome.style.display = "flex";
      const mark = flyMarkRef.current;
      if (mark) mark.style.display = "none";
      const cover = coverRef.current;
      if (cover) {
        cover.style.transition = "none";
        cover.style.opacity = "0";
        cover.style.visibility = "hidden";
      }
      const logo = navLogoRef.current;
      if (logo) logo.style.visibility = "visible";
      const links = navLinksRef.current;
      if (links) {
        Array.from(links.children).forEach((el) => {
          (el as HTMLElement).style.opacity = "1";
          (el as HTMLElement).style.transform = "none";
        });
      }
      const skip = skipRef.current;
      if (skip) {
        skip.style.opacity = "0";
        skip.style.pointerEvents = "none";
      }
      const frames = frameRefs.current;
      frames.forEach((f) => {
        if (!f) return;
        const t = exitTimersRef.current.get(f);
        if (t) {
          clearTimeout(t);
          exitTimersRef.current.delete(f);
        }
        resetStatement(f);
      });
      const last = frames[frames.length - 1];
      if (last) {
        last.setAttribute("data-active", "1");
        last.style.opacity = "1";
        last.style.pointerEvents = "auto";
        last.querySelectorAll<HTMLElement>("[data-line] > span").forEach((sp) => {
          sp.style.transition = "none";
          sp.style.transform = "none";
        });
        last.querySelectorAll<HTMLElement>("[data-aline]").forEach((sp) => {
          sp.style.transition = "none";
          sp.style.opacity = "1";
          sp.style.transform = "none";
        });
        last.querySelectorAll<HTMLElement>("[data-rule]").forEach((r) => {
          r.style.transition = "none";
          r.style.transform = "scaleX(1)";
        });
        activeFrameRef.current = last;
        setInverted(last.hasAttribute("data-invert"));
      }
      const sq = accentSquareRef.current;
      if (sq) {
        sq.style.opacity = "1";
        sq.style.background = "#e5342a";
      }
    }

    function runLoadSequence() {
      const mark = flyMarkRef.current;
      const logo = navLogoRef.current;
      const links = navLinksRef.current;
      const label = heroLabelRef.current;
      const sub = heroSubRef.current;
      const items = links ? (Array.from(links.children) as HTMLElement[]) : [];

      const finish = () => {
        if (mark) mark.style.display = "none";
        if (logo) logo.style.visibility = "visible";
        items.forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
        if (label) label.style.opacity = "1";
        if (sub) sub.style.opacity = "1";
        const sq = accentSquareRef.current;
        if (sq) sq.style.opacity = "1";
      };

      if (reducedMotion() || !mark || !logo) {
        finish();
        return;
      }

      logo.style.visibility = "hidden";
      items.forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(8px)";
      });

      const lr = logo.getBoundingClientRect();
      mark.style.transformOrigin = "left top";
      mark.style.left = lr.left + "px";
      mark.style.top = lr.top + "px";
      const mr = mark.getBoundingClientRect();
      const S = Math.min(3.4, Math.max(1.8, window.innerWidth / 620));
      const dx = window.innerWidth / 2 - (mr.width * S) / 2 - lr.left;
      const dy = window.innerHeight / 2 - (mr.height * S) / 2 - lr.top;

      mark.style.transform = `translate(${dx}px,${dy}px) scale(${S * 0.94})`;

      timer(() => {
        mark.style.transition = "opacity 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)";
        mark.style.opacity = "1";
        mark.style.transform = `translate(${dx}px,${dy}px) scale(${S})`;
      }, 300);

      timer(() => {
        mark.style.transition = "transform 900ms cubic-bezier(0.65,0,0.35,1)";
        mark.style.transform = "none";
      }, 1800);

      timer(() => {
        logo.style.visibility = "visible";
        mark.style.display = "none";
      }, 2720);

      items.forEach((el, i) => {
        timer(() => {
          el.style.transition = "opacity 400ms ease-out, transform 400ms ease-out";
          el.style.opacity = "1";
          el.style.transform = "none";
        }, 2400 + i * 70);
      });

      timer(() => {
        if (label) label.style.animation = "labelIn 500ms ease-out forwards";
      }, 2900);
      timer(() => {
        if (sub) sub.style.animation = "labelIn 500ms ease-out forwards";
      }, 3150);
      timer(() => {
        const skip = skipRef.current;
        if (skip) skip.style.opacity = "1";
      }, 1000);
    }

    function runReel() {
      timer(exitYearFrame, 7000);
      CUES.forEach((c) => {
        timer(() => activate(c.show), c.at);
      });
    }

    function resetReelChrome() {
      const cover = coverRef.current;
      if (cover) {
        cover.style.transition = "none";
        cover.style.visibility = "visible";
        cover.style.opacity = "1";
        cover.style.animation = "none";
        void cover.offsetWidth;
        cover.style.animation = "coverOut 500ms ease-out forwards";
      }
      const yf = yearFrameRef.current;
      if (yf) {
        yf.style.transition = "none";
        yf.style.visibility = "visible";
        yf.style.opacity = "1";
      }
      rollRefs.current.forEach((c) => {
        if (!c) return;
        try {
          c.getAnimations().forEach((a) => a.cancel());
        } catch {
          /* noop */
        }
        c.style.opacity = "";
        c.style.transform = "";
      });
      document.querySelectorAll<HTMLElement>("[data-roll] [data-final]").forEach((el) => {
        el.style.transition = "";
        el.style.color = "";
      });
      const skip = skipRef.current;
      if (skip) {
        skip.style.opacity = "0";
        skip.style.pointerEvents = "";
      }
      const mark = flyMarkRef.current;
      if (mark) {
        mark.style.display = "";
        mark.style.transition = "none";
        mark.style.transform = "none";
      }
      const sq = accentSquareRef.current;
      if (sq) sq.style.opacity = "0";
      const label = heroLabelRef.current;
      if (label) {
        label.style.animation = "none";
        label.style.opacity = "0";
      }
      const sub = heroSubRef.current;
      if (sub) {
        sub.style.animation = "none";
        sub.style.opacity = "0";
      }
    }

    function mount(isReplay: boolean) {
      detach();
      frameRefs.current.forEach((f) => {
        if (f) resetStatement(f);
      });
      activeFrameRef.current = null;

      const seen = window.__deservvReelPlayed === true && !isReplay;
      if (isReplay) resetReelChrome();

      if (reducedMotion() || seen) {
        settleFinal();
        return;
      }
      window.__deservvReelPlayed = true;
      runLoadSequence();
      rollYears();
      runReel();
      watchAbort();
    }

    registerReplay(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
      mount(true);
    });

    const isReplayParam = window.location.search.includes("replay=1");
    mount(isReplayParam);
    if (isReplayParam) router.replace("/");

    return () => detach();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        ref={coverRef}
        data-cover="1"
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 90, background: "#0a0908", animation: "coverOut 500ms ease-out forwards" }}
      />
      <div
        ref={flyMarkRef}
        data-fly-mark="1"
        className="fixed pointer-events-none whitespace-nowrap"
        style={{ zIndex: 91, top: 0, left: 0, opacity: 0, transformOrigin: "left center" }}
      >
        <Logo />
      </div>
      <div
        ref={accentSquareRef}
        data-accent-square="1"
        className="fixed pointer-events-none"
        style={{
          zIndex: 40,
          top: "32%",
          left: "84%",
          width: 9,
          height: 9,
          background: "#e5342a",
          opacity: 0,
          transition: "top 900ms cubic-bezier(0.16, 1, 0.3, 1), left 900ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms linear",
        }}
      />

      <section
        ref={reelSectionRef}
        data-reel="1"
        className="relative h-[calc(100vh-70px)] min-h-[470px] overflow-hidden border-b border-white/[0.07]"
      >
        <div
          ref={yearFrameRef}
          data-yearframe="1"
          className="absolute inset-0 flex flex-col justify-center items-center"
          style={{ padding: "clamp(78px,9vh,116px) clamp(20px,4vw,56px) clamp(34px,5vh,64px)" }}
        >
          <div
            ref={heroLabelRef}
            data-hero-label="1"
            className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-gold text-center"
            style={{ opacity: 0, marginBottom: "clamp(16px,3vh,34px)" }}
          >
            Twelve years of upskilling
          </div>
          <div
            data-roll-window="1"
            className="relative w-full overflow-hidden font-display font-bold text-center"
            style={{ height: "3em", fontSize: "clamp(48px, min(15vw, 17vh), 250px)", lineHeight: 1, letterSpacing: "-0.045em" }}
          >
            {[0, 1, 2].map((g) => (
              <div
                key={g}
                ref={(el) => {
                  rollRefs.current[g] = el;
                }}
                data-roll="1"
                data-ghost={g}
                className="absolute inset-0"
                style={{ opacity: g === 0 ? 1 : g === 1 ? 0.42 : 0.18 }}
              >
                {YEARS.map((y) => (
                  <div
                    key={y}
                    {...(y === 2026 ? { "data-final": "1" } : {})}
                    style={{ height: "1em", lineHeight: "1em", color: yearColor(y) }}
                  >
                    {y}
                  </div>
                ))}
                <div style={{ height: "1em", lineHeight: "1em" }} />
              </div>
            ))}
          </div>
          <div
            ref={heroSubRef}
            data-hero-sub="1"
            className="max-w-[44ch] mx-auto text-center text-muted-100 leading-[1.7] xs:leading-[1.6]"
            style={{ opacity: 0, margin: "clamp(18px,3vh,38px) auto 0", fontSize: "clamp(15px,1.4vw,19px)" }}
          >
            Every one of those years, someone sold you a certificate. This one, you build the systems instead.
          </div>
        </div>

        <LineFrame
          index={0}
          ref={(el) => {
            frameRefs.current[0] = el;
          }}
          lines={[
            { text: "Twelve years" },
            { text: "of courses." },
            { text: "Nothing changed", color: "#605d57" },
            { text: "on Monday.", color: "#605d57" },
          ]}
        />
        <LineFrame
          index={1}
          invert
          ref={(el) => {
            frameRefs.current[1] = el;
          }}
          lines={[{ text: "So we stopped" }, { text: "teaching." }]}
        />
        <AngledFrame
          index={2}
          ref={(el) => {
            frameRefs.current[2] = el;
          }}
          heading="New method."
          ruleWidth="62%"
          subLines={["Build, don't watch.", "Fifteen days, not six months."]}
        />
        <AngledFrame
          index={3}
          ref={(el) => {
            frameRefs.current[3] = el;
          }}
          heading="New price."
          ruleWidth="54%"
          subLines={[`${money(PROGRAM.fee)}, not three lakh.`, "One payment. No EMI."]}
        />
        <LineFrame
          index={4}
          ref={(el) => {
            frameRefs.current[4] = el;
          }}
          lines={[
            { text: "Eight systems" },
            { text: "already running", color: "#d9b978" },
            { text: "inside your job." },
          ]}
        />

        <button
          ref={skipRef}
          data-skip="1"
          onClick={() => skipReelRef.current()}
          className="absolute z-[5] bg-ink/50 text-muted-50 border border-white/[0.18] rounded-full cursor-pointer font-mono text-[10.5px] tracking-[0.14em] uppercase hover:text-ivory hover:border-gold"
          style={{
            right: "clamp(16px, 3vw, 34px)",
            bottom: "clamp(16px, 3vh, 30px)",
            opacity: 0,
            padding: "9px 18px",
            transition: "opacity 300ms linear",
          }}
        >
          Skip intro
        </button>
      </section>
    </>
  );
}
