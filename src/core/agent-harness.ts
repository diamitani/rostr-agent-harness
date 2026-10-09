/**
 * Master Agent Harness Runtime
 * 
 * Orchestrates Vercel AI SDK with:
 * - One Must Act ($0 -> 1 -> 2-99 -> 100) Wholeness Audit
 * - Pied Piper Middle-Out Action Compression
 * - Calibrated Truth & Anti-Fabrication Filter
 * - POP (Project Output Planner) 11-Artifact Engine
 * - Diagrid Catalyst Durable Execution & Virtual Actors
 */

import { z } from "zod";
import { generatePopPackage, type PopArtifactPackage } from "./pop.js";
import { actionCompressor, type ActionNode } from "./compressor.js";
import { truthGuard } from "./truth-guard.js";
import { compileUniversalAgent } from "./soul-builder.js";
import { diagrid } from "./diagrid.js";
import { mcpBuilder } from "./mcp-builder.js";

export function getMasterAgentTools() {
  return {
    run_pop_planner: {
      description: "Generates the complete 11-artifact POP output package (Intent Brief, JTBD, Master Doc, Build Guide, etc.)",
      parameters: z.object({
        projectName: z.string().describe("Name of the project"),
        rawAsk: z.string().describe("Raw ask or prompt"),
        owner: z.string().optional(),
        primaryGoal: z.string().optional(),
      }),
      execute: async (args: { projectName: string; rawAsk: string; owner?: string; primaryGoal?: string }): Promise<PopArtifactPackage> => {
        return generatePopPackage(args);
      },
    },

    inspect_truth_gate: {
      description: "Applies Calibrated Truth Guard: permits creative freedom while strictly checking emails, venues, dates, and contracts.",
      parameters: z.object({
        text: z.string().describe("Text or draft to inspect"),
        isCreativeMode: z.boolean().optional().describe("Set true for creative bios, lyrics, brainstorms"),
      }),
      execute: async (args: { text: string; isCreativeMode?: boolean }) => {
        return truthGuard.inspect(args.text, { isCreativeMode: args.isCreativeMode });
      },
    },

    build_custom_agent: {
      description: "Compiles a complete autonomous agent package (SOUL.md, SKILL.md, agent.json, evals).",
      parameters: z.object({
        name: z.string(),
        role: z.string(),
        industry: z.string(),
        mission: z.string(),
        requiredFoundationFields: z.array(z.string()),
      }),
      execute: async (args: { name: string; role: string; industry: string; mission: string; requiredFoundationFields: string[] }) => {
        return compileUniversalAgent(args);
      },
    },

    execute_compressed_dag: {
      description: "Executes an action graph using Pied Piper Middle-Out DAG wave parallelization.",
      parameters: z.object({
        stepsCount: z.number().describe("Number of mock steps to simulate in DAG"),
      }),
      execute: async (args: { stepsCount: number }) => {
        const nodes: ActionNode[] = Array.from({ length: args.stepsCount }).map((_, i) => ({
          id: `step_${i + 1}`,
          name: `Action Step ${i + 1}`,
          dependencies: i > 0 && i % 2 === 0 ? [`step_${i}`] : [],
          estimatedDurationMs: 50,
          execute: async () => ({ [`step_${i + 1}`]: "completed" }),
        }));
        return actionCompressor.executeCompressedWorkflow(nodes);
      },
    },

    dispatch_durable_workflow: {
      description: "Dispatches a long-running workflow to Diagrid Catalyst / Dapr Durable Execution with zero-compute sleep.",
      parameters: z.object({
        workflowName: z.string(),
        instanceId: z.string(),
        input: z.record(z.unknown()),
      }),
      execute: async (args: { workflowName: string; instanceId: string; input: Record<string, unknown> }) => {
        return diagrid.startWorkflow(args);
      },
    },

    generate_mcp_config: {
      description: "Generates an MCP configuration file for external tool integration.",
      parameters: z.object({}),
      execute: async () => {
        return mcpBuilder.generateMcpConfigJson();
      },
    },
  };
}

export class AgentHarness {
  public tools = getMasterAgentTools();

  public getSystemPrompt(): string {
    return `You are the ROSTR Master Agent, an elite autonomous executive powered by:
1. One Must Act: Never attempt to multiply broken foundations ($W < 1.00$).
2. Pied Piper Middle-Out Action Compression: Parallelize independent DAG steps.
3. Calibrated Truth Guard: Warm and encouraging for creative brainstorming, but ZERO TOLERANCE for hallucinating emails, venue physical addresses, calendar slots, or contracts.
4. POP (Project Output Planner): Always produce the complete 11-artifact package when a user asks to plan, start, or scope a project.
`;
  }
}

export const agentHarness = new AgentHarness();
