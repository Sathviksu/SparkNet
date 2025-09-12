import React from 'react';
import './../styles/SustainabilityTracker.css';

const SustainabilityTracker = () => {
  return (
    <div className="tracker-container">
      <div className="tracker-header">
        <h2>Sustainability Tracker</h2>
        <p>Track your environmental impact and discover ways to live more sustainably.</p>
      </div>
      <div className="tracker-cards">
        <div className="card">
          <h4>Total Carbon Footprint</h4>
          <p className="metric">12.5 tons CO2e</p>
          <p className="change down">↓ 10% from last month</p>
        </div>
        <div className="card">
          <h4>Reduction Goal</h4>
          <p className="metric">15 tons CO2e</p>
          <p className="target">Target: 10 tons CO2e</p>
        </div>
        <div className="card">
          <h4>Current Progress</h4>
          <p className="metric">2.5 tons CO2e</p>
          <p className="change up">↑ 20% towards goal</p>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityTracker;
