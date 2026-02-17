import z from "zod";

const questionOptionSchema = z.object({
  label: z.string().check(z.minLength(1, "Option label is required")),
  value: z.string().check(z.minLength(1, "Option value is required")),
});

const quizQuestionSchema = z.object({
  questionText: z.string().check(z.minLength(1, "This field is required")),
  options: z
    .array(questionOptionSchema)
    .check(z.minLength(2, "Question must have at least 2 options"))
    .check(z.maxLength(6, "Question must have at most 6 options")),
  correctAnswer: z.string().check(z.minLength(1, "This field is required")),
  points: z.number().check(z.gte(1, "Points must be at least 1")).default(1),
});

export const createQuizSchema = z.object({
  opportunityId: z.string().check(z.minLength(1, "This field is required")),
  title: z
    .string()
    .check(z.minLength(1, "This field is required"))
    .check(z.minLength(5, "Title must be at least 5 characters long"))
    .check(z.trim()),
  description: z.string().or(z.undefined()),
  durationMinutes: z
    .number()
    .check(z.gte(1, "Duration must be at least 1 minute"))
    .check(z.lte(180, "Duration must be at most 180 minutes")),
  passingScore: z.number().check(z.gte(0)).check(z.lte(100)),
  questions: z
    .array(quizQuestionSchema)
    .check(z.minLength(1, "Quiz must have at least 1 question"))
    .check(z.maxLength(50, "Quiz must have at most 50 questions")),
});

export const updateQuizSchema = createQuizSchema
  .omit({ opportunityId: true })
  .partial();

const quizAnswerSchema = z.object({
  questionId: z.string().check(z.minLength(1, "This field is required")),
  selectedAnswer: z.string(), // Can be empty for skipped questions
});

export const submitQuizAttemptSchema = z.object({
  attemptId: z.string().check(z.minLength(1, "This field is required")),
  answers: z.array(quizAnswerSchema),
});

export const getQuizByOpportunitySchema = z.object({
  opportunityId: z.string().check(z.minLength(1, "This field is required")),
});

export const startQuizAttemptSchema = z.object({
  quizId: z.string().check(z.minLength(1, "This field is required")),
});

export const getAttemptResultSchema = z.object({
  attemptId: z.string().check(z.minLength(1, "This field is required")),
});

export const listQuizAttemptsSchema = z.object({
  quizId: z.string().check(z.minLength(1, "This field is required")),
  limit: z.number().check(z.gte(1)).check(z.lte(100)).default(50),
  offset: z.number().check(z.gte(0)).default(0),
});
