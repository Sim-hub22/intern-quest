import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";

import { user } from "./auth";
import { opportunity } from "./opportunity";

export const quiz = pgTable(
  "quiz",
  {
    id: text("id").primaryKey(),
    opportunityId: text("opportunity_id")
      .notNull()
      .references(() => opportunity.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    durationMinutes: integer("duration_minutes").notNull(),
    passingScore: integer("passing_score").notNull(), // Minimum % to pass
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("quiz_opportunity_idx").on(table.opportunityId)],
);

export const quizQuestion = pgTable(
  "quiz_question",
  {
    id: text("id").primaryKey(),
    quizId: text("quiz_id")
      .notNull()
      .references(() => quiz.id, { onDelete: "cascade" }),
    questionText: text("question_text").notNull(),
    options: jsonb("options").notNull(), // Array of { label: string, value: string }
    correctAnswer: text("correct_answer").notNull(),
    points: integer("points").default(1).notNull(),
    order: integer("order").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("quiz_question_quiz_idx").on(table.quizId)],
);

export const quizAttempt = pgTable(
  "quiz_attempt",
  {
    id: text("id").primaryKey(),
    quizId: text("quiz_id")
      .notNull()
      .references(() => quiz.id, { onDelete: "cascade" }),
    candidateId: text("candidate_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    score: integer("score"), // Calculated score (%)
    passed: boolean("passed"), // Whether score >= passingScore
    tabSwitchCount: integer("tab_switch_count").default(0).notNull(),
    startedAt: timestamp("started_at").defaultNow().notNull(),
    submittedAt: timestamp("submitted_at"), // Null until submitted
  },
  (table) => [
    index("quiz_attempt_quiz_idx").on(table.quizId),
    index("quiz_attempt_candidate_idx").on(table.candidateId),
    unique("quiz_attempt_unique_constraint").on(table.quizId, table.candidateId),
  ],
);

export const quizAnswer = pgTable(
  "quiz_answer",
  {
    id: text("id").primaryKey(),
    attemptId: text("attempt_id")
      .notNull()
      .references(() => quizAttempt.id, { onDelete: "cascade" }),
    questionId: text("question_id")
      .notNull()
      .references(() => quizQuestion.id, { onDelete: "cascade" }),
    selectedAnswer: text("selected_answer"),
    isCorrect: boolean("is_correct"),
  },
  (table) => [index("quiz_answer_attempt_idx").on(table.attemptId)],
);

export const quizRelations = relations(quiz, ({ one, many }) => ({
  opportunity: one(opportunity, {
    fields: [quiz.opportunityId],
    references: [opportunity.id],
  }),
  questions: many(quizQuestion),
  attempts: many(quizAttempt),
}));

export const quizQuestionRelations = relations(quizQuestion, ({ one, many }) => ({
  quiz: one(quiz, {
    fields: [quizQuestion.quizId],
    references: [quiz.id],
  }),
  answers: many(quizAnswer),
}));

export const quizAttemptRelations = relations(quizAttempt, ({ one, many }) => ({
  quiz: one(quiz, {
    fields: [quizAttempt.quizId],
    references: [quiz.id],
  }),
  candidate: one(user, {
    fields: [quizAttempt.candidateId],
    references: [user.id],
  }),
  answers: many(quizAnswer),
}));

export const quizAnswerRelations = relations(quizAnswer, ({ one }) => ({
  attempt: one(quizAttempt, {
    fields: [quizAnswer.attemptId],
    references: [quizAttempt.id],
  }),
  question: one(quizQuestion, {
    fields: [quizAnswer.questionId],
    references: [quizQuestion.id],
  }),
}));
