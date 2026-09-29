import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  HelpCircle, 
  ChevronRight,
  TrendingUp,
  Trash2
} from 'lucide-react';
import { Quiz, Subject, QuizQuestion } from '../types';
import { generateQuizAI } from '../services/aiService';

interface QuizGeneratorProps {
  quizzes: Quiz[];
  onSaveQuiz: (quiz: Quiz) => void;
  onDeleteQuiz: (quizId: string) => void;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  quizzes,
  onSaveQuiz,
  onDeleteQuiz,
}) => {
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(
    quizzes.length > 0 ? quizzes[0].id : null
  );

  // New Quiz Form state
  const [quizTopic, setQuizTopic] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Computer Science');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Test-taking state
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const activeQuiz = quizzes.find((q) => q.id === selectedQuizId) || quizzes[0];

  // Reset or initialize state when active quiz changes
  useEffect(() => {
    if (activeQuiz) {
      if (activeQuiz.completed) {
        setIsQuizSubmitted(true);
        // Load recorded user answers
        const ans: Record<string, string> = {};
        activeQuiz.questions.forEach((q) => {
          if (q.userAnswer) ans[q.id] = q.userAnswer;
        });
        setUserAnswers(ans);
      } else {
        setIsQuizSubmitted(false);
        setUserAnswers({});
        setTimeLeft(activeQuiz.timeLimitMinutes * 60);
        setIsTimerRunning(true);
        setActiveQuestionIdx(0);
      }
    }
  }, [activeQuiz]);

  // Countdown timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && !isQuizSubmitted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isQuizSubmitted) {
      // Auto-submit when time expires
      handleSubmitQuiz();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isQuizSubmitted, timeLeft]);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quizTopic.trim()) return;

    setIsGenerating(true);
    try {
      const newQuiz = await generateQuizAI({
        topic: quizTopic.trim(),
        subject: selectedSubject,
        questionCount,
        difficulty,
      });
      onSaveQuiz(newQuiz);
      setSelectedQuizId(newQuiz.id);
      setIsQuizSubmitted(false);
      setUserAnswers({});
      setActiveQuestionIdx(0);
      setTimeLeft(newQuiz.timeLimitMinutes * 60);
      setIsTimerRunning(true);
      setQuizTopic('');
    } catch (err) {
      console.error('Failed to generate quiz:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (isQuizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz) return;
    setIsTimerRunning(false);

    let calculatedScore = 0;
    const evaluatedQuestions: QuizQuestion[] = activeQuiz.questions.map((q) => {
      const selected = userAnswers[q.id];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) calculatedScore++;
      return {
        ...q,
        userAnswer: selected || 'Not answered',
        isCorrect,
      };
    });

    const evaluatedQuiz: Quiz = {
      ...activeQuiz,
      completed: true,
      score: calculatedScore,
      totalScore: activeQuiz.questions.length,
      takenAt: new Date().toISOString().split('T')[0],
      questions: evaluatedQuestions,
    };

    onSaveQuiz(evaluatedQuiz);
    setIsQuizSubmitted(true);

    // Trigger celebratory confetti if score >= 70%
    const scoreRatio = calculatedScore / activeQuiz.questions.length;
    if (scoreRatio >= 0.7) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore
      }
    }
  };

  const handleRetakeQuiz = () => {
    if (!activeQuiz) return;
    const resetQuestions = activeQuiz.questions.map((q) => ({
      ...q,
      userAnswer: undefined,
      isCorrect: undefined,
    }));
    const retakeQuiz: Quiz = {
      ...activeQuiz,
      completed: false,
      score: undefined,
      takenAt: undefined,
      questions: resetQuestions,
    };
    onSaveQuiz(retakeQuiz);
    setUserAnswers({});
    setIsQuizSubmitted(false);
    setTimeLeft(activeQuiz.timeLimitMinutes * 60);
    setIsTimerRunning(true);
    setActiveQuestionIdx(0);
  };

  const minutesLeft = Math.floor(timeLeft / 60);
  const secondsLeft = timeLeft % 60;
  const formattedTimer = `${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              AI Quiz Generator & Evaluator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build custom timed quizzes with instant grading, explanations, and score tracking
          </p>
        </div>
      </div>

      {/* Quiz Generation Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Create Practice Challenge</h3>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6">
              <input
                type="text"
                required
                placeholder="Topic: e.g. Graph Algorithms, Chemical Equilibrium, Keynesian Multiplier..."
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value as Subject)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Literature & Writing">Literature & Writing</option>
                <option value="Economics & Business">Economics & Business</option>
                <option value="General Science">General Science</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={difficulty}
                onChange={(e: any) => setDifficulty(e.target.value)}
                className="w-full text-xs py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
              >
                <option value="Beginner">Beginner (Foundations)</option>
                <option value="Intermediate">Intermediate (Standard)</option>
                <option value="Advanced">Advanced (Challenging)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Questions:</span>
              {[3, 5, 8].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer ${
                    questionCount === num
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isGenerating || !quizTopic.trim()}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating Questions...</span>
                </>
              ) : (
                <>
                  <Award className="w-3.5 h-3.5" />
                  <span>Build Quiz Challenge</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Main Layout: Past Quizzes Drawer + Active Quiz Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (4 Cols): Past Quizzes Archive */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-500" />
              Quiz History & Challenges ({quizzes.length})
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {quizzes.map((quiz) => {
                const isSelected = quiz.id === activeQuiz?.id;
                const scorePercent = quiz.completed && quiz.score !== undefined && quiz.totalScore
                  ? Math.round((quiz.score / quiz.totalScore) * 100)
                  : null;

                return (
                  <div
                    key={quiz.id}
                    onClick={() => {
                      setSelectedQuizId(quiz.id);
                      setActiveQuestionIdx(0);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-purple-50/70 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800 shadow-xs'
                        : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                        {quiz.subject} · {quiz.difficulty}
                      </span>
                      {quizzes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteQuiz(quiz.id);
                          }}
                          className="text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
                      {quiz.title}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                      <span>{quiz.questions.length} Questions</span>
                      {quiz.completed ? (
                        <span className={`font-bold ${
                          (scorePercent || 0) >= 70 ? 'text-emerald-500' : 'text-amber-500'
                        }`}>
                          Score: {quiz.score}/{quiz.totalScore} ({scorePercent}%)
                        </span>
                      ) : (
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                          Not Taken
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (8 Cols): Active Quiz Taking OR Results Screen */}
        <div className="lg:col-span-8 space-y-4">
          {activeQuiz ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              
              {/* Top Banner: Quiz Title, Timer, & Retake */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                    {activeQuiz.subject} · {activeQuiz.difficulty} Level
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    {activeQuiz.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {!isQuizSubmitted && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 rounded-lg text-purple-700 dark:text-purple-300 font-mono text-xs font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formattedTimer}</span>
                    </div>
                  )}

                  {isQuizSubmitted && (
                    <button
                      onClick={handleRetakeQuiz}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retake Quiz</span>
                    </button>
                  )}
                </div>
              </div>

              {/* SCREEN A: QUIZ COMPLETED / RESULTS SCREEN */}
              {isQuizSubmitted ? (
                <div className="space-y-6">
                  {/* Score Card Banner */}
                  {(() => {
                    const score = activeQuiz.score ?? 0;
                    const total = activeQuiz.totalScore ?? activeQuiz.questions.length;
                    const percent = Math.round((score / total) * 100);
                    const isHigh = percent >= 70;

                    return (
                      <div className={`p-6 rounded-2xl border text-center space-y-2 ${
                        isHigh
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                          : 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100'
                      }`}>
                        <div className="text-4xl font-extrabold tracking-tight font-mono">
                          {score} / {total}
                        </div>
                        <div className="text-sm font-bold">
                          {isHigh ? '🎉 Outstanding Academic Mastery!' : '📚 Good Attempt · Review Concepts Below'}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                          You scored {percent}%. Review each question breakdown below to cement your understanding.
                        </p>
                      </div>
                    );
                  })()}

                  {/* Question by Question Review */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Question Breakdown & Explanations
                    </h3>

                    <div className="space-y-4">
                      {activeQuiz.questions.map((q, idx) => {
                        const isCorrect = q.isCorrect;
                        return (
                          <div
                            key={q.id}
                            className={`p-4 rounded-xl border space-y-2.5 ${
                              isCorrect
                                ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                                : 'border-rose-200 dark:border-rose-800/60 bg-rose-50/20 dark:bg-rose-950/10'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold text-slate-800 dark:text-white">
                                Q{idx + 1}. {q.question}
                              </span>
                              {isCorrect ? (
                                <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                                  <CheckCircle2 className="w-4 h-4" /> Correct
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-xs font-bold text-rose-500 shrink-0">
                                  <XCircle className="w-4 h-4" /> Incorrect
                                </span>
                              )}
                            </div>

                            {/* Answers recap */}
                            <div className="text-xs space-y-1 pl-1">
                              <div className="text-slate-600 dark:text-slate-400">
                                Your Answer: <span className="font-semibold text-slate-900 dark:text-white">{q.userAnswer || 'None'}</span>
                              </div>
                              <div className="text-emerald-600 dark:text-emerald-400 font-medium">
                                Correct Answer: <span className="font-bold">{q.correctAnswer}</span>
                              </div>
                            </div>

                            {/* Explanation */}
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">Explanation: </span>
                              {q.explanation}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* SCREEN B: ACTIVE TEST TAKING MODE */
                <div className="space-y-6">
                  {/* Progress Header */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Question {activeQuestionIdx + 1} of {activeQuiz.questions.length}</span>
                      <span>{Object.keys(userAnswers).length} answered</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-600 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${((activeQuestionIdx + 1) / activeQuiz.questions.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Active Question Prompt */}
                  {(() => {
                    const currentQ = activeQuiz.questions[activeQuestionIdx];
                    const selectedAns = userAnswers[currentQ.id];

                    return (
                      <div className="space-y-4">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                          {currentQ.question}
                        </h3>

                        {/* Options list */}
                        <div className="space-y-2.5">
                          {(currentQ.options || ['True', 'False']).map((opt, oIdx) => {
                            const isChosen = selectedAns === opt;
                            return (
                              <button
                                key={oIdx}
                                type="button"
                                onClick={() => handleSelectOption(currentQ.id, opt)}
                                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                                  isChosen
                                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-900 dark:text-purple-100 shadow-2xs'
                                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <span>{opt}</span>
                                {isChosen && <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                              </button>
                            );
                          })}
                        </div>

                        {/* Navigation between questions & submit */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            disabled={activeQuestionIdx === 0}
                            onClick={() => setActiveQuestionIdx((prev) => prev - 1)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" /> Previous
                          </button>

                          {activeQuestionIdx < activeQuiz.questions.length - 1 ? (
                            <button
                              type="button"
                              onClick={() => setActiveQuestionIdx((prev) => prev + 1)}
                              className="flex items-center gap-1 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
                            >
                              <span>Next Question</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSubmitQuiz}
                              className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm cursor-pointer"
                            >
                              Submit Quiz for Grading
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

            </div>
          ) : (
            <div className="p-10 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">No Quizzes Ready</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Generate your first custom test challenge above to test your skills under timed exam conditions!
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
