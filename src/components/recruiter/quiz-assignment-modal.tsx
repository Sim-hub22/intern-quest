"use client";

import { Award, CheckCircle, Clock, FileText, Users, X } from "lucide-react";
import { useState } from "react";

interface QuizAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quizId: string, sendImmediately: boolean) => void;
  candidateCount: number;
  defaultQuizId?: string;
  opportunityTitle?: string;
}

export function QuizAssignmentModal({
  isOpen,
  onClose,
  onConfirm,
  candidateCount,
  defaultQuizId,
  opportunityTitle,
}: QuizAssignmentModalProps) {
  const [selectedQuizId, setSelectedQuizId] = useState(defaultQuizId || "");
  const [sendImmediately, setSendImmediately] = useState(true);

  // Mock quiz data - in real app, this would come from your quiz database
  const availableQuizzes = [
    {
      id: "1",
      title: "Frontend Development Assessment",
      questionCount: 20,
      duration: 45,
      difficulty: "Intermediate",
      assignedCount: 156,
    },
    {
      id: "2",
      title: "React & TypeScript Quiz",
      questionCount: 15,
      duration: 30,
      difficulty: "Advanced",
      assignedCount: 89,
    },
    {
      id: "3",
      title: "UI/UX Design Fundamentals",
      questionCount: 25,
      duration: 60,
      difficulty: "Beginner",
      assignedCount: 203,
    },
    {
      id: "4",
      title: "Data Structures & Algorithms",
      questionCount: 30,
      duration: 90,
      difficulty: "Advanced",
      assignedCount: 124,
    },
    {
      id: "5",
      title: "General Aptitude Test",
      questionCount: 40,
      duration: 60,
      difficulty: "Intermediate",
      assignedCount: 312,
    },
  ];

  const handleConfirm = () => {
    if (selectedQuizId) {
      onConfirm(selectedQuizId, sendImmediately);
      onClose();
    }
  };

  if (!isOpen) return null;

  const selectedQuiz = availableQuizzes.find((q) => q.id === selectedQuizId);

  const difficultyColors = {
    Beginner: "bg-green-100 text-green-700",
    Intermediate: "bg-yellow-100 text-yellow-700",
    Advanced: "bg-red-100 text-red-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">
                Assign Assessment Quiz
              </h2>
              <p className="text-blue-100 text-sm">
                Shortlisting {candidateCount} candidate
                {candidateCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {opportunityTitle && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Opportunity:</span>{" "}
                {opportunityTitle}
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-900 font-medium mb-3">
              Select Quiz to Assign
            </label>
            <div className="space-y-3">
              {availableQuizzes.map((quiz) => (
                <button
                  key={quiz.id}
                  onClick={() => setSelectedQuizId(quiz.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                    selectedQuizId === quiz.id
                      ? "border-blue-600 bg-blue-50 shadow-md"
                      : "border-gray-200 hover:border-blue-300 bg-white"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-semibold mb-1">
                        {quiz.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {quiz.questionCount} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {quiz.duration} mins
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {quiz.assignedCount} taken
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          difficultyColors[
                            quiz.difficulty as keyof typeof difficultyColors
                          ]
                        }`}
                      >
                        {quiz.difficulty}
                      </span>
                      {selectedQuizId === quiz.id && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedQuiz && (
            <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl">
              <div className="flex items-start gap-3 mb-3">
                <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-gray-900 font-semibold mb-1">
                    Quiz Summary
                  </h4>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{selectedQuiz.title}</span>{" "}
                    will be assigned to{" "}
                    <span className="font-medium">{candidateCount}</span>{" "}
                    shortlisted candidate
                    {candidateCount !== 1 ? "s" : ""}.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Questions</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedQuiz.questionCount}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Duration</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedQuiz.duration} min
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Level</p>
                  <p className="text-gray-900 font-semibold">
                    {selectedQuiz.difficulty}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-900 font-medium mb-3">
              Notification Settings
            </label>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                <input
                  type="radio"
                  name="notification"
                  checked={sendImmediately}
                  onChange={() => setSendImmediately(true)}
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div>
                  <p className="text-gray-900 font-medium">Send Immediately</p>
                  <p className="text-sm text-gray-600">
                    Candidates will receive the quiz invitation right away via
                    email
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                <input
                  type="radio"
                  name="notification"
                  checked={!sendImmediately}
                  onChange={() => setSendImmediately(false)}
                  className="mt-1 w-4 h-4 text-blue-600"
                />
                <div>
                  <p className="text-gray-900 font-medium">
                    Schedule for Later
                  </p>
                  <p className="text-sm text-gray-600">
                    Assign quiz but send invitations manually later
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onConfirm("", false);
                onClose();
              }}
              className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Skip Quiz
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedQuizId}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Confirm & Assign Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
