import { Mail, Linkedin } from "lucide-react";
import { NAV_LINKS, CONTACT } from "./data";
import fahadAsset from "@/assets/fahad.jpg.asset.json";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center sm:px-8">
        <div className="flex items-center gap-3">
          <img
            src={fahadAsset.url}
            alt="Fahad Al Noman"
            className="h-9 w-9 rounded-xl object-cover ring-1 ring-accent/30"
          />
          <div>
            <div className="font-display text-sm font-semibold text-foreground">Fahad Al Noman</div>
            <div className="font-mono text-[11px] text-muted-foreground">Full-Stack Dev · Worldwide</div>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} className="transition-colors hover:text-accent">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`mailto:${CONTACT.email}`}
            aria-label="Email"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-muted-foreground transition-all hover:border-accent/50 hover:text-accent"
          >
            <Mail className="h-4 w-4" />
          </a>
          <a
            href={CONTACT.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-surface text-muted-foreground transition-all hover:border-accent/50 hover:text-accent"
          >
            <Linkedin className="h-4 w-4" />
          </a>
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-6xl px-5 font-mono text-[11px] text-muted-foreground sm:px-8">
        © 2026 Fahad Al Noman. All rights reserved.
      </div>
    </footer>
  );
}
