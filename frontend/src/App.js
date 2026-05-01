import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Web3Provider } from './context/Web3Context';
import { SustainabilityProvider } from './context/SustainabilityContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard';
import Consumer from './components/Consumer';
import Seller from './components/Seller';
import History from './components/History';
import Leaderboard from './components/Leaderboard';
import MainLayout from './components/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import './App.css';


function App() {
  return (
    <Router>
      <AuthProvider>
        <SustainabilityProvider>
          <div className="App">
            <Routes>
              <Route 
                path="/"
                element={<PublicRoute><LandingPage /></PublicRoute>}
              />
              <Route 
                path="/login"
                element={<PublicRoute><LoginPage /></PublicRoute>}
              />
              <Route 
                path="/signup"
                element={<PublicRoute><SignupPage /></PublicRoute>}
              />
              <Route 
                path="/*"
                element={
                  <PrivateRoute>
                    <Web3Provider>
                      <MainLayout />
                    </Web3Provider>
                  </PrivateRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="consumer" element={<Consumer />} />
                <Route path="seller" element={<Seller />} />
                <Route path="history" element={<History />} />
                <Route path="leaderboard" element={<Leaderboard />} />
              </Route>
            </Routes>
          </div>
        </SustainabilityProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
