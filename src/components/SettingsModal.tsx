import React from 'react';
import { 
  X, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Sparkles, 
  Clock, 
  Volume2, 
  Bell, 
  Download, 
  RotateCcw,
  Check
} from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetData,
}) => {
  if (!isOpen) return null;

  const handleExportData = () => {
    const backupData: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('studymate_')) {
        backupData[key] = JSON.parse(localStorage.getItem(key) || '{}');
      }
    }
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studymate_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-800 dark:text-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Preferences & Settings</h3>
              <p className="text-xs text-slate-400">Configure AI pedagogy, theme, goals and study habits</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Appearance & Theme */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Appearance
          </h4>
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
            <div className="flex items-center gap-2.5">
              {settings.darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">Dark Mode</div>
                <div className="text-[11px] text-slate-400">Reduce eye strain during late-night study sessions</div>
              </div>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, darkMode: !settings.darkMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                settings.darkMode ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section 2: AI Assistant Pedagogy Persona */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Pedagogy Persona</span>
          </h4>
          
          <div className="space-y-2">
            {[
              {
                id: 'socratic',
                title: 'Socratic Method',
                desc: 'Guides you with probing step-by-step questions and derivations so you discover the concept yourself.',
              },
              {
                id: 'concise',
                title: 'Concise & High-Yield',
                desc: 'Straight to the point with bulleted checklists and formula summaries for quick exam review.',
              },
              {
                id: 'comprehensive',
                title: 'Comprehensive & Formal',
                desc: 'Deep theoretical rigor with full mathematical proofs, history, and real-world system applications.',
              },
            ].map((p) => {
              const isSelected = settings.aiPersona === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => onUpdateSettings({ ...settings, aiPersona: p.id as any })}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500 text-indigo-950 dark:text-white'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{p.title}</span>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Study Goals & Pomodoro Defaults */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Study Goals & Focus Timer</span>
          </h4>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white">Daily Study Target</span>
                <p className="text-[11px] text-slate-400">{Math.round(settings.dailyStudyGoalMinutes / 60 * 10) / 10} hours / day</p>
              </div>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {settings.dailyStudyGoalMinutes} mins
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="420"
              step="30"
              value={settings.dailyStudyGoalMinutes}
              onChange={(e) => onUpdateSettings({ ...settings, dailyStudyGoalMinutes: parseInt(e.target.value) })}
              className="w-full accent-indigo-600"
            />

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">Focus Block (mins)</label>
                <input
                  type="number"
                  min="15"
                  max="90"
                  value={settings.pomodoroWorkMinutes}
                  onChange={(e) => onUpdateSettings({ ...settings, pomodoroWorkMinutes: parseInt(e.target.value) || 25 })}
                  className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">Short Break (mins)</label>
                <input
                  type="number"
                  min="2"
                  max="30"
                  value={settings.pomodoroBreakMinutes}
                  onChange={(e) => onUpdateSettings({ ...settings, pomodoroBreakMinutes: parseInt(e.target.value) || 5 })}
                  className="w-full py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Sound & Notifications */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Audio & Alerts
          </h4>
          
          <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
            <div className="flex items-center gap-2 text-xs">
              <Volume2 className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">Timer Sound Chimes</span>
            </div>
            <button
              onClick={() => onUpdateSettings({ ...settings, soundEffects: !settings.soundEffects })}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                settings.soundEffects ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  settings.soundEffects ? 'translate-x-4.5' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section 5: Data Management */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Data Management
          </h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleExportData}
              className="flex-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all demo data back to default initial state?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="flex-1 flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
