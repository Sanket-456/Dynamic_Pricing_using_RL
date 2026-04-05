// src/components/QTableHeatmap.js
import React, { useMemo } from "react";

const PRICE_LABELS = ["₹10", "₹20", "₹30", "₹40", "₹50"];
const STATE_LABELS = ["Low Demand", "Med Demand", "High Demand"];
const STATE_COLORS = [
  "rgb(239, 68, 68)",  // Red
  "rgb(245, 158, 11)", // Amber
  "rgb(16, 185, 129)"  // Green
];

// Helper to interpolate between red -> amber -> green based on value
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function valueToColor(t) {
  if (t < 0.5) {
    const s = t / 0.5;
    return {
      r: Math.round(lerp(239, 245, s)),
      g: Math.round(lerp(68, 158, s)),
      b: Math.round(lerp(68, 11, s)),
    };
  }
  const s = (t - 0.5) / 0.5;
  return {
    r: Math.round(lerp(245, 16, s)),
    g: Math.round(lerp(158, 185, s)),
    b: Math.round(lerp(11, 129, s)),
  };
}

export default function QTableHeatmap({ Q }) {
  // Check if Q is null, empty, or an array filled entirely with 0s (initial state)
  const isNotTrained = !Q || Q.length === 0 || Q.every(row => row.every(val => val === 0));

  // Calculate global min and max for accurate color scaling
  const { min, max } = useMemo(() => {
    if (isNotTrained) return { min: 0, max: 1 };
    let minVal = Infinity;
    let maxVal = -Infinity;
    Q.forEach((row) => {
      row.forEach((val) => {
        if (val !== 0) { 
          if (val < minVal) minVal = val;
          if (val > maxVal) maxVal = val;
        }
      });
    });
    if (minVal === Infinity) return { min: 0, max: 1 };
    if (minVal === maxVal) return { min: minVal - 1, max: maxVal + 1 };
    return { min: minVal, max: maxVal };
  }, [Q, isNotTrained]);

  // ── 1. RENDER EMPTY STATE ──
  if (isNotTrained) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-title">Q-Table Heatmap</div>
          <span className="badge badge-purple">Not Trained</span>
        </div>
        <div style={{ height: "160px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
          Train the agent to see Q-values
        </div>
      </div>
    );
  }

  // ── 2. RENDER POPULATED HEATMAP ──
  return (
    <div className="card">
      
      {/* Header */}
      <div className="card-header">
        <div>
          <div className="card-title">Q-Table Heatmap</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
            optimal actions highlighted
          </div>
        </div>
        <span className="badge badge-purple" style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"></path>
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"></path>
            <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"></path>
            <path d="M17.599 6.5a3 3 0 0 0 .399-1.375"></path>
            <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"></path>
            <path d="M3.477 10.896a4 4 0 0 1 .585-.396"></path>
            <path d="M19.938 10.5a4 4 0 0 1 .585.396"></path>
            <path d="M6 18a4 4 0 0 1-1.967-.516"></path>
            <path d="M19.967 17.484A4 4 0 0 1 18 18"></path>
          </svg>
          Q-Learning
        </span>
      </div>

      {/* Label Arrow */}
      <div style={{ display: "flex", justifyContent: "flex-end", paddingRight: 4, marginBottom: 6 }}>
        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
          Price Actions →
        </span>
      </div>

      {/* Table Data */}
      <div style={{ overflowX: "auto", maxWidth: "100%" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 4, tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ width: 110, textAlign: "left", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, paddingBottom: 4 }}>
                State
              </th>
              {PRICE_LABELS.map((price, i) => (
                <th key={i} style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500, paddingBottom: 4 }}>
                  {price}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Q.map((row, stateIdx) => {
              const maxInRow = Math.max(...row);

              return (
                <tr key={stateIdx}>
                  <td style={{ paddingRight: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: STATE_COLORS[stateIdx], flexShrink: 0 }} />
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        {STATE_LABELS[stateIdx]}
                      </span>
                    </div>
                  </td>

                  {row.map((val, actionIdx) => {
                    const isOptimal = val === maxInRow && val !== 0;
                    const norm = max > min ? (val - min) / (max - min) : 0.5;
                    const { r, g, b } = valueToColor(norm);
                    
                    const bgOpacity = isOptimal ? 0.9 : 0.45;
                    const borderColor = isOptimal ? `rgb(${r}, ${g}, ${b})` : "transparent";
                    const fontColor = isOptimal ? `rgb(${Math.min(r+50,255)}, ${Math.min(g+50,255)}, ${Math.min(b+50,255)})` : "var(--text-secondary)";

                    return (
                      <td key={actionIdx} style={{ padding: 0, textAlign: "center" }}>
                        <div 
                          style={{ 
                            background: `rgba(${r}, ${g}, ${b}, ${bgOpacity})`, 
                            borderRadius: "var(--radius-sm)", 
                            padding: "10px 4px", 
                            position: "relative", 
                            border: `1px solid ${borderColor}`,
                            transition: "all 0.2s ease",
                            cursor: "default"
                          }}
                        >
                          {isOptimal && (
                            <div style={{ position: "absolute", top: 3, right: 4, fontSize: "0.55rem", color: fontColor, fontWeight: 700, opacity: 0.9 }}>
                              ★
                            </div>
                          )}
                          <div style={{ fontSize: "0.78rem", fontWeight: isOptimal ? 600 : 400, color: fontColor, fontFamily: "var(--font-mono)", letterSpacing: "-0.01em" }}>
                            {val.toFixed(1)}
                          </div>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Low Q</span>
        <div style={{ flex: 1, margin: "0 10px", height: 6, borderRadius: 999, background: "linear-gradient(90deg, rgba(239, 68, 68, 0.7), rgba(245, 158, 11, 0.7), rgba(16, 185, 129, 0.8))" }} />
        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>High Q</span>
        <span style={{ marginLeft: 16, fontSize: "0.68rem", color: "var(--text-muted)" }}>★ optimal</span>
      </div>

    </div>
  );
}