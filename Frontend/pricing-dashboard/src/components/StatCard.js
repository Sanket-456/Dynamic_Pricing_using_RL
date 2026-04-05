// src/components/StatCard.js
import React from "react";
import "./StatCard.css";

/**
 * Props:
 *  title      - string
 *  value      - string | number
 *  icon       - emoji string
 *  color      - "green" | "blue" | "amber" | "purple" | "red"
 *  trend      - "up" | "down" | "flat"  (optional)
 *  trendLabel - string e.g. "+12.4%"    (optional)
 *  subtitle   - string e.g. "vs last run" (optional)
 */
function StatCard({
  title,
  value,
  icon = "📈",
  color = "blue",
  trend,
  trendLabel,
  subtitle,
}) {
  const colorStyles = {
    green: {
      "--accent-color": "var(--green-400)",
      "--icon-bg": "rgba(16, 185, 129, 0.12)",
      "--icon-border": "rgba(16, 185, 129, 0.25)",
    },
    blue: {
      "--accent-color": "var(--blue-400)",
      "--icon-bg": "rgba(59, 130, 246, 0.12)",
      "--icon-border": "rgba(59, 130, 246, 0.25)",
    },
    amber: {
      "--accent-color": "var(--amber-400)",
      "--icon-bg": "rgba(245, 158, 11, 0.12)",
      "--icon-border": "rgba(245, 158, 11, 0.25)",
    },
    purple: {
      "--accent-color": "var(--purple-400)",
      "--icon-bg": "rgba(139, 92, 246, 0.12)",
      "--icon-border": "rgba(139, 92, 246, 0.25)",
    },
  };

  const currentStyle = colorStyles[color] || colorStyles.blue;

  const trendClass =
    trend === "up" ? "trend-up" : trend === "down" ? "trend-down" : "trend-flat";

  const trendArrow =
    trend === "up" ? "↑" : trend === "down" ? "↓" : "→";

  return (
    <div className="stat-card" style={currentStyle}>
      <div className="stat-card-top">
        <span className="stat-card-label">{title}</span>
        <div className="stat-card-icon">{icon}</div>
      </div>

      <div className="stat-card-value">
        {value !== undefined && value !== null ? value : "—"} {/* Fallback for empty values */}
      </div>

      <div className="stat-card-footer">
        {trend && trendLabel && (
          <span className={`stat-card-trend ${trendClass}`}>
            {trendArrow} {trendLabel}
          </span>
        )}
        {subtitle && <span>{subtitle}</span>}
      </div>
    </div>
  );
}

export default StatCard;