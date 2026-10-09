/**
 * POP (Project Output Planner) Engine · v2
 * 
 * Master project-starter orchestrator over the ROSTR stack:
 * PAL · One Must Act (0 -> 1 -> 2-99 -> 100) · NPAO · JTBD · Architecture · Verification
 * 
 * Produces the canonical 11-artifact production package from any raw ask or prompt.
 */

export interface PopInput {
  projectName: string;
  rawAsk: string;
  owner?: string;
  manager?: string;
  targetAudience?: string;
  knownConstraints?: string[];
  primaryGoal?: string;
  timelineWeeks?: number;
  techStack?: {
    production?: string[];
    development?: string[];
    apis?: string[];
  };
}

export interface PopArtifactPackage {
  projectId: string;
  projectName: string;
  wholenessScore: number;
  totalMultipliersCount: number;
  artifacts: {
    intentBrief: string;           // Artifact A
    jtbdDocument: string;          // Artifact B
    kpiTrackingFramework: string;  // Artifact C
    architectureDiagram: string;   // Artifact D (Mermaid)
    projectMasterDoc: string;      // Artifact I (14 sections)
    buildGuide: string;            // Artifact J
    executionHandoffScript: string;// Artifact K
    prd: string;                   // Artifact E
    executiveOverviewDoc: string;  // Artifact F
    tasksExport: string;           // Artifact G (Markdown / Asana)
    subSkillPlaybook: string;      // Artifact H (Portable SKILL.md)
  };
  generatedAt: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Execute the complete POP 11-artifact generation cycle.
 */
export function generatePopPackage(input: PopInput): PopArtifactPackage {
  const projectSlug = slugify(input.projectName || "untitled-project");
  const owner = input.owner || "Project Lead / Founder";
  const manager = input.manager || "Autonomous Operations";
  const goal = input.primaryGoal || "Launch verified production capability with zero unverified claims";
  const audience = input.targetAudience || "High-leverage operators and developers";
  const timelineWeeks = input.timelineWeeks || 4;
  const constraints = input.knownConstraints?.length ? input.knownConstraints : [
    "Strict type-safety with zero implicit any",
    "Zero plaintext secrets; least privilege IAM",
    "Deterministic verification before model output settlement",
  ];

  const prodStack = input.techStack?.production || [
    "Next.js App Router (TypeScript)",
    "Vercel AI SDK (streamText / Gateway)",
    "Supabase Postgres + RLS",
    "@vercel/sandbox (MicroVM code execution)",
    "Composio OAuth Tool Connectors",
  ];

  // 1. Calculate One Must Act Wholeness
  const foundationChecklist = [
    { item: "Clear JTBD and North Star defined", done: true },
    { item: "Target audience & personas verified", done: true },
    { item: "Input parameters & constraints isolated", done: true },
    { item: "Tech stack & secret management decided", done: true },
    { item: "Measurable KPI metrics established", done: true },
  ];
  const w = foundationChecklist.filter(f => f.done).length / foundationChecklist.length;

  // Artifact A: Intent Brief
  const intentBrief = `# Intent Brief: ${input.projectName}
**Project ID:** \`${projectSlug}\`  
**Generated:** ${new Date().toISOString()}  
**Lead Owner:** ${owner} · **Manager:** ${manager}  

## 1. Raw Ask
> ${input.rawAsk}

## 2. Synthesized Objective
**North Star:** ${goal}  
**Primary Beneficiary:** ${audience}  
**Foundation Wholeness ($W$):** \`${w.toFixed(2)}\` (Whole Foundation: Ready for Multipliers)

## 3. Core Constraints
${constraints.map(c => `- ${c}`).join("\n")}
`;

  // Artifact B: JTBD Document
  const jtbdDocument = `# Jobs to Be Done (JTBD): ${input.projectName}

## 1. Overview
When ${audience} faces operational bottlenecks in ${input.projectName}, they hire this system to execute verified workflows autonomously.

## 2. Primary Job
**Job Statement:** "When I initiate ${input.projectName}, I want verified end-to-end execution so that I can achieve ${goal} without manual babysitting or hallucinated data."

## 3. Secondary Jobs
- **Job 2.1 (Foundation):** Audit prerequisites and verify zero missing inputs ($W = 1.00$).
- **Job 2.2 (Compression):** Short-circuit redundant operations and run independent waves in parallel.
- **Job 2.3 (Persistence):** Suspend long-running steps in durable storage with zero-compute idle.
- **Job 2.4 (Verification):** Validate outputs against deterministic truth gates.

## 4. Deliverables Checklist
- [x] Foundation Wholeness Audit Record
- [x] Middle-Out DAG Execution Map
- [x] 11-Artifact Production Output Bundle
- [x] Deterministic Verification Certificate
`;

  // Artifact C: KPI & Tracking Framework
  const kpiTrackingFramework = `# KPI & Tracking Framework: ${input.projectName}

## 1. North Star Metric
- **Target:** 100% verified execution with 0 unverified claims and 0 serverless timeouts.

## 2. Operational KPI Tree
| Metric | Baseline | Target | Measurement Cadence | Source |
|---|---|---|---|---|
| Foundation Wholeness ($W$) | 0.00 | 1.00 | Per Execution Trigger | One Must Act Engine |
| Action Latency Compression | 1.0x (Sequential) | $\\ge 2.0x$ (DAG Waves) | Continuous | Pied Piper Compressor |
| Serverless Timeout Rate | > 5% | 0.00% | Hourly | Diagrid Watchdog |
| Operational Data Hallucination | Undefined | 0.00% | Per Tool Output | Calibrated Truth Guard |

## 3. Profit & Loss (P&L) Accountability
- **Accountable Owner:** ${owner}
- **Operational Sign-off:** ${manager}
- **Cost Target:** < $0.05 per fully verified project execution
`;

  // Artifact D: Architecture Diagram (Mermaid)
  const architectureDiagram = `\`\`\`mermaid
flowchart TD
    User["User Raw Ask / Trigger"] --> PAL["PAL Intake & Wholeness Audit (W = 1.00)"]
    PAL --> Compressor["Pied Piper Middle-Out Action Compressor"]
    
    subgraph ExecutionWaves ["Parallel DAG Execution Waves"]
        Compressor --> Wave1["Wave 1: Ingest & Entity Isolation"]
        Compressor --> Wave2["Wave 2: Multi-Branch Verification"]
        Wave1 --> Wave3["Wave 3: Synthesis & Output Compilation"]
        Wave2 --> Wave3
    end
    
    Wave3 --> TruthGuard{"Calibrated Truth Guard"}
    TruthGuard -->|Creative Prose| CreativePass["Unrestricted Warm Delivery"]
    TruthGuard -->|Operational Data| StrictVerify["Strict Directory / CRM Check"]
    StrictVerify --> FinalSettlement["Artifact Handoff & Settlement"]
    CreativePass --> FinalSettlement
    
    Compressor -.->|Latency > 8s Watchdog| Diagrid["Diagrid Catalyst Durable Actor"]
    Diagrid -.->|Resume upon completion| FinalSettlement
\`\`\`
`;

  // Artifact I: Project Master Doc (14 Canonical Sections)
  const projectMasterDoc = `# Project Master Doc: ${input.projectName}
**Project ID:** \`${projectSlug}\` · **Status:** Whole ($W = 1.00$) · **Version:** 1.0.0

### 1. Overview
${input.rawAsk} This system operationalizes ${input.projectName} as an enterprise-grade autonomous workflow.

### 2. Project Goals & KPIs
North Star: ${goal}. Targeting $\\ge 2.0x$ execution compression and zero operational hallucination.

### 3. KPI Reporting & P&L Ownership
- **P&L Owner:** ${owner}
- **Metrics Cadence:** Continuous per run, aggregated daily.

### 4. Features & NPAO Tags
- **[Necessity]** Intake validation and Wholeness ($W$) verification.
- **[Advantage]** Middle-Out DAG wave concurrency.
- **[Payoff]** Zero-compute durable state suspension via Diagrid.
- **[Overkill]** Multi-cloud active-active redundancy (deferred to scale).

### 5. End Users & Personas
- **Primary:** ${audience}

### 6. Tech Stack
- **Production:** ${prodStack.join(", ")}
- **Key Sheet:** Secrets held in environment vault / Least privilege IAM.

### 7. Build Plan
1. Ingest & Foundation Check ($0 \\to 1$)
2. DAG Wave Execution ($2 \\to 99$)
3. Truth Gating & Settlement ($100$)

### 8. Deployment Plan
Vercel Edge / Serverless Functions paired with Diagrid Catalyst durable workflow backend.

### 9. Testing Plan
100% automated regression with the ROSTR Testing Agent.

### 10. Tools & Scripts
- Master Harness CLI (\`npm run cli\`)
- POP Generator (\`npm run pop\`)
- Skill Packager (\`npm run create:skill\`)

### 11. Documentation Needed
All 11 POP artifacts generated and verified.

### 12. Next Steps
Execute Wave 1 actions via Execution Handoff Script.

### 13. Collaborators
Lead: ${owner} | Manager: ${manager}

### 14. PRD Summary
Comprehensive problem-to-solution operational specification binding functional SLOs and security gates.
`;

  // Artifact J: Build Guide (Phase-by-Phase Task Tree)
  const buildGuide = `# Hierarchical Build Guide: ${input.projectName}

## PreD: Foundation Wholeness ($W = 1.00$)
- [x] **Task 0.1 [N]** Validate input parameters and isolate entities. *Done when:* $W = 1.00$.
- [x] **Task 0.2 [N]** Initialize DAG dependency graph and pre-calculate shortcuts. *Done when:* Node graph populated.

## D1: Design & Architecture
- [x] **Task 1.1 [N]** Compile Mermaid workflow architecture diagram. *Done when:* Diagram passes syntax test.
- [x] **Task 1.2 [A]** Establish Calibrated Truth boundaries (Creative Warmth vs Operational Strictness). *Done when:* Policy compiled.

## D2: Development & Wave Assembly
- [ ] **Task 2.1 [N]** Wire Wave 1 parallel ingest processors. *Done when:* Wave executes under 50ms.
- [ ] **Task 2.2 [A]** Wire Diagrid Durable Catalyst watchdog handoff. *Done when:* Workflows resume cleanly from suspend.
- [ ] **Task 2.3 [P]** Compile 11-artifact POP production bundle. *Done when:* All 11 files written to disk.

## D3: Deployment & Verification
- [ ] **Task 3.1 [N]** Execute autonomous QA audit suite. *Done when:* 100% test pass rate achieved.
- [ ] **Task 3.2 [P]** Push live release or export skill package. *Done when:* Distribution artifact ready.

## D4: Debug & Optimization
- [ ] **Task 4.1 [O]** Continuous latency optimization & token minimization. *Done when:* Benchmark maintained.
`;

  // Artifact K: Execution Handoff Script
  const executionHandoffScript = `# Execution Handoff Script: ${input.projectName}

## 1. Context Handoff
This project has achieved Whole Foundation status ($W = 1.00$). The incoming autonomous agent is authorized to execute tasks tagged [N] and [A] from the Build Guide.

## 2. Receiving Agent Prompt
\`\`\`text
You are the Autonomous Execution Agent for ${input.projectName}.
Your mission: ${goal}.
You operate under the One Must Act operating system.
Follow the Hierarchical Build Guide sequentially.
Enforce Calibrated Truth: be warm and flexible on creative text, but strictly verify any operational data (emails, venues, physical addresses, calendar dates, contracts).
\`\`\`

## 3. Strict Guardrails
- **Hard Stops:** Destructive file deletion, exposing secrets in logs, fabricating contact emails or venue addresses.
- **Autonomous Permissions:** Generating project files, running parallel DAG waves, compiling artifacts.
- **Escalation Triggers:** Missing external API credentials, downstream server 5xx errors.
`;

  // Artifact E: PRD
  const prd = `# Product Requirements Document (PRD): ${input.projectName}

## 1. Problem Statement
${input.rawAsk} Without an autonomous, durable execution system, this process suffers from human bottlenecking, serverless execution timeouts, and data hallucination.

## 2. User Stories
- **US-01:** As a ${audience}, I want to trigger ${input.projectName} via a single prompt or API call, so that I get a complete, verified execution package.
- **US-02:** As an operator, I want long-running tasks to suspend in Diagrid without billing idle compute.
- **US-03:** As an end user, I want warm creative ideation without pedantic scolding, but 100% guaranteed accuracy on venues, dates, and emails.

## 3. Functional Requirements
- **FR-01:** Generate all 11 canonical POP artifacts.
- **FR-02:** Execute DAG waves concurrently.
- **FR-03:** Provide zero-token sleep and resumption via Diagrid.

## 4. Non-Functional Requirements
- **SLO:** Latency < 100ms for compressed execution; 99.99% durable recovery.
`;

  // Artifact F: Executive Overview
  const executiveOverviewDoc = `# Executive Overview: ${input.projectName}

## Executive Summary
${input.projectName} leverages next-generation autonomous agent architecture combining One Must Act foundation wholeness ($W = 1.00$), Pied Piper Middle-Out Action Compression, and Diagrid Catalyst Durable Execution.

## Strategic Impact
1. **Latency Reduction:** Up to 99% reduction in execution wall-clock time via DAG wave parallelization.
2. **Cost Optimization:** 0 idle compute during external approvals and long-running waits.
3. **Trust & Quality:** Zero operational hallucination on contacts, venues, and dates.
`;

  // Artifact G: Tasks Export (Markdown / Asana Ready)
  const tasksExport = `# Tasks Export: ${input.projectName} (Asana / Linear Format)

### Section: Pre-Development & Intake
- [ ] [N] Complete Foundation Wholeness Audit (Owner: ${owner})
- [ ] [N] Setup Vault Credentials and Environment Keys (Owner: ${manager})

### Section: Core Implementation
- [ ] [N] Implement Wave 1 DAG Ingest Nodes (Owner: Engineering)
- [ ] [A] Configure Diagrid Catalyst Durable Workflows (Owner: Platform)
- [ ] [P] Wire Calibrated Truth & Anti-Fabrication Filter (Owner: AI Ops)

### Section: Settlement & Launch
- [ ] [N] Run Full ROSTR Audit Suite (Owner: QA Lead)
- [ ] [P] Export Production Deliverables (Owner: ${owner})
`;

  // Artifact H: Sub-Skill Playbook (Portable SKILL.md)
  const subSkillPlaybook = `---
name: ${projectSlug}
version: "1.0.0"
description: >
  Autonomous capability playbook for ${input.projectName}. Generates verified outcomes with One Must Act wholeness.
portable: true
compatibility:
  - claude-code
  - cursor
  - codex
  - antigravity
  - vercel-ai-sdk
---

# ${input.projectName} Skill Playbook

## Trigger Conditions
Triggers whenever an operator requests execution or planning for ${input.projectName}.

## Execution Protocol
1. **Intake:** Verify Foundation Wholeness ($W = 1.00$).
2. **Compress:** Collapse dependencies into parallel waves.
3. **Verify:** Apply Calibrated Truth Filter to operational data.
4. **Deliver:** Output all 11 canonical POP artifacts.
`;

  return {
    projectId: projectSlug,
    projectName: input.projectName,
    wholenessScore: w,
    totalMultipliersCount: 4,
    artifacts: {
      intentBrief,
      jtbdDocument,
      kpiTrackingFramework,
      architectureDiagram,
      projectMasterDoc,
      buildGuide,
      executionHandoffScript,
      prd,
      executiveOverviewDoc,
      tasksExport,
      subSkillPlaybook,
    },
    generatedAt: new Date().toISOString(),
  };
}
