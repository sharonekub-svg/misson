"use client";

import { useState } from "react";

// ── תזכורת ──────────────────────────────────────────────────
// אתר מנוי לבעלי מקצוע (מאמנים, מטפלים, מורים, קוסמטיקאיות).
// השירות: שולח ללקוחות תזכורת תור אוטומטית → פחות "לא הגעתי" → יותר כסף.
// הם משלמים מנוי חודשי. זה הדמו של איך זה עובד.
// ───────────────────────────────────────────────────────────

export default function RemindersPage() {
  const [name, setName] = useState("דנה");
  const [time, setTime] = useState("מחר ב-17:00");
  const [sent, setSent] = useState(false);

  const message =
    `שלום ${name || "ל"}! 👋 רק תזכורת לתור שלך ${time || ""}.\n` +
    `מאשר/ת? השב/י 1 לאישור או 2 לביטול. נתראה! 🙂`;

  return (
    <main dir="rtl" style={s.page}>
      {/* כותרת מוכרת */}
      <header style={s.hero}>
        <div style={s.logo}>תזכורת</div>
        <h1 style={s.h1}>לקוחות שוכחים תורים. זה עולה לך כסף.</h1>
        <p style={s.sub}>
          תזכורת שולחת ללקוחות שלך הודעת תזכורת אוטומטית לפני כל תור —
          הם מאשרים או מבטלים בלחיצה. פחות תורים מבוזבזים, יותר הכנסה.
        </p>
        <a href="#pricing" style={s.cta}>התחל עכשיו ←</a>
      </header>

      {/* דמו חי */}
      <section style={s.card}>
        <div style={s.cardTitle}>נסה בעצמך 👇</div>
        <label style={s.label}>שם הלקוח</label>
        <input style={s.input} value={name} onChange={(e) => { setName(e.target.value); setSent(false); }} />
        <label style={s.label}>מתי התור</label>
        <input style={s.input} value={time} onChange={(e) => { setTime(e.target.value); setSent(false); }} />

        <button style={s.cta} onClick={() => setSent(true)}>
          שלח תזכורת לדוגמה
        </button>

        {sent && (
          <div style={s.phone}>
            <div style={s.bubble}>
              {message.split("\n").map((line, i) => <div key={i}>{line}</div>)}
            </div>
            <div style={s.delivered}>✓✓ נמסר ללקוח</div>
          </div>
        )}
      </section>

      {/* איך זה עובד */}
      <section style={s.steps}>
        <h2 style={s.h2}>איך זה עובד</h2>
        <div style={s.step}><b>1.</b> מוסיפים לקוח ותור (או מסנכרנים יומן)</div>
        <div style={s.step}><b>2.</b> תזכורת שולחת תזכורת אוטומטית יום לפני</div>
        <div style={s.step}><b>3.</b> הלקוח מאשר/מבטל — ואתה יודע מראש</div>
      </section>

      {/* תמחור */}
      <section id="pricing" style={s.pricing}>
        <h2 style={s.h2}>מחיר אחד פשוט</h2>
        <div style={s.priceCard}>
          <div style={s.price}>₪79<span style={s.perMonth}> / חודש</span></div>
          <ul style={s.features}>
            <li>✓ תזכורות ללא הגבלה</li>
            <li>✓ אישור/ביטול בלחיצה</li>
            <li>✓ סנכרון יומן</li>
            <li>✓ תמיכה בעברית</li>
          </ul>
          <button style={s.cta}>התחל מנוי ←</button>
          <p style={s.fineprint}>הכפתור יחובר לסליקה (Stripe) בשלב הבא</p>
        </div>
      </section>

      <footer style={s.footer}>תזכורת · דמו ראשוני</footer>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#0D0E12", color: "#EDEDF0", fontFamily: "var(--font-inter), system-ui, sans-serif", padding: "0 20px 60px", maxWidth: 720, margin: "0 auto" },
  hero: { textAlign: "center", padding: "56px 0 32px" },
  logo: { fontWeight: 800, fontSize: 18, color: "#3DA5FF", letterSpacing: 1 },
  h1: { fontSize: 32, fontWeight: 800, margin: "20px 0 12px", lineHeight: 1.25 },
  sub: { fontSize: 17, color: "#A9AAB3", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 28px" },
  cta: { display: "inline-block", background: "#3DA5FF", color: "#0D0E12", border: "none", borderRadius: 12, padding: "14px 28px", fontSize: 17, fontWeight: 700, cursor: "pointer", textDecoration: "none", marginTop: 8 },
  card: { background: "#16171D", border: "1px solid #24252E", borderRadius: 16, padding: 28 },
  cardTitle: { fontSize: 18, fontWeight: 700, marginBottom: 18, textAlign: "center" },
  label: { display: "block", fontSize: 14, color: "#A9AAB3", margin: "14px 0 6px" },
  input: { width: "100%", boxSizing: "border-box", background: "#0D0E12", border: "1px solid #24252E", borderRadius: 10, padding: "12px 14px", color: "#EDEDF0", fontSize: 16, fontFamily: "inherit" },
  phone: { marginTop: 22, background: "#0B141A", borderRadius: 14, padding: 16 },
  bubble: { background: "#075E54", color: "#fff", borderRadius: "12px 12px 12px 4px", padding: "12px 14px", fontSize: 15, lineHeight: 1.6, maxWidth: "85%" },
  delivered: { fontSize: 12, color: "#7CD992", marginTop: 8 },
  steps: { padding: "48px 0 0", textAlign: "center" },
  step: { background: "#16171D", border: "1px solid #24252E", borderRadius: 12, padding: "14px 18px", margin: "10px 0", textAlign: "right", fontSize: 16 },
  pricing: { textAlign: "center", padding: "48px 0 0" },
  h2: { fontSize: 26, fontWeight: 800, marginBottom: 24 },
  priceCard: { background: "#16171D", border: "1px solid #24252E", borderRadius: 16, padding: 32, maxWidth: 360, margin: "0 auto" },
  price: { fontSize: 44, fontWeight: 800, color: "#3DA5FF" },
  perMonth: { fontSize: 18, color: "#A9AAB3", fontWeight: 500 },
  features: { listStyle: "none", padding: 0, margin: "24px 0", textAlign: "right", lineHeight: 2, fontSize: 16 },
  fineprint: { fontSize: 13, color: "#6A6B74", marginTop: 14 },
  footer: { textAlign: "center", color: "#6A6B74", fontSize: 13, paddingTop: 48 },
};
