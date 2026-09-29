import React, { useState } from 'react';
import { 
  GraduationCap, 
  Sparkles, 
  Calendar, 
  HelpCircle, 
  BookOpen, 
  Award, 
  BarChart3, 
  Library, 
  Flame, 
  Clock, 
  Sun, 
  Moon, 
  Settings as SettingsIcon, 
  Menu, 
  X,
  User,
  ChevronDown
} from 'lucide-react';
import { NavigationTab, UserProfile } from '../types';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  profile: UserProfile;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenPomodoro: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  profile,
  darkMode,
  onToggleDarkMode,
  onOpenPomodoro,
  onOpenSettings,
  onOpenAuth,
  isLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: GraduationCap },
    { id: 'planner', label: 'Study Planner', icon: Calendar },
    { id: 'doubts', label: 'Doubt Solver', icon: HelpCircle },
    { id: 'notes', label: 'Notes Gen', icon: BookOpen },
    { id: 'quiz', label: 'Quiz Gen', icon: Award },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'resources', label: 'Resources', icon: Library },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
              <Sparkles className="w-2.5 h-2.5 absolute top-1 right-1 text-amber-300 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none flex items-center gap-1.5">
                StudyMate <span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] font-medium tracking-wide uppercase text-slate-500 dark:text-slate-400">
                Academic Assistant
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as NavigationTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2">
            
            {/* Study Streak indicator */}
            <div 
              title={`${profile.streakDays} days study streak!`}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/50 rounded-lg text-amber-700 dark:text-amber-400 text-xs font-semibold cursor-default"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-bounce" />
              <span>{profile.streakDays}d Streak</span>
            </div>

            {/* Quick Pomodoro Launcher */}
            <button
              onClick={onOpenPomodoro}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              title="Open Focus Pomodoro Timer"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span className="hidden md:inline">Focus Timer</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Settings & Preferences"
              aria-label="Open Settings"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>

            {/* Profile / Auth Menu */}
            <div className="relative">
              {isLoggedIn ? (
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <span className="hidden md:inline text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[90px]">
                    {profile.name.split(' ')[0]}
                  </span>
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-7 h-7 rounded-full object-cover border border-indigo-200 dark:border-indigo-900"
                  />
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
              )}

              {/* Profile Dropdown */}
              {profileDropdownOpen && isLoggedIn && (
                <div 
                  className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50 animate-fade-in"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{profile.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{profile.major}</p>
                  </div>
                  <button
                    onClick={() => onSelectTab('profile')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile & Goals</span>
                  </button>
                  <button
                    onClick={() => onSelectTab('progress')}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2 cursor-pointer"
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Study Analytics</span>
                  </button>
                  <button
                    onClick={onOpenSettings}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 flex items-center gap-2 cursor-pointer"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Preferences</span>
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                    <button
                      onClick={onOpenAuth}
                      className="w-full text-left px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
                    >
                      <span>Switch Account / Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as NavigationTab)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1 font-semibold text-amber-600">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {profile.streakDays} Day Study Streak
            </span>
            <button
              onClick={() => {
                handleNavClick('profile');
              }}
              className="text-indigo-600 dark:text-indigo-400 font-semibold cursor-pointer"
            >
              View Profile →
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
