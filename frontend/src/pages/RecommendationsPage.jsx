import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  TrendingUp, 
  Award, 
  Layers,
  CheckCircle2,
  Cpu,
  UserCheck,
  Compass,
  Activity,
  ArrowRight,
  HelpCircle,
  X,
  Zap,
  Eye,
  ShieldCheck,
  BarChart3,
  Search,
  ChevronDown,
  Smile,
  Target,
  Bookmark,
  Play,
  Database,
  Sliders,
  Settings,
  Home,
  Film,
  GitCompare,
  FlaskConical,
  BookOpen,
  Star,
  ThumbsUp,
  ThumbsDown,
  Clock,
  LayoutGrid,
  List,
  MoreVertical,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { getRecommendations, recordInteraction, resetUserSession, selectModel } from '../services/api';
import { getMovieDetails, MOVIE_DETAILS } from '../utils/movieDatabase';
import { getUserProfile } from '../utils/userProfiles';

const ALL_GENRES = [
  "All", "Action", "Adventure", "Animation", "Comedy", "Crime", 
  "Drama", "Horror", "Romance", "Sci-Fi", "Thriller"
];

const getMoviePoster = (item) => {
  if (!item) return MOVIE_DETAILS["default"].poster;
  const meta = getMovieDetails(item.title, item.primary_genre || (item.genres && item.genres[0]));
  return meta.poster || MOVIE_DETAILS["default"].poster;
};

// 8 Default Recommendations matching user screenshot layout
const DEFAULT_RECOMMENDATIONS = [
  {
    action_id: 10,
    item_id: 50,
    title: "Star Wars (1977)",
    duration: "2:14:00",
    primary_genre: "Action",
    genres: ["Action", "Adventure", "Romance"],
    avg_rating: 4.48,
    popularity: 0.99,
    rank: 1,
    is_saved: false,
    policy_probability: 0.612,
    rl_score: 1.034,
    predicted_reward: 2.66,
    value_estimate: 2.61,
    diversity_impact: 0.27,
    why_recommended: [
      "Top rated item in Sci-Fi domain (4.48 / 5.0)",
      "Matches user dynamic taste for Action (0.82 affinity)",
      "High predicted immediate + delayed return (+2.66 R_t)",
      "Policy network assigned 61.2% action probability π(a|s)"
    ],
    feature_contributions: {
      genre_affinity: 0.82,
      historical_engagement: 0.76,
      genre_match: 0.68,
      diversity_bonus: 0.42,
      long_term_retention: 0.61
    }
  },
  {
    action_id: 44,
    item_id: 181,
    title: "Return of the Jedi (1983)",
    duration: "2:14:00",
    primary_genre: "Action",
    genres: ["Action", "Adventure", "Romance"],
    avg_rating: 4.01,
    popularity: 0.954,
    rank: 2,
    is_saved: false,
    policy_probability: 0.040,
    rl_score: 1.033,
    predicted_reward: 1.52,
    value_estimate: 2.61,
    diversity_impact: 0.21,
    why_recommended: [
      "Sequential sequence continuation from Star Wars series",
      "High predicted return (+1.52 R_t) with sustained engagement",
      "Reinforces positive engagement retention"
    ],
    feature_contributions: {
      genre_affinity: 0.76,
      historical_engagement: 0.74,
      genre_match: 0.64,
      diversity_bonus: 0.38,
      long_term_retention: 0.58
    }
  },
  {
    action_id: 64,
    item_id: 318,
    title: "Shawshank Redemption, The (1994)",
    duration: "2:14:00",
    primary_genre: "Drama",
    genres: ["Drama"],
    avg_rating: 4.47,
    popularity: 0.98,
    rank: 3,
    is_saved: false,
    policy_probability: 0.040,
    rl_score: 0.559,
    predicted_reward: 1.52,
    value_estimate: 2.61,
    diversity_impact: 0.32,
    why_recommended: [
      "Critically acclaimed drama anchor (4.47 rating)",
      "High user satisfaction uplift preventing content fatigue"
    ],
    feature_contributions: {
      genre_affinity: 0.62,
      historical_engagement: 0.80,
      genre_match: 0.50,
      diversity_bonus: 0.45,
      long_term_retention: 0.65
    }
  },
  {
    action_id: 38,
    item_id: 174,
    title: "Raiders of the Lost Ark (1981)",
    duration: "2:14:00",
    primary_genre: "Action",
    genres: ["Action", "Adventure"],
    avg_rating: 4.36,
    popularity: 0.96,
    rank: 4,
    is_saved: false,
    policy_probability: 0.040,
    rl_score: 0.728,
    predicted_reward: 1.52,
    value_estimate: 2.61,
    diversity_impact: 0.18,
    why_recommended: [
      "High historical user rating in Action/Adventure",
      "Maintains low user churn probability"
    ],
    feature_contributions: {
      genre_affinity: 0.78,
      historical_engagement: 0.75,
      genre_match: 0.70,
      diversity_bonus: 0.28,
      long_term_retention: 0.52
    }
  },
  {
    action_id: 22,
    item_id: 228,
    title: "Star Trek: The Wrath of Khan (1982)",
    duration: "2:14:00",
    primary_genre: "Action",
    genres: ["Action", "Adventure", "Sci-Fi"],
    avg_rating: 3.84,
    popularity: 0.88,
    rank: 5,
    is_saved: false,
    policy_probability: 0.038,
    rl_score: 0.834,
    predicted_reward: 1.48,
    value_estimate: 2.61,
    diversity_impact: 0.22,
    why_recommended: [
      "Deep Sci-Fi alignment with high watch completion",
      "Stabilizes multi-step policy returns"
    ],
    feature_contributions: {
      genre_affinity: 0.68,
      historical_engagement: 0.72,
      genre_match: 0.80,
      diversity_bonus: 0.35,
      long_term_retention: 0.50
    }
  },
  {
    action_id: 32,
    item_id: 89,
    title: "Blade Runner (1982)",
    duration: "2:14:00",
    primary_genre: "Film-Noir",
    genres: ["Film-Noir", "Sci-Fi"],
    avg_rating: 4.12,
    popularity: 0.91,
    rank: 6,
    is_saved: false,
    policy_probability: 0.036,
    rl_score: 0.624,
    predicted_reward: 1.45,
    value_estimate: 2.61,
    diversity_impact: 0.28,
    why_recommended: [
      "Cyberpunk Sci-Fi exploration maintaining policy entropy",
      "Elevates genre diversity"
    ],
    feature_contributions: {
      genre_affinity: 0.65,
      historical_engagement: 0.70,
      genre_match: 0.75,
      diversity_bonus: 0.40,
      long_term_retention: 0.48
    }
  },
  {
    action_id: 50,
    item_id: 172,
    title: "Empire Strikes Back, The (1980)",
    duration: "2:14:00",
    primary_genre: "Action",
    genres: ["Action", "Adventure", "Drama"],
    avg_rating: 4.21,
    popularity: 0.934,
    rank: 7,
    is_saved: false,
    policy_probability: 0.043,
    rl_score: 1.004,
    predicted_reward: 1.53,
    value_estimate: 2.61,
    diversity_impact: 0.24,
    why_recommended: [
      "High episodic return trajectory in Action/Sci-Fi",
      "Optimal value function advantage"
    ],
    feature_contributions: {
      genre_affinity: 0.75,
      historical_engagement: 0.78,
      genre_match: 0.65,
      diversity_bonus: 0.30,
      long_term_retention: 0.54
    }
  },
  {
    action_id: 42,
    item_id: 204,
    title: "Back to the Future (1985)",
    duration: "2:14:00",
    primary_genre: "Comedy",
    genres: ["Comedy", "Sci-Fi"],
    avg_rating: 3.88,
    popularity: 0.94,
    rank: 8,
    is_saved: false,
    policy_probability: 0.035,
    rl_score: 0.784,
    predicted_reward: 1.40,
    value_estimate: 2.61,
    diversity_impact: 0.26,
    why_recommended: [
      "Comedy/Sci-Fi crossover providing novelty uplift",
      "Protects against session abandonment"
    ],
    feature_contributions: {
      genre_affinity: 0.70,
      historical_engagement: 0.73,
      genre_match: 0.72,
      diversity_bonus: 0.34,
      long_term_retention: 0.46
    }
  }
];

