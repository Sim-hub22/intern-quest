import { TRPCError } from "@trpc/server";
import { eq, asc, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db";
import { quiz, quizQuestion, quizAttempt, quizAnswer } from "@/server/db/schema/quiz";
import { opportunity } from "@/server/db/schema/opportunity";
import { 
  createQuizSchema, 
  updateQuizSchema,
  getQuizByOpportunitySchema,
  startQuizAttemptSchema,
  submitQuizAttemptSchema,
  getAttemptResultSchema,
} from "@/validations/quiz-schema";
import { recruiterProcedure, protectedProcedure, candidateProcedure, router } from "../index";

// Helper functions to generate unique IDs
function generateQuizId(): string {
  return `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function generateQuestionId(): string {
  return `ques-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function generateAttemptId(): string {
  return `attempt-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function generateAnswerId(): string {
  return `answer-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export const quizRouter = router({
  create: recruiterProcedure
    .input(createQuizSchema)
    .mutation(async ({ ctx, input }) => {
      // 1. Verify opportunity exists and belongs to recruiter
      const [opp] = await db
        .select()
        .from(opportunity)
        .where(eq(opportunity.id, input.opportunityId));

      if (!opp) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Opportunity not found",
        });
      }

      if (opp.recruiterId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not your opportunity",
        });
      }

      // 2. Check for existing quiz
      const [existingQuiz] = await db
        .select()
        .from(quiz)
        .where(eq(quiz.opportunityId, input.opportunityId));

      if (existingQuiz) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Quiz already exists for this opportunity",
        });
      }

      // 3. Create quiz
      const quizId = generateQuizId();
      const [createdQuiz] = await db
        .insert(quiz)
        .values({
          id: quizId,
          opportunityId: input.opportunityId,
          title: input.title,
          description: input.description || null,
          durationMinutes: input.durationMinutes,
          passingScore: input.passingScore,
          isActive: true,
        })
        .returning();

      // 4. Create questions with order
      await db.insert(quizQuestion).values(
        input.questions.map((q, index) => ({
          id: generateQuestionId(),
          quizId: quizId,
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
          points: q.points || 1,
          order: index,
        }))
      );

      return createdQuiz!;
    }),

  update: recruiterProcedure
    .input(
      z.object({
        id: z.string().check(z.minLength(1, "This field is required")),
      }).and(updateQuizSchema)
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // 1. Get quiz and verify ownership
      const [existingQuiz] = await db
        .select({ id: quiz.id, opportunityId: quiz.opportunityId })
        .from(quiz)
        .where(eq(quiz.id, id));

      if (!existingQuiz) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found",
        });
      }

      // 2. Verify opportunity ownership
      const [opp] = await db
        .select({ recruiterId: opportunity.recruiterId })
        .from(opportunity)
        .where(eq(opportunity.id, existingQuiz.opportunityId));

      if (!opp || opp.recruiterId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not your quiz",
        });
      }

      // 3. Update quiz
      const updateFields: Record<string, unknown> = {};
      
      // Handle each field from updateData
      if (updateData.title !== undefined) updateFields.title = updateData.title;
      if (updateData.description !== undefined) {
        updateFields.description = updateData.description || null;
      }
      if (updateData.durationMinutes !== undefined) {
        updateFields.durationMinutes = updateData.durationMinutes;
      }
      if (updateData.passingScore !== undefined) {
        updateFields.passingScore = updateData.passingScore;
      }
      if (updateData.isActive !== undefined) {
        updateFields.isActive = updateData.isActive;
      }

      const [updatedQuiz] = await db
        .update(quiz)
        .set(updateFields)
        .where(eq(quiz.id, id))
        .returning();

      return updatedQuiz!;
    }),

  getByOpportunity: protectedProcedure
    .input(getQuizByOpportunitySchema)
    .query(async ({ input }) => {
      // 1. Get quiz by opportunity
      const [quizRecord] = await db
        .select()
        .from(quiz)
        .where(eq(quiz.opportunityId, input.opportunityId));

      if (!quizRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found for this opportunity",
        });
      }

      // 2. Get questions ordered by order field
      const questions = await db
        .select()
        .from(quizQuestion)
        .where(eq(quizQuestion.quizId, quizRecord.id))
        .orderBy(asc(quizQuestion.order));

      // 3. Return quiz with questions
      return {
        ...quizRecord,
        questions,
      };
    }),

  getForAttempt: candidateProcedure
    .input(startQuizAttemptSchema)
    .query(async ({ ctx, input }) => {
      // 1. Get quiz
      const [quizRecord] = await db
        .select()
        .from(quiz)
        .where(eq(quiz.id, input.quizId));

      if (!quizRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found",
        });
      }

      // 2. Check if quiz is active
      if (!quizRecord.isActive) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Quiz is not active",
        });
      }

      // 3. Check for existing attempt
      const [existingAttempt] = await db
        .select()
        .from(quizAttempt)
        .where(
          and(
            eq(quizAttempt.quizId, input.quizId),
            eq(quizAttempt.candidateId, ctx.session.user.id)
          )
        );

      let attempt;
      if (existingAttempt) {
        attempt = existingAttempt;
      } else {
        // 4. Create new attempt
        const [newAttempt] = await db
          .insert(quizAttempt)
          .values({
            id: generateAttemptId(),
            quizId: input.quizId,
            candidateId: ctx.session.user.id,
            score: null,
            passed: null,
            tabSwitchCount: 0,
          })
          .returning();
        attempt = newAttempt!;
      }

      // 5. Get questions WITHOUT correct answers
      const questions = await db
        .select({
          id: quizQuestion.id,
          quizId: quizQuestion.quizId,
          questionText: quizQuestion.questionText,
          options: quizQuestion.options,
          points: quizQuestion.points,
          order: quizQuestion.order,
        })
        .from(quizQuestion)
        .where(eq(quizQuestion.quizId, input.quizId))
        .orderBy(asc(quizQuestion.order));

      // 6. Return quiz and attempt
      return {
        quiz: {
          ...quizRecord,
          questions,
        },
        attempt,
      };
    }),

  submitAttempt: candidateProcedure
    .input(submitQuizAttemptSchema)
    .mutation(async ({ ctx, input }) => {
      // 1. Get attempt and verify ownership
      const [attempt] = await db
        .select()
        .from(quizAttempt)
        .where(eq(quizAttempt.id, input.attemptId));

      if (!attempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz attempt not found",
        });
      }

      if (attempt.candidateId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Not your attempt",
        });
      }

      // 2. Check if already submitted
      if (attempt.submittedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Quiz already submitted",
        });
      }

      // 3. Get quiz to access passing score
      const [quizRecord] = await db
        .select()
        .from(quiz)
        .where(eq(quiz.id, attempt.quizId));

      if (!quizRecord) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found",
        });
      }

      // 4. Get all questions with correct answers
      const questions = await db
        .select()
        .from(quizQuestion)
        .where(eq(quizQuestion.quizId, attempt.quizId));

      // 5. Grade answers
      let totalPoints = 0;
      let earnedPoints = 0;

      const answerRecords = input.answers.map((answer) => {
        const question = questions.find((q) => q.id === answer.questionId);
        if (!question) {
          return null;
        }

        totalPoints += question.points;
        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        if (isCorrect) {
          earnedPoints += question.points;
        }

        return {
          id: generateAnswerId(),
          attemptId: input.attemptId,
          questionId: answer.questionId,
          selectedAnswer: answer.selectedAnswer,
          isCorrect,
        };
      });

      // 6. Calculate score percentage
      const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
      const passed = score >= quizRecord.passingScore;

      // 7. Update attempt with results
      const [updatedAttempt] = await db
        .update(quizAttempt)
        .set({
          score,
          passed,
          submittedAt: new Date(),
        })
        .where(eq(quizAttempt.id, input.attemptId))
        .returning();

      // 8. Save answer records
      const validAnswers = answerRecords.filter((a) => a !== null);
      if (validAnswers.length > 0) {
        await db.insert(quizAnswer).values(validAnswers);
      }

      return updatedAttempt!;
    }),

  getAttemptResult: protectedProcedure
    .input(getAttemptResultSchema)
    .query(async ({ ctx, input }) => {
      // 1. Find the attempt
      const [attempt] = await db
        .select()
        .from(quizAttempt)
        .where(eq(quizAttempt.id, input.attemptId));

      if (!attempt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Attempt not found",
        });
      }

      // 2. Verify permission to view
      // Candidates can only view their own attempts
      // Recruiters can view attempts for quizzes they own
      const isCandidate = ctx.session.user.role === "candidate";
      const isRecruiter = ctx.session.user.role === "recruiter";

      if (isCandidate && attempt.candidateId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to view this attempt",
        });
      }

      if (isRecruiter) {
        // Check if recruiter owns the quiz
        const [quizRecord] = await db
          .select({ recruiterId: opportunity.recruiterId })
          .from(quiz)
          .innerJoin(opportunity, eq(quiz.opportunityId, opportunity.id))
          .where(eq(quiz.id, attempt.quizId));

        if (!quizRecord || quizRecord.recruiterId !== ctx.session.user.id) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to view this attempt",
          });
        }
      }

      // 3. Get all answers for this attempt
      const answers = await db
        .select()
        .from(quizAnswer)
        .where(eq(quizAnswer.attemptId, input.attemptId));

      // 4. Get all questions for this quiz
      const questions = await db
        .select()
        .from(quizQuestion)
        .where(eq(quizQuestion.quizId, attempt.quizId))
        .orderBy(asc(quizQuestion.order));

      return {
        attempt,
        answers,
        questions,
      };
    }),
});
