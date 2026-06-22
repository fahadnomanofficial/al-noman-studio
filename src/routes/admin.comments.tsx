import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { loadPosts, getComments, deleteComment, type AdminPost } from "@/components/admin/blog-storage";
import { PageHeader } from "@/components/admin/AdminShell";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/comments")({
  component: CommentsPage,
});

function CommentsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setPosts(loadPosts());
  }, [tick]);

  function handleDelete(slug: string, id: string) {
    if (!confirm("Delete this comment?")) return;
    deleteComment(slug, id);
    toast.success("Comment deleted");
    setTick((t) => t + 1);
  }

  return (
    <div>
      <PageHeader title="Comments" description="Visitor comments stored in browser localStorage." />
      <div className="space-y-6">
        {posts.map((p) => {
          const comments = getComments(p.slug);
          if (comments.length === 0) return null;
          return (
            <div key={p.slug} className="rounded-2xl border border-border bg-card shadow-sm">
              <div className="border-b border-border px-5 py-3">
                <div className="font-medium text-foreground">{p.title}</div>
                <div className="text-xs text-muted-foreground">{comments.length} comment{comments.length !== 1 && "s"}</div>
              </div>
              <ul className="divide-y divide-border">
                {comments.map((c) => (
                  <li key={c.id} className="flex items-start justify-between gap-4 px-5 py-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{new Date(c.at).toLocaleString()}</div>
                      <p className="mt-1 text-sm text-foreground">{c.message}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(p.slug, c.id)}
                      className="shrink-0 rounded-md p-1.5 text-rose-600 hover:bg-rose-50"
                      title="Delete comment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {posts.every((p) => getComments(p.slug).length === 0) && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
            No comments yet.
          </div>
        )}
      </div>
    </div>
  );
}
