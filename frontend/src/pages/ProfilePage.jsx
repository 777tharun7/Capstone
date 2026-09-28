import React, { useState, useEffect } from 'react';
import { 
  User, 
  RotateCcw, 
  Activity, 
  Award, 
  Heart, 
  Sparkles, 
  Clock,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { getUserProfile as getApiUserProfile, resetUserSession } from '../services/api';
import { getUserProfile as getStaticUserProfile } from '../utils/userProfiles';

export default function ProfilePage({ currentUser }) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const persona = getStaticUserProfile(currentUser);

  useEffect(() => {
    fetchProfile();
  }, [currentUser]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await getApiUserProfile(currentUser);
      setProfile(data);
    } catch (e) {
      console.error("Error loading user profile", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = async () => {
    try {
      await resetUserSession(currentUser);
      await fetchProfile();
    } catch (e) {
      console.error("Error resetting session", e);
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="py-12 flex justify-center text-slate-500 text-xs font-medium">
        Loading dynamic user state...
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300">
      
      {/* User Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className={`w-14 h-14 rounded-2xl ${persona.avatarBg || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-xl shadow-md`}>
            {persona.initials || "TD"}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900">{persona.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                {persona.role}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-mono">
              User ID: #{profile.user_id} • Favorite Genre: <span className="text-slate-800 font-semibold">{persona.favoriteGenre}</span>
            </p>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              {persona.bio}
            </p>
          </div>
        </div>

        <button
          onClick={handleResetSession}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors flex-shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Session History</span>
        </button>
      </div>

      {/* Dynamic Session State Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Current Session Step</span>
          <p className="text-2xl font-bold font-mono text-slate-900 mt-1">
            Step #{profile.session_step}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Cumulative Session Return</span>
          <p className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            {profile.cumulative_reward >= 0 ? `+${profile.cumulative_reward.toFixed(1)}` : profile.cumulative_reward.toFixed(1)}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Dynamic Satisfaction</span>
          <p className="text-2xl font-bold font-mono text-blue-600 mt-1">
            {Math.round(profile.satisfaction * 100)}%
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Fatigue / Boredom Index</span>
          <p className="text-2xl font-bold font-mono text-amber-600 mt-1">
            {Math.round(profile.fatigue * 100)}%
          </p>
        </div>

      </div>

      {/* Dynamic Category Affinity Distribution */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Dynamic Genre Preference Vector (19 Dimensions)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Evolves in real-time as user interacts with recommendations</p>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">S_t Genre Features</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
          {profile.genre_affinities && profile.genre_affinities.map((g) => (
            <div key={g.genre} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 truncate">{g.genre}</span>
                <span className="font-mono text-blue-700 text-[11px] font-bold">
                  {(g.affinity * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, g.affinity * 400)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Interaction Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Session Interaction History</h3>
          <span className="text-xs font-mono text-slate-500">Step Log</span>
        </div>
        
        {profile.recent_history && profile.recent_history.length > 0 ? (
          <div className="p-4 divide-y divide-slate-100 text-xs">
            {profile.recent_history.map((entry, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-slate-400 font-semibold">#{entry.step}</span>
                  <div>
                    <span className="font-bold text-slate-900 block">{entry.item_title}</span>
                    <span className="text-slate-500 text-[11px]">{entry.genre} • Model: {entry.model}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase font-semibold border ${
                    entry.interaction === 'like' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    entry.interaction === 'click' ? 'bg-cyan-50 text-cyan-700 border-cyan-200' :
                    entry.interaction === 'share' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {entry.interaction}
                  </span>
                  <span className={`font-mono font-bold ${entry.reward >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {entry.reward >= 0 ? `+${entry.reward.toFixed(1)}` : entry.reward.toFixed(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            No interactions recorded in the current session yet. Go to the Recommendations page to start interacting!
          </div>
        )}
      </div>

    </div>
  );
}
