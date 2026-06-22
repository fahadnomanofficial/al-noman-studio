import marketplaceCover from "@/assets/blog/marketplace.jpg";
import seoCover from "@/assets/blog/seo.jpg";
import aiCover from "@/assets/blog/ai-coding.jpg";
import freelanceCover from "@/assets/blog/freelance.jpg";

import bbSchema from "@/assets/blog/bonikbazar/schema.jpg";
import bbSeo from "@/assets/blog/bonikbazar/seo.jpg";
import bbCache from "@/assets/blog/bonikbazar/cache.jpg";
import bbLessons from "@/assets/blog/bonikbazar/lessons.jpg";

import seoCrawl from "@/assets/blog/seo/crawl.jpg";
import seoContent from "@/assets/blog/seo/content.jpg";
import seoLinks from "@/assets/blog/seo/links.jpg";
import seoAds from "@/assets/blog/seo/ads.jpg";
import seoNumbers from "@/assets/blog/seo/numbers.jpg";

import aiEighty from "@/assets/blog/ai/eighty-twenty.jpg";
import aiContract from "@/assets/blog/ai/contract.jpg";
import aiReview from "@/assets/blog/ai/review.jpg";
import aiLoop from "@/assets/blog/ai/loop.jpg";

import flTime from "@/assets/blog/freelance/timezones.jpg";
import flTrust from "@/assets/blog/freelance/trust.jpg";
import flTools from "@/assets/blog/freelance/tools.jpg";
import flCommunity from "@/assets/blog/freelance/community.jpg";

