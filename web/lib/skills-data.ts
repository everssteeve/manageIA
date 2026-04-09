// Seed data for initial skills and modules
// CEO will review and finalize actual domain content

export const SKILLS_SEED = [
  {
    slug: "ai-basics",
    title: "AI Fundamentals for Managers",
    description:
      "Understand what modern AI tools can and cannot do, so you can set realistic expectations for your team and stakeholders.",
    category: "Foundation",
    order: 1,
    prerequisites: [],
    modules: [
      {
        title: "What AI Tools Actually Do",
        order: 1,
        body: `# What AI Tools Actually Do

AI tools like ChatGPT, Copilot, and Claude are **large language models (LLMs)**. They predict what text should come next based on patterns learned from vast amounts of human-written content.

## What they're great at

- Drafting, editing, and summarizing text
- Answering questions based on their training data
- Writing and explaining code
- Brainstorming and ideation
- Translating between languages

## What they struggle with

- Knowing things that happened after their training cutoff
- Doing precise arithmetic reliably
- Accessing live information (unless given tools)
- Tasks requiring physical-world awareness

## Key insight for managers

Think of AI as a very capable junior colleague who has read almost everything ever written but has never actually done a job. They need clear direction, context, and your expert review.

## Reflection

Consider: Which tasks in your team's current workflow map to "what AI is great at"?
`,
      },
      {
        title: "Setting Realistic Expectations",
        order: 2,
        body: `# Setting Realistic Expectations

One of your most important jobs during the AI transition is **calibrating expectations** — your own, your team's, and your stakeholders'.

## The hype-reality gap

AI adoption tends to follow a pattern:
1. **Excitement** — early demos are impressive
2. **Frustration** — real workflows are messier than demos
3. **Productivity** — teams who push through find genuine gains

## Common unrealistic expectations

- "AI will do everything automatically" — humans are still essential
- "One prompt and it's done" — good output requires iteration
- "It's always accurate" — AI can be confidently wrong (hallucination)

## How to calibrate your team

1. Share small, concrete examples of what works
2. Acknowledge limitations openly — it builds trust
3. Celebrate iterations, not just final outputs

## Your role

You are not expected to be an AI expert. You are expected to create an environment where your team can experiment safely and learn together.
`,
      },
      {
        title: "The Manager's AI Vocabulary",
        order: 3,
        body: `# The Manager's AI Vocabulary

You don't need to understand AI deeply to lead through this transition — but knowing the key terms helps you ask better questions and avoid being misled.

## Core terms

**Prompt** — The instruction you give an AI. Better prompts → better outputs.

**Hallucination** — When AI states something confidently but incorrectly. Always verify AI-produced facts.

**Context window** — How much text an AI can "hold in mind" at once. Longer context = more expensive but more capable.

**Fine-tuning** — Training an AI on your specific data to make it more specialized.

**RAG (Retrieval-Augmented Generation)** — Letting AI search your documents before answering. Makes responses more accurate for your specific domain.

**Agent** — An AI that can take actions (search the web, run code, send emails) not just generate text.

## Questions to ask your team

- "What prompt did you use to get that output?"
- "Did you verify that fact, or did the AI produce it?"
- "Which model are you using and why?"

Asking these questions signals that you understand AI and creates accountability.
`,
      },
    ],
  },
  {
    slug: "team-ai-adoption",
    title: "Leading Your Team Through AI Adoption",
    description:
      "Practical strategies for helping resistant, skeptical, or overwhelmed team members embrace AI tools productively.",
    category: "Leadership",
    order: 2,
    prerequisites: ["ai-basics"],
    modules: [
      {
        title: "Understanding Resistance",
        order: 1,
        body: `# Understanding Resistance

When team members resist AI tools, it's rarely pure stubbornness. Understanding the root cause is essential to addressing it.

## Common reasons for resistance

**Job security fears** — "Will AI replace me?" This is the most common and emotionally charged concern.

**Competence anxiety** — "I've been doing this for 10 years. Now I have to start over?"

**Trust issues** — "How do I know the AI output is correct?"

**Cognitive overload** — "I'm already busy. Learning new tools takes energy I don't have."

**Workflow disruption** — "My current process works. Change introduces risk."

## What not to do

- Dismiss concerns ("Don't worry, AI won't replace you")
- Mandate adoption without support ("Everyone must use Copilot by Q2")
- Focus only on efficiency gains in your messaging

## What works

- Acknowledge the concern directly
- Share your own experience learning (including struggles)
- Focus on what AI *can't* do — the irreplaceable human parts of their role
- Start with low-stakes experiments where failure is safe
`,
      },
      {
        title: "The 1-3-10 Adoption Framework",
        order: 2,
        body: `# The 1-3-10 Adoption Framework

A practical structure for rolling out AI tools to your team without overwhelming anyone.

## The framework

**1 person first** — Find your most curious team member and let them experiment freely for 2-4 weeks. No pressure for results, just exploration.

**3 examples next** — Ask that person to document 3 specific cases where AI made their work easier. Real examples from your actual workflow matter more than vendor demos.

**10 people after** — Share those examples in a team meeting. Offer optional "AI office hours" where people can try things in a supported environment. Make it safe to look silly.

## Why this works

- Peer examples are more credible than manager mandates
- People learn differently; some need to watch first
- Low-pressure onramps reduce the cognitive cost of starting

## Your role at each stage

| Stage | Your job |
|-------|----------|
| 1 person | Create psychological safety to experiment |
| 3 examples | Amplify and share without overhyping |
| 10 people | Remove friction, answer questions, celebrate small wins |

## Common pitfall

Skipping to "10 people" without doing the groundwork. Team-wide mandates before social proof usually backfire.
`,
      },
    ],
  },
  {
    slug: "workflow-redesign",
    title: "Redesigning Workflows for AI",
    description:
      "Identify which parts of your team's work can be augmented by AI and redesign processes to capture real productivity gains.",
    category: "Operations",
    order: 3,
    prerequisites: ["ai-basics"],
    modules: [
      {
        title: "The AI Audit: Finding Opportunities",
        order: 1,
        body: `# The AI Audit: Finding Opportunities

Before redesigning anything, you need to know where AI can actually help. The AI Audit gives you a structured way to identify opportunities without guesswork.

## The 3-column audit

For each major task your team does, ask:

| Task | Time spent | AI fit? |
|------|-----------|---------|
| Write status reports | 2h/week | High |
| Review pull requests | 5h/week | Medium |
| Client calls | 8h/week | Low |

**AI fit ratings:**
- **High** — Mostly text generation, summarization, drafting, coding
- **Medium** — Research, analysis, some judgment required
- **Low** — Relationship-dependent, highly contextual, creative judgment

## Running the audit with your team

1. List the top 10-15 recurring tasks
2. Estimate time spent weekly
3. Rate AI fit together — this creates shared vocabulary
4. Prioritize the top 3 "high fit, high time" tasks

## Quick win: The 10% experiment

Pick one high-fit task. Ask the team to try using AI for just that task for two weeks and track their experience. A 10% productivity improvement on a frequent task compounds fast.
`,
      },
      {
        title: "Before and After: Workflow Templates",
        order: 2,
        body: `# Before and After: Workflow Templates

Showing your team a concrete "before and after" is more powerful than describing AI in the abstract.

## Template: Status report writing

**Before AI:**
1. Open blank doc (10 min)
2. Remember what happened this week (15 min)
3. Write draft (30 min)
4. Edit and send (10 min)
Total: ~65 min

**After AI:**
1. Dump bullet points of what happened (5 min)
2. Ask AI to draft status report from bullets (2 min)
3. Edit AI draft — fix tone, add context (10 min)
4. Send (1 min)
Total: ~18 min

**The key insight:** AI handles the blank-page problem. Humans handle the accuracy and judgment.

## Template: Research summarization

**Before:** Read 5 articles → take notes → synthesize → write summary (90 min)

**After:** Paste articles → ask AI for key points → verify 2-3 key claims → add your synthesis (25 min)

## Your job

Help your team build their own before/after templates for their highest-value tasks. Make it a team exercise, not a top-down mandate.
`,
      },
    ],
  },
  {
    slug: "ai-communication",
    title: "Communicating About AI to Stakeholders",
    description:
      "How to talk about AI progress, risks, and ROI to executives, peers, and other teams without overpromising or underselling.",
    category: "Communication",
    order: 4,
    prerequisites: ["team-ai-adoption"],
    modules: [
      {
        title: "The AI Progress Update",
        order: 1,
        body: `# The AI Progress Update

Stakeholders want to know if the AI investment is paying off. Here's how to communicate progress honestly and clearly.

## The 3-part structure

**1. What we tried**
Be specific. "We piloted using Claude for first-draft status reports with the backend team (5 people, 4 weeks)."

**2. What we learned**
Both positives and negatives. "Average report writing time dropped from 45 to 15 minutes. Two engineers found the AI drafts too generic and preferred their own style — we didn't force them."

**3. What's next**
Concrete, scoped. "We're expanding to the product team next month and adding a prompt guide to standardize quality."

## What to avoid

- Vague claims: "AI is making us more productive" (says nothing actionable)
- Overclaiming: "AI has transformed how we work" (sets you up for scrutiny)
- Hiding failures: Stakeholders trust honest reporters more than optimists

## The ROI question

If asked about ROI:
- Calculate in **hours saved**, not money (it's more credible)
- Acknowledge **ramp-up cost** (there was one)
- Frame it as a **capability investment**, not a cost-cutting measure
`,
      },
    ],
  },
  {
    slug: "ai-hiring-skills",
    title: "Hiring and Evaluating AI-Ready Talent",
    description:
      "Update your hiring criteria and evaluation frameworks to identify candidates who will thrive in an AI-augmented environment.",
    category: "Talent",
    order: 5,
    prerequisites: ["workflow-redesign"],
    modules: [
      {
        title: "What 'AI-Ready' Actually Means",
        order: 1,
        body: `# What "AI-Ready" Actually Means

"AI-ready" is becoming a buzzword. Here's what it actually means in practice for the roles you're hiring.

## Signals of AI-readiness

**Curiosity and learning agility** — They've tried AI tools on their own, not just when told to. They can describe what worked and what didn't.

**Judgment and critical thinking** — They can tell when AI output is wrong, incomplete, or needs refinement. This matters more than "can use ChatGPT."

**Comfort with ambiguity** — AI workflows are often less deterministic than traditional ones. Candidates who need every process defined will struggle.

**Communication clarity** — Writing clear prompts is a communication skill. Strong communicators tend to get better AI outputs.

## What it does NOT mean

- Has a "Prompt Engineering" certification
- Uses AI for everything (some tasks don't benefit)
- Is enthusiastic about AI in the abstract

## Interview questions to try

- "Tell me about the last thing you tried to learn that didn't come naturally."
- "Describe a time you had to verify information from an unreliable source. What did you do?"
- "Have you used any AI tools in your work? What worked, what didn't?"

These surface the underlying traits you actually care about.
`,
      },
      {
        title: "Updating Job Descriptions for the AI Era",
        order: 2,
        body: `# Updating Job Descriptions for the AI Era

Your job descriptions signal what you value. Outdated JDs attract candidates who will be poorly equipped for AI-augmented work.

## What to change

**Remove:** Requirements that AI now handles (e.g., "expert in manually analyzing data in Excel")

**Add:** Language about working with AI tools, judgment, and output verification

**Reframe:** "5 years experience writing X" → "Demonstrated ability to produce high-quality X, whether independently or with AI assistance"

## Example before/after

**Before:** "Writes detailed technical documentation from scratch"

**After:** "Produces clear, accurate technical documentation and can direct AI tools to accelerate drafting while maintaining technical accuracy"

## What to keep

Core domain expertise still matters — AI amplifies good judgment, it doesn't replace it. Keep requirements for genuine subject matter expertise.

## A practical approach

For your next open role:
1. List the top 5 tasks in the JD
2. For each, ask: "Would an AI-ready candidate approach this differently?"
3. Rewrite the requirement to capture the outcome, not the method
`,
      },
    ],
  },
  {
    slug: "psychological-safety",
    title: "Building Psychological Safety for AI Experimentation",
    description:
      "Create the team culture and conditions where people feel safe to try, fail, and learn with AI tools.",
    category: "Culture",
    order: 6,
    prerequisites: ["team-ai-adoption"],
    modules: [
      {
        title: "Why Safety Matters for AI Adoption",
        order: 1,
        body: `# Why Safety Matters for AI Adoption

AI adoption requires experimentation. Experimentation requires safety to fail. Without psychological safety, your team will either not try, or hide their experiments from you.

## The experimentation-safety link

When people experiment with AI, they will:
- Get bad outputs and not know why
- Make mistakes they wouldn't make manually
- Look less "expert" temporarily
- Take longer on some tasks before they get faster

If your culture punishes these experiences, adoption stalls.

## What psychological safety looks like in practice

- Managers share their own AI failures and learning curves
- There's no judgment for asking "dumb questions" about AI
- Mistakes made during AI-assisted work are treated as learning data, not performance issues
- People talk openly about when AI didn't help them

## The manager's signal

The most important variable is what the manager does, not what the manager says.

If you say "feel free to experiment" but never share your own struggles, the message your team hears is "experimentation is risky."

Model the behavior you want to see.
`,
      },
    ],
  },
  {
    slug: "measuring-ai-impact",
    title: "Measuring AI Impact",
    description:
      "Define meaningful metrics to track whether your team's AI adoption is actually improving outcomes — and adjust based on data.",
    category: "Operations",
    order: 7,
    prerequisites: ["workflow-redesign", "ai-communication"],
    modules: [
      {
        title: "Choosing the Right Metrics",
        order: 1,
        body: `# Choosing the Right Metrics

The wrong AI metrics lead to the wrong behavior. Here's how to choose metrics that actually tell you something useful.

## Bad metrics (and why)

**"Number of AI prompts sent"** — Measures activity, not value. Someone could send 100 bad prompts.

**"Time on AI tools"** — Could indicate struggle as easily as productivity.

**"% of tasks using AI"** — Pushes adoption for adoption's sake, not value.

## Good metrics

**Output quality maintained or improved** — Is the work still good? Use your existing quality bar as the baseline.

**Time to first draft** — For writing-heavy tasks, this is measurable and meaningful.

**Error rates** — Are errors going up or down? AI can introduce new types of errors.

**Employee-reported friction** — Simple weekly check-in: "Did AI save you time or cost you time this week?"

## A starter measurement framework

Pick 2-3 tasks to measure. For each:
1. Establish baseline (week before AI adoption)
2. Measure for 4 weeks after
3. Survey the team weekly (1 question, 5 minutes)
4. Review together — don't interpret alone

## Important

If your metrics show AI isn't helping for a specific task, that's valuable data. Not every task benefits. Act on it.
`,
      },
    ],
  },
];
