import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import './styles/LandingPage.css';

const FEATURES = [
  {
    icon: '⚡',
    title: 'IoT-Powered Data',
    desc: '5 real solar installations across India feed live energy readings every 30 seconds. Time-of-day, weather, and temperature simulation built in.',
  },
  {
    icon: '⛓',
    title: 'Blockchain Trading',
    desc: 'ERC-20 energy tokens and ERC-721 producer NFTs on Ethereum. Real MetaMask transactions, real on-chain tokenomics.',
  },
  {
    icon: '📊',
    title: 'Live Analytics',
    desc: 'Real-time price charts, carbon offset tracking, market supply & demand — all updated live from the decentralized grid.',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Connect Wallet', desc: 'Link MetaMask to join the decentralized energy grid.' },
  { step: '02', title: 'Buy or Produce', desc: 'Purchase kWh tokens as a consumer, or register as a solar producer with an NFT.' },
  { step: '03', title: 'Track Impact', desc: 'Monitor your carbon offset, energy traded, and sustainability score in real time.' },
];

const LandingPage = () => {
  const [stats, setStats] = useState({ price_inr: '₹5.00', active_producers: 5, production_kwh: '—' });
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [market, analytics] = await Promise.all([
          axios.get(`${API_BASE_URL}/market/data`),
          axios.get(`${API_BASE_URL}/analytics/summary`),
        ]);
        if (market.data.success) {
          setStats({
            price_inr: `₹${market.data.market_data.current_price_inr?.toFixed(2) || '5.00'}`,
            active_producers: market.data.market_data.active_producers || 5,
            production_kwh: analytics.data.summary?.current_production_kwh?.toFixed(2) || '—',
          });
          setStatsLoaded(true);
        }
      } catch { /* backend offline is fine on landing page */ }
    };
    fetchStats();
  }, []);

  return (
    <div className="landing">
      {/* Animated Grid Background */}
      <div className="landing-grid" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="grid-particle" style={{ animationDelay: `${i * 0.3}s`, left: `${(i * 5.2) % 100}%` }} />
        ))}
      </div>

      {/* ── HEADER ─────────────────────────────────── */}
      <header className="landing-header">
        <div className="container flex-between">
          <div className="navbar-logo" style={{ pointerEvents: 'none' }}>
            <span className="logo-icon">⚡</span>
            <span className="logo-text">SparkNet</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Get Started →</Link>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────── */}
      <section className="hero">
        <div className="hero-badge">
          <span className="dot dot-green" />
          Decentralized · IoT-Powered · On-Chain
        </div>
        <h1 className="hero-title">
          Trade Solar Energy<br />
          <span className="gradient-text">Peer-to-Peer</span>
        </h1>
        <p className="hero-subtitle">
          SparkNet connects solar producers and energy consumers through Ethereum smart contracts
          and real-time IoT telemetry. No intermediaries. No markup. Just clean energy.
        </p>
        <div className="hero-cta">
          <Link to="/signup" className="btn btn-primary btn-lg">Start Trading →</Link>
          <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
        </div>

        {/* Live Stats Ticker */}
        <div className="stats-ticker">
          <div className="ticker-item">
            <span className="ticker-value">{stats.price_inr}</span>
            <span className="ticker-label">Price / kWh</span>
          </div>
          <div className="ticker-divider" />
          <div className="ticker-item">
            <span className="ticker-value">{stats.active_producers}</span>
            <span className="ticker-label">Active Producers</span>
          </div>
          <div className="ticker-divider" />
          <div className="ticker-item">
            <span className="ticker-value">{statsLoaded ? `${stats.production_kwh} kWh` : 'Live'}</span>
            <span className="ticker-label">Current Output</span>
          </div>
          <div className="ticker-divider" />
          <div className="ticker-item">
            <span className="ticker-value">5</span>
            <span className="ticker-label">IoT Devices</span>
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────── */}
      <section className="features">
        <div className="container">
          <p className="section-eyebrow">Platform Features</p>
          <h2 className="section-heading">Everything you need to trade green energy</h2>
          <div className="grid-3" style={{ marginTop: 40 }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card glass-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────── */}
      <section className="how-it-works">
        <div className="container">
          <p className="section-eyebrow">Simple Process</p>
          <h2 className="section-heading">Up and running in 3 steps</h2>
          <div className="steps-row">
            {HOW_IT_WORKS.map((step, i) => (
              <React.Fragment key={step.step}>
                <div className="step-card glass-card">
                  <div className="step-number">{step.step}</div>
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-desc">{step.desc}</p>
                </div>
                {i < HOW_IT_WORKS.length - 1 && <div className="step-arrow">→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ────────────────────────────── */}
      <section className="tech-section">
        <div className="container" style={{ textAlign: 'center' }}>
          <p className="section-eyebrow">Built With</p>
          <div className="tech-badges">
            {['React 18', 'Solidity 0.8', 'ethers.js v6', 'Firebase', 'Hardhat', 'Flask', 'Chart.js', 'OpenZeppelin'].map((t) => (
              <span key={t} className="badge badge-gray">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────── */}
      <section className="cta-banner">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 className="cta-title">Ready to join the clean energy revolution?</h2>
          <p className="cta-sub">Create your account and connect MetaMask to start trading in under 2 minutes.</p>
          <Link to="/signup" className="btn btn-primary btn-lg">Create Free Account →</Link>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="container flex-between">
          <span className="logo-text" style={{ fontSize: '1rem' }}>⚡ SparkNet</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            IoTopia 2025 · MIT License
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
