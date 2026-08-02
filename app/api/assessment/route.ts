import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { QUESTIONS, TIERS, tierIndex, type Answers } from "@/lib/config";

export async function POST(request: Request) {
  const body = await request.json();
  const { signupId, answers } = body as {
    signupId?: string;
    answers?: Answers;
  };

  if (!signupId || !Array.isArray(answers) || answers.length !== QUESTIONS.length) {
    return NextResponse.json(
      { error: "signupId and six answers are required" },
      { status: 400 }
    );
  }

  const tier = TIERS[tierIndex(answers)];

  const labelOf = (qi: number) => {
    const idx = answers[qi];
    return idx == null ? null : QUESTIONS[qi].o[idx] ?? null;
  };

  try {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("assessment_responses")
      .insert({
        signup_id: signupId,
        q1_role: labelOf(0),
        q2_ai_usage: labelOf(1),
        q3_goal: labelOf(2),
        q4_time_commit: labelOf(3),
        q5_blocker: labelOf(4),
        q6_urgency: labelOf(5),
        tier,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ id: data.id, tier });
  } catch (err) {
    console.error("assessment insert failed", err);
    return NextResponse.json(
      { error: "Could not save assessment" },
      { status: 500 }
    );
  }
}
