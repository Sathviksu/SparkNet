import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="landing-header">
      <div className="logo">Spark Net</div>
      <nav className="nav-links">
        <Link to="#">About</Link>
        <Link to="#">Features</Link>
        <Link to="#">Contact</Link>
      </nav>
      <div>
        <Link to="/login" className="header-btn">Login</Link>
      </div>
    </header>
  );
};

export default Header;
