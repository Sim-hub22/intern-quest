import { describe, expect, it } from "vitest";

import {
  createOpportunitySchema,
  updateOpportunitySchema,
  updateOpportunityStatusSchema,
} from "../opportunity-schema";

describe("createOpportunitySchema", () => {
  const validOpportunityData = {
    title: "Software Engineering Internship",
    description: "Join our team to work on exciting projects",
    type: "internship" as const,
    mode: "remote" as const,
    location: "Kathmandu, Nepal",
    category: "engineering",
    skills: ["JavaScript", "React", "Node.js"],
    stipend: 15000,
    duration: "3 months",
    deadline: new Date("2026-12-31"),
    positions: 2,
  };

  describe("success cases", () => {
    it("should validate a complete opportunity with all fields", () => {
      const result = createOpportunitySchema.safeParse(validOpportunityData);
      expect(result.success).toBe(true);
    });

    it("should accept unpaid internship (stipend = null)", () => {
      const data = { ...validOpportunityData, stipend: null };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept opportunity without location (for remote)", () => {
      const data = { ...validOpportunityData, location: undefined };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept type: fellowship", () => {
      const data = { ...validOpportunityData, type: "fellowship" as const };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept type: volunteer", () => {
      const data = { ...validOpportunityData, type: "volunteer" as const };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept mode: onsite", () => {
      const data = { ...validOpportunityData, mode: "onsite" as const };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept mode: hybrid", () => {
      const data = { ...validOpportunityData, mode: "hybrid" as const };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept empty skills array", () => {
      const data = { ...validOpportunityData, skills: [] };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept positions = 1", () => {
      const data = { ...validOpportunityData, positions: 1 };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should trim whitespace from title", () => {
      const data = { ...validOpportunityData, title: "  Software Engineer  " };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Software Engineer");
      }
    });

    it("should trim whitespace from description", () => {
      const data = {
        ...validOpportunityData,
        description: "  Great opportunity  ",
      };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBe("Great opportunity");
      }
    });
  });

  describe("validation errors", () => {
    it("should reject empty title", () => {
      const data = { ...validOpportunityData, title: "" };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["title"]);
      }
    });

    it("should reject title shorter than 5 characters", () => {
      const data = { ...validOpportunityData, title: "SWE" };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["title"]);
        expect(result.error.issues[0]?.message).toContain("at least 5");
      }
    });

    it("should reject title longer than 200 characters", () => {
      const data = { ...validOpportunityData, title: "a".repeat(201) };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["title"]);
        expect(result.error.issues[0]?.message).toContain("at most 200");
      }
    });

    it("should reject empty description", () => {
      const data = { ...validOpportunityData, description: "" };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["description"]);
      }
    });

    it("should reject description shorter than 20 characters", () => {
      const data = { ...validOpportunityData, description: "Too short" };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["description"]);
        expect(result.error.issues[0]?.message).toContain("at least 20");
      }
    });

    it("should reject invalid type", () => {
      const data = { ...validOpportunityData, type: "invalid" };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject invalid mode", () => {
      const data = { ...validOpportunityData, mode: "invalid" };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject empty category", () => {
      const data = { ...validOpportunityData, category: "" };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["category"]);
      }
    });

    it("should reject negative stipend", () => {
      const data = { ...validOpportunityData, stipend: -1000 };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["stipend"]);
        expect(result.error.issues[0]?.message).toContain("greater than 0");
      }
    });

    it("should reject zero stipend (use null for unpaid)", () => {
      const data = { ...validOpportunityData, stipend: 0 };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["stipend"]);
        expect(result.error.issues[0]?.message).toContain("greater than 0");
      }
    });

    it("should reject positions less than 1", () => {
      const data = { ...validOpportunityData, positions: 0 };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["positions"]);
        expect(result.error.issues[0]?.message).toContain("at least 1");
      }
    });

    it("should reject positions greater than 100", () => {
      const data = { ...validOpportunityData, positions: 101 };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["positions"]);
        expect(result.error.issues[0]?.message).toContain("at most 100");
      }
    });

    it("should reject past deadline", () => {
      const pastDate = new Date("2020-01-01");
      const data = { ...validOpportunityData, deadline: pastDate };
      const result = createOpportunitySchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["deadline"]);
        expect(result.error.issues[0]?.message).toContain("future");
      }
    });
  });
});

describe("updateOpportunitySchema", () => {
  it("should validate partial updates", () => {
    const result = updateOpportunitySchema.safeParse({ title: "New Title" });
    expect(result.success).toBe(true);
  });

  it("should validate empty object (no updates)", () => {
    const result = updateOpportunitySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should reject invalid title in partial update", () => {
    const result = updateOpportunitySchema.safeParse({ title: "abc" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["title"]);
      expect(result.error.issues[0]?.message).toContain("at least 5");
    }
  });

  it("should reject past deadline in partial update", () => {
    const pastDate = new Date("2020-01-01");
    const result = updateOpportunitySchema.safeParse({ deadline: pastDate });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["deadline"]);
      expect(result.error.issues[0]?.message).toContain("future");
    }
  });
});

describe("updateOpportunityStatusSchema", () => {
  it("should accept status: draft", () => {
    const result = updateOpportunityStatusSchema.safeParse({ status: "draft" });
    expect(result.success).toBe(true);
  });

  it("should accept status: published", () => {
    const result = updateOpportunityStatusSchema.safeParse({
      status: "published",
    });
    expect(result.success).toBe(true);
  });

  it("should accept status: closed", () => {
    const result = updateOpportunityStatusSchema.safeParse({ status: "closed" });
    expect(result.success).toBe(true);
  });

  it("should accept status: archived", () => {
    const result = updateOpportunityStatusSchema.safeParse({
      status: "archived",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid status", () => {
    const result = updateOpportunityStatusSchema.safeParse({ status: "invalid" });
    expect(result.success).toBe(false);
  });

  it("should reject missing status", () => {
    const result = updateOpportunityStatusSchema.safeParse({});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["status"]);
    }
  });
});
