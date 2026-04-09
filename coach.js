#!/usr/bin/env node
/**
 * AI Manager Transition Coach
 * Helps managers navigate their transition to AI through coaching conversation.
 */

const Anthropic = require('@anthropic-ai/sdk');
const readline = require('readline');

const SYSTEM_PROMPT = `You are an expert AI transition coach specializing in helping managers navigate the shift to AI-augmented work environments. You have deep expertise in:

- Organizational change management during AI adoption
- Practical AI tool integration for management workflows
- Team dynamics when AI enters the workplace
- Redefining managerial roles and value in an AI-augmented organization
- Overcoming psychological barriers to AI adoption (fear, skepticism, over-reliance)
- Concrete action steps for different stages of AI readiness

Your coaching style is:
- Direct and practical — you give concrete, actionable guidance, not platitudes
- Empathetic — you acknowledge the real challenges and anxieties managers face
- Context-aware — you build on what the manager has shared in prior turns
- Honest — you don't sugarcoat AI's impact, but you help managers find their path forward

Focus areas you can coach on:
1. Understanding what AI can and cannot do in their specific context
2. Identifying which parts of their role are most/least affected by AI
3. Building AI literacy for themselves and their team
4. Redesigning workflows to leverage AI effectively
5. Managing team anxiety and resistance around AI
6. Measuring and communicating the value of AI adoption
7. Staying current as AI capabilities evolve rapidly

Start by understanding the manager's specific situation before diving into advice. Ask clarifying questions when needed. Always ground your guidance in their specific context.`;

async function runCoach() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('Error: ANTHROPIC_API_KEY environment variable is required.');
    console.error('Set it with: export ANTHROPIC_API_KEY=your_key_here');
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });
  const conversationHistory = [];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: process.stdin.isTTY,
  });

  const question = (prompt) =>
    new Promise((resolve) => {
      if (process.stdin.isTTY) {
        rl.question(prompt, resolve);
      } else {
        // Non-interactive mode: read lines as they come
        rl.once('line', resolve);
        if (prompt) process.stdout.write(prompt);
      }
    });

  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║        AI Manager Transition Coach                   ║');
  console.log('║  Helping you navigate the shift to AI-augmented work ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Type your situation, questions, or challenges below.');
  console.log('Commands: "quit" or "exit" to end | "clear" to reset conversation');
  console.log('');

  // Opening prompt from the coach
  const opening = await getCoachResponse(client, conversationHistory, null);
  console.log(`Coach: ${opening}\n`);

  while (true) {
    let userInput;
    try {
      userInput = await question('You: ');
    } catch (e) {
      break;
    }

    if (!userInput || !userInput.trim()) continue;

    const trimmed = userInput.trim().toLowerCase();
    if (trimmed === 'quit' || trimmed === 'exit') {
      console.log('\nCoach: Best of luck on your AI transition journey. Remember — the goal isn\'t to become an AI expert overnight, but to keep learning and adapting. Reach out anytime.\n');
      break;
    }

    if (trimmed === 'clear') {
      conversationHistory.length = 0;
      console.log('\n[Conversation reset. Starting fresh.]\n');
      continue;
    }

    try {
      process.stdout.write('\nCoach: ');
      const response = await getCoachResponseStreaming(client, conversationHistory, userInput);
      conversationHistory.push({ role: 'user', content: userInput });
      conversationHistory.push({ role: 'assistant', content: response });
      console.log('\n');
    } catch (err) {
      console.error(`\nError: ${err.message}\n`);
    }
  }

  rl.close();
}

async function getCoachResponse(client, history, userMessage) {
  const messages = userMessage
    ? [...history, { role: 'user', content: userMessage }]
    : [{ role: 'user', content: 'Please greet me and ask about my situation as a manager dealing with AI transition.' }];

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  return response.content[0].text;
}

async function getCoachResponseStreaming(client, history, userMessage) {
  const messages = [...history, { role: 'user', content: userMessage }];

  let fullResponse = '';

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      process.stdout.write(chunk.delta.text);
      fullResponse += chunk.delta.text;
    }
  }

  return fullResponse;
}

runCoach().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
