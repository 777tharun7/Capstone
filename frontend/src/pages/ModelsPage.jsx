import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  Cpu, 
  BrainCircuit, 
  Target, 
  Play, 
  CheckCircle2, 
  RefreshCw, 
  HardDrive, 
  Sliders,
  Check
} from 'lucide-react';
import { getModelStatus, selectModel, triggerTraining } from '../services/api';

export default function ModelsPage({ activeModel, setActiveModel }) {
  const [modelStatus, setModelStatus] = useState([]);
  const [trainingModel, setTrainingModel] = useState(null);
  const [trainingEpisodes, setTrainingEpisodes] = useState({
    "PPO": 200,
    "DQN": 200,
    "Contextual Bandit": 150,
    "Collaborative Filtering": 35
  });

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await getModelStatus();
      setModelStatus(data.models || []);
      if (data.active_model) setActiveModel(data.active_model);
    } catch (e) {
      console.error("Error loading model status", e);
    }
  };

  const handleSelectModel = async (name) => {
    try {
      await selectModel(name);
      setActiveModel(name);
    } catch (e) {
      console.error("Error selecting model", e);
    }
  };

  const handleTrain = async (name) => {
    setTrainingModel(name);
    try {
      const eps = trainingEpisodes[name] || 150;
      await triggerTraining(name, eps);
      setTimeout(async () => {
        await fetchStatus();
        setTrainingModel(null);
      }, 3500);
    } catch (e) {
      console.error("Error starting training", e);
      setTrainingModel(null);
    }
  };

  const modelConfigs = {
    "Collaborative Filtering": {
      framework: "NumPy + Scikit-Learn Matrix Factorization",
      stateInput: "User Historical Interaction Vector (R^100)",
      actionOutput: "Top-K Item Similarity Ranking",
      keyParams: "Factors = 20, Epochs = 35, Reg = 0.02, Cosine Item Similarity",
      objective: "Minimize rating prediction MSE across observed user-item pairs",
      color: "border-purple-200 text-purple-700 bg-purple-50",
      accent: "purple"
    },
    "Contextual Bandit": {
      framework: "LinUCB Linear Ridge Regression",
      stateInput: "48-dim Dynamic Context Vector x_t",
      actionOutput: "Upper Confidence Bound Arm Index a_t",
      keyParams: "Arms = 100, Alpha Exploration = 0.80, Dimension = 48",
      objective: "Maximize immediate 1-step reward E[r_t|x_t] with uncertainty radius",
      color: "border-amber-200 text-amber-700 bg-amber-50",
      accent: "amber"
    },
    "DQN": {
      framework: "PyTorch Deep Q-Network (QNetwork)",
      stateInput: "48-dim Continuous State S_t",
      actionOutput: "100-dim Action Q-Values Q(s, a)",
      keyParams: "γ = 0.95, LR = 1e-3, Buffer = 20,000, Target Sync = 10, Huber Loss",
      objective: "Minimize Bellman Temporal Difference error on discounted return",
      color: "border-blue-200 text-blue-700 bg-blue-50",
      accent: "blue"
    },
    "PPO": {
      framework: "PyTorch ActorCritic (Actor π_θ & Critic V_ϕ)",
      stateInput: "48-dim Continuous State S_t",
      actionOutput: "Categorical Policy Distribution π(a|s)",
      keyParams: "γ = 0.98, GAE λ = 0.95, Clip ε = 0.2, Entropy Coef = 0.03, Epochs = 4",
      objective: "Maximize clipped surrogate policy objective with GAE advantages",
      color: "border-emerald-200 text-emerald-700 bg-emerald-50",
      accent: "emerald"
    }
  };

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Model Management & Training Suite</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure neural architectures, trigger background training runs, and inspect serialized model checkpoints.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Active Deployment:</span>
          <span className="px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 font-mono font-bold text-xs border border-blue-200">
            {activeModel}
          </span>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modelStatus.map((m) => {
          const cfg = modelConfigs[m.name] || modelConfigs["PPO"];
          const isActive = activeModel === m.name;
          const isTrainingThis = trainingModel === m.name;

          return (
            <div 
              key={m.name}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between space-y-5 shadow-sm transition-all ${
                isActive 
                  ? 'border-blue-500/80 ring-2 ring-blue-500/20 shadow-md' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              
              {/* Card Top */}
              <div className="space-y-3.5">
                
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${cfg.color}`}>
                    {m.name}
                  </span>
                  
                  {isActive ? (
                    <span className="flex items-center space-x-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                      <Check className="w-3.5 h-3.5" />
                      <span>Active Inference</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSelectModel(m.name)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
                    >
                      Set as Active
                    </button>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{m.type}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{m.description}</p>
                </div>

                {/* Specs Table */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-400">Framework:</span>
                    <span className="font-medium text-right">{cfg.framework}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-400">State Input:</span>
                    <span className="font-medium text-right">{cfg.stateInput}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-400">Action Space:</span>
                    <span className="font-medium text-right">{cfg.actionOutput}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span className="text-slate-400">Parameters:</span>
                    <span className="text-blue-700 font-semibold text-right">{cfg.keyParams}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                    <span className="text-slate-400">Checkpoint: </span>
                    <code className="text-blue-600 font-semibold">{m.checkpoint}</code>
                  </div>
                </div>

              </div>

              {/* Card Footer / Train Controls */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-medium text-slate-600">Episodes:</label>
                  <input
                    type="number"
                    value={trainingEpisodes[m.name] || 150}
                    onChange={(e) => setTrainingEpisodes({ ...trainingEpisodes, [m.name]: Number(e.target.value) })}
                    className="w-16 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-800 text-right focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  onClick={() => handleTrain(m.name)}
                  disabled={isTrainingThis}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${isTrainingThis ? 'animate-spin' : 'fill-white'}`} />
                  <span>{isTrainingThis ? "Training Model..." : "Train Model"}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
