import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { EXPERIENCE } from "./data";
import { fadeUp, staggerParent, viewportOnce } from "./motion";

export function Experience() {
  return (
    <section id="experience" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader eyebrow="experience" title="Where I've shipped." />

        <motion.ol
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="relative ml-3 border-l border-border sm:ml-6"
        >
          {EXPERIENCE.map((e) => (
            <motion.li variants={fadeUp} key={e.role + e.period} className="relative pl-6 pb-12 last:pb-0 sm:pl-10">
              <motion.span
                animate={{ scale: [1, 1.2, 1], boxShadow: ["0 0 0 0 rgba(34,224,199,0.6)", "0 0 0 8px rgba(34,224,199,0)", "0 0 0 0 rgba(34,224,199,0)"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-accent"
              />
              <div className="font-mono text-[11px] uppercase tracking-wider text-accent">{e.period}</div>
              <h3 className="mt-2 font-display text-xl font-semibold text-foreground">
                {e.role} <span className="text-muted-foreground">· {e.company}</span>
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                {e.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  );
}
