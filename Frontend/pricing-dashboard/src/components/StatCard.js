import React from "react";
import "./StatCard.css";

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <div className="stat-card-title">{title}</div>
      <div className="stat-card-value">{value}</div>
    </div>
  );
}

export default StatCard;