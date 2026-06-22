import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadPosts, getLikes, getReactions, clearLikes, type AdminPost } from "@/components/admin/blog-storage";
import { PageHeader } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EMOJIS = [
  { key: "fire", emoji: "🔥" },
  { key: "idea", emoji: "💡" },
  { key: "clap", emoji: "👏" },
  { key: "love", emoji: "❤️" },
];

export const Route = createFileRoute("/admin/reactions")({
  component: ReactionsPage,
});

function ReactionsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setPosts(loadPosts());
  }, [tick]);

  function handleClear(slug: string) {
    if (!confirm("Reset all likes & reactions for this post?")) return;
    clearLikes(slug);
    toast.success("Cleared");
    setTick((t) => t + 1);
  }

  return (
    <div>
      <PageHeader title="Reactions" description="Likes and emoji reactions per post (browser localStorage)." />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Post</th>
              <th className="px-4 py-3">Likes</th>
              {EMOJIS.map((r) => (
                <th key={r.key} className="px-4 py-3">{r.emoji}</th>
              ))}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((p) => {
              const r = getReactions(p.slug);
              return (
                <tr key={p.slug} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{p.title}</div>
                    <div className="text-xs text-muted-foreground">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{getLikes(p.slug)}</td>
                  {EMOJIS.map((e) => (
                    <td key={e.key} className="px-4 py-3 text-muted-foreground">{r[e.key] ?? 0}</td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <Button variant="outline" size="sm" onClick={() => handleClear(p.slug)}>Reset</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
