import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../styles/LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <Header />

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">The Future of Energy is Here</h1>
          <p className="hero-subtitle justify:center">
            Join the decentralized grid and trade renewable energy with your neighbors.
          </p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
