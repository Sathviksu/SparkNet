import React from 'react';
import ProducerList from './ProducerList';
import '../styles/SellerDashboard.css';

const Seller = () => {
  return (
    <div className="seller-container">
      <header className="seller-header">
        <h2>💰 Seller Dashboard</h2>
        <p>Monitor and sell your excess solar energy to the grid.</p>
      </header>
      <main>
        <ProducerList />
      </main>
    </div>
  );
};

export default Seller;
