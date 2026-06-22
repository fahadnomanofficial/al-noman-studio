import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { getAdminPost, type AdminPost } from "@/components/admin/blog-storage";

export const Route = createFileRoute("/admin/blogs/$slug/edit")({
  component: EditPage,
});

function EditPage() {
  const { slug } = Route.useParams();
  const [post, setPost] = useState<AdminPost | undefined | null>(null);

  useEffect(() => {
    setPost(getAdminPost(slug));
  }, [slug]);

  if (post === null) return <p className="text-muted-foreground">Loading…</p>;
  if (!post) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="font-medium text-foreground">Post not found.</p>
        <Link to="/admin/blogs" className="mt-2 inline-block text-sm text-primary hover:underline">Back to blogs</Link>
      </div>
    );
  }
  return <BlogEditor mode="edit" initial={post} />;
}
