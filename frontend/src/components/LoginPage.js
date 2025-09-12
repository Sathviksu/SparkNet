import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const success = login(email, password);

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-page-container">
      <Header />
      <main className="login-hero-section">
        <div className="login-container">
          <h1 className="login-title">Welcome Back</h1>

          {message && <p className="success-message">{message}</p>}
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                className="login-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="input-group">
              <input
                type="password"
                className="login-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}
            
            <button type="submit" className="login-btn">
              Login
            </button>
          </form>

          <div className="signup-link">
            <p>Don\'t have an account? <Link to="/signup">Sign Up</Link></p>
          </div>

        </div>
      </main>
    </div>
  );
};

export default LoginPage;
