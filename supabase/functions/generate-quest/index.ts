import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Generates today's mission with Claude — and, crucially, only missions that an
// AI can VERIFY WITH CONFIDENCE from a short phone video.
// Body: { difficulty: "easy" | "medium" | "hard" }
// Response: { title: string }
//
// Without ANTHROPIC_API_KEY it falls back to a small built-in pool so the app
// keeps working in demo mode.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MODEL = "claude-opus-4-8";

const FALLBACK: Record<string, string[]> = {
  easy: ["Touch something blue", "Wave at the camera", "Hold up a book", "Show something round", "Find a green leaf", "Give a big thumbs up"],
  medium: ["Do 10 jumping jacks", "Balance on one foot", "Do a silly dance", "Spin around 3 times", "Touch your toes 5 times", "Do 8 arm circles"],
  hard: ["Do 15 push-ups", "Hold a plank for 20 seconds", "Do 20 squats", "Do 12 lunges", "Run in place for 30 seconds", "Do 10 burpees"],
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { difficulty } = await req.json();
    const tier = ["easy", "medium", "hard"].includes(difficulty) ? difficulty : "easy";

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) return json({ title: pickFallback(tier) });

    const prompt =
      `Invent ONE short daily challenge for a fun, friendly habit game.\n` +
      `Difficulty: ${tier} (easy = tiny & instant, medium = light activity, hard = a real but doable physical effort).\n\n` +
      `CRITICAL — it must be something an AI can confirm WITH HIGH CONFIDENCE from a short phone video:\n` +
      `- Visually obvious (clearly visible on camera).\n` +
      `- Doable indoors, alone, right now, with no special equipment and no other people.\n` +
      `- Safe, wholesome, and beginner-friendly. Nothing dangerous, gross, or requiring going somewhere.\n` +
      `- No tasks that need sound, text, timing the AI can't see, or buying anything.\n` +
      `- Phrase as a short, cheerful imperative, max 6 words. No emoji, no punctuation at the end.\n\n` +
      `Good examples: "Touch something blue", "Do 10 jumping jacks", "Balance a book on your head", "Do 15 push-ups".\n` +
      `Respond with ONLY a JSON object: {"title": "..."}.`;

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 120,
        messages: [{ role: "user", content: [{ type: "text", text: prompt }] }],
      }),
    });

    if (!resp.ok) return json({ title: pickFallback(tier) });

    const data = await resp.json();
    const text: string = (data?.content ?? [])
      .filter((b: { type?: string }) => b?.type === "text")
      .map((b: { text?: string }) => b.text ?? "")
      .join("");
    const match = text.match(/\{[\s\S]*\}/);
    const title = match ? String(JSON.parse(match[0]).title ?? "").trim() : "";
    return json({ title: title || pickFallback(tier) });
  } catch {
    return json({ title: pickFallback("easy") });
  }
});

function pickFallback(tier: string): string {
  const pool = FALLBACK[tier] ?? FALLBACK.easy;
  return pool[Math.floor(Math.random() * pool.length)];
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
