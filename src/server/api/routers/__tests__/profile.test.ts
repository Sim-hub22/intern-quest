import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { describe, expect, it, beforeEach } from "vitest";

import type { Context } from "../../context";

import { profileRouter } from "../profile";
import { resetTestDatabase } from "@/test/db-utils";
import { db } from "@/server/db";
import { user } from "@/server/db/schema/auth";

// Helper to create mock context
function createMockContext(overrides?: Partial<Context>): Context {
  return {
    session: null,
    ...overrides,
  };
}

// Helper to create unauthenticated context
function createUnauthenticatedContext(): Context {
  return createMockContext();
}

// Helper to create candidate context
function createCandidateContext(userId = "candidate-1"): Context {
  return {
    session: {
      user: {
        id: userId,
        email: `${userId}@example.com`,
        name: "Test Candidate",
        role: "candidate" as const,
        emailVerified: true,
        banned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      session: {
        id: "session-1",
        userId,
        expiresAt: new Date(Date.now() + 86400000),
        token: "token",
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress: "127.0.0.1",
        userAgent: "test",
      },
    },
  };
}

// Helper to create recruiter context
function createRecruiterContext(userId = "recruiter-1"): Context {
  return {
    session: {
      user: {
        id: userId,
        email: `${userId}@example.com`,
        name: "Test Recruiter",
        role: "recruiter" as const,
        emailVerified: true,
        banned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      session: {
        id: "session-1",
        userId,
        expiresAt: new Date(Date.now() + 86400000),
        token: "token",
        createdAt: new Date(),
        updatedAt: new Date(),
        ipAddress: "127.0.0.1",
        userAgent: "test",
      },
    },
  };
}

beforeEach(async () => {
  await resetTestDatabase();
});

describe("profileRouter", () => {
  describe("get", () => {
    describe("Authorization", () => {
      it("should require authentication", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = profileRouter.createCaller(ctx);

        await expect(caller.get()).rejects.toThrow(TRPCError);

        await expect(caller.get()).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should work for candidate role", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.get();

        expect(result).toBeDefined();
        expect(result.id).toBe("candidate-1");
      });

      it("should work for recruiter role", async () => {
        const ctx = createRecruiterContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.get();

        expect(result).toBeDefined();
        expect(result.id).toBe("recruiter-1");
      });
    });

    describe("Business Logic", () => {
      it("should return user profile with all fields", async () => {
        // Update user with profile data
        await db
          .update(user)
          .set({
            bio: "Test bio",
            phone: "+977-9841234567",
            location: "Kathmandu, Nepal",
            resumeUrl: "https://utfs.io/f/resume.pdf",
            linkedinUrl: "https://linkedin.com/in/test",
            website: "https://example.com",
          })
          .where(eq(user.id, "candidate-1"));

        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.get();

        expect(result).toMatchObject({
          id: "candidate-1",
          name: "Test Candidate 1",
          email: "candidate-1@example.com",
          role: "candidate",
          bio: "Test bio",
          phone: "+977-9841234567",
          location: "Kathmandu, Nepal",
          resumeUrl: "https://utfs.io/f/resume.pdf",
          linkedinUrl: "https://linkedin.com/in/test",
          website: "https://example.com",
        });
      });

      it("should return profile with null optional fields", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.get();

        expect(result).toMatchObject({
          id: "candidate-1",
          name: "Test Candidate 1",
          email: "candidate-1@example.com",
          role: "candidate",
          bio: null,
          phone: null,
          location: null,
          resumeUrl: null,
          linkedinUrl: null,
          website: null,
        });
      });

      it("should include timestamps", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.get();

        expect(result.createdAt).toBeInstanceOf(Date);
        expect(result.updatedAt).toBeInstanceOf(Date);
      });

      it("should not include sensitive fields", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.get();

        // Sensitive fields should not be included
        expect(result).not.toHaveProperty("banReason");
        expect(result).not.toHaveProperty("banExpires");
      });
    });
  });

  describe("update", () => {
    describe("Authorization", () => {
      it("should require authentication", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = profileRouter.createCaller(ctx);

        await expect(
          caller.update({
            name: "New Name",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.update({
            name: "New Name",
          })
        ).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should work for candidate role", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.update({
          name: "Updated Name",
        });

        expect(result.name).toBe("Updated Name");
      });

      it("should work for recruiter role", async () => {
        const ctx = createRecruiterContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.update({
          name: "Updated Recruiter",
        });

        expect(result.name).toBe("Updated Recruiter");
      });
    });

    describe("Validation", () => {
      it("should reject empty name", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        await expect(
          caller.update({
            name: "",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.update({
            name: "",
          })
        ).rejects.toMatchObject({
          code: "BAD_REQUEST",
        });
      });

      it("should reject name shorter than 2 characters", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        await expect(
          caller.update({
            name: "J",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.update({
            name: "J",
          })
        ).rejects.toMatchObject({
          code: "BAD_REQUEST",
        });
      });

      it("should reject name longer than 100 characters", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        await expect(
          caller.update({
            name: "a".repeat(101),
          })
        ).rejects.toThrow(TRPCError);
      });

      it("should reject bio longer than 500 characters", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        await expect(
          caller.update({
            bio: "a".repeat(501),
          })
        ).rejects.toThrow(TRPCError);
      });

      it("should reject invalid resumeUrl format", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        await expect(
          caller.update({
            resumeUrl: "not-a-url",
          })
        ).rejects.toThrow(TRPCError);
      });

      it("should reject invalid linkedinUrl format", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        await expect(
          caller.update({
            linkedinUrl: "not-a-url",
          })
        ).rejects.toThrow(TRPCError);
      });

      it("should reject invalid website format", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        await expect(
          caller.update({
            website: "not-a-url",
          })
        ).rejects.toThrow(TRPCError);
      });
    });

    describe("Business Logic", () => {
      it("should update profile with all fields", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        const updateData = {
          name: "Updated Name",
          bio: "Updated bio text",
          phone: "+977-9876543210",
          location: "Pokhara, Nepal",
          resumeUrl: "https://utfs.io/f/new-resume.pdf",
          linkedinUrl: "https://linkedin.com/in/updated",
          website: "https://updated.com",
        };

        const result = await caller.update(updateData);

        expect(result).toMatchObject(updateData);

        // Verify in database
        const [updated] = await db
          .select()
          .from(user)
          .where(eq(user.id, "candidate-1"));

        expect(updated).toMatchObject(updateData);
      });

      it("should update only specified fields (partial update)", async () => {
        // Set initial data
        await db
          .update(user)
          .set({
            name: "Original Name",
            bio: "Original bio",
            phone: "+977-1234567890",
          })
          .where(eq(user.id, "candidate-1"));

        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        // Update only name
        const result = await caller.update({
          name: "New Name",
        });

        expect(result.name).toBe("New Name");
        expect(result.bio).toBe("Original bio");
        expect(result.phone).toBe("+977-1234567890");
      });

      it("should allow empty object (no updates)", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.update({});

        expect(result).toBeDefined();
        expect(result.id).toBe("candidate-1");
      });

      it("should trim whitespace from string fields", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.update({
          name: "  John Doe  ",
          bio: "  Great developer  ",
          location: "  Kathmandu  ",
        });

        expect(result.name).toBe("John Doe");
        expect(result.bio).toBe("Great developer");
        expect(result.location).toBe("Kathmandu");
      });

      it("should update the updatedAt timestamp", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        // Get original timestamp
        const original = await caller.get();
        const originalUpdatedAt = original.updatedAt;

        // Wait a bit
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Update profile
        const result = await caller.update({
          name: "New Name",
        });

        expect(result.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime()
        );
      });

      it("should return complete profile after update", async () => {
        const ctx = createCandidateContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.update({
          bio: "Updated bio",
        });

        // Should return all profile fields, not just updated ones
        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("email");
        expect(result).toHaveProperty("role");
        expect(result).toHaveProperty("bio");
        expect(result).toHaveProperty("phone");
        expect(result).toHaveProperty("location");
        expect(result).toHaveProperty("resumeUrl");
        expect(result).toHaveProperty("linkedinUrl");
        expect(result).toHaveProperty("website");
        expect(result).toHaveProperty("createdAt");
        expect(result).toHaveProperty("updatedAt");
      });

      it("should only update own profile", async () => {
        // This is implicitly tested by using ctx.session.user.id
        // Candidate-1 should only be able to update their own profile
        const ctx = createCandidateContext("candidate-1");
        const caller = profileRouter.createCaller(ctx);

        await caller.update({
          name: "Candidate 1 Updated",
        });

        // Verify candidate-2 was not affected
        const [candidate2] = await db
          .select()
          .from(user)
          .where(eq(user.id, "candidate-2"));

        expect(candidate2?.name).toBe("Test Candidate 2");
      });
    });
  });

  describe("getPublic", () => {
    describe("Authorization", () => {
      it("should allow unauthenticated access", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.getPublic({ userId: "candidate-1" });

        expect(result).toBeDefined();
        expect(result.id).toBe("candidate-1");
      });

      it("should allow authenticated users to view other profiles", async () => {
        const ctx = createCandidateContext("candidate-1");
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.getPublic({ userId: "candidate-2" });

        expect(result).toBeDefined();
        expect(result.id).toBe("candidate-2");
      });
    });

    describe("Validation", () => {
      it("should reject empty userId", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = profileRouter.createCaller(ctx);

        await expect(
          caller.getPublic({ userId: "" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.getPublic({ userId: "" })
        ).rejects.toMatchObject({
          code: "BAD_REQUEST",
        });
      });

      it("should throw NOT_FOUND if user does not exist", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = profileRouter.createCaller(ctx);

        await expect(
          caller.getPublic({ userId: "non-existent-user-id" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.getPublic({ userId: "non-existent-user-id" })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "User not found",
        });
      });
    });

    describe("Business Logic", () => {
      it("should return public profile with limited fields", async () => {
        // Set up user with full profile data
        await db
          .update(user)
          .set({
            name: "Public User",
            bio: "Test bio",
            phone: "+977-9841234567", // Should NOT be returned
            location: "Kathmandu, Nepal",
            resumeUrl: "https://utfs.io/f/resume.pdf",
            linkedinUrl: "https://linkedin.com/in/test",
            website: "https://example.com",
          })
          .where(eq(user.id, "candidate-1"));

        const ctx = createUnauthenticatedContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.getPublic({ userId: "candidate-1" });

        // Should include public fields
        expect(result).toHaveProperty("id");
        expect(result).toHaveProperty("name");
        expect(result).toHaveProperty("image");
        expect(result).toHaveProperty("role");
        expect(result).toHaveProperty("bio");
        expect(result).toHaveProperty("location");
        expect(result).toHaveProperty("linkedinUrl");
        expect(result).toHaveProperty("website");

        // Should NOT include sensitive fields
        expect(result).not.toHaveProperty("email");
        expect(result).not.toHaveProperty("phone");
        expect(result).not.toHaveProperty("resumeUrl");
        expect(result).not.toHaveProperty("banned");
        expect(result).not.toHaveProperty("banReason");
        expect(result).not.toHaveProperty("emailVerified");
      });

      it("should return null for fields that are not set", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.getPublic({ userId: "candidate-1" });

        expect(result.bio).toBeNull();
        expect(result.location).toBeNull();
        expect(result.linkedinUrl).toBeNull();
        expect(result.website).toBeNull();
      });

      it("should work for candidate profiles", async () => {
        await db
          .update(user)
          .set({
            bio: "Candidate bio",
            location: "Kathmandu",
          })
          .where(eq(user.id, "candidate-1"));

        const ctx = createUnauthenticatedContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.getPublic({ userId: "candidate-1" });

        expect(result.role).toBe("candidate");
        expect(result.bio).toBe("Candidate bio");
        expect(result.location).toBe("Kathmandu");
      });

      it("should work for recruiter profiles", async () => {
        await db
          .update(user)
          .set({
            bio: "Recruiter bio",
            location: "Pokhara",
            organization: "Test Org",
          })
          .where(eq(user.id, "recruiter-1"));

        const ctx = createUnauthenticatedContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.getPublic({ userId: "recruiter-1" });

        expect(result.role).toBe("recruiter");
        expect(result.bio).toBe("Recruiter bio");
        expect(result.location).toBe("Pokhara");
        expect(result.organization).toBe("Test Org");
      });

      it("should include organization for recruiters", async () => {
        await db
          .update(user)
          .set({
            organization: "Company XYZ",
          })
          .where(eq(user.id, "recruiter-1"));

        const ctx = createUnauthenticatedContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.getPublic({ userId: "recruiter-1" });

        expect(result.organization).toBe("Company XYZ");
      });

      it("should not reveal banned status", async () => {
        // Ban a user
        await db
          .update(user)
          .set({
            banned: true,
            banReason: "Spam",
          })
          .where(eq(user.id, "candidate-1"));

        const ctx = createUnauthenticatedContext();
        const caller = profileRouter.createCaller(ctx);

        const result = await caller.getPublic({ userId: "candidate-1" });

        expect(result).not.toHaveProperty("banned");
        expect(result).not.toHaveProperty("banReason");
      });
    });
  });
});
