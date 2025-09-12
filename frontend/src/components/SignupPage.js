import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import '../styles/SignupPage.css';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup, logoutAndRedirect } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    const success = signup(email, password);

    if (success) {
      logoutAndRedirect(navigate);
    } else {
      setError('Failed to create an account. Please try again.');
    }
  };

  return (
    <div className="signup-page-container">
      <Header />
      <main className="signup-hero-section">
        <div className="signup-container">
          <h1 className="signup-title">Create Your Account</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="email"
                className="signup-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                className="signup-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                className="signup-input"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-message">{error}</p>}
            
            <button type="submit" className="signup-btn">
              Sign Up
            </button>
          </form>

          <div className="login-link">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignupPage;
