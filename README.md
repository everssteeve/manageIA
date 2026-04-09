# AI Manager Transition Coach — MVP

An AI-powered coaching conversation that helps managers navigate their transition to AI-augmented work.

## What It Does

- Manager describes their situation and challenges with AI adoption
- Coach provides concrete, actionable guidance tailored to their context
- Conversation is multi-turn and context-aware — the coach remembers what you've shared
- Streaming responses for a natural conversation feel

## Setup

```bash
# Install dependencies (already done in this repo)
npm install

# Set your Anthropic API key
export ANTHROPIC_API_KEY=your_api_key_here
```

## Run

```bash
npm start
# or
node coach.js
```

## Demo Walkthrough

1. Run `npm start`
2. The coach opens with a greeting and asks about your situation
3. Try inputs like:
   - *"My team is resistant to using AI tools and I'm not sure how to get them on board."*
   - *"I'm a middle manager at a 500-person company. We just got Copilot licenses but no one is using them."*
   - *"I'm worried AI will make my role irrelevant. What should I focus on?"*
   - *"We've been told to use AI to increase output by 30% but I don't know where to start."*
4. The coach responds with specific, actionable guidance
5. Continue the conversation — it builds on prior turns
6. Type `clear` to reset, `quit` or `exit` to end

## Architecture

```
coach.js           — Single-file CLI app
  ├── System prompt — Coaching persona & focus areas
  ├── Conversation  — In-memory multi-turn history
  ├── Streaming     — Real-time streamed responses via Anthropic SDK
  └── readline      — Terminal I/O for conversation loop
```

**Model:** `claude-sonnet-4-6`  
**SDK:** `@anthropic-ai/sdk`  
**Interface:** CLI (Node.js readline)

## Coaching Focus Areas

The system prompt primes the model to coach on:
1. Understanding AI capabilities vs. limitations in their context
2. Identifying which parts of their role are most/least affected
3. Building AI literacy for themselves and their team
4. Redesigning workflows to leverage AI
5. Managing team anxiety and resistance
6. Measuring and communicating the value of AI adoption
7. Staying current as AI evolves rapidly
