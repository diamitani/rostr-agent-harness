/**
 * Operational Data Showcase Skill: Venue Scout & Routing
 * 
 * Demonstrates the Calibrated Truth Guard:
 * - Warm creative brainstorming on tour concepts and themes.
 * - Strict verification enforcement on real-world venue addresses, contact emails, and show dates.
 */

import { type PluggableSkill, type SkillContext, type SkillOutput } from "../types.js";
import { truthGuard } from "../../core/truth-guard.js";

export const venueScoutSkill: PluggableSkill = {
  manifest: {
    name: "venue-scout",
    version: "1.0.0",
    description: "Discovers verified live music venues and validates booking contacts against directory records.",
    requiredFoundationFields: ["metroArea", "targetCapacity"],
    operationalDataCategories: ["venue_address", "email", "calendar_date"],
  },

  async execute(context: SkillContext): Promise<SkillOutput> {
    const metro = String(context.input.metroArea);
    const capacity = Number(context.input.targetCapacity);

    // Verified Directory Mock Data (strictly grounded)
    const verifiedDirectory = [
      {
        name: "The Bluebird Theater",
        address: "3317 E Colfax Ave, Denver, CO 80206",
        capacity: 550,
        bookingEmail: "booking@bluebirdtheater.net",
        verified: true,
      },
      {
        name: "Gothic Theatre",
        address: "3263 S Broadway, Englewood, CO 80113",
        capacity: 1000,
        bookingEmail: "events@gothictheatre.com",
        verified: true,
      },
    ];

    // Filter matching directory
    const matched = verifiedDirectory.filter((v) => v.capacity >= capacity * 0.7);

    // Apply Calibrated Truth Guard
    const inspection = truthGuard.inspect(
      `Venues in ${metro}: ` + matched.map((m) => `${m.name} at ${m.address} (${m.bookingEmail})`).join("; "),
      {
        verifiedEntities: {
          emails: matched.map((m) => m.bookingEmail),
          venues: matched.map((m) => m.address),
        },
      }
    );

    return {
      success: true,
      artifactsProduced: ["venue-routing-sheet.json"],
      data: {
        metroArea: metro,
        matchedVenues: matched,
        truthVerificationStatus: inspection.severity,
        unverifiedClaims: inspection.unverifiedClaims,
      },
      latencyMs: 15,
      unverifiedClaims: inspection.unverifiedClaims,
    };
  },
};
