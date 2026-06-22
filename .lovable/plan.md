
# My Community — Blog section + futuristic detail page

## 1. Content (hardcoded)

New file `src/components/portfolio/blogs.ts` exports 4 sample posts:

```ts
type BlogPost = {
  slug: string;        // URL segment
  title: string;
  excerpt: string;     // 1–2 lines, used on homepage card
  cover: string;       // generated cover image
  date: string;        // e.g. "Jun 20, 2026"
  readMinutes: number;
  tags: string[];
  author: { name: "Fahad Al Noman"; avatar: <fahad.jpg asset> };
  content: string;     // markdown body with ## headings (drives TOC)
};
```

I'll write 4 starter posts in Fahad's voice (topics: building Bonikbazar, SEO that drove 5M visits, vibe coding with AI, freelancing worldwide from Malta). Covers are generated images saved to `src/assets/blog/*.jpg`.

## 2. Homepage "My Community" section

New `src/components/portfolio/Community.tsx`, mounted in `src/routes/index.tsx` **between Work and Skills** (per your answer).

- Section title: **"My Community"** with eyebrow `▸ writing & ideas` and a tagline like *"Notes from building on the web — lessons, experiments, and the people I learn with."*
- 4-card responsive grid (1 / 2 / 4 cols). Each card: cover image with subtle zoom-on-hover, date · read-time, title, 2-line excerpt, tag pills, "Read →" link.
- Cards are `<Link to="/blog/$slug" params={{ slug }}>` (TanStack typed link).
- Add `{ id: "community", label: "Community" }` to `NAV_LINKS` so it appears in the nav and active-section tracker.

## 3. Blog detail route — futuristic & lite

New file `src/routes/blog.$slug.tsx` with `head()` per-post (title, description, og:title/description/image = cover, JSON-LD `Article`).

Layout (light, editorial, lots of whitespace; same dark theme tokens as the site, no new color system):

```text
[ sticky reading-progress bar — accent gradient, top of viewport ]
[ <- back to community ]
[ TAG · DATE · X min read ]
[ H1 title ]
[ author row: avatar + name + share buttons ]
[ cover image — large, rounded, soft glow ]

[ 2-column on desktop ]
  [ left rail — sticky ]            [ article body — prose ]
    • Auto TOC (scrolls to            Rendered from markdown
      active heading)                 via `react-markdown` +
    • Listen ▶ (TTS)                  `remark-gfm`. Headings
    • Summarize ✨ (AI)               get ids for TOC anchors.
    • Like ♥ count
    • Comments count → scroll
  [ on mobile: collapsible drawer ]

[ AI panel (appears when Summarize or Ask is opened) ]
  • TL;DR (3 bullets, streamed)
  • "Ask about this post" chat input (streamed answers grounded in post content)

[ Reactions bar — 👍 ❤️ 🔥 💡 — localStorage counts ]
[ Comments — name + message, localStorage-persisted, newest first ]
[ Share row — copy link, X/Twitter, LinkedIn, WhatsApp ]
[ "More from My Community" — 3 other posts ]
```

### Futuristic features (your selections)
- **Reading progress bar + TOC** — scroll-linked progress via framer-motion `useScroll`; TOC built from `##`/`###` headings with `IntersectionObserver` highlighting the active section.
- **AI Summary & Q&A** — uses **Lovable AI Gateway** (`google/gemini-3-flash-preview`) via a new TanStack server function `src/lib/blog-ai.functions.ts` exposing `summarizePost({slug})` and `askPost({slug, question, history})`. Both stream back. The post body is loaded server-side from `blogs.ts` so the client never has to send the whole article.
- **Text-to-speech** — new `src/routes/api/blog-tts.ts` (server route) proxies to Lovable AI `/v1/audio/speech` with `model: openai/gpt-4o-mini-tts`, voice `alloy`, SSE + PCM streaming. The "Listen" button on the detail page plays it back via Web Audio (chunked, with play/pause). The post body is chunked at sentence boundaries so long posts work.
- **Likes + comments + share** — likes and comments are stored in `localStorage` (keyed by slug) so it's instant and needs no backend. Share buttons use the Web Share API where available with a copy-link fallback and direct intent URLs for X/LinkedIn/WhatsApp.

## 4. SEO

- Homepage `head()` keeps its current meta; the Community section adds `BlogPosting` items inside a `Blog` JSON-LD block referencing the 4 posts.
- Each post route sets its own `<title>`, meta description, canonical, og:image (the cover), and `Article` JSON-LD with author = Fahad Al Noman.

## 5. Files

New:
- `src/components/portfolio/blogs.ts` — posts data + helpers (`getPost(slug)`, `allPosts()`).
- `src/components/portfolio/Community.tsx` — homepage section.
- `src/components/portfolio/BlogCard.tsx` — reusable card.
- `src/routes/blog.$slug.tsx` — detail page (+ `head()`, `notFoundComponent`, `errorComponent`).
- `src/lib/blog-ai.functions.ts` — `summarizePost`, `askPost` server functions (AI SDK + Lovable Gateway, streamed via `toUIMessageStreamResponse`-style or simple text stream).
- `src/routes/api/blog-tts.ts` — TTS SSE proxy server route.
- `src/assets/blog/*.jpg` — 4 generated cover images (one per post).

Edited:
- `src/routes/index.tsx` — import and mount `<Community />` between `<Work />` and `<Skills />`.
- `src/components/portfolio/data.ts` — add `{ id: "community", label: "Community" }` to `NAV_LINKS`.

## 6. Dependencies

`bun add ai @ai-sdk/openai-compatible react-markdown remark-gfm eventsource-parser`

(No new fonts. Reuses existing design tokens — no new colors, no purple gradients, stays on the site's current dark editorial palette.)

## Out of scope

- No CMS/admin UI (hardcoded as you chose).
- No persistent comments DB (localStorage only — switch to Lovable Cloud later if you want real comments across devices).
- No new auth — Q&A and TTS endpoints are public, with input length capped server-side.
