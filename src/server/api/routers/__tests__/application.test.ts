import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { describe, expect, it, beforeEach } from "vitest";

import type { Context } from "../../context";

import { applicationRouter } from "../application";
import { opportunityRouter } from "../opportunity";
import { resetTestDatabase } from "@/test/db-utils";
import { db } from "@/server/db";
import { application as applicationTable } from "@/server/db/schema/application";
import { opportunity as opportunityTable } from "@/server/db/schema/opportunity";

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
        id: "session-2",
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

// Valid application input for testing
const validApplicationInput = {
  opportunityId: "", // Will be set dynamically
  coverLetter:
    "I am very interested in this opportunity. I have relevant experience in the field and would love to contribute to your team. I believe my skills align well with the requirements.",
  resumeUrl: "https://example.com/resume.pdf",
};

describe("applicationRouter", () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });

  describe("create", () => {
    describe("authorization", () => {
      it("should require authentication", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.create({
            opportunityId: "00000000-0000-0000-0000-000000000123",
            coverLetter: "Test cover letter with enough characters to pass validation requirements.",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.create({
            opportunityId: "00000000-0000-0000-0000-000000000123",
            coverLetter: "Test cover letter with enough characters to pass validation requirements.",
          })
        ).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should require candidate role", async () => {
        const ctx = createRecruiterContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.create({
            opportunityId: "00000000-0000-0000-0000-000000000123",
            coverLetter: "Test cover letter with enough characters to pass validation requirements.",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.create({
            opportunityId: "00000000-0000-0000-0000-000000000123",
            coverLetter: "Test cover letter with enough characters to pass validation requirements.",
          })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
        });
      });
    });

    describe("validation", () => {
      it("should reject invalid opportunityId (empty)", async () => {
        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.create({
            opportunityId: "",
            coverLetter: "Test cover letter with enough characters to pass validation requirements.",
          })
        ).rejects.toThrow();
      });

      it("should reject cover letter that is too short", async () => {
        // First create a published opportunity
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity for application testing",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.create({
            opportunityId: opp.id,
            coverLetter: "Too short",
          })
        ).rejects.toThrow();
      });

      it("should reject cover letter that is too long", async () => {
        // First create a published opportunity
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity for application testing",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        const longCoverLetter = "a".repeat(2001);

        await expect(
          caller.create({
            opportunityId: opp.id,
            coverLetter: longCoverLetter,
          })
        ).rejects.toThrow();
      });

      it("should reject invalid resumeUrl format", async () => {
        // First create a published opportunity
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity for application testing",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.create({
            opportunityId: opp.id,
            coverLetter: "Test cover letter with enough characters to pass validation requirements.",
            resumeUrl: "not-a-valid-url",
          })
        ).rejects.toThrow();
      });
    });

    describe("business logic", () => {
      it("should throw NOT_FOUND if opportunity does not exist", async () => {
        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.create({
            opportunityId: "00000000-0000-0000-0000-000000000000",
            coverLetter: "Test cover letter with enough characters to pass validation requirements.",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.create({
            opportunityId: "00000000-0000-0000-0000-000000000000",
            coverLetter: "Test cover letter with enough characters to pass validation requirements.",
          })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      });

      it("should throw BAD_REQUEST if opportunity is not published", async () => {
        // Create a draft opportunity
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Draft Opportunity",
          description: "This is a draft opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.create({
            opportunityId: opp.id,
            coverLetter: "Test cover letter with enough characters to pass validation requirements.",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.create({
            opportunityId: opp.id,
            coverLetter: "Test cover letter with enough characters to pass validation requirements.",
          })
        ).rejects.toMatchObject({
          code: "BAD_REQUEST",
          message: "This opportunity is not accepting applications",
        });
      });

      it("should throw BAD_REQUEST if already applied", async () => {
        // Create a published opportunity
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        // Apply once
        await caller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        // Try to apply again
        await expect(
          caller.create({
            opportunityId: opp.id,
            coverLetter: "Another cover letter with enough characters to pass validation requirements.",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.create({
            opportunityId: opp.id,
            coverLetter: "Another cover letter with enough characters to pass validation requirements.",
          })
        ).rejects.toMatchObject({
          code: "BAD_REQUEST",
          message: "You have already applied to this opportunity",
        });
      });
    });

    describe("success cases", () => {
      it("should create application with all fields", async () => {
        // Create a published opportunity
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        const result = await caller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
          resumeUrl: "https://example.com/resume.pdf",
        });

        expect(result.id).toBeDefined();
        expect(result.opportunityId).toBe(opp.id);
        expect(result.candidateId).toBe("candidate-1");
        expect(result.coverLetter).toBe("Test cover letter with enough characters to pass validation requirements.");
        expect(result.resumeUrl).toBe("https://example.com/resume.pdf");
        expect(result.status).toBe("pending");
        expect(result.appliedAt).toBeInstanceOf(Date);
        expect(result.updatedAt).toBeInstanceOf(Date);
      });

      it("should create application without optional fields", async () => {
        // Create a published opportunity
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        const result = await caller.create({
          opportunityId: opp.id,
        });

        expect(result.id).toBeDefined();
        expect(result.opportunityId).toBe(opp.id);
        expect(result.candidateId).toBe("candidate-1");
        expect(result.coverLetter).toBeNull();
        expect(result.resumeUrl).toBeNull();
        expect(result.status).toBe("pending");
      });

      it("should auto-assign candidateId from session", async () => {
        // Create a published opportunity
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        const ctx = createCandidateContext("candidate-1");
        const caller = applicationRouter.createCaller(ctx);

        const result = await caller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        expect(result.candidateId).toBe("candidate-1");
      });

      it("should default status to pending", async () => {
        // Create a published opportunity
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        const result = await caller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        expect(result.status).toBe("pending");
      });

      it("should generate unique ID for application", async () => {
        // Create a published opportunity
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        const result = await caller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        expect(result.id).toMatch(/^app-\d+-[a-z0-9]+$/);
      });
    });

    describe("edge cases", () => {
      it("should validate schema before database insert", async () => {
        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.create({
            opportunityId: "00000000-0000-0000-0000-000000000123",
            coverLetter: "short",
          })
        ).rejects.toThrow();
      });
    });
  });

  describe("getById", () => {
    describe("authorization", () => {
      it("should require authentication", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(caller.getById({ id: "00000000-0000-0000-0000-000000000a23" })).rejects.toThrow(
          TRPCError
        );

        await expect(caller.getById({ id: "00000000-0000-0000-0000-000000000a23" })).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should allow candidate to view their own application", async () => {
        // Create opportunity as recruiter
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application as candidate
        const candidateCtx = createCandidateContext("candidate-1");
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        // Candidate should be able to view their own application
        const result = await candidateCaller.getById({ id: app.id });

        expect(result).toMatchObject({
          id: app.id,
          candidateId: "candidate-1",
        });
      });

      it("should allow recruiter to view applications to their opportunities", async () => {
        // Create opportunity as recruiter
        const recruiterCtx = createRecruiterContext("recruiter-1");
        const recruiterOppCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterOppCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application as candidate
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        // Recruiter should be able to view application to their opportunity
        const recruiterAppCaller = applicationRouter.createCaller(recruiterCtx);
        const recruiterResult = await recruiterAppCaller.getById({ id: app.id });

        expect(recruiterResult).toMatchObject({
          id: app.id,
          opportunityId: opp.id,
        });
      });

      it("should prevent candidate from viewing other candidates' applications", async () => {
        // Create opportunity as recruiter
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application as candidate-1
        const candidate1Ctx = createCandidateContext("candidate-1");
        const candidate1Caller = applicationRouter.createCaller(candidate1Ctx);

        const app = await candidate1Caller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        // Try to view as candidate-2
        const candidate2Ctx = createCandidateContext("candidate-2");
        const candidate2Caller = applicationRouter.createCaller(candidate2Ctx);

        await expect(
          candidate2Caller.getById({ id: app.id })
        ).rejects.toThrow(TRPCError);

        await expect(
          candidate2Caller.getById({ id: app.id })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
          message: "You do not have permission to view this application",
        });
      });

      it("should prevent recruiter from viewing applications to other recruiters' opportunities", async () => {
        // Create opportunity as recruiter-1
        const recruiter1Ctx = createRecruiterContext("recruiter-1");
        const recruiter1Caller = opportunityRouter.createCaller(recruiter1Ctx);

        const opp = await recruiter1Caller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application as candidate
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        // Try to view as recruiter-2
        const recruiter2Ctx = createRecruiterContext("recruiter-2");
        const recruiter2Caller = applicationRouter.createCaller(recruiter2Ctx);

        await expect(
          recruiter2Caller.getById({ id: app.id })
        ).rejects.toThrow(TRPCError);

        await expect(
          recruiter2Caller.getById({ id: app.id })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
          message: "You do not have permission to view this application",
        });
      });
    });

    describe("validation", () => {
      it("should reject invalid application ID (empty)", async () => {
        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(caller.getById({ id: "" })).rejects.toThrow();
      });

      it("should reject invalid application ID (whitespace)", async () => {
        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(caller.getById({ id: "   " })).rejects.toThrow();
      });
    });

    describe("not found", () => {
      it("should throw NOT_FOUND if application does not exist", async () => {
        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.getById({ id: "00000000-0000-0000-0000-a00000000000" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.getById({ id: "00000000-0000-0000-0000-a00000000000" })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      });
    });

    describe("success scenarios", () => {
      it("should return complete application data", async () => {
        // Create opportunity as recruiter
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application as candidate
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
          resumeUrl: "https://example.com/resume.pdf",
        });

        // Get application
        const result = await candidateCaller.getById({ id: app.id });

        expect(result).toMatchObject({
          id: app.id,
          opportunityId: opp.id,
          candidateId: "candidate-1",
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
          resumeUrl: "https://example.com/resume.pdf",
          status: "pending",
        });
        expect(result.appliedAt).toBeInstanceOf(Date);
        expect(result.updatedAt).toBeInstanceOf(Date);
      });

      it("should handle applications without optional fields", async () => {
        // Create opportunity as recruiter
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application as candidate without optional fields
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
        });

        // Get application
        const result = await candidateCaller.getById({ id: app.id });

        expect(result).toMatchObject({
          id: app.id,
          coverLetter: null,
          resumeUrl: null,
        });
      });
    });
  });

  describe("listByCandidate", () => {
    describe("authorization", () => {
      it("should require authentication", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(caller.listByCandidate({})).rejects.toThrow(TRPCError);

        await expect(caller.listByCandidate({})).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should require candidate role", async () => {
        const ctx = createRecruiterContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(caller.listByCandidate({})).rejects.toThrow(TRPCError);

        await expect(caller.listByCandidate({})).rejects.toMatchObject({
          code: "FORBIDDEN",
        });
      });
    });

    describe("filtering and pagination", () => {
      it("should return empty array when candidate has no applications", async () => {
        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        const result = await caller.listByCandidate({});

        expect(result.applications).toEqual([]);
        expect(result.total).toBe(0);
      });

      it("should list all applications for the logged-in candidate", async () => {
        // Create opportunities
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp1 = await recruiterCaller.create({
          title: "Opportunity 1",
          description: "This is opportunity 1",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        const opp2 = await recruiterCaller.create({
          title: "Opportunity 2",
          description: "This is opportunity 2",
          type: "fellowship",
          mode: "onsite",
          category: "design",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["Figma"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp1.id));

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp2.id));

        // Create applications as candidate
        const candidateCtx = createCandidateContext("candidate-1");
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        await candidateCaller.create({
          opportunityId: opp1.id,
          coverLetter: "Cover letter for opportunity 1 with enough characters to pass validation.",
        });

        await candidateCaller.create({
          opportunityId: opp2.id,
          coverLetter: "Cover letter for opportunity 2 with enough characters to pass validation.",
        });

        // List applications
        const result = await candidateCaller.listByCandidate({});

        expect(result.applications).toHaveLength(2);
        expect(result.total).toBe(2);
        expect(result.applications[0]?.opportunityId).toBe(opp2.id); // Newest first
        expect(result.applications[1]?.opportunityId).toBe(opp1.id);
      });

      it("should only return applications for the logged-in candidate", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create applications from two different candidates
        const candidate1Ctx = createCandidateContext("candidate-1");
        const candidate1Caller = applicationRouter.createCaller(candidate1Ctx);

        await candidate1Caller.create({
          opportunityId: opp.id,
          coverLetter: "Cover letter from candidate 1 with enough characters to pass validation.",
        });

        // Candidate 1 should only see their own application
        const result = await candidate1Caller.listByCandidate({});

        expect(result.applications).toHaveLength(1);
        expect(result.total).toBe(1);
        expect(result.applications[0]?.candidateId).toBe("candidate-1");
      });

      it("should filter by status", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application and update status
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Cover letter with enough characters to pass validation.",
        });

        // Update status to reviewing
        await db
          .update(applicationTable)
          .set({ status: "reviewing" })
          .where(eq(applicationTable.id, app.id));

        // Filter by pending - should return 0
        const pendingResult = await candidateCaller.listByCandidate({
          status: "pending",
        });
        expect(pendingResult.applications).toHaveLength(0);
        expect(pendingResult.total).toBe(0);

        // Filter by reviewing - should return 1
        const reviewingResult = await candidateCaller.listByCandidate({
          status: "reviewing",
        });
        expect(reviewingResult.applications).toHaveLength(1);
        expect(reviewingResult.total).toBe(1);
      });

      it("should support pagination with limit", async () => {
        // Create opportunities
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opps = [];
        for (let i = 0; i < 3; i++) {
          const opp = await recruiterCaller.create({
            title: `Opportunity ${i}`,
            description: "This is a test opportunity",
            type: "internship",
            mode: "remote",
            category: "technology",
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            skills: ["JavaScript"],
          });
          opps.push(opp);

          await db
            .update(opportunityTable)
            .set({ status: "published" })
            .where(eq(opportunityTable.id, opp.id));
        }

        // Create applications
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        for (const opp of opps) {
          await candidateCaller.create({
            opportunityId: opp.id,
            coverLetter: "Cover letter with enough characters to pass validation.",
          });
        }

        // Get with limit
        const result = await candidateCaller.listByCandidate({ limit: 2 });

        expect(result.applications).toHaveLength(2);
        expect(result.total).toBe(3);
      });

      it("should support pagination with offset", async () => {
        // Create opportunities
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opps = [];
        for (let i = 0; i < 3; i++) {
          const opp = await recruiterCaller.create({
            title: `Opportunity ${i}`,
            description: "This is a test opportunity",
            type: "internship",
            mode: "remote",
            category: "technology",
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            skills: ["JavaScript"],
          });
          opps.push(opp);

          await db
            .update(opportunityTable)
            .set({ status: "published" })
            .where(eq(opportunityTable.id, opp.id));
        }

        // Create applications
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        for (const opp of opps) {
          await candidateCaller.create({
            opportunityId: opp.id,
            coverLetter: "Cover letter with enough characters to pass validation.",
          });
        }

        // Get first page
        const page1 = await candidateCaller.listByCandidate({ limit: 2, offset: 0 });
        expect(page1.applications).toHaveLength(2);

        // Get second page
        const page2 = await candidateCaller.listByCandidate({ limit: 2, offset: 2 });
        expect(page2.applications).toHaveLength(1);
        expect(page2.total).toBe(3);
      });

      it("should clamp limit to maximum of 100", async () => {
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        // Should not throw error even with limit > 100
        const result = await candidateCaller.listByCandidate({ limit: 200 });

        expect(result.applications).toEqual([]);
      });
    });

    describe("sorting", () => {
      it("should sort by newest first (appliedAt DESC)", async () => {
        // Create opportunities
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp1 = await recruiterCaller.create({
          title: "Opportunity 1",
          description: "This is opportunity 1",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        const opp2 = await recruiterCaller.create({
          title: "Opportunity 2",
          description: "This is opportunity 2",
          type: "fellowship",
          mode: "onsite",
          category: "design",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["Figma"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp1.id));

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp2.id));

        // Create applications
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app1 = await candidateCaller.create({
          opportunityId: opp1.id,
          coverLetter: "Cover letter for opportunity 1 with enough characters to pass validation.",
        });

        // Wait a bit to ensure different timestamps
        await new Promise((resolve) => setTimeout(resolve, 100));

        const app2 = await candidateCaller.create({
          opportunityId: opp2.id,
          coverLetter: "Cover letter for opportunity 2 with enough characters to pass validation.",
        });

        // List applications
        const result = await candidateCaller.listByCandidate({});

        expect(result.applications).toHaveLength(2);
        // Newest first
        expect(result.applications[0]?.id).toBe(app2.id);
        expect(result.applications[1]?.id).toBe(app1.id);
      });
    });
  });

  describe("listByOpportunity", () => {
    describe("authorization", () => {
      it("should require authentication", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.listByOpportunity({ opportunityId: "00000000-0000-0000-0000-000000000123" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.listByOpportunity({ opportunityId: "00000000-0000-0000-0000-000000000123" })
        ).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should require recruiter role", async () => {
        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.listByOpportunity({ opportunityId: "00000000-0000-0000-0000-000000000123" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.listByOpportunity({ opportunityId: "00000000-0000-0000-0000-000000000123" })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
        });
      });

      it("should prevent recruiter from viewing applications to other recruiters' opportunities", async () => {
        // Create opportunity as recruiter-1
        const recruiter1Ctx = createRecruiterContext("recruiter-1");
        const recruiter1Caller = opportunityRouter.createCaller(recruiter1Ctx);

        const opp = await recruiter1Caller.create({
          title: "Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application as candidate
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Cover letter with enough characters to pass validation.",
        });

        // Try to list as recruiter-2
        const recruiter2Ctx = createRecruiterContext("recruiter-2");
        const recruiter2AppCaller =
          applicationRouter.createCaller(recruiter2Ctx);

        await expect(
          recruiter2AppCaller.listByOpportunity({ opportunityId: opp.id })
        ).rejects.toThrow(TRPCError);

        await expect(
          recruiter2AppCaller.listByOpportunity({ opportunityId: opp.id })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
          message:
            "You do not have permission to view applications for this opportunity",
        });
      });
    });

    describe("validation", () => {
      it("should reject empty opportunityId", async () => {
        const ctx = createRecruiterContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.listByOpportunity({ opportunityId: "" })
        ).rejects.toThrow();
      });

      it("should throw NOT_FOUND if opportunity does not exist", async () => {
        const ctx = createRecruiterContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.listByOpportunity({ opportunityId: "00000000-0000-0000-0000-000000000000" })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.listByOpportunity({ opportunityId: "00000000-0000-0000-0000-000000000000" })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      });
    });

    describe("filtering and pagination", () => {
      it("should return empty array when opportunity has no applications", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        // List applications
        const appCaller = applicationRouter.createCaller(recruiterCtx);
        const result = await appCaller.listByOpportunity({
          opportunityId: opp.id,
        });

        expect(result.applications).toEqual([]);
        expect(result.total).toBe(0);
      });

      it("should list all applications for the opportunity", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create applications from two candidates
        const candidate1Ctx = createCandidateContext("candidate-1");
        const candidate1Caller = applicationRouter.createCaller(candidate1Ctx);

        await candidate1Caller.create({
          opportunityId: opp.id,
          coverLetter: "Cover letter from candidate 1 with enough characters to pass validation.",
        });

        const candidate2Ctx = createCandidateContext("candidate-2");
        const candidate2Caller = applicationRouter.createCaller(candidate2Ctx);

        await candidate2Caller.create({
          opportunityId: opp.id,
          coverLetter: "Cover letter from candidate 2 with enough characters to pass validation.",
        });

        // List applications as recruiter
        const appCaller = applicationRouter.createCaller(recruiterCtx);
        const result = await appCaller.listByOpportunity({
          opportunityId: opp.id,
        });

        expect(result.applications).toHaveLength(2);
        expect(result.total).toBe(2);
      });

      it("should filter by status", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create two applications
        const candidate1Ctx = createCandidateContext("candidate-1");
        const candidate1Caller = applicationRouter.createCaller(candidate1Ctx);

        const app1 = await candidate1Caller.create({
          opportunityId: opp.id,
          coverLetter: "Cover letter with enough characters to pass validation.",
        });

        const candidate2Ctx = createCandidateContext("candidate-2");
        const candidate2Caller = applicationRouter.createCaller(candidate2Ctx);

        const app2 = await candidate2Caller.create({
          opportunityId: opp.id,
          coverLetter: "Cover letter with enough characters to pass validation.",
        });

        // Update one to reviewing
        await db
          .update(applicationTable)
          .set({ status: "reviewing" })
          .where(eq(applicationTable.id, app1.id));

        // Filter by pending - should return 1
        const appCaller = applicationRouter.createCaller(recruiterCtx);
        const pendingResult = await appCaller.listByOpportunity({
          opportunityId: opp.id,
          status: "pending",
        });
        expect(pendingResult.applications).toHaveLength(1);
        expect(pendingResult.total).toBe(1);

        // Filter by reviewing - should return 1
        const reviewingResult = await appCaller.listByOpportunity({
          opportunityId: opp.id,
          status: "reviewing",
        });
        expect(reviewingResult.applications).toHaveLength(1);
        expect(reviewingResult.total).toBe(1);
      });

      it("should support pagination with limit", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create 3 applications
        for (let i = 1; i <= 3; i++) {
          const candidateCtx = createCandidateContext(`candidate-${i}`);
          const candidateCaller = applicationRouter.createCaller(candidateCtx);

          await candidateCaller.create({
            opportunityId: opp.id,
            coverLetter: "Cover letter with enough characters to pass validation.",
          });
        }

        // Get with limit
        const appCaller = applicationRouter.createCaller(recruiterCtx);
        const result = await appCaller.listByOpportunity({
          opportunityId: opp.id,
          limit: 2,
        });

        expect(result.applications).toHaveLength(2);
        expect(result.total).toBe(3);
      });

      it("should support pagination with offset", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create 3 applications
        for (let i = 1; i <= 3; i++) {
          const candidateCtx = createCandidateContext(`candidate-${i}`);
          const candidateCaller = applicationRouter.createCaller(candidateCtx);

          await candidateCaller.create({
            opportunityId: opp.id,
            coverLetter: "Cover letter with enough characters to pass validation.",
          });
        }

        // Get first page
        const appCaller = applicationRouter.createCaller(recruiterCtx);
        const page1 = await appCaller.listByOpportunity({
          opportunityId: opp.id,
          limit: 2,
          offset: 0,
        });
        expect(page1.applications).toHaveLength(2);

        // Get second page
        const page2 = await appCaller.listByOpportunity({
          opportunityId: opp.id,
          limit: 2,
          offset: 2,
        });
        expect(page2.applications).toHaveLength(1);
        expect(page2.total).toBe(3);
      });

      it("should clamp limit to maximum of 100", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        // Should not throw error even with limit > 100
        const appCaller = applicationRouter.createCaller(recruiterCtx);
        const result = await appCaller.listByOpportunity({
          opportunityId: opp.id,
          limit: 200,
        });

        expect(result.applications).toEqual([]);
      });
    });

    describe("sorting", () => {
      it("should sort by newest first (appliedAt DESC)", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create applications
        const candidate1Ctx = createCandidateContext("candidate-1");
        const candidate1Caller = applicationRouter.createCaller(candidate1Ctx);

        const app1 = await candidate1Caller.create({
          opportunityId: opp.id,
          coverLetter: "Cover letter with enough characters to pass validation.",
        });

        // Wait a bit to ensure different timestamps
        await new Promise((resolve) => setTimeout(resolve, 100));

        const candidate2Ctx = createCandidateContext("candidate-2");
        const candidate2Caller = applicationRouter.createCaller(candidate2Ctx);

        const app2 = await candidate2Caller.create({
          opportunityId: opp.id,
          coverLetter: "Cover letter with enough characters to pass validation.",
        });

        // List applications
        const appCaller = applicationRouter.createCaller(recruiterCtx);
        const result = await appCaller.listByOpportunity({
          opportunityId: opp.id,
        });

        expect(result.applications).toHaveLength(2);
        // Newest first
        expect(result.applications[0]?.id).toBe(app2.id);
        expect(result.applications[1]?.id).toBe(app1.id);
      });
    });
  });

  describe("updateStatus", () => {
    describe("Authorization", () => {
      it("should require authentication", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.updateStatus({
            id: "app-1",
            status: "reviewing",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.updateStatus({
            id: "app-1",
            status: "reviewing",
          })
        ).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should require recruiter role", async () => {
        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.updateStatus({
            id: "app-1",
            status: "reviewing",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.updateStatus({
            id: "app-1",
            status: "reviewing",
          })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
        });
      });

      it("should prevent recruiter from updating status of applications to other recruiters' opportunities", async () => {
        // Create opportunity as recruiter-1
        const recruiter1Ctx = createRecruiterContext("recruiter-1");
        const recruiter1Caller = opportunityRouter.createCaller(recruiter1Ctx);

        const opp = await recruiter1Caller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application as candidate
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        // Try to update status as recruiter-2 (different recruiter)
        const recruiter2Ctx = createRecruiterContext("recruiter-2");
        const recruiter2Caller = applicationRouter.createCaller(recruiter2Ctx);

        await expect(
          recruiter2Caller.updateStatus({
            id: app.id,
            status: "reviewing",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          recruiter2Caller.updateStatus({
            id: app.id,
            status: "reviewing",
          })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
          message: "You do not have permission to update this application",
        });
      });
    });

    describe("Validation", () => {
      it("should reject empty application ID", async () => {
        const ctx = createRecruiterContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.updateStatus({
            id: "",
            status: "reviewing",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.updateStatus({
            id: "",
            status: "reviewing",
          })
        ).rejects.toMatchObject({
          code: "BAD_REQUEST",
        });
      });

      it("should reject invalid status value", async () => {
        const ctx = createRecruiterContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          // @ts-expect-error - Testing invalid status
          caller.updateStatus({
            id: "app-1",
            status: "invalid-status",
          })
        ).rejects.toThrow(TRPCError);
      });

      it("should throw NOT_FOUND if application does not exist", async () => {
        const ctx = createRecruiterContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.updateStatus({
            id: "non-existent-app-id",
            status: "reviewing",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.updateStatus({
            id: "non-existent-app-id",
            status: "reviewing",
          })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      });
    });

    describe("Business Logic", () => {
      it("should update application status successfully", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        // Verify initial status
        expect(app.status).toBe("pending");

        // Update status
        const appCaller = applicationRouter.createCaller(recruiterCtx);
        const result = await appCaller.updateStatus({
          id: app.id,
          status: "reviewing",
        });

        expect(result).toMatchObject({
          id: app.id,
          status: "reviewing",
        });

        // Verify status was updated in database
        const [updated] = await db
          .select()
          .from(applicationTable)
          .where(eq(applicationTable.id, app.id));

        expect(updated?.status).toBe("reviewing");
      });

      it("should allow all valid status transitions", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        const appCaller = applicationRouter.createCaller(recruiterCtx);

        // Test each status
        const statuses = [
          "reviewing",
          "shortlisted",
          "accepted",
        ] as const;

        for (const status of statuses) {
          const result = await appCaller.updateStatus({
            id: app.id,
            status,
          });

          expect(result.status).toBe(status);
        }
      });

      it("should prevent candidates from updating their own application status", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application as candidate
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        // Try to update status as candidate (should fail because it requires recruiter role)
        await expect(
          candidateCaller.updateStatus({
            id: app.id,
            status: "reviewing",
          })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
        });
      });

      it("should update the updatedAt timestamp", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        const initialUpdatedAt = app.updatedAt;

        // Wait a bit to ensure different timestamp
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Update status
        const appCaller = applicationRouter.createCaller(recruiterCtx);
        const result = await appCaller.updateStatus({
          id: app.id,
          status: "reviewing",
        });

        expect(result.updatedAt.getTime()).toBeGreaterThan(
          initialUpdatedAt.getTime()
        );
      });
    });
  });

  describe("withdraw", () => {
    describe("Authorization", () => {
      it("should require authentication", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.withdraw({
            id: "app-1",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.withdraw({
            id: "app-1",
          })
        ).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should require candidate role", async () => {
        const ctx = createRecruiterContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.withdraw({
            id: "app-1",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.withdraw({
            id: "app-1",
          })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
        });
      });

      it("should prevent candidate from withdrawing other candidates' applications", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application as candidate-1
        const candidate1Ctx = createCandidateContext("candidate-1");
        const candidate1Caller = applicationRouter.createCaller(candidate1Ctx);

        const app = await candidate1Caller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        // Try to withdraw as candidate-2
        const candidate2Ctx = createCandidateContext("candidate-2");
        const candidate2Caller = applicationRouter.createCaller(candidate2Ctx);

        await expect(
          candidate2Caller.withdraw({
            id: app.id,
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          candidate2Caller.withdraw({
            id: app.id,
          })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
          message: "You do not have permission to withdraw this application",
        });
      });
    });

    describe("Validation", () => {
      it("should reject empty application ID", async () => {
        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.withdraw({
            id: "",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.withdraw({
            id: "",
          })
        ).rejects.toMatchObject({
          code: "BAD_REQUEST",
        });
      });

      it("should throw NOT_FOUND if application does not exist", async () => {
        const ctx = createCandidateContext();
        const caller = applicationRouter.createCaller(ctx);

        await expect(
          caller.withdraw({
            id: "non-existent-app-id",
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          caller.withdraw({
            id: "non-existent-app-id",
          })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Application not found",
        });
      });
    });

    describe("Business Logic", () => {
      it("should withdraw application successfully", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        // Verify initial status
        expect(app.status).toBe("pending");

        // Withdraw application
        const result = await candidateCaller.withdraw({
          id: app.id,
        });

        expect(result).toMatchObject({
          id: app.id,
          status: "withdrawn",
        });

        // Verify status was updated in database
        const [updated] = await db
          .select()
          .from(applicationTable)
          .where(eq(applicationTable.id, app.id));

        expect(updated?.status).toBe("withdrawn");
      });

      it("should throw BAD_REQUEST if application is already withdrawn", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        // Withdraw first time
        await candidateCaller.withdraw({
          id: app.id,
        });

        // Try to withdraw again
        await expect(
          candidateCaller.withdraw({
            id: app.id,
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          candidateCaller.withdraw({
            id: app.id,
          })
        ).rejects.toMatchObject({
          code: "BAD_REQUEST",
          message: "Application is already withdrawn",
        });
      });

      it("should throw BAD_REQUEST if application is already accepted", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        // Update status to accepted as recruiter
        const appCaller = applicationRouter.createCaller(recruiterCtx);
        await appCaller.updateStatus({
          id: app.id,
          status: "accepted",
        });

        // Try to withdraw
        await expect(
          candidateCaller.withdraw({
            id: app.id,
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          candidateCaller.withdraw({
            id: app.id,
          })
        ).rejects.toMatchObject({
          code: "BAD_REQUEST",
          message: "Cannot withdraw an accepted or rejected application",
        });
      });

      it("should throw BAD_REQUEST if application is already rejected", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        // Update status to rejected as recruiter
        const appCaller = applicationRouter.createCaller(recruiterCtx);
        await appCaller.updateStatus({
          id: app.id,
          status: "rejected",
        });

        // Try to withdraw
        await expect(
          candidateCaller.withdraw({
            id: app.id,
          })
        ).rejects.toThrow(TRPCError);

        await expect(
          candidateCaller.withdraw({
            id: app.id,
          })
        ).rejects.toMatchObject({
          code: "BAD_REQUEST",
          message: "Cannot withdraw an accepted or rejected application",
        });
      });

      it("should allow withdrawing from pending, reviewing, or shortlisted status", async () => {
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        // Test for each allowed status
        for (const status of ["pending", "reviewing", "shortlisted"] as const) {
          // Create opportunity
          const opp = await recruiterCaller.create({
            title: `Test Opportunity ${status}`,
            description: "This is a test opportunity",
            type: "internship",
            mode: "remote",
            category: "technology",
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            skills: ["JavaScript"],
          });

          await db
            .update(opportunityTable)
            .set({ status: "published" })
            .where(eq(opportunityTable.id, opp.id));

          // Create application
          const candidateCtx = createCandidateContext();
          const candidateCaller = applicationRouter.createCaller(candidateCtx);

          const app = await candidateCaller.create({
            opportunityId: opp.id,
            coverLetter: "Test cover letter with enough characters to pass validation requirements.",
          });

          // Update to target status if not pending
          if (status !== "pending") {
            const appCaller = applicationRouter.createCaller(recruiterCtx);
            await appCaller.updateStatus({
              id: app.id,
              status,
            });
          }

          // Withdraw should succeed
          const result = await candidateCaller.withdraw({
            id: app.id,
          });

          expect(result.status).toBe("withdrawn");
        }
      });

      it("should update the updatedAt timestamp", async () => {
        // Create opportunity
        const recruiterCtx = createRecruiterContext();
        const recruiterCaller = opportunityRouter.createCaller(recruiterCtx);

        const opp = await recruiterCaller.create({
          title: "Test Opportunity",
          description: "This is a test opportunity",
          type: "internship",
          mode: "remote",
          category: "technology",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          skills: ["JavaScript"],
        });

        await db
          .update(opportunityTable)
          .set({ status: "published" })
          .where(eq(opportunityTable.id, opp.id));

        // Create application
        const candidateCtx = createCandidateContext();
        const candidateCaller = applicationRouter.createCaller(candidateCtx);

        const app = await candidateCaller.create({
          opportunityId: opp.id,
          coverLetter: "Test cover letter with enough characters to pass validation requirements.",
        });

        const initialUpdatedAt = app.updatedAt;

        // Wait a bit to ensure different timestamp
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Withdraw application
        const result = await candidateCaller.withdraw({
          id: app.id,
        });

        expect(result.updatedAt.getTime()).toBeGreaterThan(
          initialUpdatedAt.getTime()
        );
      });
    });
  });
});
