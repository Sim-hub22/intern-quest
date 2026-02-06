"use client";

import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  Clock,
  Search,
} from "lucide-react";
import { useState } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  questions: QuizQuestion[];
  icon: string;
  duration: string;
}

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<"articles" | "quizzes">(
    "articles",
  );
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const articles = [
    {
      title: "How to Write a Winning Resume",
      description:
        "Learn the essential tips and tricks to create a resume that stands out from the crowd.",
      category: "Career Tips",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1634245482527-60ac666a8c9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXN1bWUlMjB3cml0aW5nJTIwdGlwc3xlbnwxfHx8fDE3NjQxNDM1MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      date: "Nov 20, 2025",
    },
    {
      title: "Interview Preparation Guide",
      description:
        "Master your next interview with these proven strategies and common question answers.",
      category: "Interview Skills",
      readTime: "8 min read",
      image:
        "https://images.unsplash.com/photo-1758520144417-e1c432042dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2IlMjBpbnRlcnZpZXclMjBwcmVwYXJhdGlvbnxlbnwxfHx8fDE3NjQwNTE3NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      date: "Nov 18, 2025",
    },
    {
      title: "Essential Skills for Tech Interns",
      description:
        "Discover the must-have technical and soft skills that will make you a successful intern.",
      category: "Skills",
      readTime: "6 min read",
      image:
        "https://images.unsplash.com/photo-1759884248009-92c5e957708e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbGVhcm5pbmclMjBjb2Rpbmd8ZW58MXx8fHwxNzY0MDIyNTkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      date: "Nov 15, 2025",
    },
    {
      title: "Networking Tips for Students",
      description:
        "Build meaningful professional connections that can help launch your career.",
      category: "Networking",
      readTime: "7 min read",
      image:
        "https://images.unsplash.com/photo-1762340277705-9e8522d0ebe7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMG5ldHdvcmtpbmd8ZW58MXx8fHwxNzY0MTQzNTM2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      date: "Nov 12, 2025",
    },
    {
      title: "Setting Career Goals",
      description:
        "A comprehensive guide to defining and achieving your professional aspirations.",
      category: "Career Planning",
      readTime: "10 min read",
      image:
        "https://images.unsplash.com/photo-1758876019673-704b039d405c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJlZXIlMjBzdWNjZXNzJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2NDA4NDA0OHww&ixlib=rb-4.1.0&q=80&w=1080",
      date: "Nov 10, 2025",
    },
    {
      title: "Remote Work Best Practices",
      description:
        "Learn how to excel in a remote internship and maintain productivity.",
      category: "Work Tips",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1739298061707-cefee19941b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjB0ZWFtJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NjQwNTA2MDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      date: "Nov 8, 2025",
    },
  ];

  const quizzes: Quiz[] = [
    {
      id: "1",
      title: "JavaScript Fundamentals",
      description:
        "Test your knowledge of JavaScript basics and core concepts.",
      category: "Programming",
      icon: "💻",
      duration: "10 min",
      questions: [
        {
          question: "What is the output of: typeof null?",
          options: ["null", "undefined", "object", "number"],
          correctAnswer: 2,
        },
        {
          question: "Which method adds an element to the end of an array?",
          options: ["push()", "pop()", "shift()", "unshift()"],
          correctAnswer: 0,
        },
        {
          question: 'What does "===" check for in JavaScript?',
          options: [
            "Value only",
            "Type only",
            "Both value and type",
            "Neither",
          ],
          correctAnswer: 2,
        },
        {
          question: "Which keyword is used to declare a constant variable?",
          options: ["var", "let", "const", "constant"],
          correctAnswer: 2,
        },
        {
          question: "What is a closure in JavaScript?",
          options: [
            "A function with no parameters",
            "A function that has access to outer function variables",
            "A built-in method",
            "A type of loop",
          ],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: "2",
      title: "Marketing Basics",
      description:
        "Evaluate your understanding of fundamental marketing principles.",
      category: "Marketing",
      icon: "📊",
      duration: "8 min",
      questions: [
        {
          question: "What does SEO stand for?",
          options: [
            "Search Engine Optimization",
            "Social Engagement Online",
            "Site Evaluation Order",
            "Search Entry Option",
          ],
          correctAnswer: 0,
        },
        {
          question: "What are the 4 Ps of marketing?",
          options: [
            "Product, Price, Place, Promotion",
            "People, Process, Performance, Profit",
            "Planning, Production, Publishing, Pricing",
            "Profit, Purpose, Position, Performance",
          ],
          correctAnswer: 0,
        },
        {
          question: "What is a target audience?",
          options: [
            "Everyone who uses the internet",
            "A specific group of consumers at which a company aims its marketing",
            "People who work in marketing",
            "All customers of a business",
          ],
          correctAnswer: 1,
        },
        {
          question: "What is brand positioning?",
          options: [
            "Where you place your logo",
            "How you position your products in stores",
            "How your brand is perceived relative to competitors",
            "Your company location",
          ],
          correctAnswer: 2,
        },
      ],
    },
    {
      id: "3",
      title: "Financial Literacy",
      description:
        "Assess your knowledge of basic finance and accounting concepts.",
      category: "Finance",
      icon: "💰",
      duration: "12 min",
      questions: [
        {
          question: "What does ROI stand for?",
          options: [
            "Return On Investment",
            "Rate Of Interest",
            "Revenue Over Income",
            "Risk Of Inflation",
          ],
          correctAnswer: 0,
        },
        {
          question: "What is compound interest?",
          options: [
            "Interest calculated on principal only",
            "Interest calculated on principal and accumulated interest",
            "A type of loan",
            "Simple interest multiplied by two",
          ],
          correctAnswer: 1,
        },
        {
          question: "What is a balance sheet?",
          options: [
            "A list of transactions",
            "A financial statement showing assets, liabilities, and equity",
            "A budget plan",
            "An income report",
          ],
          correctAnswer: 1,
        },
        {
          question: "What is diversification in investing?",
          options: [
            "Investing all money in one stock",
            "Spreading investments across different assets",
            "Buying only tech stocks",
            "Keeping all money in savings",
          ],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: "4",
      title: "UX Design Principles",
      description:
        "Check your understanding of user experience design fundamentals.",
      category: "Design",
      icon: "🎨",
      duration: "10 min",
      questions: [
        {
          question: "What does UX stand for?",
          options: [
            "User Experience",
            "Universal Export",
            "Unique Extension",
            "User Exchange",
          ],
          correctAnswer: 0,
        },
        {
          question: "What is a wireframe?",
          options: [
            "A type of cable",
            "A low-fidelity visual representation of a design",
            "A coding framework",
            "A testing tool",
          ],
          correctAnswer: 1,
        },
        {
          question: "What is the purpose of A/B testing?",
          options: [
            "Testing two versions to see which performs better",
            "Grading system for designs",
            "Testing alphabetical order",
            "Testing typography",
          ],
          correctAnswer: 0,
        },
        {
          question: "What is user empathy in UX design?",
          options: [
            "Feeling sorry for users",
            "Understanding user needs and perspectives",
            "Making designs emotional",
            "Creating sympathy messages",
          ],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: "5",
      title: "Business Communication",
      description:
        "Test your professional communication and soft skills knowledge.",
      category: "Business",
      icon: "💼",
      duration: "8 min",
      questions: [
        {
          question: "What is active listening?",
          options: [
            "Listening while exercising",
            "Fully concentrating and responding to what is being said",
            "Listening to music",
            "Talking while listening",
          ],
          correctAnswer: 1,
        },
        {
          question: "What should you do in a professional email signature?",
          options: [
            "Include only your name",
            "Add emojis and GIFs",
            "Include name, title, and contact information",
            "Write a long paragraph",
          ],
          correctAnswer: 2,
        },
        {
          question: "What is elevator pitch?",
          options: [
            "A pitch made in an elevator",
            "A brief, persuasive speech about yourself or your idea",
            "A sales technique",
            "A type of presentation software",
          ],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: "6",
      title: "Data Analytics Basics",
      description: "Evaluate your understanding of data analysis fundamentals.",
      category: "Data",
      icon: "📈",
      duration: "10 min",
      questions: [
        {
          question: "What is data visualization?",
          options: [
            "Looking at raw data",
            "Graphical representation of data",
            "Data storage method",
            "A type of database",
          ],
          correctAnswer: 1,
        },
        {
          question: "What does mean, median, and mode represent?",
          options: [
            "Types of data",
            "Measures of central tendency",
            "Data collection methods",
            "Visualization techniques",
          ],
          correctAnswer: 1,
        },
        {
          question: "What is a correlation?",
          options: [
            "A causation between variables",
            "A relationship between two variables",
            "A type of chart",
            "A data error",
          ],
          correctAnswer: 1,
        },
        {
          question: "What is the purpose of data cleaning?",
          options: [
            "Deleting all data",
            "Removing or correcting inaccurate data",
            "Organizing files",
            "Backing up data",
          ],
          correctAnswer: 1,
        },
      ],
    },
  ];

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < (selectedQuiz?.questions.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    if (!selectedQuiz) return 0;
    let correct = 0;
    selectedQuiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return correct;
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-gray-900 mb-2">Learning Resources</h1>
          <p className="text-gray-600">
            Expand your knowledge and skills with articles and quizzes
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab("articles")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "articles"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Articles
              </div>
            </button>
            <button
              onClick={() => setActiveTab("quizzes")}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === "quizzes"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Interactive Quizzes
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "articles" && (
          <div>
            {/* Search Bar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8">
              <div className="flex items-center gap-3 px-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="flex-1 outline-none text-gray-900 placeholder-gray-400 py-2"
                />
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <article
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <ImageWithFallback
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </div>
                    </div>
                    <h3 className="text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">
                        {article.date}
                      </span>
                      <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
                        Read More
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {activeTab === "quizzes" && !selectedQuiz && (
          <div>
            <div className="mb-8">
              <h2 className="text-gray-900 mb-2">Test Your Knowledge</h2>
              <p className="text-gray-600">
                Take interactive quizzes to assess and improve your skills
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <div className="text-4xl mb-4">{quiz.icon}</div>
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs">
                    {quiz.category}
                  </span>
                  <h3 className="text-gray-900 mt-3 mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {quiz.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      {quiz.duration}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {quiz.questions.length} questions
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quiz Interface */}
        {activeTab === "quizzes" && selectedQuiz && !showResults && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-8">
              {/* Quiz Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-900">{selectedQuiz.title}</h2>
                  <button
                    onClick={() => setSelectedQuiz(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Exit
                  </button>
                </div>
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <span>
                    Question {currentQuestion + 1} of{" "}
                    {selectedQuiz.questions.length}
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{
                        width: `${((currentQuestion + 1) / selectedQuiz.questions.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h3 className="text-gray-900 mb-6">
                  {selectedQuiz.questions[currentQuestion].question}
                </h3>
                <div className="space-y-3">
                  {selectedQuiz.questions[currentQuestion].options.map(
                    (option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full p-4 text-left border-2 rounded-lg transition-all ${
                          selectedAnswers[currentQuestion] === index
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswers[currentQuestion] === index
                                ? "border-blue-600 bg-blue-600"
                                : "border-gray-300"
                            }`}
                          >
                            {selectedAnswers[currentQuestion] === index && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="text-gray-900">{option}</span>
                        </div>
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                {currentQuestion > 0 && (
                  <button
                    onClick={handlePreviousQuestion}
                    className="px-6 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
                <button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswers[currentQuestion] === undefined}
                  className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentQuestion < selectedQuiz.questions.length - 1
                    ? "Next Question"
                    : "Finish Quiz"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Results */}
        {activeTab === "quizzes" && selectedQuiz && showResults && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-gray-900 mb-2">Quiz Complete!</h2>
              <p className="text-gray-600 mb-8">Here are your results</p>

              {/* Score */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl p-8 mb-8 text-white">
                <div className="text-5xl mb-2">
                  {calculateScore()} / {selectedQuiz.questions.length}
                </div>
                <p className="text-white/90">Correct Answers</p>
                <div className="mt-4">
                  <div className="text-3xl">
                    {Math.round(
                      (calculateScore() / selectedQuiz.questions.length) * 100,
                    )}
                    %
                  </div>
                  <p className="text-white/90 text-sm">Score</p>
                </div>
              </div>

              {/* Performance Message */}
              <div className="mb-8">
                {calculateScore() / selectedQuiz.questions.length >= 0.8 ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-green-800">
                      Excellent work! You have a strong understanding of this
                      topic.
                    </p>
                  </div>
                ) : calculateScore() / selectedQuiz.questions.length >= 0.6 ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p className="text-blue-800">
                      Good job! Keep practicing to improve further.
                    </p>
                  </div>
                ) : (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <p className="text-orange-800">
                      Keep learning! Review the material and try again to
                      improve your score.
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleRetakeQuiz}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => setSelectedQuiz(null)}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Another Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
