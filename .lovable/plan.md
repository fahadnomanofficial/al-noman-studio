## What we're changing

Two things at once, scoped tightly to design + content:

1. **Whole site → light, professional editorial palette.** Re-tone the existing portfolio (Hero, About, Work, Skills, Services, Experience, Certifications, Community, Contact, Footer, Nav) from the current dark surface to a refined light scheme. No layout, copy, or feature changes outside the blog detail page.
2. **Blog detail page → magazine-style, section-wise reading experience** with bigger type, a unique image per H2 section, and a polished light theme.

The blog detail page's existing functionality stays intact: TOC + reading progress, AI summary & Q&A, text‑to‑speech, likes/reactions/comments, share. Only the visuals, typography scale, and content/image structure change.

## Visual direction

Editorial light theme inspired by Stripe Press / The Verge long-reads / Linear's docs:

- Background: warm off-white `oklch(0.985 0.005 85)` with a true-white `surface` for cards.
- Foreground: near-black `oklch(0.18 0.01 260)` for body, soft graphite for muted.
- Accent: a single confident accent — deep editorial indigo `oklch(0.42 0.18 265)` — plus a warm secondary `oklch(0.62 0.16 50)` (amber) for tags and highlights.
- Borders: hairline `oklch(0.92 0.005 85)`.
- Shadows: soft, low-spread `0 1px 2px rgba(15,23,42,.04), 0 8px 24px -12px rgba(15,23,42,.08)`.
- Typography: keep the project's display/body pair but bump the article scale — body `19px / 1.75`, H2 `clamp(28px, 3.2vw, 40px)`, H3 `clamp(22px, 2.2vw, 28px)`, drop cap on first paragraph, generous 96px vertical rhythm between sections.

All values written as semantic tokens in `src/styles.css` — no hard-coded colors in components.

## Section-wise content + images

For each of the 4 posts in `src/components/portfolio/blogs.ts`:

- Keep the existing H2 sections (each post already has 3–4 H2s) and **expand the prose** under each by ~40–60% so the article feels substantial and professional (no fluff — concrete examples, numbers, anecdotes consistent with the post's voice).
- Add a `sections` field to `BlogPost`: an array of `{ heading, image, alt }`. The renderer matches each H2 in the markdown to its image and renders the image as a full-bleed figure directly under the heading.
- **Generate one unique 16:9 image per H2 section** (≈ 4 posts × 4 sections ≈ 16 images) saved under `src/assets/blog/<slug>/<section-slug>.jpg`. Style brief per image stays editorial: muted color grading, soft natural light, subject matter literal to the section (e.g. "Cache the right thing" → a clean shot of a server rack with warm overhead light; "Time zones are a feature" → a sunlit Maltese desk at dawn with a laptop). No stock-photo vibes, no AI clichés.

## Detail page rebuild

Rewrite `src/routes/blog.$slug.tsx` presentation layer:

- **Hero block**: small back link, tags row, oversized H1, byline with avatar + read time, then the cover image as a wide editorial figure with caption.
- **Two-column shell** on `lg+`: left rail (sticky TOC + reading progress), center column (article, max width ~720px for readability), right rail (sticky action card: Listen, Summarize, Ask AI, Like, Share).
- **Article body**: render markdown so every H2 is preceded by a numbered chapter eyebrow ("01 — Start with the boring schema"), followed by the section's generated image as a `<figure>` with caption, then the prose. Drop cap on the first paragraph of each section. Pull-quotes auto-extracted from `> blockquote` markdown.
- **Section dividers**: thin rule + section count, so the page reads as chapters.
- **End-of-article card**: author bio, reactions row, comment thread, "More from My Community" grid — all re-skinned to the light palette.
- AI panel + TTS controls move into the right rail action card; floating mobile bar on `< lg`.

## Technical details

Files touched:

- `src/styles.css` — flip token values to the light editorial palette; add `--font-size-article`, `--leading-article`, `--shadow-editorial`, `--gradient-accent` tokens.
- `src/components/portfolio/blogs.ts` — add `sections: { heading, image, alt }[]` to `BlogPost`, expand each post's `content`, import the new section images.
- `src/components/portfolio/{Hero,About,Work,Skills,Services,Experience,Certifications,Community,Contact,Footer,Nav,BlogCard}.tsx` — swap any hard-coded dark utilities for semantic tokens; tune contrast for the light theme. No structural changes.
- `src/routes/blog.$slug.tsx` — full presentation rewrite as described; logic (AI fetch, TTS, comments, likes, share) stays unchanged.
- `src/assets/blog/<slug>/*.jpg` — ~16 new generated section images via the agent-side image tool.
- `src/components/portfolio/FloatingOrbs.tsx` — soften or replace with a subtle paper-grain texture so the orbs don't fight the light palette.

No new dependencies. No backend changes. No changes to `src/routes/api/blog-ai.ts` or `src/routes/api/blog-tts.ts`.

## Out of scope

- Real comments backend (still localStorage).
- New posts or changing the 4 existing topics.
- Dark-mode toggle (site becomes light-only this pass; can add a toggle later if you want).

```text
Detail page (lg+)
┌─ TOC ──┬──────── ARTICLE ────────┬── ACTIONS ──┐
│ 01 …   │  Hero, cover, byline    │  Listen     │
│ 02 …   │  ── 01 Chapter ──       │  Summarize  │
│ 03 …   │  [section image]        │  Ask AI     │
│ 04 …   │  drop-cap prose…        │  Like  ♥    │
│ progress│  ── 02 Chapter ──      │  Share      │
└────────┴─────────────────────────┴─────────────┘
```
