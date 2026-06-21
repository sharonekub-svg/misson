"use client";

import { useState } from "react";

// ── חשבונית-קל ─────────────────────────────────────────────
// אתר פשוט שקורא חשבונית ומסדר את הנתונים בטבלה.
// בעל עסק מעלה חשבונית → מקבל טבלה מסודרת → חוסך שעות הקלדה.
// זה הדמו: לוחצים "נסה דוגמה" ורואים איך זה עובד, בלי להעלות כלום.
// ───────────────────────────────────────────────────────────

type Row = { field: string; value: string };

// תוצאה לדוגמה — בהמשך זה יגיע מ-AI אמיתי שקורא את החשבונית
const DEMO_RESULT: Row[] = [
  { field: "שם הספק", value: "מאפיית הבוקר בע\"מ" },
  { field: "מספר חשבונית", value: "2026-4471" },
  { field: "תאריך", value: "18/06/2026" },
  { field: "סכום לפני מע\"מ", value: "₪1,240.00" },
  { field: "מע\"מ (18%)", value: "₪223.20" },
  { field: "סה\"כ לתשלום", value: "₪1,463.20" },
];

export default function InvoicePage() {
  const [stage, setStage] = useState<"idle" | "scanning" | "done">("idle");

  function runDemo() {
    setStage("scanning");
    setTimeout(() => setStage("done"), 1800);
  }

  return (
    <main dir="rtl" style={styles.page}>
      {/* כותרת עליונה */}
      <header style={styles.hero}>
        <div style={styles.logo}>חשבונית־קל</div>
        <h1 style={styles.h1}>תפסיקו להקליד חשבוניות ביד</h1>
        <p style={styles.sub}>
          מעלים תמונה של חשבונית — ומקבלים את כל הנתונים מסודרים בטבלה,
          מוכנים לאקסל. חוסך לעסק שעות של הקלדה כל חודש.
        </p>
        <button style={styles.cta} onClick={runDemo}>
          נסה דוגמה חינם ←
        </button>
      </header>

      {/* אזור הדמו */}
      <section style={styles.demoBox}>
        {stage === "idle" && (
          <div style={styles.placeholder}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🧾</div>
            לחץ על <b>“נסה דוגמה”</b> למעלה כדי לראות את האתר קורא חשבונית
          </div>
        )}

        {stage === "scanning" && (
          <div style={styles.placeholder}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            קורא את החשבונית…
          </div>
        )}

        {stage === "done" && (
          <div>
            <div style={styles.doneTitle}>✅ הנה הנתונים שחולצו:</div>
            <table style={styles.table}>
              <tbody>
                {DEMO_RESULT.map((r) => (
                  <tr key={r.field}>
                    <td style={styles.tdField}>{r.field}</td>
                    <td style={styles.tdValue}>{r.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button style={styles.secondary}>📥 ייצוא לאקסל</button>
          </div>
        )}
      </section>

      {/* תמחור — כאן נכנס הכסף */}
      <section style={styles.pricing}>
        <h2 style={styles.h2}>מחיר פשוט</h2>
        <div style={styles.priceCard}>
          <div style={styles.price}>
            ₪49<span style={styles.perMonth}> / חודש</span>
          </div>
          <ul style={styles.features}>
            <li>✓ חשבוניות ללא הגבלה</li>
            <li>✓ ייצוא לאקסל</li>
            <li>✓ קריאה אוטומטית עם AI</li>
            <li>✓ תמיכה בעברית</li>
          </ul>
          <button style={styles.cta}>התחל מנוי ←</button>
          <p style={styles.fineprint}>
            הכפתור הזה יחובר לסליקה (Stripe) בשלב הבא
          </p>
        </div>
      </section>

      <footer style={styles.footer}>חשבונית־קל · דמו ראשוני</footer>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0D0E12",
    color: "#EDEDF0",
    fontFamily: "var(--font-inter), system-ui, sans-serif",
    padding: "0 20px 60px",
    maxWidth: 720,
    margin: "0 auto",
  },
  hero: { textAlign: "center", padding: "56px 0 32px" },
  logo: { fontWeight: 800, fontSize: 18, color: "#FF7A3D", letterSpacing: 1 },
  h1: { fontSize: 34, fontWeight: 800, margin: "20px 0 12px", lineHeight: 1.2 },
  sub: { fontSize: 17, color: "#A9AAB3", lineHeight: 1.6, maxWidth: 520, margin: "0 auto 28px" },
  cta: {
    background: "#FF7A3D", color: "#0D0E12", border: "none", borderRadius: 12,
    padding: "14px 28px", fontSize: 17, fontWeight: 700, cursor: "pointer",
  },
  secondary: {
    background: "transparent", color: "#FF7A3D", border: "1px solid #FF7A3D",
    borderRadius: 10, padding: "10px 20px", fontSize: 15, fontWeight: 600,
    cursor: "pointer", marginTop: 18,
  },
  demoBox: {
    background: "#16171D", border: "1px solid #24252E", borderRadius: 16,
    padding: 28, minHeight: 220, display: "flex", flexDirection: "column",
    justifyContent: "center",
  },
  placeholder: { textAlign: "center", color: "#A9AAB3", fontSize: 16, lineHeight: 1.7 },
  doneTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16, color: "#7CD992" },
  table: { width: "100%", borderCollapse: "collapse" },
  tdField: { padding: "12px 8px", color: "#A9AAB3", borderBottom: "1px solid #24252E", fontSize: 15 },
  tdValue: { padding: "12px 8px", fontWeight: 600, borderBottom: "1px solid #24252E", textAlign: "left", fontSize: 15 },
  pricing: { textAlign: "center", padding: "48px 0 0" },
  h2: { fontSize: 26, fontWeight: 800, marginBottom: 24 },
  priceCard: {
    background: "#16171D", border: "1px solid #24252E", borderRadius: 16,
    padding: 32, maxWidth: 360, margin: "0 auto",
  },
  price: { fontSize: 44, fontWeight: 800, color: "#FF7A3D" },
  perMonth: { fontSize: 18, color: "#A9AAB3", fontWeight: 500 },
  features: { listStyle: "none", padding: 0, margin: "24px 0", textAlign: "right", lineHeight: 2, fontSize: 16 },
  fineprint: { fontSize: 13, color: "#6A6B74", marginTop: 14 },
  footer: { textAlign: "center", color: "#6A6B74", fontSize: 13, paddingTop: 48 },
};
