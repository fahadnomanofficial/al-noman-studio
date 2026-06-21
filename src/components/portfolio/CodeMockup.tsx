import { motion } from "framer-motion";
import { useMousePosition } from "./motion";
import { useTransform } from "framer-motion";

export function CodeMockup() {
  const { x: mx, y: my } = useMousePosition();
  const rotX = useTransform(my, [-1, 1], [6, -6]);
  const rotY = useTransform(mx, [-1, 1], [-8, 8]);

  return (
    <motion.div
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1000 }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-full max-w-md will-change-transform"
    >
      <div className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-accent/40 via-accent/0 to-amber/30 opacity-60 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-glow">
        <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          <span className="ml-3 font-mono text-[11px] text-muted-foreground">~/portfolio/developer.ts</span>
        </div>
        <pre className="overflow-x-auto px-5 py-5 font-mono text-[12.5px] leading-relaxed text-muted-foreground">
{`const developer = {
  `}<span className="text-accent">name</span>{`: `}<span className="text-amber">"Fahad Al Noman"</span>{`,
  `}<span className="text-accent">role</span>{`: `}<span className="text-amber">"Full-Stack Dev + Marketer"</span>{`,
  `}<span className="text-accent">based</span>{`: `}<span className="text-amber">"Malta 🇲🇹"</span>{`,
  `}<span className="text-accent">stack</span>{`: [`}<span className="text-amber">"React"</span>{`, `}<span className="text-amber">"Laravel"</span>{`, `}<span className="text-amber">"SEO"</span>{`],
  `}<span className="text-accent">available</span>{`: `}<span className="text-foreground">true</span>{`,
};

`}<span className="text-foreground/70">// ships production platforms,</span>{`
`}<span className="text-foreground/70">// then grows them.</span>
        </pre>
      </div>
    </motion.div>
  );
}
