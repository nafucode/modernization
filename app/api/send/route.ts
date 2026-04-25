import { Resend } from "resend";

export const runtime = "nodejs";
export const maxDuration = 60;

const TO = "info@xinfuji.com";
const FROM = process.env.RESEND_FROM || "Survey <onboarding@resend.dev>";

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  const { filename, base64, projectName } = (await request.json()) as {
    filename: string;
    base64: string;
    projectName?: string;
  };

  if (!filename || !base64) {
    return Response.json({ error: "Missing filename or base64" }, { status: 400 });
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: TO,
    subject: `Electrical Survey — ${projectName || "Untitled"}`,
    text: `New survey submission attached.\n\nProject: ${projectName || "(untitled)"}\nFile: ${filename}`,
    attachments: [{ filename, content: base64 }],
  });

  if (error) {
    return Response.json({ error: error.message || "Send failed" }, { status: 502 });
  }
  return Response.json({ ok: true, id: data?.id });
}
