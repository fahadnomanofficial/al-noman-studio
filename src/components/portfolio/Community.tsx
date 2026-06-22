import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { BlogCard } from "./BlogCard";
import { allPosts } from "./blogs";
import { staggerParent, viewportOnce } from "./motion";

export function Community() {
  const posts = allPosts().slice(0, 4);
  return (
    <section id="community" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeader
          eyebrow="writing & ideas"
          title="My Community."
          intro="Notes from building on the web — lessons from shipping marketplaces, growing traffic, and working with developers around the world."
        />

        <motion.div
          variants={staggerParent}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {posts.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
