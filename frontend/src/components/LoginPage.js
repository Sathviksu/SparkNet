import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './styles/AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) setMessage(location.state.message);
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setMessage('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const code = err.code || '';
      if (code.includes('user-not-found') || code.includes('wrong-password') || code.includes('invalid-credential')) {
        setError('Invalid email or password.');
      } else if (code.includes('too-many-requests')) {
        setError('Too many attempts. Try again later.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(''); setMessage('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google login failed.');
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
          <h2 className="auth-left-title">Power the future with every trade</h2>
          <p className="auth-left-sub">Join thousands of producers and consumers on the decentralized energy grid.</p>
          <div className="auth-left-stats">
            <div className="al-stat"><span className="al-val">5</span><span className="al-label">IoT Devices</span></div>
            <div className="al-stat"><span className="al-val">₹5</span><span className="al-label">Per kWh</span></div>
            <div className="al-stat"><span className="al-val">ERC20</span><span className="al-label">Energy Token</span></div>
          </div>
        </div>
        <div className="auth-grid-bg" aria-hidden="true" />
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-card glass-card">
          <div className="auth-form-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your SparkNet account</p>
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {error   && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email address</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary auth-submit-btn" disabled={loading}>
              {loading ? <><div className="spinner" style={{width:16,height:16,borderWidth:2}} /> Signing in…</> : 'Sign In →'}
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
            Continue with Google
          </button>

          <div className="auth-demo-hint">
            <span>Demo:</span> user@example.com / password123
          </div>

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Create one →</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
