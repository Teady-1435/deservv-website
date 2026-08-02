"use client";

import { useState } from "react";

type Panel = {
  num: string;
  title: string;
  badge?: string;
  body: React.ReactNode;
};

const PANELS: Panel[] = [
  {
    num: "01",
    title: "AI Builder Mindset",
    body: (
      <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">You cover</div>
          <ul className="m-0 pl-4.5 text-muted-100 text-[15.5px] leading-[1.85]">
            <li>How AI is actually changing work — not the headlines</li>
            <li>Thinking in workflows instead of tasks</li>
            <li>AI as a teammate, not a search box</li>
            <li>AI-first problem solving</li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">You leave with</div>
          <p className="m-0 text-ivory text-[15.5px] leading-[1.7]">
            A map of your own working week, with every repeating task marked
            for who should own it — you or a system.
          </p>
        </div>
      </div>
    ),
  },
  {
    num: "02",
    title: "Mastering AI Assistants",
    body: (
      <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">Tools</div>
          <ul className="m-0 pl-4.5 text-muted-100 text-[15.5px] leading-[1.85]">
            <li>Claude Code</li>
            <li>ChatGPT Desktop</li>
            <li>Cursor</li>
            <li>GitHub Copilot</li>
            <li>Gemini CLI</li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">Skills</div>
          <ul className="m-0 pl-4.5 text-muted-100 text-[15.5px] leading-[1.85]">
            <li>Giving context properly</li>
            <li>Asking better questions</li>
            <li>Iterative development</li>
            <li>Debugging with AI</li>
            <li>Reviewing what AI wrote</li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">Project</div>
          <p className="m-0 text-ivory text-[15.5px] leading-[1.7]">
            Build your first desktop app — running on your machine by the end
            of the session.
          </p>
        </div>
      </div>
    ),
  },
  {
    num: "03",
    title: "Efficient Use of LLMs",
    badge: "Most valuable",
    body: (
      <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">Context management</div>
          <ul className="m-0 pl-4.5 text-muted-100 text-[15.5px] leading-[1.85]">
            <li>Why context is the whole game</li>
            <li>Context windows, in practice</li>
            <li>Keeping a conversation focused</li>
            <li>New chat, or continue the old one</li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">Prompt engineering</div>
          <ul className="m-0 pl-4.5 text-muted-100 text-[15.5px] leading-[1.85]">
            <li>Writing clear requirements</li>
            <li>Prompt templates &amp; libraries</li>
            <li>Few-shot examples</li>
            <li>Structured outputs</li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">Large documents &amp; memory</div>
          <ul className="m-0 pl-4.5 text-muted-100 text-[15.5px] leading-[1.85]">
            <li>PDFs, Excel, many files at once</li>
            <li>Pointing AI at a whole folder</li>
            <li>Conversation vs persistent vs project memory</li>
            <li>When to reset context</li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">Limits</div>
          <ul className="m-0 pl-4.5 text-muted-100 text-[15.5px] leading-[1.85]">
            <li>Hallucination, and how to catch it</li>
            <li>Verification habits</li>
            <li>Privacy at work</li>
            <li>Cost awareness</li>
          </ul>
        </div>
      </div>
    ),
  },
  {
    num: "04",
    title: "Skills & MCP",
    body: (
      <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">Skills</div>
          <ul className="m-0 pl-4.5 text-muted-100 text-[15.5px] leading-[1.85]">
            <li>Reusable capabilities, not one-off prompts</li>
            <li>Prompt and project templates</li>
            <li>Custom GPTs, Claude Projects</li>
            <li>Domain assistants: marketing, sales, HR, finance</li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">MCP, in plain language</div>
          <p className="m-0 mb-3 text-muted-100 text-[15.5px] leading-[1.7]">
            A standard way for an assistant to securely reach your real tools
            and data. No protocol theory — only why it matters and how to wire
            it.
          </p>
          <ul className="m-0 pl-4.5 text-muted-100 text-[15.5px] leading-[1.85]">
            <li>Local files, databases, Drive, GitHub, Notion</li>
            <li>Internal documentation search, API calls</li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">Projects</div>
          <p className="m-0 text-ivory text-[15.5px] leading-[1.7]">
            Build a reusable assistant for your own function — then connect it
            to live data and let it answer questions no chatbot could.
          </p>
        </div>
      </div>
    ),
  },
  {
    num: "05",
    title: "Business Applications & Toolchains",
    body: (
      <div>
        <p className="m-0 mb-5 max-w-[60ch] text-muted-100 text-[15.5px] leading-[1.7]">
          Single capabilities are a party trick. Chained capabilities are
          leverage. You build two full chains against your own systems:
        </p>
        <div className="flex flex-col gap-3.5">
          {[
            ["Excel", "AI analysis", "Dashboard", "Email report", "Saved to Drive"],
            ["CRM", "AI summary", "Proposal", "Email draft", "Calendar reminder"],
          ].map((chain, i) => (
            <div key={i} className="flex flex-wrap gap-2 items-center font-mono text-xs text-muted-50">
              {chain.map((step, j) => {
                const isLast = j === chain.length - 1;
                return (
                  <span key={step} className="contents">
                    <span
                      className={
                        isLast
                          ? "border border-gold/50 px-3 py-2 text-gold"
                          : "border border-white/[0.14] px-3 py-2"
                      }
                    >
                      {step}
                    </span>
                    {!isLast && <span className="text-gold">→</span>}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    num: "06",
    title: "AI Automation",
    body: (
      <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">You cover</div>
          <ul className="m-0 pl-4.5 text-muted-100 text-[15.5px] leading-[1.85]">
            <li>Scheduled tasks that run without you</li>
            <li>Local automation on your machine</li>
            <li>Email workflows</li>
            <li>Report generation</li>
            <li>Trigger-based automation</li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">The shift</div>
          <p className="m-0 text-ivory text-[15.5px] leading-[1.7]">
            This is where AI stops being something you open and becomes
            something that was already finished when you woke up.
          </p>
        </div>
      </div>
    ),
  },
  {
    num: "07",
    title: "AI Agents",
    body: (
      <div className="grid gap-7" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">Concepts</div>
          <ul className="m-0 pl-4.5 text-muted-100 text-[15.5px] leading-[1.85]">
            <li>Planning</li>
            <li>Memory</li>
            <li>Tool use</li>
            <li>Multi-step reasoning</li>
            <li>Human approval gates</li>
            <li>Multi-agent systems, at a high level</li>
          </ul>
        </div>
        <div>
          <div className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted-400 mb-3">Project</div>
          <p className="m-0 text-ivory text-[15.5px] leading-[1.7]">
            An assistant that completes a whole sequence of related tasks —
            and stops for your approval before anything leaves the building.
          </p>
        </div>
      </div>
    ),
  },
  {
    num: "08",
    title: "Capstone",
    body: (
      <p className="m-0 max-w-[60ch] text-ivory text-base leading-[1.7]">
        You build an application for your own work and put it in front of
        real users — your team, your clients, your ops. Not a demo. Something
        that would be missed if you switched it off.
      </p>
    ),
  },
];

export default function CurriculumAccordion() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="border-t border-white/10">
      {PANELS.map((panel, i) => {
        const isOpen = open === i;
        return (
          <div key={panel.num} className="border-b border-white/10">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center gap-5 bg-transparent border-0 cursor-pointer py-6.5 px-1 text-left text-ivory hover:text-gold"
            >
              <span className="font-mono text-[11px] text-gold w-6.5 shrink-0">{panel.num}</span>
              <span
                className="flex-1 font-display font-medium"
                style={{ fontSize: "clamp(18px,2vw,25px)", letterSpacing: "-0.02em" }}
              >
                {panel.title}
              </span>
              {panel.badge && (
                <span className="font-mono text-[9.5px] tracking-[0.14em] uppercase text-ink bg-gold px-2 py-1 shrink-0">
                  {panel.badge}
                </span>
              )}
              <span className="text-[19px] text-muted-400 shrink-0">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && <div className="pb-7.5 pl-12.5 pr-1">{panel.body}</div>}
          </div>
        );
      })}
    </div>
  );
}
