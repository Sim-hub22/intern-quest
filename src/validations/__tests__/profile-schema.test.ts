import { describe, expect, it } from "vitest";

import { updateProfileSchema } from "../profile-schema";

describe("updateProfileSchema", () => {
  const validProfileData = {
    name: "John Doe",
    bio: "Passionate software engineer with 3 years of experience in web development.",
    phone: "+977-9841234567",
    location: "Kathmandu, Nepal",
    resumeUrl: "https://utfs.io/f/resume123.pdf",
    linkedinUrl: "https://www.linkedin.com/in/johndoe",
    website: "https://johndoe.dev",
  };

  describe("success cases", () => {
    it("should validate complete profile update with all fields", () => {
      const result = updateProfileSchema.safeParse(validProfileData);
      expect(result.success).toBe(true);
    });

    it("should accept partial update with only name", () => {
      const result = updateProfileSchema.safeParse({ name: "Jane Smith" });
      expect(result.success).toBe(true);
    });

    it("should accept partial update with only bio", () => {
      const result = updateProfileSchema.safeParse({
        bio: "Experienced developer",
      });
      expect(result.success).toBe(true);
    });

    it("should accept empty object (no updates)", () => {
      const result = updateProfileSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("should accept clearing optional fields with undefined", () => {
      const result = updateProfileSchema.safeParse({
        bio: undefined,
        phone: undefined,
        location: undefined,
      });
      expect(result.success).toBe(true);
    });

    it("should trim whitespace from name", () => {
      const result = updateProfileSchema.safeParse({ name: "  John Doe  " });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("John Doe");
      }
    });

    it("should trim whitespace from bio", () => {
      const result = updateProfileSchema.safeParse({
        bio: "  Great developer  ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.bio).toBe("Great developer");
      }
    });

    it("should trim whitespace from URLs", () => {
      const result = updateProfileSchema.safeParse({
        resumeUrl: "  https://example.com/resume.pdf  ",
        linkedinUrl: "  https://linkedin.com/in/user  ",
        website: "  https://example.com  ",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.resumeUrl).toBe("https://example.com/resume.pdf");
        expect(result.data.linkedinUrl).toBe("https://linkedin.com/in/user");
        expect(result.data.website).toBe("https://example.com");
      }
    });

    it("should accept various phone number formats", () => {
      const formats = [
        "+977-9841234567",
        "9841234567",
        "+977 9841234567",
        "(984) 123-4567",
      ];
      formats.forEach((phone) => {
        const result = updateProfileSchema.safeParse({ phone });
        expect(result.success).toBe(true);
      });
    });
  });

  describe("validation errors", () => {
    it("should reject empty name", () => {
      const result = updateProfileSchema.safeParse({ name: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["name"]);
      }
    });

    it("should reject name shorter than 2 characters", () => {
      const result = updateProfileSchema.safeParse({ name: "J" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["name"]);
        expect(result.error.issues[0]?.message).toContain("at least 2");
      }
    });

    it("should reject name longer than 100 characters", () => {
      const result = updateProfileSchema.safeParse({ name: "a".repeat(101) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["name"]);
        expect(result.error.issues[0]?.message).toContain("at most 100");
      }
    });

    it("should reject bio longer than 500 characters", () => {
      const result = updateProfileSchema.safeParse({ bio: "a".repeat(501) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["bio"]);
        expect(result.error.issues[0]?.message).toContain("at most 500");
      }
    });

    it("should reject phone longer than 20 characters", () => {
      const result = updateProfileSchema.safeParse({ phone: "1".repeat(21) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["phone"]);
        expect(result.error.issues[0]?.message).toContain("at most 20");
      }
    });

    it("should reject location longer than 100 characters", () => {
      const result = updateProfileSchema.safeParse({ location: "a".repeat(101) });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["location"]);
        expect(result.error.issues[0]?.message).toContain("at most 100");
      }
    });

    it("should reject invalid resumeUrl format", () => {
      const result = updateProfileSchema.safeParse({ resumeUrl: "not-a-url" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["resumeUrl"]);
        expect(result.error.issues[0]?.message).toContain("Invalid URL");
      }
    });

    it("should reject invalid linkedinUrl format", () => {
      const result = updateProfileSchema.safeParse({
        linkedinUrl: "not-a-url",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["linkedinUrl"]);
        expect(result.error.issues[0]?.message).toContain("Invalid URL");
      }
    });

    it("should reject invalid website format", () => {
      const result = updateProfileSchema.safeParse({ website: "not-a-url" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["website"]);
        expect(result.error.issues[0]?.message).toContain("Invalid URL");
      }
    });
  });
});
