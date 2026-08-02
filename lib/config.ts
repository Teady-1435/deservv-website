export const PROGRAM = {
  fee: 10000,
  seats: 24,
  duration: "15 days",
  cohort: "Cohort 02 — applications open",
  cohortStart: "Monday, 17 August — 8:30 pm IST",
};

export const FEE_SPLIT = {
  instructor: 0.55,
  tools: 0.15,
  content: 0.15,
  community: 0.08,
  ops: 0.07,
};

export function money(n: number): string {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function feeSplit(fee: number) {
  return {
    instructor: money(fee * FEE_SPLIT.instructor),
    tools: money(fee * FEE_SPLIT.tools),
    content: money(fee * FEE_SPLIT.content),
    community: money(fee * FEE_SPLIT.community),
    ops: money(fee * FEE_SPLIT.ops),
  };
}

export type Question = { t: string; o: string[] };

export const QUESTIONS: Question[] = [
  {
    t: "What best describes your current role?",
    o: [
      "Individual contributor",
      "Team lead or manager",
      "Founder or business owner",
      "Student or early career",
    ],
  },
  {
    t: "How deep is your current AI usage?",
    o: [
      "Never used it beyond curiosity",
      "Use ChatGPT for occasional tasks",
      "Built basic automations with tools like Zapier or scripts",
      "Already building or shipping AI agents",
    ],
  },
  {
    t: "What do you want AI to run for you first?",
    o: [
      "Repetitive ops or admin work",
      "Sales or client communication",
      "Data analysis and reporting",
      "Content or research work",
      "Something specific to my function",
    ],
  },
  {
    t: "How much time can you commit daily for 15 days?",
    o: ["Under 30 minutes", "30 to 60 minutes", "1 to 2 hours", "2+ hours"],
  },
  {
    t: "What has stopped you from doing this already?",
    o: [
      "Don’t know where to start",
      "Tried courses, too theoretical",
      "Never carved out the time",
      "Tried building it myself, got stuck technically",
    ],
  },
  {
    t: "When do you want this running in your actual job?",
    o: [
      "Immediately, I need this now",
      "Within this quarter",
      "Exploring for later this year",
    ],
  },
];

export const TIERS = ["Tab Opener", "Tool Tourist", "System Builder", "System Owner"];

export const CAPSTONES = [
  "An agent that clears your recurring ops queue — reads the thread, drafts the update, files the record, and stops to ask you before anything irreversible.",
  "A follow-up agent trained on your own past client threads: drafts every reply, flags the ones that need a human, and never lets a lead go cold.",
  "A reporting agent that pulls the week’s numbers, writes the commentary in your voice, and has the deck ready before Monday standup.",
  "A research agent that reads the sources, cites them properly, and hands you a draft you would have written yourself — in a quarter of the time.",
  "We take the one task you name on day one and build the agent for it with you, live, in the room.",
];

export const ROLES = [
  "individual contributor",
  "team lead",
  "founder",
  "early-career builder",
];

export const GOALS = [
  "repetitive ops work",
  "client communication",
  "analysis and reporting",
  "content and research",
  "the workflow specific to your function",
];

export type Answers = (number | undefined)[];

export function tierIndex(answers: Answers): number {
  let t = answers[1] == null ? 0 : answers[1];
  if (answers[4] === 3) t = Math.min(3, t + 1);
  return t;
}

export function capstoneFor(answers: Answers): string {
  const g3 = answers[2] == null ? 4 : answers[2];
  return CAPSTONES[g3];
}

export function diagnosisFor(answers: Answers): string {
  const roleIdx = answers[0] == null ? 0 : answers[0];
  const g3 = answers[2] == null ? 4 : answers[2];
  const role = ROLES[roleIdx];
  const article = /^[aeiou]/i.test(role) ? "As an " : "As a ";
  return `${article}${role}, you told us you want AI running ${GOALS[g3]}. Here is the path.`;
}
