import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Mock user database
const users = [
  {
    email: 'user@example.com',
    password: 'password',
  },
];

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const foundUser = users.find((u) => u.email === email && u.password === password);
    if (foundUser) {
      setIsAuthenticated(true);
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    } else {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  const logoutAndRedirect = (navigate) => {
    logout();
    setTimeout(() => {
      navigate('/login', { state: { message: 'Signup successful! Please log in.', fromSignup: true } });
    }, 0);
  };

  const signup = (email, password) => {
    const existingUser = users.find((u) => u.email === email);
    if (existingUser) {
      return false; // User already exists
    }

    const newUser = { email, password };
    users.push(newUser);
    return true;
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout,
    logoutAndRedirect,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
