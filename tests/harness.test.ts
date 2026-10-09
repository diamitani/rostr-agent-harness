import test from "node:test";
import assert from "node:assert/strict";
import { actionCompressor, type ActionNode } from "../src/core/compressor.js";
import { generatePopPackage } from "../src/core/pop.js";
import { truthGuard } from "../src/core/truth-guard.js";
import { compileUniversalAgent } from "../src/core/soul-builder.js";
import { diagrid } from "../src/core/diagrid.js";
import { skillRegistry } from "../src/skills/registry.js";
import { epkBuilderSkill } from "../src/skills/epk-builder/index.js";
import { venueScoutSkill } from "../src/skills/venue-scout/index.js";

test("1. Middle-Out Action Compressor collapses DAG waves and respects boolean preconditions", async () => {
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
  assert.ok(plan.skippedSteps.includes("node_2_shortcut"), "Must skip false precondition");
  assert.ok(plan.compressionRatio > 1.0, "Compression ratio must be > 1.0x");

  const result = await actionCompressor.executeCompressedWorkflow(nodes, { runDeep: false });
  assert.equal(result.handedOffToDurable, false);
  assert.ok(result.context.branchA);
  assert.ok(result.context.branchB);
});

test("2. POP (Project Output Planner) produces all 11 canonical production artifacts", () => {
  const pkg = generatePopPackage({
    projectName: "Open Agent Release",
    rawAsk: "Publish open source autonomous agent harness",
    owner: "System Architect",
    primaryGoal: "Enterprise adoption",
  });

  const expectedKeys = [
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

  for (const k of expectedKeys) {
    assert.ok(pkg.artifacts[k], `Artifact ${k} must exist`);
    assert.ok(pkg.artifacts[k].length > 50, `Artifact ${k} must have substantive content`);
  }
  assert.equal(pkg.wholenessScore, 1.0, "Foundation must be Whole (W = 1.00)");
});

test("3. Calibrated Truth Guard permits creative freedom but strictly flags operational claims", () => {
  // Creative text
  const creativeProse = "The neon synthesizer reverberates across retro-futuristic soundscapes and interstellar horizons.";
  const creativeCheck = truthGuard.inspect(creativeProse, { isCreativeMode: true });
  assert.equal(creativeCheck.severity, "creative_unrestricted");
  assert.equal(creativeCheck.isOperationalData, false);

  // Operational text with email and address
  const bookingText = "Please confirm the booking with agent@madisonsquaregarden.com for the show at 4 Pennsylvania Plaza, New York, NY.";
  const operationalCheck = truthGuard.inspect(bookingText);
  assert.equal(operationalCheck.isOperationalData, true);
  assert.equal(operationalCheck.severity, "operational_requires_verification");
  assert.ok(operationalCheck.detectedCategories.includes("email"));
  assert.ok(operationalCheck.detectedCategories.includes("venue_address"));
  assert.ok(operationalCheck.userFacingNotice);
});

test("4. Diagrid Durable Client executes with local fallback resilience", async () => {
  const status = await diagrid.startWorkflow({
    workflowName: "LongRunningHandoff",
    instanceId: `test-${Date.now()}`,
    input: { test: true },
  });
  assert.ok(status.instanceId);
  assert.equal(status.runtimeStatus, "RUNNING");

  const approved = await diagrid.raiseApprovalEvent(status.instanceId, "HumanApproval", { approvedBy: "operator" });
  assert.equal(approved, true);

  const updated = await diagrid.getWorkflowStatus(status.instanceId);
  assert.equal(updated?.runtimeStatus, "COMPLETED");
});

test("5. Pluggable Skill Registry executes registered skills with foundation validation", async () => {
  skillRegistry.registerSkill(epkBuilderSkill);
  skillRegistry.registerSkill(venueScoutSkill);

  // Test missing foundation rejection
  const incompleteResult = await skillRegistry.executeSkill("epk-builder", {
    input: { artistName: "Luna Ray" }, // missing genre & bioPrompt
    foundationWholeness: 0.33,
    environment: {},
  });
  assert.equal(incompleteResult.success, false);

  // Test whole foundation success
  const completeResult = await skillRegistry.executeSkill("epk-builder", {
    input: {
      artistName: "Luna Ray",
      genre: "Synthwave",
      bioPrompt: "Cosmic indie synth artist based in Denver.",
    },
    foundationWholeness: 1.0,
    environment: {},
  });
  assert.equal(completeResult.success, true);
  assert.ok(completeResult.data.epkHtml);
});
