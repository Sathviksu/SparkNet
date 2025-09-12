import React from 'react';
import SustainabilityTracker from './SustainabilityTracker';
import PriceChart from './PriceChart';
import './../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <SustainabilityTracker />
      <div className="dashboard-charts">
        <PriceChart title="Carbon Footprint Over Time" percentage="-5%" />
        <PriceChart title="Energy Consumption" percentage="+2%" />
      </div>
    </div>
  );
};

export default Dashboard;
