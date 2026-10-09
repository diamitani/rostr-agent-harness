/**
 * ROSTR Calibrated Truth & Anti-Fabrication Guard
 * 
 * Solves the critical UX vs. Rigidity trade-off in modern AI agents:
 * 1. Warm Creative Freedom: Never block, scold, or lecture users during creative
 *    brainstorming, artist bios, lyrics, narrative storytelling, or vision ideation.
 * 2. Strict Operational Rigor: Strictly enforce zero-hallucination and require verified
 *    data sources whenever actionable real-world data is involved:
 *    - Recipient email addresses and contact information
 *    - Venue names, physical street addresses, and room capacities
 *    - Calendar dates, show timeslots, and scheduling commitments
 *    - Financial terms, split sheet percentages, and legal agreements
 */

export interface TruthInspectionResult {
  isOperationalData: boolean;
  detectedCategories: Array<"email" | "venue_address" | "calendar_date" | "financial_legal">;
  severity: "clean" | "creative_unrestricted" | "operational_requires_verification";
  unverifiedClaims: string[];
  sanitizedContent: string;
  userFacingNotice?: string;
}

export class CalibratedTruthGuard {
  private emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  private addressPattern = /\b\d{1,5}\s+([A-Za-z0-9#\s.]+)\s+(Street|St|Avenue|Ave|Boulevard|Blvd|Road|Rd|Drive|Dr|Lane|Ln|Way|Plaza|Plz|Court|Ct|Parkway|Pkwy|Highway|Hwy|Circle|Cir|Terrace|Ter)\b/i;
  private venuePattern = /\b(Amphitheater|Amphitheatre|Theater|Theatre|Arena|Stadium|Coliseum|Music Hall|Ballroom|Club|Lounge|Auditorium|Pavilion|Center|Centre)\b/i;
  private calendarSlotPattern = /\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2}(st|nd|rd|th)?(\s+at\s+\d{1,2}(:\d{2})?\s*(AM|PM|am|pm))?/i;
  private financialSplitPattern = /\b\d{1,3}(\.\d{1,2})?%\s+(royalty|split|publishing|master|points|share)\b/i;

  /**
   * Inspect content for operational risk while preserving warm creative UX.
   */
  public inspect(
    content: string,
    context: {
      isCreativeMode?: boolean;
      verifiedEntities?: {
        emails?: string[];
        venues?: string[];
        dates?: string[];
      };
    } = {}
  ): TruthInspectionResult {
    const detectedCategories: Array<"email" | "venue_address" | "calendar_date" | "financial_legal"> = [];
    const unverifiedClaims: string[] = [];

    // 1. Detect emails
    const emails = content.match(this.emailRegex) || [];
    const verifiedEmails = new Set(context.verifiedEntities?.emails || []);
    for (const email of emails) {
      detectedCategories.push("email");
      if (!verifiedEmails.has(email) && !email.endsWith("@example.com") && !email.endsWith("@test.com")) {
        unverifiedClaims.push(`Unverified contact email: ${email}`);
      }
    }

    // 2. Detect physical addresses / venues
    if (this.addressPattern.test(content) || this.venuePattern.test(content)) {
      detectedCategories.push("venue_address");
      if (!context.verifiedEntities?.venues?.length) {
        unverifiedClaims.push("Physical venue address detected without directory source grounding.");
      }
    }

    // 3. Detect calendar commitments
    if (this.calendarSlotPattern.test(content) && (content.toLowerCase().includes("confirmed") || content.toLowerCase().includes("booked") || content.toLowerCase().includes("show date"))) {
      detectedCategories.push("calendar_date");
      if (!context.verifiedEntities?.dates?.length) {
        unverifiedClaims.push("Confirmed calendar booking detected without verified schedule feed.");
      }
    }

    // 4. Detect financial/legal splits
    if (this.financialSplitPattern.test(content)) {
      detectedCategories.push("financial_legal");
      unverifiedClaims.push("Contractual royalty or legal split claims require signed split-sheet agreement.");
    }

    const isOperational = detectedCategories.length > 0;

    // Decision Logic:
    // If it's purely creative or lacks operational commitments, allow with warm freedom
    if (!isOperational || (context.isCreativeMode && unverifiedClaims.length === 0)) {
      return {
        isOperationalData: false,
        detectedCategories,
        severity: "creative_unrestricted",
        unverifiedClaims: [],
        sanitizedContent: content,
      };
    }

    // Operational data with unverified items: provide a clear, supportive notice (never abrasive)
    if (unverifiedClaims.length > 0) {
      return {
        isOperationalData: true,
        detectedCategories,
        severity: "operational_requires_verification",
        unverifiedClaims,
        sanitizedContent: content,
        userFacingNotice: `💡 Notice: Found operational data (${detectedCategories.join(", ")}). To protect real-world bookings and outreach deliverability, ensure addresses, dates, and contact emails are verified via direct search or CRM before dispatch.`,
      };
    }

    return {
      isOperationalData: true,
      detectedCategories,
      severity: "clean",
      unverifiedClaims: [],
      sanitizedContent: content,
    };
  }

  /**
   * Helper to format a friendly operational badge without degrading creative UX.
   */
  public annotateOutput(rawOutput: string, context?: { isCreativeMode?: boolean }): string {
    const inspection = this.inspect(rawOutput, context);
    if (inspection.severity === "operational_requires_verification" && inspection.userFacingNotice) {
      return `${rawOutput}\n\n---\n> **Operational Data Notice:** ${inspection.userFacingNotice}`;
    }
    return rawOutput;
  }
}

export const truthGuard = new CalibratedTruthGuard();
