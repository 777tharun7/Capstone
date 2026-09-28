import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell
} from 'recharts';

export default function ModelComparisonChart({ 
  results = {}, 
  metricKey = "avg_cumulative_reward",
  metricTitle = "Average Cumulative Reward per Session",
  unit = ""
}) {
  const modelNames = ["Collaborative Filtering", "Contextual Bandit", "DQN", "PPO"];
  
  const chartData = modelNames.map(name => {
    const res = results[name] || {};
    return {
      name: name === "Collaborative Filtering" ? "CF Baseline" : name === "Contextual Bandit" ? "LinUCB Bandit" : name,
      fullName: name,
      value: res[metricKey] !== undefined ? res[metricKey] : 0,
      std: res.std_cumulative_reward || 0
    };
  });

  const getBarColor = (name) => {
    if (name === "PPO") return "#2563eb"; // Blue
    if (name === "DQN") return "#06b6d4"; // Cyan
    if (name === "Contextual Bandit") return "#f59e0b"; // Amber
    return "#94a3b8"; // Slate for CF
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-800">{metricTitle}</h4>
        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Benchmark Comparison</span>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10, fontWeight: 500 }} />
            <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderColor: '#e2e8f0',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#0f172a',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(val) => [`${val}${unit}`, metricTitle]}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.fullName)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
