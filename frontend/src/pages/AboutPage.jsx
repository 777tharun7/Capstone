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
  BookmarkCheck,
  Award,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Zap,
  TrendingUp,
  GitBranch
} from 'lucide-react';

export default function AboutPage() {
  const researchPapers = [
    {
      id: 1,
      title: "A Survey on Reinforcement Learning for Recommender Systems",
      authors: "Yuanguo Lin, Yong Liu, Fan Lin, Lixin Zou, Pengcheng Wu, Wenhua Zeng, Huanhuan Chen, Chunyan Miao",
      year: 2023,
      publisher: "IEEE Transactions on Neural Networks and Learning Systems (TNNLS)",
      category: "Foundational Survey & Taxonomy",
      badgeColor: "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      accentBorder: "border-blue-500",
      keyInsights: [
        "Surveys RL-based recommender systems and explains how recommendation problems can be formulated as sequential decision-making tasks under Markov Decision Processes (MDPs).",
        "Reviews various RL and Deep RL (DRL) approaches used in interactive, conversational, sequential, and explainable recommendation systems.",
        "Highlights that traditional recommender systems struggle to adapt to dynamic user behavior, while RL continuously learns from user feedback to maximize long-term engagement and user satisfaction.",
        "Provides a detailed classification and analysis of RL algorithms and their applications across different recommendation scenarios."
      ],
      limitations: "Mainly theoretical and does not propose a new model or implementation. Identifies open challenges such as data sparsity, scalability, privacy, interpretability, and real-world deployment."
    },
    {
      id: 2,
      title: "Deep Reinforcement Learning for List-wise Recommendations",
      authors: "Xiangyu Zhao, Liang Zhang, Long Xia, Zhuoye Ding, Dawei Yin, Jiliang Tang",
      year: 2019,
      publisher: "ACM (DRL4KDD Workshop, Knowledge Discovery and Data Mining Conference)",
      category: "List-wise DRL & Simulation",
      badgeColor: "bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      accentBorder: "border-purple-500",
      keyInsights: [
        "Proposes a deep reinforcement learning framework called LIRD for recommender systems, focusing on list-wise recommendations rather than isolated single-item choices.",
        "Models recommendation as a sequential decision-making process using an MDP, allowing the system to continuously learn from user feedback loops over time.",
        "Addresses the core limitation of traditional recommenders that greedily optimize short-term rewards and fail to capture evolving user preferences.",
        "Combines an Actor-Critic architecture with list-wise recommendation and an online/offline simulator for robust training on real-world e-commerce data."
      ],
      limitations: "Depends heavily on simulated environments that may not fully reflect organic user dynamics. Faces scalability bottlenecks and assumes fixed user browsing patterns."
    },
    {
      id: 3,
      title: "Reinforcement Learning to Rank in E-Commerce Search Engine: Formalization, Analysis, and Application",
      authors: "Yujing Hu, Qing Da, Anxiang Zeng, Yang Yu, Yinghui Xu",
      year: 2018,
      publisher: "ACM SIGKDD (KDD '18)",
      category: "Industrial E-Commerce RL & Ranking",
      badgeColor: "bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      accentBorder: "border-amber-500",
      keyInsights: [
        "Proposes an RL method for search ranking by formalizing multi-step user interactions into a Search Session Markov Decision Process (SSMDP).",
        "Overcomes traditional Learning-to-Rank (LTR) methods that only optimize single-step clicks by considering the entire multi-step session (clicks, cart additions, purchases, and exits).",
        "Introduces the DPG-FBE algorithm (Deterministic Policy Gradient with Feedback-based Exploration) to effectively optimize delayed and sparse transaction rewards.",
        "Validated on Alibaba Taobao, achieving a 30%–40% improvement in gross transaction performance over static heuristics."
      ],
      limitations: "High computational training overhead, strict dependence on massive interaction logs, and reliance on accurate user behavior estimation."
    },
    {
      id: 4,
      title: "Reinforcement Learning based Recommender Systems: A Survey",
      authors: "M. Mehdi Afsar, Trafford Crump, Behrouz Far",
      year: 2022,
      publisher: "ACM Computing Surveys (CSUR)",
      category: "Comprehensive System Survey",
      badgeColor: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      accentBorder: "border-emerald-500",
      keyInsights: [
        "Comprehensive survey examining how recommendation tasks are transformed from static scoring into sequential decision-making problems.",
        "Contrasts myopic single-step heuristics with MDP-based policies that adapt to temporal preference drifts, mitigate filter bubbles, and explore novel item niches.",
        "Categorizes state representations, action spaces, reward formulations, and environment modeling paradigms across state-of-the-art DRL systems.",
        "Analyzes practical deployment trade-offs between value-based (DQN) and policy gradient (Actor-Critic/PPO) methods in industrial settings."
      ],
      limitations: "Primarily conceptual analysis without standardized open benchmark implementations, calling for unified simulation testbeds."
    }
  ];

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto animate-in fade-in duration-300 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
      
      {/* Paper Title Header */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-mono font-semibold">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Academic Research Documentation & Methodology</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Reinforcement Learning-Based Adaptive Recommendation System for Long-Term User Engagement Optimization
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
          A Sequential Decision-Making Framework to Overcome Greedy CTR Collapse in Digital Media Platforms.
        </p>
      </div>

      {/* 1. Problem Statement */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-blue-600"></span>
          1. Research Gap & Problem Statement
        </h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          Conventional recommendation systems rely heavily on static Collaborative Filtering or supervised deep learning models (e.g., Matrix Factorization, Two-Tower models) that treat each interaction as an isolated, independent decision. These systems greedily optimize short-term metrics such as immediate Click-Through Rate (CTR).
        </p>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          However, myopic CTR optimization ignores sequential dynamics, such as <strong className="text-slate-900 dark:text-white">repetition fatigue</strong>, <strong className="text-slate-900 dark:text-white">content saturation</strong>, and <strong className="text-slate-900 dark:text-white">user churn</strong>. When repeatedly presented with high-clickbait items from narrow genres, user satisfaction declines and session lengths terminate prematurely.
        </p>
      </section>

      {/* 2. MDP Formulation */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-cyan-600"></span>
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
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
          3. Model Architectures & Theoretical Foundations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <h3 className="font-bold text-blue-700 dark:text-blue-400 text-xs font-mono uppercase tracking-wider">Deep Q-Network (DQN)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Value-based RL model that approximates action-values Q(s, a). Features an Experience Replay Buffer (capacity 20,000) to break temporal correlations and a Target Network updated periodically to stabilize Bellman loss:
            </p>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-900 dark:text-slate-100 font-semibold">
              L_TD = E[(r + γ max_a' Q_target(s', a') - Q(s, a))^2]
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <h3 className="font-bold text-emerald-700 dark:text-emerald-400 text-xs font-mono uppercase tracking-wider">Proximal Policy Optimization (PPO)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Actor-Critic policy gradient method using Generalized Advantage Estimation (GAE-λ) and a clipped surrogate objective to prevent destabilizing policy updates:
            </p>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-900 dark:text-slate-100 font-semibold">
              L^CLIP = E[min(r_t(θ)A_t, clip(r_t(θ), 1-ε, 1+ε)A_t)]
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dataset & Simulation */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
          <span className="w-3 h-3 rounded-full bg-purple-600"></span>
          4. MovieLens 100K Dataset & Offline User Simulation
        </h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
          The system uses the benchmark <strong className="text-slate-900 dark:text-white">MovieLens 100K dataset</strong> comprising real user-movie ratings and 19 genre categories. An offline Gymnasium-compliant user simulator models user satisfaction, fatigue accumulation, and probabilistic continuation based on latent affinities and recent recommendation novelty.
        </p>
      </section>

      {/* 5. Foundational Research Papers & Literature Review */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
              5. Theoretical Foundations & Key Research Literature
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Core academic papers grounding the MDP formulation, list-wise policy optimization, and session ranking methods.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-mono font-bold self-start sm:self-auto">
            4 Major Papers
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {researchPapers.map(paper => (
            <div 
              key={paper.id}
              className="bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 space-y-4 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Header Tag & Publisher */}
                <div className="flex items-start justify-between gap-2">
                  <span className={`px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider ${paper.badgeColor}`}>
                    {paper.category}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-400 font-mono">
                    {paper.year}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                  {paper.title}
                </h3>

                {/* Metadata */}
                <div className="text-[11px] space-y-1 font-mono text-slate-500 dark:text-slate-400 border-l-2 border-slate-300 dark:border-slate-600 pl-2.5">
                  <p><span className="font-semibold text-slate-700 dark:text-slate-300">Authors:</span> {paper.authors}</p>
                  <p><span className="font-semibold text-slate-700 dark:text-slate-300">Publisher:</span> {paper.publisher}</p>
                </div>

                {/* Key Insights */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Key Methodological Contributions:
                  </span>
                  <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-600 dark:text-slate-300">
                    {paper.keyInsights.map((insight, idx) => (
                      <li key={idx} className="leading-relaxed">{insight}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Limitations & Open Challenges */}
              <div className="mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-700/70 bg-amber-50/60 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300 text-[11px] mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  Limitations & Open Challenges:
                </div>
                <p className="text-amber-900 dark:text-amber-200/90 text-[11px] leading-relaxed">
                  {paper.limitations}
                </p>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* Synthesis & How Our System Bridges These Gaps */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 p-6 sm:p-7 rounded-2xl border border-blue-200 dark:border-blue-900/60 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          How Our System Directly Implements and Extends This Literature
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs pt-1">
          <div className="bg-white/80 dark:bg-slate-800/80 p-3.5 rounded-xl border border-blue-100 dark:border-slate-700 space-y-1">
            <span className="font-bold text-blue-700 dark:text-blue-400 block">1. Dynamic MDP State Space</span>
            <p className="text-slate-600 dark:text-slate-300">Implements continuous 48-dimensional user fatigue and genre-affinity tracking inspired by Lin et al. (2023) and Afsar et al. (2022).</p>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 p-3.5 rounded-xl border border-blue-100 dark:border-slate-700 space-y-1">
            <span className="font-bold text-purple-700 dark:text-purple-400 block">2. Multi-Step Reward Decomposition</span>
            <p className="text-slate-600 dark:text-slate-300">Combines immediate utility with delayed retention bonuses to resolve the sparse reward challenge formulated in Hu et al. (KDD '18).</p>
          </div>
          <div className="bg-white/80 dark:bg-slate-800/80 p-3.5 rounded-xl border border-blue-100 dark:border-slate-700 space-y-1">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 block">3. Standardized Gymnasium Simulator</span>
            <p className="text-slate-600 dark:text-slate-300">Provides an open, reproducible Actor-Critic (PPO & DQN) testbed on MovieLens-100K resolving the reproducibility gap in Zhao et al. (2019).</p>
          </div>
        </div>
      </section>

    </div>
  );
}
