import React, { useState, useEffect } from 'react';
import { User, CheckCircle2, ArrowRight, Sparkles, Film, Star, Award, Heart } from 'lucide-react';
import { listDemoUsers } from '../services/api';
import { getUserProfile, REAL_USERS } from '../utils/userProfiles';

export default function LoginPage({ currentUser, setCurrentUser, setActivePage }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await listDemoUsers(16);
      if (data && data.length > 0) {
        setUsers(data);
      } else {
        setUsers(REAL_USERS);
      }
    } catch (e) {
      console.error("Error loading demo users", e);
      setUsers(REAL_USERS);
    }
  };

  const handleSelect = (uid) => {
    setCurrentUser(uid);
    setActivePage('recommendations');
  };

  return (
    <div className="max-w-[1400px] mx-auto py-6 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold shadow-xs">
          <User className="w-3.5 h-3.5 text-blue-600" />
          <span>Research User Simulation Persona Switcher</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Select User Persona
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Switch between real human personas with authentic dynamic taste distributions, sequential interaction histories, and genre affinities to evaluate multi-step RL policy adaptation.
        </p>
      </div>

      {/* Grid of Real Personas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {users.map((u) => {
          const prof = getUserProfile(u.user_id);
          const isSelected = currentUser === u.user_id;
          const ratingsCount = u.total_interactions || 140;
          const avgRating = u.avg_rating || 4.2;

          return (
            <div
              key={u.user_id}
              onClick={() => handleSelect(u.user_id)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 group ${
                isSelected
                  ? 'bg-gradient-to-b from-blue-50/70 to-white border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                  : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              {/* Header with Avatar & Badge */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-11 h-11 rounded-xl ${prof.avatarBg || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-sm shadow-sm flex-shrink-0`}>
                    {prof.initials || "U"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                      {prof.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-blue-600 block mt-0.5 truncate">
                      {prof.role}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <span className="flex items-center space-x-1 text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full border border-blue-200 flex-shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 flex-shrink-0">
                    #{u.user_id}
                  </span>
                )}
              </div>

              {/* Bio & Genre Affinity */}
              <div className="space-y-2 text-xs">
                <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                  {prof.bio}
                </p>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Favorite Genre:</span>
                    <span className="font-bold text-slate-800">{prof.favoriteGenre}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Ratings in Catalog:</span>
                    <span className="font-mono font-semibold text-slate-700">{ratingsCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Mean Rating:</span>
                    <span className="font-mono font-bold text-amber-600 flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500 inline mr-0.5" />
                      {Number(avgRating).toFixed(1)} / 5.0
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700'
                }`}
              >
                <span>{isSelected ? "Current Active Persona" : "Switch To This Persona"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
