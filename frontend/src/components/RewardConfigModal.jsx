import React, { useState, useEffect } from 'react';
import { X, Sliders, CheckCircle2, RotateCcw } from 'lucide-react';
import { getRewardWeights, updateRewardWeights } from '../services/api';

export default function RewardConfigModal({ isOpen, onClose }) {
  const [weights, setWeights] = useState({
    click: 1.0,
    meaningful_interaction: 2.0,
    long_session: 4.0,
    like: 3.0,
    share: 5.0,
    retention: 10.0,
    skip: -2.0,
    immediate_exit: -3.0,
    repeated_recommendation_penalty: -2.0,
    novelty_bonus: 0.5,
    diversity_bonus: 0.5
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchWeights();
    }
  }, [isOpen]);

  const fetchWeights = async () => {
    try {
      const data = await getRewardWeights();
      if (data) setWeights(data);
    } catch (e) {
      console.error("Error loading weights", e);
    }
  };

  const handleChange = (key, val) => {
    setWeights(prev => ({
      ...prev,
      [key]: parseFloat(val) || 0
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateRewardWeights(weights);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (e) {
      console.error("Error updating reward weights", e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setWeights({
      click: 1.0,
      meaningful_interaction: 2.0,
      long_session: 4.0,
      like: 3.0,
      share: 5.0,
      retention: 10.0,
      skip: -2.0,
      immediate_exit: -3.0,
      repeated_recommendation_penalty: -2.0,
      novelty_bonus: 0.5,
      diversity_bonus: 0.5
    });
  };

  if (!isOpen) return null;

  const rewardFields = [
    { key: 'click', label: 'Click (Immediate CTR)', color: 'text-cyan-700 font-semibold', desc: 'Immediate single interaction reward' },
    { key: 'meaningful_interaction', label: 'Meaningful Watch', color: 'text-blue-700 font-semibold', desc: 'Extended viewing engagement' },
    { key: 'like', label: 'Like Feedback', color: 'text-emerald-700 font-semibold', desc: 'Explicit user positive rating' },
    { key: 'share', label: 'Share Content', color: 'text-purple-700 font-semibold', desc: 'High affinity advocacy signal' },
    { key: 'long_session', label: 'Long Session (>=5 steps)', color: 'text-amber-700 font-semibold', desc: 'Multi-step engagement bonus' },
    { key: 'retention', label: 'User Retention (Long-term)', color: 'text-emerald-800 font-bold', desc: 'Return probability & session extension bonus' },
    { key: 'skip', label: 'Skip Penalty', color: 'text-rose-700 font-semibold', desc: 'Negative signal on uninteresting content' },
    { key: 'immediate_exit', label: 'Immediate Exit Penalty', color: 'text-rose-800 font-bold', desc: 'High penalty when user leaves within 2 steps' },
    { key: 'repeated_recommendation_penalty', label: 'Repetition / Fatigue Penalty', color: 'text-red-700 font-semibold', desc: 'Penalty for recommending the same item in succession' },
    { key: 'novelty_bonus', label: 'Novelty Bonus', color: 'text-indigo-700 font-semibold', desc: 'Incentivizes discovering previously unseen content' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Multi-Objective Reward Function Weights</h2>
              <p className="text-xs text-slate-500">Configure MDP immediate & delayed engagement incentives for experimental tuning</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-100 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-blue-800 font-mono">Academic Formulation: </span>
            <code className="text-slate-900 font-semibold">R_t = R_immediate(click, like, skip) + R_delayed(session_len, retention) - P_fatigue(repeat)</code>
            <p className="mt-1 text-slate-500 text-[11px]">
              Weights can be altered dynamically to observe policy convergence shifts between short-term CTR greedy behavior and long-term retention exploration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {rewardFields.map((f) => (
              <div key={f.key} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={`text-xs ${f.color}`}>
                    {f.label}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={weights[f.key] ?? 0}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    className="w-20 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-900 text-right focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <button
            onClick={handleResetDefaults}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center space-x-2">
            {savedSuccess && (
              <span className="flex items-center space-x-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" />
                <span>Updated Live!</span>
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm shadow-blue-500/20 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Apply Reward Config"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
