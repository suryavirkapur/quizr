// src/index.ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { OpenAI } from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const app = new Hono();
const port = process.env.PORT || 5001;

// Middleware
app.use("*", logger());
app.use("*", cors());

// Validation schemas
const QuestionRequestSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
});

const Question = z.object({
  id: z.number(),
  question: z.string(),
  difficulty: z.enum(["easy", "medium", "hard"]),
  category: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().optional(),
});

const QuestionList = z.object({
  questions: z.array(Question),
});

// OpenAI client
const openai = new OpenAI({});

// Health check route
app.get("/health", (c) => {
  return c.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Question generation route
app.post("/questions", async (c) => {
  try {
    const body = await c.req.json();
    const result = QuestionRequestSchema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          error: "Validation failed",
          details: result.error.errors,
        },
        400
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Generate 10 questions about the given topic. Include a mix of difficulties and types of questions.",
        },
        {
          role: "user",
          content: `Generate questions about: ${result.data.topic}`,
        },
      ],
      response_format: zodResponseFormat(QuestionList, "questions"),
    });
    console.log(completion.choices[0].message.content);
    return c.json(
      JSON.parse(completion.choices[0].message.content || "").questions
    );
  } catch (error) {
    console.error("Error generating questions:", error);

    return c.json(
      {
        error: "Failed to generate questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

// Start server
serve({
  fetch: app.fetch,
  port,
});

console.log(`Server is running on port ${port}`);
