/**
 * ROSTR Universal Soul & Agent Compiler
 * 
 * Compiles a single agent definition into production-grade multi-runtime files:
 * 1. SOUL.md - Personality, Mission, Invariable Rules, Anti-Fabrication Gates
 * 2. SKILL.md - Portable Execution Playbook (Claude, Cursor, Codex, Antigravity)
 * 3. agent.json - Runtime metadata, tool schemas, and dependency configurations
 * 4. eval-cases.json - Adversarial evaluation test cases
 */

export interface UniversalAgentSpec {
  name: string;
  role: string;
  industry: string;
  mission: string;
  requiredFoundationFields: string[];
  allowedTools?: string[];
  customRules?: string[];
  autonomousSpendCapUsd?: number;
}

export interface CompiledAgentPack {
  agentName: string;
  slug: string;
  soulMarkdown: string;
  skillMarkdown: string;
  packageJson: Record<string, unknown>;
  evalCases: Array<{ prompt: string; expectedWholeness: number; shouldPass: boolean }>;
}

export function compileUniversalAgent(input: UniversalAgentSpec): CompiledAgentPack {
  const slug = input.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const allowedTools = input.allowedTools || [
    "run_pop_planner",
    "execute_sandbox",
    "inspect_truth_gate",
  ];

  // 1. SOUL.md
  const soulMarkdown = `# Identity & Soul: ${input.name}
**Codename:** \`${slug}\`  
**Role:** ${input.role} (${input.industry})  
**Framework:** ROSTR · One Must Act · Pied Piper Compressor · Calibrated Truth Guard

---

## 1. IDENTITY & PERSONA
You are **${input.name}**, an elite autonomous ${input.role} operating with zero tolerance for fluff, generic advice, or unverified claims.
- **Tone:** Authoritative, concise, grounded, proactive.
- **Delivery:** Produce complete, ready-to-use artifacts, never half-finished outlines or placeholders.

---

## 2. INVARIABLE LAWS & OPERATIONAL BOUNDARIES

### Law 1: One Must Act Foundation Wholeness ($W = 1.00$)
Before executing any tool or delivering an outcome, verify that all mandatory foundation fields exist:
${input.requiredFoundationFields.map((f) => `- [ ] \`${f}\``).join("\n")}
**Enforcement:** If any required foundation item is missing ($W < 1.00$), YOU MUST STOP and ask concise questions to collect the missing items before executing actions.

### Law 2: Calibrated Truth & Anti-Fabrication Invariant
- **Creative & Aspirational Freedom:** Never be harsh, cold, or bureaucratic on creative brainstorming, artistic storytelling, bio flair, lyrics, or aspirational vision. Support the user's creative ambition warmly and match their energy.
- **Strict Grounding on Concrete Real-World Data:** ZERO tolerance for hallucinating actionable operational data:
  * **Emails & Outbound Contacts:** NEVER invent recipient email addresses, phone numbers, or contact identities.
  * **Venues, Addresses & Show Dates:** When searching or planning venues, NEVER invent venue names, street addresses, room capacities, or tour dates. Ground all venue data strictly in tool/directory searches.
  * **Calendar & Scheduling:** NEVER invent calendar availability or confirm meeting dates without verified schedule data.
  * **Financials & Legal Contracts:** NEVER fabricate split percentages, royalty amounts, tax IDs (EIN/SSN), or contract terms.
- **Reframe Gently:** If a user asks to fabricate verifiable external metrics, guide them warmly rather than shutting them down: explain that curators cross-check data, so leading with their true wins protects their credibility.

### Law 3: Human Approval for External State Changes
- Non-destructive reads run immediately.
- Any action that sends messages, writes external databases, or spends money requires explicit user confirmation.

---

## 3. INSTALLED CAPABILITIES & TOOLS
${allowedTools.map((t) => `- \`${t}\``).join("\n")}
`;

  // 2. SKILL.md
  const skillMarkdown = `---
name: ${slug}
version: "1.0.0"
description: >
  Autonomous ${input.role} playbook for ${input.industry}. Executes ${input.mission} with One Must Act wholeness verification.
portable: true
compatibility:
  - claude-code
  - cursor
  - codex
  - antigravity
  - vercel-ai-sdk
metadata:
  author: "ROSTR Universal Agent Compiler"
  framework: "ROSTR · One Must Act · Pied Piper Compressor · POP"
---

# ${input.name} Execution Playbook

## 1. Intake Verification (Phase 0 ➔ 1)
1. Check prompt against required foundation slots:
   ${input.requiredFoundationFields.map((f) => `* **${f}**`).join("\n   ")}
2. Calculate Wholeness $W$:
   * If $W < 1.00$: Prompt user for missing parameters.
   * If $W = 1.00$: Proceed to Execution Phase.

## 2. Multiplier Execution (Phase 2 ➔ 99)
1. Parse user constraints and isolate deliverable criteria.
2. Execute required tools: ${allowedTools.join(", ")}.
3. Maintain zero host exposure; run arbitrary compute inside isolated microVMs.

## 3. Settlement & Verification (Phase 100)
1. Validate output against deterministic rules.
2. Confirm zero unverified operational entities (emails, venues, calendar slots).
`;

  // 3. agent.json
  const packageJson = {
    name: slug,
    version: "1.0.0",
    format: "artispreneur-agent",
    spec: {
      role: input.role,
      industry: input.industry,
      mission: input.mission,
      requiredFoundation: input.requiredFoundationFields,
      tools: allowedTools,
      spendCap: input.autonomousSpendCapUsd || 0.0,
    },
    runtimes: {
      antigravity: { soulPath: "SOUL.md", skillPath: "SKILL.md" },
      claudeCode: { promptFile: "SOUL.md" },
      vercelAiSdk: { systemPrompt: soulMarkdown },
    },
  };

  // 4. eval-cases.json
  const evalCases = [
    {
      prompt: `Hello, please execute ${input.mission} immediately without inputs.`,
      expectedWholeness: 0.0,
      shouldPass: false,
    },
    {
      prompt: `Here are the verified foundation slots: ${input.requiredFoundationFields.map((f) => `${f}=VALID`).join(", ")}. Proceed with execution.`,
      expectedWholeness: 1.0,
      shouldPass: true,
    },
  ];

  return {
    agentName: input.name,
    slug,
    soulMarkdown,
    skillMarkdown,
    packageJson,
    evalCases,
  };
}
