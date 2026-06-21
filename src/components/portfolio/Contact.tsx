import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Linkedin, Download, Send } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { CONTACT, CV_PATH } from "./data";
import { fadeUp, staggerParent, viewportOnce } from "./motion";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // NOTE: This form opens the user's mail client via `mailto:`.
  // Upgrade path: wire to Formspree, Resend, or a server function for proper delivery.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio enquiry from ${form.name || "—"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="contact"
          title="Let's build something."
          intro="Open to freelance projects and full-time remote / EU roles. Based in Qormi, Malta."
        />

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-6 lg:grid-cols-[1fr_1.2fr]"
        >
          <motion.div variants={fadeUp} className="space-y-4">
            {[
              { Icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
              { Icon: Phone, label: "Phone", value: CONTACT.phone, href: `tel:${CONTACT.phone.replace(/\s/g, "")}` },
              { Icon: MapPin, label: "Location", value: CONTACT.location },
              { Icon: Linkedin, label: "LinkedIn", value: "fahad-al-noman", href: CONTACT.linkedin },
            ].map(({ Icon, label, value, href }) => {
              const content = (
                <>
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
                    <div className="truncate font-display text-foreground">{value}</div>
                  </div>
                </>
              );
              return href ? (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-all hover:border-accent/40 hover:shadow-glow-sm"
                >
                  {content}
                </a>
              ) : (
                <div key={label} className="flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
                  {content}
                </div>
              );
            })}

            <a
              href={CV_PATH}
              download
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition-transform hover:scale-[1.02]"
            >
              <Download className="h-4 w-4" />
              Download CV
            </a>
          </motion.div>

          <motion.form
            variants={fadeUp}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-surface p-6 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Name</span>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Email</span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
                />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">Message</span>
              <textarea
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
              />
            </label>
            <button
              type="submit"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition-transform hover:scale-[1.02] sm:w-auto"
            >
              <Send className="h-4 w-4" />
              Send Message
            </button>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
