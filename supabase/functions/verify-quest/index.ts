import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Verifies a mission from a few video frames using Claude vision.
// Body: { questTitle: string, imagesBase64?: string[], imageBase64?: string, mimeType?: string }
// Response: { verified: boolean, reason: string }
//
// Set ANTHROPIC_API_KEY to enable real checking; without it the function runs
// in a permissive "demo mode" that approves everything.
//
// The prompt is intentionally GENEROUS: if the player clearly gave the mission
// an honest try, it passes. We only reject clips that are obviously unrelated.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MODEL = "claude-opus-4-8";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const body = await req.json();
    const questTitle: string = body.questTitle;
    const mimeType: string = body.mimeType ?? "image/jpeg";
    const images: string[] = Array.isArray(body.imagesBase64)
      ? body.imagesBase64
      : body.imageBase64
        ? [body.imageBase64]
        : [];

    if (!questTitle || images.length === 0) {
      return json({ verified: false, reason: "Missing mission or video frames." }, 400);
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return json({ verified: true, reason: "Demo mode: set ANTHROPIC_API_KEY to enable real AI checking." });
    }

    const prompt =
      `You are a warm, encouraging checker for a friendly daily-mission app (think a kids/casual game).\n` +
      `The player's mission was: "${questTitle}".\n` +
      `These are ${images.length} still frames sampled across the short video they recorded, in order.\n\n` +
      `Decide if the frames plausibly show the player attempting or doing the mission.\n` +
      `BE VERY GENEROUS — this is meant to be fun and motivating, not strict:\n` +
      `- If there's any reasonable sign they gave it an honest try, mark it verified.\n` +
      `- "Close enough" counts. Partial, imperfect, or slightly-off attempts still count.\n` +
      `- Give the benefit of the doubt; when unsure, lean toward verified: true.\n` +
      `- Only reject if the video clearly shows something completely unrelated, is empty/black, or is obviously not an attempt.\n\n` +
      `Respond with ONLY a JSON object: {"verified": true|false, "reason": "one short, friendly sentence"}.`;

    const content: unknown[] = images.map((data) => ({
      type: "image",
      source: { type: "base64", media_type: mimeType, data },
    }));
    content.push({ type: "text", text: prompt });

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        messages: [{ role: "user", content }],
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return json({ verified: false, reason: `AI error: ${resp.status}`, detail: err }, 502);
    }

    const data = await resp.json();
    const text: string = (data?.content ?? [])
      .filter((b: { type?: string }) => b?.type === "text")
      .map((b: { text?: string }) => b.text ?? "")
      .join("");
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      // If we can't parse a verdict, be kind and let it through.
      return json({ verified: true, reason: "Looks good to me!" });
    }
    const parsed = JSON.parse(match[0]);
    return json({ verified: Boolean(parsed.verified), reason: String(parsed.reason ?? "") });
  } catch (e) {
    return json({ verified: false, reason: `Error: ${String(e)}` }, 500);
  }
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}
