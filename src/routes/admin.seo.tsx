import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { loadPosts, type AdminPost } from "@/components/admin/blog-storage";
import { PageHeader } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/seo")({
  component: SeoPage,
});

function SeoPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  useEffect(() => setPosts(loadPosts()), []);

  return (
    <div>
      <PageHeader title="SEO" description="Per-post audit of metadata, lengths, and images." />
      <div className="space-y-4">
        {posts.map((p) => {
          const metaTitle = p.seo?.metaTitle ?? p.title;
          const metaDesc = p.seo?.metaDescription ?? p.excerpt;
          const titleLen = metaTitle.length;
          const descLen = metaDesc.length;
          const warnings: string[] = [];
          if (titleLen > 60) warnings.push("Meta title over 60 chars");
          if (titleLen < 20) warnings.push("Meta title under 20 chars");
          if (descLen > 160) warnings.push("Meta description over 160 chars");
          if (descLen < 70) warnings.push("Meta description under 70 chars");
          if (!p.seo?.ogImage && !p.cover) warnings.push("No OG image or cover");
          if ((p.sections ?? []).some((s) => !s.caption)) warnings.push("Section missing alt/caption");
          if (p.seo?.noindex) warnings.push("Marked noindex");

          return (
            <div key={p.slug} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-medium text-foreground">{p.title}</div>
                  <div className="text-xs text-muted-foreground">/{p.slug}</div>
                </div>
                <Link
                  to="/admin/blogs/$slug/edit"
                  params={{ slug: p.slug }}
                  className="text-sm text-primary hover:underline"
                >
                  Edit SEO
                </Link>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Meter label="Meta title" length={titleLen} max={60} text={metaTitle} />
                <Meter label="Meta description" length={descLen} max={160} text={metaDesc} />
              </div>

              <div className="mt-4 grid gap-2 text-xs sm:grid-cols-3">
                <Pill ok={!!(p.seo?.ogImage || p.cover)} label="OG image" />
                <Pill ok={!!p.seo?.canonical} label="Canonical set" optional />
                <Pill ok={(p.seo?.keywords?.length ?? 0) > 0} label="Keywords" optional />
              </div>

              {warnings.length > 0 && (
                <ul className="mt-4 space-y-1 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
                  {warnings.map((w) => (
                    <li key={w} className="flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" /> {w}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Meter({ label, length, max, text }: { label: string; length: number; max: number; text: string }) {
  const pct = Math.min(100, (length / max) * 100);
  const over = length > max;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">{label}</span>
        <span className={over ? "text-amber-700" : "text-muted-foreground"}>{length}/{max}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${over ? "bg-amber-500" : "bg-primary"}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs text-muted-foreground">{text}</p>
    </div>
  );
}

function Pill({ ok, label, optional }: { ok: boolean; label: string; optional?: boolean }) {
  if (ok) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" /> {label}
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 ${optional ? "bg-muted text-muted-foreground" : "bg-rose-100 text-rose-700"}`}>
      <AlertTriangle className="h-3.5 w-3.5" /> {label}
    </span>
  );
}
