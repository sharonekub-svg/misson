// סוכן טלפוני בעברית — דמו
// Twilio (טלפוניה) <-> OpenAI Realtime (קול + שכל)
// מתקשרים למספר -> הסוכן עונה בעברית כפקיד/ה של מוסך וקובע תור.

import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";

const PORT = process.env.PORT || 5050;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PUBLIC_HOST = process.env.PUBLIC_HOST; // לדוגמה: my-tunnel.ngrok.app (בלי https://)

if (!OPENAI_API_KEY) {
  console.error("חסר OPENAI_API_KEY. ראה README.");
  process.exit(1);
}

// ── מי הסוכן ──────────────────────────────────────────────
// כאן משנים את האישיות/העסק. כרגע: פקידת קבלה של מוסך.
const SYSTEM_PROMPT = `
את "רונית", פקידת הקבלה של מוסך "האחים כהן" בתל אביב.
את מדברת עברית בלבד, בטון חם, אנושי וטבעי — כמו בן אדם אמיתי, לא כמו רובוט.
משפטים קצרים. אל תקריאי טקסט שמור. תקשיבי ותגיבי.

המטרה שלך: לקבוע ללקוח תור לטיפול ברכב.
תשאלי בעדינות:
1. שם הלקוח.
2. סוג הרכב ומספר.
3. מה הבעיה / איזה טיפול צריך.
4. מתי נוח לו להגיע (המוסך פתוח א'-ה' 8:00-17:00).

כשסיכמתם תור — חזרי על הפרטים בקצרה ואמרי שתישלח הודעת SMS עם אישור.
אם שואלים מחיר — תני טווח כללי ותגידי שבדיוק ייקבע אחרי שהמכונאי יראה את הרכב.
אל תמציאי מידע שאת לא יודעת. אם לא הבנת — בקשי שיחזרו על זה.
`.trim();

const GREETING = "שלום, הגעת למוסך האחים כהן, מדברת רונית. איך אפשר לעזור?";

const app = express();
const server = createServer(app);

// ── Twilio מבקש TwiML כשמתקשרים ───────────────────────────
app.all("/incoming", (req, res) => {
  const host = PUBLIC_HOST || req.headers.host;
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="wss://${host}/media" />
  </Connect>
</Response>`;
  res.type("text/xml").send(twiml);
});

app.get("/", (_req, res) => res.send("voice-agent-he up. נקודת כניסה: /incoming"));

// ── גשר אודיו בין Twilio ל-OpenAI ─────────────────────────
const wss = new WebSocketServer({ server, path: "/media" });

wss.on("connection", (twilioWs) => {
  console.log("📞 שיחה התחברה");
  let streamSid = null;

  const ai = new WebSocket(
    "wss://api.openai.com/v1/realtime?model=gpt-realtime",
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "OpenAI-Beta": "realtime=v1",
      },
    }
  );

  ai.on("open", () => {
    ai.send(
      JSON.stringify({
        type: "session.update",
        session: {
          turn_detection: { type: "server_vad" },
          input_audio_format: "g711_ulaw",
          output_audio_format: "g711_ulaw",
          voice: "shimmer",
          instructions: SYSTEM_PROMPT,
          modalities: ["text", "audio"],
        },
      })
    );
    // ברכת פתיחה יזומה
    ai.send(
      JSON.stringify({
        type: "response.create",
        response: { instructions: `אמרי בדיוק: "${GREETING}"` },
      })
    );
  });

  // אודיו/אירועים מ-OpenAI -> Twilio
  ai.on("message", (raw) => {
    const msg = JSON.parse(raw.toString());
    if (msg.type === "response.audio.delta" && msg.delta && streamSid) {
      twilioWs.send(
        JSON.stringify({
          event: "media",
          streamSid,
          media: { payload: msg.delta },
        })
      );
    }
    if (msg.type === "error") console.error("OpenAI error:", msg.error);
  });

  // אודיו/אירועים מ-Twilio -> OpenAI
  twilioWs.on("message", (raw) => {
    const data = JSON.parse(raw.toString());
    if (data.event === "start") {
      streamSid = data.start.streamSid;
      console.log("▶️  start", streamSid);
    } else if (data.event === "media" && ai.readyState === WebSocket.OPEN) {
      ai.send(
        JSON.stringify({
          type: "input_audio_buffer.append",
          audio: data.media.payload,
        })
      );
    } else if (data.event === "stop") {
      console.log("⏹️  שיחה הסתיימה");
      ai.close();
    }
  });

  twilioWs.on("close", () => ai.close());
  ai.on("close", () => {
    if (twilioWs.readyState === WebSocket.OPEN) twilioWs.close();
  });
  ai.on("error", (e) => console.error("AI ws error:", e.message));
});

server.listen(PORT, () => {
  console.log(`🚀 השרת רץ על פורט ${PORT}`);
  console.log(`   Webhook ל-Twilio:  /incoming`);
});
