/**
 * Pluggable Skill Registry
 * 
 * Manages loading, discovery, and execution of autonomous skills.
 */

import { type PluggableSkill, type SkillContext, type SkillOutput } from "./types.js";

export class SkillRegistry {
  private skills: Map<string, PluggableSkill> = new Map();

  public registerSkill(skill: PluggableSkill): void {
    this.skills.set(skill.manifest.name, skill);
  }

  public getSkill(name: string): PluggableSkill | undefined {
    return this.skills.get(name);
  }

  public listSkills(): Array<PluggableSkill["manifest"]> {
    return Array.from(this.skills.values()).map((s) => s.manifest);
  }

  public async executeSkill(name: string, context: SkillContext): Promise<SkillOutput> {
    const skill = this.getSkill(name);
    if (!skill) {
      throw new Error(`Skill "${name}" is not registered in the harness.`);
    }

    // Check One Must Act foundation wholeness
    const missingFields = skill.manifest.requiredFoundationFields.filter(
      (field) => !(field in context.input) || context.input[field] === undefined
    );

    if (missingFields.length > 0) {
      return {
        success: false,
        artifactsProduced: [],
        data: { error: "Foundation Incomplete (W < 1.00)", missingFields },
        latencyMs: 0,
      };
    }

    const start = Date.now();
    const result = await skill.execute(context);
    result.latencyMs = Date.now() - start;
    return result;
  }
}

export const skillRegistry = new SkillRegistry();
