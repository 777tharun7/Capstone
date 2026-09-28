import React from 'react';
import { 
  BookOpen, 
  BrainCircuit, 
  Cpu, 
  Target, 
  ShieldCheck, 
  Layers, 
  Database, 
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-8 py-6 max-w-4xl mx-auto animate-in fade-in duration-300 text-slate-700 text-sm leading-relaxed">
      
      {/* Paper Title Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-mono font-semibold">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Academic Research Documentation & Methodology</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Reinforcement Learning-Based Adaptive Recommendation System for Long-Term User Engagement Optimization
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          A Sequential Decision-Making Framework to Overcome Greedy CTR Collapse in Digital Media Platforms.
        </p>
      </div>

      {/* 1. Problem Statement */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          1. Research Gap & Problem Statement
        </h2>
        <p className="text-slate-600">
          Conventional recommendation systems rely heavily on static Collaborative Filtering or supervised deep learning models (e.g., Matrix Factorization, Two-Tower models) that treat each interaction as an isolated, independent decision. These systems greedily optimize short-term metrics such as immediate Click-Through Rate (CTR).
        </p>
        <p className="text-slate-600">
          However, myopic CTR optimization ignores sequential dynamics, such as <strong>repetition fatigue</strong>, <strong>content saturation</strong>, and <strong>user churn</strong>. When repeatedly presented with high-clickbait items from narrow genres, user satisfaction declines and session lengths terminate prematurely.
        </p>
      </section>

      {/* 2. MDP Formulation */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
          2. Markov Decision Process (MDP) Formulation
        </h2>
        <p className="text-slate-600">
          We model sequential recommendation as an infinite-horizon Markov Decision Process defined by the tuple <code>(S, A, P, R, γ)</code>:
        </p>
        
        <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3 font-mono text-xs">
          <div><strong className="text-blue-700">State S_t &isin; R^48:</strong> Combines normalized User ID (1 dim), Dynamic Category Affinities (19 dims), Recent Recommendation History Embedding (21 dims), and Session Dynamics (Step, Consecutive Skips, Fatigue, Satisfaction, Click Ratio) (7 dims).</div>
          <div><strong className="text-purple-700">Action A_t &isin; {'{0, ..., N-1}'}:</strong> Discrete candidate item chosen from the catalog.</div>
          <div><strong className="text-emerald-700">Reward R_t:</strong> Decomposed multi-objective reward: <br />
            <code className="text-slate-900 font-semibold">R_t = R_immediate(click, like, skip) + R_delayed(session_len, retention) - P_fatigue(repeat)</code>
          </div>
          <div><strong className="text-amber-700">Discount Factor &gamma;:</strong> &gamma; = 0.98, ensuring the agent prioritizes long-term future user retention over immediate one-step gain.</div>
        </div>
      </section>

      {/* 3. Implemented RL Models */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          3. Model Architectures & Theoretical Foundations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2.5">
            <h3 className="font-bold text-blue-700 text-xs font-mono uppercase">Deep Q-Network (DQN)</h3>
            <p className="text-xs text-slate-600">
              Value-based RL model that approximates action-values Q(s, a). Features an Experience Replay Buffer (capacity 20,000) to break temporal correlations and a Target Network updated periodically to stabilize Bellman loss:
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-900 font-semibold shadow-2xs">
              L_TD = E[(r + γ max_a' Q_target(s', a') - Q(s, a))^2]
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2.5">
            <h3 className="font-bold text-emerald-700 text-xs font-mono uppercase">Proximal Policy Optimization (PPO)</h3>
            <p className="text-xs text-slate-600">
              Actor-Critic policy gradient method using Generalized Advantage Estimation (GAE-λ) and a clipped surrogate objective to prevent destabilizing policy updates:
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] font-mono text-slate-900 font-semibold shadow-2xs">
              L^CLIP = E[min(r_t(θ)A_t, clip(r_t(θ), 1-ε, 1+ε)A_t)]
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dataset & Simulation */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
          4. MovieLens 100K Dataset & Offline User Simulation
        </h2>
        <p className="text-slate-600">
          The system uses the benchmark <strong>MovieLens 100K dataset</strong> comprising real user-movie ratings and 19 genre categories. An offline Gymnasium-compliant user simulator models user satisfaction, fatigue accumulation, and probabilistic continuation based on latent affinities and recent recommendation novelty.
        </p>
      </section>

    </div>
  );
}
