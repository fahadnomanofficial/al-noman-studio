import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, Heart, MessageSquare, CheckCircle2, FileEdit, ArrowRight } from "lucide-react";
import { loadPosts, getLikes, getReactions, getComments, type AdminPost } from "@/components/admin/blog-storage";
import { PageHeader } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [stats, setStats] = useState({ likes: 0, reactions: 0, comments: 0 });

  useEffect(() => {
    const list = loadPosts();
    setPosts(list);
    let likes = 0, reactions = 0, comments = 0;
    for (const p of list) {
      likes += getLikes(p.slug);
      reactions += Object.values(getReactions(p.slug)).reduce((a, b) => a + b, 0);
      comments += getComments(p.slug).length;
    }
    setStats({ likes, reactions, comments });
  }, []);

  const published = posts.filter((p) => (p.status ?? "published") === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;

  const cards = [
    { label: "Total posts", value: posts.length, icon: FileText, color: "text-primary bg-primary/10" },
    { label: "Published", value: published, icon: CheckCircle2, color: "text-emerald-700 bg-emerald-100" },
    { label: "Drafts", value: drafts, icon: FileEdit, color: "text-amber-700 bg-amber-100" },
    { label: "Likes", value: stats.likes, icon: Heart, color: "text-rose-700 bg-rose-100" },
    { label: "Reactions", value: stats.reactions, icon: Heart, color: "text-fuchsia-700 bg-fuchsia-100" },
    { label: "Comments", value: stats.comments, icon: MessageSquare, color: "text-blue-700 bg-blue-100" },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Overview of your blog activity." />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">Recent posts</h2>
          <Link to="/admin/blogs" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            All blogs <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ul className="divide-y divide-border">
          {posts.slice(0, 5).map((p) => (
            <li key={p.slug} className="flex items-center justify-between py-3">
              <div className="min-w-0">
                <div className="truncate font-medium text-foreground">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.date} · {p.tags.join(", ")}</div>
              </div>
              <Link
                to="/admin/blogs/$slug/edit"
                params={{ slug: p.slug }}
                className="shrink-0 text-sm text-primary hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
