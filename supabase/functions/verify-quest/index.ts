import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// Verifies a quest from a single video frame using Claude vision.
// Request body: { questTitle: string, imageBase64: string, mimeType?: string }
// Response: { verified: boolean, reason: string }
//
// Set the ANTHROPIC_API_KEY secret to enable real checking; without it the
// function runs in a permissive "demo mode" that approves everything.

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MODEL = "claude-haiku-4-5-20251001";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { questTitle, imageBase64, mimeType } = await req.json();
    if (!questTitle || !imageBase64) {
      return json({ verified: false, reason: "Missing quest or image." }, 400);
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return json({
        verified: true,
        reason: "Demo mode: set ANTHROPIC_API_KEY to enable real AI checking.",
      });
    }

    const prompt =
      `You are a fair but careful quest verifier for a daily-quest game.\n` +
      `The player was asked to: "${questTitle}".\n` +
      `This is a single still frame from the short video they recorded.\n` +
      `Decide if the frame plausibly shows the player doing (or having just done) the quest. ` +
      `Be encouraging and give the benefit of the doubt for simple quests, ` +
      `but reject frames that clearly show something unrelated.\n` +
      `Respond with ONLY a JSON object: {"verified": true|false, "reason": "one short friendly sentence"}.`;

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mimeType ?? "image/jpeg",
                  data: imageBase64,
                },
              },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      return json({ verified: false, reason: `AI error: ${resp.status}`, detail: err }, 502);
    }

    const data = await resp.json();
    const text: string = data?.content?.[0]?.text ?? "";
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return json({ verified: false, reason: "Could not read AI response." });
    }
    const parsed = JSON.parse(match[0]);
    return json({
      verified: Boolean(parsed.verified),
      reason: String(parsed.reason ?? ""),
    });
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
