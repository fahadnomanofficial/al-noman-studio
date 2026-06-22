import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  text: z.string().trim().min(1).max(4000),
});

export const Route = createFileRoute("/api/blog-tts")({
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
        if (!parsed.success) return Response.json({ error: "Invalid input" }, { status: 400 });

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return Response.json({ error: "AI not configured" }, { status: 500 });

        try {
          const response = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "openai/gpt-4o-mini-tts",
              input: parsed.data.text,
              voice: "alloy",
              stream_format: "sse",
              response_format: "pcm",
            }),
            signal: request.signal,
          });
          if (!response.ok) {
            const text = await response.text().catch(() => "");
            return Response.json(
              { error: `TTS failed: ${response.status} ${text}` },
              { status: response.status },
            );
          }
          return new Response(response.body, {
            headers: { "Content-Type": "text/event-stream" },
          });
        } catch (err) {
          if (request.signal.aborted) return new Response(null, { status: 499 });
          console.error("TTS failed:", err);
          return Response.json({ error: "TTS request failed" }, { status: 502 });
        }
      },
    },
  },
});
