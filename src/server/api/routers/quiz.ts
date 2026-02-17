import { TRPCError } from "@trpc/server";
import { eq, asc, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/server/db";
import { quiz, quizQuestion, quizAttempt } from "@/server/db/schema/quiz";
import { opportunity } from "@/server/db/schema/opportunity";
import { 
  createQuizSchema, 
  updateQuizSchema,
  getQuizByOpportunitySchema,
  startQuizAttemptSchema,
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
});
