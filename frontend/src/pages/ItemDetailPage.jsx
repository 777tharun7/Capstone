import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  Heart, 
  ThumbsDown, 
  FastForward, 
  Bookmark, 
  Share2, 
  Eye,
  CheckCircle2,
  Film,
  Calendar,
  Clock,
  User,
  Award,
  Play
} from 'lucide-react';
import { getItemDetail, recordInteraction } from '../services/api';
import { getMovieDetails } from '../utils/movieDatabase';

export default function ItemDetailPage({ itemId, onBack, currentUser, activeModel }) {
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);

  useEffect(() => {
    if (itemId !== null && itemId !== undefined) {
      fetchItem();
    }
  }, [itemId]);

  const fetchItem = async () => {
    setIsLoading(true);
    try {
      const data = await getItemDetail(itemId);
      setItem(data);
    } catch (e) {
      console.error("Error loading item details", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (type) => {
    if (!item) return;
    try {
      const res = await recordInteraction(currentUser, item.action_id, type, activeModel);
      setFeedbackToast({
        type: res.interaction_type,
        reward: res.reward
      });
      setTimeout(() => setFeedbackToast(null), 3000);
    } catch (e) {
      console.error("Error recording interaction", e);
    }
  };

  if (isLoading || !item) {
    return (
      <div className="py-16 flex flex-col items-center justify-center space-y-3 text-slate-500 text-xs font-medium">
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        <span>Loading authentic movie metadata & feature vectors...</span>
      </div>
    );
  }

  const meta = getMovieDetails(item.title, item.primary_genre);

  return (
    <div className="space-y-4 py-2 animate-in fade-in duration-200 max-w-5xl mx-auto">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-1.5 text-xs text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 transition-colors w-fit border border-slate-200 shadow-2xs font-bold"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-blue-600" />
        <span>Back to Recommendations</span>
      </button>

      {/* Main Item Hero Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-soft-sm">
        
        {/* Banner with Backdrop */}
        <div className="relative h-64 sm:h-72 bg-slate-900 overflow-hidden">
          <img 
            src={meta.backdrop || meta.poster} 
            alt={item.title} 
            className="w-full h-full object-cover opacity-45 blur-xs scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Floating Content */}
          <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-between text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs shadow-sm">
                  {item.primary_genre}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-white">
                  {meta.year}
                </span>
              </div>
              <span className="text-xs font-mono text-white/90 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                Action #{item.action_id} • MovieLens ID #{item.item_id}
              </span>
            </div>

            {/* Bottom Title Info */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <span className="text-xs text-blue-300 font-mono tracking-wider italic">
                  "{meta.tagline}"
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white drop-shadow-md tracking-tight">
                  {item.title}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/90 pt-1">
                  <div className="flex items-center space-x-1 bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{item.avg_rating} / 5.0 (MovieLens)</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/10 px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3 h-3 text-cyan-300" />
                    <span>{meta.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/10 px-2.5 py-0.5 rounded-full">
                    <User className="w-3 h-3 text-purple-300" />
                    <span>Dir: {meta.director}</span>
                  </div>
                </div>
              </div>

              {/* Watch Now Button */}
              <button
                onClick={() => handleAction('click')}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all transform hover:scale-105 flex-shrink-0"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Simulate Watch Event</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Toast Notification */}
          {feedbackToast && (
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between text-xs text-emerald-900 shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Interaction <strong>{feedbackToast.type.toUpperCase()}</strong> dispatched to RL Policy Buffer</span>
              </div>
              <span className="font-mono font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300">
                +{feedbackToast.reward.toFixed(2)} R_t Reward
              </span>
            </div>
          )}

          {/* Synopsis & Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Synopsis & Cast */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1.5">Movie Synopsis</h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {meta.overview}
                </p>
              </div>

              {/* Cast List */}
              <div>
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono mb-2">
                  Featured Cast
                </h3>
                <div className="flex flex-wrap gap-2">
                  {meta.cast.map((actor) => (
                    <span key={actor} className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-2xs">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Quick Telemetry Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block font-sans">
                Dataset Metadata
              </span>
              <div className="space-y-2 text-slate-700">
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Benchmark Rating:</span>
                  <span className="font-bold text-amber-600">{item.avg_rating} ★</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Popularity Index:</span>
                  <span className="font-bold text-blue-700">{Math.round(item.popularity * 100)}%</span>
                </div>
                <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                  <span className="text-slate-500">Action Index:</span>
                  <span className="font-bold text-purple-700">#{item.action_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Active Model:</span>
                  <span className="font-bold text-emerald-700">{activeModel}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Simulation Toolbar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-900 font-extrabold block">Simulate Sequential RL Interaction:</span>
              <span className="text-[11px] text-slate-500">Test how the policy network updates state transition $S_{t+1}$ on feedback</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleAction('click')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 text-cyan-700 text-xs font-semibold border border-cyan-200 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Click (+1)</span>
              </button>
              <button
                onClick={() => handleAction('like')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition-colors"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Like (+3)</span>
              </button>
              <button
                onClick={() => handleAction('share')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share (+5)</span>
              </button>
              <button
                onClick={() => handleAction('skip')}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Skip (-2)</span>
              </button>
            </div>
          </div>

          {/* Feature Vector Inspection (21 Dimensions) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Item Feature Representation (21 Dimensions)</h3>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                19 Genres One-Hot + Normalized Rating + Normalized Popularity
              </span>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap gap-1.5 text-xs font-mono">
              {item.feature_vector && item.feature_vector.map((val, idx) => (
                <div key={idx} className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-slate-400 mr-1 text-[10px]">v{idx}:</span>
                  <span className={val > 0 ? "text-blue-700 font-bold" : "text-slate-400"}>
                    {val.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
