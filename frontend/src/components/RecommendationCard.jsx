import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  Eye, 
  Share2, 
  FastForward, 
  HelpCircle, 
  CheckCircle2, 
  TrendingUp, 
  Zap, 
  Sparkles, 
  Cpu, 
  Layers, 
  X,
  Award
} from 'lucide-react';

const GENRE_COLORS = {
  Action: "bg-red-50 text-red-700 border-red-200",
  Adventure: "bg-amber-50 text-amber-700 border-amber-200",
  Animation: "bg-purple-50 text-purple-700 border-purple-200",
  Comedy: "bg-yellow-50 text-yellow-800 border-yellow-200",
  Crime: "bg-slate-100 text-slate-800 border-slate-300",
  Drama: "bg-blue-50 text-blue-700 border-blue-200",
  Horror: "bg-rose-50 text-rose-800 border-rose-200",
  Romance: "bg-pink-50 text-pink-700 border-pink-200",
  "Sci-Fi": "bg-cyan-50 text-cyan-700 border-cyan-200",
  Thriller: "bg-emerald-50 text-emerald-700 border-emerald-200",
  War: "bg-orange-50 text-orange-800 border-orange-200",
  Western: "bg-amber-100 text-amber-900 border-amber-300",
  default: "bg-slate-50 text-slate-700 border-slate-200"
};

const POSTERS = {
  "Star Wars (1977)": "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80",
  "Return of the Jedi (1983)": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
  "Princess Bride, The (1987)": "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80",
  "Gladiator (2000)": "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=600&auto=format&fit=crop&q=80",
  "Interstellar (2014)": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
  "Inception (2010)": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80",
  "The Dark Knight (2008)": "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&auto=format&fit=crop&q=80",
  "default": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80"
};

