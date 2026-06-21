import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { SKILL_GROUPS } from "./data";
import { fadeUp, staggerParent, viewportOnce } from "./motion";

export function Skills() {
  return (
    <section id="skills" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader eyebrow="skills" title="The toolkit." />

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-5 md:grid-cols-2"
        >
          {SKILL_GROUPS.map((g) => (
            <motion.div
              key={g.title}
              variants={fadeUp}
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">▸ {g.title}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {g.items.map((item, i) => (
                  <motion.span
                    key={item}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.025, duration: 0.4 }}
                    whileHover={{ y: -3, scale: 1.04 }}
                    className="cursor-default rounded-lg border border-border bg-background/60 px-3 py-1.5 font-mono text-[12px] text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    {item}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
