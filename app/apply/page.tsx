import Link from "next/link";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import CurriculumAccordion from "@/components/CurriculumAccordion";
import InstructorAudio from "@/components/InstructorAudio";
import { PROGRAM, money, feeSplit } from "@/lib/config";

const feeLabel = money(PROGRAM.fee);
const split = feeSplit(PROGRAM.fee);

export default function ApplyPage() {
  return (
    <div>
      <section
        className="border-b border-white/[0.07]"
        style={{ padding: "clamp(48px,7vw,96px) clamp(20px,4vw,56px)" }}
      >
        <div
          className="max-w-[1280px] mx-auto grid items-center"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(32px,5vw,72px)" }}
        >
          <div className="relative">
            <div className="relative w-full aspect-[4/5] border border-white/[0.12] bg-white/[0.03] flex items-center justify-center">
              <span className="font-mono text-[11px] text-muted-500 text-center px-6">
                Vikas Patel — portrait
              </span>
            </div>
            <div className="absolute -right-3 -bottom-3 bg-ink border border-gold/35 px-4 py-3 font-mono text-[10.5px] tracking-[0.14em] uppercase text-gold">
              Teaches every session himself
            </div>
          </div>
          <div>
            <div className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-gold mb-4.5">
              Your instructor
            </div>
            <h1
              className="font-display font-semibold leading-[1.03] mb-4.5"
              style={{ fontSize: "clamp(34px,4.6vw,64px)", letterSpacing: "-0.035em" }}
            >
              Vikas Patel
            </h1>
            <p className="max-w-[50ch] text-[17px] leading-[1.65] text-muted-100 mb-7.5">
              Eight years writing software that cannot fall over — high-traffic
              gaming platforms, financial systems, and now a global learning
              platform. He is not a trainer who read about AI. He is an
              engineer who ships with it daily and will build in front of you,
              dead ends included.
            </p>
            <div className="flex flex-col border-t border-white/[0.08]">
              {[
                ["Now", "Product Engineer, Coursera — Bengaluru"],
                ["Before", "Games24x7 · Goldman Sachs · Extramarks Education"],
                ["Experience", "8 years — backend, scale, systems design"],
                ["Competitive", "4★ CodeChef"],
                ["Education", "B.Tech, Computer Science — IIT Guwahati"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-5 py-3.5 border-b border-white/[0.08]">
                  <span className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-400">
                    {label}
                  </span>
                  <span className="text-[15.5px] text-right">{value}</span>
                </div>
              ))}
            </div>
            <InstructorAudio />
          </div>
        </div>
      </section>

      <section
        className="relative border-b border-white/[0.07] bg-ink-alt overflow-hidden"
        style={{ padding: "clamp(60px,8vw,110px) clamp(20px,4vw,56px)" }}
      >
        <div className="absolute -top-[140px] -right-[140px] w-[460px] h-[460px] rounded-full border border-dashed border-gold/[0.12] pointer-events-none" />
        <div
          className="max-w-[1280px] mx-auto grid items-center relative"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "clamp(32px,5vw,72px)" }}
        >
          <div>
            <div className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-gold mb-5">The problem</div>
            <Reveal as="h2" className="font-display font-semibold leading-[1.06] mb-6">
              <span style={{ fontSize: "clamp(30px,4vw,54px)", letterSpacing: "-0.03em" }}>
                Your job will not make you AI-first. <span className="text-gold">Nothing will</span> — unless you force it.
              </span>
            </Reveal>
            <Reveal as="p" className="max-w-[52ch] text-[17px] leading-[1.65] text-muted-100 mb-4.5">
              You already read the threads. You already tried a prompt between
              two meetings. That energy is real — but scattered effort never
              closes this gap.{" "}
              <span className="text-ivory">
                You need a forcing function and someone senior watching your
                screen.
              </span>
            </Reveal>
            <Reveal as="p" className="max-w-[52ch] text-[17px] leading-[1.65] text-muted-100">
              The distance between <em>using AI</em> and{" "}
              <span className="text-gold">building with it as a working part of your job</span> does not
              close gradually. It closes in a short, compressed run of
              supervised execution.
            </Reveal>
          </div>
          <Reveal className="relative w-full aspect-[16/10] border border-white/10 bg-white/[0.03] flex items-center justify-center">
            <span className="font-mono text-[11px] text-muted-500 text-center px-6">
              Live session still — screen share, hands on keyboard
            </span>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="w-[62px] h-[62px] rounded-full bg-ink/60 border border-white/40 flex items-center justify-center text-white text-[15px]">
                ▶
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        className="border-b border-white/[0.07]"
        style={{ padding: "clamp(60px,8vw,110px) clamp(20px,4vw,56px)" }}
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-gold mb-5">The curriculum</div>
          <Reveal
            as="h2"
            className="font-display font-semibold leading-[1.06] max-w-[24ch]"
            style={{ fontSize: "clamp(30px,4vw,54px)", letterSpacing: "-0.03em", margin: "0 0 22px", textWrap: "balance" }}
          >
            Eight levels. Each one stands on the last.
          </Reveal>
          <Reveal as="p" className="max-w-[58ch] text-[17px] leading-[1.65] text-muted-100 mb-9 md:mb-14">
            You start by changing how you look at your own week and finish
            having shipped an application your team uses. Open any level.
          </Reveal>

          <Reveal className="flex flex-col gap-1.5 items-center mb-10 md:mb-16">
            {[
              ["46%", "min-w-[200px]", "Business applications", "border-gold/50 bg-gold/10 text-gold"],
              ["58%", "min-w-[220px]", "Agents & automation", "border-white/[0.12] text-muted-50"],
              ["70%", "min-w-[240px]", "Skills · MCP · integrations", "border-white/[0.12] text-muted-50"],
              ["82%", "min-w-[260px]", "Efficient use of LLMs & assistants", "border-white/10 text-muted-200"],
              ["94%", "", "Prompting & context management", "border-white/[0.08] text-muted-300"],
              ["100%", "", "AI builder mindset", "border-white/[0.07] text-muted-400"],
            ].map(([w, minw, label, cls]) => (
              <div
                key={label}
                className={`text-center py-2.5 border font-mono text-[11px] tracking-[0.12em] uppercase ${minw} ${cls}`}
                style={{ width: w as string }}
              >
                {label}
              </div>
            ))}
          </Reveal>

          <CurriculumAccordion />
        </div>
      </section>

      <section
        className="border-b border-white/[0.07] bg-ink-alt"
        style={{ padding: "clamp(60px,8vw,110px) clamp(20px,4vw,56px)" }}
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-gold mb-5">
            What you actually walk away holding
          </div>
          <Reveal
            as="h2"
            className="font-display font-semibold leading-[1.06] max-w-[26ch]"
            style={{ fontSize: "clamp(30px,4vw,54px)", letterSpacing: "-0.03em", margin: "0 0 22px", textWrap: "balance" }}
          >
            No notes. No slide folder.{" "}
            <span className="text-gold">Systems that are already running.</span>
          </Reveal>
          <Reveal as="p" className="max-w-[58ch] text-[17px] leading-[1.65] text-muted-100 mb-9 md:mb-13">
            Your manager will not be told you attended something. They will
            notice a report that writes itself, a queue that never backs up,
            and a tool your team opens every morning.
          </Reveal>
          <Reveal
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
          >
            {[
              ["8", "Levels, each ending in a build"],
              [PROGRAM.duration, "Start to shipped capstone"],
              ["1:1", "Instructor reviews your build"],
              ["∞", "Room access after you finish"],
            ].map(([big, label]) => (
              <div key={label} className="border border-white/10 bg-white/[0.02] py-8.5 px-6.5 text-center">
                <div
                  className="font-display font-semibold text-gold leading-none"
                  style={{ fontSize: "clamp(38px,4vw,52px)", letterSpacing: "-0.03em" }}
                >
                  {big}
                </div>
                <div className="font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-200 mt-3.5">
                  {label}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section
        className="border-b border-white/[0.07]"
        style={{ padding: "clamp(60px,8vw,110px) clamp(20px,4vw,56px)" }}
      >
        <div className="max-w-[1000px] mx-auto">
          <div className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-gold mb-5 text-center">
            Where your money goes
          </div>
          <Reveal as="h2" className="font-display font-semibold leading-[1.06] mb-5 text-center">
            <span style={{ fontSize: "clamp(30px,4vw,54px)", letterSpacing: "-0.03em" }}>
              {feeLabel}. <span className="text-gold">Here is every rupee of it.</span>
            </span>
          </Reveal>
          <Reveal as="p" className="max-w-[56ch] mx-auto text-[17px] leading-[1.65] text-muted-100 text-center mb-11 md:mb-17">
            Most of the fee leaves us and goes to the person standing in front
            of you. We are not funding a sales floor, a celebrity ad, or a
            campus.
          </Reveal>

          <Reveal className="flex flex-col gap-4.5 items-center">
            <div className="w-full flex items-center gap-5">
              <div
                className="w-full px-6 py-5 border border-gold/40 flex justify-between items-baseline gap-3"
                style={{ background: "linear-gradient(90deg, rgba(217,185,120,0.22), rgba(217,185,120,0.08))" }}
              >
                <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-gold">You pay</span>
                <span className="font-display font-semibold" style={{ fontSize: "clamp(24px,3vw,34px)", letterSpacing: "-0.02em" }}>
                  {feeLabel}
                </span>
              </div>
            </div>

            {[
              ["Remaining after the instructor", "100%", split.instructor, "Instructor — 55%", "His prep, his live hours, his review of your build.", "border-white/[0.12] bg-white/[0.03]"],
              ["Remaining", "84%", split.tools, "Tools & API credits — 15%", "Paid keys and tool access for the sessions that need them, so nobody sits out a build.", "border-white/10 bg-white/[0.025]"],
              ["Remaining", "68%", split.content, "Content & delivery — 15%", "Session recording, starter files, the role-specific problem statements, the catch-up kit.", "border-white/10 bg-white/[0.02]"],
              ["Remaining", "50%", split.community, "Community & meetups — 8%", "The Bengaluru room, every month, for as long as you want to keep coming.", "border-white/10 bg-white/[0.02]"],
              ["Left over", "34%", split.ops, "Platform & payment fees — 7%", "Gateway charges, hosting, the boring plumbing.", "border-red/35 bg-red/[0.07] text-red"],
            ].map(([tag, w, amount, name, desc, cls], i) => (
              <div
                key={name as string}
                data-wf="1"
                className="w-full grid items-center gap-3.5 md:gap-8.5"
                style={{ gridTemplateColumns: "minmax(0, 1fr) minmax(160px, 240px)" }}
              >
                <div className={i === 0 ? "w-full flex justify-end" : "w-full flex justify-end"}>
                  <div
                    className={`px-5 py-4 border font-mono text-[11.5px] tracking-[0.1em] uppercase text-muted-200 ${cls}`}
                    style={{ width: i === 0 ? "100%" : (w as string), minWidth: i === 0 ? undefined : "120px" }}
                  >
                    {tag}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-display text-xl font-semibold text-gold">{amount}</span>
                  <span className="font-mono text-[10.5px] tracking-[0.12em] uppercase text-muted-400">{name}</span>
                  <span className="text-sm leading-[1.55] text-muted-200">{desc}</span>
                </div>
              </div>
            ))}
          </Reveal>

          <p className="mt-8 md:mt-11 text-center font-mono text-[11px] tracking-[0.1em] text-muted-600">
            No sales team. No ad budget. No EMI trap. Indicative allocation —
            revised each cohort.
          </p>
        </div>
      </section>

      <section className="border-b border-white/[0.07] bg-ink-alt">
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))" }}>
          <div className="relative min-h-[460px] bg-white/[0.03] flex items-center justify-center">
            <span className="font-mono text-[11px] text-muted-500 text-center px-6">
              The last cohort — one honest photo of the room
            </span>
            <div className="absolute left-0 bottom-0 px-5 py-4 font-mono text-[10.5px] tracking-[0.16em] uppercase text-white/78 pointer-events-none">
              Cohort 01 · Bengaluru
            </div>
          </div>
          <div className="py-12 md:py-22 px-6 md:px-16">
            <div className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-gold mb-5">Is this you?</div>
            <h2
              className="font-display font-semibold leading-[1.06] mb-4"
              style={{ fontSize: "clamp(28px,3.4vw,46px)", letterSpacing: "-0.03em" }}
            >
              This isn&apos;t for everyone. <span className="text-gold">Good.</span>
            </h2>
            <p className="max-w-[46ch] text-[16.5px] leading-[1.65] text-muted-100 mb-8">
              {PROGRAM.seats} seats per cohort, because one instructor can only
              watch that many screens properly. Once you are in, Vikas reviews
              your build himself.
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                "You have a real job with real repetition in it — not a hypothetical use case",
                "You will keep your laptop open and build, not watch with the camera off",
                "You want feedback that is honest, not comfortable",
                "You would rather be judged on what you shipped than what you attended",
              ].map((t) => (
                <div key={t} className="flex gap-3.5 items-start border border-white/10 bg-white/[0.02] py-4 px-4.5">
                  <span className="text-gold shrink-0">✓</span>
                  <span className="text-[15.5px] leading-[1.55]">{t}</span>
                </div>
              ))}
              <div className="flex gap-3.5 items-start border border-red/30 py-4 px-4.5" style={{ background: "rgba(229,52,42,0.05)" }}>
                <span className="text-red shrink-0">✕</span>
                <span className="text-[15.5px] leading-[1.55] text-muted-100">
                  You are collecting one more certificate for the profile.
                  Please don&apos;t apply.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="border-b border-white/[0.07]"
        style={{ padding: "clamp(60px,8vw,110px) clamp(20px,4vw,56px)" }}
      >
        <div className="max-w-[720px] mx-auto">
          <div className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-gold mb-5">Admission</div>
          <h2
            className="font-display font-semibold leading-[1.06] mb-3.5"
            style={{ fontSize: "clamp(28px,3.6vw,48px)", letterSpacing: "-0.03em" }}
          >
            Three steps. Under three minutes.
          </h2>
          <p className="text-[16.5px] leading-[1.65] text-muted-100 mb-8 md:mb-11">
            {PROGRAM.cohort}. Six objective questions, an instant fit report,
            then your seat. No interview call, no waiting on a reply.
          </p>

          <div data-steps="1" className="grid grid-cols-3 gap-3 mb-8 md:mb-10">
            <div className="flex flex-col gap-2.5">
              <div className="h-0.5 bg-gold" />
              <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-ivory">Assessment</div>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="h-0.5 bg-white/10" />
              <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted-400">Fit report</div>
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="h-0.5 bg-white/10" />
              <div className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted-400">Reserve seat</div>
            </div>
          </div>

          <Link
            href="/apply/start"
            className="inline-block bg-red text-white rounded-full px-8.5 py-4.5 cursor-pointer font-mono text-[12.5px] tracking-[0.1em] uppercase font-medium hover:bg-red-hover"
          >
            Start assessment
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
