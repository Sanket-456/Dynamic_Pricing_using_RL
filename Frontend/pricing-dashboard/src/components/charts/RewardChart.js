// src/components/charts/RewardChart.js
import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-default)",
      borderRadius: "var(--radius-md)",
      padding: "10px 14px",
      fontSize: "0.78rem",
      fontFamily: "var(--font-sans)",
    }}>
      <p style={{ color: "var(--text-muted)", marginBottom: 4 }}>Episode {label}</p>
      <p style={{ color: "var(--green-400)", fontWeight: 600 }}>
        Reward: {Number(payload[0].value).toFixed(1)}
      </p>
    </div>
  );
};

export default function RewardChart({ data = [] }) {
  const formatted = data.map((v, i) => ({ episode: i + 1, reward: +v.toFixed(2) }));
  const avg = data.length
    ? (data.reduce((a, b) => a + b, 0) / data.length).toFixed(1)
    : null;

  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div>
          <div className="card-title">Training Reward</div>
          {avg && (
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
              avg <span style={{ color: "var(--green-400)", fontWeight: 500 }}>{avg}</span>
            </div>
          )}
        </div>
        <span className="badge badge-green">Live</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="rewardGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="episode"
            tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "var(--font-sans)" }}
            tickLine={false}
            axisLine={false}
            label={{ value: "Episode", position: "insideBottom", offset: -2, fontSize: 11, fill: "var(--text-muted)" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "var(--font-sans)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {avg && (
            <ReferenceLine
              y={parseFloat(avg)}
              stroke="rgba(16,185,129,0.35)"
              strokeDasharray="4 3"
            />
          )}
          <Area
            type="monotone"
            dataKey="reward"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#rewardGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#10b981", stroke: "var(--bg-card)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}