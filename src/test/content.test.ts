import { describe, it, expect } from "vitest";
import { SiteContentSchema } from "@/types/content";
import rawContent from "@/content/content.json";
import { HybridContentSource } from "@/context/ContentContext";

describe("Content & Schema Validation", () => {
  it("bundled content.json should conform to SiteContentSchema", () => {
    const result = SiteContentSchema.safeParse(rawContent);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.profile.name).toBe("Divij P");
      expect(result.data.sections.length).toBeGreaterThan(0);
      expect(result.data.theme.defaultMode).toBe("dark");
    }
  });

  it("HybridContentSource should successfully load fallback content", async () => {
    const source = new HybridContentSource();
    const result = await source.getContent();
    expect(result.data).toBeDefined();
    expect(result.data.profile.name).toBe("Divij P");
  });
});
