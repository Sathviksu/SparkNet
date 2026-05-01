import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/AuthPages.css';

const ROLES = [
  { id: 'consumer', icon: '⚡', label: 'Consumer', desc: 'Buy energy tokens from the grid' },
  { id: 'producer', icon: '☀️', label: 'Producer', desc: 'Sell solar energy and earn ETH' },
];

const SignupPage = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [role, setRole]         = useState('consumer');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await signup(email, password, role);
      navigate('/dashboard');
    } catch (err) {
      const code = err.code || '';
      if (code.includes('email-already-in-use')) {
        setError('This email is already registered. Sign in instead.');
      } else if (code.includes('invalid-email')) {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google signup failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">SparkNet</span>
          </div>
          <h2 className="auth-left-title">Join the decentralized energy revolution</h2>
          <p className="auth-left-sub">Register as a producer or consumer and start trading renewable energy on-chain.</p>
          <div className="auth-perks">
            {['Real blockchain transactions','Live IoT solar data','Firebase-secured account','NFT producer credentials'].map(p => (
              <div key={p} className="perk-item">
                <span className="perk-check">✓</span>{p}
              </div>
            ))}
          </div>
        </div>
        <div className="auth-grid-bg" aria-hidden="true" />
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-card glass-card">
          <div className="auth-form-header">
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Join SparkNet in seconds</p>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {/* Role Selector */}
          <div className="role-selector">
            {ROLES.map(r => (
              <button
                key={r.id}
                type="button"
                className={`role-btn ${role === r.id ? 'active' : ''}`}
                onClick={() => setRole(r.id)}
              >
                <span className="role-icon">{r.icon}</span>
                <span className="role-label">{r.label}</span>
                <span className="role-desc">{r.desc}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                id="signup-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                id="signup-password"
                type="password"
                className="form-input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                id="signup-confirm"
                type="password"
                className="form-input"
                placeholder="Repeat password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? <><div className="spinner" style={{width:16,height:16,borderWidth:2}} /> Creating account…</> : 'Create Account →'}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <button 
            type="button" 
            className="btn btn-secondary google-btn" 
            onClick={handleGoogleLogin} 
            disabled={loading}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{width:18,height:18,marginRight:8}} />
            Sign up with Google
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
