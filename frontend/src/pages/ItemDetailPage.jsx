import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  TrendingUp, 
  Layers, 
  Sparkles, 
  Heart, 
  ThumbsUp,
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
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  Subtitles,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Info,
  Plus,
  Check,
  Zap,
  Activity,
  Compass,
  Cpu,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { getItemDetail, recordInteraction, getRecommendations } from '../services/api';
import { getMovieDetails, MOVIE_DETAILS } from '../utils/movieDatabase';

export default function ItemDetailPage({ itemId, onBack, currentUser = 1, activeModel = "PPO" }) {
  const [currentMovie, setCurrentMovie] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(2538); // 42:18
  const totalDurationSec = 6872; // 1:54:32
  const [progressPercent, setProgressPercent] = useState(36.9);
  const [userFeedback, setUserFeedback] = useState(null); // 'like', 'dislike', etc.
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [expandedWhyId, setExpandedWhyId] = useState(null);
  const [isWhyPanelOpen, setIsWhyPanelOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [rlRecalculating, setRlRecalculating] = useState(false);

  // Dynamic Up-Next RL Recommendations
  const [upNextList, setUpNextList] = useState([
    {
      id: 1,
      title: "Apollo 13 (1995)",
      genres: ["Action", "Drama", "Thriller"],
      duration: "2:20:00",
      rlScore: 0.92,
      predictedReward: "+3.21",
      policyProb: "54%",
      explorationBonus: "+0.12",
      reasonTag: "High genre match • Recent engagement",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
      whyBreakdown: {
        genreAffinity: 0.88,
        novelty: 0.82,
        fatigueAvoidance: 0.94,
        policyWeight: "54% Actor Probability",
        explanation: "PPO selects Apollo 13 as the optimal next state transition. It balances high drama-action affinity with zero recent fatigue penalty."
      }
    },
    {
      id: 2,
      title: "Star Wars (1977)",
      genres: ["Action", "Adventure", "Sci-Fi"],
      duration: "2:01:00",
      rlScore: 0.89,
      predictedReward: "+2.94",
      policyProb: "28%",
      explorationBonus: "+0.18",
      reasonTag: "Similar audience • High predicted reward",
      image: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=80",
      whyBreakdown: {
        genreAffinity: 0.84,
        novelty: 0.79,
        fatigueAvoidance: 0.91,
        policyWeight: "28% Actor Probability",
        explanation: "Diverges into epic Sci-Fi/Adventure to prevent single-genre saturation while preserving positive cumulative return."
      }
    },
    {
      id: 3,
      title: "Gladiator (2000)",
      genres: ["Action", "Drama", "Epic"],
      duration: "2:35:00",
      rlScore: 0.84,
      predictedReward: "+2.78",
      policyProb: "12%",
      explorationBonus: "+0.08",
      reasonTag: "Historical theme • Long-term retention",
      image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80",
      whyBreakdown: {
        genreAffinity: 0.92,
        novelty: 0.65,
        fatigueAvoidance: 0.82,
        policyWeight: "12% Actor Probability",
        explanation: "High historical epic affinity. Ranked 3rd to introduce slight spacing after current battle film."
      }
    },
    {
      id: 4,
      title: "The Lord of the Rings (2001)",
      genres: ["Action", "Adventure", "Fantasy"],
      duration: "2:58:00",
      rlScore: 0.81,
      predictedReward: "+2.65",
      policyProb: "6%",
      explorationBonus: "+0.22",
      reasonTag: "Epic storytelling • High user satisfaction",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      whyBreakdown: {
        genreAffinity: 0.86,
        novelty: 0.89,
        fatigueAvoidance: 0.87,
        policyWeight: "6% Actor Probability",
        explanation: "Exploration candidate. Maximizes long-term session duration with high baseline satisfaction expectation."
      }
    }
  ]);

  // "More Like This" Carousel Movies matching the prompt
  const [moreLikeThis] = useState([
    {
      title: "Kingdom of Heaven (2005)",
      rating: 7.2,
      duration: "2:24:00",
      genres: ["Action", "Drama"],
      image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "The Last Samurai (2003)",
      rating: 7.8,
      duration: "2:34:00",
      genres: ["Action", "Drama"],
      image: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "300 (2006)",
      rating: 7.6,
      duration: "1:57:00",
      genres: ["Action", "War"],
      image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "Troy (2004)",
      rating: 7.3,
      duration: "2:43:00",
      genres: ["Action", "Drama"],
      image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "Robin Hood (2010)",
      rating: 6.6,
      duration: "2:20:00",
      genres: ["Action", "Adventure"],
      image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80"
    },
    {
      title: "The Patriot (2000)",
      rating: 7.2,
      duration: "2:45:00",
      genres: ["Action", "Drama"],
      image: "https://images.unsplash.com/photo-1453873599977-6b1bc933291f?w=600&auto=format&fit=crop&q=80"
    }
  ]);

  // Initialize or fetch movie data
  useEffect(() => {
    if (itemId !== null && itemId !== undefined) {
      loadMovie(itemId);
    } else {
      // Default to Braveheart (1995) as shown in mockup
      const def = getMovieDetails("Braveheart (1995)");
      setCurrentMovie({
        action_id: 10,
        title: "Braveheart (1995)",
        imdb_rating: 8.3,
        num_reviews: "412K",
        genres: ["Action", "Drama", "War"],
        year: 1995,
        duration: "1h 54m",
        overview: "Scottish warrior William Wallace leads his people in a rebellion against the English crown to free Scotland from the tyranny of King Edward I.",
        backdrop: "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=1400&auto=format&fit=crop&q=80"
      });
    }
  }, [itemId]);

  const loadMovie = async (id) => {
    try {
      const data = await getItemDetail(id);
      const meta = getMovieDetails(data.title);
      setCurrentMovie({
        ...data,
        ...meta,
        imdb_rating: meta.imdb_rating || data.average_rating || 8.3,
        num_reviews: meta.num_reviews || "412K",
        duration: meta.duration || "1h 54m",
        year: meta.year || 1995,
        genres: meta.genres || data.genres || ["Action", "Drama"]
      });
    } catch (e) {
      const meta = getMovieDetails("Braveheart (1995)");
      setCurrentMovie({
        action_id: id || 10,
        ...meta
      });
    }
  };

  // Trigger RL User Interaction and dynamically update Next-Recommendations
  const handleUserInteract = async (type) => {
    setUserFeedback(type);
    setRlRecalculating(true);
    
    try {
      const actId = currentMovie?.action_id ?? 10;
      const res = await recordInteraction(currentUser, actId, type, activeModel);
      
      const rVal = res.reward ? (res.reward > 0 ? `+${res.reward.toFixed(2)}` : res.reward.toFixed(2)) : "+2.85";
      setToastMessage({
        type: type,
        title: type === 'like' ? 'Liked & Recorded' : type === 'dislike' ? 'Feedback Recorded' : 'Watchlist Updated',
        details: `RL State Updated: S_t → S_{t+1} | Reward R_t = ${rVal} | Model: ${activeModel}`
      });

      // Recalculate Up Next list with slight adaptation
      setTimeout(() => {
        if (type === 'like') {
          setUpNextList(prev => prev.map((item, idx) => ({
            ...item,
            rlScore: Math.min(0.99, Number((item.rlScore + 0.03 - idx * 0.01).toFixed(2))),
            predictedReward: `+${(3.1 + Math.random() * 0.4).toFixed(2)}`
          })));
        } else if (type === 'dislike') {
          // Diversity shuffle
          setUpNextList(prev => [...prev].reverse().map((item, idx) => ({
            ...item,
            rlScore: Number((0.85 - idx * 0.03).toFixed(2))
          })));
        }
        setRlRecalculating(false);
      }, 500);

      setTimeout(() => setToastMessage(null), 4000);
    } catch (e) {
      setRlRecalculating(false);
    }
  };

  // Play a movie directly from Up Next or More Like This
  const handleSelectNextMovie = async (movie) => {
    const actId = movie.id || movie.action_id || 12;
    try {
      await recordInteraction(currentUser, actId, 'click', activeModel);
    } catch (e) {
      console.error(e);
    }
    const meta = getMovieDetails(movie.title);
    setCurrentMovie({
      action_id: actId,
      title: movie.title,
      imdb_rating: meta.imdb_rating || movie.rating || 8.0,
      num_reviews: meta.num_reviews || "350K",
      genres: meta.genres || movie.genres || ["Action", "Drama"],
      year: meta.year || 2000,
      duration: meta.duration || movie.duration || "2h 00m",
      overview: meta.overview || `${movie.title} is selected by the RL policy based on high sequential affinity.`,
      backdrop: meta.backdrop || movie.image || "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=1400&auto=format&fit=crop&q=80"
    });
    
    // Reset player state & scroll to top
    setCurrentTimeSec(0);
    setProgressPercent(0);
    setUserFeedback(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Show RL transition notification
    setToastMessage({
      type: 'watch',
      title: `Now Streaming: ${movie.title}`,
      details: `RL Policy Action Transition Executed: User State S_t → S_{t+1} (Step incremented)`
    });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Top Header / Breadcrumb matching light white background theme */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBack}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Recommendations</span>
          </button>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-slate-400">
            <Film className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold text-slate-900 dark:text-white">Movie Player & Sequential RL Loop</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-[11px] font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            <span>RL Model: {activeModel}</span>
          </span>
        </div>
      </div>

      {/* Floating Real-time RL Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-200 flex items-center space-x-3 animate-in slide-in-from-bottom-5 duration-200 max-w-md">
          <div className="w-8 h-8 rounded-xl bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
            <Zap className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-xs leading-none">{toastMessage.title}</h4>
            <p className="text-[11px] opacity-80 mt-1 font-mono leading-tight truncate">{toastMessage.details}</p>
          </div>
        </div>
      )}

      {/* Main Two-Column Layout (Matching user screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* =========================================================================
            LEFT COLUMN (Player + Video Meta + More Like This) - Span 8
           ========================================================================= */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* 1. Cinematic Movie Player Screen */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl group select-none">
            
            {/* Backdrop / Video Poster Image */}
            <img 
              src={currentMovie?.backdrop || "https://images.unsplash.com/photo-1514533450685-4493e01d1fdc?w=1400&auto=format&fit=crop&q=80"} 
              alt={currentMovie?.title || "Movie Player"}
              className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-102"
            />

            {/* Gradient Overlay for Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30 pointer-events-none"></div>

            {/* Central Play/Pause Watermark Button on Hover */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 transition-all shadow-2xl cursor-pointer"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white translate-x-0.5" />}
            </button>

            {/* Bottom Player Video Controls Bar (Identical to screenshot) */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 space-y-2 text-white">
              
              {/* Scrub / Progress Bar */}
              <div 
                className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer relative hover:h-2.5 transition-all"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newPercent = (clickX / rect.width) * 100;
                  setProgressPercent(newPercent);
                  setCurrentTimeSec(Math.floor((newPercent / 100) * totalDurationSec));
                }}
              >
                <div 
                  className="h-full bg-red-600 rounded-full relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md scale-0 group-hover:scale-100 transition-transform"></div>
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between text-xs font-medium pt-1">
                
                {/* Left Controls: Play, Next, Volume, Timestamp */}
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-red-500 transition-colors focus:outline-none"
                    aria-label="Play/Pause"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>
                  <button 
                    onClick={() => handleSelectNextMovie(upNextList[0])}
                    title="Next Video"
                    className="hover:text-red-500 transition-colors"
                  >
                    <FastForward className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="hover:text-red-500 transition-colors"
                    aria-label="Mute/Unmute"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="text-[11px] font-mono opacity-90">
                    {formatTime(currentTimeSec)} / 1:54:32
                  </span>
                </div>

                {/* Right Controls: CC, Settings, Fullscreen */}
                <div className="flex items-center space-x-3.5">
                  <button title="Subtitles / CC" className="px-1.5 py-0.5 rounded border border-white/40 text-[10px] font-bold hover:bg-white/20 transition-colors">
                    CC
                  </button>
                  <button title="Playback Settings" className="hover:text-red-500 transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button title="Full Screen" className="hover:text-red-500 transition-colors">
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* 2. Movie Metadata & Title Block (Light Theme Card) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {currentMovie?.title || "Braveheart (1995)"}
                </h1>
                
                {/* Meta pills row */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center space-x-1 font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{currentMovie?.imdb_rating || 8.3}</span>
                    <span className="font-normal text-slate-400 text-[10px]">({currentMovie?.num_reviews || "412K"})</span>
                  </span>

                  {(currentMovie?.genres || ["Action", "Drama", "War"]).map((genre, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px] border border-slate-200 dark:border-slate-700">
                      {genre}
                    </span>
                  ))}

                  <span className="inline-flex items-center space-x-1 font-mono text-[11px] text-slate-400 ml-1">
                    <Calendar className="w-3 h-3" />
                    <span>{currentMovie?.year || 1995}</span>
                  </span>
                  <span className="inline-flex items-center space-x-1 font-mono text-[11px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{currentMovie?.duration || "1h 54m"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentMovie?.overview || "Scottish warrior William Wallace leads his people in a rebellion against the English crown to free Scotland from the tyranny of King Edward I."}
            </p>

            {/* Interactive User Feedback Buttons (Actionable RL Loop) */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              
              {/* Like Button */}
              <button
                onClick={() => handleUserInteract('like')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  userFeedback === 'like'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-102'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${userFeedback === 'like' ? 'fill-white' : ''}`} />
                <span>Like</span>
              </button>

              {/* Dislike Button */}
              <button
                onClick={() => handleUserInteract('dislike')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  userFeedback === 'dislike'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <ThumbsDown className={`w-3.5 h-3.5 ${userFeedback === 'dislike' ? 'fill-white' : ''}`} />
                <span>Dislike</span>
              </button>

              {/* Add to Watchlist */}
              <button
                onClick={() => {
                  setIsWatchlisted(!isWatchlisted);
                  handleUserInteract('save');
                }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isWatchlisted
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {isWatchlisted ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}</span>
              </button>

              {/* Share */}
              <button
                onClick={() => handleUserInteract('share')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

            </div>

          </div>

          {/* 3. "More Like This" Section (Matching mockup) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">More Like This</h3>
                  <p className="text-[11px] text-slate-400">Movies similar to {currentMovie?.title?.split('(')[0] || "Braveheart"} based on your taste</p>
                </div>
              </div>
            </div>

            {/* Horizontal Grid of Related Movies */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1">
              {moreLikeThis.map((sim, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectNextMovie(sim)}
                  className="group cursor-pointer bg-slate-50 dark:bg-slate-800/60 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500 hover:-translate-y-1 transition-all shadow-xs"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <img 
                      src={sim.image} 
                      alt={sim.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-white text-[9px] font-mono">
                      {sim.duration}
                    </span>
                  </div>
                  <div className="p-2 space-y-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                      {sim.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="flex items-center text-amber-600 font-bold">
                        <Star className="w-2.5 h-2.5 fill-amber-500 mr-0.5" />
                        {sim.rating}
                      </span>
                      <span className="truncate">{sim.genres[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN ("UP NEXT — Recommended by RL Agent" & Explanations) - Span 4
           ========================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* UP NEXT Box */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm space-y-4">
            
            {/* Header with Robot Icon matching prompt */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>UP NEXT — Recommended by RL Agent</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                    Based on your current watch, preferences and RL model policy
                  </p>
                </div>
              </div>

              {rlRecalculating && (
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin flex-shrink-0" />
              )}
            </div>

            {/* List of Up Next recommendations */}
            <div className="space-y-3 pt-1">
              {upNextList.map((item, idx) => {
                const isExpanded = expandedWhyId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all ${
                      isExpanded 
                        ? 'bg-blue-50/40 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700' 
                        : 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {/* Item Main Row */}
                    <div 
                      onClick={() => handleSelectNextMovie(item)}
                      className="p-3 flex items-start space-x-3 cursor-pointer group"
                    >
                      {/* Ranked Index Badge + Thumbnail */}
                      <div className="relative w-28 aspect-video rounded-xl overflow-hidden bg-slate-950 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-blue-600 text-white font-black text-[9px] flex items-center justify-center shadow-xs">
                          {idx + 1}
                        </span>
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-white text-[8px] font-mono">
                          {item.duration}
                        </span>
                      </div>

                      {/* Content Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-600 transition-colors">
                            {item.title}
                          </h4>
                        </div>

                        {/* Genre Badges */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.genres.slice(0, 3).map((g, gi) => (
                            <span key={gi} className="px-1.5 py-0.2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[9px] font-medium text-slate-600 dark:text-slate-300">
                              {g}
                            </span>
                          ))}
                        </div>

                        {/* RL Score & Reasoning */}
                        <div className="mt-1.5 flex items-center justify-between">
                          <div>
                            <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">
                              RL Score: {item.rlScore}
                            </span>
                            <p className="text-[9px] text-slate-400 truncate mt-0.5">
                              {item.reasonTag}
                            </p>
                          </div>

                          {/* "Why this? ⌵" button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedWhyId(isExpanded ? null : item.id);
                            }}
                            className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold text-[10px] flex items-center space-x-1 border border-blue-200 dark:border-blue-700/60 transition-colors flex-shrink-0"
                          >
                            <span>Why this?</span>
                            {isExpanded ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* Expandable "Why this is Up Next" Model Breakdown */}
                    {isExpanded && (
                      <div className="px-3.5 pb-3.5 pt-1 border-t border-blue-100 dark:border-blue-900/50 space-y-2 text-[11px] animate-in fade-in duration-150">
                        <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-blue-200/70 dark:border-blue-800 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-500">Predicted Reward:</span>
                            <span className="font-bold text-emerald-600">{item.predictedReward}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-500">Policy Prob &pi;(a|s):</span>
                            <span className="font-bold text-purple-600">{item.policyProb}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-500">Exploration Bonus:</span>
                            <span className="font-bold text-amber-600">{item.explorationBonus}</span>
                          </div>
                          <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-1.5">
                            {item.whyBreakdown.explanation}
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

          {/* "Why these recommendations?" Accordion Panel matching screenshot */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm space-y-3">
            
            <div 
              onClick={() => setIsWhyPanelOpen(!isWhyPanelOpen)}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                  Why these recommendations?
                </h4>
              </div>
              <button className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200">
                {isWhyPanelOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>

            {isWhyPanelOpen && (
              <div className="space-y-2.5 pt-1 text-xs">
                
                {/* 1. Action genre preference */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span>Your action genre preference</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">82%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>

                {/* 2. Recent engagement */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Recent engagement with historical movies</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">76%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>

                {/* 3. Similar audience behavior */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span>Similar audience behavior (collaborative filtering)</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">68%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>

                {/* 4. Diversity boost */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Diversity boost (to explore new content)</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">42%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>

                {/* 5. Long-term retention */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      <span>Long-term retention prediction</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">61%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '61%' }}></div>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
