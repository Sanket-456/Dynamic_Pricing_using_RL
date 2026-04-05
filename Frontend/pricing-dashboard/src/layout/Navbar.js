// ============================================================
//  NAVBAR — src/layout/Navbar.js
// ============================================================
import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      {/* ── Logo ── */}
      <div className="navbar-logo">
        <div className="navbar-logo-icon">🤖</div>
        <div className="navbar-logo-text">
          <span className="navbar-logo-title">Dynamic Pricing RL</span>
          <span className="navbar-logo-sub">Q-Learning Agent</span>
        </div>
      </div>

      {/* ── Nav Links ── */}
      <div className="navbar-links">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/simulator"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <span className="nav-icon">🍕</span>
          Simulator
        </NavLink>
      </div>

      {/* ── Status Pill ── */}
      <div className="navbar-right">
        <div className="navbar-status">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"></path>
          </svg>
          <span>RL Agent Ready</span>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;