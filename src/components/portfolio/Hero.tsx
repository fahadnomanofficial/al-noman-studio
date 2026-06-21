import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { CV_PATH } from "./data";
import { CodeMockup } from "./CodeMockup";
import { fadeUp, staggerParent } from "./motion";

export function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div variants={staggerParent} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-accent">
            <Sparkles className="h-3 w-3" />
            Available for freelance & full-time roles
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            Fahad Al Noman
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-5 font-display text-xl text-foreground/85 sm:text-2xl">
            Full-Stack Web Developer & Digital Marketer,{" "}
            <span className="text-gradient-accent">based in Malta</span>.
          </motion.p>

          <motion.p variants={fadeUp} className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            I design and build production web platforms, then grow them — from clean React/Laravel code to SEO and ad campaigns that have driven <span className="font-mono text-accent">5M+ visits</span>.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-glow transition-transform hover:scale-[1.03]"
            >
              View My Work
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={CV_PATH}
              download
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold text-foreground transition-all hover:border-accent/50 hover:shadow-glow-sm"
            >
              <Download className="h-4 w-4" />
              Download CV
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-1 px-3 py-3 text-sm text-muted-foreground transition-colors hover:text-accent"
            >
              Get in touch <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-muted-foreground">
            <span>▸ 5+ yrs production</span>
            <span>▸ React · Laravel</span>
            <span>▸ SEO · Paid ads</span>
            <span>▸ AI-assisted dev</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] as any }}
          className="flex justify-center lg:justify-end"
        >
          <CodeMockup />
        </motion.div>
      </div>
    </section>
  );
}
