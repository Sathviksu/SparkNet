import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToUserTransactions } from '../firebase/firestore';
import { useCurrency } from '../hooks/useCurrency';
import './styles/History.css';

const History = () => {
  const { user } = useAuth();
  const { formatINR, formatETH } = useCurrency();
  const [transactions, setTransactions] = useState([
    { id: 'tx_1', type: 'buy', tokenAmount: 25, ethCost: 0.0003125, inrCost: 125.0, txHash: '0x123...abc', timestamp: new Date() },
    { id: 'tx_2', type: 'produce', tokenAmount: 15, ethCost: 0.0001875, inrCost: 75.0, txHash: '0x456...def', timestamp: new Date(Date.now() - 86400000) },
    { id: 'tx_3', type: 'mint', capacity: 5.0, ethCost: 0.05, inrCost: 10000.0, txHash: '0x789...ghi', timestamp: new Date(Date.now() - 172800000) }
  ]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserTransactions(user.uid, (data) => {
      if (data && data.length > 0) setTransactions(data);
    });
    return unsub;
  }, [user]);

  const filteredTxs = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  });

  return (
    <div className="page-container history-page">
      <div className="history-header">
        <div>
          <h1 className="section-title">Transaction History</h1>
          <p className="section-subtitle">A detailed log of all your blockchain activities</p>
        </div>
        <div className="filter-chips">
          {['all', 'buy', 'produce', 'mint'].map(f => (
            <button 
              key={f} 
              className={`filter-chip ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card history-card">
        {filteredTxs.length === 0 ? (
          <div className="empty-history">
            <div className="empty-icon">📜</div>
            <h3>No transactions found</h3>
            <p>Your blockchain activities will appear here once you start trading.</p>
          </div>
        ) : (
          <div className="history-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Cost / Value</th>
                  <th>Status</th>
                  <th>Transaction Hash</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxs.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <div className="tx-date">
                        {tx.timestamp?.toDate ? tx.timestamp.toDate().toLocaleDateString() : new Date(tx.timestamp).toLocaleDateString()}
                      </div>
                      <div className="tx-time">
                        {tx.timestamp?.toDate ? tx.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date(tx.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td>
                      <span className={`badge badge-${tx.type === 'buy' ? 'green' : tx.type === 'produce' ? 'cyan' : 'yellow'}`}>
                        {tx.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="tx-amount">
                      {tx.tokenAmount || tx.capacity || '—'} 
                      <span className="unit">{tx.type === 'mint' ? 'kW Cap' : 'kWh'}</span>
                    </td>
                    <td className="tx-value">
                      <div className="eth-val">{tx.ethCost ? formatETH(tx.ethCost) : '—'}</div>
                      <div className="inr-val">{tx.inrCost ? formatINR(tx.inrCost) : '—'}</div>
                    </td>
                    <td>
                      <span className="badge badge-green">
                        <span className="dot dot-green" /> Success
                      </span>
                    </td>
                    <td className="tx-hash">
                      <a 
                        href={`#`} 
                        onClick={(e) => {
                            e.preventDefault();
                            alert(`TX Hash: ${tx.txHash}\nIn a live network, this would open Etherscan.`);
                        }}
                        className="hash-link"
                      >
                        {tx.txHash ? `${tx.txHash.substring(0, 12)}...` : '—'}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
