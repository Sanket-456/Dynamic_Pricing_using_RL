import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">🤖 Dynamic Pricing RL</div>
      <div className="navbar-links">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/simulator" className={({ isActive }) => (isActive ? "active" : "")}>
          Simulator
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
