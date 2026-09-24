// Minimal Resend client (https://resend.com/docs/api-reference/emails/send-email).
// Server-only. Does nothing (and reports false) until RESEND_API_KEY is set, so
// the checkout keeps working before email is configured.
const FROM = process.env.ORDER_EMAIL_FROM || "Torexia <onboarding@resend.dev>";

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendEmail(input: {
  to: string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY is not set.");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      reply_to: input.replyTo,
    }),
  });
  if (!res.ok) {
    throw new Error(`Email failed (${res.status}): ${await res.text().catch(() => "")}`);
  }
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
