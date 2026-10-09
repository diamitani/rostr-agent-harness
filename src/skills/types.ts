/**
 * Pluggable Skill Package Interface
 */

export interface SkillManifest {
  name: string;
  version: string;
  description: string;
  author?: string;
  requiredFoundationFields: string[];
  operationalDataCategories?: Array<"email" | "venue_address" | "calendar_date" | "financial_legal">;
  requiresDurableExecution?: boolean;
}

export interface SkillContext {
  input: Record<string, unknown>;
  foundationWholeness: number;
  environment: Record<string, string | undefined>;
}

export interface SkillOutput {
  success: boolean;
  artifactsProduced: string[];
  data: Record<string, unknown>;
  latencyMs: number;
  unverifiedClaims?: string[];
}

export interface PluggableSkill {
  manifest: SkillManifest;
  execute: (context: SkillContext) => Promise<SkillOutput>;
}
