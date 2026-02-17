import { describe, expect, it } from "vitest";

import {
  createApplicationSchema,
  updateApplicationStatusSchema,
} from "../application-schema";

describe("createApplicationSchema", () => {
  const validApplicationData = {
    opportunityId: "opp_123456789",
    coverLetter:
      "I am excited to apply for this opportunity and contribute to your team.",
    resumeUrl: "https://utfs.io/f/abc123.pdf",
  };

  describe("success cases", () => {
    it("should validate a complete application with all fields", () => {
      const result = createApplicationSchema.safeParse(validApplicationData);
      expect(result.success).toBe(true);
    });

    it("should accept application without cover letter", () => {
      const data = { ...validApplicationData, coverLetter: undefined };
      const result = createApplicationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept application without resume URL", () => {
      const data = { ...validApplicationData, resumeUrl: undefined };
      const result = createApplicationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept application with only opportunityId", () => {
      const data = { opportunityId: "opp_123" };
      const result = createApplicationSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should trim whitespace from cover letter", () => {
      const data = {
        ...validApplicationData,
        coverLetter:
          "  I am very excited to apply for this great opportunity at your company  ",
      };
      const result = createApplicationSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.coverLetter).toBe(
          "I am very excited to apply for this great opportunity at your company",
        );
      }
    });

    it("should trim whitespace from resumeUrl", () => {
      const data = {
        ...validApplicationData,
        resumeUrl: "  https://utfs.io/f/abc.pdf  ",
      };
      const result = createApplicationSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.resumeUrl).toBe("https://utfs.io/f/abc.pdf");
      }
    });
  });

  describe("validation errors", () => {
    it("should reject empty opportunityId", () => {
      const data = { ...validApplicationData, opportunityId: "" };
      const result = createApplicationSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["opportunityId"]);
      }
    });

    it("should reject missing opportunityId", () => {
      const data = {
        coverLetter: "Great letter",
        resumeUrl: "https://utfs.io/f/abc.pdf",
      };
      const result = createApplicationSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["opportunityId"]);
      }
    });

    it("should reject cover letter shorter than 50 characters", () => {
      const data = { ...validApplicationData, coverLetter: "Too short" };
      const result = createApplicationSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["coverLetter"]);
        expect(result.error.issues[0]?.message).toContain("at least 50");
      }
    });

    it("should reject cover letter longer than 2000 characters", () => {
      const data = { ...validApplicationData, coverLetter: "a".repeat(2001) };
      const result = createApplicationSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["coverLetter"]);
        expect(result.error.issues[0]?.message).toContain("at most 2000");
      }
    });

    it("should reject invalid URL format for resumeUrl", () => {
      const data = { ...validApplicationData, resumeUrl: "not-a-url" };
      const result = createApplicationSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["resumeUrl"]);
        expect(result.error.issues[0]?.message).toContain("Invalid URL");
      }
    });
  });
});

describe("updateApplicationStatusSchema", () => {
  it("should accept status: pending", () => {
    const result = updateApplicationStatusSchema.safeParse({
      id: "app-123",
      status: "pending",
    });
    expect(result.success).toBe(true);
  });

  it("should accept status: reviewing", () => {
    const result = updateApplicationStatusSchema.safeParse({
      id: "app-123",
      status: "reviewing",
    });
    expect(result.success).toBe(true);
  });

  it("should accept status: shortlisted", () => {
    const result = updateApplicationStatusSchema.safeParse({
      id: "app-123",
      status: "shortlisted",
    });
    expect(result.success).toBe(true);
  });

  it("should accept status: accepted", () => {
    const result = updateApplicationStatusSchema.safeParse({
      id: "app-123",
      status: "accepted",
    });
    expect(result.success).toBe(true);
  });

  it("should accept status: rejected", () => {
    const result = updateApplicationStatusSchema.safeParse({
      id: "app-123",
      status: "rejected",
    });
    expect(result.success).toBe(true);
  });

  it("should accept status: withdrawn", () => {
    const result = updateApplicationStatusSchema.safeParse({
      id: "app-123",
      status: "withdrawn",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid status", () => {
    const result = updateApplicationStatusSchema.safeParse({
      id: "app-123",
      status: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("should reject missing status", () => {
    const result = updateApplicationStatusSchema.safeParse({ id: "app-123" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["status"]);
    }
  });

  it("should reject missing id", () => {
    const result = updateApplicationStatusSchema.safeParse({ status: "pending" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["id"]);
    }
  });

  it("should reject empty id", () => {
    const result = updateApplicationStatusSchema.safeParse({
      id: "",
      status: "pending",
    });
    expect(result.success).toBe(false);
  });
});
