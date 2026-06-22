import { createFileRoute } from "@tanstack/react-router";
import { BlogEditor } from "@/components/admin/BlogEditor";

export const Route = createFileRoute("/admin/blogs/new")({
  component: () => <BlogEditor mode="new" />,
});
