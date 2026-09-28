import React, { useState, useEffect } from 'react';
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
  Bell
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

  const handleModelChange = async (e) => {
    const newModel = e.target.value;
    setIsChangingModel(true);
    try {
      await selectModel(newModel);
      setActiveModel(newModel);
    } catch (e) {
      console.error("Error switching model", e);
    } finally {
      setIsChangingModel(false);
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-soft-sm">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Brand matching screenshot */}
          <div 
            className="flex items-center space-x-2.5 cursor-pointer group flex-shrink-0"
            onClick={() => setActivePage('home')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-blue-600 p-0.5 shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900">
                  RecSys <span className="text-blue-600 font-black">RL</span>
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 leading-none">
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
                      ? 'bg-blue-50 text-blue-600 border border-blue-200 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls matching screenshot */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            
            {/* Sun / Theme Switch */}
            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-full p-1 text-slate-600 cursor-pointer">
              <span className="p-1 rounded-full bg-white shadow-xs text-amber-500">
                <Sun className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Notification Bell with Red Dot */}
            <div className="relative cursor-pointer p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                1
              </span>
            </div>

            {/* User Profile Avatar Pill (Real Names) */}
            <div className="relative">
              <div 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-full py-1 pl-1 pr-3 cursor-pointer transition-colors"
              >
                <div className={`w-7 h-7 rounded-full ${getUserProfile(currentUser).avatarBg || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                  {getUserProfile(currentUser).initials || "TD"}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-none">
                    {getUserProfile(currentUser).shortName}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium leading-none mt-0.5">
                    {getUserProfile(currentUser).role.split(' ')[0]}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </div>

              {/* User Dropdown with Real Names */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
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
                          className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                            isCur ? 'bg-blue-50/80 text-blue-600 font-bold' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className={`w-6 h-6 rounded-full ${prof.avatarBg} text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>
                              {prof.initials}
                            </div>
                            <div className="truncate">
                              <span className="block truncate font-bold text-slate-900 text-xs">{prof.name}</span>
                              <span className="block text-[10px] text-slate-400 font-medium truncate">{prof.role}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono ml-2">#{uid}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-slate-100 mt-1 pt-1.5 px-2">
                    <button
                      onClick={() => {
                        setActivePage('login');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-center py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-blue-600 font-bold transition-colors"
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
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-200 space-x-1.5 scrollbar-none">
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
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100'
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
