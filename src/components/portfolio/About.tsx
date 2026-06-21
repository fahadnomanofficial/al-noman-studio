import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { fadeUp, staggerParent, viewportOnce } from "./motion";

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader eyebrow="about" title="Engineer who ships, marketer who measures." />

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-10 lg:grid-cols-[1.6fr_1fr]"
        >
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <motion.p variants={fadeUp}>
              Originally from Bangladesh and now based in Qormi, Malta, I've spent the last 5+ years building and scaling production platforms at <span className="text-foreground">Sail Corporation</span> in Dhaka — progressing from Frontend Developer to Full Stack Developer as I took on more of the backend and infrastructure stack.
            </motion.p>
            <motion.p variants={fadeUp}>
              My work pairs hands-on engineering — React, PHP/Laravel, PostgreSQL/MySQL, VPS ops — with applied digital marketing. I led SEO improvements on a classifieds marketplace and ran paid campaigns that drove over <span className="text-accent">5 million visits</span> to a property platform. Code that ships <em>and</em> code that compounds.
            </motion.p>
            <motion.p variants={fadeUp}>
              I hold a BA in Business Economics from Times University, Bangladesh, and I'm currently completing an OTHM Level 4 Diploma in Business Management in Malta. Earlier in my career I volunteered with the <span className="text-foreground">Bangladesh Innovation Forum</span> (2017–2020), running 20+ innovation and career programs and mentoring a NASA Problem Solving Challenge team. Today I actively work with AI-assisted ("vibe coding") workflows as part of my modern engineering toolkit.
            </motion.p>
          </div>

          <motion.aside
            variants={fadeUp}
            className="relative rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur"
          >
            <div className="absolute -inset-px -z-10 rounded-2xl bg-gradient-to-br from-accent/20 via-transparent to-amber/20 opacity-60 blur" />
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">▸ profile</div>
            <dl className="mt-4 space-y-4 text-sm">
              {[
                ["Location", "Qormi, Malta"],
                ["Experience", "5+ years production"],
                ["Focus", "Full-Stack + Growth"],
                ["Languages", "EN · BN"],
                ["Open to", "Freelance · Remote EU"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{k}</dt>
                  <dd className="text-right font-display text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.aside>
        </motion.div>
      </div>
    </section>
  );
}
