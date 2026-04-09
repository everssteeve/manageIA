import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DAILY_MESSAGE_LIMIT = 20;

const SYSTEM_PROMPT_BASE = `You are an expert AI coach helping managers successfully navigate their transition to AI-augmented work. You specialize in:

1. Helping managers understand what AI tools can and cannot do in their specific context
2. Identifying which parts of their role are most and least affected by AI
3. Building AI literacy for themselves and their teams
4. Redesigning workflows to leverage AI effectively
5. Managing team anxiety and resistance to change
6. Measuring and communicating the value of AI adoption
7. Staying current as AI evolves rapidly

Your coaching style:
- Empathetic but direct — you acknowledge the difficulty while keeping focus on action
- Concrete and specific — you give real examples, frameworks, and step-by-step guidance
- Honest about limitations — you never oversell what AI can do
- Focused on the human side — technology is secondary to people, culture, and leadership

When you lack context about the user's specific situation, ask clarifying questions before offering advice. Always prioritize their specific context over generic advice.`;

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  fr: "\n\nIMPORTANT: Respond exclusively in French (français). All your messages must be in French.",
  es: "\n\nIMPORTANT: Respond exclusively in Spanish (español). All your messages must be in Spanish.",
};

function getSystemPrompt(lang?: string): string {
  const instruction = lang ? (LANGUAGE_INSTRUCTIONS[lang] ?? "") : "";
  return SYSTEM_PROMPT_BASE + instruction;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Rate limiting: check daily message count
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dailyMessageCount = await prisma.coachingMessage.count({
    where: {
      role: "user",
      createdAt: { gte: today },
      session: { userId },
    },
  });

  if (dailyMessageCount >= DAILY_MESSAGE_LIMIT) {
    return NextResponse.json(
      { error: "Daily message limit reached. Please continue tomorrow." },
      { status: 429 }
    );
  }

  const { sessionId, message, lang } = await req.json();

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // Get or validate session
  let coachingSession;
  if (sessionId) {
    coachingSession = await prisma.coachingSession.findFirst({
      where: { id: sessionId, userId },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
  }

  if (!coachingSession) {
    coachingSession = await prisma.coachingSession.create({
      data: { userId, title: message.slice(0, 60) },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });
  }

  // Build message history for Claude
  const history = coachingSession.messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  // Add user context to system prompt
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const userContext = user
    ? `\n\nUser context: Role: ${user.role || "not specified"}, Team size: ${user.teamSize || "not specified"}, AI familiarity: ${user.aiFamiliarity || "not specified"}.`
    : "";

  // Save user message
  await prisma.coachingMessage.create({
    data: {
      sessionId: coachingSession.id,
      role: "user",
      content: message,
    },
  });

  // Stream response from Claude
  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: getSystemPrompt(lang) + userContext,
    messages: [...history, { role: "user", content: message }],
  });

  // Collect full response to save to DB
  let fullResponse = "";

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          const text = chunk.delta.text;
          fullResponse += text;
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text })}\n\n`));
        }
      }

      // Save assistant message
      await prisma.coachingMessage.create({
        data: {
          sessionId: coachingSession!.id,
          role: "assistant",
          content: fullResponse,
        },
      });

      controller.enqueue(
        new TextEncoder().encode(
          `data: ${JSON.stringify({ done: true, sessionId: coachingSession!.id })}\n\n`
        )
      );
      controller.close();
    },
  });

  return new NextResponse(readableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
