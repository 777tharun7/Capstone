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
  FileText,
  ExternalLink,
  Award,
  BookMarked,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function AboutPage() {
  const researchPapers = [
    {
      id: 1,
      title: "A Survey on Reinforcement Learning for Recommender Systems",
      authors: "Yuanguo Lin, Yong Liu, Fan Lin, Lixin Zou, Pengcheng Wu, Wenhua Zeng, Huanhuan Chen, Chunyan Miao",
      year: 2023,
      venue: "IEEE Transactions on Neural Networks and Learning Systems (TNNLS)",
      badge: "Comprehensive Survey",
      badgeColor: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      summary: "Surveys reinforcement learning (RL) based recommender systems and explains how recommendation problems can be modeled as sequential decision-making tasks. It reviews various RL and deep RL approaches used in interactive, conversational, sequential, and explainable recommendation systems.",
      contributions: [
        "Highlights that traditional recommender systems struggle to adapt to dynamic user behavior, while RL continuously learns from user interactions to improve long-term engagement and satisfaction.",
        "Provides a detailed classification and systematic taxonomy of RL algorithms and their applications across diverse recommendation scenarios."
      ],
      limitations: "Mainly theoretical and does not propose a single new model or standalone implementation. Emphasizes open challenges such as data sparsity, action scalability, privacy, interpretability, and real-world deployment."
    },
    {
      id: 2,
      title: "Deep Reinforcement Learning for List-wise Recommendations",
      authors: "Xiangyu Zhao, Liang Zhang, Long Xia, Zhuoye Ding, Dawei Yin, Jiliang Tang",
      year: 2019,
      venue: "ACM (DRL4KDD Workshop, Knowledge Discovery and Data Mining Conference)",
      badge: "LIRD Architecture",
      badgeColor: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      summary: "Proposes a deep reinforcement learning framework called LIRD for recommender systems, focusing on list-wise recommendations instead of recommending isolated single items. It models recommendation as a sequential decision-making process using a Markov Decision Process (MDP), allowing the system to learn from user feedback over time.",
      contributions: [
        "Addresses the limitations of traditional recommender systems that greedily optimize short-term rewards and fail to capture dynamic user preferences.",
        "Combines an Actor-Critic architecture with list-wise recommendation and an offline-to-online simulator. Experimental results demonstrate superior short-term and long-term recommendation performance on real-world e-commerce data."
      ],
      limitations: "Depends heavily on simulated environments that may not fully reflect organic user behavior. Faces challenges related to state scalability, computational complexity, and fixed user browsing pattern assumptions."
    },
    {
      id: 3,
      title: "Reinforcement Learning to Rank in E-Commerce Search Engine: Formalization, Analysis, and Application",
      authors: "Yujing Hu, Qing Da, Anxiang Zeng, Yang Yu, Yinghui Xu",
      year: 2018,
      venue: "ACM SIGKDD (KDD '18)",
      badge: "Production Ranking & SSMDP",
      badgeColor: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      summary: "Proposes a reinforcement learning (RL) method for e-commerce search ranking by modeling user interactions as a sequential process using Search Session Markov Decision Process (SSMDP). Unlike traditional learning-to-rank methods that optimize only single-step actions like clicks, this approach considers the entire user session, including clicks, purchases, and exits.",
      contributions: [
        "Introduces a new algorithm called DPG-FBE (Deterministic Policy Gradient with Follow-the-Leader Batch Evaluation) to handle sparse rewards and maximize multi-step cumulative gross merchandise volume (GMV).",
        "Large-scale live A/B experiments on Taobao demonstrated massive improvements, achieving ~30–40% better transaction performance over state-of-the-art learning-to-rank baselines."
      ],
      limitations: "High computational training cost, strong dependence on massive historical log volumes, and reliance on accurate offline reward estimation to prevent policy drift."
    },
    {
      id: 4,
      title: "Reinforcement Learning based Recommender Systems: A Survey",
      authors: "M. Mehdi Afsar, Trafford Crump, Behrouz Far",
      year: 2022,
      venue: "ACM Computing Surveys (CSUR)",
      badge: "Foundational Survey",
      badgeColor: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      summary: "Surveys reinforcement learning (RL) based recommender systems and explains how recommendation tasks can be treated as sequential decision-making problems. It highlights that traditional recommender systems struggle with dynamic user behavior and long-term engagement, while RL continuously learns from user interactions over time.",
      contributions: [
        "Classifies and analyzes model-free (Q-learning, Actor-Critic, Policy Gradients) and model-based RL recommendation frameworks.",
        "Rigorous comparative analysis of reward formulation strategies, state representations, and offline simulation benchmarks."
      ],
      limitations: "Primarily conceptual and theoretical survey; does not introduce experimental benchmark suites or unified standardized open-source evaluation protocols."
    }
  ];

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto animate-in fade-in duration-300 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
      
      {/* Paper Title Header */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-mono font-semibold">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Academic Research Documentation & Methodology</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Reinforcement Learning-Based Adaptive Recommendation System for Long-Term User Engagement Optimization
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          A Sequential Decision-Making Framework to Overcome Greedy CTR Collapse in Digital Media Platforms.
        </p>
      </div>

      {/* 1. Problem Statement */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          1. Research Gap & Problem Statement
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Conventional recommendation systems rely heavily on static Collaborative Filtering or supervised deep learning models (e.g., Matrix Factorization, Two-Tower models) that treat each interaction as an isolated, independent decision. These systems greedily optimize short-term metrics such as immediate Click-Through Rate (CTR).
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          However, myopic CTR optimization ignores sequential dynamics, such as <strong>repetition fatigue</strong>, <strong>content saturation</strong>, and <strong>user churn</strong>. When repeatedly presented with high-clickbait items from narrow genres, user satisfaction declines and session lengths terminate prematurely.
        </p>
      </section>

      {/* 2. MDP Formulation */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
          2. Markov Decision Process (MDP) Formulation
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          We model sequential recommendation as an infinite-horizon Markov Decision Process defined by the tuple <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">(S, A, P, R, γ)</code>:
        </p>
        
        <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 font-mono text-xs">
          <div><strong className="text-blue-700 dark:text-blue-400">State S_t &isin; R^48:</strong> Combines normalized User ID (1 dim), Dynamic Category Affinities (19 dims), Recent Recommendation History Embedding (21 dims), and Session Dynamics (Step, Consecutive Skips, Fatigue, Satisfaction, Click Ratio) (7 dims).</div>
          <div><strong className="text-purple-700 dark:text-purple-400">Action A_t &isin; {'{0, ..., N-1}'}:</strong> Discrete candidate item chosen from the catalog.</div>
          <div><strong className="text-emerald-700 dark:text-emerald-400">Reward R_t:</strong> Decomposed multi-objective reward: <br />
            <code className="text-slate-900 dark:text-slate-100 font-semibold">R_t = R_immediate(click, like, skip) + R_delayed(session_len, retention) - P_fatigue(repeat)</code>
          </div>
          <div><strong className="text-amber-700 dark:text-amber-400">Discount Factor &gamma;:</strong> &gamma; = 0.98, ensuring the agent prioritizes long-term future user retention over immediate one-step gain.</div>
        </div>
      </section>

      {/* 3. Implemented RL Models */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          3. Model Architectures & Theoretical Foundations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <h3 className="font-bold text-blue-700 dark:text-blue-400 text-xs font-mono uppercase">Deep Q-Network (DQN)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Value-based RL model that approximates action-values Q(s, a). Features an Experience Replay Buffer (capacity 20,000) to break temporal correlations and a Target Network updated periodically to stabilize Bellman loss:
            </p>
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-900 dark:text-slate-100 font-semibold shadow-2xs">
              L_TD = E[(r + γ max_a' Q_target(s', a') - Q(s, a))^2]
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <h3 className="font-bold text-emerald-700 dark:text-emerald-400 text-xs font-mono uppercase">Proximal Policy Optimization (PPO)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Actor-Critic policy gradient method using Generalized Advantage Estimation (GAE-λ) and a clipped surrogate objective to prevent destabilizing policy updates:
            </p>
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-900 dark:text-slate-100 font-semibold shadow-2xs">
              L^CLIP = E[min(r_t(θ)A_t, clip(r_t(θ), 1-ε, 1+ε)A_t)]
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dataset & Simulation */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 transition-colors">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
          4. MovieLens 100K Dataset & Offline User Simulation
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          The system uses the benchmark <strong>MovieLens 100K dataset</strong> comprising real user-movie ratings and 19 genre categories. An offline Gymnasium-compliant user simulator models user satisfaction, fatigue accumulation, and probabilistic continuation based on latent affinities and recent recommendation novelty.
        </p>
      </section>

      {/* 5. Key Research Papers & Theoretical Literature Review */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              5. Theoretical Foundation: Key Literature & Research Papers
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Seminal works grounding the sequential MDP recommendation, Actor-Critic ranking, and session retention frameworks.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-300 font-bold self-start sm:self-auto">
            4 Core Citations
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {researchPapers.map((paper) => (
            <div 
              key={paper.id} 
              className="bg-slate-50/70 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/80 p-5 flex flex-col justify-between space-y-4 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-sm"
            >
              <div className="space-y-3">
                {/* Paper Header & Badge */}
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border ${paper.badgeColor}`}>
                    {paper.badge}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">
                    {paper.year}
                  </span>
                </div>

                {/* Title & Authors */}
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                    {paper.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-1">
                    <strong className="text-slate-700 dark:text-slate-200">Authors:</strong> {paper.authors}
                  </p>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium font-mono mt-0.5">
                    <strong>Publisher:</strong> {paper.venue}
                  </p>
                </div>

                {/* Core Summary */}
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700/60">
                  {paper.summary}
                </div>

                {/* Key Contributions List */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono block">
                    Key Contributions:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {paper.contributions.map((c, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Research Limitation / Gap Identified */}
              <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-300 flex items-start space-x-2">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-amber-950 dark:text-amber-200">Identified Limitation & Gap: </strong>
                  <span>{paper.limitations}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
