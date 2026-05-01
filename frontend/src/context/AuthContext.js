import React, { createContext, useState, useContext, useEffect } from 'react';
import { signInWithEmail, signUpWithEmail, signInWithGoogle, signOut, onAuthStateChanged } from '../firebase/auth';
import { upsertUser, getUser } from '../firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Load Firestore profile
        try {
          const profile = await getUser(firebaseUser.uid);
          setUserProfile(profile);
        } catch {
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    const { user: fbUser } = await signInWithEmail(email, password);
    const profile = await getUser(fbUser.uid);
    setUserProfile(profile);
    return fbUser;
  };

  const loginWithGoogle = async () => {
    const { user: fbUser } = await signInWithGoogle();
    // Check if user exists in Firestore
    let profile = await getUser(fbUser.uid);
    if (!profile) {
      // Create default profile for new Google users
      profile = {
        email: fbUser.email,
        displayName: fbUser.displayName,
        role: 'consumer',
        createdAt: new Date().toISOString(),
        walletAddress: null,
      };
      await upsertUser(fbUser.uid, profile);
    }
    setUserProfile({ id: fbUser.uid, ...profile });
    return fbUser;
  };

  const signup = async (email, password, role = 'consumer') => {
    const { user: fbUser } = await signUpWithEmail(email, password);
    const profile = {
      email,
      role,
      createdAt: new Date().toISOString(),
      walletAddress: null,
    };
    await upsertUser(fbUser.uid, profile);
    setUserProfile({ id: fbUser.uid, ...profile });
    return fbUser;
  };

  const logout = () => signOut();

  const updateWalletAddress = async (address) => {
    if (!user) return;
    await upsertUser(user.uid, { walletAddress: address });
    setUserProfile((prev) => ({ ...prev, walletAddress: address }));
  };

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    signup,
    logout,
    updateWalletAddress,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
