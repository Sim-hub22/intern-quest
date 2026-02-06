"use client";

import { Clock, FileText, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctOption: number;
}

interface QuizCreationV2Props {
  onNavigateBack?: () => void;
}

export function QuizCreationV2({ onNavigateBack }: QuizCreationV2Props) {
  const [quizTitle, setQuizTitle] = useState("");
  const [timeLimit, setTimeLimit] = useState("30");
  const [attachToPosting, setAttachToPosting] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "",
      options: ["", "", "", ""],
      correctOption: 0,
    },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      question: "",
      options: ["", "", "", ""],
      correctOption: 0,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
    }
  };

  const updateQuestion = (id: number, field: string, value: string) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)),
    );
  };

  const updateOption = (
    questionId: number,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      }),
    );
  };

  const updateCorrectOption = (questionId: number, optionIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, correctOption: optionIndex } : q,
      ),
    );
  };

  const validateQuiz = () => {
    const newErrors: Record<string, string> = {};

    if (!quizTitle.trim()) {
      newErrors.quizTitle = "Quiz title is required";
    }

    if (!timeLimit || parseInt(timeLimit) <= 0) {
      newErrors.timeLimit = "Valid time limit is required";
    }

    questions.forEach((q, index) => {
      if (!q.question.trim()) {
        newErrors[`question_${index}`] = "Question is required";
      }
      if (q.options.some((opt) => !opt.trim())) {
        newErrors[`options_${index}`] = "All options must be filled";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateQuiz()) {
      console.log("Quiz created:", {
        quizTitle,
        timeLimit,
        attachToPosting,
        questions,
      });
      // Handle quiz creation
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onNavigateBack}
            className="text-blue-600 hover:text-blue-700 mb-4 text-sm"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-gray-900 mb-2">Create Assessment Quiz</h1>
          <p className="text-gray-600">
            Design a custom quiz to evaluate candidate skills
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Settings */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-gray-900 mb-6">Quiz Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="quizTitle"
                  className="block text-gray-700 text-sm mb-2"
                >
                  Quiz Title *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="quizTitle"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                    className={`w-full px-3 py-2 pl-10 border rounded-lg outline-none transition-colors ${
                      errors.quizTitle
                        ? "border-red-500"
                        : "border-gray-300 focus:border-blue-600"
                    }`}
                    placeholder="e.g. Frontend Development Assessment"
                  />
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.quizTitle && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.quizTitle}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="timeLimit"
                  className="block text-gray-700 text-sm mb-2"
                >
                  Time Limit (minutes) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="timeLimit"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    min="1"
                    className={`w-full px-3 py-2 pl-10 border rounded-lg outline-none transition-colors ${
                      errors.timeLimit
                        ? "border-red-500"
                        : "border-gray-300 focus:border-blue-600"
                    }`}
                    placeholder="30"
                  />
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                {errors.timeLimit && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.timeLimit}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="attachToPosting"
                  className="block text-gray-700 text-sm mb-2"
                >
                  Attach to Job Posting (Optional)
                </label>
                <select
                  id="attachToPosting"
                  value={attachToPosting}
                  onChange={(e) => setAttachToPosting(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
                >
                  <option value="">Select a posting</option>
                  <option value="1">Software Engineering Intern</option>
                  <option value="2">UI/UX Design Intern</option>
                  <option value="3">Data Science Intern</option>
                  <option value="4">Frontend Developer Intern</option>
                </select>
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900">Questions ({questions.length})</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>

            {questions.map((question, qIndex) => (
              <div
                key={question.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-gray-900">Question {qIndex + 1}</h3>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(question.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm mb-2">
                      Question Text *
                    </label>
                    <textarea
                      value={question.question}
                      onChange={(e) =>
                        updateQuestion(question.id, "question", e.target.value)
                      }
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg outline-none transition-colors resize-none ${
                        errors[`question_${qIndex}`]
                          ? "border-red-500"
                          : "border-gray-300 focus:border-blue-600"
                      }`}
                      placeholder="Enter your question here..."
                    />
                    {errors[`question_${qIndex}`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`question_${qIndex}`]}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm mb-2">
                      Options (Select the correct answer) *
                    </label>
                    <div className="space-y-3">
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-3">
                          <input
                            type="radio"
                            id={`q${question.id}_opt${optIndex}`}
                            name={`question_${question.id}`}
                            checked={question.correctOption === optIndex}
                            onChange={() =>
                              updateCorrectOption(question.id, optIndex)
                            }
                            className="w-4 h-4 text-blue-600"
                          />
                          <label
                            htmlFor={`q${question.id}_opt${optIndex}`}
                            className="flex-1"
                          >
                            <input
                              type="text"
                              value={option}
                              onChange={(e) =>
                                updateOption(
                                  question.id,
                                  optIndex,
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-600 transition-colors"
                              placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors[`options_${qIndex}`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`options_${qIndex}`]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <button
              type="button"
              onClick={onNavigateBack}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Create Quiz
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
