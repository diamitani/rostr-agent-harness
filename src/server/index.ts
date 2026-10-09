/**
 * Native Streaming HTTP Server for ROSTR Agent Harness
 */

import * as http from "http";
import { generatePopPackage } from "../core/pop.js";
import { truthGuard } from "../core/truth-guard.js";
import { actionCompressor } from "../core/compressor.js";
import { diagrid } from "../core/diagrid.js";
import { skillRegistry } from "../skills/registry.js";
import { epkBuilderSkill } from "../skills/epk-builder/index.js";
import { venueScoutSkill } from "../skills/venue-scout/index.js";

skillRegistry.registerSkill(epkBuilderSkill);
skillRegistry.registerSkill(venueScoutSkill);

const PORT = Number(process.env.PORT || 3001);

function parseBody(req: http.IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = req.url || "/";

  // 1. Health check
  if (url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "healthy",
        uptime: process.uptime(),
        diagridCloud: diagrid.isCloudConfigured(),
        skillsCount: skillRegistry.listSkills().length,
      })
    );
    return;
  }

  // 2. List skills
  if (url === "/api/skills" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(skillRegistry.listSkills()));
    return;
  }

  // 3. Direct POP generation endpoint
  if (url === "/api/pop" && req.method === "POST") {
    const body = await parseBody(req);
    const projectName = String(body.projectName || "New Initiative");
    const rawAsk = String(body.rawAsk || "Generate 11-artifact package");
    const owner = body.owner ? String(body.owner) : undefined;
    const primaryGoal = body.primaryGoal ? String(body.primaryGoal) : undefined;

    const pkg = generatePopPackage({ projectName, rawAsk, owner, primaryGoal });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(pkg));
    return;
  }

  // 4. Calibrated Truth Check endpoint
  if (url === "/api/truth-check" && req.method === "POST") {
    const body = await parseBody(req);
    const text = String(body.text || "");
    const isCreativeMode = Boolean(body.isCreativeMode);

    const inspection = truthGuard.inspect(text, { isCreativeMode });
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(inspection));
    return;
  }

  // 404 Fallback
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Endpoint not found" }));
});

server.listen(PORT, () => {
  console.log(`\n🚀 ROSTR Agent Harness Server running on http://localhost:${PORT}`);
  console.log(`   - GET  /health`);
  console.log(`   - GET  /api/skills`);
  console.log(`   - POST /api/pop (Canonical 11-Artifact Package Generator)`);
  console.log(`   - POST /api/truth-check (Calibrated Truth Guard)\n`);
});
