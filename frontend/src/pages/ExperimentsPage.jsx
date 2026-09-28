import React, { useState, useEffect } from 'react';
import { 
  FlaskConical, 
  TrendingUp, 
  Activity, 
  RefreshCw, 
  Layers, 
  Zap, 
  Award,
  Clock
} from 'lucide-react';
import TrainingRewardChart from '../charts/TrainingRewardChart';
import { getTrainingHistory } from '../services/api';

export default function ExperimentsPage() {
  const [history, setHistory] = useState({ ppo: [], dqn: [], bandit: [] });
  const [selectedModel, setSelectedModel] = useState("ppo");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const data = await getTrainingHistory();
      setHistory(data || { ppo: [], dqn: [], bandit: [] });
    } catch (e) {
      console.error("Error loading training history", e);
    } finally {
      setIsLoading(false);
    }
  };

  const activeData = history[selectedModel] || [];
  const peakReward = activeData.length > 0 
    ? Math.max(...activeData.map(d => d.reward || 0)) 
    : 0;
  const avgFinalReward = activeData.length >= 25 
    ? (activeData.slice(-25).reduce((acc, d) => acc + (d.reward || 0), 0) / 25).toFixed(2)
    : (activeData.reduce((acc, d) => acc + (d.reward || 0), 0) / Math.max(1, activeData.length)).toFixed(2);

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <FlaskConical className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Training Convergence & Experiments</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Episode-by-episode learning curves, TD loss trajectories, policy entropy, and cumulative returns.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchHistory}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Curves</span>
        </button>
      </div>

      {/* Model Selector Tabs */}
      <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200 w-fit">
        <button
          onClick={() => setSelectedModel("ppo")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            selectedModel === "ppo"
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          PPO (Proposed)
        </button>
        <button
          onClick={() => setSelectedModel("dqn")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            selectedModel === "dqn"
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          DQN (Deep Q-Net)
        </button>
        <button
          onClick={() => setSelectedModel("bandit")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            selectedModel === "bandit"
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          LinUCB Bandit
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Peak Episode Return</span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">
            +{peakReward.toFixed(2)}
          </p>
          <span className="text-[11px] text-slate-500 block">Best single session trajectory</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Converged Return (Last 25 Eps)</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-slate-900">
            +{avgFinalReward}
          </p>
          <span className="text-[11px] text-slate-500 block">Rolling asymptotic mean</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-medium">Total Logged Episodes</span>
            <Clock className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-cyan-600">
            {activeData.length}
          </p>
          <span className="text-[11px] text-slate-500 block">Offline simulator training</span>
        </div>

      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <TrainingRewardChart
          data={activeData}
          title={`${selectedModel.toUpperCase()} Learning Dynamics & Cumulative Return Convergence`}
        />
      </div>

    </div>
  );
}
