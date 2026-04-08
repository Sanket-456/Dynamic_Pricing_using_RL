// ============================================================
//  NAVBAR — src/layout/Navbar.js
// ============================================================
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navbarRef = React.useRef(null);
  const location = useLocation();

  const closeMenu = () => setIsMenuOpen(false);

  React.useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  React.useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <nav className="navbar" ref={navbarRef}>

      {/* ── Logo ── */}
      <div className="navbar-logo">
        <div className="navbar-logo-icon">🤖</div>
        <div className="navbar-logo-text">
          <span className="navbar-logo-title">Dynamic Pricing RL</span>
          <span className="navbar-logo-sub">Q-Learning Agent</span>
        </div>
      </div>

      <button
        type="button"
        className="navbar-menu-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        {isMenuOpen ? "✕" : "☰"}
      </button>

      {/* ── Nav Links ── */}
      <div className={`navbar-links ${isMenuOpen ? "navbar-links-open" : ""}`}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={closeMenu}
        >
          <span className="nav-icon">📊</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/simulator"
          className={({ isActive }) => (isActive ? "active" : "")}
          onClick={closeMenu}
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