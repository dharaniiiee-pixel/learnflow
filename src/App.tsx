/**
 * StudyMate AI - AI-Powered Study Assistant for Students
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  NavigationTab, 
  UserProfile, 
  StudyPlan, 
  SolvedDoubt, 
  GeneratedNotes, 
  Quiz, 
  StudySessionLog, 
  AcademicResource, 
  UserSettings,
  StudyPlanTask,
  AcademicGoal,
  Subject
} from './types';
import { 
  storageService, 
  defaultProfile, 
  defaultResources, 
  defaultSettings 
} from './services/storageService';

import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { StudyPlanner } from './components/StudyPlanner';
import { DoubtSolver } from './components/DoubtSolver';
import { NotesGenerator } from './components/NotesGenerator';
import { QuizGenerator } from './components/QuizGenerator';
import { ProgressTracker } from './components/ProgressTracker';
import { ResourcesLibrary } from './components/ResourcesLibrary';
import { ProfileView } from './components/ProfileView';
import { PomodoroModal } from './components/PomodoroModal';
import { SettingsModal } from './components/SettingsModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // App Data State
  const [profile, setProfile] = useState<UserProfile>(() => storageService.getProfile());
  const [plans, setPlans] = useState<StudyPlan[]>(() => storageService.getStudyPlans());
  const [activePlanId, setActivePlanId] = useState<string>(() => {
    const loaded = storageService.getStudyPlans();
    return loaded.length > 0 ? loaded[0].id : '';
  });
  const [doubts, setDoubts] = useState<SolvedDoubt[]>(() => storageService.getSolvedDoubts());
  const [notes, setNotes] = useState<GeneratedNotes[]>(() => storageService.getNotes());
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => storageService.getQuizzes());
  const [studyLogs, setStudyLogs] = useState<StudySessionLog[]>(() => storageService.getStudyLogs());
  const [settings, setSettings] = useState<UserSettings>(() => storageService.getSettings());
  const [resources, setResources] = useState<AcademicResource[]>(defaultResources);
  const [bookmarkedResourceIds, setBookmarkedResourceIds] = useState<string[]>(() =>
    storageService.getBookmarkedResourceIds()
  );

  // Query hand-off from Home to Doubt Solver
  const [doubtInitialQuery, setDoubtInitialQuery] = useState('');

  // Modals State
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  // Synchronize Dark Mode class to <html> tag
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    storageService.saveSettings(settings);
  }, [settings]);

  // Persist Profile
  useEffect(() => {
    storageService.saveProfile(profile);
  }, [profile]);

  // Persist Plans
  useEffect(() => {
    storageService.saveStudyPlans(plans);
  }, [plans]);

  // Persist Doubts
  useEffect(() => {
    storageService.saveSolvedDoubts(doubts);
  }, [doubts]);

  // Persist Notes
  useEffect(() => {
    storageService.saveNotes(notes);
  }, [notes]);

  // Persist Quizzes
  useEffect(() => {
    storageService.saveQuizzes(quizzes);
  }, [quizzes]);

  // Persist Logs
  useEffect(() => {
    storageService.saveStudyLogs(studyLogs);
  }, [studyLogs]);

  // Persist Bookmarks
  useEffect(() => {
    storageService.saveBookmarkedResourceIds(bookmarkedResourceIds);
  }, [bookmarkedResourceIds]);

  // Handlers for Plan operations
  const handleSavePlan = (newPlan: StudyPlan) => {
    setPlans((prev) => [newPlan, ...prev]);
    setActivePlanId(newPlan.id);
  };

  const handleDeletePlan = (planId: string) => {
    const updated = plans.filter((p) => p.id !== planId);
    setPlans(updated);
    if (activePlanId === planId && updated.length > 0) {
      setActivePlanId(updated[0].id);
    }
  };

  const handleTogglePlanTask = (planId: string, taskId: string) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.id !== planId) return plan;
        let compCount = 0;
        let totCount = 0;
        const newWeeks = plan.weeks.map((w) => ({
          ...w,
          days: w.days.map((d) => ({
            ...d,
            tasks: d.tasks.map((t) => {
              totCount++;
              if (t.id === taskId) {
                const nextState = !t.completed;
                if (nextState) compCount++;
                return { ...t, completed: nextState };
              }
              if (t.completed) compCount++;
              return t;
            }),
          })),
        }));

        return {
          ...plan,
          weeks: newWeeks,
          completedTasks: compCount,
          totalTasks: totCount,
        };
      })
    );
  };

  const handleAddTaskToPlan = (planId: string, weekIndex: number, dayIndex: number, task: StudyPlanTask) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        const newWeeks = [...p.weeks];
        if (newWeeks[weekIndex]?.days[dayIndex]) {
          newWeeks[weekIndex].days[dayIndex].tasks.push(task);
        }
        return {
          ...p,
          weeks: newWeeks,
          totalTasks: p.totalTasks + 1,
        };
      })
    );
  };

  // Handlers for Doubt operations
  const handleSaveDoubt = (saved: SolvedDoubt) => {
    setDoubts((prev) => {
      const exists = prev.findIndex((d) => d.id === saved.id);
      if (exists >= 0) {
        const copy = [...prev];
        copy[exists] = saved;
        return copy;
      }
      // Update profile doubts count
      setProfile((p) => ({ ...p, doubtsSolved: p.doubtsSolved + 1 }));
      return [saved, ...prev];
    });
  };

  const handleDeleteDoubt = (doubtId: string) => {
    setDoubts((prev) => prev.filter((d) => d.id !== doubtId));
  };

  const handleToggleBookmarkDoubt = (doubtId: string) => {
    setDoubts((prev) =>
      prev.map((d) => (d.id === doubtId ? { ...d, bookmarked: !d.bookmarked } : d))
    );
  };

  const handleLaunchDoubtFromHome = (query: string) => {
    setDoubtInitialQuery(query);
    setCurrentTab('doubts');
  };

  // Handlers for Notes operations
  const handleSaveNote = (newNote: GeneratedNotes) => {
    setNotes((prev) => {
      const exists = prev.findIndex((n) => n.id === newNote.id);
      if (exists >= 0) {
        const copy = [...prev];
        copy[exists] = newNote;
        return copy;
      }
      setProfile((p) => ({ ...p, notesGenerated: p.notesGenerated + 1 }));
      return [newNote, ...prev];
    });
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  // Handlers for Quiz operations
  const handleSaveQuiz = (newQuiz: Quiz) => {
    setQuizzes((prev) => {
      const exists = prev.findIndex((q) => q.id === newQuiz.id);
      if (exists >= 0) {
        const copy = [...prev];
        copy[exists] = newQuiz;
        return copy;
      }
      if (newQuiz.completed) {
        setProfile((p) => ({ ...p, quizzesCompleted: p.quizzesCompleted + 1 }));
      }
      return [newQuiz, ...prev];
    });
  };

  const handleDeleteQuiz = (quizId: string) => {
    setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
  };

  // Handlers for Study Logs & Pomodoro
  const handleAddStudyLog = (log: StudySessionLog) => {
    setStudyLogs((prev) => [log, ...prev]);
    // update total hours in profile
    const addedHours = Math.round((log.minutes / 60) * 10) / 10;
    setProfile((p) => ({
      ...p,
      totalStudyHours: Math.round((p.totalStudyHours + addedHours) * 10) / 10,
    }));
  };

  const handleDeleteStudyLog = (id: string) => {
    setStudyLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const handleLogPomodoroSession = (subject: Subject, minutes: number, notesText: string) => {
    handleAddStudyLog({
      id: 'log_' + Date.now(),
      subject,
      minutes,
      date: new Date().toISOString().split('T')[0],
      notes: notesText,
    });
  };

  // Handlers for Resources
  const handleToggleBookmarkResource = (resourceId: string) => {
    setBookmarkedResourceIds((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleAddResource = (resource: AcademicResource) => {
    setResources((prev) => [resource, ...prev]);
  };

  // Handlers for Academic Goals
  const handleAddGoal = (goal: AcademicGoal) => {
    setProfile((p) => ({
      ...p,
      goals: [...p.goals, goal],
    }));
  };

  const handleUpdateGoalProgress = (goalId: string, newProgress: number) => {
    setProfile((p) => ({
      ...p,
      goals: p.goals.map((g) =>
        g.id === goalId
          ? { ...g, progress: newProgress, completed: newProgress >= 100 }
          : g
      ),
    }));
  };

  const handleToggleGoalComplete = (goalId: string) => {
    setProfile((p) => ({
      ...p,
      goals: p.goals.map((g) =>
        g.id === goalId
          ? { ...g, completed: !g.completed, progress: !g.completed ? 100 : g.progress }
          : g
      ),
    }));
  };

  const handleDeleteGoal = (goalId: string) => {
    setProfile((p) => ({
      ...p,
      goals: p.goals.filter((g) => g.id !== goalId),
    }));
  };

  const handleResetData = () => {
    storageService.resetAllData();
    setProfile(defaultProfile);
    setPlans(storageService.getStudyPlans());
    setDoubts(storageService.getSolvedDoubts());
    setNotes(storageService.getNotes());
    setQuizzes(storageService.getQuizzes());
    setStudyLogs(storageService.getStudyLogs());
    setSettings(defaultSettings);
    setBookmarkedResourceIds(['res_1', 'res_2']);
  };

  const handleLoginSuccess = (updatedData: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updatedData,
    }));
    setIsLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        profile={profile}
        darkMode={settings.darkMode}
        onToggleDarkMode={() =>
          setSettings((prev) => ({ ...prev, darkMode: !prev.darkMode }))
        }
        onOpenPomodoro={() => setShowPomodoro(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenAuth={() => setShowAuth(true)}
        isLoggedIn={isLoggedIn}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {currentTab === 'home' && (
          <HomeDashboard
            profile={profile}
            activePlan={plans.find((p) => p.id === activePlanId) || plans[0]}
            recentDoubts={doubts}
            recentQuizzes={quizzes}
            onSelectTab={setCurrentTab}
            onLaunchDoubt={handleLaunchDoubtFromHome}
            onToggleTask={handleTogglePlanTask}
            onOpenPomodoro={() => setShowPomodoro(true)}
          />
        )}

        {currentTab === 'planner' && (
          <StudyPlanner
            plans={plans}
            activePlanId={activePlanId}
            onSelectPlan={setActivePlanId}
            onSavePlan={handleSavePlan}
            onDeletePlan={handleDeletePlan}
            onToggleTask={handleTogglePlanTask}
            onAddTaskToPlan={handleAddTaskToPlan}
          />
        )}

        {currentTab === 'doubts' && (
          <DoubtSolver
            doubts={doubts}
            onSaveDoubt={handleSaveDoubt}
            onDeleteDoubt={handleDeleteDoubt}
            onToggleBookmark={handleToggleBookmarkDoubt}
            initialQuery={doubtInitialQuery}
          />
        )}

        {currentTab === 'notes' && (
          <NotesGenerator
            notes={notes}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
          />
        )}

        {currentTab === 'quiz' && (
          <QuizGenerator
            quizzes={quizzes}
            onSaveQuiz={handleSaveQuiz}
            onDeleteQuiz={handleDeleteQuiz}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressTracker
            profile={profile}
            studyLogs={studyLogs}
            onAddLog={handleAddStudyLog}
            onDeleteLog={handleDeleteStudyLog}
            targetDailyMinutes={settings.dailyStudyGoalMinutes}
          />
        )}

        {currentTab === 'resources' && (
          <ResourcesLibrary
            resources={resources}
            bookmarkedIds={bookmarkedResourceIds}
            onToggleBookmark={handleToggleBookmarkResource}
            onAddResource={handleAddResource}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            profile={profile}
            onUpdateProfile={setProfile}
            onAddGoal={handleAddGoal}
            onUpdateGoalProgress={handleUpdateGoalProgress}
            onToggleGoalComplete={handleToggleGoalComplete}
            onDeleteGoal={handleDeleteGoal}
          />
        )}

        {currentTab === 'settings' && (
          <div className="max-w-2xl mx-auto">
            {/* Direct view for settings tab if clicked */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Application Settings
              </h2>
              <button
                onClick={() => setShowSettings(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Open Settings Preferences
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <PomodoroModal
        isOpen={showPomodoro}
        onClose={() => setShowPomodoro(false)}
        onLogSession={handleLogPomodoroSession}
        soundEnabled={settings.soundEffects}
        defaultWorkMinutes={settings.pomodoroWorkMinutes}
        defaultBreakMinutes={settings.pomodoroBreakMinutes}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        onResetData={handleResetData}
      />

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLoginSuccess={handleLoginSuccess}
        currentProfile={profile}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">StudyMate AI</span>
            <span>·</span>
            <span>AI-Powered Academic Assistant for Students</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setCurrentTab('home')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentTab('planner')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            >
              Study Planner
            </button>
            <button
              onClick={() => setCurrentTab('doubts')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            >
              Doubt Solver
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
            >
              Settings
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
