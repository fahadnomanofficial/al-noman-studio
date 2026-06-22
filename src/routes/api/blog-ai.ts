import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { z } from "zod";
import { getPost } from "@/components/portfolio/blogs";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const schema = z.object({
  slug: z.string().min(1).max(120),
  mode: z.enum(["summary", "ask"]),
  question: z.string().trim().max(500).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(2000),
      }),
    )
    .max(20)
    .optional(),
});

export const Route = createFileRoute("/api/blog-ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Invalid input" }, { status: 400 });
        }

        const { slug, mode, question, history } = parsed.data;
        const post = getPost(slug);
        if (!post) return Response.json({ error: "Post not found" }, { status: 404 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return Response.json({ error: "AI not configured" }, { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const articleContext = `TITLE: ${post.title}\nDATE: ${post.date}\nTAGS: ${post.tags.join(", ")}\n\n${post.content}`;

        const systemBase = `You are a thoughtful writing assistant for Fahad Al Noman's blog "My Community". Stay grounded in the article provided. If something is not in the article, say so briefly. Be concise and friendly.\n\n--- ARTICLE ---\n${articleContext}\n--- END ARTICLE ---`;

        try {
          if (mode === "summary") {
            const result = streamText({
              model,
              system: systemBase,
              prompt:
                "Write a TL;DR of the article above as exactly 3 short bullet points (each one sentence, no preamble). Use Markdown bullets starting with '- '.",
            });
            return result.toTextStreamResponse();
          }

          // ask mode
          if (!question) return Response.json({ error: "Question required" }, { status: 400 });
          const result = streamText({
            model,
            system: systemBase,
            messages: [
              ...(history ?? []).map((m) => ({ role: m.role, content: m.content })),
              { role: "user" as const, content: question },
            ],
          });
          return result.toTextStreamResponse();
        } catch (err) {
          console.error("blog-ai failed:", err);
          return Response.json({ error: "AI request failed" }, { status: 502 });
        }
      },
    },
  },
});
