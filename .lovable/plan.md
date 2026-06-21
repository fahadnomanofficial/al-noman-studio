# Fahad Al Noman — Portfolio Site Plan

A single-page, dark-themed, fully responsive portfolio with an "anti-gravity" motion system: floating/levitating elements that drift, parallax against scroll, and react to cursor movement.

## Anti-gravity motion system

A reusable motion layer (Framer Motion + a small `useMousePosition` + `useScroll` hook) applied across the site:

- **Floating hero objects** — the decorative code-editor mockup, accent orbs, and skill chips gently bob on a sine loop (translateY ±8px, 4–6s) so the page feels weightless.
- **Cursor parallax** — hero blobs and section accents shift a few pixels opposite the cursor (springy, damped).
- **Scroll parallax** — background gradient orbs and section dividers drift at different speeds via `useScroll` + `useTransform`.
- **Magnetic buttons** — primary CTAs and project cards lean toward the cursor on hover, then spring back.
- **Reveal-on-scroll** — sections fade + slide-up via `whileInView`, staggered children for grids.
- **Floating nav** — sticky top nav lifts on scroll (shadow + blur), active section underline animates.

All motion respects `prefers-reduced-motion` (disables loops and parallax, keeps fades).

## Visual system

Tokens added to `src/styles.css` under `@theme`:
- bg `#0B0E14`, surface `#11151D`, text `#F5F7FA`, muted `#A8B0BD`
- accent teal `#22E0C7`, amber `#F2A65A`
- gradient + glow tokens (`--shadow-glow`, `--gradient-accent`)
- fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (code/tags) — loaded via `<link>` in `__root.tsx`

shadcn button + card variants extended for the "glow" treatment. No hardcoded colors in components.

## Page structure (single route `/`)

Sticky nav (FN logo, links: About · Services · Work · Skills · Certifications · Contact, Download CV button) with smooth-scroll + active-section highlight via IntersectionObserver.

1. **Hero** — eyebrow pill, H1, subhead, supporting line, primary CTAs (View My Work, Download CV), tertiary Get in Touch link, floating code-editor mockup with the `const developer = {...}` snippet.
2. **About** — 2–3 paragraph bio from supplied content (Malta/Bangladesh, 5+ yrs, Sail Corp, education, Bangladesh Innovation Forum, AI-assisted dev).
3. **Services** — 4 floating cards (Web Dev, Digital Marketing, App Dev, AI-Assisted Dev).
4. **Experience** — vertical timeline with floating dot markers (Full Stack Dev, Frontend Dev, Freelance).
5. **Featured Work** — grid of project cards (5 Sail + 7 freelance), each linking out (`target="_blank" rel="noreferrer"`), stack tags in JetBrains Mono.
6. **Skills** — 4 grouped pill clusters (Web Dev, Digital Marketing, Infrastructure & Tools, Productivity).
7. **Certifications** — 6 Coursera links as cards.
8. **Contact** — heading, blurb, contact details, LinkedIn, form (Name/Email/Message) wired to `mailto:` with code comment about upgrading to Formspree/Resend, repeat Download CV.
9. **Footer** — name, quick nav, email + LinkedIn icons, © 2026.

## Files

- `src/routes/__root.tsx` — add Google Fonts `<link>` tags, update default meta.
- `src/routes/index.tsx` — set page title/description, render `<Portfolio />`.
- `src/styles.css` — add design tokens, font family vars, glow/gradient utilities.
- `src/components/portfolio/` — `Nav.tsx`, `Hero.tsx`, `About.tsx`, `Services.tsx`, `Experience.tsx`, `Work.tsx`, `Skills.tsx`, `Certifications.tsx`, `Contact.tsx`, `Footer.tsx`, `CodeMockup.tsx`, `FloatingOrbs.tsx`.
- `src/components/portfolio/motion.ts` — shared variants + `useMagnetic`, `useFloat`, `useParallax` hooks.
- `src/hooks/use-active-section.ts` — IntersectionObserver-based active nav state.
- CV download points to `/Fahad_Al_Noman_CV.pdf` (placeholder; user uploads later).

## Dependencies

- `framer-motion` (install via bun add).

## Content rules

Only the supplied facts. No invented testimonials, logos, stats, or app-store claims. "App Development" presented as a service offering.

## Out of scope (for now)

- Real CV PDF (user uploads later).
- Backend form handling (mailto only, upgrade noted in code comment).
- Light mode.
