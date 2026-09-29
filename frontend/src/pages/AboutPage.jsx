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
  Sparkles,
  ArrowRight,
  TrendingUp,
  Sliders,
  AlertTriangle
} from 'lucide-react';

export default function AboutPage() {
  const researchPapers = [
    {
      id: 1,
      title: "A Survey on Reinforcement Learning for Recommender Systems",
      authors: "Yuanguo Lin, Yong Liu, Fan Lin, Lixin Zou, Pengcheng Wu, Wenhua Zeng, Huanhuan Chen, Chunyan Miao",
      year: "2023",
      publisher: "IEEE Transactions on Neural Networks and Learning Systems (TNNLS)",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400",
      overview: "Surveys reinforcement learning (RL) based recommender systems and explains how recommendation problems can be modeled as sequential decision-making tasks across interactive, conversational, sequential, and explainable setups.",
      keyPoints: [
        "Highlights that traditional systems struggle to adapt to dynamic user behavior, whereas RL continuously adapts to maximize long-term satisfaction.",
        "Provides comprehensive taxonomies of state formulations, reward functions, and policy gradient methods.",
        "Identifies open research challenges in data sparsity, scalability, policy interpretability, and real-world deployment."
      ],
      limitation: "Primarily theoretical survey without a dedicated empirical benchmark model or custom open-source simulator implementation."
    },
    {
      id: 2,
      title: "Deep Reinforcement Learning for List-wise Recommendations",
      authors: "Xiangyu Zhao, Liang Zhang, Long Xia, Zhuoye Ding, Dawei Yin, Jiliang Tang",
      year: "2019",
      publisher: "ACM (DRL4KDD Workshop, Knowledge Discovery and Data Mining Conference)",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800",
      iconColor: "text-purple-600 dark:text-purple-400",
      overview: "Proposes the LIRD (List-wise Interactive Recommendation with DRL) framework, modeling recommendations as an Actor-Critic MDP to optimize entire ranked lists instead of single isolated items.",
      keyPoints: [
        "Addresses greedy CTR failure modes by sequentially capturing evolving user preferences over multiple browsing steps.",
        "Combines deep Actor-Critic architectures with an offline-trained interactive environment simulator.",
        "Demonstrated statistically significant gains in both immediate and long-term user engagement on real-world e-commerce datasets."
      ],
      limitation: "High reliance on simulated user dynamics that may assume fixed browsing patterns, with high computational complexity during list generation."
    },
    {
      id: 3,
      title: "Reinforcement Learning to Rank in E-Commerce Search Engine: Formalization, Analysis, and Application",
      authors: "Yujing Hu, Qing Da, Anxiang Zeng, Yang Yu, Yinghui Xu",
      year: "2018",
      publisher: "ACM SIGKDD (KDD '18)",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800",
      iconColor: "text-amber-600 dark:text-amber-400",
      overview: "Formulates e-commerce search ranking as a Search Session Markov Decision Process (SSMDP) to optimize the entire session lifecycle (clicks, purchases, and bounces) rather than single-query CTR.",
      keyPoints: [
        "Introduces DPG-FBE (Deterministic Policy Gradient with Feedback-based Exploration) to effectively tackle sparse delayed purchase rewards.",
        "Large-scale production deployment on Taobao showed 30%–40% higher cumulative GMV transaction performance over traditional ranking heuristics.",
        "Proves that maximizing multi-step cumulative returns prevents clickbait degradation and preserves customer lifetime value."
      ],
      limitation: "Requires large-scale interaction logging infrastructure and incurs high inference latency for real-time item scoring."
    },
    {
      id: 4,
      title: "Reinforcement Learning based Recommender Systems: A Survey",
      authors: "M. Mehdi Afsar, Trafford Crump, Behrouz Far",
      year: "2022",
      publisher: "ACM Computing Surveys (CSUR)",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      overview: "A comprehensive ACM survey establishing the mathematical foundations for formulating recommendation as an MDP, reviewing state-of-the-art Value-based, Policy-based, and Model-based RL methods.",
      keyPoints: [
        "Systematically breaks down why static Collaborative Filtering fails under non-stationary user interest shifts.",
        "Categorizes multi-agent, bandit, and deep RL paradigms based on their exploration-exploitation strategies.",
        "Provides deep analysis of simulation environments and offline RL evaluation methodologies."
      ],
      limitation: "Focuses on taxonomy and theoretical comparison, leaving open practical guidelines for reward decomposition and fatigue modeling."
    }
  ];

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto animate-in fade-in duration-300 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
      
      {/* Paper Title Header */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-mono font-semibold">
          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Academic Research Documentation & Methodology</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Reinforcement Learning-Based Adaptive Recommendation System for Long-Term User Engagement Optimization
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          A Sequential Decision-Making Framework to Overcome Greedy CTR Collapse in Digital Media Platforms.
        </p>
      </div>

      {/* 1. Problem Statement */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
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
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-600"></span>
          2. Markov Decision Process (MDP) Formulation
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          We model sequential recommendation as an infinite-horizon Markov Decision Process defined by the tuple <code className="text-blue-600 dark:text-blue-400 font-mono font-bold">(S, A, P, R, γ)</code>:
        </p>
        
        <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 font-mono text-xs">
          <div><strong className="text-blue-700 dark:text-blue-400">State S_t &isin; R^48:</strong> Combines normalized User ID (1 dim), Dynamic Category Affinities (19 dims), Recent Recommendation History Embedding (21 dims), and Session Dynamics (Step, Consecutive Skips, Fatigue, Satisfaction, Click Ratio) (7 dims).</div>
          <div><strong className="text-purple-700 dark:text-purple-400">Action A_t &isin; {'{0, ..., N-1}'}:</strong> Discrete candidate item chosen from the catalog.</div>
          <div><strong className="text-emerald-700 dark:text-emerald-400">Reward R_t:</strong> Decomposed multi-objective reward: <br />
            <code className="text-slate-900 dark:text-white font-semibold">R_t = R_immediate(click, like, skip) + R_delayed(session_len, retention) - P_fatigue(repeat)</code>
          </div>
          <div><strong className="text-amber-700 dark:text-amber-400">Discount Factor &gamma;:</strong> &gamma; = 0.98, ensuring the agent prioritizes long-term future user retention over immediate one-step gain.</div>
        </div>
      </section>

      {/* 3. Implemented RL Models */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          3. Model Architectures & Theoretical Foundations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <h3 className="font-bold text-blue-700 dark:text-blue-400 text-xs font-mono uppercase tracking-wide">Deep Q-Network (DQN)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Value-based RL model that approximates action-values Q(s, a). Features an Experience Replay Buffer (capacity 20,000) to break temporal correlations and a Target Network updated periodically to stabilize Bellman loss:
            </p>
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-900 dark:text-white font-semibold shadow-2xs">
              L_TD = E[(r + γ max_a' Q_target(s', a') - Q(s, a))^2]
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/80 p-5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
            <h3 className="font-bold text-emerald-700 dark:text-emerald-400 text-xs font-mono uppercase tracking-wide">Proximal Policy Optimization (PPO)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Actor-Critic policy gradient method using Generalized Advantage Estimation (GAE-λ) and a clipped surrogate objective to prevent destabilizing policy updates:
            </p>
            <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-mono text-slate-900 dark:text-white font-semibold shadow-2xs">
              L^CLIP = E[min(r_t(θ)A_t, clip(r_t(θ), 1-ε, 1+ε)A_t)]
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dataset & Simulation */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
          4. MovieLens 100K Dataset & Offline User Simulation
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          The system uses the benchmark <strong>MovieLens 100K dataset</strong> comprising real user-movie ratings and 19 genre categories. An offline Gymnasium-compliant user simulator models user satisfaction, fatigue accumulation, and probabilistic continuation based on latent affinities and recent recommendation novelty.
        </p>
      </section>

      {/* 5. Foundational Research Papers & Literature Review */}
      <section className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              5. Theoretical Foundations & Literature Benchmark Papers
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Core published research papers in top IEEE and ACM venues that establish the theoretical and empirical baseline for sequential RL recommendation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {researchPapers.map((paper) => (
            <div 
              key={paper.id}
              className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:shadow-md transition-shadow space-y-4"
            >
              <div className="space-y-3">
                {/* Badge & Year */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${paper.badgeColor}`}>
                    {paper.publisher}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Year: {paper.year}
                  </span>
                </div>

                {/* Title & Authors */}
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                    {paper.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    <strong>Authors:</strong> {paper.authors}
                  </p>
                </div>

                {/* Overview */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {paper.overview}
                </p>

                {/* Key Contributions */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Key Contributions & Insights:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    {paper.keyPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-blue-500 font-bold mt-0.5">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Research Gap / Limitation Box */}
              <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 p-3 rounded-xl text-xs space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-700 dark:text-amber-300 font-bold text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>Noted Research Limitation:</span>
                </div>
                <p className="text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                  {paper.limitation}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* How our Capstone Addresses the Literature Gaps */}
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-800 dark:via-indigo-950/30 dark:to-slate-800 p-5 rounded-2xl border border-blue-200/80 dark:border-indigo-800/50 space-y-2.5">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase font-mono">
              Our Capstone Project Novelty & Synthesis:
            </h4>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            While previous literature focuses either purely on <em>theoretical surveys</em> (Lin et al., Afsar et al.) or <em>complex proprietary e-commerce rankers</em> (Hu et al., Zhao et al.), this capstone provides a <strong>reproducible, end-to-end open research platform</strong>. It bridges the gap by implementing an offline Gymnasium user simulator with explicit <strong>fatigue accumulation</strong>, <strong>decomposed retention rewards</strong>, and direct side-by-side empirical benchmarking of <strong>PPO</strong> and <strong>DQN</strong> against classical Collaborative Filtering on MovieLens-100K.
          </p>
        </div>

      </section>

    </div>
  );
}
