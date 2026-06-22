## What we're building

A self-contained admin area at `/admin` with a login gate and a dashboard that mirrors every field/feature the public blog already has. Per your choice, this is a **UI-only mockup** — the editor is fully functional in the browser, but new/edited posts are NOT persisted to `blogs.ts` or a database (a static TS file can't be written at runtime). Posts created in admin live in component state for the session and can be exported as JSON/Markdown so you can paste them into `blogs.ts` manually.

No changes to the public site behavior, blog detail page design, or existing 4 posts.

## Routes & files

- `src/routes/admin.tsx` — pathless admin layout: checks `sessionStorage` for an admin flag, renders `<AdminLogin />` if missing, otherwise renders the admin shell + `<Outlet />`.
- `src/routes/admin.index.tsx` — redirects to `/admin/dashboard`.
- `src/routes/admin.dashboard.tsx` — overview cards: total posts, drafts, published, total reactions (read from localStorage), total comments (read from localStorage), recent activity list.
- `src/routes/admin.blogs.tsx` — table of all posts (title, slug, status, date, tags, reactions, comments) with row actions: Edit, Preview, Duplicate, Delete, Toggle publish. "New Post" button opens the editor.
- `src/routes/admin.blogs.new.tsx` and `src/routes/admin.blogs.$slug.edit.tsx` — full blog editor (see fields below).
- `src/routes/admin.reactions.tsx` — read-only table per post: 👍 ❤️ 🔥 🙌 counts (sourced from `localStorage` keys the public page already writes).
- `src/routes/admin.comments.tsx` — read-only list grouped by post with delete button (clears from localStorage).
- `src/routes/admin.seo.tsx` — per-post SEO overview: meta title length meter, meta description length meter, OG image presence, canonical URL, keywords, warnings (missing alt text, title > 60 chars, description > 160 chars).
- `src/components/admin/AdminLogin.tsx` — email + password form, compares against hardcoded `fahadnomanofficial@gmail.com` / `Fahad@0210`, sets `sessionStorage["lovable_admin"] = "1"` on success.
- `src/components/admin/AdminShell.tsx` — sidebar nav (Dashboard, Blogs, Reactions, Comments, SEO, Sign out) + top bar.
- `src/components/admin/BlogEditor.tsx` — the form (split into tabs: Content / Sections / SEO / Publishing / Author).
- `src/components/admin/blog-storage.ts` — in-memory + sessionStorage store seeded from `blogs.ts`; exposes `listPosts / getPost / upsertPost / deletePost / exportAll`.

## Blog editor fields (all tabs)

**Content tab** — title, slug (auto from title, editable), excerpt, cover image (URL or upload-to-data-URL), tags (chips), markdown content (textarea with live preview pane), read time (auto-calculated, editable).

**Sections tab** — repeatable list matching today's `sections: { heading, image, alt }[]` shape. Each row: heading text, image URL/upload, alt text, drag-to-reorder.

**SEO tab** — meta title, meta description, OG image, canonical URL, keywords (chips), `noindex` toggle. Inline length meters and warnings.

**Publishing tab** — status (draft/published) toggle, publish date picker, featured toggle, order/weight.

**Author tab** — author name, avatar URL, bio override (defaults to site author).

Footer actions: Save (writes to in-memory store + sessionStorage), Preview (opens `/blog/<slug>` in a new tab using the in-memory post), Export JSON, Export Markdown (downloads `.md` with frontmatter), Delete.

## Auth (hardcoded, UI-only)

- Credentials: `fahadnomanofficial@gmail.com` / `Fahad@0210` (string-compared client-side).
- Session flag: `sessionStorage["lovable_admin"] = "1"` — cleared on Sign out and on tab close.
- No route-level redirects, no SSR auth, no backend. The whole admin tree is rendered client-side after the flag check.

**Security note (must be said):** since the password is hardcoded in the client bundle, anyone who views the JS can read it. This matches your "UI-only mockup" choice. When you're ready for a real admin, switch to Lovable Cloud auth + a `user_roles` admin role.

## Persistence behavior

- On first admin load, the store is seeded from the existing `blogs.ts` array.
- Edits/new posts live in `sessionStorage["lovable_admin_posts"]` so they survive page reloads within the tab.
- The public site (`/blog/:slug`, homepage Community section) continues to read from `blogs.ts` and is **not** affected by admin edits — this is the consequence of the static-file choice.
- "Export" buttons let you copy the JSON/Markdown for a post and paste into `blogs.ts` manually to actually publish it.
- Reactions and comments shown in admin are read from the same localStorage keys the public detail page already writes (`blog-likes-<slug>`, `blog-comments-<slug>`, etc.) — no migration, no new schema.

## Out of scope

- No database, no Lovable Cloud, no email/password reset, no multi-user, no real role system.
- No changes to public blog rendering or styling.
- No image uploads to a CDN — images use URLs or in-browser data URLs only.
- No automated write-back to `blogs.ts` (impossible at runtime; export is the workaround).

## Technical notes

- All admin routes live under `/admin` and reuse the existing light editorial theme tokens.
- New shadcn primitives used: existing `Tabs`, `Table`, `Dialog`, `Form`, `Input`, `Textarea`, `Switch`, `Badge`, `Button`. No new dependencies.
- `BlogPost` type in `src/components/portfolio/blogs.ts` gets optional fields added (`status?`, `featured?`, `seo?: { metaTitle?, metaDescription?, ogImage?, canonical?, keywords?, noindex? }`, `author?: { name?, avatar?, bio? }`) — all optional so existing 4 posts and their renderer keep working unchanged.
- Markdown export uses simple YAML frontmatter; no new libs.

```text
/admin
 ├── (not logged in) → AdminLogin
 └── (logged in)
     ├── /admin/dashboard      stats overview
     ├── /admin/blogs          table + New Post
     │    ├── /new             editor
     │    └── /:slug/edit      editor
     ├── /admin/reactions      read-only counts
     ├── /admin/comments       read-only + delete
     └── /admin/seo            per-post SEO audit
```
