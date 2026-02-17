import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { db } from "@/server/db";
import { quiz, quizQuestion } from "@/server/db/schema/quiz";
import { opportunity } from "@/server/db/schema/opportunity";
import { createQuizSchema } from "@/validations/quiz-schema";
import { recruiterProcedure, router } from "../index";

// Helper functions to generate unique IDs
function generateQuizId(): string {
  return `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function generateQuestionId(): string {
  return `ques-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
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
});