const CONTINUE_WATCHING_ITEMS = [
  {
    id: 'cw-1',
    title: 'Inception (2010)',
    time: '1:15:30 / 2:28:00',
    progress: 62,
    poster: getMovieDetails("Inception (2010)").poster
  },
  {
    id: 'cw-2',
    title: 'Interstellar (2014)',
    time: '0:42:15 / 2:49:00',
    progress: 24,
    poster: getMovieDetails("Interstellar (2014)").poster
  },
  {
    id: 'cw-3',
    title: 'The Dark Knight (2008)',
    time: '1:08:20 / 2:32:00',
    progress: 45,
    poster: getMovieDetails("The Dark Knight (2008)").poster
  },
  {
    id: 'cw-4',
    title: 'The Matrix (1999)',
    time: '0:30:10 / 2:16:00',
    progress: 22,
    poster: getMovieDetails("The Matrix (1999)").poster
  }
];

export default function RecommendationsPage({ 
  currentUser = 1, 
  activeModel = "PPO", 
  setActiveModel,
  onViewDetail, 
  onOpenRewardModal,
  setActivePage
}) {
  const [recommendations, setRecommendations] = useState(DEFAULT_RECOMMENDATIONS);
  const [selectedExplainMovie, setSelectedExplainMovie] = useState(DEFAULT_RECOMMENDATIONS[1]);
  const [sessionMeta, setSessionMeta] = useState({
    step: 10,
    cumulative_reward: 48.5,
    satisfaction: 0.99,
    model_metadata: { optimization_target: "Sequential Multi-Step Policy Optimization" },
    state_breakdown: {
      recent_engagement: 0.82,
      average_rating: 4.1,
      diversity_score: 0.42,
      recent_ctr: 0.72,
      watch_completion: 0.81,
      churn_risk: 0.12,
      top_genre_affinities: [
        { genre: "Action", affinity: 0.76 },
        { genre: "Adventure", affinity: 0.64 }
      ]
    },
    critic_info: {
      state_value_v: 2.61,
      expected_return: 2.65,
      advantage: 0.75
    },
    actor_info: {
      entropy: 0.71,
      exploration_ratio: 0.18,
      exploitation_ratio: 0.82,
      top_candidates: [
        { action_id: 44, title: "Return of the Jedi", genre: "Action", probability: 0.612, rank: 1 },
        { action_id: 39, title: "Princess Bride", genre: "Action", probability: 0.187, rank: 2 },
        { action_id: 10, title: "Star Wars", genre: "Action", probability: 0.094, rank: 3 },
        { action_id: 50, title: "Empire Strikes Back", genre: "Sci-Fi", probability: 0.068, rank: 4 },
        { action_id: 99, title: "Other Movies", genre: "Mixed", probability: 0.039, rank: 5 }
      ]
    },
    reward_breakdown: {
      immediate_engagement: 0.82,
      watch_completion: 0.64,
      retention_bonus: 0.91,
      diversity_bonus: 0.35,
      fatigue_penalty: -0.10,
      total_step_reward: 2.62
    }
  });

  const [selectedGenre, setSelectedGenre] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFullStateModal, setShowFullStateModal] = useState(false);

  useEffect(() => {
    fetchRecs();
  }, [currentUser, activeModel]);

  const fetchRecs = async () => {
    setIsLoading(true);
    try {
      const data = await getRecommendations(currentUser, activeModel, 12);
      if (data && data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
        if (!selectedExplainMovie || !data.recommendations.some(r => r.title === selectedExplainMovie.title)) {
          setSelectedExplainMovie(data.recommendations[0]);
        }
        setSessionMeta(prev => ({
          ...prev,
          step: data.session_step ?? prev.step,
          cumulative_reward: data.cumulative_reward ?? prev.cumulative_reward,
          satisfaction: data.user_satisfaction ?? prev.satisfaction,
          model_metadata: data.model_metadata || prev.model_metadata,
          full_state_vector: data.full_state_vector || prev.full_state_vector,
          state_breakdown: data.state_breakdown || prev.state_breakdown,
          critic_info: data.critic_info || prev.critic_info,
          actor_info: data.actor_info || prev.actor_info,
          reward_breakdown: data.reward_breakdown || prev.reward_breakdown
        }));
      }
    } catch (e) {
      console.error("Error loading recommendations", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModelSwitch = async (modelName) => {
    try {
      await selectModel(modelName);
      if (setActiveModel) setActiveModel(modelName);
      else await fetchRecs();
    } catch (e) {
      console.error("Error switching model", e);
    }
  };

  const handleInteract = async (actionId, type) => {
    try {
      const res = await recordInteraction(currentUser, actionId, type, activeModel);
      if (res) {
        setSessionMeta(prev => ({
          ...prev,
          step: res.session_step,
          cumulative_reward: res.cumulative_reward,
          satisfaction: res.user_satisfaction
        }));

        const updatedData = await getRecommendations(currentUser, activeModel, 12);
        if (updatedData && updatedData.recommendations) {
          setRecommendations(updatedData.recommendations);
        }
      }
    } catch (e) {
      console.error("Error recording interaction", e);
    }
  };

  // Filter & Search
  let filteredItems = selectedGenre === "All"
    ? recommendations
    : recommendations.filter(i => i.primary_genre === selectedGenre || (i.genres && i.genres.includes(selectedGenre)));

  if (searchQuery) {
    filteredItems = filteredItems.filter(i => 
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      i.primary_genre.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (filteredItems.length === 0 && selectedGenre === "All" && !searchQuery) {
    filteredItems = DEFAULT_RECOMMENDATIONS;
  }

  const currentExplain = selectedExplainMovie || filteredItems[0] || DEFAULT_RECOMMENDATIONS[0];
  const actorInfo = sessionMeta?.actor_info || DEFAULT_RECOMMENDATIONS[0];

  return (
    <div className="flex gap-4 py-1 animate-in fade-in duration-200">
      
      {/* ================= LEFT SIDEBAR (COMPACT) ================= */}
      <aside className="w-48 flex-shrink-0 hidden xl:flex flex-col justify-between space-y-4 pt-0.5">
        <div className="space-y-4">
          
          {/* Section: MAIN */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5">
              MAIN
            </span>
            <nav className="space-y-0.5 mt-1">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'recommendations', label: 'Recommendations', icon: Film, active: true },
                { id: 'rl-demo', label: 'Live RL', icon: Zap },
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'evaluation', label: 'Evaluation', icon: GitCompare },
                { id: 'models', label: 'Models', icon: Layers },
                { id: 'experiments', label: 'Experiments', icon: FlaskConical },
                { id: 'about', label: 'Research', icon: BookOpen },
              ].map((nav) => {
                const Icon = nav.icon;
                const isCur = nav.active;
                return (
                  <button
                    key={nav.id}
                    onClick={() => setActivePage && setActivePage(nav.id)}
                    className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      isCur
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isCur ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{nav.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Section: DATASET */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5">
              DATASET
            </span>
            <div className="space-y-0.5 mt-1">
              <button 
                onClick={() => setActivePage && setActivePage('dashboard')}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Database className="w-3.5 h-3.5 text-slate-400" />
                <span>MovieLens 100K</span>
              </button>
              <button 
                onClick={() => setActivePage && setActivePage('profile')}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>User Management</span>
              </button>
            </div>
          </div>

          {/* Section: SETTINGS */}
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2.5">
              SETTINGS
            </span>
            <div className="space-y-0.5 mt-1">
              <button 
                onClick={onOpenRewardModal}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>Model Config</span>
              </button>
              <button 
                onClick={() => setActivePage && setActivePage('models')}
                className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>System Settings</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Sidebar Card: Model Status */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-soft-sm space-y-1.5 text-xs">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
            Model Status
          </span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-900 text-[11px]">{activeModel} (Actor-Critic)</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 font-semibold block">Active</span>
          
          <div className="pt-1.5 border-t border-slate-100 space-y-0.5 text-[10px] text-slate-500 font-mono">
            <div className="flex justify-between">
              <span>Episode:</span>
              <span className="text-slate-800 font-bold">#128</span>
            </div>
            <div className="flex justify-between">
              <span>Step:</span>
              <span className="text-slate-800 font-bold">{sessionMeta?.step || 10} / 20</span>
            </div>
            <div className="flex justify-between">
              <span>Environment:</span>
              <span className="text-slate-800">MovieLens 100K</span>
            </div>
            <div className="flex justify-between">
              <span>State Space:</span>
              <span className="text-slate-800">48 Dimensions</span>
            </div>
            <div className="flex justify-between">
              <span>Action Space:</span>
              <span className="text-slate-800">9,742 Movies</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 space-y-3 min-w-0">
        
        {/* 1. Top Header Card (Compact) */}
        <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-200/80 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          
          {/* Left Title */}
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Personalized Movie Recommendations
                </h1>
                <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold">
                  {activeModel}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Real-time recommendations using Reinforcement Learning (Sequential Decision-Making)
              </p>
            </div>
          </div>

          {/* Center User Profile & Right Model Selection */}
          <div className="flex items-center space-x-3">
            
            {/* User Profile */}
            {(() => {
              const uProf = getUserProfile(currentUser);
              return (
                <div 
                  onClick={() => setActivePage && setActivePage('profile')}
                  className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200/80 text-xs cursor-pointer transition-colors"
                  title="View Dynamic MDP User Profile"
                >
                  <div className={`w-6 h-6 rounded-md ${uProf.avatarBg || 'bg-blue-600'} text-white flex items-center justify-center font-bold text-[10px] shadow-xs`}>
                    {uProf.initials || "TD"}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block leading-none">{uProf.name}</span>
                    <span className="text-[9px] text-slate-500 font-medium">{uProf.role} • Step: {sessionMeta?.step || 10}</span>
                  </div>
                </div>
              );
            })()}

            {/* Model Selection Pills */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {[
                { key: "PPO", label: "PPO" },
                { key: "DQN", label: "DQN" },
                { key: "Contextual Bandit", label: "Baseline (CTR)" },
                { key: "Collaborative Filtering", label: "CF" }
              ].map((m) => {
                const isSelected = activeModel === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => handleModelSwitch(m.key)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 bg-transparent'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

          </div>

        </div>

        {/* 2. Compact RL Decision Pipeline (Live) */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-soft-sm space-y-2">
          <div className="flex items-center space-x-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <h3 className="text-xs font-extrabold text-slate-900">RL Decision Pipeline (Live)</h3>
          </div>

          {/* 7 Horizontal Connected Step Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 items-center relative py-0.5">
            
            {/* Step 1: User State S_t */}
            <div className="bg-blue-50/60 p-2 rounded-xl border border-blue-200 text-center space-y-0.5">
              <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                <UserCheck className="w-3 h-3" />
              </div>
              <span className="text-[10px] font-bold text-slate-900 block leading-tight">User State</span>
              <span className="text-[9px] font-mono text-blue-700 block font-bold">S_t</span>
              <span className="text-[8px] text-slate-400 block font-mono">48D vector</span>
            </div>

            {/* Step 2: RL Model PPO */}
            <div className="bg-purple-50/60 p-2 rounded-xl border border-purple-200 text-center space-y-0.5">
              <div className="w-5 h-5 rounded-md bg-purple-100 text-purple-600 mx-auto flex items-center justify-center">
                <Cpu className="w-3 h-3" />
              </div>
              <span className="text-[10px] font-bold text-slate-900 block leading-tight">RL Model</span>
              <span className="text-[9px] font-mono text-purple-700 block font-bold">PPO Actor-Critic</span>
              <span className="text-[8px] text-slate-400 block">Policy π(a|s)</span>
            </div>

            {/* Step 3: Selected Action a_t */}
            <div className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-200 text-center space-y-0.5">
              <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <Film className="w-3 h-3" />
              </div>
              <span className="text-[10px] font-bold text-slate-900 block leading-tight">Selected Action</span>
              <span className="text-[9px] font-mono text-emerald-700 block font-bold">π(a|s) = 0.612</span>
              <span className="text-[8px] text-slate-400 block truncate">Return of the Jedi</span>
            </div>

            {/* Step 4: User Feedback */}
            <div className="bg-amber-50/60 p-2 rounded-xl border border-amber-200 text-center space-y-0.5">
              <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
                <Eye className="w-3 h-3" />
              </div>
              <span className="text-[10px] font-bold text-slate-900 block leading-tight">User Feedback</span>
              <div className="flex items-center justify-center space-x-1.5 pt-0.5">
                <ThumbsUp className="w-3 h-3 text-emerald-600" />
                <ThumbsDown className="w-3 h-3 text-rose-500" />
                <Clock className="w-3 h-3 text-amber-500" />
              </div>
            </div>

            {/* Step 5: Reward R_t */}
            <div className="bg-rose-50/60 p-2 rounded-xl border border-rose-200 text-center space-y-0.5">
              <div className="w-5 h-5 rounded-md bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <Award className="w-3 h-3" />
              </div>
              <span className="text-[10px] font-bold text-slate-900 block leading-tight">Reward R_t</span>
              <span className="text-xs font-black text-emerald-600 block font-mono">+2.62</span>
            </div>

            {/* Step 6: Next State S_{t+1} */}
            <div className="bg-blue-50/60 p-2 rounded-xl border border-blue-200 text-center space-y-0.5">
              <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 mx-auto flex items-center justify-center">
                <Database className="w-3 h-3" />
              </div>
              <span className="text-[10px] font-bold text-slate-900 block leading-tight">Next State</span>
              <span className="text-[9px] font-mono text-blue-700 block font-bold">S_t+1</span>
            </div>

            {/* Step 7: Policy Update */}
            <div className="bg-purple-50/60 p-2 rounded-xl border border-purple-200 text-center space-y-0.5">
              <div className="w-5 h-5 rounded-md bg-purple-100 text-purple-600 mx-auto flex items-center justify-center">
                <RotateCcw className="w-3 h-3" />
              </div>
              <span className="text-[10px] font-bold text-slate-900 block leading-tight">Policy Update</span>
              <span className="text-[8px] font-mono text-purple-700 block font-bold">θ ← θ + Δθ</span>
            </div>

          </div>
        </div>

        {/* 3. 5 Telemetry Cards Row (Compact) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          
          {/* Card 1: Cumulative Return (G_t) */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-soft-sm flex flex-col justify-between space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="text-[10px] font-medium text-slate-500">Cumulative Return</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-black text-slate-900 font-mono">
                +{sessionMeta?.cumulative_reward ? Number(sessionMeta.cumulative_reward).toFixed(1) : "48.5"}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 font-mono">↑ +12.3%</span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-0.5">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
            </div>
          </div>

          {/* Card 2: Session Step */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-soft-sm flex flex-col justify-between space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="text-[10px] font-medium text-slate-500">Session Step</span>
              <Layers className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-black text-slate-900 font-mono">
                {sessionMeta?.step || 10} / 20
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1 mt-0.5 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(100, ((sessionMeta?.step || 10) / 20) * 100)}%` }} />
            </div>
          </div>

          {/* Card 3: Dynamic Satisfaction */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-soft-sm flex flex-col justify-between space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="text-[10px] font-medium text-slate-500">Dynamic Satisfaction</span>
              <Smile className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-xl font-black text-slate-900 font-mono">
                {Math.round((sessionMeta?.satisfaction || 0.99) * 100)}%
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 font-mono">↑ +8.1%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1 mt-0.5 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full" style={{ width: `${(sessionMeta?.satisfaction || 0.99) * 100}%` }} />
            </div>
          </div>

          {/* Card 4: Exploration Rate */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-soft-sm flex flex-col justify-between space-y-0.5">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="text-[10px] font-medium text-slate-500">Exploration Rate</span>
              <Compass className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 font-mono">
                {Math.round((actorInfo.exploration_ratio || 0.18) * 100)}%
              </span>
              <div className="w-full bg-slate-100 rounded-full h-1 mt-0.5 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(actorInfo.exploration_ratio || 0.18) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Card 5: Optimization Target */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-soft-sm flex flex-col justify-between space-y-0.5 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="text-[10px] font-medium text-slate-500">Optimization Target</span>
              <Target className="w-3.5 h-3.5 text-cyan-600" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-700 block leading-tight">
                Sequential Multi-Step Policy Optimization
              </span>
              <span className="text-[9px] text-slate-400 font-mono block">GAE Discounted Return</span>
            </div>
          </div>

        </div>

        {/* 4. Main Recommendation Feed + Right-Side Model Explanation Panel (Tight Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          
          {/* Left / Center: Recommendations Grid (9 cols on large screens) */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-2.5">
            
            {/* Header + Filter Bar */}
            <div className="flex flex-col space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Recommended for You</h2>
                  <p className="text-[11px] text-slate-500">Based on your current state and RL model policy</p>
                </div>

                {/* Search & Sort */}
                <div className="flex items-center space-x-1.5 flex-shrink-0">
                  <div className="relative">
                    <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search movies..."
                      className="pl-7 pr-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 w-32 sm:w-40"
                    />
                  </div>

                  <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-semibold cursor-pointer">
                    <span>Sort by</span>
                    <span className="text-blue-600 font-bold ml-1 font-mono">RL Score</span>
                    <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
                  </div>

                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-slate-500">
                    <button className="p-1 rounded bg-white text-blue-600 shadow-xs">
                      <LayoutGrid className="w-3 h-3" />
                    </button>
                    <button className="p-1 rounded hover:text-slate-800">
                      <List className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Genre Pills (Compact) */}
              <div className="flex items-center space-x-1 overflow-x-auto pb-0.5 scrollbar-none">
                {ALL_GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGenre(g)}
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all flex-shrink-0 ${
                      selectedGenre === g
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid of 8 Movie Cards (4 cols on xl) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5">
              {filteredItems.slice(0, 8).map((item, idx) => {
                const rankPills = [
                  "bg-emerald-500 text-white",
                  "bg-blue-600 text-white",
                  "bg-purple-600 text-white",
                  "bg-amber-500 text-white",
                  "bg-purple-600 text-white",
                  "bg-blue-600 text-white",
                  "bg-rose-500 text-white",
                  "bg-emerald-500 text-white"
                ];
                const rankColor = rankPills[idx % rankPills.length];
                const poster = getMoviePoster(item);
                const isSelectedForExplain = currentExplain.title === item.title;

                return (
                  <div
                    key={item.action_id || idx}
                    onClick={() => setSelectedExplainMovie(item)}
                    className={`bg-white rounded-xl border p-2.5 shadow-soft-sm flex flex-col justify-between space-y-2 hover:shadow-soft-md transition-all group cursor-pointer ${
                      isSelectedForExplain ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200/80'
                    }`}
                  >
                    {/* Top Image Banner with Rank & Duration Overlay */}
                    <div className="relative w-full h-28 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/80">
                      <img 
                        src={poster} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                      {/* Rank Badge */}
                      <span className={`absolute top-1.5 left-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold font-mono shadow-sm ${rankColor}`}>
                        Rank #{idx + 1}
                      </span>

                      {/* Duration Overlay */}
                      <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.2 rounded bg-black/75 backdrop-blur-xs text-[9px] font-mono text-white font-semibold">
                        {item.duration || "2:14:00"}
                      </span>
                    </div>

                    {/* Movie Info */}
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-xs text-slate-900 leading-snug truncate group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </h4>

                      {/* Genre Tags */}
                      <div className="flex flex-wrap gap-1">
                        {(item.genres || [item.primary_genre]).slice(0, 3).map((g) => (
                          <span key={g} className="px-1 py-0.2 rounded bg-slate-100 text-[8px] font-semibold text-slate-600">
                            {g}
                          </span>
                        ))}
                      </div>

                      {/* Rating + RL Score */}
                      <div className="flex items-center justify-between pt-0.5">
                        <div className="flex items-center space-x-1 text-[11px] text-slate-800 font-bold">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{item.avg_rating}</span>
                        </div>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-mono font-bold">
                          RL Score {item.rl_score ? Number(item.rl_score).toFixed(3) : "1.034"}
                        </span>
                      </div>
                    </div>

                    {/* Telemetry Strip (Compact) */}
                    <div className="bg-slate-50 p-1 rounded-lg border border-slate-200/70 grid grid-cols-3 gap-0.5 text-center font-mono">
                      <div>
                        <span className="text-[7px] text-slate-400 uppercase block leading-none">Policy Prob.</span>
                        <span className="text-[10px] font-bold text-slate-900 mt-0.5 block">
                          {item.policy_probability ? `${(item.policy_probability * 100).toFixed(1)}%` : "61.2%"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[7px] text-slate-400 uppercase block leading-none">Pred. Reward</span>
                        <span className="text-[10px] font-bold text-emerald-600 mt-0.5 block">
                          +{item.predicted_reward ? Number(item.predicted_reward).toFixed(2) : "2.66"}
                        </span>
                      </div>
                      <div>
                        <span className="text-[7px] text-slate-400 uppercase block leading-none">Value Est.</span>
                        <span className="text-[10px] font-bold text-purple-700 mt-0.5 block">
                          {item.value_estimate ? Number(item.value_estimate).toFixed(2) : "2.61"}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: Watch, Why This?, Bookmark */}
                    <div className="flex items-center space-x-1 pt-1 border-t border-slate-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInteract(item.action_id, 'click');
                        }}
                        className="flex-1 flex items-center justify-center space-x-1 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs transition-colors"
                      >
                        <Play className="w-2.5 h-2.5 fill-white" />
                        <span>Watch</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExplainMovie(item);
                        }}
                        className="flex items-center space-x-0.5 py-1 px-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[10px] border border-slate-200 transition-colors"
                      >
                        <HelpCircle className="w-2.5 h-2.5 text-blue-600" />
                        <span>Why This?</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInteract(item.action_id, 'save');
                        }}
                        className="p-1 rounded-lg bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-700 border border-slate-200 transition-colors"
                      >
                        <Bookmark className="w-2.5 h-2.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Side: Model Explanation Panel (4 cols on lg, 3 cols on xl) */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-soft-sm space-y-3 sticky top-16">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-extrabold text-slate-900">Model Explanation</h3>
                <button 
                  onClick={() => setShowFullStateModal(true)}
                  className="flex items-center space-x-1 text-blue-600 text-[11px] font-semibold hover:underline"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Why this movie?</span>
                </button>
              </div>

              {/* Selected Movie Summary Card */}
              <div className="flex space-x-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                <div className="w-12 h-16 rounded-md overflow-hidden bg-slate-200 flex-shrink-0">
                  <img 
                    src={getMoviePoster(currentExplain)} 
                    alt={currentExplain.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <h4 className="font-extrabold text-xs text-slate-900 leading-snug line-clamp-1">
                    {currentExplain.title}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {(currentExplain.genres || [currentExplain.primary_genre]).slice(0, 2).map((g) => (
                      <span key={g} className="px-1 py-0.2 rounded bg-white border border-slate-200 text-[8px] font-semibold text-slate-600">
                        {g}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center space-x-1 text-[10px] text-slate-800 font-bold">
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span>{currentExplain.avg_rating}</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-emerald-700">
                      RL Score {currentExplain.rl_score ? Number(currentExplain.rl_score).toFixed(3) : "1.033"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Model Output Bars */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-extrabold text-slate-800 uppercase font-mono tracking-wider">
                  {activeModel} Model Output
                </h4>
                
                <div className="space-y-1 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-700 mb-0.5">
                      <span className="text-slate-500">Policy Probability (π(a|s))</span>
                      <span className="font-bold text-slate-900">
                        {currentExplain.policy_probability ? `${(currentExplain.policy_probability * 100).toFixed(1)}%` : "61.2%"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${(currentExplain.policy_probability || 0.612) * 100}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-700 mb-0.5">
                      <span className="text-slate-500">Predicted Reward</span>
                      <span className="font-bold text-emerald-600">
                        +{currentExplain.predicted_reward ? Number(currentExplain.predicted_reward).toFixed(2) : "2.66"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-cyan-500 h-full rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-700 mb-0.5">
                      <span className="text-slate-500">Value Estimate (V(s))</span>
                      <span className="font-bold text-purple-700">
                        {currentExplain.value_estimate ? Number(currentExplain.value_estimate).toFixed(2) : "2.61"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-700 mb-0.5">
                      <span className="text-slate-500">Advantage (A(s, a))</span>
                      <span className="font-bold text-amber-600">
                        +{sessionMeta?.critic_info?.advantage ? Number(sessionMeta.critic_info.advantage).toFixed(2) : "0.75"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: '55%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Factors (from current state) */}
              <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                <h4 className="text-[10px] font-extrabold text-slate-800 uppercase font-mono tracking-wider">
                  Key Factors (from current state)
                </h4>

                <div className="space-y-1 text-xs font-mono">
                  {[
                    { label: "Action preference", val: "82%", barW: 82, color: "bg-blue-600" },
                    { label: "Recent engagement", val: "76%", barW: 76, color: "bg-cyan-500" },
                    { label: "Genre match (Sci-Fi)", val: "68%", barW: 68, color: "bg-purple-600" },
                    { label: "Diversity boost", val: "42%", barW: 42, color: "bg-amber-500" },
                    { label: "Long-term retention", val: "61%", barW: 61, color: "bg-rose-500" },
                  ].map((f) => (
                    <div key={f.label}>
                      <div className="flex justify-between text-[10px] text-slate-700 mb-0.5">
                        <span className="text-slate-500">{f.label}</span>
                        <span className="font-bold text-slate-900">{f.val}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                        <div className={`${f.color} h-full rounded-full`} style={{ width: `${f.barW}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policy Distribution (Top Actions) */}
              <div className="space-y-1.5 pt-1.5 border-t border-slate-100">
                <h4 className="text-[10px] font-extrabold text-slate-800 uppercase font-mono tracking-wider">
                  Policy Distribution (Top Actions)
                </h4>

                <div className="space-y-1.5 text-xs font-mono">
                  {[
                    { title: "Return of the Jedi", prob: "61.2%", barW: 61, color: "bg-blue-600", poster: getMovieDetails("Return of the Jedi (1983)").poster },
                    { title: "Princess Bride", prob: "18.7%", barW: 19, color: "bg-blue-500", poster: getMovieDetails("Princess Bride, The (1987)").poster },
                    { title: "Star Wars", prob: "9.4%", barW: 10, color: "bg-blue-400", poster: getMovieDetails("Star Wars (1977)").poster },
                    { title: "Empire Strikes Back", prob: "6.8%", barW: 7, color: "bg-purple-400", poster: getMovieDetails("Empire Strikes Back, The (1980)").poster },
                    { title: "Other Movies", prob: "3.9%", barW: 4, color: "bg-slate-400", poster: getMovieDetails("default").poster },
                  ].map((cand) => (
                    <div key={cand.title} className="flex items-center space-x-1.5">
                      <div className="w-4 h-5 rounded overflow-hidden bg-slate-200 flex-shrink-0">
                        <img src={cand.poster} alt={cand.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-[9px] text-slate-700 mb-0.5">
                          <span className="truncate pr-1">{cand.title}</span>
                          <span className="font-bold text-slate-900">{cand.prob}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                          <div className={`${cand.color} h-full rounded-full`} style={{ width: `${cand.barW}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 5. Bottom Section: Continue Watching (Compact) */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-soft-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900">Continue Watching</h3>
            <span className="text-[10px] text-slate-400 font-mono">Recent Stream History</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {CONTINUE_WATCHING_ITEMS.map((item) => (
              <div 
                key={item.id}
                className="flex items-center space-x-2.5 p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100/80 border border-slate-200/70 transition-colors group cursor-pointer"
              >
                {/* Thumbnail with Play Overlay */}
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                  <img src={item.poster} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-white/90 shadow-md flex items-center justify-center">
                      <Play className="w-2.5 h-2.5 text-slate-900 fill-slate-900 ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Progress & Title */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <button className="text-slate-400 hover:text-slate-700">
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: `${item.progress}%` }} />
                  </div>

                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>{item.time}</span>
                    <span className="font-bold text-slate-700">{item.progress}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ================= FULL 48D STATE VECTOR MODAL ================= */}
      {showFullStateModal && (
        <div 
          onClick={() => setShowFullStateModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Full 48-Dimensional User State Vector (S_t)
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {getUserProfile(currentUser).name} (ID #{currentUser}) • MDP Continuous State Space S_t ∈ R^48
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowFullStateModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 text-xs font-mono">
              <div className="bg-blue-50/60 p-2.5 rounded-lg border border-blue-100 text-slate-700 text-xs leading-relaxed">
                <strong>State Representation Composition: </strong>
                User ID (1 dim) + Dynamic Category Affinities (19 dims) + Recent Recommendation History Embedding (21 dims) + Session Dynamics (7 dims) = 48 Dimensions.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {(sessionMeta?.full_state_vector && sessionMeta.full_state_vector.length > 0
                  ? sessionMeta.full_state_vector.map((f, i) => ({
                      dim: f.dim ?? i,
                      label: f.label || `State Dimension ${i}`,
                      val: Number(f.value ?? f.val ?? 0).toFixed(4),
                      cat: f.category || "MDP State Feature"
                    }))
                  : [
                      { dim: 0, label: "User ID (Normalized)", val: "0.0050", cat: "User Context" },
                      { dim: 1, label: "Action Genre Affinity", val: "0.7600", cat: "Dynamic Taste Vector" },
                      { dim: 2, label: "Adventure Genre Affinity", val: "0.6400", cat: "Dynamic Taste Vector" },
                      { dim: 3, label: "Animation Genre Affinity", val: "0.0920", cat: "Dynamic Taste Vector" },
                      { dim: 4, label: "Children's Genre Affinity", val: "0.0500", cat: "Dynamic Taste Vector" },
                      { dim: 5, label: "Comedy Genre Affinity", val: "0.0800", cat: "Dynamic Taste Vector" },
                      { dim: 6, label: "Crime Genre Affinity", val: "0.1100", cat: "Dynamic Taste Vector" },
                      { dim: 7, label: "Documentary Genre Affinity", val: "0.0100", cat: "Dynamic Taste Vector" },
                      { dim: 8, label: "Drama Genre Affinity", val: "0.2200", cat: "Dynamic Taste Vector" },
                      { dim: 9, label: "Fantasy Genre Affinity", val: "0.1380", cat: "Dynamic Taste Vector" },
                      { dim: 10, label: "Film-Noir Genre Affinity", val: "0.0200", cat: "Dynamic Taste Vector" },
                      { dim: 11, label: "Horror Genre Affinity", val: "0.0400", cat: "Dynamic Taste Vector" },
                      { dim: 12, label: "Musical Genre Affinity", val: "0.0300", cat: "Dynamic Taste Vector" },
                      { dim: 13, label: "Mystery Genre Affinity", val: "0.0700", cat: "Dynamic Taste Vector" },
                      { dim: 14, label: "Romance Genre Affinity", val: "0.1200", cat: "Dynamic Taste Vector" },
                      { dim: 15, label: "Sci-Fi Genre Affinity", val: "0.6400", cat: "Dynamic Taste Vector" },
                      { dim: 16, label: "Thriller Genre Affinity", val: "0.1190", cat: "Dynamic Taste Vector" },
                      { dim: 17, label: "War Genre Affinity", val: "0.1500", cat: "Dynamic Taste Vector" },
                      { dim: 18, label: "Western Genre Affinity", val: "0.0200", cat: "Dynamic Taste Vector" },
                      { dim: 19, label: "Other Genre Affinity", val: "0.0100", cat: "Dynamic Taste Vector" },
                      { dim: 41, label: "Session Step Horizon (Normalized)", val: "0.5000", cat: "Session Dynamics" },
                      { dim: 42, label: "Consecutive Skips Index", val: "0.0000", cat: "Session Dynamics" },
                      { dim: 43, label: "Dynamic User Satisfaction", val: "0.9900", cat: "Session Dynamics" },
                      { dim: 44, label: "Fatigue / Satiation Index", val: "0.1200", cat: "Session Dynamics" },
                      { dim: 45, label: "Recent Click-Through Ratio", val: "0.7200", cat: "Session Dynamics" },
                      { dim: 46, label: "Recent Positive Engagement Ratio", val: "0.8200", cat: "Session Dynamics" },
                      { dim: 47, label: "Recent Skip / Dislike Ratio", val: "0.1000", cat: "Session Dynamics" }
                    ]
                ).map((feat) => (
                  <div 
                    key={feat.dim} 
                    className="bg-slate-50 p-2 rounded-lg border border-slate-200/70 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[9px] text-slate-400 block font-mono">
                        dim[{feat.dim}] • {feat.cat}
                      </span>
                      <span className="font-semibold text-slate-800 text-[10px] truncate block">
                        {feat.label}
                      </span>
                    </div>
                    <span className="font-bold font-mono text-xs pl-2 text-blue-700">
                      {feat.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 px-4 border-t border-slate-100 bg-slate-50/60 flex justify-end">
              <button
                onClick={() => setShowFullStateModal(false)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-xs hover:bg-blue-700 transition-colors"
              >
                Close State Inspector
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
