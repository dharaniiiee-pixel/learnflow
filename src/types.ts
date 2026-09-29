/**
 * StudyMate AI - Core Type Definitions
 */

export type NavigationTab = 
  | 'home'
  | 'planner'
  | 'doubts'
  | 'notes'
  | 'quiz'
  | 'progress'
  | 'resources'
  | 'profile'
  | 'settings';

export type Subject = 
  | 'Computer Science'
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'Literature & Writing'
  | 'Economics & Business'
  | 'General Science';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  major: string;
  institution: string;
  year: string;
  targetGpa: string;
  currentGpa: string;
  streakDays: number;
  totalStudyHours: number;
  quizzesCompleted: number;
  notesGenerated: number;
  doubtsSolved: number;
  goals: AcademicGoal[];
}

export interface AcademicGoal {
  id: string;
  title: string;
  subject: Subject;
  progress: number; // 0 - 100
  dueDate: string;
  completed: boolean;
}

export interface StudyPlanTask {
  id: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  topic: string;
}

export interface StudyPlanDay {
  dayNumber: number;
  dayTitle: string;
  focusArea: string;
  tasks: StudyPlanTask[];
}

export interface StudyPlanWeek {
  weekNumber: number;
  title: string;
  objective: string;
  days: StudyPlanDay[];
}

export interface StudyPlan {
  id: string;
  subject: string;
  targetGoal: string;
  examDate: string;
  dailyHours: number;
  learningStyle: 'visual' | 'practical' | 'theoretical' | 'spaced';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  createdAt: string;
  weeks: StudyPlanWeek[];
  totalTasks: number;
  completedTasks: number;
}

export interface DoubtMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  stepBreakdown?: {
    stepNumber: number;
    title: string;
    explanation: string;
    formulaOrCode?: string;
  }[];
  keyConcept?: string;
  commonPitfall?: string;
  followUpQuestion?: string;
}

export interface SolvedDoubt {
  id: string;
  title: string;
  subject: Subject;
  question: string;
  messages: DoubtMessage[];
  createdAt: string;
  bookmarked: boolean;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  conceptTag: string;
}

export interface GeneratedNotes {
  id: string;
  title: string;
  subject: Subject;
  format: 'cornell' | 'cheatsheet' | 'summary' | 'flashcards';
  createdAt: string;
  sourceText?: string;
  // Cornell Notes specific fields
  cornell?: {
    cues: string[];
    notes: { section: string; points: string[] }[];
    summary: string;
  };
  // Cheatsheet specific
  cheatsheet?: {
    keyTerms: { term: string; definition: string }[];
    formulas: { name: string; formula: string; explanation: string }[];
    rulesAndLaws: string[];
    examTips: string[];
  };
  // Summary specific
  summaryContent?: string;
  // Flashcards
  flashcards?: Flashcard[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  userAnswer?: string;
  isCorrect?: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  subject: Subject;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: QuizQuestion[];
  timeLimitMinutes: number;
  completed: boolean;
  score?: number;
  totalScore?: number;
  takenAt?: string;
}

export interface StudySessionLog {
  id: string;
  subject: Subject;
  minutes: number;
  date: string;
  notes: string;
}

export interface AcademicResource {
  id: string;
  title: string;
  subject: Subject;
  category: 'Cheat Sheet' | 'Textbook Guide' | 'Interactive Tool' | 'Video Playlist' | 'Formula Sheet';
  description: string;
  authorOrSource: string;
  url: string;
  isBookmarked?: boolean;
  downloadsCount: number;
  tags: string[];
}

export interface UserSettings {
  darkMode: boolean;
  aiPersona: 'socratic' | 'concise' | 'comprehensive';
  dailyStudyGoalMinutes: number;
  soundEffects: boolean;
  notificationsEnabled: boolean;
  pomodoroWorkMinutes: number;
  pomodoroBreakMinutes: number;
}