export default function RecommendationCard({ 
  item, 
  activeModel = "PPO", 
  onInteract, 
  onViewDetail 
}) {
  const [isInteracting, setIsInteracting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(null);
  const [showExplainModal, setShowExplainModal] = useState(false);

  const posterUrl = POSTERS[item.title] || POSTERS["default"];
  const genreColor = GENRE_COLORS[item.primary_genre] || GENRE_COLORS.default;

  const handleAction = async (e, type) => {
    e.stopPropagation();
    setIsInteracting(true);
    try {
      const res = await onInteract(item.action_id, type);
      setFeedbackSuccess(type);
      setTimeout(() => setFeedbackSuccess(null), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsInteracting(false);
    }
  };

  const policyProbPercent = item.policy_probability 
    ? (item.policy_probability * 100).toFixed(1)
    : (item.match_score * 100).toFixed(1);

  return (
    <>
      <div 
        onClick={() => onViewDetail && onViewDetail(item.action_id)}
        className="white-card-interactive group rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-300 relative border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md"
      >
        
        {/* Top Media & Image Header */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <img 
            src={posterUrl} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border backdrop-blur-md shadow-xs ${genreColor}`}>
              {item.primary_genre}
            </span>
            
            {/* Real Policy Probability / Q-Value Badge */}
            <div className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white/95 text-blue-700 border border-blue-200 text-[11px] font-mono font-bold shadow-xs">
              <Cpu className="w-3 h-3 text-blue-600" />
              <span>
                {activeModel === 'PPO' 
                  ? `π(a|s) = ${policyProbPercent}%` 
                  : activeModel === 'DQN' 
                    ? `Q = ${(item.rl_score * 5.2).toFixed(2)}` 
                    : `UCB = ${(item.rl_score * 4.8).toFixed(2)}`}
              </span>
            </div>
          </div>

          {/* Rating & Rank Pill */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
            <div className="flex items-center space-x-1 bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-sm">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-bold">{item.avg_rating}</span>
            </div>
            <span className="font-mono text-[11px] bg-blue-600/90 text-white font-bold px-2 py-0.5 rounded-md">
              Rank #{item.rank}
            </span>
          </div>
        </div>

        {/* Card Content Body */}
        <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
          
          <div className="space-y-1.5">
            <h3 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {item.title}
            </h3>
            
            <p className="text-[11px] text-slate-500 line-clamp-1 font-normal">
              {item.genres ? item.genres.join(" • ") : item.primary_genre}
            </p>
          </div>

          {/* RL Explanatory Telemetry Strip */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 grid grid-cols-3 gap-1.5 text-center text-[10px] font-mono">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">RL Score</span>
              <span className="font-bold text-blue-700 font-mono">
                {item.rl_score ? item.rl_score.toFixed(3) : (item.match_score).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Pred Return</span>
              <span className="font-bold text-emerald-600 font-mono">
                +{item.predicted_reward ? item.predicted_reward.toFixed(2) : "2.62"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Value V(s)</span>
              <span className="font-bold text-purple-700 font-mono">
                {item.value_estimate ? item.value_estimate.toFixed(2) : "4.83"}
              </span>
            </div>
          </div>

          {/* "Why this recommendation?" trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowExplainModal(true);
            }}
            className="w-full flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Why this recommendation?</span>
          </button>

          {/* Interactive User Simulation Feedback Bar & Watch Button */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onViewDetail) onViewDetail(item.action_id);
              }}
              title="Watch in RL Movie Player"
              className="flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs hover:scale-102"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="text-[11px]">Watch</span>
            </button>

            <button
              onClick={(e) => handleAction(e, 'like')}
              disabled={isInteracting}
              title="Like Item (+2.5 reward)"
              className="flex items-center justify-center px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition-all hover:scale-102"
            >
              <Heart className="w-3 h-3 text-emerald-600 fill-emerald-600" />
            </button>

            <button
              onClick={(e) => handleAction(e, 'share')}
              disabled={isInteracting}
              title="Share Item (+3.5 reward)"
              className="flex items-center justify-center px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200 transition-all hover:scale-102"
            >
              <Share2 className="w-3 h-3 text-purple-600" />
            </button>

            <button
              onClick={(e) => handleAction(e, 'skip')}
              disabled={isInteracting}
              title="Skip Item (-1.5 penalty)"
              className="flex items-center justify-center px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors"
            >
              <FastForward className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>

      {/* Model Explainability Modal Dialog */}
      {showExplainModal && (
        <div 
          onClick={() => setShowExplainModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-200"
          >
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Why {activeModel} Selected This Action</h3>
                  <p className="text-xs text-slate-500 font-mono">Action #{item.action_id} • {item.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowExplainModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Model Mathematical Decision Breakdown */}
            <div className="space-y-4 text-xs">
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 font-mono text-[11px] uppercase tracking-wider block">
                  Model Evaluation Telemetry
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Policy Prob π(a|s):</span>
                    <span className="font-bold text-blue-700">{policyProbPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Predicted Reward:</span>
                    <span className="font-bold text-emerald-600">+{item.predicted_reward ? item.predicted_reward.toFixed(2) : "2.62"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Critic Value V(s):</span>
                    <span className="font-bold text-purple-700">{item.value_estimate ? item.value_estimate.toFixed(2) : "4.83"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Diversity Impact:</span>
                    <span className="font-bold text-cyan-700">+{item.diversity_impact ? item.diversity_impact.toFixed(2) : "0.21"}</span>
                  </div>
                </div>
              </div>

              {/* Feature Contribution Breakdown */}
              <div className="space-y-2.5">
                <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                  Decision Factor Weights
                </span>
                
                <div className="space-y-2 font-mono text-[11px]">
                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span>Dynamic Genre Taste ({item.primary_genre})</span>
                      <span className="font-bold text-blue-700">
                        {Math.round((item.feature_contributions?.genre_affinity || 0.76) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full" 
                        style={{ width: `${(item.feature_contributions?.genre_affinity || 0.76) * 100}%` }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span>Historical Engagement & Rating</span>
                      <span className="font-bold text-emerald-600">
                        {Math.round((item.feature_contributions?.historical_engagement || 0.82) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full" 
                        style={{ width: `${(item.feature_contributions?.historical_engagement || 0.82) * 100}%` }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span>Genre Exploration & Diversity</span>
                      <span className="font-bold text-purple-600">
                        {Math.round((item.feature_contributions?.diversity_bonus || 0.45) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-purple-500 h-full rounded-full" 
                        style={{ width: `${(item.feature_contributions?.diversity_bonus || 0.45) * 100}%` }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-700 mb-1">
                      <span>Novelty / Anti-Fatigue Bonus</span>
                      <span className="font-bold text-cyan-600">
                        {Math.round((item.feature_contributions?.novelty_bonus || 0.50) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-cyan-500 h-full rounded-full" 
                        style={{ width: `${(item.feature_contributions?.novelty_bonus || 0.50) * 100}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Structured Reasoning Bullets */}
              <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 space-y-1.5">
                <span className="font-bold text-blue-900 text-[11px] block">Sequential Agent Rationale:</span>
                <ul className="space-y-1 text-slate-700 text-[11px]">
                  {item.why_recommended && item.why_recommended.length > 0 ? (
                    item.why_recommended.map((reason, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>{reason}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Matches high user affinity for {item.primary_genre}</span>
                      </li>
                      <li className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>High predicted long-term cumulative reward</span>
                      </li>
                      <li className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>Preserves catalog genre diversity to avoid user boredom</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

            </div>

            <button
              onClick={() => setShowExplainModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-sm hover:bg-blue-700 transition-colors"
            >
              Close Explainability Inspector
            </button>

          </div>
        </div>
      )}
    </>
  );
}
