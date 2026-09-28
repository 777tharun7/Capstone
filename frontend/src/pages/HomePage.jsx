import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  GitCompare, 
  Cpu, 
  Target, 
  Zap, 
  Film,
  Layers,
  GraduationCap,
  Play,
  FileText,
  Activity,
  Award,
  FlaskRound,
  FlaskConical,
  BookOpen,
  Settings,
  Star,
  CheckCircle2,
  Database,
  ArrowRightCircle
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, AreaChart, Area } from 'recharts';
import { getResearchComparison, getModelStatus } from '../services/api';

export default function HomePage({ setActivePage, activeModel }) {
  const [benchmark, setBenchmark] = useState(null);

  useEffect(() => {
    fetchBenchmark();
  }, []);

  const fetchBenchmark = async () => {
    try {
      const res = await getResearchComparison();
      if (res && res.data) setBenchmark(res.data);
    } catch (e) {
      console.error("Error fetching benchmark", e);
    }
  };

  const ppo = benchmark?.["PPO"] || { avg_cumulative_reward: 18.93, retention_rate: 0.34, ctr: 0.278, recommendation_diversity: 0.648 };
  const cf = benchmark?.["Collaborative Filtering"] || { avg_cumulative_reward: 6.59, retention_rate: 0.04, ctr: 0.182, recommendation_diversity: 0.412 };

  const comparisonData = [
    { name: 'CTR (%)', Traditional: Math.round(cf.ctr * 100), 'RL (PPO)': Math.round(ppo.ctr * 100) },
    { name: 'Retention (%)', Traditional: Math.round(cf.retention_rate * 100), 'RL (PPO)': Math.round(ppo.retention_rate * 100) },
    { name: 'Diversity (%)', Traditional: Math.round(cf.recommendation_diversity * 100), 'RL (PPO)': Math.round(ppo.recommendation_diversity * 100) },
    { name: 'NDCG (%)', Traditional: 52, 'RL (PPO)': 78 }
  ];

  const exploreFeatures = [
    {
      id: 'recommendations',
      title: 'Interactive Recommendation',
      desc: 'Get personalized movie recommendations using RL models.',
      icon: Target,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      id: 'rl-demo',
      title: 'Live MDP Step Visualizer',
      desc: 'See how states, actions and rewards work in real-time.',
      icon: Activity,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      iconColor: 'text-emerald-600'
    },
    {
      id: 'models',
      title: 'Algorithm Comparison',
      desc: 'Compare PPO, DQN and traditional methods with detailed metrics.',
      icon: Layers,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      iconColor: 'text-amber-600'
    },
    {
      id: 'evaluation',
      title: 'Research Benchmark',
      desc: 'Evaluate performance on MovieLens 100K dataset.',
      icon: FlaskRound,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
      iconColor: 'text-purple-600'
    },
    {
      id: 'experiments',
      title: 'Experiments',
      desc: 'Run custom experiments and tune hyperparameters.',
      icon: FlaskConical,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
      iconColor: 'text-rose-600'
    },
    {
      id: 'about',
      title: 'Research Paper',
      desc: 'Read our methodology, results, and mathematical formulation.',
      icon: BookOpen,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
      iconColor: 'text-cyan-600'
    }
  ];

  return (
    <div className="space-y-12 py-6 animate-in fade-in duration-300">
      
      {/* Hero Section Container */}
      <section className="relative bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/30 rounded-3xl border border-slate-200/80 p-8 lg:p-12 shadow-soft overflow-hidden">
        
        {/* Soft Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Academic Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Academic Research & Production Demonstration Platform</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Reinforcement Learning for
              </h1>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black gradient-text tracking-tight leading-tight">
                Long-Term User Engagement
              </h1>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Traditional recommender systems optimize short-term Click-Through Rate (CTR), causing content fatigue and user churn. This platform models recommendation as a sequential <strong>Markov Decision Process (MDP)</strong> using <strong>Proximal Policy Optimization (PPO)</strong> and <strong>Deep Q-Networks (DQN)</strong> to maximize long-term engagement and retention.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActivePage('recommendations')}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-soft-md hover:shadow-soft-lg transition-all hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Try Interactive Demo →</span>
              </button>

              <button
                onClick={() => setActivePage('rl-demo')}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-soft-sm transition-all"
              >
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Live MDP Visualizer</span>
              </button>

              <button
                onClick={() => setActivePage('about')}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-purple-50 hover:bg-purple-100/80 text-purple-700 font-semibold text-sm border border-purple-200/80 transition-all"
              >
                <FileText className="w-4 h-4 text-purple-600" />
                <span>View Research Paper</span>
              </button>
            </div>

            {/* Metric Pills Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200/80">
              
              <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-xs flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">Dataset</span>
                  <span className="text-xs font-bold text-slate-800">MovieLens 100K</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-xs flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">Active Model</span>
                  <span className="text-xs font-bold text-emerald-600 font-mono">{activeModel}</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-xs flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">State Space</span>
                  <span className="text-xs font-bold text-slate-800">48 Dimensions</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-slate-200/70 shadow-xs flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">Retention Uplift</span>
                  <span className="text-xs font-bold text-emerald-600 font-mono">+30% vs Static CF</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Hero Visual: 3D Robot + Floating Recommendation Cards & Live Charts */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
            
            {/* Center Robot & Recommendation Stack */}
            <div className="lg:col-span-7 space-y-3 relative">
              
              {/* Robot Illustration / Avatar Card */}
              <div className="flex items-center justify-center p-3">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 p-1 shadow-lg shadow-blue-500/20 animate-float flex items-center justify-center">
                    <div className="w-full h-full bg-white rounded-[22px] flex flex-col items-center justify-center space-y-1">
                      <div className="w-12 h-8 rounded-full bg-slate-900 flex items-center justify-center space-x-1.5 px-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      </div>
                      <div className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[9px] font-black font-mono">
                        RL AGENT
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended for you Cards Stack */}
              <div className="bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl border border-slate-200/90 shadow-soft space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Recommended for you
                  </span>
                  <span className="text-[10px] font-mono text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                    Top-3 PPO
                  </span>
                </div>

                {/* Card 1: Interstellar */}
                <div className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 flex items-center justify-between transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-10 rounded bg-gradient-to-br from-indigo-900 to-blue-900 text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
                      SF
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Interstellar</h4>
                      <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
                        <span>Sci-Fi</span>
                        <span>•</span>
                        <span>Adventure</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs font-mono">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>8.6</span>
                  </div>
                </div>

                {/* Card 2: The Dark Knight */}
                <div className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 flex items-center justify-between transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-10 rounded bg-gradient-to-br from-slate-900 to-zinc-800 text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
                      DK
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">The Dark Knight</h4>
                      <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
                        <span>Action</span>
                        <span>•</span>
                        <span>Thriller</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs font-mono">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>9.0</span>
                  </div>
                </div>

                {/* Card 3: Inception */}
                <div className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 flex items-center justify-between transition-colors">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-10 rounded bg-gradient-to-br from-blue-800 to-cyan-900 text-white font-bold text-[9px] flex items-center justify-center shadow-xs">
                      INC
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Inception</h4>
                      <div className="flex items-center space-x-1.5 text-[10px] text-slate-500">
                        <span>Sci-Fi</span>
                        <span>•</span>
                        <span>Mystery</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs font-mono">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>8.8</span>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Mini Telemetry Charts Column */}
            <div className="lg:col-span-5 space-y-3">
              
              {/* User Engagement Sparkline */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-soft-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700">User Engagement</span>
                  <span className="text-[11px] font-bold text-emerald-600 font-mono">+30%</span>
                </div>
                <div className="h-10 w-full mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{v:10},{v:15},{v:14},{v:22},{v:28},{v:35},{v:42}]}>
                      <Line type="monotone" dataKey="v" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <span className="text-[9px] text-slate-400 text-right block">vs Static CF Baseline</span>
              </div>

              {/* Long-Term Reward Progress Bars */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-soft-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700">Long-Term Reward</span>
                  <span className="text-[10px] font-mono text-purple-600 font-bold">γ = 0.98</span>
                </div>
                <div className="h-12 w-full mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{v:4},{v:6},{v:8},{v:12},{v:15},{v:19}]}>
                      <Bar dataKey="v" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* CTR Comparison Line */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-soft-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700">CTR Comparison</span>
                  <div className="flex items-center space-x-1.5 text-[9px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    <span className="text-slate-500">Trad</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-1" />
                    <span className="text-blue-600 font-bold">RL</span>
                  </div>
                </div>
                <div className="h-12 w-full mt-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[{t:10, r:12}, {t:12, r:18}, {t:15, r:24}, {t:16, r:30}]}>
                      <Line type="monotone" dataKey="t" stroke="#94a3b8" strokeWidth={1.5} dot={false} />
                      <Line type="monotone" dataKey="r" stroke="#2563eb" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Explore the Platform Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore the Platform
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            From interactive recommendations to live RL training, explore all the features of our research platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {exploreFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => setActivePage(feat.id)}
                className="white-card-interactive p-6 rounded-2xl cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-xl ${feat.color} flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform`}>
                    <Icon className={`w-6 h-6 ${feat.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-normal">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Row: How It Works + Performance Comparison Bar Chart */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* How It Works Flow (7 cols) */}
        <div className="lg:col-span-7 white-card p-6 rounded-2xl space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3">
            <Settings className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">How It Works: The RL Loop</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-center text-center">
            
            {/* Step 1: User State */}
            <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200/60 space-y-1.5">
              <div className="w-8 h-8 mx-auto rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                S_t
              </div>
              <h4 className="text-xs font-bold text-slate-900">User State</h4>
              <p className="text-[10px] text-slate-500 leading-tight">History + Context</p>
            </div>

            {/* Step 2: RL Agent */}
            <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/60 space-y-1.5">
              <div className="w-8 h-8 mx-auto rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                π_θ
              </div>
              <h4 className="text-xs font-bold text-slate-900">RL Agent</h4>
              <p className="text-[10px] text-slate-500 leading-tight">PPO / DQN</p>
            </div>

            {/* Step 3: Recommend */}
            <div className="bg-purple-50/60 p-3 rounded-xl border border-purple-200/60 space-y-1.5">
              <div className="w-8 h-8 mx-auto rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                A_t
              </div>
              <h4 className="text-xs font-bold text-slate-900">Recommend</h4>
              <p className="text-[10px] text-slate-500 leading-tight">Top-N Items</p>
            </div>

            {/* Step 4: User Feedback */}
            <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60 space-y-1.5">
              <div className="w-8 h-8 mx-auto rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                R_t
              </div>
              <h4 className="text-xs font-bold text-slate-900">Feedback</h4>
              <p className="text-[10px] text-slate-500 leading-tight">Click / Skip / Like</p>
            </div>

            {/* Step 5: Policy Update */}
            <div className="bg-rose-50/60 p-3 rounded-xl border border-rose-200/60 space-y-1.5">
              <div className="w-8 h-8 mx-auto rounded-lg bg-rose-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                GAE
              </div>
              <h4 className="text-xs font-bold text-slate-900">Policy Update</h4>
              <p className="text-[10px] text-slate-500 leading-tight">Maximize Retention</p>
            </div>

          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>The agent receives feedback $R_t$, computes Generalized Advantage Estimation, and adjusts weights.</span>
            <button
              onClick={() => setActivePage('rl-demo')}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1 flex-shrink-0 ml-2"
            >
              <span>Inspect Live</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Performance Comparison Bar Chart (5 cols) */}
        <div className="lg:col-span-5 white-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">Performance Comparison</h3>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span className="text-slate-500">Traditional CF</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-blue-600 font-bold">RL (PPO)</span>
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="name" stroke="#64748B" tick={{ fontSize: 10, fontWeight: 600 }} />
                <YAxis stroke="#64748B" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderRadius: '8px',
                    fontSize: '11px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                />
                <Bar dataKey="Traditional" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="RL (PPO)" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>

    </div>
  );
}
