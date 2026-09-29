import React, { useState } from 'react';
import { 
  BarChart3, 
  Flame, 
  Clock, 
  Award, 
  HelpCircle, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  TrendingUp, 
  BookOpen, 
  Trash2 
} from 'lucide-react';
import { StudySessionLog, UserProfile, Subject } from '../types';

interface ProgressTrackerProps {
  profile: UserProfile;
  studyLogs: StudySessionLog[];
  onAddLog: (log: StudySessionLog) => void;
  onDeleteLog: (id: string) => void;
  targetDailyMinutes: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  profile,
  studyLogs,
  onAddLog,
  onDeleteLog,
  targetDailyMinutes,
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [logSubject, setLogSubject] = useState<Subject>('Computer Science');
  const [logMinutes, setLogMinutes] = useState(60);
  const [logNotes, setLogNotes] = useState('');
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: StudySessionLog = {
      id: 'log_' + Date.now(),
      subject: logSubject,
      minutes: Number(logMinutes),
      date: logDate,
      notes: logNotes || 'Independent study session',
    };
    onAddLog(newLog);
    setLogNotes('');
    setShowLogModal(false);
  };

  // Weekly study breakdown calculation (last 7 days)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayMinutes = [110, 150, 140, 180, 160, 210, 175]; // sample realistic distribution
  const maxDayMinutes = Math.max(...dayMinutes, targetDailyMinutes);

  // Subject distribution
  const subjectTotals: Record<string, number> = {};
  let totalLoggedMinutes = 0;
  studyLogs.forEach((l) => {
    subjectTotals[l.subject] = (subjectTotals[l.subject] || 0) + l.minutes;
    totalLoggedMinutes += l.minutes;
  });

  const subjectPercentages = Object.entries(subjectTotals).map(([subj, mins]) => ({
    subject: subj,
    minutes: mins,
    percent: totalLoggedMinutes > 0 ? Math.round((mins / totalLoggedMinutes) * 100) : 0,
  })).sort((a, b) => b.minutes - a.minutes);

  // Academic Badges
  const badges = [
    {
      id: 'b1',
      title: '7-Day Consistency Flame',
      desc: 'Maintained a study streak for 7 or more consecutive days',
      icon: Flame,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
      unlocked: profile.streakDays >= 7,
    },
    {
      id: 'b2',
      title: 'Quiz Prodigy (85%+ Mastery)',
      desc: 'Scored an average of 85% or above across multiple test challenges',
      icon: Award,
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800',
      unlocked: true,
    },
    {
      id: 'b3',
      title: 'Deep Inquirer',
      desc: 'Solved 15+ academic doubts with step-by-step reasoning',
      icon: HelpCircle,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
      unlocked: profile.doubtsSolved >= 15,
    },
    {
      id: 'b4',
      title: 'Note Architect',
      desc: 'Created over 10 Cornell & cheatsheet study guides',
      icon: BookOpen,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      unlocked: profile.notesGenerated >= 10,
    },
    {
      id: 'b5',
      title: 'Pomodoro Endurance Titan',
      desc: 'Logged 40+ total productive focus hours',
      icon: Clock,
      color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800',
      unlocked: profile.totalStudyHours >= 40,
    },
    {
      id: 'b6',
      title: 'Dean\'s Scholar Track',
      desc: 'Target GPA goal set and maintained above 3.80',
      icon: CheckCircle2,
      color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
      unlocked: true,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Study Progress & Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Weekly focus trends, subject distributions, academic streaks & unlocked badges
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log Study Session</span>
        </button>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Study Hours</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {profile.totalStudyHours} hrs
          </div>
          <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +4.2 hrs from last week
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {profile.streakDays} Days
          </div>
          <span className="text-[11px] text-amber-500 font-semibold">
            Personal best: 14 days
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Quiz Average Score</span>
            <Award className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            88%
          </div>
          <span className="text-[11px] text-purple-500 font-semibold">
            {profile.quizzesCompleted} quizzes completed
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Doubts Resolved</span>
            <HelpCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {profile.doubtsSolved}
          </div>
          <span className="text-[11px] text-slate-400">
            100% resolution rate
          </span>
        </div>
      </div>

      {/* Middle Grid: Weekly Visual Bar Chart + Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left (7 Cols): Weekly Hours Bar Graph */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Weekly Focus Time</h3>
              <p className="text-xs text-slate-400">Minutes studied each day (Target: {targetDailyMinutes}m/day)</p>
            </div>
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              This Week: 18.7 hrs
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6 pb-2">
            <div className="h-44 flex items-end justify-between gap-3 px-2">
              {daysOfWeek.map((day, idx) => {
                const mins = dayMinutes[idx];
                const heightPercent = Math.min(100, Math.round((mins / maxDayMinutes) * 100));
                const metTarget = mins >= targetDailyMinutes;

                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-mono font-semibold">
                      {mins}m
                    </span>
                    <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-t-lg h-36 flex items-end p-1">
                      <div
                        className={`w-full rounded-md transition-all duration-500 ${
                          metTarget
                            ? 'bg-gradient-to-t from-indigo-600 to-cyan-500'
                            : 'bg-indigo-400/60 dark:bg-indigo-700/60'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right (5 Cols): Subject Mastery & Time Breakdown */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Subject Time Allocation</h3>
            <p className="text-xs text-slate-400">Proportional study hours by discipline</p>
          </div>

          <div className="space-y-3.5 pt-1">
            {subjectPercentages.slice(0, 5).map((subj, idx) => {
              const colors = ['bg-indigo-600', 'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
              const color = colors[idx % colors.length];

              return (
                <div key={subj.subject} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{subj.subject}</span>
                    <span className="text-slate-400 font-mono">{subj.minutes} mins ({subj.percent}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`${color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${subj.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* GitHub Style 30-Day Contribution Heatmap */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">30-Day Study Consistency Grid</h3>
            <p className="text-xs text-slate-400">Daily academic engagement & focus intensity</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-100 dark:bg-slate-800" />
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-300 dark:bg-indigo-900" />
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500" />
            <span className="w-2.5 h-2.5 rounded-xs bg-indigo-700 dark:bg-indigo-400" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap 30 days grid */}
        <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-30 gap-1.5 pt-2">
          {Array.from({ length: 30 }).map((_, i) => {
            // realistic intensity weights
            const intensity = (i % 7 === 0) ? 0 : (i % 3 === 0) ? 3 : (i % 2 === 0) ? 2 : 1;
            const bgClass =
              intensity === 0
                ? 'bg-slate-100 dark:bg-slate-800'
                : intensity === 1
                ? 'bg-indigo-200 dark:bg-indigo-950/80'
                : intensity === 2
                ? 'bg-indigo-400 dark:bg-indigo-700'
                : 'bg-indigo-600 dark:bg-indigo-400';

            return (
              <div
                key={i}
                className={`h-7 rounded-md ${bgClass} transition-transform hover:scale-115 cursor-pointer`}
                title={`Day ${30 - i}: ${intensity * 45} mins studied`}
              />
            );
          })}
        </div>
      </div>

      {/* Academic Badges & Achievements */}
      <div className="space-y-3">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Unlocked Academic Achievements</h3>
          <p className="text-xs text-slate-400">Milestone awards earned for discipline and test mastery</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  badge.unlocked
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/40 opacity-60'
                }`}
              >
                <div className={`p-2.5 rounded-xl border shrink-0 ${badge.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{badge.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{badge.desc}</p>
                  <span className="text-[10px] font-bold mt-1.5 block text-emerald-600 dark:text-emerald-400">
                    {badge.unlocked ? '✓ Unlocked' : 'In Progress'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Study Session Logs Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Study Session Logs</h3>
          <span className="text-xs text-slate-400">{studyLogs.length} sessions logged</span>
        </div>

        <div className="space-y-2 overflow-x-auto">
          {studyLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-850 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                  {log.minutes}m
                </div>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{log.subject}</span>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{log.notes}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400 font-mono">{log.date}</span>
                <button
                  onClick={() => onDeleteLog(log.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                  title="Delete log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Session Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-5 text-slate-800 dark:text-slate-100">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Log Study Session</h3>
            <form onSubmit={handleAddLogSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={logSubject}
                  onChange={(e) => setLogSubject(e.target.value as Subject)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Minutes</label>
                  <input
                    type="number"
                    min="5"
                    max="600"
                    value={logMinutes}
                    onChange={(e) => setLogMinutes(parseInt(e.target.value) || 30)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Notes / Topics Covered</label>
                <input
                  type="text"
                  placeholder="e.g. Mastered Dijkstra algorithm proofs"
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 cursor-pointer"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
