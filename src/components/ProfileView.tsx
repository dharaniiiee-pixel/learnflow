import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Mail, 
  Building, 
  Target, 
  Flame, 
  Clock, 
  Award, 
  BookOpen, 
  HelpCircle, 
  Edit3, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2,
  Sparkles
} from 'lucide-react';
import { UserProfile, AcademicGoal, Subject } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onAddGoal: (goal: AcademicGoal) => void;
  onUpdateGoalProgress: (goalId: string, newProgress: number) => void;
  onToggleGoalComplete: (goalId: string) => void;
  onDeleteGoal: (goalId: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onUpdateProfile,
  onAddGoal,
  onUpdateGoalProgress,
  onToggleGoalComplete,
  onDeleteGoal,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  // Edit profile form
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [major, setMajor] = useState(profile.major);
  const [institution, setInstitution] = useState(profile.institution);
  const [year, setYear] = useState(profile.year);
  const [targetGpa, setTargetGpa] = useState(profile.targetGpa);
  const [currentGpa, setCurrentGpa] = useState(profile.currentGpa);
  const [avatar, setAvatar] = useState(profile.avatar);

  // Add goal form
  const [goalTitle, setGoalTitle] = useState('');
  const [goalSubject, setGoalSubject] = useState<Subject>('Computer Science');
  const [goalDueDate, setGoalDueDate] = useState('2026-11-30');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      name,
      email,
      major,
      institution,
      year,
      targetGpa,
      currentGpa,
      avatar,
    });
    setShowEditModal(false);
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const newGoal: AcademicGoal = {
      id: 'g_' + Date.now(),
      title: goalTitle.trim(),
      subject: goalSubject,
      progress: 10,
      dueDate: goalDueDate,
      completed: false,
    };

    onAddGoal(newGoal);
    setGoalTitle('');
    setShowAddGoalModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden">
        
        {/* Subtle decorative gradient pill in corner */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-200 dark:border-indigo-900 shadow-sm"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {profile.name}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                  {profile.year}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                <span>{profile.major}</span>
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  {profile.institution}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {profile.email}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end gap-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-400">GPA:</span>
              <span className="font-bold text-slate-800 dark:text-white">{profile.currentGpa}</span>
              <span className="text-slate-400">/ Target:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{profile.targetGpa}</span>
            </div>
          </div>
        </div>

        {/* Academic Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400">Focus Hours</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>{profile.totalStudyHours}h</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400">Study Streak</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{profile.streakDays}d</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400">Doubts Solved</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1">
              <HelpCircle className="w-4 h-4 text-cyan-500" />
              <span>{profile.doubtsSolved}</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400">Quizzes Passed</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1">
              <Award className="w-4 h-4 text-purple-500" />
              <span>{profile.quizzesCompleted}</span>
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-xs text-slate-400">Notes Generated</span>
            <div className="text-lg font-bold text-slate-900 dark:text-white font-mono flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>{profile.notesGenerated}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Academic Goals Management */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Semester Academic Goals</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Track course objectives and target examination benchmarks
            </p>
          </div>

          <button
            onClick={() => setShowAddGoalModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Goal</span>
          </button>
        </div>

        {/* Goals List */}
        <div className="space-y-3.5">
          {profile.goals.map((goal) => (
            <div
              key={goal.id}
              className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                goal.completed
                  ? 'bg-slate-50 dark:bg-slate-850/40 border-slate-200/60 dark:border-slate-800 opacity-80'
                  : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 shadow-2xs'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <button
                    onClick={() => onToggleGoalComplete(goal.id)}
                    className="mt-0.5 text-indigo-600 dark:text-indigo-400 cursor-pointer"
                  >
                    {goal.completed ? (
                      <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                    )}
                  </button>
                  <div>
                    <h3 className={`text-xs sm:text-sm font-semibold text-slate-900 dark:text-white ${
                      goal.completed ? 'line-through text-slate-400' : ''
                    }`}>
                      {goal.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">{goal.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>Target: {goal.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {goal.progress}%
                  </span>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer"
                    title="Delete goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>

                {!goal.completed && (
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Adjust mastery progress:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={goal.progress}
                      onChange={(e) => onUpdateGoalProgress(goal.id, parseInt(e.target.value))}
                      className="w-32 accent-indigo-600"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-5 text-slate-800 dark:text-slate-100">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Edit Academic Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Major / Discipline</label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Year / Class</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Current GPA</label>
                  <input
                    type="text"
                    value={currentGpa}
                    onChange={(e) => setCurrentGpa(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Target GPA Goal</label>
                  <input
                    type="text"
                    value={targetGpa}
                    onChange={(e) => setTargetGpa(e.target.value)}
                    className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Institution / College</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-5 text-slate-800 dark:text-slate-100">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3">Add Academic Goal</h3>
            <form onSubmit={handleAddGoalSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Linear Transformations and Eigenbases"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={goalSubject}
                  onChange={(e) => setGoalSubject(e.target.value as Subject)}
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

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">Due / Target Date</label>
                <input
                  type="date"
                  value={goalDueDate}
                  onChange={(e) => setGoalDueDate(e.target.value)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-3 py-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 cursor-pointer"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
