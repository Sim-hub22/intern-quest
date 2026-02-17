import { describe, expect, it } from "vitest";

import {
  createQuizSchema,
  submitQuizAttemptSchema,
  updateQuizSchema,
} from "../quiz-schema";

describe("createQuizSchema", () => {
  const validQuizData = {
    opportunityId: "opp_123456789",
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

  describe("success cases", () => {
    it("should validate a complete quiz with all fields", () => {
      const result = createQuizSchema.safeParse(validQuizData);
      expect(result.success).toBe(true);
    });

    it("should accept quiz without description", () => {
      const data = { ...validQuizData, description: undefined };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept minimum 1 question", () => {
      const data = { ...validQuizData, questions: [validQuizData.questions[0]!] };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept different point values for questions", () => {
      const data = {
        ...validQuizData,
        questions: [
          { ...validQuizData.questions[0]!, points: 5 },
          { ...validQuizData.questions[1]!, points: 10 },
        ],
      };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should trim whitespace from title", () => {
      const data = { ...validQuizData, title: "  My Quiz  " };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("My Quiz");
      }
    });

    it("should accept passingScore of 0%", () => {
      const data = { ...validQuizData, passingScore: 0 };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept passingScore of 100%", () => {
      const data = { ...validQuizData, passingScore: 100 };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("validation errors", () => {
    it("should reject empty opportunityId", () => {
      const data = { ...validQuizData, opportunityId: "" };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["opportunityId"]);
      }
    });

    it("should reject empty title", () => {
      const data = { ...validQuizData, title: "" };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["title"]);
      }
    });

    it("should reject title shorter than 5 characters", () => {
      const data = { ...validQuizData, title: "Quiz" };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["title"]);
        expect(result.error.issues[0]?.message).toContain("at least 5");
      }
    });

    it("should reject duration less than 1 minute", () => {
      const data = { ...validQuizData, durationMinutes: 0 };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["durationMinutes"]);
        expect(result.error.issues[0]?.message).toContain("at least 1");
      }
    });

    it("should reject duration greater than 180 minutes", () => {
      const data = { ...validQuizData, durationMinutes: 181 };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["durationMinutes"]);
        expect(result.error.issues[0]?.message).toContain("at most 180");
      }
    });

    it("should reject passingScore less than 0", () => {
      const data = { ...validQuizData, passingScore: -1 };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["passingScore"]);
      }
    });

    it("should reject passingScore greater than 100", () => {
      const data = { ...validQuizData, passingScore: 101 };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["passingScore"]);
      }
    });

    it("should reject quiz with no questions", () => {
      const data = { ...validQuizData, questions: [] };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["questions"]);
        expect(result.error.issues[0]?.message).toContain("at least 1");
      }
    });

    it("should reject quiz with more than 50 questions", () => {
      const data = {
        ...validQuizData,
        questions: Array(51).fill(validQuizData.questions[0]),
      };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["questions"]);
        expect(result.error.issues[0]?.message).toContain("at most 50");
      }
    });

    it("should reject question with empty questionText", () => {
      const data = {
        ...validQuizData,
        questions: [{ ...validQuizData.questions[0]!, questionText: "" }],
      };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path[0]).toBe("questions");
      }
    });

    it("should reject question with less than 2 options", () => {
      const data = {
        ...validQuizData,
        questions: [
          {
            ...validQuizData.questions[0]!,
            options: [{ label: "A", value: "a" }],
          },
        ],
      };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["questions", 0, "options"]);
        expect(result.error.issues[0]?.message).toContain("at least 2");
      }
    });

    it("should reject question with more than 6 options", () => {
      const data = {
        ...validQuizData,
        questions: [
          {
            ...validQuizData.questions[0]!,
            options: Array(7)
              .fill(null)
              .map((_, i) => ({ label: `Option ${i}`, value: `opt${i}` })),
          },
        ],
      };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["questions", 0, "options"]);
        expect(result.error.issues[0]?.message).toContain("at most 6");
      }
    });

    it("should reject question with negative points", () => {
      const data = {
        ...validQuizData,
        questions: [{ ...validQuizData.questions[0]!, points: -1 }],
      };
      const result = createQuizSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toEqual(["questions", 0, "points"]);
        expect(result.error.issues[0]?.message).toContain("at least 1");
      }
    });
  });
});

describe("updateQuizSchema", () => {
  it("should validate partial updates", () => {
    const result = updateQuizSchema.safeParse({ title: "New Quiz Title" });
    expect(result.success).toBe(true);
  });

  it("should validate empty object (no updates)", () => {
    const result = updateQuizSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should reject invalid title in partial update", () => {
    const result = updateQuizSchema.safeParse({ title: "abc" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["title"]);
      expect(result.error.issues[0]?.message).toContain("at least 5");
    }
  });
});

describe("submitQuizAttemptSchema", () => {
  const validSubmission = {
    attemptId: "attempt_123",
    answers: [
      { questionId: "q1", selectedAnswer: "option1" },
      { questionId: "q2", selectedAnswer: "option2" },
    ],
  };

  it("should validate complete submission", () => {
    const result = submitQuizAttemptSchema.safeParse(validSubmission);
    expect(result.success).toBe(true);
  });

  it("should accept empty answers array", () => {
    const data = { ...validSubmission, answers: [] };
    const result = submitQuizAttemptSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("should reject empty attemptId", () => {
    const data = { ...validSubmission, attemptId: "" };
    const result = submitQuizAttemptSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["attemptId"]);
    }
  });

  it("should reject answer with empty questionId", () => {
    const data = {
      ...validSubmission,
      answers: [{ questionId: "", selectedAnswer: "option1" }],
    };
    const result = submitQuizAttemptSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path[0]).toBe("answers");
    }
  });

  it("should accept answer with empty selectedAnswer (skipped question)", () => {
    const data = {
      ...validSubmission,
      answers: [{ questionId: "q1", selectedAnswer: "" }],
    };
    const result = submitQuizAttemptSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});
