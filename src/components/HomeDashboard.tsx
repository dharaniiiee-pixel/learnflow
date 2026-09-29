import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Calendar, 
  HelpCircle, 
  BookOpen, 
  Award, 
  BarChart3, 
  Library, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Clock, 
  Plus, 
  Target,
  BookMarked
} from 'lucide-react';
import { NavigationTab, UserProfile, StudyPlan, SolvedDoubt, Quiz } from '../types';

interface HomeDashboardProps {
  profile: UserProfile;
  activePlan?: StudyPlan;
  recentDoubts: SolvedDoubt[];
  recentQuizzes: Quiz[];
  onSelectTab: (tab: NavigationTab) => void;
  onLaunchDoubt: (query: string) => void;
  onToggleTask: (planId: string, taskId: string) => void;
  onOpenPomodoro: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  activePlan,
  recentDoubts,
  recentQuizzes,
  onSelectTab,
  onLaunchDoubt,
  onToggleTask,
  onOpenPomodoro,
}) => {
  const [quickQuestion, setQuickQuestion] = useState('');
  const [newQuickTaskTitle, setNewQuickTaskTitle] = useState('');
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [customTasks, setCustomTasks] = useState([
    { id: 'ct_1', title: 'Review Multivariable Calculus chain rule proof', completed: true, time: '30m' },
    { id: 'ct_2', title: 'Solve 5 LeetCode Graph BFS practice questions', completed: false, time: '45m' },
    { id: 'ct_3', title: 'Generate Cornell notes for Cellular Respiration chapter', completed: false, time: '25m' },
  ]);

  const handleQuickQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuestion.trim()) return;
    onLaunchDoubt(quickQuestion);
    setQuickQuestion('');
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuickTaskTitle.trim()) return;
    setCustomTasks((prev) => [
      ...prev,
      {
        id: 'ct_' + Date.now(),
        title: newQuickTaskTitle.trim(),
        completed: false,
        time: '30m',
      },
    ]);
    setNewQuickTaskTitle('');
    setShowTaskInput(false);
  };

  const toggleCustomTask = (id: string) => {
    setCustomTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  // Extract upcoming tasks from active plan
  const planTasks = activePlan?.weeks[0]?.days[0]?.tasks || [];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 p-6 md:p-8 text-white shadow-xl border border-indigo-800/40">
        
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-60 h-60 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Academic Partner · Fall Term 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Welcome back, {profile.name.split(' ')[0]}!
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              &ldquo;The roots of education are bitter, but the fruit is sweet.&rdquo; — Aristotle
            </p>
            <div className="text-xs text-indigo-200/80 pt-1">
              Current major: <span className="font-semibold text-white">{profile.major}</span> · Target GPA: <span className="font-semibold text-emerald-400">{profile.targetGpa}</span>
            </div>
          </div>

          {/* Quick Study Focus Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={onOpenPomodoro}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-indigo-950 font-bold text-sm shadow-md hover:bg-indigo-50 transition-all active:scale-95 cursor-pointer"
            >
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>Start 25m Focus Block</span>
            </button>
            <button
              onClick={() => onSelectTab('planner')}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-800/60 hover:bg-indigo-700/60 border border-indigo-700/50 text-white font-semibold text-sm transition-all cursor-pointer"
            >
              <span>View Roadmap</span>
              <ArrowRight className="w-4 h-4 text-indigo-300" />
            </button>
          </div>
        </div>

        {/* Quick Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-indigo-800/40 text-center sm:text-left">
          <div className="bg-slate-900/50 rounded-xl p-3 border border-indigo-900/40">
            <span className="text-xs text-slate-400">Current Streak</span>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-lg font-bold text-white">{profile.streakDays} Days</span>
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-3 border border-indigo-900/40">
            <span className="text-xs text-slate-400">Hours Studied</span>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-lg font-bold text-white">{profile.totalStudyHours} hrs</span>
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-3 border border-indigo-900/40">
            <span className="text-xs text-slate-400">Doubts Solved</span>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              <span className="text-lg font-bold text-white">{profile.doubtsSolved}</span>
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-3 border border-indigo-900/40">
            <span className="text-xs text-slate-400">Quizzes Taken</span>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-lg font-bold text-white">{profile.quizzesCompleted}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Doubt Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg text-indigo-600 dark:text-indigo-400">
            <HelpCircle className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Ask StudyMate AI Anything</h2>
          <span className="text-xs text-slate-400">· Instant step-by-step doubt resolution</span>
        </div>
        <form onSubmit={handleQuickQuestionSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={quickQuestion}
            onChange={(e) => setQuickQuestion(e.target.value)}
            placeholder="e.g. How does Dijkstra's algorithm work with priority queues? or Explain Lenz's Law..."
            className="flex-1 py-2.5 px-4 rounded-xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span>Solve Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        {/* Suggested Quick Prompts */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-600 dark:text-slate-300">Try asking:</span>
          {[
            'Derivation of Integration by Parts',
            'ATP Synthase rotary mechanism',
            'Time complexity of Quicksort vs Mergesort',
            'SN1 vs SN2 reaction kinetics',
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onLaunchDoubt(prompt)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 underline decoration-indigo-200 dark:decoration-indigo-800 underline-offset-2 cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Core Tools + Daily Task Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Tools Fast Launch */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">AI Study Suite</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose a tool to accelerate your academic mastery</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card 1: AI Study Planner */}
            <div 
              onClick={() => onSelectTab('planner')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    AI Study Planner
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Generate multi-week roadmaps broken into daily milestones tailored to your exam target date and hours.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Active: Calculus II</span>
                <span className="font-semibold text-slate-600 dark:text-slate-300">42% completed</span>
              </div>
            </div>

            {/* Card 2: Doubt Solver */}
            <div 
              onClick={() => onSelectTab('doubts')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-xl group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    AI Doubt Solver
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Step-by-step mathematical & conceptual answers, common pitfall warnings, and follow-up Socratic probing.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>19 Solved Doubts</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Ask question →</span>
              </div>
            </div>

            {/* Card 3: Notes Generator */}
            <div 
              onClick={() => onSelectTab('notes')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl group-hover:scale-110 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Notes & Flashcards
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Transform textbook excerpts or lecture slides into structured Cornell notes, one-page cheatsheets, and 3D flip cards.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Format: Cornell / Cards</span>
                <span className="font-semibold text-slate-600 dark:text-slate-300">23 notes saved</span>
              </div>
            </div>

            {/* Card 4: Quiz Generator */}
            <div 
              onClick={() => onSelectTab('quiz')}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 rounded-xl group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Open <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Quiz Generator
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Build adaptive micro-quizzes with timer constraints, detailed answer rationales, and celebration rewards.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Avg Score: 88%</span>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">Test skills →</span>
              </div>
            </div>

          </div>

          {/* Quick links to Progress & Resources */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onSelectTab('progress')}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Progress & Mastery Analytics</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">View study heatmaps & badges</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => onSelectTab('resources')}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 rounded-lg">
                  <Library className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Academic Resources Library</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Formula sheets & cheat guides</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

        </div>

        {/* Right 1 Col: Today's Tasks & Schedule */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Today's Study Checklist</h3>
              </div>
              <button
                onClick={() => setShowTaskInput(!showTaskInput)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {/* Quick Task Add Input */}
            {showTaskInput && (
              <form onSubmit={handleAddCustomTask} className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newQuickTaskTitle}
                  onChange={(e) => setNewQuickTaskTitle(e.target.value)}
                  className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 cursor-pointer"
                >
                  Save
                </button>
              </form>
            )}

            {/* Custom & Plan Tasks List */}
            <div className="mt-4 space-y-2.5">
              {/* Custom Tasks */}
              {customTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleCustomTask(task.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    task.completed
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400 line-through'
                      : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <button className="mt-0.5 text-indigo-600 dark:text-indigo-400">
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium leading-snug">{task.title}</p>
                    <span className="text-[10px] text-slate-400">{task.time}</span>
                  </div>
                </div>
              ))}

              {/* Tasks from active study plan */}
              {activePlan && planTasks.length > 0 && (
                <div className="pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    From Plan: {activePlan.subject}
                  </div>
                  {planTasks.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => onToggleTask(activePlan.id, t.id)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer mb-2 ${
                        t.completed
                          ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-400 line-through'
                          : 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <button className="mt-0.5 text-indigo-600 dark:text-indigo-400">
                        {t.completed ? (
                          <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium leading-snug">{t.title}</p>
                        <span className="text-[10px] text-indigo-500 font-medium">{t.estimatedMinutes}m · {t.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={() => onSelectTab('planner')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                Open Full Study Roadmap →
              </button>
            </div>
          </div>

          {/* Academic Goals Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>Semester Goals</span>
              </h3>
              <button 
                onClick={() => onSelectTab('profile')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {profile.goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                      {goal.title}
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${goal.progress}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
