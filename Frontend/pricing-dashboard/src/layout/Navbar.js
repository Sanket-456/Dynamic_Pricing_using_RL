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
          <span className="dot dot-green" />
          RL Agent Ready
        </div>
      </div>

    </nav>
  );
}

export default Navbar;