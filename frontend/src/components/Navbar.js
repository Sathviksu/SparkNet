import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSustainability } from '../context/SustainabilityContext';
import { useWeb3 } from '../context/Web3Context';
import ConnectWallet from './ConnectWallet';
import './styles/Navbar.css';

const Navbar = () => {
  const { logout, userProfile } = useAuth();
  const { sustainabilityScore } = useSustainability();
  const { account } = useWeb3();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <NavLink to="/dashboard" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">SparkNet</span>
        </NavLink>

        {/* Desktop Nav Links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/consumer" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Buy Energy
          </NavLink>
          <NavLink to="/seller" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Sell / Produce
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            History
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            Leaderboard
          </NavLink>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Sustainability Badge */}
          <div className="sustainability-badge" title="Sustainability Score">
            <span className="sus-icon">🌱</span>
            <span className="sus-score">{sustainabilityScore.toFixed(1)}</span>
          </div>

          <ConnectWallet />

          {userProfile && (
            <div className="user-menu">
              <div className="user-avatar" title={userProfile.email}>
                {userProfile.email?.[0]?.toUpperCase() || '?'}
              </div>
            </div>
          )}

          <button onClick={handleLogout} className="btn btn-ghost btn-sm logout-btn">
            Sign out
          </button>
        </div>

        {/* Hamburger */}
        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
