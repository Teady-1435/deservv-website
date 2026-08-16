import HomeReel from "@/components/HomeReel";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import ImageSlot from "@/components/ImageSlot";
import { PROGRAM, money, IMAGES } from "@/lib/config";

const feeLabel = money(PROGRAM.fee);

export default function HomePage() {
  return (
    <div>
      <HomeReel />

      <section
        className="relative border-b border-white/[0.07] overflow-hidden"
        style={{ padding: "clamp(56px,9vw,120px) clamp(22px,4vw,56px) clamp(40px,6vw,80px)" }}
      >
        <div className="absolute -top-[180px] -right-[120px] w-[520px] h-[520px] rounded-full border border-dashed border-gold/[0.14] pointer-events-none" />
        <div className="max-w-[1280px] mx-auto">
          <div
            className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-gold"
            style={{ marginBottom: "clamp(20px,3vw,30px)" }}
          >
            What you already paid for
          </div>

          <p className="max-w-[54ch] text-base leading-[1.7] xs:leading-[1.6] text-muted-100 mb-7 md:mb-10">
            You already spent lakhs on the first three. Here&apos;s the one that
            pays you back.
          </p>

          <div
            className="grid gap-7 md:gap-16 items-end"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}
          >
            <div className="flex flex-col">
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-600 mb-3.5">
                Programs you paid for — elsewhere
              </div>
              <div className="flex flex-col gap-3.5">
                {[
                  ["Data Science Bootcamp", "6 months · ₹1,80,000 · certificate"],
                  ["Advanced Analytics PG", "11 months · ₹2,40,000 · certificate"],
                  ["Generative AI Masterclass", "4 months · ₹95,000 · certificate"],
                ].map(([a, b]) => (
                  <div
                    key={a}
                    data-paidrow="1"
                    className="flex justify-between gap-4 pb-3 border-b border-white/5 font-mono text-xs text-muted-600"
                  >
                    <span className="line-through decoration-red/50">{a}</span>
                    <span className="line-through decoration-red/50">{b}</span>
                  </div>
                ))}
              </div>
              <div className="h-px bg-gold/40 my-7 mb-4" />
              <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-gold mb-3">
                What to pay for instead
              </div>
              <div data-paidrow="1" className="flex justify-between gap-4 font-mono text-[13px] font-medium text-gold">
                <span>Deservv — Applied &amp; Agentic AI</span>
                <span className="whitespace-nowrap">
                  {PROGRAM.duration} · {feeLabel} · systems that run
                </span>
              </div>
            </div>
          </div>

          <Reveal
            as="h1"
            className="font-display font-semibold type-display max-w-[20ch]"
            style={{
              fontSize: "clamp(30px,5.4vw,76px)",
              margin: "clamp(36px,6vw,72px) 0 0",
            }}
          >
            You never needed another&nbsp;certificate.{" "}
            <span className="block xs:inline">
              You needed the&nbsp;<span className="text-gold">systems</span>.
            </span>
          </Reveal>

          <Reveal
            as="p"
            className="max-w-[62ch] text-muted-100 leading-[1.72] xs:leading-[1.65]"
            style={{ fontSize: "clamp(16px,1.3vw,19px)", margin: "26px 0 0", textWrap: "pretty" }}
          >
            Every year you paid for theory and left with slides. Meanwhile the
            people pulling ahead of you quietly rebuilt their own working day,
            one task at a time, until AI stopped being a tab they open and
            became the thing they work inside.
          </Reveal>

          <Reveal className="flex flex-wrap gap-3.5 mt-8">
            <a
              href="/apply"
              className="bg-red text-white rounded-full px-7 py-4 cursor-pointer font-mono text-[12.5px] tracking-[0.1em] uppercase font-medium hover:bg-red-hover"
            >
              Apply for the next cohort
            </a>
            <a
              href="/hire"
              className="bg-transparent text-ivory border border-white/[0.18] rounded-full px-7 py-4 cursor-pointer font-mono text-[12.5px] tracking-[0.1em] uppercase hover:border-gold hover:text-gold"
            >
              I want to hire this talent
            </a>
          </Reveal>
        </div>
      </section>

      <section
        className="border-b border-white/[0.07] bg-ink-alt"
        style={{ padding: "clamp(20px,3vw,30px) clamp(20px,4vw,56px)" }}
      >
        <div
          className="max-w-[1280px] mx-auto grid gap-5"
          style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}
        >
          {[
            [PROGRAM.duration, "Not six months"],
            [feeLabel, "Not ₹1–3 lakh"],
            ["1 instructor", "Live, in the room with you"],
            ["8 parts", "Every one a working build"],
          ].map(([big, small]) => (
            <div key={small} className="flex flex-col gap-1.5">
              <span className="font-display text-[26px] font-semibold" style={{ letterSpacing: "-0.02em" }}>
                {big}
              </span>
              <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted-400">
                {small}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border-b border-white/[0.07]"
        style={{ padding: "clamp(60px,8vw,110px) clamp(22px,4vw,56px)", background: "rgba(229,52,42,0.03)" }}
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-red leading-[1.75] xs:leading-[1.5] mb-5">
            What a typical AI course sells — not Deservv
          </div>
          <Reveal
            as="h2"
            className="font-display font-semibold type-display max-w-[26ch] mb-7 xs:mb-[22px]"
            style={{ fontSize: "clamp(27px,4.2vw,58px)" }}
          >
            A typical AI course: six&nbsp;months, two&nbsp;lakhs,
            a&nbsp;certificate.{" "}
            <span className="text-muted-400 block xs:inline">
              Monday looks the&nbsp;same.
            </span>
          </Reveal>
          <Reveal as="p" className="max-w-[60ch] text-[17px] leading-[1.72] xs:leading-[1.65] text-muted-100">
            <span style={{ marginBottom: "clamp(40px,5vw,64px)" }} className="block">
              Neural-network diagrams you&apos;ll never draw again. A tour of
              forty tools at five minutes each. One new habit: you occasionally
              open a chatbot. Your appraisal knows the difference.
            </span>
          </Reveal>

          <Reveal className="grid gap-px bg-white/[0.08] border border-white/[0.08]" as="div">
            <div
              className="grid gap-px bg-white/[0.08]"
              style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}
            >
              {[
                ["6 mo", "of evenings, against a syllabus written before the agent era started."],
                ["₹1–3L", "paid upfront, often on EMI, for content you could watch for free."],
                ["1 PDF", "to hang on LinkedIn. No promotion attached. No hike attached. No system running."],
              ].map(([big, text]) => (
                <div key={big} className="bg-ink-alt p-8 md:p-9 flex flex-col gap-3">
                  <span className="font-display text-[42px] font-semibold text-red" style={{ letterSpacing: "-0.03em" }}>
                    {big}
                  </span>
                  <span className="text-[15.5px] leading-[1.7] xs:leading-[1.6] text-muted-100">{text}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal as="p" className="max-w-[62ch] mx-auto text-center text-muted-100 text-[16.5px] leading-[1.72] xs:leading-[1.65] mt-10">
            None of that is Deservv. Here&apos;s the difference, side by side.
          </Reveal>

          <Reveal
            as="h3"
            className="font-display font-semibold type-display text-center mt-10"
            style={{ fontSize: "clamp(24px,3.2vw,44px)" }}
          >
            Same ambition.{" "}
            <span className="text-gold">Different&nbsp;delivery.</span>
          </Reveal>

          <Reveal className="border border-white/10 overflow-hidden mt-8" as="div" data-cmp="1">
            <div className="grid bg-white/[0.02]" style={{ gridTemplateColumns: "minmax(120px, 0.9fr) 1fr 1fr" }}>
              <div className="p-6.5 border-r border-white/[0.08]" />
              <div className="p-6.5 border-r border-white/[0.08] text-center">
                <div className="font-display text-[clamp(19px,2vw,26px)] font-semibold text-muted-300" style={{ letterSpacing: "-0.02em" }}>
                  The AI course
                </div>
                <div className="font-mono text-[11px] text-muted-400 mt-2">Learn about AI</div>
              </div>
              <div className="p-6.5 text-center bg-gold/5">
                <div className="font-display text-[clamp(19px,2vw,26px)] font-semibold text-ivory" style={{ letterSpacing: "-0.02em" }}>
                  Deservv
                </div>
                <div className="font-mono text-[11px] text-gold mt-2">Work through AI</div>
              </div>
            </div>
            {[
              ["Length", "4–11 months of lectures", `${PROGRAM.duration} of building`],
              ["Fee", "₹1,00,000 – ₹3,00,000", `${feeLabel}, one payment`],
              ["Who teaches", "Rotating TAs over recorded video", "One working engineer, live, every session"],
              ["Curriculum", "Generic sandbox exercises", "Written against the tools your role actually touches"],
              ["How you learn", "Watch a tutorial, take a quiz", "Build the project with him, then rebuild it for your own job"],
              ["You leave with", "A certificate", "Agents already running inside your working week"],
            ].map(([label, course, deservv]) => (
              <div key={label} className="grid border-t border-white/[0.08]" style={{ gridTemplateColumns: "minmax(120px, 0.9fr) 1fr 1fr" }}>
                <div className="p-5.5 border-r border-white/[0.08] font-mono text-[10.5px] tracking-[0.14em] uppercase text-muted-400">
                  {label}
                </div>
                <div className="p-5.5 border-r border-white/[0.08] text-center text-[15.5px] text-muted-300">
                  {course}
                </div>
                <div className="p-5.5 text-center text-[15.5px] bg-gold/[0.03]">{deservv}</div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section
        className="border-b border-white/[0.07] bg-ink-alt overflow-hidden"
        style={{ padding: "clamp(60px,8vw,110px) clamp(22px,4vw,56px)" }}
      >
        <div className="max-w-[1280px] mx-auto">
          <div className="font-mono text-[11.5px] tracking-[0.2em] uppercase text-gold mb-5">
            The room you join
          </div>
          <div
            className="grid items-center"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "clamp(32px,5vw,64px)" }}
          >
            <div>
              <Reveal
                as="h2"
                className="font-display font-semibold type-display mb-5"
                style={{ fontSize: "clamp(27px,4.2vw,56px)" }}
              >
                The cohort ends.{" "}
                <span className="text-gold block xs:inline">
                  The room doesn&apos;t.
                </span>
              </Reveal>
              <Reveal as="p" className="max-w-[52ch] text-[17px] leading-[1.72] xs:leading-[1.65] text-muted-100 mb-7">
                A course is a calendar. A room is a compounding asset. Your batch
                is deliberately mixed — a finance controller, a growth lead, a
                support head, two founders — because the automation that saves
                an ops manager eleven hours is one a recruiter has never thought
                of.
              </Reveal>
              <Reveal className="flex flex-col border-t border-white/[0.08]">
                {[
                  ["01", "Monthly meetup, Bengaluru", "One Saturday a month, in person. Three members demo something they shipped. No slides allowed — screens only."],
                  ["02", "The build channel", "Post a broken workflow, get it unblocked. Alumni answer, because six months ago they asked the same thing."],
                  ["03", "The tool layer moves. You move with it.", "When a tool in the curriculum changes, the room gets the rebuild. The skill was never the tool."],
                ].map(([num, title, body]) => (
                  <div key={num} className="flex gap-4 py-5 xs:py-4.5 border-b border-white/[0.08]">
                    <span className="font-mono text-[11px] text-gold pt-1">{num}</span>
                    <div>
                      <div className="font-display text-[18px] leading-[1.35] font-medium mb-2 xs:mb-1.5">{title}</div>
                      <div className="text-[15px] leading-[1.7] xs:leading-[1.6] text-muted-200">{body}</div>
                    </div>
                  </div>
                ))}
              </Reveal>
            </div>
            <Reveal className="relative">
              <ImageSlot
                src={IMAGES.communityMeetup}
                alt="Deservv members at the monthly Bengaluru meetup"
                placeholder="Bengaluru meetup photo — a real room, real screens"
                aspect="aspect-[4/3]"
                sizes="(max-width: 768px) 100vw, 46vw"
                caption="Bengaluru · monthly · members only"
              />
            </Reveal>
          </div>
        </div>
        <div className="mt-10 md:mt-18 border-t border-b border-white/[0.08] py-5.5 overflow-hidden whitespace-nowrap">
          <div
            className="inline-flex gap-11 font-mono text-[12.5px] tracking-[0.12em] uppercase text-muted-600"
            style={{ animation: "marquee 38s linear infinite" }}
          >
            {Array.from({ length: 2 }).map((_, rep) => (
              <span key={rep} className="inline-flex gap-11">
                {["Product", "Finance", "Recruiting", "Support", "Ops", "Growth", "Legal", "Founders", "Consulting", "Design", "Sales", "Manufacturing"].map(
                  (t) => (
                    <span key={t}>
                      {t}
                      <span className="text-gold ml-11">·</span>
                    </span>
                  )
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
