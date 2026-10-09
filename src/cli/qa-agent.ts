/**
 * ROSTR Agent Harness Autonomous QA Testing Agent
 * 
 * Author: Patrick Diamitani · Diamitani Industries, Inc.
 * Framework: ROSTR Agent OS · One Must Act · Diagrid Catalyst · Calibrated Truth Guard
 */

import { actionCompressor, type ActionNode } from "../core/compressor.js";
import { generatePopPackage } from "../core/pop.js";
import { truthGuard } from "../core/truth-guard.js";
import { diagrid } from "../core/diagrid.js";
import { skillRegistry } from "../skills/registry.js";
import { epkBuilderSkill } from "../skills/epk-builder/index.js";
import { venueScoutSkill } from "../skills/venue-scout/index.js";

async function runHarnessQaAudit() {
  console.log(`
╔═════════════════════════════════════════════════════════════════════════╗
║          ROSTR AGENT HARNESS AUTONOMOUS QA TESTING AGENT                ║
║  Designed & Authored by Patrick Diamitani · Diamitani Industries, Inc.  ║
╚═════════════════════════════════════════════════════════════════════════╝
`);

  const startTime = Date.now();
  let passed = 0;
  let total = 0;

  function assertCheck(name: string, condition: boolean, note?: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`   ✅ [PASS] ${name} ${note ? `— (${note})` : ""}`);
    } else {
      console.log(`   ❌ [FAIL] ${name} ${note ? `— (${note})` : ""}`);
    }
  }

  console.log("🔍 [PHASE 1] Pied Piper Action Compressor Audit:");
  const nodes: ActionNode[] = [
    {
      id: "node_1",
      name: "Prerequisite Node",
      dependencies: [],
      estimatedDurationMs: 100,
      execute: async () => ({ step1: true }),
    },
    {
      id: "node_2_shortcut",
      name: "Optional Shortcut Step",
      dependencies: ["node_1"],
      estimatedDurationMs: 500,
      booleanPrecondition: (ctx) => Boolean(ctx.runDeep),
      execute: async () => ({ step2: true }),
    },
    {
      id: "node_3a",
      name: "Parallel Branch A",
      dependencies: ["node_1"],
      estimatedDurationMs: 200,
      execute: async () => ({ branchA: true }),
    },
    {
      id: "node_3b",
      name: "Parallel Branch B",
      dependencies: ["node_1"],
      estimatedDurationMs: 200,
      execute: async () => ({ branchB: true }),
    },
  ];

  const plan = actionCompressor.analyzeAndCompress(nodes, { runDeep: false });
  assertCheck("Compressor skips false preconditions", plan.skippedSteps.includes("node_2_shortcut"));
  assertCheck("Compressor parallelizes independent DAG branches", plan.compressedWaves.some((w) => w.includes("node_3a") && w.includes("node_3b")));
  assertCheck("Compressor achieves > 1.0x compression ratio", plan.compressionRatio > 1.0, `Ratio: ${plan.compressionRatio}x`);

  const compExec = await actionCompressor.executeCompressedWorkflow(nodes, { runDeep: false });
  assertCheck("Compressor executes workflow without handoff under budget", !compExec.handedOffToDurable);

  console.log("\n📦 [PHASE 2] POP (Project Output Planner) 11-Artifact Audit:");
  const popStart = Date.now();
  const popPkg = generatePopPackage({
    projectName: "Harness QA Validation",
    rawAsk: "Verify all 11 production artifacts and foundation wholeness",
    owner: "Patrick Diamitani",
    primaryGoal: "100% Artifact Integrity",
  });
  const popTime = Date.now() - popStart;

  const expectedArtifacts = [
    "intentBrief",
    "jtbdDocument",
    "kpiTrackingFramework",
    "architectureDiagram",
    "projectMasterDoc",
    "buildGuide",
    "executionHandoffScript",
    "prd",
    "executiveOverviewDoc",
    "tasksExport",
    "subSkillPlaybook",
  ] as const;

  const allArtifactsValid = expectedArtifacts.every((k) => popPkg.artifacts[k] && popPkg.artifacts[k].length > 50);
  assertCheck("POP produces all 11 canonical artifacts", allArtifactsValid, `Generated in ${popTime}ms`);
  assertCheck("One Must Act Wholeness is 1.00", popPkg.wholenessScore === 1.0, "W = 1.00");

  console.log("\n🛡️ [PHASE 3] Calibrated Truth Guard Verification:");
  const creativeSample = "Luna Ray weaves cosmic indie synthwave into celestial anthems.";
  const creativeCheck = truthGuard.inspect(creativeSample, { isCreativeMode: true });
  assertCheck("Creative Mode grants unrestricted warm freedom", creativeCheck.severity === "creative_unrestricted");

  const operationalSample = "Send booking contract to agent@redrocksamphitheater.com for show at 18300 W Alameda Pkwy, Morrison, CO.";
  const operationalCheck = truthGuard.inspect(operationalSample);
  assertCheck("Operational Rigor detects emails and addresses", operationalCheck.isOperationalData && operationalCheck.detectedCategories.includes("email") && operationalCheck.detectedCategories.includes("venue_address"));
  assertCheck("Operational Rigor outputs constructive verification notice", operationalCheck.severity === "operational_requires_verification" && Boolean(operationalCheck.userFacingNotice));

  console.log("\n⚡ [PHASE 4] Diagrid Catalyst Durable Execution Fallback:");
  const diagridStatus = await diagrid.startWorkflow({
    workflowName: "QATestWorkflow",
    instanceId: `qa-${Date.now()}`,
    input: { test: true },
  });
  assertCheck("Diagrid client handles dispatch with fallback resilience", Boolean(diagridStatus.instanceId));

  const approved = await diagrid.raiseApprovalEvent(diagridStatus.instanceId, "HumanApproval", { approved: true });
  assertCheck("Diagrid client handles approval event resume", approved);

  console.log("\n🧩 [PHASE 5] Pluggable Skill Registry Audit:");
  skillRegistry.registerSkill(epkBuilderSkill);
  skillRegistry.registerSkill(venueScoutSkill);

  const missingFoundationResult = await skillRegistry.executeSkill("epk-builder", {
    input: { artistName: "Luna Ray" },
    foundationWholeness: 0.33,
    environment: {},
  });
  assertCheck("Skill registry rejects incomplete foundations (W < 1.00)", !missingFoundationResult.success);

  const completeResult = await skillRegistry.executeSkill("epk-builder", {
    input: {
      artistName: "Luna Ray",
      genre: "Synthwave",
      bioPrompt: "Cosmic indie synth artist based in Denver.",
    },
    foundationWholeness: 1.0,
    environment: {},
  });
  assertCheck("Skill registry executes whole foundation (W = 1.00)", completeResult.success);

  const elapsed = Date.now() - startTime;
  console.log(`\n=========================================================================`);
  console.log(`📊 [QA SUMMARY] Checks Passed: ${passed} / ${total} (${Math.round((passed / total) * 100)}%) in ${elapsed}ms.`);
  console.log(`   Author: Patrick Diamitani · Diamitani Industries, Inc.`);
  console.log(`   Status: ${passed === total ? "✅ 100% PRODUCTION READY" : "❌ AUDIT FAILED"}`);
  console.log(`=========================================================================\n`);
}

runHarnessQaAudit().catch((err) => {
  console.error("❌ [FATAL QA ERROR]:", err);
  process.exit(1);
});
