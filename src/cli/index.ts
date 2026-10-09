#!/usr/bin/env node
/**
 * Master ROSTR Agent Harness CLI
 * 
 * Commands:
 * - pop           : Generate canonical 11-artifact POP package for any project
 * - create-skill  : Scaffold a new pluggable skill package in src/skills/
 * - agent         : Compile universal agent pack (SOUL, SKILL, agent.json, evals)
 * - mcp           : Generate mcp.json configuration
 * - test          : Run autonomous system audit
 */

import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";
import { generatePopPackage } from "../core/pop.js";
import { compileUniversalAgent } from "../core/soul-builder.js";
import { mcpBuilder } from "../core/mcp-builder.js";
import { skillRegistry } from "../skills/registry.js";
import { epkBuilderSkill } from "../skills/epk-builder/index.js";
import { venueScoutSkill } from "../skills/venue-scout/index.js";

// Register default skills
skillRegistry.registerSkill(epkBuilderSkill);
skillRegistry.registerSkill(venueScoutSkill);

const isAutoYes = process.argv.includes("--yes") || process.argv.includes("-y") || !process.stdin.isTTY;

function askQuestion(query: string, defaultValue = ""): Promise<string> {
  if (isAutoYes) {
    return Promise.resolve(defaultValue);
  }
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const prompt = defaultValue ? `${query} [${defaultValue}]: ` : `${query}: `;
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

async function handlePopCommand() {
  console.log("\n=======================================================");
  console.log("       POP (PROJECT OUTPUT PLANNER) ENGINE · v2        ");
  console.log("=======================================================\n");

  const projectName = await askQuestion("Project Name", "New Autonomous Initiative");
  const rawAsk = await askQuestion("Raw Ask / Problem Statement", "Build and launch an autonomous system with zero operational data hallucination");
  const owner = await askQuestion("Project Lead / Owner", "Founder");
  const primaryGoal = await askQuestion("North Star Metric / Outcome", "100% verified execution");

  console.log("\n⏳ Generating canonical 11-artifact POP package...");
  const popResult = generatePopPackage({
    projectName,
    rawAsk,
    owner,
    primaryGoal,
  });

  const outDir = path.resolve(process.cwd(), "projects", popResult.projectId);
  fs.mkdirSync(outDir, { recursive: true });

  const mapping: Record<string, string> = {
    "01_INTENT_BRIEF.md": popResult.artifacts.intentBrief,
    "02_JTBD.md": popResult.artifacts.jtbdDocument,
    "03_KPI_TRACKING.md": popResult.artifacts.kpiTrackingFramework,
    "04_ARCHITECTURE.md": popResult.artifacts.architectureDiagram,
    "05_PROJECT_MASTER_DOC.md": popResult.artifacts.projectMasterDoc,
    "06_BUILD_GUIDE.md": popResult.artifacts.buildGuide,
    "07_EXECUTION_HANDOFF.md": popResult.artifacts.executionHandoffScript,
    "08_PRD.md": popResult.artifacts.prd,
    "09_EXECUTIVE_OVERVIEW.md": popResult.artifacts.executiveOverviewDoc,
    "10_TASKS.md": popResult.artifacts.tasksExport,
    "11_SKILL.md": popResult.artifacts.subSkillPlaybook,
  };

  for (const [filename, content] of Object.entries(mapping)) {
    fs.writeFileSync(path.join(outDir, filename), content, "utf8");
  }

  console.log(`\n✅ POP 11-Artifact Package successfully created in:\n   📁 ${outDir}\n`);
  console.log("Generated Artifacts:");
  for (const f of Object.keys(mapping)) {
    console.log(`   📄 ${f}`);
  }
  console.log(`\nFoundation Wholeness: W = ${popResult.wholenessScore.toFixed(2)} (WHOLE FOUNDATION)`);
}

async function handleCreateSkillCommand() {
  console.log("\n=======================================================");
  console.log("           PLUGGABLE SKILL PACKAGE GENERATOR           ");
  console.log("=======================================================\n");

  const skillName = await askQuestion("Skill Name (kebab-case)", "custom-analyzer");
  const description = await askQuestion("Description", "Analyzes data and produces verified reports");
  const foundationInput = await askQuestion("Required Foundation Fields (comma-separated)", "targetId,inputData");
  const operationalDataInput = await askQuestion("Operational Categories (email, venue_address, calendar_date, financial_legal)", "email");

  const foundationFields = foundationInput.split(",").map((s) => s.trim()).filter(Boolean);
  const operationalCategories = operationalDataInput.split(",").map((s) => s.trim()).filter(Boolean);

  const skillDir = path.resolve(process.cwd(), "src", "skills", skillName);
  fs.mkdirSync(skillDir, { recursive: true });

  const skillContent = `import { type PluggableSkill, type SkillContext, type SkillOutput } from "../types.js";
import { truthGuard } from "../../core/truth-guard.js";

export const ${skillName.replace(/-([a-z])/g, (_, c) => c.toUpperCase())}Skill: PluggableSkill = {
  manifest: {
    name: "${skillName}",
    version: "1.0.0",
    description: "${description}",
    requiredFoundationFields: ${JSON.stringify(foundationFields)},
    operationalDataCategories: ${JSON.stringify(operationalCategories)},
  },

  async execute(context: SkillContext): Promise<SkillOutput> {
    const start = Date.now();
    // 1. Foundation Verification is handled automatically by SkillRegistry
    
    // 2. Skill Execution Logic
    const outputData = {
      result: "Executed successfully",
      processedFields: context.input,
    };

    // 3. Apply Calibrated Truth Guard if operational text is generated
    const check = truthGuard.inspect(JSON.stringify(outputData));

    return {
      success: true,
      artifactsProduced: ["report.json"],
      data: outputData,
      latencyMs: Date.now() - start,
      unverifiedClaims: check.unverifiedClaims,
    };
  },
};
`;

  fs.writeFileSync(path.join(skillDir, "index.ts"), skillContent, "utf8");
  console.log(`\n✅ Pluggable Skill created at:\n   📁 ${path.join(skillDir, "index.ts")}\n`);
}

async function handleAgentCommand() {
  console.log("\n=======================================================");
  console.log("           UNIVERSAL SOUL & AGENT COMPILER             ");
  console.log("=======================================================\n");

  const name = await askQuestion("Agent Name", "Booking Counsel Agent");
  const role = await askQuestion("Agent Role", "Live Tour Routing Specialist");
  const industry = await askQuestion("Industry", "Live Entertainment");
  const mission = await askQuestion("Mission", "Route tours and audit promoter contracts");
  const foundationInput = await askQuestion("Required Foundation Fields", "artistName,metroList,routingDates");

  const pack = compileUniversalAgent({
    name,
    role,
    industry,
    mission,
    requiredFoundationFields: foundationInput.split(",").map((s) => s.trim()),
  });

  const outDir = path.resolve(process.cwd(), "agents", pack.slug);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "SOUL.md"), pack.soulMarkdown, "utf8");
  fs.writeFileSync(path.join(outDir, "SKILL.md"), pack.skillMarkdown, "utf8");
  fs.writeFileSync(path.join(outDir, "agent.json"), JSON.stringify(pack.packageJson, null, 2), "utf8");
  fs.writeFileSync(path.join(outDir, "eval-cases.json"), JSON.stringify(pack.evalCases, null, 2), "utf8");

  console.log(`\n✅ Agent Package compiled to:\n   📁 ${outDir}\n`);
}

async function handleMcpCommand() {
  const config = mcpBuilder.generateMcpConfigJson();
  const filePath = path.resolve(process.cwd(), "mcp.json");
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf8");
  console.log(`\n✅ Generated MCP configuration:\n   📄 ${filePath}\n`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";

  switch (command) {
    case "pop":
    case "plan":
      await handlePopCommand();
      break;
    case "create-skill":
    case "skill":
      await handleCreateSkillCommand();
      break;
    case "agent":
      await handleAgentCommand();
      break;
    case "mcp":
      await handleMcpCommand();
      break;
    default:
      console.log(`
Master ROSTR Agent Harness CLI

Available Commands:
  npm run pop             : Run POP (Project Output Planner) to get all 11 documents
  npm run create:skill    : Scaffold a new pluggable skill package
  npm run cli agent       : Compile universal agent pack (SOUL.md, SKILL.md, agent.json)
  npm run cli mcp         : Generate mcp.json configuration file
  npm test                : Run autonomous QA audit test suite
      `);
      break;
  }
}

main().catch(console.error);