export type BlogSection = { heading: string; image: string; caption: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string;
  readMinutes: number;
  tags: string[];
  content: string;
  sections?: BlogSection[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "building-bonikbazar",
    title: "Building Bonikbazar: lessons from shipping a real marketplace",
    excerpt:
      "What four years of owning the backend of a classifieds platform taught me about pragmatic architecture, dirty data, and shipping fast.",
    cover: marketplaceCover,
    date: "Jun 14, 2026",
    readMinutes: 9,
    tags: ["Engineering", "Laravel", "PostgreSQL"],
    sections: [
      { heading: "Start with the boring schema", image: bbSchema, caption: "The first month was spent on a state machine, not features. It paid back every week after." },
      { heading: "SEO is a backend problem", image: bbSeo, caption: "Server-rendered detail pages did more for traffic than any marketing campaign we ran." },
      { heading: "Cache the right thing", image: bbCache, caption: "The expensive query was never the home page. It was the per-listing aggregate, refreshed on a cron." },
      { heading: "What I would do differently", image: bbLessons, caption: "Notes I keep at the front of every new project — written from scars, not theory." },
    ],
    content: `When I joined Sail Corporation as a frontend developer in 2021, Bonikbazar was a small React app talking to a few PHP endpoints. By the time I left as the full-stack owner, it was a multi-million-row PostgreSQL system serving thousands of listings a day, with a moderation team, paid promotions, an Android app, and an analytics pipeline I rebuilt from scratch on a long weekend. Here is what I would tell my past self over coffee.

## Start with the boring schema

Marketplaces look like CRUD apps on the surface. They are not. The hard part is not the listings table — it is the **state machine** that turns a draft into a paid, moderated, contacted, expired listing without losing rows when a worker crashes mid-update. The first version of our data model had a single \`status\` column with five possible string values that the team treated like a vibe rather than a contract. By month two we had listings that were "live" but invisible, "expired" but still appearing in search, and "draft" rows that had taken money.

I spent the first month rewriting our \`listings\` table from that single status column to an explicit lifecycle: \`draft → pending_review → live → expired → archived\`. Every transition got its own timestamp, an actor (user or system), and an audit row. After that, every "weird missing listing" bug became a one-query investigation instead of an afternoon. Refunds stopped requiring a developer in the loop. New engineers could read the schema and understand the product in twenty minutes.

The lesson is not "model your state machine." Every senior engineer says that. The lesson is: **the schema is the product, written down**. Anything ambiguous in the schema will be ambiguous in the UI, in support tickets, and in the founders' heads.

## SEO is a backend problem

We thought SEO was a marketing thing — keyword research, meta tags, maybe a blog. It is not. The single biggest move was building **real server-rendered category and detail pages** with proper canonical URLs, breadcrumb structured data, and listing schema markup. Google had been seeing our React shell for two years and indexing approximately nothing.

Once we shipped SSR for the top three page templates, organic traffic doubled in 90 days — without a single new ad, without a single new content marketer, without touching the home page. The same listings, the same database, the same designs. Just rendered on the server with stable URLs.

The follow-on lesson: the team that owns the database has more influence on SEO than the team that owns the marketing copy. Internal links, canonical strategy, pagination, and rendering policy are all engineering decisions.

## Cache the right thing

We cached the wrong thing for a year. The expensive query was not "list 20 listings on the home page." Postgres was happy with that. The expensive query was the **per-listing aggregate**: views in the last 7 days, contact-click count, related listings by category and area, freshness score. Every detail-page render was triggering four heavy aggregations on a hot table.

Moving those into a denormalised \`listing_stats\` table refreshed by a five-minute cron killed our database CPU graph. Page load went from "is it stuck?" to under 300ms server time. The cache was not Redis, not Cloudflare — it was a boring Postgres table. Sometimes the right cache is just precomputation.

## What I would do differently

- **Write the search query first, model the schema around it.** We modelled the schema for the admin panel and then bolted full-text search on later. Search drives marketplaces; it should drive the data model too.
- **Treat every external integration as eventually-failing.** Queue and retry from day one. SMS providers go down. Image CDNs throttle. Payment webhooks arrive twice. None of these are exotic — all of them caused us outages.
- **Have one engineer own one slice end-to-end.** Round-robin tickets across the stack age badly. The person who wrote the listing form should also own its API and its database migration.
- **Invest in seeing what's happening before you invest in performance.** A single dashboard with a real-time view of state transitions caught more bugs than any test suite.

Bonikbazar taught me that building a platform is mostly about giving yourself the tools to see what is happening inside it. The features are easy. The visibility is everything.`,
  },
  {
    slug: "seo-that-drove-5m-visits",
    title: "How we drove 5M+ visits to bdproperty.xyz",
    excerpt:
      "A breakdown of the technical SEO, content engineering, and paid campaigns that turned a regional property site into a category leader.",
    cover: seoCover,
    date: "May 30, 2026",
    readMinutes: 10,
    tags: ["SEO", "Marketing", "Growth"],
    sections: [
      { heading: "1. Fix the crawl, then fix the content", image: seoCrawl, caption: "We were spending Google's crawl budget on garbage. Cleanup moved indexation from 38% to 91%." },
      { heading: "2. Make every page answer a query", image: seoContent, caption: "Hundreds of identical category pages became hundreds of intent-specific landing pages." },
      { heading: "3. Internal links beat backlinks", image: seoLinks, caption: "We stopped chasing backlinks for six months and rebuilt the internal graph instead." },
      { heading: "4. Paid ads are a feedback loop, not a tap", image: seoAds, caption: "We didn't run Google Ads for traffic. We ran them as the cheapest keyword research available." },
      { heading: "Numbers", image: seoNumbers, caption: "Four years compounded into a category-leading property platform." },
    ],
    content: `Five million visits sounds like a marketing story. It is actually 80% engineering and 20% editorial discipline. Here is the playbook we used at bdproperty.xyz, in the exact order we used it. None of it is clever. All of it works.

## 1. Fix the crawl, then fix the content

Before we wrote a single new page, we ran a full crawl with Screaming Frog and found 12,000 URLs returning 200s that should have been 404s — old preview links, dev artefacts, listing drafts that were never published, the QA team's test data, and an entire ghost section from a feature that was killed eighteen months earlier. Search engines were spending their crawl budget on garbage.

The cleanup was unglamorous: a weekend of writing redirects, a Monday of triple-checking them, and a Tuesday of submitting a fresh sitemap. Within three weeks our **indexed-to-submitted ratio** moved from 38% to 91%. Nothing about the content changed. Google had just stopped wasting time on pages we didn't want indexed and started reading the ones we did.

## 2. Make every page answer a query

We had hundreds of category pages that all looked the same: "Apartments in Dhaka", "Houses in Dhaka", "Plots in Dhaka". Same template, same intro paragraph, no reason for Google to rank one over a competitor's. We replaced them with **intent-specific landing pages** generated from our own listing data: "2-bedroom apartments in Banani under 30k", "ready-to-move flats with parking in Dhanmondi", "south-facing apartments in Gulshan above the 5th floor".

Each page had unique content because the listings under it were unique. Each page answered a question a real buyer was typing into Google. Each page linked sideways to two or three related queries. We went from a few hundred competing category pages to a few thousand pages that each owned a niche.

## 3. Internal links beat backlinks

We stopped chasing backlinks for six months and instead built a clean internal link graph. Every listing linked back to its area page. Every area page linked to its district. Every district to its city. Every long-tail landing page surfaced three sibling queries in a "people also search" rail.

The crawl depth dropped from 7 to 3. Rankings rose for queries we had not even targeted, because once Google could traverse the site cheaply it could understand the shape of our content. A clean internal graph is the single highest-ROI SEO move I have ever shipped, and almost no one talks about it because it is not a "growth hack."

## 4. Paid ads are a feedback loop, not a tap

We did not run Google Ads for traffic. We ran them for **keyword research**. Most SEO tools tell you what people search for; only paid tells you what people search for **and then convert on**. The keywords that converted in paid told us which organic pages to invest in next.

A page that paid traffic converted at 4% got an organic content investment the same week. A page that paid traffic ignored got cut. By month four, organic was carrying 80% of the load and paid was a tuning instrument — small daily budgets, used as a sensor, not a faucet.

## Numbers

- Organic sessions: 0 → 3.4M / year.
- Paid-driven conversions reinvested into organic: ~1.7M visits compounding.
- Pages indexed: 4,200 → 38,000.
- Average position for target queries: 14.2 → 3.8.
- Time from "engineering shipped" to "ranking impact": 6 weeks for crawl cleanup, 12 weeks for new landing pages, 16 weeks for internal-link restructure.

The lesson: **SEO is the discipline of removing friction between what people search for and what your database already knows.** Most of the wins are not new content. They are letting Google reach, read, and trust what you already have.`,
  },
  {
    slug: "vibe-coding-with-ai",
    title: "Vibe coding: shipping faster without the AI slop",
    excerpt:
      "AI tools are great accelerators and terrible defaults. Here is the workflow I use to stay fast without ending up with code I cannot debug.",
    cover: aiCover,
    date: "May 12, 2026",
    readMinutes: 8,
    tags: ["AI", "Workflow", "Developer Experience"],
    sections: [
      { heading: "The 80/20 rule of AI coding", image: aiEighty, caption: "The model owns the first 80% — boilerplate, glue, transformations. The senior engineer owns the last 20%." },
      { heading: "Prompt the contract, not the code", image: aiContract, caption: "Give the model nowhere to drift to: types, errors, one input, one output." },
      { heading: "Read every line", image: aiReview, caption: "If you cannot explain a line, it does not get committed. The shortcut arrives later with interest." },
      { heading: "My current loop", image: aiLoop, caption: "Five steps, one slice at a time, hand-written wherever money or auth is involved." },
    ],
    content: `Half of my output now comes from working with AI tools. The other half is the part where I keep them from making everything worse. Here is the workflow that survived contact with production — three apps, two clients, and one investor demo so far this year.

## The 80/20 rule of AI coding

AI is brilliant at the **first 80%** of a feature — boilerplate, glue code, transformations between shapes you have already defined, the seventh implementation of a pagination component this month. It falls apart on the last 20%: subtle business rules, error handling, the edges where two systems disagree about what null means.

So I let it own the first 80% and I own the last 20%. Reversing that ratio is how you ship bugs at scale. I have watched teams generate entire features end-to-end, ship them, then spend three weeks fixing the corner cases — and have nobody on the team able to explain why the code is shaped the way it is.

## Prompt the contract, not the code

I never ask "write a function that does X." I write the type signature, the error cases, and one example input/output, then ask for the implementation. The model has nowhere to drift to.

\`\`\`ts
// Implement this:
// throws if quantity <= 0
// throws if no active price for the SKU
// returns total in customer currency, rounded to 2dp
async function quote(
  sku: string,
  quantity: number,
  currency: Currency
): Promise<Money> { ... }
\`\`\`

Reviewing the output of a contract prompt takes seconds instead of minutes. The model also generates better tests because the contract is the spec.

## Read every line

This is the rule I break the most and regret the most. If I cannot explain a line of generated code to someone else, it does not get committed. The shortcut feels like savings; the debt arrives later with interest, usually at 11pm on a Friday when production is on fire and the only person who has seen the offending function is a stateless language model.

A useful heuristic: if you accept generated code without reading it, you are not the author, you are a project manager for a junior who never gets better. That is a fine role — but it is not the role most engineers think they are in when they accept the diff.

## My current loop

1. Sketch the data model and the user-visible flow by hand. No AI.
2. Generate the types and zod schemas with AI. Read them. Tighten them.
3. Generate the routes, components, and tests with AI, one slice at a time.
4. Run it. Read everything it produced. Refactor for clarity.
5. Hand-write the parts where money, auth, or destructive actions are involved.

The work I used to do in two weeks now takes three days. The work I used to do in three days still takes three days, because thinking is the bottleneck and no model has fixed thinking yet. Vibe coding is real, but the vibes are the senior engineer's, not the model's.`,
  },
  {
    slug: "freelancing-worldwide-from-malta",
    title: "Freelancing worldwide from a small island",
    excerpt:
      "Living in Malta, working with clients from Bangladesh to Canada. The tooling, time zones, and trust loops that make it work.",
    cover: freelanceCover,
    date: "Apr 28, 2026",
    readMinutes: 7,
    tags: ["Freelance", "Remote", "Community"],
    sections: [
      { heading: "Time zones are a feature", image: flTime, caption: "Overlap is overrated. Lack of overlap is productivity." },
      { heading: "Trust is a delivery problem", image: flTrust, caption: "New clients don't buy hours. They buy predictability." },
      { heading: "Tools I cannot live without", image: flTools, caption: "A repo, a Loom, and one shared doc — that's the whole stack." },
      { heading: "The community part", image: flCommunity, caption: "Qormi at sunset — small island, small group of trusted developers, big difference." },
    ],
    content: `I live in Qormi, Malta. My clients are in Dhaka, Toronto, Sydney, and Frankfurt. Here is how that actually works on a Tuesday — and why, after three years of it, I would not trade it for an office.

## Time zones are a feature

People treat overlap as the goal. It is not. **The lack of overlap is the productivity.** When my Toronto client is asleep, I get four uninterrupted hours of deep work. When they wake up, there is a working build waiting and a Loom explaining the decisions I made. The async loop ships more in a week than two synchronous standups ever did.

The trick is to make the handoff explicit. I end every working day with a written summary: what shipped, what I am stuck on, what I am doing next, what I need a decision on. The client reads it over their coffee. By the time I open my laptop the next day, decisions are made and I am unblocked. The day starts at full speed instead of in a meeting.

## Trust is a delivery problem

New clients do not buy hours, they buy **predictability**. So I quote in deliverables, ship the first small one in 48 hours, and let the work earn the next milestone. By the third deliverable, the relationship runs itself and we stop talking about scope and start talking about strategy.

The 48-hour first deliverable is the most important contract I have. It is small enough that I will finish it even on a bad week, real enough that the client gets to see the actual shape of the work, and visible enough that they can show it to someone else. Three out of four long-term clients I have today started with a 48-hour first ship.

## Tools I cannot live without

- **A clean GitHub repo per project**, even for tiny jobs. The repo is the source of truth, not Slack, not email, not WhatsApp.
- **Loom for async standups.** A two-minute video beats a 40-message thread, every time. Clients watch them at 1.5x.
- **A single shared doc per project** with goals, decisions, and open questions. No tickets without a paragraph of context. No "what did we decide?" arguments three months later.
- **A weekly invoice cadence**, not monthly. Cashflow is a feature of professionalism, and weekly invoices force me to ship something visible every week.

## The community part

Freelancing alone is corrosive. I keep a small group of developers I trade reviews and rates with — some I have never met in person. We share a private Slack, do quarterly portfolio reviews, and quietly refer work to each other when we are full. It is the closest thing I have to coworkers, and it is why I called this section of the site **My Community**. Writing in public is how I pay them back.

If you are reading this and you ship software somewhere in the world, hello. Tell me what you are building.`,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function allPosts(): BlogPost[] {
  return BLOG_POSTS;
}
