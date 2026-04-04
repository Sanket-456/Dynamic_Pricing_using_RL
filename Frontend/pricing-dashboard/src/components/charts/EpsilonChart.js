// src/components/charts/EpsilonChart.js
import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
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
      <p style={{ color: "var(--blue-400)", fontWeight: 600 }}>
        ε = {Number(payload[0].value).toFixed(4)}
      </p>
    </div>
  );
};

export default function EpsilonChart({ data = [] }) {
  const formatted = data.map((v, i) => ({ episode: i + 1, epsilon: +v.toFixed(4) }));
  const current = data.length ? data[data.length - 1].toFixed(4) : null;

  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div>
          <div className="card-title">Epsilon Decay</div>
          {current && (
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
              current <span style={{ color: "var(--blue-400)", fontWeight: 500 }}>ε = {current}</span>
            </div>
          )}
        </div>
        <span className="badge badge-blue">Exploration</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="epsilonGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
            domain={[0, 1]}
            tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "var(--font-sans)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="epsilon"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#epsilonGrad)"
            dot={false}
            activeDot={{ r: 4, fill: "#3b82f6", stroke: "var(--bg-card)", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}