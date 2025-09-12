import React from 'react';
import './../styles/CarbonFootprint.css';

const CarbonFootprint = () => {
  // This would eventually be calculated based on user data
  const carbonSaved = 125.7; // Example value in kg

  return (
    <div className="carbon-footprint-card">
      <h3>🌿 Carbon Savings</h3>
      <div className="savings-display">
        <span className="savings-value">{carbonSaved}</span>
        <span className="savings-unit">kg CO2e</span>
      </div>
      <p>This is the estimated amount of carbon dioxide equivalent you've saved by using renewable energy from SparkNet.</p>
    </div>
  );
};

export default CarbonFootprint;
