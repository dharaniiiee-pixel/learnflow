import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Download, 
  Copy, 
  Trash2, 
  Check, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { StudyPlan, StudyPlanTask } from '../types';
import { generateStudyPlanAI } from '../services/aiService';

interface StudyPlannerProps {
  plans: StudyPlan[];
  activePlanId: string;
  onSelectPlan: (planId: string) => void;
  onSavePlan: (newPlan: StudyPlan) => void;
  onDeletePlan: (planId: string) => void;
  onToggleTask: (planId: string, taskId: string) => void;
  onAddTaskToPlan: (planId: string, weekIndex: number, dayIndex: number, task: StudyPlanTask) => void;
}

export const StudyPlanner: React.FC<StudyPlannerProps> = ({
  plans,
  activePlanId,
  onSelectPlan,
  onSavePlan,
  onDeletePlan,
  onToggleTask,
  onAddTaskToPlan,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  // Form State for new plan
  const [subject, setSubject] = useState('');
  const [targetGoal, setTargetGoal] = useState('');
  const [examDate, setExamDate] = useState('2026-11-15');
  const [dailyHours, setDailyHours] = useState(2.5);
  const [learningStyle, setLearningStyle] = useState<'visual' | 'practical' | 'theoretical' | 'spaced'>('practical');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  // Quick custom task state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskMinutes, setNewTaskMinutes] = useState(45);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const activePlan = plans.find((p) => p.id === activePlanId) || plans[0];

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !targetGoal.trim()) return;

    setIsGenerating(true);
    try {
      const newPlan = await generateStudyPlanAI({
        subject: subject.trim(),
        targetGoal: targetGoal.trim(),
        examDate,
        dailyHours,
        learningStyle,
        difficulty,
      });
      onSavePlan(newPlan);
      onSelectPlan(newPlan.id);
      setShowCreateModal(false);
      // Reset form
      setSubject('');
      setTargetGoal('');
    } catch (err) {
      console.error('Failed to generate plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleQuickTemplate = async (templateName: string, templateGoal: string, templateHours: number) => {
    setIsGenerating(true);
    try {
      const newPlan = await generateStudyPlanAI({
        subject: templateName,
        targetGoal: templateGoal,
        examDate: '2026-11-20',
        dailyHours: templateHours,
        learningStyle: 'practical',
        difficulty: 'Intermediate',
      });
      onSavePlan(newPlan);
      onSelectPlan(newPlan.id);
      setShowCreateModal(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyPlan = () => {
    if (!activePlan) return;
    let text = `# Study Roadmap: ${activePlan.subject}\nGoal: ${activePlan.targetGoal}\nExam: ${activePlan.examDate} | Daily: ${activePlan.dailyHours} hrs\n\n`;
    activePlan.weeks.forEach((w) => {
      text += `## Week ${w.weekNumber}: ${w.title}\nObjective: ${w.objective}\n`;
      w.days.forEach((d) => {
        text += `### Day ${d.dayNumber}: ${d.dayTitle} (${d.focusArea})\n`;
        d.tasks.forEach((t) => {
          text += `- [${t.completed ? 'x' : ' '}] ${t.title} (${t.estimatedMinutes}m)\n`;
        });
      });
      text += '\n';
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddCustomTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !activePlan) return;

    const task: StudyPlanTask = {
      id: 'task_' + Date.now(),
      title: newTaskTitle.trim(),
      description: 'Custom milestone added by student',
      estimatedMinutes: newTaskMinutes,
      completed: false,
      priority: 'medium',
      topic: 'Custom',
    };

    onAddTaskToPlan(activePlan.id, selectedWeekIndex, 0, task);
    setNewTaskTitle('');
    setShowAddTaskModal(false);
  };

  // Calculate stats
  let totalTasks = 0;
  let completedTasks = 0;
  if (activePlan) {
    activePlan.weeks.forEach((w) => {
      w.days.forEach((d) => {
        d.tasks.forEach((t) => {
          totalTasks++;
          if (t.completed) completedTasks++;
        });
      });
    });
  }
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              AI Study Planner
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dynamic milestone syllabi generated to pace your exam preparation
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activePlan && (
            <button
              onClick={handleCopyPlan}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Markdown' : 'Export Plan'}</span>
            </button>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate New Plan</span>
          </button>
        </div>
      </div>

      {/* Plan Selector Carousel/Tabs */}
      {plans.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {plans.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPlan(p.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                p.id === activePlan?.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{p.subject}</span>
            </button>
          ))}
        </div>
      )}

      {/* Active Plan Detail Card */}
      {activePlan ? (
        <div className="space-y-6">
          
          {/* Plan Meta Banner */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {activePlan.difficulty} · {activePlan.learningStyle} learning style
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {activePlan.subject}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Objective: <span className="text-slate-700 dark:text-slate-200 font-medium">{activePlan.targetGoal}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-slate-400">Target Exam Date</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {activePlan.examDate}
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
                <div className="text-right">
                  <div className="text-xs text-slate-400">Daily Study Target</div>
                  <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {activePlan.dailyHours} hrs / day
                  </div>
                </div>

                {plans.length > 1 && (
                  <button
                    onClick={() => onDeletePlan(activePlan.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ml-2 cursor-pointer"
                    title="Delete this study plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Milestone Progress ({completedTasks} of {totalTasks} tasks completed)
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Week Selector Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-850 rounded-xl">
              {activePlan.weeks.map((week, idx) => (
                <button
                  key={week.weekNumber}
                  onClick={() => setSelectedWeekIndex(idx)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    selectedWeekIndex === idx
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Week {week.weekNumber}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddTaskModal(true)}
              className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Milestone</span>
            </button>
          </div>

          {/* Current Week Content */}
          {activePlan.weeks[selectedWeekIndex] && (
            <div className="space-y-4">
              {/* Week Objective Card */}
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Week {activePlan.weeks[selectedWeekIndex].weekNumber} Focus
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                  {activePlan.weeks[selectedWeekIndex].title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {activePlan.weeks[selectedWeekIndex].objective}
                </p>
              </div>

              {/* Day Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePlan.weeks[selectedWeekIndex].days.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Day {day.dayNumber}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {day.dayTitle}
                        </h4>
                      </div>
                      <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                        {day.focusArea}
                      </span>
                    </div>

                    {/* Task items */}
                    <div className="space-y-2">
                      {day.tasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => onToggleTask(activePlan.id, task.id)}
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
                            <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-indigo-500" />
                                {task.estimatedMinutes} mins
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className={`font-semibold capitalize ${
                                task.priority === 'high' ? 'text-rose-500' : 'text-slate-500'
                              }`}>
                                {task.priority} Priority
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">No active study plan</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Build your first AI personalized study roadmap to tackle upcoming midterms, finals, or certification exams!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 cursor-pointer"
          >
            Create My AI Study Plan
          </button>
        </div>
      )}

      {/* Preset Academic Sprints */}
      <div className="pt-6">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Popular Curated Academic Sprints
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: 'Python DSA & LeetCode Sprint', goal: 'Master Arrays, Trees & Dynamic Programming', hours: 3 },
            { name: 'Organic Chemistry Reactions', goal: 'Memorize SN1/SN2 and Carbonyl Mechanisms', hours: 2 },
            { name: 'Multivariable Calculus 30-Day', goal: 'Stokes Theorem & Double Integrals', hours: 2.5 },
            { name: 'MCAT Biology Cell Systems', goal: 'Bioenergetics, Enzymes & Genetics', hours: 4 },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleQuickTemplate(item.name, item.goal, item.hours)}
              className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group"
            >
              <div className="text-xs font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                {item.name}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{item.goal}</p>
              <div className="mt-2 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                <span>Load Blueprint</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">Generate AI Study Plan</h3>
                  <p className="text-xs text-slate-400">Tailored milestone roadmap by StudyMate AI</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGeneratePlan} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Course or Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Linear Algebra, Macroeconomics, AP Physics C..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Specific Exam Target or Objective
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Eigenvalues, Diagonalization, and score >90% on Final"
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Exam / Target Date
                  </label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Daily Hours ({dailyHours} hrs)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="0.5"
                    value={dailyHours}
                    onChange={(e) => setDailyHours(parseFloat(e.target.value))}
                    className="w-full mt-2 accent-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Learning Style
                  </label>
                  <select
                    value={learningStyle}
                    onChange={(e: any) => setLearningStyle(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="practical">Practical Problem Solving</option>
                    <option value="visual">Visual & Mind-Mapping</option>
                    <option value="theoretical">Theoretical & Derivations</option>
                    <option value="spaced">Spaced Repetition & Recall</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e: any) => setDifficulty(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Beginner">Beginner (Foundations first)</option>
                    <option value="Intermediate">Intermediate (Standard)</option>
                    <option value="Advanced">Advanced (High rigor)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Plan...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Roadmap</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Milestone Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-5 text-slate-800 dark:text-slate-100">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Add Custom Study Task</h3>
            <form onSubmit={handleAddCustomTaskSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Chapter 4 odd-numbered exercises"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  autoFocus
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Estimated Minutes</label>
                <input
                  type="number"
                  min="10"
                  max="240"
                  value={newTaskMinutes}
                  onChange={(e) => setNewTaskMinutes(parseInt(e.target.value) || 30)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
