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
  color = "green",
  trend,
  trendLabel,
  subtitle,
}) {
  const trendClass =
    trend === "up" ? "trend-up" : trend === "down" ? "trend-down" : "trend-flat";

  const trendArrow =
    trend === "up" ? "↑" : trend === "down" ? "↓" : "→";

  return (
    <div className={`stat-card ${color}`}>
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