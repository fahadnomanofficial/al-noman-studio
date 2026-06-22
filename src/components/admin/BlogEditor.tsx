import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Trash2, ArrowUp, ArrowDown, Save, Eye, Download, FileJson, FileText as FileTextIcon, X } from "lucide-react";
import {
  upsertPost,
  deletePost,
  calcReadMinutes,
  slugify,
  emptyPost,
  type AdminPost,
} from "./blog-storage";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function BlogEditor({ initial, mode }: { initial?: AdminPost; mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const [post, setPost] = useState<AdminPost>(initial ?? emptyPost());
  const originalSlug = useMemo(() => initial?.slug, [initial]);
  const [tagInput, setTagInput] = useState("");
  const [kwInput, setKwInput] = useState("");

  // Auto-slug from title when creating
  useEffect(() => {
    if (mode === "new" && !post.slug && post.title) {
      setPost((p) => ({ ...p, slug: slugify(p.title) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.title]);

  function update<K extends keyof AdminPost>(key: K, value: AdminPost[K]) {
    setPost((p) => ({ ...p, [key]: value }));
  }

  function handleSave() {
    if (!post.title.trim() || !post.slug.trim()) {
      toast.error("Title and slug are required");
      return;
    }
    upsertPost({ ...post, readMinutes: post.readMinutes || calcReadMinutes(post.content) }, originalSlug);
    toast.success("Saved (session only)");
    navigate({ to: "/admin/blogs" });
  }

  function handleDelete() {
    if (!originalSlug) return;
    if (!confirm("Delete this post?")) return;
    deletePost(originalSlug);
    toast.success("Deleted");
    navigate({ to: "/admin/blogs" });
  }

  function addTag() {
    const t = tagInput.trim();
    if (!t) return;
    if (!post.tags.includes(t)) update("tags", [...post.tags, t]);
    setTagInput("");
  }
  function removeTag(t: string) {
    update("tags", post.tags.filter((x) => x !== t));
  }
  function addKw() {
    const t = kwInput.trim();
    if (!t) return;
    const current = post.seo?.keywords ?? [];
    if (!current.includes(t)) update("seo", { ...post.seo, keywords: [...current, t] });
    setKwInput("");
  }
  function removeKw(t: string) {
    const current = post.seo?.keywords ?? [];
    update("seo", { ...post.seo, keywords: current.filter((x) => x !== t) });
  }

  // Sections
  function addSection() {
    update("sections", [...(post.sections ?? []), { heading: "", image: "", caption: "" }]);
  }
  function updateSection(i: number, key: "heading" | "image" | "caption", value: string) {
    const next = [...(post.sections ?? [])];
    next[i] = { ...next[i], [key]: value };
    update("sections", next);
  }
  function removeSection(i: number) {
    const next = [...(post.sections ?? [])];
    next.splice(i, 1);
    update("sections", next);
  }
  function moveSection(i: number, dir: -1 | 1) {
    const next = [...(post.sections ?? [])];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    update("sections", next);
  }

  function handleImageFile(field: "cover" | "ogImage" | "avatar" | `section-${number}`) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result);
        if (field === "cover") update("cover", url);
        else if (field === "ogImage") update("seo", { ...post.seo, ogImage: url });
        else if (field === "avatar") update("author", { ...post.author, avatar: url });
        else {
          const idx = Number(field.replace("section-", ""));
          updateSection(idx, "image", url);
        }
      };
      reader.readAsDataURL(file);
    };
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(post, null, 2)], { type: "application/json" });
    triggerDownload(blob, `${post.slug || "post"}.json`);
  }
  function exportMarkdown() {
    const frontmatter = [
      "---",
      `slug: ${post.slug}`,
      `title: ${JSON.stringify(post.title)}`,
      `excerpt: ${JSON.stringify(post.excerpt)}`,
      `date: ${JSON.stringify(post.date)}`,
      `readMinutes: ${post.readMinutes}`,
      `tags: ${JSON.stringify(post.tags)}`,
      `status: ${post.status ?? "published"}`,
      post.featured ? `featured: true` : null,
      post.seo?.metaTitle ? `metaTitle: ${JSON.stringify(post.seo.metaTitle)}` : null,
      post.seo?.metaDescription ? `metaDescription: ${JSON.stringify(post.seo.metaDescription)}` : null,
      "---",
      "",
      post.content,
    ].filter(Boolean).join("\n");
    const blob = new Blob([frontmatter], { type: "text/markdown" });
    triggerDownload(blob, `${post.slug || "post"}.md`);
  }
  function triggerDownload(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  const seo = post.seo ?? {};
  const author = post.author ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
            {mode === "new" ? "New post" : "Edit post"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Fill in all tabs. Save stores locally for this session.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={exportJSON}><FileJson className="mr-1.5 h-4 w-4" /> JSON</Button>
          <Button variant="outline" onClick={exportMarkdown}><FileTextIcon className="mr-1.5 h-4 w-4" /> Markdown</Button>
          {mode === "edit" && (
            <Button variant="outline" onClick={() => window.open(`/blog/${post.slug}`, "_blank")}>
              <Eye className="mr-1.5 h-4 w-4" /> Preview
            </Button>
          )}
          {mode === "edit" && (
            <Button variant="outline" className="text-rose-600 hover:bg-rose-50" onClick={handleDelete}>
              <Trash2 className="mr-1.5 h-4 w-4" /> Delete
            </Button>
          )}
          <Button onClick={handleSave}>
            <Save className="mr-1.5 h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content">
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="publishing">Publishing</TabsTrigger>
          <TabsTrigger value="author">Author</TabsTrigger>
        </TabsList>

        {/* Content */}
        <TabsContent value="content" className="mt-6 space-y-4">
          <Card>
            <Field label="Title">
              <Input value={post.title} onChange={(e) => update("title", e.target.value)} placeholder="A great post title" />
            </Field>
            <Field label="Slug">
              <Input value={post.slug} onChange={(e) => update("slug", slugify(e.target.value))} placeholder="auto-from-title" />
            </Field>
            <Field label="Excerpt">
              <Textarea value={post.excerpt} onChange={(e) => update("excerpt", e.target.value)} rows={2} />
            </Field>
            <Field label="Cover image (URL or upload)">
              <div className="space-y-2">
                <Input value={post.cover} onChange={(e) => update("cover", e.target.value)} placeholder="https://…" />
                <input type="file" accept="image/*" onChange={handleImageFile("cover")} className="text-xs" />
                {post.cover && <img src={post.cover} alt="" className="mt-2 h-32 w-auto rounded-lg border border-border object-cover" />}
              </div>
            </Field>
            <Field label="Tags">
              <div className="flex gap-2">
                <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Add tag and press Enter" />
                <Button type="button" variant="outline" onClick={addTag}>Add</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {post.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="gap-1">
                    {t}
                    <button onClick={() => removeTag(t)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            </Field>
            <Field label={`Markdown content (${calcReadMinutes(post.content)} min read)`}>
              <Textarea
                value={post.content}
                onChange={(e) => update("content", e.target.value)}
                rows={20}
                className="font-mono text-xs"
                placeholder={"## Section heading\n\nBody paragraph…"}
              />
            </Field>
            <Field label="Read minutes (override)">
              <Input type="number" min={1} value={post.readMinutes} onChange={(e) => update("readMinutes", Number(e.target.value) || 1)} className="w-32" />
            </Field>
          </Card>
        </TabsContent>

        {/* Sections */}
        <TabsContent value="sections" className="mt-6 space-y-4">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">One image per H2 section. Order matches the article.</p>
              <Button variant="outline" size="sm" onClick={addSection}><Plus className="mr-1 h-3.5 w-3.5" /> Add section</Button>
            </div>
            <div className="space-y-3">
              {(post.sections ?? []).map((s, i) => (
                <div key={i} className="rounded-lg border border-border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Section {i + 1}</span>
                    <div className="flex gap-1">
                      <button onClick={() => moveSection(i, -1)} className="rounded p-1 text-muted-foreground hover:bg-muted"><ArrowUp className="h-3.5 w-3.5" /></button>
                      <button onClick={() => moveSection(i, 1)} className="rounded p-1 text-muted-foreground hover:bg-muted"><ArrowDown className="h-3.5 w-3.5" /></button>
                      <button onClick={() => removeSection(i)} className="rounded p-1 text-rose-600 hover:bg-rose-50"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                  <div className="grid gap-2 md:grid-cols-2">
                    <Input value={s.heading} onChange={(e) => updateSection(i, "heading", e.target.value)} placeholder="H2 heading (must match article)" />
                    <Input value={s.caption} onChange={(e) => updateSection(i, "caption", e.target.value)} placeholder="Image caption / alt" />
                    <div className="md:col-span-2">
                      <Input value={s.image} onChange={(e) => updateSection(i, "image", e.target.value)} placeholder="Image URL" />
                      <input type="file" accept="image/*" onChange={handleImageFile(`section-${i}`)} className="mt-1 text-xs" />
                      {s.image && <img src={s.image} alt="" className="mt-2 h-24 w-auto rounded border border-border object-cover" />}
                    </div>
                  </div>
                </div>
              ))}
              {(post.sections ?? []).length === 0 && (
                <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  No sections yet. Add one to attach images to your H2 chapters.
                </p>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo" className="mt-6 space-y-4">
          <Card>
            <Field label={`Meta title (${(seo.metaTitle ?? "").length}/60)`}>
              <Input value={seo.metaTitle ?? ""} onChange={(e) => update("seo", { ...seo, metaTitle: e.target.value })} placeholder={post.title} />
              {(seo.metaTitle ?? "").length > 60 && <p className="mt-1 text-xs text-amber-700">Over 60 chars — Google may truncate.</p>}
            </Field>
            <Field label={`Meta description (${(seo.metaDescription ?? "").length}/160)`}>
              <Textarea value={seo.metaDescription ?? ""} onChange={(e) => update("seo", { ...seo, metaDescription: e.target.value })} rows={3} placeholder={post.excerpt} />
              {(seo.metaDescription ?? "").length > 160 && <p className="mt-1 text-xs text-amber-700">Over 160 chars — Google may truncate.</p>}
            </Field>
            <Field label="OG image">
              <Input value={seo.ogImage ?? ""} onChange={(e) => update("seo", { ...seo, ogImage: e.target.value })} placeholder="Defaults to cover" />
              <input type="file" accept="image/*" onChange={handleImageFile("ogImage")} className="mt-1 text-xs" />
              {seo.ogImage && <img src={seo.ogImage} alt="" className="mt-2 h-24 w-auto rounded border border-border object-cover" />}
            </Field>
            <Field label="Canonical URL">
              <Input value={seo.canonical ?? ""} onChange={(e) => update("seo", { ...seo, canonical: e.target.value })} placeholder={`/blog/${post.slug}`} />
            </Field>
            <Field label="Keywords">
              <div className="flex gap-2">
                <Input value={kwInput} onChange={(e) => setKwInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKw())} placeholder="Add keyword" />
                <Button type="button" variant="outline" onClick={addKw}>Add</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(seo.keywords ?? []).map((t) => (
                  <Badge key={t} variant="secondary" className="gap-1">
                    {t}
                    <button onClick={() => removeKw(t)}><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            </Field>
            <Field label="No-index">
              <div className="flex items-center gap-3">
                <Switch checked={!!seo.noindex} onCheckedChange={(v) => update("seo", { ...seo, noindex: v })} />
                <span className="text-sm text-muted-foreground">Hide from search engines</span>
              </div>
            </Field>
          </Card>
        </TabsContent>

        {/* Publishing */}
        <TabsContent value="publishing" className="mt-6 space-y-4">
          <Card>
            <Field label="Status">
              <div className="flex items-center gap-3">
                <Switch checked={(post.status ?? "published") === "published"} onCheckedChange={(v) => update("status", v ? "published" : "draft")} />
                <span className="text-sm text-muted-foreground">{(post.status ?? "published") === "published" ? "Published" : "Draft"}</span>
              </div>
            </Field>
            <Field label="Publish date">
              <Input value={post.date} onChange={(e) => update("date", e.target.value)} placeholder="Jun 22, 2026" />
            </Field>
            <Field label="Featured">
              <div className="flex items-center gap-3">
                <Switch checked={!!post.featured} onCheckedChange={(v) => update("featured", v)} />
                <span className="text-sm text-muted-foreground">Highlight on the homepage</span>
              </div>
            </Field>
            <Field label="Order weight (lower = first)">
              <Input type="number" value={post.weight ?? 0} onChange={(e) => update("weight", Number(e.target.value) || 0)} className="w-32" />
            </Field>
          </Card>
        </TabsContent>

        {/* Author */}
        <TabsContent value="author" className="mt-6 space-y-4">
          <Card>
            <Field label="Author name (override)">
              <Input value={author.name ?? ""} onChange={(e) => update("author", { ...author, name: e.target.value })} placeholder="Fahad Al Noman" />
            </Field>
            <Field label="Avatar URL">
              <Input value={author.avatar ?? ""} onChange={(e) => update("author", { ...author, avatar: e.target.value })} placeholder="https://…" />
              <input type="file" accept="image/*" onChange={handleImageFile("avatar")} className="mt-1 text-xs" />
              {author.avatar && <img src={author.avatar} alt="" className="mt-2 h-16 w-16 rounded-full border border-border object-cover" />}
            </Field>
            <Field label="Bio (override)">
              <Textarea value={author.bio ?? ""} onChange={(e) => update("author", { ...author, bio: e.target.value })} rows={3} placeholder="Short author bio…" />
            </Field>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
