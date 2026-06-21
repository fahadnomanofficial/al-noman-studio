import { motion } from "framer-motion";
import { Code2, TrendingUp, Smartphone, Sparkles } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SERVICES } from "./data";
import { fadeUp, staggerParent, viewportOnce } from "./motion";

const ICONS = [Code2, TrendingUp, Smartphone, Sparkles];

export function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="services"
          title="What I do"
          intro="A small, deliberate set of services. Each one I've actually shipped in production — not a buffet."
        />

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-5 sm:grid-cols-2"
        >
          {SERVICES.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={s.title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:border-accent/40 hover:shadow-glow-sm"
              >
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-3">
                    <h3 className="font-display text-xl font-semibold text-foreground">{s.title}</h3>
                    <span className="font-mono text-[11px] text-muted-foreground">{s.tag}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
