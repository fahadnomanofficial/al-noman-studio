import { motion } from "framer-motion";
import { fadeUp, staggerParent, viewportOnce } from "./motion";

export function SectionHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <motion.div
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={viewportOnce}
      className="mb-12 max-w-2xl"
    >
      <motion.div variants={fadeUp} className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
        ▸ {eyebrow}
      </motion.div>
      <motion.h2
        variants={fadeUp}
        className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
      >
        {title}
      </motion.h2>
      {intro && (
        <motion.p variants={fadeUp} className="mt-4 text-base leading-relaxed text-muted-foreground">
          {intro}
        </motion.p>
      )}
    </motion.div>
  );
}
