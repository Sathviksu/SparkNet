import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import './styles/Leaderboard.css';

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([
    { id: '1', displayName: 'EcoWarrior_99', sustainabilityScore: 1250.5, email: 'eco@example.com' },
    { id: '2', displayName: 'SolarMaster', sustainabilityScore: 980.2, email: 'solar@example.com' },
    { id: '3', displayName: 'GreenTrader', sustainabilityScore: 750.0, email: 'green@example.com' },
    { id: '4', displayName: 'CarbonNeutral', sustainabilityScore: 620.8, email: 'carbon@example.com' },
    { id: '5', displayName: 'WindRider', sustainabilityScore: 410.5, email: 'wind@example.com' },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'userProfiles'),
      orderBy('sustainabilityScore', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (data.length > 0) {
        setLeaders(data);
      }
    }, (error) => {
      console.error("Leaderboard fetch error:", error);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="page-container leaderboard-page">
      <div className="leaderboard-header">
        <h1 className="section-title">Sustainability Leaderboard</h1>
        <p className="section-subtitle">Top green energy pioneers in the SparkNet ecosystem</p>
      </div>

      <div className="glass-card leaderboard-card">
        <div className="leaderboard-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>Rank</th>
                <th>User</th>
                <th>Score</th>
                <th className="hide-mobile">Impact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((user, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;
                return (
                  <tr key={user.id} className={isTop3 ? 'top-rank' : ''}>
                    <td>
                      <div className={`rank-badge rank-${rank}`}>
                        {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                      </div>
                    </td>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar-sm">
                          {user.displayName?.[0] || user.email?.[0] || '?'}
                        </div>
                        <div className="user-details">
                          <div className="user-name">{user.displayName || user.email?.split('@')[0]}</div>
                          <div className="user-id-sub">{user.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="score-value">
                        {user.sustainabilityScore?.toFixed(1) || '0.0'}
                      </div>
                    </td>
                    <td className="hide-mobile">
                      <div className="impact-stats">
                        <span className="impact-item">🌱 {(user.sustainabilityScore * 0.82).toFixed(1)}kg CO₂</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${isTop3 ? 'badge-green' : 'badge-gray'}`}>
                        {rank === 1 ? 'Elite' : rank <= 5 ? 'Pro' : 'Active'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="leaderboard-info glass-card">
        <h3>How is the score calculated?</h3>
        <p>
          Your Sustainability Score increases with every energy trade and production session. 
          Buying 1 kWh of green energy adds <strong>1.0 points</strong> to your score, 
          while producing energy as a registered seller earns you <strong>1.5 points</strong> per kWh.
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
