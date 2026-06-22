import { BLOG_POSTS, type BlogPost, type BlogSection } from "@/components/portfolio/blogs";

export type AdminSeo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  canonical?: string;
  keywords?: string[];
  noindex?: boolean;
};

export type AdminAuthor = {
  name?: string;
  avatar?: string;
  bio?: string;
};

export type AdminPost = BlogPost & {
  status?: "draft" | "published";
  featured?: boolean;
  publishDate?: string;
  weight?: number;
  seo?: AdminSeo;
  author?: AdminAuthor;
};

const STORAGE_KEY = "lovable_admin_posts_v1";

function seed(): AdminPost[] {
  return BLOG_POSTS.map((p) => ({ ...p, status: "published" as const }));
}

export function loadPosts(): AdminPost[] {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as AdminPost[];
    return Array.isArray(parsed) && parsed.length ? parsed : seed();
  } catch {
    return seed();
  }
}

export function savePosts(posts: AdminPost[]) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    /* ignore */
  }
}

export function getAdminPost(slug: string): AdminPost | undefined {
  return loadPosts().find((p) => p.slug === slug);
}

export function upsertPost(post: AdminPost, originalSlug?: string) {
  const posts = loadPosts();
  const key = originalSlug ?? post.slug;
  const idx = posts.findIndex((p) => p.slug === key);
  if (idx >= 0) posts[idx] = post;
  else posts.unshift(post);
  savePosts(posts);
}

export function deletePost(slug: string) {
  savePosts(loadPosts().filter((p) => p.slug !== slug));
}

export function resetPosts() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function emptyPost(): AdminPost {
  return {
    slug: "",
    title: "",
    excerpt: "",
    cover: "",
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    readMinutes: 5,
    tags: [],
    content: "",
    sections: [],
    status: "draft",
    featured: false,
    seo: {},
    author: {},
  };
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function calcReadMinutes(md: string) {
  const words = (md.match(/\S+/g) ?? []).length;
  return Math.max(1, Math.round(words / 220));
}

// Reaction / comment helpers (read from public-site localStorage)
export type StoredReactions = Record<string, number>;
export type StoredComment = { id: string; name: string; message: string; at: number };

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getLikes(slug: string): number {
  return readLS<number>(`blog:${slug}:likes`, 0);
}
export function getReactions(slug: string): StoredReactions {
  return readLS<StoredReactions>(`blog:${slug}:reactions`, {});
}
export function getComments(slug: string): StoredComment[] {
  return readLS<StoredComment[]>(`blog:${slug}:comments`, []);
}
export function deleteComment(slug: string, id: string) {
  if (typeof window === "undefined") return;
  const list = getComments(slug).filter((c) => c.id !== id);
  window.localStorage.setItem(`blog:${slug}:comments`, JSON.stringify(list));
}
export function clearLikes(slug: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(`blog:${slug}:likes`);
  window.localStorage.removeItem(`blog:${slug}:liked`);
  window.localStorage.removeItem(`blog:${slug}:reactions`);
}

export type { BlogSection };
