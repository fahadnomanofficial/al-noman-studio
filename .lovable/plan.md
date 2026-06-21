
# Plan: Photo, WhatsApp, and Email-sending Contact Form

## 1. Add your photo
- Upload `download (2)0.png` to the CDN via `lovable-assets` → `src/assets/fahad.jpg.asset.json`.
- Use it in the **About** section as a floating, rounded portrait (anti-gravity bob + subtle glow ring) on the left, bio text on the right. Keeps the hero's code mockup intact so the hero still reads as "developer".

## 2. Contact form — add phone + WhatsApp checkbox
In `src/components/portfolio/Contact.tsx`:
- Add a **Phone** input (required, with light validation).
- Add a checkbox: **"This number is on WhatsApp"** (default checked).
- Both fields included in the email payload sent to you.

## 3. Send real emails (not mailto)
The form will POST to a new server route `src/routes/api/public/contact.ts` that:
- Validates input with Zod (name, email, phone, whatsapp bool, message; length limits).
- Sends mail via **Gmail SMTP** using `nodemailer`:
  - host `smtp.gmail.com`, port `465`, secure `true`
  - user `fahadnomanofficial@gmail.com`, pass = `GMAIL_APP_PASSWORD` secret
  - **To:** `fahadalnoman2001@gmail.com`
  - **Subject:** `New Lead From Your Website`
  - **Reply-To:** the submitter's email
  - HTML + text body with name, email, phone, WhatsApp yes/no, message.
- Returns `{ ok: true }` or a 4xx/5xx with a safe error message.

Frontend swaps the `mailto:` handler for a `fetch('/api/public/contact', …)` call with loading/success/error states (toast via existing `sonner`).

### Secrets
I'll request **`GMAIL_APP_PASSWORD`** via the secrets tool so the app password is never in code or git. The Gmail address is not secret and stays as a constant.

### Runtime note (important)
The server runs on Cloudflare Workers (workerd) with `nodejs_compat`. `nodemailer` over SMTP **may not work** in that runtime because raw outbound TCP/TLS sockets to arbitrary hosts aren't reliably supported. If SMTP fails at runtime, the cleanest fix is one of:
- **(A) Resend / SendGrid HTTP API** (recommended, 1-line swap, free tier covers this volume), or
- **(B) Lovable Cloud's built-in email infrastructure** (requires enabling Cloud + a sender domain).

I'll implement SMTP first as you specified and verify it in the deployed preview; if it errors, I'll come back and recommend switching to (A) or (B). No fallback `mailto` — failures will surface as a clear toast.

## 4. Contact info — WhatsApp entry
In the contact info list (left column) add a **WhatsApp** row with the same number `+356 9978 4477`, linking to `https://wa.me/35699784477` (opens WhatsApp), using the `MessageCircle` icon from lucide. Keep the existing Phone row.

## Files touched
- `src/assets/fahad.jpg.asset.json` (new — CDN pointer)
- `src/components/portfolio/About.tsx` (add portrait, 2-column layout)
- `src/components/portfolio/Contact.tsx` (phone + WhatsApp checkbox, fetch handler, WhatsApp info row)
- `src/components/portfolio/data.ts` (add `whatsapp` URL constant)
- `src/routes/api/public/contact.ts` (new — SMTP send via nodemailer)
- `package.json` (add `nodemailer` + `@types/nodemailer`)

## Out of scope
- No rate limiting (not a standard backend primitive here).
- No captcha — can add hCaptcha later if spam appears.
