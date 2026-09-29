import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, X, CheckCircle, Clock } from 'lucide-react';
import { Subject } from '../types';

interface PomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogSession: (subject: Subject, minutes: number, notes: string) => void;
  soundEnabled: boolean;
  defaultWorkMinutes: number;
  defaultBreakMinutes: number;
}

export const PomodoroModal: React.FC<PomodoroModalProps> = ({
  isOpen,
  onClose,
  onLogSession,
  soundEnabled,
  defaultWorkMinutes,
  defaultBreakMinutes,
}) => {
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [timeLeft, setTimeLeft] = useState(defaultWorkMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(soundEnabled);
  const [selectedSubject, setSelectedSubject] = useState<Subject>('Computer Science');
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionsCompleted, setSessionsCompleted] = useState(3);
  const [showLogSuccess, setShowLogSuccess] = useState(false);

  useEffect(() => {
    if (mode === 'work') setTimeLeft(defaultWorkMinutes * 60);
    else if (mode === 'shortBreak') setTimeLeft(defaultBreakMinutes * 60);
    else setTimeLeft(15 * 60);
    setIsRunning(false);
  }, [mode, defaultWorkMinutes, defaultBreakMinutes]);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      // Play audio chime if enabled
      if (soundOn) {
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.value = 587.33; // D5
          gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
          osc.start();
          osc.stop(audioCtx.currentTime + 1.2);
        } catch (e) {
          // ignore web audio restrictions
        }
      }
      if (mode === 'work') {
        setSessionsCompleted((prev) => prev + 1);
        onLogSession(selectedSubject, defaultWorkMinutes, sessionNotes || 'Focused Pomodoro Study Block');
        setShowLogSuccess(true);
        setTimeout(() => setShowLogSuccess(false), 4000);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, soundOn, onLogSession, selectedSubject, defaultWorkMinutes, sessionNotes]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalTimeForMode = mode === 'work' ? defaultWorkMinutes * 60 : mode === 'shortBreak' ? defaultBreakMinutes * 60 : 15 * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalTimeForMode - timeLeft) / totalTimeForMode) * 100));

  const handleManualLog = () => {
    const elapsedMinutes = Math.max(1, Math.round((totalTimeForMode - timeLeft) / 60));
    onLogSession(selectedSubject, elapsedMinutes, sessionNotes || `${mode === 'work' ? 'Study' : 'Break'} Session`);
    setShowLogSuccess(true);
    setTimeout(() => setShowLogSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Pomodoro Focus Timer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Deep study sprints with spaced recovery</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundOn(!soundOn)}
              aria-label="Toggle Sound"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              aria-label="Close Modal"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex p-1 mt-5 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => setMode('work')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'work'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Focus Work ({defaultWorkMinutes}m)
          </button>
          <button
            onClick={() => setMode('shortBreak')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'shortBreak'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Short Break ({defaultBreakMinutes}m)
          </button>
          <button
            onClick={() => setMode('longBreak')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'longBreak'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative flex flex-col items-center justify-center my-6">
          <div className="text-6xl font-extrabold tracking-tight font-mono text-slate-900 dark:text-white">
            {formattedTime}
          </div>
          
          <div className="w-full max-w-xs mt-4 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                mode === 'work' ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span>Completed Today:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">{sessionsCompleted} sessions</span>
            <span aria-hidden="true">·</span>
            <span>{sessionsCompleted * defaultWorkMinutes} mins focused</span>
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white shadow-md transition-all active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" /> Start Timer
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setTimeLeft(totalTimeForMode);
            }}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Session Subject & Note Logger */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span>Log Study Goal</span>
            <button
              onClick={handleManualLog}
              className="text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Log current progress now
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as Subject)}
              className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
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

            <input
              type="text"
              placeholder="Topic or task notes..."
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              className="w-full text-xs py-2 px-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {showLogSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 animate-fade-in font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Session logged successfully to your Progress Tracker!</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
