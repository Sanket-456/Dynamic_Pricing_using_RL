// src/components/QTableHeatmap.js
import React, { useMemo } from "react";

const PRICE_LABELS  = ["₹10", "₹20", "₹30", "₹40", "₹50"];
const STATE_LABELS  = ["Low Demand", "Med Demand", "High Demand"];
const STATE_COLORS  = ["#ef4444", "#f59e0b", "#10b981"];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Interpolates through red → amber → green based on normalised t ∈ [0,1]
function valueToColor(t) {
  if (t < 0.5) {
    const s = t / 0.5;
    return {
      r: Math.round(lerp(239, 245, s)),
      g: Math.round(lerp(68,  158, s)),
      b: Math.round(lerp(68,  11,  s)),
    };
  }
  const s = (t - 0.5) / 0.5;
  return {
    r: Math.round(lerp(245, 16,  s)),
    g: Math.round(lerp(158, 185, s)),
    b: Math.round(lerp(11,  129, s)),
  };
}

function cellBg(t, alpha = 0.75) {
  const { r, g, b } = valueToColor(t);
  return `rgba(${r},${g},${b},${alpha})`;
}

function cellText(t) {
  const { r, g, b } = valueToColor(t);
  // lighten for readability
  return `rgba(${Math.round(r * 1.4)},${Math.round(g * 1.4)},${Math.round(b * 1.4)},1)`;
}

export default function QTableHeatmap({ Q }) {
  const { min, max } = useMemo(() => {
    if (!Q || !Q.length) {
      return { min: 0, max: 1 }; // Default values when Q is empty
    }
    const flat = Q.flat();
    return { min: Math.min(...flat), max: Math.max(...flat) };
  }, [Q]);

  const normalize = (v) =>
    max === min ? 0.5 : (v - min) / (max - min);

  // Best action per state
  const bestActions = Q ? Q.map((row) =>
    row.indexOf(Math.max(...row))
  ) : [];

  if (!Q || !Q.length) {
    return (
      <div className="card">
        <div className="card-header">
          <div className="card-title">Q-Table Heatmap</div>
          <span className="badge badge-purple">Not Trained</span>
        </div>
        <div style={{
          height: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          fontSize: "0.85rem",
        }}>
          Train the agent to see Q-values
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ marginBottom: 0 }}>
      {/* Header */}
      <div className="card-header">
        <div>
          <div className="card-title">Q-Table Heatmap</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>
            optimal actions highlighted
          </div>
        </div>
        <span className="badge badge-purple">Q-Learning</span>
      </div>

      {/* Price axis label */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        paddingRight: 4,
        marginBottom: 6,
      }}>
        <span style={{
          fontSize: "0.68rem",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}>
          Price Actions →
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "4px",
          tableLayout: "fixed",
        }}>
          {/* Column headers */}
          <thead>
            <tr>
              {/* State label column */}
              <th style={{
                width: 110,
                textAlign: "left",
                fontSize: "0.65rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                fontWeight: 500,
                paddingBottom: 4,
              }}>
                State
              </th>
              {PRICE_LABELS.map((p) => (
                <th key={p} style={{
                  textAlign: "center",
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                  paddingBottom: 4,
                }}>
                  {p}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Q.map((row, stateIdx) => (
              <tr key={stateIdx}>
                {/* State label */}
                <td style={{ paddingRight: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{
                      display: "inline-block",
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: STATE_COLORS[stateIdx],
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                    }}>{STATE_LABELS[stateIdx]}</span>
                  </div>
                </td>

                {/* Q-value cells */}
                {row.map((val, actionIdx) => {
                  const t        = normalize(val);
                  const isBest   = actionIdx === bestActions[stateIdx];
                  const bg       = cellBg(t, isBest ? 0.9 : 0.45);
                  const txtColor = cellText(t);

                  return (
                    <td key={actionIdx} style={{ padding: 0, textAlign: "center" }}>
                      <div style={{
                        background: bg,
                        borderRadius: "var(--radius-sm)",
                        padding: "10px 4px",
                        position: "relative",
                        border: isBest
                          ? `1px solid ${cellBg(t, 1)}`
                          : "1px solid transparent",
                        transition: "opacity 0.2s",
                        cursor: "default",
                      }}>
                        {isBest && (
                          <div style={{
                            position: "absolute",
                            top: 3,
                            right: 4,
                            fontSize: "0.55rem",
                            color: txtColor,
                            fontWeight: 700,
                            opacity: 0.9,
                          }}>
                            ★
                          </div>
                        )}
                        <div style={{
                          fontSize: "0.78rem",
                          fontWeight: isBest ? 600 : 400,
                          color: isBest ? txtColor : "var(--text-secondary)",
                          fontFamily: "var(--font-mono)",
                          letterSpacing: "-0.01em",
                        }}>
                          {val.toFixed(1)}
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 16,
        paddingTop: 12,
        borderTop: "1px solid var(--border-subtle)",
      }}>
        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Low Q</span>
        <div style={{
          flex: 1,
          margin: "0 10px",
          height: 6,
          borderRadius: 999,
          background: "linear-gradient(90deg, rgba(239,68,68,0.7), rgba(245,158,11,0.7), rgba(16,185,129,0.8))",
        }} />
        <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>High Q</span>
        <span style={{
          marginLeft: 16,
          fontSize: "0.68rem",
          color: "var(--text-muted)",
        }}>
          ★ optimal
        </span>
      </div>
    </div>
  );
}