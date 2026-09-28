import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from 'recharts';

export default function MetricRadarChart({ results = {} }) {
  const cf = results["Collaborative Filtering"] || {};
  const bandit = results["Contextual Bandit"] || {};
  const dqn = results["DQN"] || {};
  const ppo = results["PPO"] || {};

  // Normalize scores to 0-100 scale for intuitive radar comparison
  const radarData = [
    {
      metric: "Cumulative Reward",
      PPO: Math.min(100, Math.max(0, (ppo.avg_cumulative_reward || 0) * 4.5)),
      DQN: Math.min(100, Math.max(0, (dqn.avg_cumulative_reward || 0) * 4.5)),
      Bandit: Math.min(100, Math.max(0, (bandit.avg_cumulative_reward || 0) * 4.5)),
      CF: Math.min(100, Math.max(0, (cf.avg_cumulative_reward || 0) * 4.5)),
    },
    {
      metric: "Session Duration",
      PPO: Math.min(100, (ppo.avg_session_duration || 0) * 8.5),
      DQN: Math.min(100, (dqn.avg_session_duration || 0) * 8.5),
      Bandit: Math.min(100, (bandit.avg_session_duration || 0) * 8.5),
      CF: Math.min(100, (cf.avg_session_duration || 0) * 8.5),
    },
    {
      metric: "User Retention",
      PPO: Math.min(100, (ppo.retention_rate || 0) * 100),
      DQN: Math.min(100, (dqn.retention_rate || 0) * 100),
      Bandit: Math.min(100, (bandit.retention_rate || 0) * 100),
      CF: Math.min(100, (cf.retention_rate || 0) * 100),
    },
    {
      metric: "CTR (Click Rate)",
      PPO: Math.min(100, (ppo.ctr || 0) * 140),
      DQN: Math.min(100, (dqn.ctr || 0) * 140),
      Bandit: Math.min(100, (bandit.ctr || 0) * 140),
      CF: Math.min(100, (cf.ctr || 0) * 140),
    },
    {
      metric: "Genre Diversity",
      PPO: Math.min(100, (ppo.recommendation_diversity || 0) * 130),
      DQN: Math.min(100, (dqn.recommendation_diversity || 0) * 130),
      Bandit: Math.min(100, (bandit.recommendation_diversity || 0) * 130),
      CF: Math.min(100, (cf.recommendation_diversity || 0) * 130),
    },
    {
      metric: "Low Skip Freq",
      PPO: Math.max(0, 100 - (ppo.skip_rate || 0) * 100),
      DQN: Math.max(0, 100 - (dqn.skip_rate || 0) * 100),
      Bandit: Math.max(0, 100 - (bandit.skip_rate || 0) * 100),
      CF: Math.max(0, 100 - (cf.skip_rate || 0) * 100),
    }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800">Multi-Metric Radar Trade-Off</h4>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Relative Score (0-100)</span>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="metric" stroke="#475569" tick={{ fontSize: 10, fontWeight: 500 }} />
            <PolarRadiusAxis stroke="#94a3b8" angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
            
            <Radar name="PPO (Proposed)" dataKey="PPO" stroke="#2563eb" fill="#2563eb" fillOpacity={0.25} />
            <Radar name="DQN" dataKey="DQN" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.15} />
            <Radar name="Contextual Bandit" dataKey="Bandit" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} />
            <Radar name="Collaborative Filtering" dataKey="CF" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.15} />

            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#0f172a',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
