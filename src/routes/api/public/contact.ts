import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(4).max(40),
  whatsapp: z.boolean().optional().default(false),
  message: z.string().trim().min(1).max(2000),
});

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { error: "Invalid input", details: parsed.error.flatten() },
            { status: 400 },
          );
        }

        const { name, email, phone, whatsapp, message } = parsed.data;
        const pass = process.env.GMAIL_APP_PASSWORD;
        if (!pass) {
          console.error("GMAIL_APP_PASSWORD not configured");
          return Response.json({ error: "Email not configured" }, { status: 500 });
        }

        const subject = "New Lead From Your Website";
        const text =
          `New lead from portfolio website\n\n` +
          `Name: ${name}\n` +
          `Email: ${email}\n` +
          `Phone: ${phone}\n` +
          `WhatsApp: ${whatsapp ? "Yes" : "No"}\n\n` +
          `Message:\n${message}\n`;
        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f7f7f7">
            <div style="background:#fff;border-radius:12px;padding:24px;border:1px solid #eee">
              <h2 style="margin:0 0 16px;color:#0B0E14">New Lead From Your Website</h2>
              <table style="width:100%;border-collapse:collapse;font-size:14px;color:#222">
                <tr><td style="padding:6px 0;color:#666;width:120px">Name</td><td style="padding:6px 0"><strong>${escapeHtml(name)}</strong></td></tr>
                <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
                <tr><td style="padding:6px 0;color:#666">Phone</td><td style="padding:6px 0">${escapeHtml(phone)}</td></tr>
                <tr><td style="padding:6px 0;color:#666">WhatsApp</td><td style="padding:6px 0">${whatsapp ? "✅ Yes" : "❌ No"}</td></tr>
              </table>
              <h3 style="margin:20px 0 8px;color:#0B0E14;font-size:14px">Message</h3>
              <div style="white-space:pre-wrap;background:#f1f5f9;border-radius:8px;padding:14px;font-size:14px;color:#0B0E14">${escapeHtml(message)}</div>
            </div>
            <p style="text-align:center;font-size:12px;color:#888;margin-top:16px">Sent from fahadalnoman.com contact form</p>
          </div>`;

        try {
          // Dynamic import keeps nodemailer out of the client bundle and only loads on the server.
          const nodemailer = (await import("nodemailer")).default;
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: "fahadnomanofficial@gmail.com",
              pass,
            },
          });

          await transporter.sendMail({
            from: '"Portfolio Website" <fahadnomanofficial@gmail.com>',
            to: "fahadalnoman2001@gmail.com",
            replyTo: `"${name}" <${email}>`,
            subject,
            text,
            html,
          });

          return Response.json({ ok: true });
        } catch (err) {
          console.error("SMTP send failed:", err);
          return Response.json(
            { error: "Failed to send email. Please email me directly at fahadnomanofficial@gmail.com." },
            { status: 502 },
          );
        }
      },
    },
  },
});
