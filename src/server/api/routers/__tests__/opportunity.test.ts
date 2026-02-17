import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { describe, expect, it, beforeEach } from "vitest";

import type { Context } from "../../context";

import { opportunityRouter } from "../opportunity";
import { resetTestDatabase } from "@/test/db-utils";
import { db } from "@/server/db";
import { opportunity as opportunityTable } from "@/server/db/schema/opportunity";

// Helper to create mock context
function createMockContext(overrides?: Partial<Context>): Context {
  return {
    session: null,
    ...overrides,
  };
}

// Helper to create unauthenticated context (alias for createMockContext)
function createUnauthenticatedContext(): Context {
  return createMockContext();
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

// Valid opportunity data for testing
const validOpportunityInput = {
  title: "Software Engineering Internship",
  description: "Join our team to work on exciting projects and learn from experienced developers",
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

describe("opportunityRouter", () => {
  beforeEach(async () => {
    // Reset test database before each test
    await resetTestDatabase();
  });

  describe("create", () => {
    describe("authorization", () => {
      it("should throw UNAUTHORIZED if user is not authenticated", async () => {
        const ctx = createMockContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.create(validOpportunityInput)
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.create(validOpportunityInput)
        ).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should throw FORBIDDEN if user is not a recruiter", async () => {
        const ctx = createCandidateContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.create(validOpportunityInput)
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.create(validOpportunityInput)
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
          message: "Recruiter access required",
        });
      });
    });

    describe("validation", () => {
      it("should reject invalid title (too short)", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        const invalidInput = { ...validOpportunityInput, title: "Job" };

        await expect(caller.create(invalidInput)).rejects.toThrow();
      });

      it("should reject invalid description (too short)", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        const invalidInput = { ...validOpportunityInput, description: "Short" };

        await expect(caller.create(invalidInput)).rejects.toThrow();
      });

      it("should reject invalid deadline (past date)", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        const invalidInput = {
          ...validOpportunityInput,
          deadline: new Date("2020-01-01"),
        };

        await expect(caller.create(invalidInput)).rejects.toThrow();
      });

      it("should reject invalid positions (< 1)", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        const invalidInput = { ...validOpportunityInput, positions: 0 };

        await expect(caller.create(invalidInput)).rejects.toThrow();
      });

      it("should reject invalid positions (> 100)", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        const invalidInput = { ...validOpportunityInput, positions: 101 };

        await expect(caller.create(invalidInput)).rejects.toThrow();
      });

      it("should reject invalid stipend (negative)", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        const invalidInput = { ...validOpportunityInput, stipend: -1000 };

        await expect(caller.create(invalidInput)).rejects.toThrow();
      });

      it("should reject invalid stipend (zero)", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        const invalidInput = { ...validOpportunityInput, stipend: 0 };

        await expect(caller.create(invalidInput)).rejects.toThrow();
      });
    });

    describe("success cases", () => {
      it("should create opportunity with all fields", async () => {
        const ctx = createRecruiterContext("recruiter-123");
        const caller = opportunityRouter.createCaller(ctx);

        const result = await caller.create(validOpportunityInput);

        expect(result).toMatchObject({
          title: validOpportunityInput.title,
          description: validOpportunityInput.description,
          type: validOpportunityInput.type,
          mode: validOpportunityInput.mode,
          category: validOpportunityInput.category,
          location: validOpportunityInput.location,
          stipend: validOpportunityInput.stipend,
          duration: validOpportunityInput.duration,
          positions: validOpportunityInput.positions,
          recruiterId: "recruiter-123",
          status: "draft",
        });
        expect(result.id).toBeTruthy();
        expect(result.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(result.updatedAt).toBeInstanceOf(Date);
      });

      it("should create unpaid opportunity (stipend = null)", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        const unpaidInput = { ...validOpportunityInput, stipend: null };

        const result = await caller.create(unpaidInput);

        expect(result.stipend).toBeNull();
        expect(result.status).toBe("draft");
      });

      it("should create opportunity without location", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        const { location, ...inputWithoutLocation } = validOpportunityInput;

        const result = await caller.create(inputWithoutLocation);

        expect(result.location).toBeNull();
      });

      it("should auto-assign recruiterId from session", async () => {
        const ctx = createRecruiterContext("my-recruiter-id");
        const caller = opportunityRouter.createCaller(ctx);

        const result = await caller.create(validOpportunityInput);

        expect(result.recruiterId).toBe("my-recruiter-id");
      });

      it("should default status to 'draft'", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        const result = await caller.create(validOpportunityInput);

        expect(result.status).toBe("draft");
      });

      it("should generate unique ID for opportunity", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        const result = await caller.create(validOpportunityInput);

        expect(result.id).toBeTruthy();
        expect(result.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
      });
    });

    describe("edge cases", () => {
      it("should validate schema before database insert", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        // Invalid input should fail validation before reaching DB
        const invalidInput = { ...validOpportunityInput, title: "" };

        await expect(caller.create(invalidInput)).rejects.toThrow();
      });
    });
  });

  describe("update", () => {
    describe("authorization", () => {
      it("should throw UNAUTHORIZED if user is not authenticated", async () => {
        const ctx = createMockContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.update({ id: "00000000-0000-0000-0000-000000000123", title: "Updated Title" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.update({ id: "00000000-0000-0000-0000-000000000123", title: "Updated Title" })
        ).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should throw FORBIDDEN if user is not a recruiter", async () => {
        const ctx = createCandidateContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.update({ id: "00000000-0000-0000-0000-000000000123", title: "Updated Title" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.update({ id: "00000000-0000-0000-0000-000000000123", title: "Updated Title" })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
          message: "Recruiter access required",
        });
      });

      it("should throw FORBIDDEN if trying to update another recruiter's opportunity", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        // Create opportunity as recruiter-123
        const ctx2 = createRecruiterContext("recruiter-123");
        const caller2 = opportunityRouter.createCaller(ctx2);
        const opportunity = await caller2.create(validOpportunityInput);

        // Try to update as recruiter-1
        await expect(
          caller.update({ id: opportunity.id, title: "Hacked Title" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.update({ id: opportunity.id, title: "Hacked Title" })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
          message: "You can only update your own opportunities",
        });
      });
    });

    describe("validation", () => {
      it("should reject invalid id format", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.update({ id: "", title: "Updated" })
        ).rejects.toThrow();
      });

      it("should reject invalid title (too short)", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opportunity = await caller.create(validOpportunityInput);

        await expect(
          caller.update({ id: opportunity.id, title: "Job" })
        ).rejects.toThrow();
      });

      it("should reject invalid description (too short)", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opportunity = await caller.create(validOpportunityInput);

        await expect(
          caller.update({ id: opportunity.id, description: "Short" })
        ).rejects.toThrow();
      });

      it("should reject invalid deadline (past date)", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opportunity = await caller.create(validOpportunityInput);

        await expect(
          caller.update({
            id: opportunity.id,
            deadline: new Date("2020-01-01"),
          })
        ).rejects.toThrow();
      });
    });

    describe("success cases", () => {
      it("should update opportunity title", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opportunity = await caller.create(validOpportunityInput);

        const result = await caller.update({
          id: opportunity.id,
          title: "Updated Software Engineering Internship",
        });

        expect(result.title).toBe("Updated Software Engineering Internship");
        expect(result.id).toBe(opportunity.id);
        expect(result.description).toBe(validOpportunityInput.description);
      });

      it("should update multiple fields at once", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opportunity = await caller.create(validOpportunityInput);

        const result = await caller.update({
          id: opportunity.id,
          title: "New Title",
          description: "This is a new description that is at least 20 characters long",
          stipend: 20000,
          positions: 5,
        });

        expect(result.title).toBe("New Title");
        expect(result.description).toBe("This is a new description that is at least 20 characters long");
        expect(result.stipend).toBe(20000);
        expect(result.positions).toBe(5);
      });

      it("should update updatedAt timestamp", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opportunity = await caller.create(validOpportunityInput);
        const originalUpdatedAt = opportunity.updatedAt;

        // Wait a bit to ensure timestamp difference
        await new Promise((resolve) => setTimeout(resolve, 100));

        const result = await caller.update({
          id: opportunity.id,
          title: "Updated Title",
        });

        expect(result.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime()
        );
      });

      it("should not update fields that are not provided", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opportunity = await caller.create(validOpportunityInput);

        const result = await caller.update({
          id: opportunity.id,
          title: "Updated Title Only",
        });

        expect(result.title).toBe("Updated Title Only");
        expect(result.description).toBe(validOpportunityInput.description);
        expect(result.stipend).toBe(validOpportunityInput.stipend);
        expect(result.positions).toBe(validOpportunityInput.positions);
      });

      it("should allow changing stipend to null (unpaid)", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opportunity = await caller.create(validOpportunityInput);

        const result = await caller.update({
          id: opportunity.id,
          stipend: null,
        });

        expect(result.stipend).toBeNull();
      });
    });

    describe("edge cases", () => {
      it("should throw NOT_FOUND if opportunity does not exist", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.update({ id: "00000000-0000-0000-0000-000000000000", title: "Updated" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.update({ id: "00000000-0000-0000-0000-000000000000", title: "Updated" })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      });

      it("should validate partial update data", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opportunity = await caller.create(validOpportunityInput);

        // Should reject invalid stipend even in partial update
        await expect(
          caller.update({ id: opportunity.id, stipend: -5000 })
        ).rejects.toThrow();
      });
    });
  });

  describe("delete", () => {
    describe("authorization", () => {
      it("should throw UNAUTHORIZED if user is not authenticated", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.delete({ id: "00000000-0000-0000-0000-000000000123" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.delete({ id: "00000000-0000-0000-0000-000000000123" })
        ).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should throw FORBIDDEN if user is not a recruiter", async () => {
        const ctx = createCandidateContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.delete({ id: "00000000-0000-0000-0000-000000000123" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.delete({ id: "00000000-0000-0000-0000-000000000123" })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
        });
      });

      it("should throw FORBIDDEN if trying to delete another recruiter's opportunity", async () => {
        const ctx1 = createRecruiterContext("recruiter-1");
        const ctx2 = createRecruiterContext("recruiter-123");
        const caller1 = opportunityRouter.createCaller(ctx1);
        const caller2 = opportunityRouter.createCaller(ctx2);

        const opportunity = await caller1.create(validOpportunityInput);

        await expect(
          caller2.delete({ id: opportunity.id })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller2.delete({ id: opportunity.id })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
          message: "You can only delete your own opportunities",
        });
      });
    });

    describe("validation", () => {
      it("should reject invalid id format", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        await expect(caller.delete({ id: "" })).rejects.toThrow();
      });
    });

    describe("success cases", () => {
      it("should soft delete opportunity (set status to archived)", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opportunity = await caller.create(validOpportunityInput);
        expect(opportunity.status).toBe("draft");

        const result = await caller.delete({ id: opportunity.id });

        expect(result.id).toBe(opportunity.id);
        expect(result.status).toBe("archived");
        expect(result.title).toBe(opportunity.title);
      });

      it("should allow deleting published opportunity", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const createdOpportunity = await caller.create({
          ...validOpportunityInput,
        });

        // Update status to published first (will implement updateStatus later)
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, createdOpportunity.id));

        const result = await caller.delete({ id: createdOpportunity.id });

        expect(result.status).toBe("archived");
      });

      it("should allow deleting closed opportunity", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const createdOpportunity = await caller.create(validOpportunityInput);

        // Update status to closed first
        await db
          .update(opportunityTable)
          .set({ status: "closed" })
          .where(eq(opportunityTable.id, createdOpportunity.id));

        const result = await caller.delete({ id: createdOpportunity.id });

        expect(result.status).toBe("archived");
      });

      it("should be idempotent (allow archiving already archived opportunity)", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opportunity = await caller.create(validOpportunityInput);

        // Delete once
        await caller.delete({ id: opportunity.id });

        // Delete again - should succeed
        const result = await caller.delete({ id: opportunity.id });

        expect(result.status).toBe("archived");
      });

      it("should update updatedAt timestamp on delete", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opportunity = await caller.create(validOpportunityInput);
        const originalUpdatedAt = opportunity.updatedAt;

        // Wait to ensure timestamp difference
        await new Promise((resolve) => setTimeout(resolve, 100));

        const result = await caller.delete({ id: opportunity.id });

        expect(result.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime()
        );
      });
    });

    describe("edge cases", () => {
      it("should throw NOT_FOUND if opportunity does not exist", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.delete({ id: "00000000-0000-0000-0000-000000000000" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.delete({ id: "00000000-0000-0000-0000-000000000000" })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      });
    });
  });

  describe("getById", () => {
    describe("validation", () => {
      it("should reject invalid id format", async () => {
        const ctx = createMockContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(caller.getById({ id: "" })).rejects.toThrow();
      });
    });

    describe("authorization - published opportunities", () => {
      it("should allow unauthenticated users to view published opportunities", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const createdOpportunity = await recruiterCaller.create(
          validOpportunityInput
        );

        // Publish the opportunity
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, createdOpportunity.id));

        // Unauthenticated user should be able to view
        const unauthCtx = createUnauthenticatedContext();
        const unauthCaller = opportunityRouter.createCaller(unauthCtx);

        const result = await unauthCaller.getById({
          id: createdOpportunity.id,
        });

        expect(result.id).toBe(createdOpportunity.id);
        expect(result.status).toBe("published");
        expect(result.title).toBe(validOpportunityInput.title);
      });

      it("should allow candidates to view published opportunities", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const createdOpportunity = await recruiterCaller.create(
          validOpportunityInput
        );

        // Publish the opportunity
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, createdOpportunity.id));

        // Candidate should be able to view
        const candidateCtx = createCandidateContext();
        const candidateCaller = opportunityRouter.createCaller(candidateCtx);

        const result = await candidateCaller.getById({
          id: createdOpportunity.id,
        });

        expect(result.id).toBe(createdOpportunity.id);
        expect(result.status).toBe("published");
      });

      it("should allow other recruiters to view published opportunities", async () => {
        const recruiter1Ctx = createRecruiterContext("recruiter-1");
        const recruiter1Caller = opportunityRouter.createCaller(recruiter1Ctx);

        const createdOpportunity = await recruiter1Caller.create(
          validOpportunityInput
        );

        // Publish the opportunity
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, createdOpportunity.id));

        // Different recruiter should be able to view
        const recruiter2Ctx = createRecruiterContext("recruiter-123");
        const recruiter2Caller = opportunityRouter.createCaller(recruiter2Ctx);

        const result = await recruiter2Caller.getById({
          id: createdOpportunity.id,
        });

        expect(result.id).toBe(createdOpportunity.id);
        expect(result.status).toBe("published");
      });
    });

    describe("authorization - draft opportunities", () => {
      it("should allow owner to view their own draft opportunity", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const createdOpportunity = await caller.create(validOpportunityInput);

        const result = await caller.getById({ id: createdOpportunity.id });

        expect(result.id).toBe(createdOpportunity.id);
        expect(result.status).toBe("draft");
        expect(result.title).toBe(validOpportunityInput.title);
      });

      it("should throw NOT_FOUND when unauthenticated user tries to view draft", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const createdOpportunity = await recruiterCaller.create(
          validOpportunityInput
        );

        const unauthCtx = createUnauthenticatedContext();
        const unauthCaller = opportunityRouter.createCaller(unauthCtx);

        await expect(
          unauthCaller.getById({ id: createdOpportunity.id })
        ).rejects.toThrow(TRPCError);

        await expect(
          unauthCaller.getById({ id: createdOpportunity.id })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      });

      it("should throw NOT_FOUND when candidate tries to view draft", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const createdOpportunity = await recruiterCaller.create(
          validOpportunityInput
        );

        const candidateCtx = createCandidateContext();
        const candidateCaller = opportunityRouter.createCaller(candidateCtx);

        await expect(
          candidateCaller.getById({ id: createdOpportunity.id })
        ).rejects.toThrow(TRPCError);

        await expect(
          candidateCaller.getById({ id: createdOpportunity.id })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      });

      it("should throw NOT_FOUND when other recruiter tries to view draft", async () => {
        const recruiter1Ctx = createRecruiterContext("recruiter-1");
        const recruiter1Caller = opportunityRouter.createCaller(recruiter1Ctx);

        const createdOpportunity = await recruiter1Caller.create(
          validOpportunityInput
        );

        const recruiter2Ctx = createRecruiterContext("recruiter-123");
        const recruiter2Caller = opportunityRouter.createCaller(recruiter2Ctx);

        await expect(
          recruiter2Caller.getById({ id: createdOpportunity.id })
        ).rejects.toThrow(TRPCError);

        await expect(
          recruiter2Caller.getById({ id: createdOpportunity.id })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      });
    });

    describe("authorization - closed opportunities", () => {
      it("should allow anyone to view closed opportunities", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const createdOpportunity = await recruiterCaller.create(
          validOpportunityInput
        );

        // Close the opportunity
        await db
          .update(opportunityTable)
          .set({ status: "closed" })
          .where(eq(opportunityTable.id, createdOpportunity.id));

        // Unauthenticated user should be able to view
        const unauthCtx = createUnauthenticatedContext();
        const unauthCaller = opportunityRouter.createCaller(unauthCtx);

        const result = await unauthCaller.getById({
          id: createdOpportunity.id,
        });

        expect(result.id).toBe(createdOpportunity.id);
        expect(result.status).toBe("closed");
      });
    });

    describe("authorization - archived opportunities", () => {
      it("should allow owner to view their own archived opportunity", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const createdOpportunity = await caller.create(validOpportunityInput);

        // Archive the opportunity
        await caller.delete({ id: createdOpportunity.id });

        const result = await caller.getById({ id: createdOpportunity.id });

        expect(result.id).toBe(createdOpportunity.id);
        expect(result.status).toBe("archived");
      });

      it("should throw NOT_FOUND when others try to view archived opportunity", async () => {
        const recruiter1Ctx = createRecruiterContext("recruiter-1");
        const recruiter1Caller = opportunityRouter.createCaller(recruiter1Ctx);

        const createdOpportunity = await recruiter1Caller.create(
          validOpportunityInput
        );

        // Archive the opportunity
        await recruiter1Caller.delete({ id: createdOpportunity.id });

        // Different recruiter tries to view
        const recruiter2Ctx = createRecruiterContext("recruiter-123");
        const recruiter2Caller = opportunityRouter.createCaller(recruiter2Ctx);

        await expect(
          recruiter2Caller.getById({ id: createdOpportunity.id })
        ).rejects.toThrow(TRPCError);

        await expect(
          recruiter2Caller.getById({ id: createdOpportunity.id })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      });
    });

    describe("success cases", () => {
      it("should return all opportunity fields", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const createdOpportunity = await caller.create(validOpportunityInput);

        const result = await caller.getById({ id: createdOpportunity.id });

        expect(result.id).toBe(createdOpportunity.id);
        expect(result.title).toBe(validOpportunityInput.title);
        expect(result.description).toBe(validOpportunityInput.description);
        expect(result.type).toBe(validOpportunityInput.type);
        expect(result.mode).toBe(validOpportunityInput.mode);
        expect(result.location).toBe(validOpportunityInput.location);
        expect(result.category).toBe(validOpportunityInput.category);
        expect(result.skills).toEqual(validOpportunityInput.skills);
        expect(result.stipend).toBe(validOpportunityInput.stipend);
        expect(result.duration).toBe(validOpportunityInput.duration);
        expect(result.positions).toBe(validOpportunityInput.positions);
        expect(result.recruiterId).toBe("recruiter-1");
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(result.updatedAt).toBeInstanceOf(Date);
      });
    });

    describe("edge cases", () => {
      it("should throw NOT_FOUND if opportunity does not exist", async () => {
        const ctx = createMockContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.getById({ id: "00000000-0000-0000-0000-000000000000" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.getById({ id: "00000000-0000-0000-0000-000000000000" })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      });
    });
  });

  describe("list", () => {
    describe("authorization", () => {
      it("should allow unauthenticated users to list opportunities", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = opportunityRouter.createCaller(ctx);

        const result = await caller.list({});

        expect(Array.isArray(result.opportunities)).toBe(true);
      });

      it("should allow candidates to list opportunities", async () => {
        const ctx = createCandidateContext();
        const caller = opportunityRouter.createCaller(ctx);

        const result = await caller.list({});

        expect(Array.isArray(result.opportunities)).toBe(true);
      });

      it("should allow recruiters to list opportunities", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        const result = await caller.list({});

        expect(Array.isArray(result.opportunities)).toBe(true);
      });
    });

    describe("filtering by status", () => {
      it("should only return published opportunities by default", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create opportunities with different statuses
        const draftOpp = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Draft Opportunity",
        });

        const publishedOpp = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Published Opportunity",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, publishedOpp.id));

        const closedOpp = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Closed Opportunity",
        });
        await db
          .update(opportunityTable)
          .set({ status: "closed" })
          .where(eq(opportunityTable.id, closedOpp.id));

        const archivedOpp = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Archived Opportunity",
        });
        await recruiterCaller.delete({ id: archivedOpp.id });

        // List as public user
        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({});

        // Should only contain published and closed (not draft or archived)
        expect(result.opportunities.length).toBeGreaterThanOrEqual(2);
        const titles = result.opportunities.map((o) => o.title);
        expect(titles).toContain("Published Opportunity");
        expect(titles).toContain("Closed Opportunity");
        expect(titles).not.toContain("Draft Opportunity");
        expect(titles).not.toContain("Archived Opportunity");
      });

      it("should include closed opportunities in results", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Closed Test Opportunity",
        });
        await db
          .update(opportunityTable)
          .set({ status: "closed" })
          .where(eq(opportunityTable.id, opp.id));

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({});

        const titles = result.opportunities.map((o) => o.title);
        expect(titles).toContain("Closed Test Opportunity");
      });
    });

    describe("search functionality", () => {
      it("should filter by search query in title", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create opportunities with different titles
        const opp1 = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Frontend Developer Internship",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp1.id));

        const opp2 = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Backend Engineer Position",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp2.id));

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({ search: "Frontend" });

        expect(result.opportunities.some((o) => o.title.includes("Frontend"))).toBe(true);
        expect(result.opportunities.every((o) => 
          o.title.toLowerCase().includes("frontend") || 
          o.description.toLowerCase().includes("frontend")
        )).toBe(true);
      });

      it("should filter by search query in description", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Developer Position",
          description: "Looking for a React specialist with 2+ years of experience",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({ search: "React" });

        expect(result.opportunities.some((o) => o.description.includes("React"))).toBe(true);
      });

      it("should be case-insensitive for search", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Python Developer",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({ search: "python" });

        expect(result.opportunities.some((o) => o.title === "Python Developer")).toBe(true);
      });
    });

    describe("category filtering", () => {
      it("should filter by category", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create opportunities with different categories
        const techOpp = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Tech Internship",
          category: "technology",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, techOpp.id));

        const marketingOpp = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Marketing Internship",
          category: "marketing",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, marketingOpp.id));

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({ category: "technology" });

        expect(result.opportunities.every((o) => o.category === "technology")).toBe(true);
        expect(result.opportunities.some((o) => o.title === "Tech Internship")).toBe(true);
      });
    });

    describe("type filtering", () => {
      it("should filter by type", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create opportunities with different types
        const internship = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Summer Internship",
          type: "internship",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, internship.id));

        const job = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Fellowship Program",
          type: "fellowship",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, job.id));

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({ type: "internship" });

        expect(result.opportunities.every((o) => o.type === "internship")).toBe(true);
      });
    });

    describe("mode filtering", () => {
      it("should filter by mode", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create opportunities with different modes
        const remote = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Remote Position",
          mode: "remote",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, remote.id));

        const onsite = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "On-site Position",
          mode: "onsite",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, onsite.id));

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({ mode: "remote" });

        expect(result.opportunities.every((o) => o.mode === "remote")).toBe(true);
      });
    });

    describe("pagination", () => {
      it("should limit results with limit parameter", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create multiple opportunities
        for (let i = 1; i <= 5; i++) {
          const opp = await recruiterCaller.create({
            ...validOpportunityInput,
            title: `Opportunity ${i}`,
          });
          await db
            .update(opportunityTable)
            .set({ status: "published" })
            .where(eq(opportunityTable.id, opp.id));
        }

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({ limit: 3 });

        expect(result.opportunities.length).toBeLessThanOrEqual(3);
      });

      it("should skip results with offset parameter", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create opportunities
        const opps = [];
        for (let i = 1; i <= 5; i++) {
          const opp = await recruiterCaller.create({
            ...validOpportunityInput,
            title: `Test Opp ${i}`,
          });
          await db
            .update(opportunityTable)
            .set({ status: "published" })
            .where(eq(opportunityTable.id, opp.id));
          opps.push(opp);
        }

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const page1 = await publicCaller.list({ limit: 2, offset: 0 });
        const page2 = await publicCaller.list({ limit: 2, offset: 2 });

        // Pages should have different opportunities
        const page1Ids = page1.opportunities.map((o) => o.id);
        const page2Ids = page2.opportunities.map((o) => o.id);

        expect(page1Ids.some((id) => page2Ids.includes(id))).toBe(false);
      });

      it("should return total count for pagination", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create known number of opportunities
        for (let i = 1; i <= 3; i++) {
          const opp = await recruiterCaller.create({
            ...validOpportunityInput,
            title: `Count Test ${i}`,
          });
          await db
            .update(opportunityTable)
            .set({ status: "published" })
            .where(eq(opportunityTable.id, opp.id));
        }

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({});

        expect(result.total).toBeGreaterThanOrEqual(3);
        expect(typeof result.total).toBe("number");
      });

      it("should default to limit 10 if not specified", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create 12 opportunities
        for (let i = 1; i <= 12; i++) {
          const opp = await recruiterCaller.create({
            ...validOpportunityInput,
            title: `Default Limit Test ${i}`,
          });
          await db
            .update(opportunityTable)
            .set({ status: "published" })
            .where(eq(opportunityTable.id, opp.id));
        }

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({});

        expect(result.opportunities.length).toBeLessThanOrEqual(10);
      });

      it("should enforce maximum limit of 100", async () => {
        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({ limit: 200 });

        expect(result.opportunities.length).toBeLessThanOrEqual(100);
      });
    });

    describe("sorting", () => {
      it("should sort by createdAt descending by default", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create opportunities with delays to ensure different timestamps
        const opp1 = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "First Opportunity",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp1.id));

        await new Promise((resolve) => setTimeout(resolve, 100));

        const opp2 = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Second Opportunity",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp2.id));

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({});

        // Most recent should be first
        const idx1 = result.opportunities.findIndex((o) => o.id === opp1.id);
        const idx2 = result.opportunities.findIndex((o) => o.id === opp2.id);

        if (idx1 !== -1 && idx2 !== -1) {
          expect(idx2).toBeLessThan(idx1);
        }
      });

      it("should sort by deadline ascending when specified", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const futureDate1 = new Date();
        futureDate1.setDate(futureDate1.getDate() + 10);

        const futureDate2 = new Date();
        futureDate2.setDate(futureDate2.getDate() + 20);

        const opp1 = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Later Deadline",
          deadline: futureDate2,
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp1.id));

        const opp2 = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Earlier Deadline",
          deadline: futureDate1,
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp2.id));

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({ sortBy: "deadline" });

        const idx1 = result.opportunities.findIndex((o) => o.id === opp1.id);
        const idx2 = result.opportunities.findIndex((o) => o.id === opp2.id);

        if (idx1 !== -1 && idx2 !== -1) {
          expect(idx2).toBeLessThan(idx1); // Earlier deadline comes first
        }
      });
    });

    describe("combined filters", () => {
      it("should combine search and category filter", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp1 = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Frontend Developer",
          category: "technology",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp1.id));

        const opp2 = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Marketing Frontend",
          category: "marketing",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp2.id));

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({
          search: "Frontend",
          category: "technology",
        });

        // Should only return technology opportunities that match "Frontend"
        expect(result.opportunities.every((o) => o.category === "technology")).toBe(true);
        expect(result.opportunities.some((o) => o.title.includes("Frontend Developer"))).toBe(true);
      });

      it("should combine type, mode, and pagination", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        for (let i = 1; i <= 5; i++) {
          const opp = await recruiterCaller.create({
            ...validOpportunityInput,
            title: `Remote Internship ${i}`,
            type: "internship",
            mode: "remote",
          });
          await db
            .update(opportunityTable)
            .set({ status: "published" })
            .where(eq(opportunityTable.id, opp.id));
        }

        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({
          type: "internship",
          mode: "remote",
          limit: 3,
        });

        expect(result.opportunities.length).toBeLessThanOrEqual(3);
        expect(result.opportunities.every((o) => o.type === "internship")).toBe(true);
        expect(result.opportunities.every((o) => o.mode === "remote")).toBe(true);
      });
    });

    describe("edge cases", () => {
      it("should return empty array if no opportunities match", async () => {
        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({
          search: "NonexistentKeywordXYZ123",
        });

        expect(result.opportunities).toEqual([]);
        expect(result.total).toBe(0);
      });

      it("should handle empty database gracefully", async () => {
        // This test assumes we can query even if no published opportunities exist
        const publicCtx = createUnauthenticatedContext();
        const publicCaller = opportunityRouter.createCaller(publicCtx);

        const result = await publicCaller.list({});

        expect(Array.isArray(result.opportunities)).toBe(true);
        expect(typeof result.total).toBe("number");
      });
    });
  });

  describe("listByRecruiter", () => {
    describe("authorization", () => {
      it("should require authentication", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.listByRecruiter({ recruiterId: "recruiter-1" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.listByRecruiter({ recruiterId: "recruiter-1" })
        ).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should allow recruiters to view their own opportunities", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const result = await caller.listByRecruiter({
          recruiterId: "recruiter-1",
        });

        expect(Array.isArray(result.opportunities)).toBe(true);
      });

      it("should allow recruiters to view other recruiters' opportunities", async () => {
        const ctx = createRecruiterContext("recruiter-123");
        const caller = opportunityRouter.createCaller(ctx);

        const result = await caller.listByRecruiter({
          recruiterId: "recruiter-1",
        });

        expect(Array.isArray(result.opportunities)).toBe(true);
      });

      it("should allow candidates to view recruiter opportunities", async () => {
        const ctx = createCandidateContext();
        const caller = opportunityRouter.createCaller(ctx);

        const result = await caller.listByRecruiter({
          recruiterId: "recruiter-1",
        });

        expect(Array.isArray(result.opportunities)).toBe(true);
      });
    });

    describe("filtering by recruiter", () => {
      it("should only return opportunities from specified recruiter", async () => {
        const recruiter1Ctx = createRecruiterContext("recruiter-1");
        const recruiter1Caller = opportunityRouter.createCaller(recruiter1Ctx);

        const recruiter2Ctx = createRecruiterContext("recruiter-123");
        const recruiter2Caller = opportunityRouter.createCaller(recruiter2Ctx);

        // Create opportunities for recruiter-1
        const opp1 = await recruiter1Caller.create({
          ...validOpportunityInput,
          title: "Recruiter 1 Opportunity",
        });

        // Create opportunities for recruiter-123
        const opp2 = await recruiter2Caller.create({
          ...validOpportunityInput,
          title: "Recruiter 123 Opportunity",
        });

        // List opportunities for recruiter-1
        const result = await recruiter1Caller.listByRecruiter({
          recruiterId: "recruiter-1",
        });

        expect(result.opportunities.every((o) => o.recruiterId === "recruiter-1")).toBe(true);
        expect(result.opportunities.some((o) => o.id === opp1.id)).toBe(true);
        expect(result.opportunities.some((o) => o.id === opp2.id)).toBe(false);
      });
    });

    describe("status filtering", () => {
      it("should show all statuses when viewing own opportunities without filter", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create opportunities with different statuses
        const draft = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Draft Opp",
        });

        const published = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Published Opp",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, published.id));

        const closed = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Closed Opp",
        });
        await db
          .update(opportunityTable)
          .set({ status: "closed" })
          .where(eq(opportunityTable.id, closed.id));

        const archived = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Archived Opp",
        });
        await recruiterCaller.delete({ id: archived.id });

        // List all own opportunities
        const result = await recruiterCaller.listByRecruiter({
          recruiterId: "recruiter-1",
        });

        const statuses = result.opportunities.map((o) => o.status);
        expect(statuses).toContain("draft");
        expect(statuses).toContain("published");
        expect(statuses).toContain("closed");
        expect(statuses).toContain("archived");
      });

      it("should only show published/closed when viewing others' opportunities", async () => {
        const recruiter1Ctx = createRecruiterContext("recruiter-1");
        const recruiter1Caller = opportunityRouter.createCaller(recruiter1Ctx);

        // Create opportunities with different statuses
        await recruiter1Caller.create({
          ...validOpportunityInput,
          title: "Draft Opp",
        });

        const published = await recruiter1Caller.create({
          ...validOpportunityInput,
          title: "Published Opp",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, published.id));

        const archived = await recruiter1Caller.create({
          ...validOpportunityInput,
          title: "Archived Opp",
        });
        await recruiter1Caller.delete({ id: archived.id });

        // View as different recruiter
        const recruiter2Ctx = createRecruiterContext("recruiter-123");
        const recruiter2Caller = opportunityRouter.createCaller(recruiter2Ctx);

        const result = await recruiter2Caller.listByRecruiter({
          recruiterId: "recruiter-1",
        });

        const statuses = result.opportunities.map((o) => o.status);
        expect(statuses).not.toContain("draft");
        expect(statuses).not.toContain("archived");
        expect(statuses.every((s) => s === "published" || s === "closed")).toBe(true);
      });

      it("should only show published/closed when viewing as candidate", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create opportunities with different statuses
        await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Draft Opp",
        });

        const published = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Published Opp",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, published.id));

        // View as candidate
        const candidateCtx = createCandidateContext();
        const candidateCaller = opportunityRouter.createCaller(candidateCtx);

        const result = await candidateCaller.listByRecruiter({
          recruiterId: "recruiter-1",
        });

        const statuses = result.opportunities.map((o) => o.status);
        expect(statuses).not.toContain("draft");
        expect(statuses).not.toContain("archived");
      });

      it("should filter by specific status when provided", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create opportunities with different statuses
        await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Draft 1",
        });

        await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Draft 2",
        });

        const published = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Published Opp",
        });
        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, published.id));

        // Filter by draft status
        const result = await recruiterCaller.listByRecruiter({
          recruiterId: "recruiter-1",
          status: "draft",
        });

        expect(result.opportunities.every((o) => o.status === "draft")).toBe(true);
        expect(result.opportunities.length).toBeGreaterThanOrEqual(2);
      });
    });

    describe("pagination", () => {
      it("should support limit parameter", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create multiple opportunities
        for (let i = 1; i <= 5; i++) {
          await recruiterCaller.create({
            ...validOpportunityInput,
            title: `Opportunity ${i}`,
          });
        }

        const result = await recruiterCaller.listByRecruiter({
          recruiterId: "recruiter-1",
          limit: 3,
        });

        expect(result.opportunities.length).toBeLessThanOrEqual(3);
      });

      it("should support offset parameter", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create opportunities
        for (let i = 1; i <= 5; i++) {
          await recruiterCaller.create({
            ...validOpportunityInput,
            title: `Test ${i}`,
          });
        }

        const page1 = await recruiterCaller.listByRecruiter({
          recruiterId: "recruiter-1",
          limit: 2,
          offset: 0,
        });

        const page2 = await recruiterCaller.listByRecruiter({
          recruiterId: "recruiter-1",
          limit: 2,
          offset: 2,
        });

        const page1Ids = page1.opportunities.map((o) => o.id);
        const page2Ids = page2.opportunities.map((o) => o.id);

        expect(page1Ids.some((id) => page2Ids.includes(id))).toBe(false);
      });

      it("should return total count", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create known number of opportunities
        for (let i = 1; i <= 3; i++) {
          await recruiterCaller.create({
            ...validOpportunityInput,
            title: `Count Test ${i}`,
          });
        }

        const result = await recruiterCaller.listByRecruiter({
          recruiterId: "recruiter-1",
        });

        expect(result.total).toBeGreaterThanOrEqual(3);
        expect(typeof result.total).toBe("number");
      });

      it("should default to limit 10", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create 12 opportunities
        for (let i = 1; i <= 12; i++) {
          await recruiterCaller.create({
            ...validOpportunityInput,
            title: `Default Limit ${i}`,
          });
        }

        const result = await recruiterCaller.listByRecruiter({
          recruiterId: "recruiter-1",
        });

        expect(result.opportunities.length).toBeLessThanOrEqual(10);
      });

      it("should enforce maximum limit of 100", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const result = await recruiterCaller.listByRecruiter({
          recruiterId: "recruiter-1",
          limit: 200,
        });

        expect(result.opportunities.length).toBeLessThanOrEqual(100);
      });
    });

    describe("sorting", () => {
      it("should sort by createdAt descending by default", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp1 = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "First",
        });

        await new Promise((resolve) => setTimeout(resolve, 100));

        const opp2 = await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Second",
        });

        const result = await recruiterCaller.listByRecruiter({
          recruiterId: "recruiter-1",
        });

        const idx1 = result.opportunities.findIndex((o) => o.id === opp1.id);
        const idx2 = result.opportunities.findIndex((o) => o.id === opp2.id);

        if (idx1 !== -1 && idx2 !== -1) {
          expect(idx2).toBeLessThan(idx1);
        }
      });
    });

    describe("edge cases", () => {
      it("should return empty array if recruiter has no opportunities", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const result = await recruiterCaller.listByRecruiter({
          recruiterId: "my-recruiter-id",
        });

        expect(result.opportunities).toEqual([]);
        expect(result.total).toBe(0);
      });

      it("should return empty array if status filter matches nothing", async () => {
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Create only draft opportunities
        await recruiterCaller.create({
          ...validOpportunityInput,
          title: "Draft Only",
        });

        // Filter for published (should be empty)
        const result = await recruiterCaller.listByRecruiter({
          recruiterId: "recruiter-1",
          status: "published",
        });

        expect(result.opportunities).toEqual([]);
        expect(result.total).toBe(0);
      });
    });
  });

  describe("updateStatus", () => {
    describe("authorization", () => {
      it("should require authentication", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.updateStatus({
            id: "00000000-0000-0000-0000-000000000123",
            status: "published",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.updateStatus({
            id: "00000000-0000-0000-0000-000000000123",
            status: "published",
          })
        ).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should require recruiter role", async () => {
        const ctx = createCandidateContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.updateStatus({
            id: "00000000-0000-0000-0000-000000000123",
            status: "published",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.updateStatus({
            id: "00000000-0000-0000-0000-000000000123",
            status: "published",
          })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
        });
      });

      it("should only allow owner to update status", async () => {
        const recruiter1Ctx = createRecruiterContext("recruiter-1");
        const recruiter1Caller = opportunityRouter.createCaller(recruiter1Ctx);

        const opp = await recruiter1Caller.create(validOpportunityInput);

        const recruiter2Ctx = createRecruiterContext("recruiter-123");
        const recruiter2Caller = opportunityRouter.createCaller(recruiter2Ctx);

        await expect(
          recruiter2Caller.updateStatus({
            id: opp.id,
            status: "published",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          recruiter2Caller.updateStatus({
            id: opp.id,
            status: "published",
          })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
          message: "You can only update your own opportunities",
        });
      });
    });

    describe("validation", () => {
      it("should reject invalid id format", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.updateStatus({
            id: "",
            status: "published",
          })
        ).rejects.toThrow();
      });

      it("should reject invalid status value", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opp = await caller.create(validOpportunityInput);

        await expect(
          caller.updateStatus({
            id: opp.id,
            status: "invalid-status" as any,
          })
        ).rejects.toThrow();
      });
    });

    describe("status transitions", () => {
      it("should update from draft to published", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opp = await caller.create(validOpportunityInput);

        expect(opp.status).toBe("draft");

        const updated = await caller.updateStatus({
          id: opp.id,
          status: "published",
        });

        expect(updated.status).toBe("published");
      });

      it("should update from published to closed", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opp = await caller.create(validOpportunityInput);

        await caller.updateStatus({
          id: opp.id,
          status: "published",
        });

        const updated = await caller.updateStatus({
          id: opp.id,
          status: "closed",
        });

        expect(updated.status).toBe("closed");
      });

      it("should update from published to draft", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opp = await caller.create(validOpportunityInput);

        await caller.updateStatus({
          id: opp.id,
          status: "published",
        });

        const updated = await caller.updateStatus({
          id: opp.id,
          status: "draft",
        });

        expect(updated.status).toBe("draft");
      });

      it("should update from closed to published", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opp = await caller.create(validOpportunityInput);

        await caller.updateStatus({
          id: opp.id,
          status: "closed",
        });

        const updated = await caller.updateStatus({
          id: opp.id,
          status: "published",
        });

        expect(updated.status).toBe("published");
      });

      it("should update to archived status", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opp = await caller.create(validOpportunityInput);

        const updated = await caller.updateStatus({
          id: opp.id,
          status: "archived",
        });

        expect(updated.status).toBe("archived");
      });

      it("should allow keeping same status (idempotent)", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opp = await caller.create(validOpportunityInput);

        await caller.updateStatus({
          id: opp.id,
          status: "published",
        });

        const updated = await caller.updateStatus({
          id: opp.id,
          status: "published",
        });

        expect(updated.status).toBe("published");
      });
    });

    describe("success cases", () => {
      it("should update updatedAt timestamp", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opp = await caller.create(validOpportunityInput);
        const originalUpdatedAt = opp.updatedAt;

        await new Promise((resolve) => setTimeout(resolve, 100));

        const updated = await caller.updateStatus({
          id: opp.id,
          status: "published",
        });

        expect(updated.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime()
        );
      });

      it("should return updated opportunity with all fields", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opp = await caller.create(validOpportunityInput);

        const updated = await caller.updateStatus({
          id: opp.id,
          status: "published",
        });

        expect(updated.id).toBe(opp.id);
        expect(updated.title).toBe(opp.title);
        expect(updated.description).toBe(opp.description);
        expect(updated.status).toBe("published");
        expect(updated.recruiterId).toBe(opp.recruiterId);
      });

      it("should not modify other fields when updating status", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = opportunityRouter.createCaller(ctx);

        const opp = await caller.create(validOpportunityInput);

        const updated = await caller.updateStatus({
          id: opp.id,
          status: "published",
        });

        expect(updated.title).toBe(opp.title);
        expect(updated.description).toBe(opp.description);
        expect(updated.type).toBe(opp.type);
        expect(updated.mode).toBe(opp.mode);
        expect(updated.category).toBe(opp.category);
        expect(updated.stipend).toBe(opp.stipend);
        expect(updated.positions).toBe(opp.positions);
      });
    });

    describe("edge cases", () => {
      it("should throw NOT_FOUND if opportunity does not exist", async () => {
        const ctx = createRecruiterContext();
        const caller = opportunityRouter.createCaller(ctx);

        await expect(
          caller.updateStatus({
            id: "00000000-0000-0000-0000-000000000000",
            status: "published",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.updateStatus({
            id: "00000000-0000-0000-0000-000000000000",
            status: "published",
          })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      });
    });
  });
});
