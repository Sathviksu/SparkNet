import React from 'react';
import { NavLink } from 'react-router-dom';
import ConnectWallet from './ConnectWallet';
import { useSustainability } from '../context/SustainabilityContext';
import { useAuth } from '../context/AuthContext'; // Import useAuth
import './../styles/Navbar.css';

const Navbar = () => {
  const { sustainabilityScore } = useSustainability();
  const { logout } = useAuth(); // Get the logout function from AuthContext

  const handleLogout = () => {
    logout(); // Call the logout function
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">EcoTrack: {sustainabilityScore}</NavLink>
      <div className="nav-links">
        <NavLink to="/dashboard" activeClassName="active">Dashboard</NavLink>
        <NavLink to="/consumer" activeClassName="active">Buy</NavLink>
        <NavLink to="/seller" activeClassName="active">Sell</NavLink>
      </div>
      <div className="nav-actions">
        <ConnectWallet />
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
