import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Eye, Copy, Trash2, ExternalLink } from "lucide-react";
import {
  loadPosts,
  deletePost,
  upsertPost,
  getLikes,
  getComments,
  type AdminPost,
} from "@/components/admin/blog-storage";
import { PageHeader } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/blogs")({
  component: BlogsPage,
});

function BlogsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const navigate = useNavigate();

  function refresh() {
    setPosts(loadPosts());
  }
  useEffect(() => {
    refresh();
  }, []);

  function handleDelete(slug: string) {
    if (!confirm("Delete this post? This only affects the admin store, not the static blogs.ts file.")) return;
    deletePost(slug);
    toast.success("Post deleted");
    refresh();
  }

  function handleDuplicate(p: AdminPost) {
    const copy: AdminPost = { ...p, slug: `${p.slug}-copy`, title: `${p.title} (copy)`, status: "draft" };
    upsertPost(copy);
    toast.success("Post duplicated");
    refresh();
  }

  function togglePublish(p: AdminPost) {
    const next: AdminPost = { ...p, status: p.status === "draft" ? "published" : "draft" };
    upsertPost(next, p.slug);
    refresh();
  }

  return (
    <div>
      <PageHeader
        title="Blogs"
        description="All posts. Create, edit, preview, and manage publishing."
        actions={
          <Button onClick={() => navigate({ to: "/admin/blogs/new" })}>
            <Plus className="mr-1.5 h-4 w-4" /> New post
          </Button>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Likes</th>
              <th className="px-4 py-3">Comments</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map((p) => {
              const status = p.status ?? "published";
              return (
                <tr key={p.slug} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{p.title}</div>
                    <div className="text-xs text-muted-foreground">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublish(p)}>
                      <Badge variant={status === "published" ? "default" : "secondary"}>
                        {status}
                      </Badge>
                    </button>
                    {p.featured && <Badge variant="outline" className="ml-1">featured</Badge>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{getLikes(p.slug)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{getComments(p.slug).length}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to="/admin/blogs/$slug/edit"
                        params={{ slug: p.slug }}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <Link
                        to="/blog/$slug"
                        params={{ slug: p.slug }}
                        target="_blank"
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDuplicate(p)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        title="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.slug)}
                        className="rounded-md p-1.5 text-rose-600 hover:bg-rose-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {posts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No posts yet. <Link to="/admin/blogs/new" className="text-primary hover:underline">Create the first one</Link>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
        <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          Admin edits are stored in the browser session only — the static <code>blogs.ts</code> file is not modified.
          Use the <strong>Export</strong> buttons inside the editor to copy JSON/Markdown for publishing.
        </span>
      </p>
    </div>
  );
}
