import React from 'react';
import { ArrowRight, UserCheck, Cpu, Film, HeartHandshake, Award, RefreshCw, Zap, TrendingUp } from 'lucide-react';

export default function MDPVisualizer({ 
  currentStepData, 
  activeModel = "PPO",
  onTriggerStep,
  isExecuting 
}) {
  const state = currentStepData?.state_preview || [0.05, 0.42, 0.18, 0.81, 0.12, 0.05, 0.50, 0.10];
  const selectedAction = currentStepData?.action_title || "Gladiator (2000)";
  const interaction = currentStepData?.interaction || "like";
  const reward = currentStepData?.reward !== undefined ? currentStepData.reward : 3.5;
  const cumReward = currentStepData?.cumulative_reward || 14.2;
  const stepNum = currentStepData?.session_step || 4;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Zap className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Markov Decision Process (MDP) Interactive Loop
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Sequential State Transition: <code className="text-blue-600 font-mono font-semibold">S_t → A_t → R_t → S_t+1 → Policy Update</code>
              </p>
            </div>
          </div>
        </div>

        {onTriggerStep && (
          <button
            onClick={onTriggerStep}
            disabled={isExecuting}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
            <span>{isExecuting ? "Executing MDP Step..." : "Simulate Next Interaction Step"}</span>
          </button>
        )}
      </div>

      {/* Visual Pipeline Flow */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        
        {/* Step 1: State S_t */}
        <div className="bg-slate-50 p-4 rounded-xl border border-blue-200 flex flex-col justify-between space-y-3 relative group hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold border border-blue-200">
              State S_t
            </span>
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">User State Vector</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">48-dim embedding</p>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
            <div className="flex justify-between"><span>Step:</span> <span className="text-blue-700 font-bold">#{stepNum}</span></div>
            <div className="flex justify-between"><span>Satisfaction:</span> <span className="text-emerald-600 font-semibold">{(currentStepData?.satisfaction || 0.75).toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Fatigue:</span> <span className="text-amber-600 font-semibold">{(currentStepData?.fatigue || 0.12).toFixed(2)}</span></div>
          </div>
        </div>

        {/* Step 2: Agent / Policy Network */}
        <div className="bg-slate-50 p-4 rounded-xl border border-purple-200 flex flex-col justify-between space-y-3 relative group hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold border border-purple-200">
              Agent Policy
            </span>
            <Cpu className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">{activeModel}</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {activeModel === 'PPO' ? 'Actor-Critic π(a|s)' : activeModel === 'DQN' ? 'Q-Network Q(s, a)' : 'Contextual Bandit'}
            </p>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
            <div className="flex justify-between">
              <span>{activeModel === 'PPO' ? 'Policy Prob:' : 'Q-Val:'}</span>
              <span className="text-purple-700 font-bold">
                {activeModel === 'PPO' ? '82.4%' : 'Q = 4.18'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Exploration:</span>
              <span className="text-blue-600 font-semibold">Active</span>
            </div>
          </div>
        </div>

        {/* Step 3: Action A_t */}
        <div className="bg-slate-50 p-4 rounded-xl border border-cyan-200 flex flex-col justify-between space-y-3 relative group hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold border border-cyan-200">
              Action A_t
            </span>
            <Film className="w-4 h-4 text-cyan-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{selectedAction}</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Selected Movie</p>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
            <div className="flex justify-between"><span>Item ID:</span> <span className="text-cyan-700 font-semibold">#{currentStepData?.action_id || 44}</span></div>
            <div className="flex justify-between"><span>Genre:</span> <span className="text-slate-800">{currentStepData?.genre || "Sci-Fi"}</span></div>
          </div>
        </div>

        {/* Step 4: Environment & Reward R_t */}
        <div className="bg-slate-50 p-4 rounded-xl border border-emerald-200 flex flex-col justify-between space-y-3 relative group hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              Reward R_t
            </span>
            <Award className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-emerald-700 capitalize">{interaction} Interaction</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Multi-Objective Reward</p>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
            <div className="flex justify-between"><span>Step Reward:</span> <span className="text-emerald-700 font-bold">+{reward.toFixed(1)}</span></div>
            <div className="flex justify-between"><span>Cumulative:</span> <span className="text-blue-700 font-bold">{cumReward.toFixed(1)}</span></div>
          </div>
        </div>

        {/* Step 5: Next State S_t+1 */}
        <div className="bg-slate-50 p-4 rounded-xl border border-amber-200 flex flex-col justify-between space-y-3 relative group hover:shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-200">
              Next S_t+1
            </span>
            <RefreshCw className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">State Transition</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Dynamic update</p>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
            <div className="flex justify-between"><span>Affinity Shift:</span> <span className="text-amber-700 font-semibold">+0.15</span></div>
            <div className="flex justify-between"><span>Policy Update:</span> <span className="text-emerald-700 font-semibold">GAE Adv</span></div>
          </div>
        </div>

      </div>

      {/* State Vector Raw Inspection */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-medium text-slate-600 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            Numerical State Vector Feature Preview (S_t[0..7]):
          </span>
          <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">dim = 48</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {state.map((val, idx) => (
            <div key={idx} className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono shadow-2xs">
              <span className="text-slate-400 mr-1.5">f{idx}:</span>
              <span className={val >= 0 ? "text-blue-700 font-bold" : "text-rose-600 font-bold"}>
                {typeof val === 'number' ? val.toFixed(3) : val}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
