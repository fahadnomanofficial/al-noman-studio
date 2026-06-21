import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";
import { SAIL_PROJECTS, FREELANCE_PROJECTS } from "./data";
import { fadeUp, staggerParent, viewportOnce } from "./motion";

type Project = { name: string; url: string; desc: string; stack: string[] };

function ProjectCard({ p }: { p: Project }) {
  return (
    <motion.a
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      href={p.url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all hover:border-accent/40 hover:shadow-glow-sm"
    >
      <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
            {p.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
        </div>
        <ArrowUpRight className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
      </div>
      <div className="relative flex flex-wrap gap-1.5">
        {p.stack.map((s) => (
          <span
            key={s}
            className="rounded-md border border-border bg-background/60 px-2 py-0.5 font-mono text-[10.5px] text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>
    </motion.a>
  );
}

export function Work() {
  return (
    <section id="work" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="featured work"
          title="Selected projects."
          intro="Platforms shipped at Sail Corporation and end-to-end builds delivered to freelance clients."
        />

        <div className="mb-6 flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-accent">▸ sail corporation</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SAIL_PROJECTS.map((p) => <ProjectCard key={p.name} p={p} />)}
        </motion.div>

        <div className="mt-16 mb-6 flex items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-accent">▸ freelance</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FREELANCE_PROJECTS.map((p) => <ProjectCard key={p.name} p={p} />)}
        </motion.div>
      </div>
    </section>
  );
}
