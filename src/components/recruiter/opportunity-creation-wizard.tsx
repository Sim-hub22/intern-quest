"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  FileText,
  MapPin,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";

interface OpportunityCreationWizardProps {
  onNavigateBack: () => void;
}

type QuizMode = "none" | "new";
type QuestionType = "multiple-choice" | "true-false" | "short-answer";

interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  points: number;
}

interface ExistingQuiz {
  id: string;
  title: string;
  questionCount: number;
  duration: number;
  difficulty: string;
  assignedCount: number;
}

export function OpportunityCreationWizard({
  onNavigateBack,
}: OpportunityCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Opportunity Details
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [locationType, setLocationType] = useState("on-site");
  const [duration, setDuration] = useState("");
  const [stipend, setStipend] = useState("");
  const [positions, setPositions] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // Step 2: Assessment Configuration
  const [quizMode, setQuizMode] = useState<QuizMode>("none");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDuration, setQuizDuration] = useState("30");
  const [passingScore, setPassingScore] = useState("70");
  const [questions, setQuestions] = useState<Question[]>([]);

  const steps = [
    { number: 1, title: "Opportunity Details", icon: Briefcase },
    { number: 2, title: "Assessment Setup", icon: FileText },
    { number: 3, title: "Review & Publish", icon: Eye },
  ];

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 1,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    );
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestionOption = (
    questionId: string,
    optionIndex: number,
    value: string,
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      }),
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return title && company && location && duration && description;
      case 2:
        if (quizMode === "new") return quizTitle && questions.length >= 3;
        return true; // Can skip quiz
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = () => {
    // Here you would submit the data to your backend
    console.log("Publishing opportunity with:", {
      opportunity: {
        title,
        company,
        location,
        locationType,
        duration,
        stipend,
        positions,
        startDate,
        description,
        requirements,
        responsibilities,
        skills,
      },
      quiz:
        quizMode === "new"
          ? {
              mode: "new",
              title: quizTitle,
              duration: quizDuration,
              passingScore,
              questions,
            }
          : { mode: "none" },
    });
    onNavigateBack();
  };

  const difficultyColors = {
    Beginner: "bg-green-100 text-green-700",
    Intermediate: "bg-yellow-100 text-yellow-700",
    Advanced: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-gray-900 mb-2">Create New Opportunity</h1>
          <p className="text-gray-600">
            Follow the steps to post your internship opportunity
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? "bg-green-600 border-green-600"
                          : isCurrent
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white border-gray-300"
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <StepIcon
                          className={`w-6 h-6 ${isCurrent ? "text-white" : "text-gray-400"}`}
                        />
                      )}
                    </div>
                    <p
                      className={`mt-2 text-sm font-medium ${
                        isCurrent ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-4 ${
                        isCompleted ? "bg-green-600" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
          {/* Step 1: Opportunity Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-900">Opportunity Details</h2>
                  <p className="text-gray-600 text-sm">
                    Basic information about the internship
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Software Engineering Intern"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Your company name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City, State/Country"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Type
                  </label>
                  <select
                    value={locationType}
                    onChange={(e) => setLocationType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  >
                    <option value="on-site">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g., 3 months, 6 weeks"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stipend
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={stipend}
                      onChange={(e) => setStipend(e.target.value)}
                      placeholder="e.g., $2000/month"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Positions
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      value={positions}
                      onChange={(e) => setPositions(e.target.value)}
                      min="1"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the internship opportunity..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requirements
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="List the requirements and qualifications..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsibilities
                </label>
                <textarea
                  value={responsibilities}
                  onChange={(e) => setResponsibilities(e.target.value)}
                  placeholder="Describe the key responsibilities..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addSkill())
                    }
                    placeholder="Add a skill and press Enter"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2 border border-blue-200"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-blue-900"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Assessment Setup */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-900">Assessment Setup</h2>
                  <p className="text-gray-600 text-sm">
                    Configure quiz for shortlisted candidates (optional)
                  </p>
                </div>
              </div>

              {/* Quiz Mode Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  How would you like to assess candidates?
                </label>

                {/* No Quiz Option */}
                <button
                  onClick={() => setQuizMode("none")}
                  className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
                    quizMode === "none"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          quizMode === "none"
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {quizMode === "none" && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          No Assessment
                        </p>
                        <p className="text-sm text-gray-600">
                          Skip quiz and proceed with manual evaluation
                        </p>
                      </div>
                    </div>
                  </div>
                </button>

                {/* New Quiz Option */}
                <button
                  onClick={() => setQuizMode("new")}
                  className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
                    quizMode === "new"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          quizMode === "new"
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {quizMode === "new" && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Create New Quiz
                        </p>
                        <p className="text-sm text-gray-600">
                          Design a custom assessment for this role
                        </p>
                      </div>
                    </div>
                    <Plus className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
              </div>

              {/* New Quiz Creation */}
              {quizMode === "new" && (
                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quiz Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        placeholder="e.g., Frontend Skills Test"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes)
                      </label>
                      <input
                        type="number"
                        value={quizDuration}
                        onChange={(e) => setQuizDuration(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Passing Score (%)
                      </label>
                      <input
                        type="number"
                        value={passingScore}
                        onChange={(e) => setPassingScore(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* Questions */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-900 font-semibold">
                        Questions ({questions.length})
                      </h3>
                      <button
                        onClick={addQuestion}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Question
                      </button>
                    </div>

                    {questions.length === 0 ? (
                      <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl text-center">
                        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-4">
                          No questions added yet
                        </p>
                        <button
                          onClick={addQuestion}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Your First Question
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {questions.map((question, index) => (
                          <div
                            key={question.id}
                            className="p-5 border-2 border-gray-200 rounded-xl"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="text-gray-900 font-medium">
                                Question {index + 1}
                              </h4>
                              <button
                                onClick={() => removeQuestion(question.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Question Type
                                </label>
                                <select
                                  value={question.type}
                                  onChange={(e) =>
                                    updateQuestion(question.id, {
                                      type: e.target.value as QuestionType,
                                    })
                                  }
                                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                >
                                  <option value="multiple-choice">
                                    Multiple Choice
                                  </option>
                                  <option value="true-false">True/False</option>
                                  <option value="short-answer">
                                    Short Answer
                                  </option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Question Text
                                </label>
                                <textarea
                                  value={question.question}
                                  onChange={(e) =>
                                    updateQuestion(question.id, {
                                      question: e.target.value,
                                    })
                                  }
                                  placeholder="Enter your question..."
                                  rows={2}
                                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                                />
                              </div>

                              {question.type === "multiple-choice" && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Answer Options
                                  </label>
                                  <div className="space-y-2">
                                    {question.options?.map(
                                      (option, optIndex) => (
                                        <div
                                          key={optIndex}
                                          className="flex gap-2"
                                        >
                                          <input
                                            type="radio"
                                            name={`correct-${question.id}`}
                                            checked={
                                              question.correctAnswer === option
                                            }
                                            onChange={() =>
                                              updateQuestion(question.id, {
                                                correctAnswer: option,
                                              })
                                            }
                                            className="mt-3 w-4 h-4 text-blue-600"
                                          />
                                          <input
                                            type="text"
                                            value={option}
                                            onChange={(e) =>
                                              updateQuestionOption(
                                                question.id,
                                                optIndex,
                                                e.target.value,
                                              )
                                            }
                                            placeholder={`Option ${optIndex + 1}`}
                                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                          />
                                        </div>
                                      ),
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-2">
                                    Select the correct answer by clicking the
                                    radio button
                                  </p>
                                </div>
                              )}

                              <div className="flex gap-4">
                                <div className="flex-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Points
                                  </label>
                                  <input
                                    type="number"
                                    value={question.points}
                                    onChange={(e) =>
                                      updateQuestion(question.id, {
                                        points: parseInt(e.target.value) || 1,
                                      })
                                    }
                                    min="1"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {questions.length > 0 && questions.length < 3 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-800">
                        Add at least 3 questions to create a valid quiz
                        (currently {questions.length})
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review & Publish */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-900">Review & Publish</h2>
                  <p className="text-gray-600 text-sm">
                    Review your opportunity before publishing
                  </p>
                </div>
              </div>

              {/* Opportunity Preview */}
              <div className="p-6 border-2 border-gray-200 rounded-xl">
                <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Opportunity Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <p className="text-gray-600 w-40">Position:</p>
                    <p className="text-gray-900 font-medium flex-1">
                      {title || "Not specified"}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-gray-600 w-40">Company:</p>
                    <p className="text-gray-900 flex-1">
                      {company || "Not specified"}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-gray-600 w-40">Location:</p>
                    <p className="text-gray-900 flex-1">
                      {location} ({locationType})
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-gray-600 w-40">Duration:</p>
                    <p className="text-gray-900 flex-1">{duration}</p>
                  </div>
                  {stipend && (
                    <div className="flex items-start gap-3">
                      <p className="text-gray-600 w-40">Stipend:</p>
                      <p className="text-gray-900 flex-1">{stipend}</p>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <p className="text-gray-600 w-40">Positions:</p>
                    <p className="text-gray-900 flex-1">{positions}</p>
                  </div>
                  {startDate && (
                    <div className="flex items-start gap-3">
                      <p className="text-gray-600 w-40">Start Date:</p>
                      <p className="text-gray-900 flex-1">{startDate}</p>
                    </div>
                  )}
                  {description && (
                    <div className="flex items-start gap-3">
                      <p className="text-gray-600 w-40">Description:</p>
                      <p className="text-gray-900 flex-1 whitespace-pre-wrap">
                        {description}
                      </p>
                    </div>
                  )}
                  {requirements && (
                    <div className="flex items-start gap-3">
                      <p className="text-gray-600 w-40">Requirements:</p>
                      <p className="text-gray-900 flex-1 whitespace-pre-wrap">
                        {requirements}
                      </p>
                    </div>
                  )}
                  {responsibilities && (
                    <div className="flex items-start gap-3">
                      <p className="text-gray-600 w-40">Responsibilities:</p>
                      <p className="text-gray-900 flex-1 whitespace-pre-wrap">
                        {responsibilities}
                      </p>
                    </div>
                  )}
                  {skills.length > 0 && (
                    <div className="flex items-start gap-3">
                      <p className="text-gray-600 w-40">Skills:</p>
                      <div className="flex-1 flex flex-wrap gap-2">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm border border-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Assessment Preview */}
              <div className="p-6 border-2 border-gray-200 rounded-xl">
                <h3 className="text-gray-900 font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Assessment Configuration
                </h3>
                {quizMode === "none" && (
                  <p className="text-gray-600">
                    No assessment configured for this opportunity
                  </p>
                )}
                {quizMode === "new" && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-gray-900 font-medium mb-2">
                      {quizTitle}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{questions.length} questions</span>
                      <span>•</span>
                      <span>{quizDuration} minutes</span>
                      <span>•</span>
                      <span>Passing score: {passingScore}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Success Message */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="text-gray-900 font-semibold mb-1">
                      Ready to Publish
                    </h4>
                    <p className="text-gray-700 text-sm mb-3">
                      Your opportunity is ready to be published. Shortlisted
                      candidates will{" "}
                      {quizMode === "none"
                        ? "be evaluated manually"
                        : "automatically receive the assessment quiz"}
                      .
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={currentStep === 1 ? onNavigateBack : handleBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 1 ? "Cancel" : "Back"}
          </button>

          <div className="flex items-center gap-3">
            {currentStep < 3 && (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {currentStep === 3 && (
              <button
                onClick={handlePublish}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md font-medium flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Publish Opportunity
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
