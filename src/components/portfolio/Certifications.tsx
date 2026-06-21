import { motion } from "framer-motion";
import { Award, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { CERTIFICATIONS } from "./data";
import { fadeUp, staggerParent, viewportOnce } from "./motion";

export function Certifications() {
  return (
    <section id="certifications" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader eyebrow="certifications" title="Continuous learning." />

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-4 sm:grid-cols-2"
        >
          {CERTIFICATIONS.map((c) => (
            <motion.a
              key={c.name}
              variants={fadeUp}
              whileHover={{ x: 4 }}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="group flex items-start gap-4 rounded-2xl border border-border bg-surface p-5 transition-all hover:border-accent/40 hover:shadow-glow-sm"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent ring-1 ring-accent/30">
                <Award className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-semibold text-foreground transition-colors group-hover:text-accent">
                  {c.name}
                </h3>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">{c.issuer}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
