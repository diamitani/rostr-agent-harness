/**
 * Flagship Skill: Durable Compressed EPK Builder
 */

import { type PluggableSkill, type SkillContext, type SkillOutput } from "../types.js";
import { actionCompressor, type ActionNode } from "../../core/compressor.js";
import { diagrid } from "../../core/diagrid.js";

export const epkBuilderSkill: PluggableSkill = {
  manifest: {
    name: "epk-builder",
    version: "1.0.0",
    description: "Builds a high-impact Electronic Press Kit (EPK) using DAG wave parallelization and durable execution.",
    requiredFoundationFields: ["artistName", "genre", "bioPrompt"],
    requiresDurableExecution: true,
  },

  async execute(context: SkillContext): Promise<SkillOutput> {
    const artist = String(context.input.artistName);
    const genre = String(context.input.genre);
    const bio = String(context.input.bioPrompt);

    // Build DAG Action Nodes
    const nodes: ActionNode[] = [
      {
        id: "ingest_assets",
        name: "Ingest Bio & Brand Colors",
        dependencies: [],
        estimatedDurationMs: 50,
        execute: async () => ({
          theme: { primary: "#6366f1", accent: "#ec4899" },
          formattedBio: bio.trim(),
        }),
      },
      {
        id: "generate_streaming_embeds",
        name: "Generate Streaming Player Markup",
        dependencies: ["ingest_assets"],
        estimatedDurationMs: 40,
        execute: async () => ({
          streamingMarkup: `<div class="streaming-embed">▶ Spotify & Apple Music Showcase for ${artist}</div>`,
        }),
      },
      {
        id: "compile_press_quotes",
        name: "Format Press & Accolades",
        dependencies: ["ingest_assets"],
        estimatedDurationMs: 30,
        execute: async () => ({
          pressQuotes: [`"A groundbreaking force in ${genre}." — Apex Sound Magazine`],
        }),
      },
      {
        id: "assemble_epk_html",
        name: "Assemble Production EPK",
        dependencies: ["generate_streaming_embeds", "compile_press_quotes"],
        estimatedDurationMs: 60,
        execute: async (ctx) => {
          const html = `<!DOCTYPE html>
<html>
<head><title>${artist} - EPK</title></head>
<body style="font-family: sans-serif; background: #0f172a; color: #fff; padding: 2rem;">
  <h1>${artist} (${genre})</h1>
  <p>${ctx.formattedBio}</p>
  ${ctx.streamingMarkup}
  <blockquote>${(ctx.pressQuotes as string[])[0]}</blockquote>
</body>
</html>`;
          return { epkHtml: html };
        },
      },
    ];

    const result = await actionCompressor.executeCompressedWorkflow(nodes, { artist, genre });

    // Optional Diagrid Durable Dispatch for publishing approval
    await diagrid.startWorkflow({
      workflowName: "EpkPublishApproval",
      instanceId: `epk-publish-${Date.now()}`,
      input: { artist, generatedAt: new Date().toISOString() },
    });

    return {
      success: true,
      artifactsProduced: ["epk.html"],
      data: {
        epkHtml: result.context.epkHtml,
        completedWaves: result.completedSteps,
      },
      latencyMs: result.totalDurationMs,
    };
  },
};
