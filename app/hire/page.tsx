import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import { PROGRAM } from "@/lib/config";

export default function HirePage() {
  return (
    <div>
      <section
        className="border-b border-white/[0.07]"
        style={{ padding: "clamp(56px,8vw,110px) clamp(20px,4vw,56px)" }}
      >
        <div
          className="max-w-[1280px] mx-auto grid items-center"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "clamp(32px,5vw,72px)" }}
        >
          <div>
            <div className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-gold mb-6">For companies</div>
            <h1
              className="font-display font-semibold leading-[1.03] mb-6 max-w-[22ch]"
              style={{ fontSize: "clamp(32px,5vw,70px)", letterSpacing: "-0.035em" }}
            >
              Hire people who have already built it.{" "}
              <span className="text-gold">Or rewire the team you have.</span>
            </h1>
            <p className="max-w-[60ch] text-muted-100 mb-10" style={{ fontSize: "clamp(16px,1.2vw,18.5px)", lineHeight: 1.65 }}>
              Everyone in our room has shipped a working AI system into a real
              job — with approval gates, error handling, and a person still
              accountable for the output. You are not screening for
              enthusiasm. You are reading a build log.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <a
                href="mailto:hello@deservv.com?subject=Hiring%20from%20Deservv"
                className="bg-ivory text-ink rounded-full px-7 py-4 font-mono text-[12.5px] tracking-[0.1em] uppercase font-medium hover:bg-gold"
              >
                Request the talent list
              </a>
              <a
                href="mailto:hello@deservv.com?subject=Private%20cohort"
                className="border border-white/[0.18] text-ivory rounded-full px-7 py-4 font-mono text-[12.5px] tracking-[0.1em] uppercase hover:border-gold hover:text-gold"
              >
                Book a private cohort
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center" style={{ minHeight: "clamp(280px,46vw,420px)" }}>
            <div className="absolute rounded-full border border-dashed border-gold/[0.22]" style={{ width: "min(84%, 440px)", aspectRatio: "1" }} />
            <div className="absolute rounded-full border border-white/5" style={{ width: "min(64%, 336px)", aspectRatio: "1" }} />
            <svg
              viewBox="0 0 400 520"
              className="relative"
              style={{ width: "min(72%, 320px)", height: "auto", overflow: "visible" }}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-label="Samurai standing at rest, hand on a sheathed blade"
            >
              <g stroke="#d9b978" strokeWidth="1.6" opacity="0.75">
                <path d="M282 192 L296 262" />
                <path d="M264 272 L294 432" />
                <path d="M226 88 A32 32 0 0 1 230 132" />
              </g>
              <g stroke="#f3f1ec" strokeWidth="1.7">
                <ellipse cx="200" cy="66" rx="11" ry="7.5" />
                <path d="M200 74 L200 82" />
                <circle cx="200" cy="112" r="32" />
                <path d="M200 144 L200 160" />
                <path d="M128 184 L200 162 L272 184 L252 258 L148 258 Z" />
                <path d="M200 166 L200 258" />
                <path d="M148 258 L118 438 L282 438 L252 258" />
                <path d="M168 268 L160 432" />
                <path d="M200 268 L200 432" />
                <path d="M232 268 L240 432" />
                <path d="M154 438 L152 470 L182 470" />
                <path d="M246 438 L248 470 L218 470" />
                <path d="M158 202 L152 292 L172 362" />
                <path d="M244 202 L238 294 L226 342" />
                <path d="M132 392 L206 348" />
                <path d="M137 400 L211 356" />
                <path d="M206 348 L211 356" />
                <circle cx="172" cy="374" r="12" />
              </g>
              <g stroke="#e5342a">
                <path d="M128 394 L100 410" strokeWidth="6" />
                <path d="M126 383 L138 401" strokeWidth="2.6" />
              </g>
            </svg>
          </div>
        </div>
      </section>

      <section
        className="border-b border-white/[0.07] bg-ink-alt"
        style={{ padding: "clamp(56px,8vw,100px) clamp(20px,4vw,56px)" }}
      >
        <div className="max-w-[1280px] mx-auto">
          <Reveal as="h2" className="font-display font-semibold leading-[1.08] text-center mb-8 md:mb-12">
            <span style={{ fontSize: "clamp(26px,3.2vw,42px)", letterSpacing: "-0.03em" }}>
              Two ways in. <span className="text-gold">Same standard.</span>
            </span>
          </Reveal>
          <Reveal
            className="grid gap-px bg-white/10 border border-white/10"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
          >
            <div className="bg-ink p-7.5 md:p-11">
              <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-gold mb-3.5">Track A</div>
              <h3 className="font-display font-semibold mb-2.5" style={{ fontSize: "clamp(22px,2.4vw,30px)", letterSpacing: "-0.025em" }}>
                Hire from the room
              </h3>
              <p className="text-[15.5px] leading-[1.65] text-muted-100 mb-6.5">
                Professionals who finished the program and want to move. You
                see what they built before you see their CV.
              </p>
              <div className="flex flex-col border-t border-white/[0.08]">
                {[
                  "Shortlist with build logs, not keyword-matched resumes",
                  "Every candidate has shipped to real users at least once",
                  "Domain-matched: ops to ops, finance to finance",
                  "No placement fee on the first hire from a cohort",
                ].map((t, i, arr) => (
                  <div
                    key={t}
                    className={`py-3.5 text-[15px] text-muted-50 ${i < arr.length - 1 ? "border-b border-white/[0.08]" : ""}`}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-ink p-7.5 md:p-11 relative">
              <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-gold mb-3.5">Track B</div>
              <h3 className="font-display font-semibold mb-2.5" style={{ fontSize: "clamp(22px,2.4vw,30px)", letterSpacing: "-0.025em" }}>
                Private cohort for your team
              </h3>
              <p className="text-[15.5px] leading-[1.65] text-muted-100 mb-6.5">
                The same {PROGRAM.duration}, run against your workflows, your
                stack, your data policy. Capstones are your actual functions.
              </p>
              <div className="flex flex-col border-t border-white/[0.08]">
                {[
                  "Day one covers your data-handling rules before anyone touches a tool",
                  "Builds stay inside your environment and belong to you",
                  "One report to leadership: what is running, what it replaced",
                  "Per-seat pricing, volume tiers from 10 seats",
                ].map((t, i, arr) => (
                  <div
                    key={t}
                    className={`py-3.5 text-[15px] text-muted-50 ${i < arr.length - 1 ? "border-b border-white/[0.08]" : ""}`}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className="border-b border-white/[0.07]"
        style={{ padding: "clamp(56px,8vw,100px) clamp(20px,4vw,56px)" }}
      >
        <div className="max-w-[900px] mx-auto text-center">
          <div className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-gold mb-5">
            What a graduate has done
          </div>
          <Reveal as="h2" className="font-display font-semibold leading-[1.08] mb-8 md:mb-11">
            <span style={{ fontSize: "clamp(26px,3.4vw,44px)", letterSpacing: "-0.03em" }}>
              Not &ldquo;familiar with AI tools.&rdquo;
            </span>
          </Reveal>
          <Reveal
            className="grid gap-4 text-left"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
          >
            {[
              "An agent that clears an inbound queue and stops for human approval before anything sends.",
              "A reporting chain that pulls, analyses, writes the narrative and files itself weekly.",
              "An internal tool their team opens daily — shipped, iterated once from feedback.",
            ].map((t) => (
              <div key={t} className="border border-white/10 py-6.5 px-6">
                <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-gold mb-3">Built</div>
                <div className="text-[15.5px] leading-[1.6] text-ivory">{t}</div>
              </div>
            ))}
          </Reveal>
          <Reveal as="p" className="mx-auto max-w-[58ch] text-[16.5px] leading-[1.65] text-muted-100 mt-8 md:mt-10">
            Ask them to walk you through one of these on a call. That
            interview tells you more than any assessment you could buy.
          </Reveal>
        </div>
      </section>

      <section
        className="border-b border-white/[0.07] bg-ink-alt"
        style={{ padding: "clamp(56px,8vw,104px) clamp(20px,4vw,56px)" }}
      >
        <div
          className="max-w-[1280px] mx-auto grid items-end"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(28px,5vw,64px)" }}
        >
          <div>
            <div className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-gold mb-5">Next step</div>
            <Reveal as="h2" className="font-display font-semibold leading-[1.05] mb-4.5 max-w-[20ch]">
              <span style={{ fontSize: "clamp(28px,3.6vw,50px)", letterSpacing: "-0.03em" }}>
                One call. Bring the workflow that hurts most.
              </span>
            </Reveal>
            <Reveal as="p" className="max-w-[48ch] text-[16.5px] leading-[1.65] text-muted-100">
              Tell us the function and the tools. We come back with either
              three candidates who have built for it, or a cohort plan for the
              team already doing it.
            </Reveal>
          </div>
          <Reveal className="flex flex-col border-t border-white/10">
            <a
              href="mailto:hello@deservv.com?subject=Hiring%20from%20Deservv"
              className="flex justify-between items-baseline gap-5 py-5 border-b border-white/10 text-ivory hover:text-gold"
            >
              <span className="font-display font-medium" style={{ fontSize: "clamp(17px,1.8vw,22px)" }}>
                Request the talent list
              </span>
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-400">Email →</span>
            </a>
            <a
              href="mailto:hello@deservv.com?subject=Private%20cohort"
              className="flex justify-between items-baseline gap-5 py-5 border-b border-white/10 text-ivory hover:text-gold"
            >
              <span className="font-display font-medium" style={{ fontSize: "clamp(17px,1.8vw,22px)" }}>
                Book a private cohort
              </span>
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-400">Email →</span>
            </a>
            <div className="flex justify-between items-baseline gap-5 py-5">
              <span className="text-[15.5px] text-muted-100">Bengaluru · in person if you are local</span>
              <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-gold">{PROGRAM.cohort}</span>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
