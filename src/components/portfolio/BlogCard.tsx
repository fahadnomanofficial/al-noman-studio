import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { fadeUp } from "./motion";
import type { BlogPost } from "./blogs";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <motion.div variants={fadeUp} className="group">
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all hover:border-accent/40 hover:shadow-glow-sm"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={post.cover}
            alt={post.title}
            loading="lazy"
            width={1280}
            height={720}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 1).map((t) => (
              <span
                key={t}
                className="rounded-full border border-accent/30 bg-background/70 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readMinutes} min read</span>
          </div>
          <h3 className="font-display text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-accent">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
          <div className="mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold text-accent">
            Read <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
