import React, { useState, useEffect, useRef } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Sliders, 
  User, 
  Activity, 
  BarChart3, 
  Layers, 
  FlaskConical, 
  GitCompare, 
  Info, 
  Film,
  Zap,
  Home,
  ChevronDown,
  Sun,
  Moon,
  Database,
  FlaskRound,
  BookOpen,
  Bell,
  CheckCheck,
  X,
  ExternalLink,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { getModelStatus, selectModel, listDemoUsers } from '../services/api';
import { getUserProfile } from '../utils/userProfiles';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  currentUser, 
  setCurrentUser, 
  activeModel, 
  setActiveModel,
  onOpenRewardModal 
}) {
  const [models, setModels] = useState([]);
  const [users, setUsers] = useState([]);
  const [isChangingModel, setIsChangingModel] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // 1. Dark Mode State & Logic
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  // 2. Notification Center State & Logic
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'PPO Model Ready',
      desc: 'Pre-trained Actor-Critic policy (300 episodes, +28.6 return) is active.',
      time: 'Just now',
      type: 'model',
      unread: true,
      page: 'models',
      icon: Zap,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400'
    },
    {
      id: 2,
      title: 'Fatigue Simulator Active',
      desc: 'Dynamic MDP environment tracking user boredom and consecutive skips.',
      time: '12m ago',
      type: 'system',
      unread: true,
      page: 'rl-demo',
      icon: TrendingUp,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400'
    },
    {
      id: 3,
      title: 'Benchmark Results Ready',
      desc: 'PPO outperforms Collaborative Filtering by +340% in multi-objective return.',
      time: '1h ago',
      type: 'benchmark',
      unread: false,
      page: 'evaluation',
      icon: GitCompare,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400'
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const dismissNotification = (id, e) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (item) => {
    // Mark as read
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, unread: false } : n));
    setIsNotificationOpen(false);
    if (item.page) {
      setActivePage(item.page);
    }
  };

  // Dropdown close on outside click
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchUsers();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await getModelStatus();
      setModels(data.models || []);
      if (data.active_model) {
        setActiveModel(data.active_model);
      }
    } catch (e) {
      console.error("Error fetching model status", e);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await listDemoUsers(20);
      setUsers(data || []);
    } catch (e) {
      console.error("Error fetching demo users", e);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'recommendations', label: 'Recommendations', icon: Film },
    { id: 'rl-demo', label: 'Live RL', icon: Zap },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'evaluation', label: 'Evaluation', icon: GitCompare },
    { id: 'models', label: 'Models', icon: Layers },
    { id: 'experiments', label: 'Experiments', icon: FlaskConical },
    { id: 'about', label: 'Research', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-soft-sm transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Brand matching screenshot */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0"
            onClick={() => setActivePage('home')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-blue-600 p-0.5 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  RecSys <span className="text-blue-600 dark:text-blue-400 font-black">RL</span>
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-none">
                Adaptive Long-Term Engagement
              </p>
            </div>
          </div>

          {/* Center Navigation Bar */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700/60 font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls matching screenshot */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            
            {/* Sun / Moon Theme Switch (Interactive) */}
            <button 
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-1 text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95 transition-all shadow-xs"
            >
              <span className={`p-1.5 rounded-full transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-900 text-indigo-400 shadow-inner' 
                  : 'bg-white text-amber-500 shadow-xs'
              }`}>
                {isDark ? (
                  <Moon className="w-3.5 h-3.5 animate-in spin-in-90 duration-200" />
                ) : (
                  <Sun className="w-3.5 h-3.5 animate-in spin-in-90 duration-200" />
                )}
              </span>
            </button>

            {/* Notification Bell with Dropdown (Interactive) */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                aria-label="Notifications"
                title="System Notifications"
                className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors focus:outline-none"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 dark:text-white text-xs">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-bold font-mono">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
                      >
                        <CheckCheck className="w-3 h-3" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No notifications at the moment.
                      </div>
                    ) : (
                      notifications.map(item => {
                        const Icon = item.icon || Bell;
                        return (
                          <div
                            key={item.id}
                            onClick={() => handleNotificationClick(item)}
                            className={`p-3.5 text-xs flex items-start space-x-3 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors cursor-pointer ${
                              item.unread ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                            }`}
                          >
                            <div className={`p-2 rounded-xl flex-shrink-0 ${item.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`font-bold truncate text-xs ${item.unread ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                  {item.title}
                                </span>
                                <span className="text-[10px] text-slate-400 ml-2 font-mono flex-shrink-0">
                                  {item.time}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                                {item.desc}
                              </p>
                              <div className="mt-1.5 flex items-center space-x-2">
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center space-x-0.5">
                                  <span>View in {item.page}</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => dismissNotification(item.id, e)}
                              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
                              title="Dismiss"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="px-4 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      onClick={() => {
                        setActivePage('about');
                        setIsNotificationOpen(false);
                      }}
                      className="text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      RL System Status: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">Online & Fully Synced</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar Pill (Real Names) */}
            <div className="relative" ref={userRef}>
              <div 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full py-1 pl-1 pr-3 cursor-pointer transition-colors"
              >
                <div className={`w-7 h-7 rounded-full ${getUserProfile(currentUser).avatarBg || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                  {getUserProfile(currentUser).initials || "TD"}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 dark:text-white leading-none">
                    {getUserProfile(currentUser).shortName}
                  </span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-400 font-medium leading-none mt-0.5">
                    {getUserProfile(currentUser).role.split(' ')[0]}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </div>

              {/* User Dropdown with Real Names */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Switch User Persona
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(uid => {
                      const prof = getUserProfile(uid);
                      const isCur = currentUser === uid;
                      return (
                        <button
                          key={uid}
                          onClick={() => {
                            setCurrentUser(uid);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                            isCur ? 'bg-blue-50/80 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className={`w-6 h-6 rounded-full ${prof.avatarBg} text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
                              {prof.initials}
                            </div>
                            <div className="truncate">
                              <span className="block truncate font-bold text-slate-900 dark:text-white text-xs">{prof.name}</span>
                              <span className="block text-[10px] text-slate-400 font-medium truncate">{prof.role}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono ml-2">#{uid}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1.5 px-2">
                    <button
                      onClick={() => {
                        setActivePage('login');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-center py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 text-xs text-blue-600 dark:text-blue-400 font-bold transition-colors"
                    >
                      View All Personas →
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-200 dark:border-slate-800 space-x-1.5 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex-shrink-0 flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
