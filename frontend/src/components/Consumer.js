import React from 'react';
import Marketplace from './MarketPlace';

const Consumer = () => {
  return (
    <div className="consumer-container">
      <header className="consumer-header">
        <h2>Energy Marketplace</h2>
        <p>Purchase renewable energy from a community of sellers.</p>
      </header>
      <Marketplace />
    </div>
  );
};

export default Consumer;
