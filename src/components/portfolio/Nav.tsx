import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { NAV_LINKS, CV_PATH } from "./data";
import { useActiveSection } from "./motion";
import fahadAsset from "@/assets/fahad.jpg.asset.json";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_LINKS.map((l) => l.id));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="group flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-accent/10 ring-1 ring-accent/30 transition-all group-hover:shadow-glow-sm">
            <img src={fahadAsset.url} alt="Fahad Al Noman" className="h-full w-full object-cover" />
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-tight text-foreground sm:inline">
            Fahad Al Noman
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="relative rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              {active === l.id && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-2 -bottom-0.5 h-[2px] rounded-full bg-accent shadow-glow-sm"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={CV_PATH}
            download
            className="hidden items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground shadow-glow-sm transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            <Download className="h-3.5 w-3.5" />
            Download CV
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  onClick={() => setOpen(false)}
                  className={`rounded-md px-3 py-2 text-sm transition-colors ${
                    active === l.id ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l.label}
                </a>
              ))}
              <a
                href={CV_PATH}
                download
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground"
              >
                <Download className="h-3.5 w-3.5" />
                Download CV
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
