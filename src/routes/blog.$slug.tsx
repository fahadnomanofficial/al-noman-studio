import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createParser } from "eventsource-parser";
import {
  ArrowLeft,
  ArrowUpRight,
  Heart,
  MessageCircle,
  Play,
  Pause,
  Sparkles,
  Send,
  Share2,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { getPost, allPosts, type BlogPost } from "@/components/portfolio/blogs";
import fahadAsset from "@/assets/fahad.jpg.asset.json";
import { Nav } from "@/components/portfolio/Nav";
import { Footer } from "@/components/portfolio/Footer";
import { FloatingOrbs } from "@/components/portfolio/FloatingOrbs";
import { toast } from "sonner";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }): { post: BlogPost } => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post as BlogPost | undefined;
    if (!post) return { meta: [{ title: "Post not found" }] };
    const title = `${post.title} — My Community · Fahad Al Noman`;
    return {
      meta: [
        { title },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:image", content: post.cover },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.excerpt },
        { name: "twitter:image", content: post.cover },
      ],
      links: [{ rel: "canonical", href: `/blog/${post.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: post.cover,
            datePublished: post.date,
            author: { "@type": "Person", name: "Fahad Al Noman" },
            keywords: post.tags.join(", "),
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Post not found</h1>
        <p className="mt-3 text-muted-foreground">That article does not exist (or it moved).</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-2 text-accent">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
      </div>
    </div>
  ),
  component: BlogPostPage,
});

type TocItem = { id: string; text: string; level: 2 | 3 };
type ChatMessage = { role: "user" | "assistant"; content: string };

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  for (const line of markdown.split("\n")) {
    const m2 = /^##\s+(.+)$/.exec(line);
    const m3 = /^###\s+(.+)$/.exec(line);
    if (m2) items.push({ id: slugify(m2[1]), text: m2[1], level: 2 });
    else if (m3) items.push({ id: slugify(m3[1]), text: m3[1], level: 3 });
  }
  return items;
}

function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

function chunkForTTS(text: string, maxWords = 350): string[] {
  const wc = (s: string) => (s.match(/\S+/g) ?? []).length;
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g) ?? [text];
  const chunks: string[] = [];
  let current = "";
  const flush = () => {
    if (current.trim()) chunks.push(current.trim());
    current = "";
  };
  for (const s of sentences) {
    if (wc(s) > maxWords) {
      flush();
      const words = s.match(/\S+/g) ?? [];
      for (let i = 0; i < words.length; i += maxWords) {
        chunks.push(words.slice(i, i + maxWords).join(" "));
      }
      continue;
    }
    if (current && wc(current) + wc(s) > maxWords) flush();
    current += s;
  }
  flush();
  return chunks;
}

function stripMarkdown(md: string) {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\n{2,}/g, "\n\n");
}

function BlogPostPage() {
  const { post } = Route.useLoaderData() as { post: BlogPost };
  const { scrollYProgress } = useScroll();
  const toc = useMemo(() => extractToc(post.content), [post.content]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const articleRef = useRef<HTMLDivElement | null>(null);

  // Likes (localStorage)
  const [likes, setLikes] = useLocalStorage<number>(`blog:${post.slug}:likes`, 0);
  const [liked, setLiked] = useLocalStorage<boolean>(`blog:${post.slug}:liked`, false);

  // Reactions
  const REACTIONS = [
    { key: "fire", emoji: "🔥" },
    { key: "idea", emoji: "💡" },
    { key: "clap", emoji: "👏" },
    { key: "love", emoji: "❤️" },
  ] as const;
  const [reactions, setReactions] = useLocalStorage<Record<string, number>>(
    `blog:${post.slug}:reactions`,
    {},
  );

  // Comments
  type Comment = { id: string; name: string; message: string; at: number };
  const [comments, setComments] = useLocalStorage<Comment[]>(`blog:${post.slug}:comments`, []);
  const [cName, setCName] = useState("");
  const [cMsg, setCMsg] = useState("");

  // AI summary
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  // AI Q&A
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [askLoading, setAskLoading] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  // TTS
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<{ ctx: AudioContext | null; abort: AbortController | null }>({
    ctx: null,
    abort: null,
  });

  // Active TOC tracking
  useEffect(() => {
    if (!articleRef.current) return;
    const headings = Array.from(articleRef.current.querySelectorAll("h2, h3")) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActiveId((visible.target as HTMLElement).id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 1] },
    );
    headings.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [post.slug]);

  async function runSummary() {
    setAiOpen(true);
    setSummary("");
    setSummaryLoading(true);
    try {
      const res = await fetch("/api/blog-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: post.slug, mode: "summary" }),
      });
      if (!res.ok || !res.body) throw new Error(`Failed (${res.status})`);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setSummary((s) => s + dec.decode(value));
      }
    } catch (e) {
      toast.error("Could not generate summary.");
    } finally {
      setSummaryLoading(false);
    }
  }

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || askLoading) return;
    setAiOpen(true);
    setQuestion("");
    const history = chat.slice(-8);
    setChat((c) => [...c, { role: "user", content: q }, { role: "assistant", content: "" }]);
    setAskLoading(true);
    try {
      const res = await fetch("/api/blog-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: post.slug, mode: "ask", question: q, history }),
      });
      if (!res.ok || !res.body) throw new Error(`Failed (${res.status})`);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value);
        setChat((c) => {
          const next = [...c];
          next[next.length - 1] = {
            role: "assistant",
            content: next[next.length - 1].content + chunk,
          };
          return next;
        });
      }
    } catch (err) {
      setChat((c) => {
        const next = [...c];
        next[next.length - 1] = {
          role: "assistant",
          content: "Sorry — I could not reach the AI just now. Try again in a moment.",
        };
        return next;
      });
    } finally {
      setAskLoading(false);
    }
  }

  async function stopAudio() {
    audioRef.current.abort?.abort();
    try {
      await audioRef.current.ctx?.close();
    } catch {
      /* ignore */
    }
    audioRef.current = { ctx: null, abort: null };
    setPlaying(false);
  }

  async function playAudio() {
    if (playing) {
      await stopAudio();
      return;
    }
    const text = stripMarkdown(`${post.title}. ${post.content}`);
    const chunks = chunkForTTS(text);
    const ctx = new AudioContext({ sampleRate: 24000 });
    if (ctx.state === "suspended") await ctx.resume().catch(() => {});
    const abort = new AbortController();
    audioRef.current = { ctx, abort };
    setPlaying(true);
    let playhead = 0;

    try {
      for (const chunk of chunks) {
        if (abort.signal.aborted) break;
        const res = await fetch("/api/blog-tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: chunk }),
          signal: abort.signal,
        });
        if (!res.ok || !res.body) throw new Error(`TTS failed (${res.status})`);
        const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
        let pending = new Uint8Array(0);
        const parser = createParser({
          onEvent(event) {
            let payload: { type?: string; audio?: string };
            try {
              payload = JSON.parse(event.data);
            } catch {
              return;
            }
            if (payload.type !== "speech.audio.delta" || !payload.audio) return;
            const bin = atob(payload.audio);
            const incoming = new Uint8Array(bin.length);
            for (let i = 0; i < bin.length; i++) incoming[i] = bin.charCodeAt(i);
            const bytes = new Uint8Array(pending.length + incoming.length);
            bytes.set(pending);
            bytes.set(incoming, pending.length);
            const usable = bytes.length - (bytes.length % 2);
            pending = bytes.slice(usable);
            if (usable === 0) return;
            const samples = new Int16Array(bytes.buffer, 0, usable / 2);
            const floats = Float32Array.from(samples, (s) => s / 32768);
            const buffer = ctx.createBuffer(1, floats.length, 24000);
            buffer.copyToChannel(floats, 0);
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            if (playhead === 0) playhead = ctx.currentTime + 0.1;
            else playhead = Math.max(playhead, ctx.currentTime);
            source.start(playhead);
            playhead += buffer.duration;
          },
        });
        while (true) {
          const { done, value } = await reader.read();
          if (done || abort.signal.aborted) break;
          parser.feed(value);
        }
      }
      // Stop indicator after audio finishes
      const remaining = Math.max(0, playhead - ctx.currentTime);
      setTimeout(() => {
        if (audioRef.current.ctx === ctx) {
          stopAudio();
        }
      }, remaining * 1000 + 200);
    } catch (err) {
      if (!abort.signal.aborted) toast.error("Could not play audio.");
      await stopAudio();
    }
  }

  function share(target: "copy" | "twitter" | "linkedin" | "whatsapp" | "native") {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${post.title} — by Fahad Al Noman`;
    if (target === "native" && typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: post.title, text: post.excerpt, url }).catch(() => {});
      return;
    }
    if (target === "copy") {
      navigator.clipboard?.writeText(url).then(
        () => toast.success("Link copied"),
        () => toast.error("Could not copy"),
      );
      return;
    }
    const intents: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    };
    window.open(intents[target], "_blank", "noopener,noreferrer");
  }

  function addComment(e: React.FormEvent) {
    e.preventDefault();
    if (!cName.trim() || !cMsg.trim()) return;
    setComments([
      { id: crypto.randomUUID(), name: cName.trim(), message: cMsg.trim(), at: Date.now() },
      ...comments,
    ]);
    setCMsg("");
  }

  const moreFromCommunity = allPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <FloatingOrbs />
      <Nav />

      {/* Reading progress bar */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-accent via-accent to-amber"
      />

      <main className="pt-28 pb-24">
        <article className="mx-auto max-w-3xl px-5 sm:px-8">
          <Link
            to="/"
            hash="community"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> back to My Community
          </Link>

          <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full border border-accent/30 bg-accent/5 px-2.5 py-0.5 text-accent">
                {t}
              </span>
            ))}
            <span>·</span>
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readMinutes} min read</span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            {post.title}
          </h1>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={fahadAsset.url}
                alt="Fahad Al Noman"
                className="h-10 w-10 rounded-full object-cover ring-1 ring-accent/30"
              />
              <div className="text-sm">
                <div className="font-semibold text-foreground">Fahad Al Noman</div>
                <div className="text-xs text-muted-foreground">Full-Stack Dev · Writing from Malta</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ShareBtn onClick={() => share("copy")} label="Copy link"><LinkIcon className="h-4 w-4" /></ShareBtn>
              <ShareBtn onClick={() => share("twitter")} label="Share on X">𝕏</ShareBtn>
              <ShareBtn onClick={() => share("linkedin")} label="Share on LinkedIn">in</ShareBtn>
              <ShareBtn onClick={() => share("whatsapp")} label="Share on WhatsApp"><Share2 className="h-4 w-4" /></ShareBtn>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-glow">
            <img
              src={post.cover}
              alt={post.title}
              width={1280}
              height={720}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>

          {/* Action rail */}
          <div className="sticky top-20 z-30 mt-10 -mx-2 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-background/80 px-3 py-2 backdrop-blur-xl">
            <RailBtn onClick={playAudio} active={playing}>
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {playing ? "Stop" : "Listen"}
            </RailBtn>
            <RailBtn onClick={runSummary}>
              {summaryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Summarize
            </RailBtn>
            <RailBtn
              onClick={() => {
                setLiked(!liked);
                setLikes(liked ? Math.max(0, likes - 1) : likes + 1);
              }}
              active={liked}
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> {likes}
            </RailBtn>
            <a
              href="#comments"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
            >
              <MessageCircle className="h-4 w-4" /> {comments.length}
            </a>
            {toc.length > 0 && (
              <details className="ml-auto">
                <summary className="cursor-pointer list-none rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
                  Contents
                </summary>
                <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-popover p-3 shadow-xl">
                  <ul className="space-y-1 text-sm">
                    {toc.map((t) => (
                      <li key={t.id} className={t.level === 3 ? "pl-3" : ""}>
                        <a
                          href={`#${t.id}`}
                          className={`block rounded px-2 py-1 transition-colors ${
                            activeId === t.id
                              ? "bg-accent/10 text-accent"
                              : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                          }`}
                        >
                          {t.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            )}
          </div>

          {/* AI panel */}
          {(aiOpen || summary || chat.length > 0) && (
            <div className="mt-8 rounded-2xl border border-accent/30 bg-accent/5 p-5">
              <div className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent">
                <Sparkles className="h-3.5 w-3.5" /> AI · grounded in this article
              </div>

              {(summary || summaryLoading) && (
                <div className="mb-5">
                  <div className="mb-1 text-xs font-semibold text-muted-foreground">TL;DR</div>
                  {summaryLoading && !summary ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Summarizing…
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none text-foreground/90">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
                    </div>
                  )}
                </div>
              )}

              {chat.length > 0 && (
                <div className="mb-4 space-y-3">
                  {chat.map((m, i) => (
                    <div
                      key={i}
                      className={`rounded-xl px-3 py-2 text-sm ${
                        m.role === "user"
                          ? "ml-auto max-w-[85%] bg-accent text-accent-foreground"
                          : "max-w-[95%] bg-background/60 text-foreground"
                      }`}
                    >
                      {m.role === "assistant" ? (
                        <div className="prose prose-invert prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {m.content || "…"}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        m.content
                      )}
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={ask} className="flex items-center gap-2">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask anything about this article…"
                  className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={askLoading || !question.trim()}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
                >
                  {askLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  Ask
                </button>
              </form>
            </div>
          )}

          {/* Article body */}
          <div
            ref={articleRef}
            className="prose prose-invert prose-lg mt-10 max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h2:mt-12 prose-h2:text-2xl prose-h2:text-foreground prose-h3:text-xl prose-p:leading-relaxed prose-p:text-foreground/85 prose-a:text-accent prose-strong:text-foreground prose-code:rounded prose-code:bg-surface-2 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-accent prose-code:before:hidden prose-code:after:hidden prose-li:text-foreground/85"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ children }) => {
                  const text = String(children);
                  return <h2 id={slugify(text)}>{children}</h2>;
                },
                h3: ({ children }) => {
                  const text = String(children);
                  return <h3 id={slugify(text)}>{children}</h3>;
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Reactions */}
          <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-border pt-8">
            <span className="mr-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">React</span>
            {REACTIONS.map((r) => (
              <button
                key={r.key}
                onClick={() =>
                  setReactions({ ...reactions, [r.key]: (reactions[r.key] ?? 0) + 1 })
                }
                className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-glow-sm"
              >
                <span className="text-base transition-transform group-hover:scale-110">{r.emoji}</span>
                <span className="font-mono text-xs text-muted-foreground">{reactions[r.key] ?? 0}</span>
              </button>
            ))}
          </div>

          {/* Comments */}
          <div id="comments" className="mt-12 border-t border-border pt-8">
            <h3 className="font-display text-2xl font-bold text-foreground">
              Comments <span className="text-muted-foreground">({comments.length})</span>
            </h3>
            <form onSubmit={addComment} className="mt-5 space-y-3">
              <input
                value={cName}
                onChange={(e) => setCName(e.target.value)}
                placeholder="Your name"
                maxLength={60}
                className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:outline-none"
              />
              <textarea
                value={cMsg}
                onChange={(e) => setCMsg(e.target.value)}
                placeholder="Share a thought…"
                maxLength={1000}
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!cName.trim() || !cMsg.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
              >
                Post comment <Send className="h-3.5 w-3.5" />
              </button>
              <p className="text-[11px] text-muted-foreground">
                Comments are stored on your device only — they won't be visible to other readers.
              </p>
            </form>

            <ul className="mt-8 space-y-4">
              {comments.map((c) => (
                <li key={c.id} className="rounded-xl border border-border bg-surface p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">{c.name}</span>
                    <span className="font-mono text-[10.5px] text-muted-foreground">
                      {new Date(c.at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                    {c.message}
                  </p>
                </li>
              ))}
              {comments.length === 0 && (
                <li className="rounded-xl border border-dashed border-border bg-surface/50 p-6 text-center text-sm text-muted-foreground">
                  Be the first to leave a thought.
                </li>
              )}
            </ul>
          </div>
        </article>

        {/* More from My Community */}
        <section className="mx-auto mt-20 max-w-6xl px-5 sm:px-8">
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-accent">▸ more from My Community</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {moreFromCommunity.map((p) => (
              <Link
                key={p.slug}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-accent/40 hover:shadow-glow-sm"
              >
                <img
                  src={p.cover}
                  alt={p.title}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="p-4">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {p.date} · {p.readMinutes} min
                  </div>
                  <h4 className="mt-1.5 font-display text-base font-semibold text-foreground group-hover:text-accent">
                    {p.title}
                  </h4>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs text-accent">
                    Read <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function RailBtn({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all hover:-translate-y-0.5 ${
        active
          ? "border-accent/60 bg-accent/15 text-accent"
          : "border-border bg-surface text-muted-foreground hover:border-accent/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function ShareBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface text-xs font-semibold text-muted-foreground transition-all hover:border-accent/40 hover:text-accent"
    >
      {children}
    </button>
  );
}
