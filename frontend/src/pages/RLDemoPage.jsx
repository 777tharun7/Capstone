import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Play, 
  RotateCcw, 
  Cpu, 
  Award, 
  UserCheck, 
  Sliders, 
  Layers, 
  TrendingUp, 
  Compass,
  Sparkles
} from 'lucide-react';
import MDPVisualizer from '../components/MDPVisualizer';
import { getRecommendations, recordInteraction, resetUserSession } from '../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export default function RLDemoPage({ currentUser, activeModel, setActiveModel }) {
  const [sessionData, setSessionData] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [actionDistribution, setActionDistribution] = useState([]);
  const [explorationState, setExplorationState] = useState({
    mode: 'Exploitation (High Confidence)',
    epsilon: 0.05,
    entropy: 2.14,
    temperature: 1.0
  });

  useEffect(() => {
    fetchLiveState();
  }, [currentUser, activeModel]);

  const fetchLiveState = async () => {
    try {
      const data = await getRecommendations(currentUser, activeModel, 8);
      
      const topAction = data.recommendations?.[0];
      const modelMeta = data.model_metadata || {};

      setSessionData({
        session_step: data.session_step,
        cumulative_reward: data.cumulative_reward,
        satisfaction: data.user_satisfaction,
        fatigue: Math.max(0, 1 - data.user_satisfaction),
        state_preview: data.state_vector_preview || [0.05, 0.42, 0.18, 0.81, 0.12, 0.05, 0.50, 0.10],
        action_id: topAction?.action_id || 44,
        action_title: topAction?.title || "Interstellar (2014)",
        genre: topAction?.primary_genre || "Sci-Fi",
        interaction: "like",
        reward: 3.5,
        model_metadata: modelMeta
      });

      // Prepare distribution chart for top candidates
      if (data.recommendations) {
        const chartItems = data.recommendations.slice(0, 6).map((item, idx) => ({
          title: item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title,
          genre: item.primary_genre,
          score: Math.round(item.match_score * 100),
          rank: idx + 1
        }));
        setActionDistribution(chartItems);
      }
    } catch (e) {
      console.error("Error fetching live demo state", e);
    }
  };

  const handleExecuteMDPStep = async () => {
    setIsExecuting(true);
    try {
      // 1. Get current top recommendation action
      const data = await getRecommendations(currentUser, activeModel, 5);
      const topRec = data.recommendations?.[0];
      if (!topRec) return;

      // 2. Simulate probabilistic user response
      const rand = Math.random();
      let simInteraction = 'click';
      if (rand > 0.6) simInteraction = 'like';
      else if (rand < 0.2) simInteraction = 'skip';

      // 3. Record interaction & step MDP
      const stepRes = await recordInteraction(currentUser, topRec.action_id, simInteraction, activeModel);

      // 4. Update visual state
      setSessionData({
        session_step: stepRes.session_step,
        cumulative_reward: stepRes.cumulative_reward,
        satisfaction: stepRes.user_satisfaction,
        fatigue: Math.max(0, 1 - stepRes.user_satisfaction),
        state_preview: stepRes.current_state,
        next_state_preview: stepRes.next_state,
        action_id: topRec.action_id,
        action_title: topRec.title,
        genre: topRec.primary_genre,
        interaction: stepRes.interaction_type,
        reward: stepRes.reward,
        reward_breakdown: stepRes.reward_breakdown,
        model_metadata: data.model_metadata
      });

      // Refresh candidate distribution
      const nextData = await getRecommendations(currentUser, activeModel, 6);
      if (nextData.recommendations) {
        setActionDistribution(nextData.recommendations.map((item, idx) => ({
          title: item.title.length > 15 ? item.title.substring(0, 15) + '...' : item.title,
          genre: item.primary_genre,
          score: Math.round(item.match_score * 100),
          rank: idx + 1
        })));
      }
    } catch (e) {
      console.error("Error executing MDP step", e);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleReset = async () => {
    try {
      await resetUserSession(currentUser);
      await fetchLiveState();
    } catch (e) {
      console.error("Error resetting session", e);
    }
  };

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Live Reinforcement Learning Engine Demo</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Visual inspection of State-Action-Reward-State (SARS') transitions and real-time policy improvement.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset State</span>
          </button>
          <button
            onClick={handleExecuteMDPStep}
            disabled={isExecuting}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-white ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? "Executing MDP Step..." : "Step MDP Transition"}</span>
          </button>
        </div>
      </div>

      {/* Main MDP Interactive Pipeline */}
      <MDPVisualizer
        currentStepData={sessionData}
        activeModel={activeModel}
        onTriggerStep={handleExecuteMDPStep}
        isExecuting={isExecuting}
      />

      {/* Exploration vs Exploitation & Action Value Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Exploration vs Exploitation Analysis Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Exploration vs Exploitation Trade-off</h3>
            </div>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
              Active Strategy
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            In recommendation systems, pure exploitation traps users into repetitive clickbait loops (narrow filter bubbles). 
            Reinforcement Learning maintains principled exploration:
          </p>

          <div className="space-y-3 pt-2">
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800">
                  {activeModel === 'DQN' ? 'Epsilon (ε-Greedy Schedule)' : activeModel === 'PPO' ? 'Policy Entropy Bonus (H)' : 'LinUCB Upper Bound Radius (α)'}
                </span>
                <span className="font-mono text-blue-700 font-bold">
                  {activeModel === 'DQN' ? 'ε = 0.050' : activeModel === 'PPO' ? 'H(π) = 2.14 nats' : 'α = 0.80'}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full" 
                  style={{ width: activeModel === 'DQN' ? '15%' : '65%' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-blue-700 font-bold block">Exploration</span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Recommends novel genres to discover latent emerging interests & prevent boredom.
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                <span className="text-cyan-700 font-bold block">Exploitation</span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Recommends high-confidence known items to maximize immediate satisfaction.
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Candidate Action Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {activeModel === 'PPO' ? 'Policy Probability Distribution π(a|s)' : activeModel === 'DQN' ? 'Action Q-Values Q(s, a)' : 'UCB Affinity Scores'}
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Top Candidates</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={actionDistribution} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" tick={{ fontSize: 10 }} domain={[0, 100]} />
                <YAxis dataKey="title" type="category" stroke="#475569" tick={{ fontSize: 10 }} width={90} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '8px',
                    fontSize: '11px',
                    color: '#0f172a',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(val) => [`${val}%`, 'Policy Preference']}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {actionDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#2563eb" : "#06b6d4"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
