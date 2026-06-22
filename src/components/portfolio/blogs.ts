import marketplaceCover from "@/assets/blog/marketplace.jpg";
import seoCover from "@/assets/blog/seo.jpg";
import aiCover from "@/assets/blog/ai-coding.jpg";
import freelanceCover from "@/assets/blog/freelance.jpg";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string;
  readMinutes: number;
  tags: string[];
  content: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "building-bonikbazar",
    title: "Building Bonikbazar: lessons from shipping a real marketplace",
    excerpt:
      "What four years of owning the backend of a classifieds platform taught me about pragmatic architecture, dirty data, and shipping fast.",
    cover: marketplaceCover,
    date: "Jun 14, 2026",
    readMinutes: 7,
    tags: ["Engineering", "Laravel", "PostgreSQL"],
    content: `When I joined Sail Corporation as a frontend developer in 2021, Bonikbazar was a small React app talking to a few PHP endpoints. By the time I left as the full-stack owner, it was a multi-million-row PostgreSQL system serving thousands of listings a day. Here is what I would tell my past self.

## Start with the boring schema

Marketplaces look like CRUD apps on the surface. They are not. The hard part is not the listings table — it is the **state machine** that turns a draft into a paid, moderated, contacted listing without losing rows when a worker crashes mid-update.

I spent the first month rewriting our \`listings\` table from a single status column to an explicit lifecycle: \`draft → pending_review → live → expired → archived\`. Every transition got its own timestamp and audit row. After that, every "weird missing listing" bug became a one-query investigation instead of an afternoon.

## SEO is a backend problem

We thought SEO was a marketing thing. It is not. Once we built **real server-rendered category and detail pages** with proper canonical URLs and structured data, organic traffic doubled in 90 days — without a single new ad.

## Cache the right thing

We cached the wrong thing for a year. The expensive query was not "list 20 listings on the home page." It was the per-listing aggregate: views, contact clicks, related listings. Moving those to a denormalised \`listing_stats\` table refreshed by a cron killed our database CPU graph.

## What I would do differently

- Write the search query first, model the schema around it.
- Treat every external integration as eventually-failing — queue and retry from day one.
- Have one engineer own one slice end-to-end (DB → API → UI). Round-robin tickets across the stack age badly.

Bonikbazar taught me that building a platform is mostly about giving yourself the tools to see what is happening inside it. The features are easy. The visibility is everything.`,
  },
  {
    slug: "seo-that-drove-5m-visits",
    title: "How we drove 5M+ visits to bdproperty.xyz",
    excerpt:
      "A breakdown of the technical SEO, content engineering, and paid campaigns that turned a regional property site into a category leader.",
    cover: seoCover,
    date: "May 30, 2026",
    readMinutes: 8,
    tags: ["SEO", "Marketing", "Growth"],
    content: `Five million visits sounds like a marketing story. It is actually 80% engineering. Here is the playbook we used at bdproperty.xyz, in order.

## 1. Fix the crawl, then fix the content

Before we wrote a single new page we ran a full crawl and found 12,000 URLs returning 200s that should have been 404s — old preview links, dev artefacts, and orphaned drafts. Search engines were spending their budget on garbage. Cleaning that up moved our **indexed-to-submitted ratio** from 38% to 91% in three weeks.

## 2. Make every page answer a query

We had hundreds of category pages that all looked the same. We replaced them with **intent-specific landing pages** generated from our own listing data: "2-bedroom apartments in Banani under 30k", "ready-to-move flats with parking in Dhanmondi". Each page had unique content because the listings under it were unique.

## 3. Internal links beat backlinks

We stopped chasing backlinks for six months and instead built a clean internal link graph: every listing linked back to its area, every area linked to its district, every district linked to its city. The crawl depth dropped from 7 to 3, and rankings rose for queries we had not even targeted.

## 4. Paid ads are a feedback loop, not a tap

We did not run Google Ads for traffic. We ran them for **keyword research**. The keywords that converted in paid told us which organic pages to invest in next. By month four, organic was carrying 80% of the load and paid was a tuning instrument.

## Numbers

- Organic sessions: 0 → 3.4M / year
- Paid-driven conversions reinvested into organic: ~1.7M visits compounding
- Pages indexed: 4,200 → 38,000
- Average position for target queries: 14.2 → 3.8

The lesson: **SEO is the discipline of removing friction between what people search for and what your database already knows.**`,
  },
  {
    slug: "vibe-coding-with-ai",
    title: "Vibe coding: shipping faster without the AI slop",
    excerpt:
      "AI tools are great accelerators and terrible defaults. Here is the workflow I use to stay fast without ending up with code I cannot debug.",
    cover: aiCover,
    date: "May 12, 2026",
    readMinutes: 6,
    tags: ["AI", "Workflow", "Developer Experience"],
    content: `Half of my output now comes from working with AI tools. The other half is the part where I keep them from making everything worse. Here is the workflow that survived contact with production.

## The 80/20 rule of AI coding

AI is brilliant at the **first 80%** of a feature — boilerplate, glue code, transformations between shapes you have already defined. It falls apart on the last 20%: subtle business rules, error handling, performance edges. So I let it own the first 80% and I own the last 20%. Reversing that ratio is how you ship bugs at scale.

## Prompt the contract, not the code

I never ask "write a function that does X." I write the type signature, the error cases, and one example input/output, then ask for the implementation. The model has nowhere to drift to. Reviewing the output takes seconds instead of minutes.

## Read every line

This is the rule I break the most and regret the most. If I cannot explain a line of generated code to someone else, it does not get committed. The shortcut feels like savings; the debt arrives later with interest.

## My current loop

1. Sketch the data model and the user-visible flow by hand.
2. Generate the types and zod schemas with AI.
3. Generate the routes, components, and tests with AI, one slice at a time.
4. Run it. Read everything it produced. Refactor for clarity.
5. Hand-write the parts where money, auth, or destructive actions are involved.

## What changed for me

The work I used to do in two weeks now takes three days. The work I used to do in three days still takes three days, because thinking is the bottleneck and no model has fixed thinking yet.

Vibe coding is real, but the vibes are the senior engineer's, not the model's.`,
  },
  {
    slug: "freelancing-worldwide-from-malta",
    title: "Freelancing worldwide from a small island",
    excerpt:
      "Living in Malta, working with clients from Bangladesh to Canada. The tooling, time zones, and trust loops that make it work.",
    cover: freelanceCover,
    date: "Apr 28, 2026",
    readMinutes: 5,
    tags: ["Freelance", "Remote", "Community"],
    content: `I live in Qormi, Malta. My clients are in Dhaka, Toronto, Sydney, and Frankfurt. Here is how that actually works on a Tuesday.

## Time zones are a feature

People treat overlap as the goal. It is not. **The lack of overlap is the productivity.** When my Toronto client is asleep, I get four uninterrupted hours of deep work. When they wake up, there is a working build waiting. The async loop ships more in a week than two synchronous standups ever did.

## Trust is a delivery problem

New clients do not buy hours, they buy **predictability**. So I quote in deliverables, ship the first small one in 48 hours, and let the work earn the next milestone. By the third deliverable, the relationship runs itself.

## Tools I cannot live without

- A clean GitHub repo per project, even for tiny jobs. The repo is the source of truth, not Slack.
- Loom for async standups. A two-minute video beats a 40-message thread.
- A single shared doc per project with goals, decisions, and open questions. No tickets without a paragraph of context.

## The community part

Freelancing alone is corrosive. I keep a small group of developers I trade reviews and rates with — some I have never met in person. It is the closest thing I have to coworkers, and it is why I called this section of the site **My Community**. Writing in public is how I pay them back.

If you are reading this and you ship software somewhere in the world, hello. Tell me what you are building.`,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function allPosts(): BlogPost[] {
  return BLOG_POSTS;
}
