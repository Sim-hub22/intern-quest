import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { describe, expect, it, beforeEach } from "vitest";

import type { Context } from "../../context";

import { quizRouter } from "../quiz";
import { opportunityRouter } from "../opportunity";
import { resetTestDatabase } from "@/test/db-utils";
import { db } from "@/server/db";
import { quiz, quizQuestion } from "@/server/db/schema/quiz";
import { opportunity } from "@/server/db/schema/opportunity";

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

// Helper to create test opportunity
async function createTestOpportunity(recruiterId = "recruiter-1") {
  const recruiterCtx = createRecruiterContext(recruiterId);
  const opportunityCaller = opportunityRouter.createCaller(recruiterCtx);

  return await opportunityCaller.create({
    title: "Test Internship for Quiz",
    description: "This is a test internship opportunity for quiz testing",
    type: "internship",
    mode: "remote",
    category: "technology",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    skills: ["JavaScript", "TypeScript"],
    positions: 5,
  });
}

// Valid quiz data for testing
const validQuizData = {
  opportunityId: "", // Will be set in tests
  title: "JavaScript Fundamentals Quiz",
  description: "Test your knowledge of JavaScript basics",
  durationMinutes: 30,
  passingScore: 70,
  questions: [
    {
      questionText: "What is the output of typeof null?",
      options: [
        { label: "object", value: "object" },
        { label: "null", value: "null" },
        { label: "undefined", value: "undefined" },
      ],
      correctAnswer: "object",
      points: 1,
    },
    {
      questionText: "Which keyword is used to declare a block-scoped variable?",
      options: [
        { label: "var", value: "var" },
        { label: "let", value: "let" },
        { label: "const", value: "const" },
      ],
      correctAnswer: "let",
      points: 1,
    },
  ],
};

