// src/components/charts/EvalChart.js
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const PRICES = [10, 20, 30, 40, 50];
const COLORS = ["#555a72", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

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
      <p style={{ color: "var(--text-muted)", marginBottom: 4 }}>Price ₹{label}</p>
      <p style={{ color: "var(--amber-400)", fontWeight: 600 }}>
        Avg Reward: {Number(payload[0].value).toFixed(1)}
      </p>
    </div>
  );
};

export default function EvalChart({ data = [] }) {
  const formatted = data.map((v, i) => ({
    price: PRICES[i] ?? i,
    reward: +v.toFixed(2),
  }));

  const best = formatted.reduce(
    (max, d) => (d.reward > max.reward ? d : max),
    { reward: -Infinity }
  );

  return (
    <div className="card" style={{ marginBottom: 0 }}>
      <div className="card-header">
        <div>
          <div className="card-title">Evaluation — Reward per Price</div>
          {best.price && (
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
              best price{" "}
              <span style={{ color: "var(--amber-400)", fontWeight: 500 }}>
                ₹{best.price}
              </span>
            </div>
          )}
        </div>
        <span className="badge badge-amber">Eval</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="price"
            tickFormatter={(v) => `₹${v}`}
            tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "var(--font-sans)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--text-muted)", fontFamily: "var(--font-sans)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
          <Bar dataKey="reward" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {formatted.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.price === best.price ? "#f59e0b" : COLORS[index % COLORS.length]}
                opacity={entry.price === best.price ? 1 : 0.6}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}