describe("quizRouter", () => {
  beforeEach(async () => {
    // Reset test database before each test
    await resetTestDatabase();
  });

  describe("create", () => {
    describe("authorization", () => {
      it("should throw UNAUTHORIZED if user is not authenticated", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = quizRouter.createCaller(ctx);

        await expect(caller.create(validQuizData)).rejects.toThrow(TRPCError);
        await expect(caller.create(validQuizData)).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should throw FORBIDDEN if user is not a recruiter", async () => {
        const ctx = createCandidateContext();
        const caller = quizRouter.createCaller(ctx);

        await expect(caller.create(validQuizData)).rejects.toThrow(TRPCError);
        await expect(caller.create(validQuizData)).rejects.toMatchObject({
          code: "FORBIDDEN",
        });
      });
    });

    describe("validation", () => {
      it("should reject invalid opportunityId", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        await expect(
          caller.create({ ...validQuizData, opportunityId: "" })
        ).rejects.toThrow();
      });

      it("should reject title shorter than 5 characters", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        // Create a test opportunity
        const opp = await createTestOpportunity("recruiter-1");

        await expect(
          caller.create({
            ...validQuizData,
            opportunityId: opp.id,
            title: "Quiz",
          })
        ).rejects.toThrow();
      });

      it("should reject invalid durationMinutes", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        // Create a test opportunity
        const opp = await createTestOpportunity("recruiter-1");

        await expect(
          caller.create({
            ...validQuizData,
            opportunityId: opp.id,
            durationMinutes: 0,
          })
        ).rejects.toThrow();
      });

      it("should reject passingScore outside 0-100 range", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        // Create a test opportunity
        const opp = await createTestOpportunity("recruiter-1");

        await expect(
          caller.create({
            ...validQuizData,
            opportunityId: opp.id,
            passingScore: 101,
          })
        ).rejects.toThrow();
      });

      it("should reject quiz with no questions", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        // Create a test opportunity
        const opp = await createTestOpportunity("recruiter-1");

        await expect(
          caller.create({
            ...validQuizData,
            opportunityId: opp.id,
            questions: [],
          })
        ).rejects.toThrow();
      });
    });

    describe("business logic", () => {
      it("should throw NOT_FOUND if opportunity does not exist", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        await expect(
          caller.create({ ...validQuizData, opportunityId: "non-existent" })
        ).rejects.toThrow(TRPCError);
        await expect(
          caller.create({ ...validQuizData, opportunityId: "non-existent" })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      });

      it("should throw FORBIDDEN if trying to create quiz for another recruiter's opportunity", async () => {
        const ctx = createRecruiterContext("recruiter-1");
        const caller = quizRouter.createCaller(ctx);

        // Create an opportunity owned by recruiter-2
        const opp = await createTestOpportunity("recruiter-2");

        await expect(
          caller.create({ ...validQuizData, opportunityId: opp.id })
        ).rejects.toThrow(TRPCError);
        await expect(
          caller.create({ ...validQuizData, opportunityId: opp.id })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
        });
      });

      it("should throw CONFLICT if quiz already exists for opportunity", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        // Create a test opportunity
        const opp = await createTestOpportunity("recruiter-1");

        // Create first quiz
        await caller.create({ ...validQuizData, opportunityId: opp.id });

        // Try to create second quiz for same opportunity
        await expect(
          caller.create({ ...validQuizData, opportunityId: opp.id })
        ).rejects.toThrow(TRPCError);
        await expect(
          caller.create({ ...validQuizData, opportunityId: opp.id })
        ).rejects.toMatchObject({
          code: "CONFLICT",
          message: "Quiz already exists for this opportunity",
        });
      });
    });

    describe("success cases", () => {
      it("should create quiz with questions", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        // Create a test opportunity
        const opp = await createTestOpportunity("recruiter-1");

        const result = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        expect(result).toMatchObject({
          id: expect.any(String),
          opportunityId: opp.id,
          title: validQuizData.title,
          description: validQuizData.description,
          durationMinutes: validQuizData.durationMinutes,
          passingScore: validQuizData.passingScore,
          isActive: true,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });

        // Verify quiz was created in database
        const [createdQuiz] = await db
          .select()
          .from(quiz)
          .where(eq(quiz.id, result.id));

        expect(createdQuiz).toBeDefined();
        expect(createdQuiz!.title).toBe(validQuizData.title);
      });

      it("should create quiz questions with correct order", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        // Create a test opportunity
        const opp = await createTestOpportunity("recruiter-1");

        const result = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        // Verify questions were created
        const questions = await db
          .select()
          .from(quizQuestion)
          .where(eq(quizQuestion.quizId, result.id));

        expect(questions).toHaveLength(2);
        expect(questions[0]!.order).toBe(0);
        expect(questions[1]!.order).toBe(1);
        expect(questions[0]!.questionText).toBe(
          validQuizData.questions[0]!.questionText
        );
      });

      it("should store question options as JSONB", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        // Create a test opportunity
        const opp = await createTestOpportunity("recruiter-1");

        const result = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        // Verify question options
        const [question] = await db
          .select()
          .from(quizQuestion)
          .where(eq(quizQuestion.quizId, result.id))
          .limit(1);

        expect(question!.options).toEqual(validQuizData.questions[0]!.options);
      });

      it("should set default isActive to true", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        // Create a test opportunity
        const opp = await createTestOpportunity("recruiter-1");

        const result = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        expect(result.isActive).toBe(true);
      });

      it("should allow quiz without description", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        // Create a test opportunity
        const opp = await createTestOpportunity("recruiter-1");

        const result = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
          description: undefined,
        });

        expect(result.description).toBeNull();
      });

      it("should assign custom points to questions", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        // Create a test opportunity
        const opp = await createTestOpportunity("recruiter-1");

        const customQuizData = {
          ...validQuizData,
          opportunityId: opp.id,
          questions: [
            { ...validQuizData.questions[0]!, points: 5 },
            { ...validQuizData.questions[1]!, points: 10 },
          ],
        };

        const result = await caller.create(customQuizData);

        const questions = await db
          .select()
          .from(quizQuestion)
          .where(eq(quizQuestion.quizId, result.id));

        expect(questions[0]!.points).toBe(5);
        expect(questions[1]!.points).toBe(10);
      });
    });
  });

  describe("update", () => {
    describe("authorization", () => {
      it("should throw UNAUTHORIZED if user is not authenticated", async () => {
        const ctx = createUnauthenticatedContext();
        const caller = quizRouter.createCaller(ctx);

        await expect(
          caller.update({ id: "quiz-123", title: "Updated Title" })
        ).rejects.toThrow(TRPCError);
        await expect(
          caller.update({ id: "quiz-123", title: "Updated Title" })
        ).rejects.toMatchObject({
          code: "UNAUTHORIZED",
        });
      });

      it("should throw FORBIDDEN if user is not a recruiter", async () => {
        const ctx = createCandidateContext();
        const caller = quizRouter.createCaller(ctx);

        await expect(
          caller.update({ id: "quiz-123", title: "Updated Title" })
        ).rejects.toThrow(TRPCError);
        await expect(
          caller.update({ id: "quiz-123", title: "Updated Title" })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
        });
      });
    });

    describe("validation", () => {
      it("should reject invalid quiz ID", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        await expect(
          caller.update({ id: "", title: "Updated Title" })
        ).rejects.toThrow();
      });

      it("should reject title shorter than 5 characters", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        const opp = await createTestOpportunity("recruiter-1");
        const createdQuiz = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        await expect(
          caller.update({ id: createdQuiz.id, title: "Quiz" })
        ).rejects.toThrow();
      });

      it("should reject invalid durationMinutes", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        const opp = await createTestOpportunity("recruiter-1");
        const createdQuiz = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        await expect(
          caller.update({ id: createdQuiz.id, durationMinutes: 0 })
        ).rejects.toThrow();
      });

      it("should reject passingScore outside 0-100 range", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        const opp = await createTestOpportunity("recruiter-1");
        const createdQuiz = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        await expect(
          caller.update({ id: createdQuiz.id, passingScore: 150 })
        ).rejects.toThrow();
      });
    });

    describe("business logic", () => {
      it("should throw NOT_FOUND if quiz does not exist", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        await expect(
          caller.update({ id: "non-existent-quiz", title: "Updated Title" })
        ).rejects.toThrow(TRPCError);
        await expect(
          caller.update({ id: "non-existent-quiz", title: "Updated Title" })
        ).rejects.toMatchObject({
          code: "NOT_FOUND",
          message: "Quiz not found",
        });
      });

      it("should throw FORBIDDEN if trying to update another recruiter's quiz", async () => {
        // Create quiz with recruiter-2
        const recruiter2Ctx = createRecruiterContext("recruiter-2");
        const recruiter2Caller = quizRouter.createCaller(recruiter2Ctx);
        const opp = await createTestOpportunity("recruiter-2");
        const createdQuiz = await recruiter2Caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        // Try to update with recruiter-1
        const recruiter1Ctx = createRecruiterContext("recruiter-1");
        const recruiter1Caller = quizRouter.createCaller(recruiter1Ctx);

        await expect(
          recruiter1Caller.update({
            id: createdQuiz.id,
            title: "Hacked Title",
          })
        ).rejects.toThrow(TRPCError);
        await expect(
          recruiter1Caller.update({
            id: createdQuiz.id,
            title: "Hacked Title",
          })
        ).rejects.toMatchObject({
          code: "FORBIDDEN",
          message: "Not your quiz",
        });
      });
    });

    describe("success cases", () => {
      it("should update quiz title", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        const opp = await createTestOpportunity("recruiter-1");
        const createdQuiz = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        const updatedQuiz = await caller.update({
          id: createdQuiz.id,
          title: "Updated JavaScript Quiz",
        });

        expect(updatedQuiz.title).toBe("Updated JavaScript Quiz");
        expect(updatedQuiz.id).toBe(createdQuiz.id);
      });

      it("should update quiz description", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        const opp = await createTestOpportunity("recruiter-1");
        const createdQuiz = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        const updatedQuiz = await caller.update({
          id: createdQuiz.id,
          description: "Updated description for the quiz",
        });

        expect(updatedQuiz.description).toBe("Updated description for the quiz");
      });

      it("should update durationMinutes", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        const opp = await createTestOpportunity("recruiter-1");
        const createdQuiz = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        const updatedQuiz = await caller.update({
          id: createdQuiz.id,
          durationMinutes: 45,
        });

        expect(updatedQuiz.durationMinutes).toBe(45);
      });

      it("should update passingScore", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        const opp = await createTestOpportunity("recruiter-1");
        const createdQuiz = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        const updatedQuiz = await caller.update({
          id: createdQuiz.id,
          passingScore: 80,
        });

        expect(updatedQuiz.passingScore).toBe(80);
      });

      it("should update isActive", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        const opp = await createTestOpportunity("recruiter-1");
        const createdQuiz = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        const updatedQuiz = await caller.update({
          id: createdQuiz.id,
          isActive: false,
        });

        expect(updatedQuiz.isActive).toBe(false);
      });

      it("should update multiple fields at once", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        const opp = await createTestOpportunity("recruiter-1");
        const createdQuiz = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        const updatedQuiz = await caller.update({
          id: createdQuiz.id,
          title: "Completely New Quiz Title",
          description: "Brand new description",
          durationMinutes: 60,
          passingScore: 85,
          isActive: false,
        });

        expect(updatedQuiz.title).toBe("Completely New Quiz Title");
        expect(updatedQuiz.description).toBe("Brand new description");
        expect(updatedQuiz.durationMinutes).toBe(60);
        expect(updatedQuiz.passingScore).toBe(85);
        expect(updatedQuiz.isActive).toBe(false);
      });

      it("should persist updates to database", async () => {
        const ctx = createRecruiterContext();
        const caller = quizRouter.createCaller(ctx);

        const opp = await createTestOpportunity("recruiter-1");
        const createdQuiz = await caller.create({
          ...validQuizData,
          opportunityId: opp.id,
        });

        await caller.update({
          id: createdQuiz.id,
          title: "Persisted Title",
        });

        // Verify from database
        const [dbQuiz] = await db
          .select()
          .from(quiz)
          .where(eq(quiz.id, createdQuiz.id));

        expect(dbQuiz!.title).toBe("Persisted Title");
      });
    });
  });
});
