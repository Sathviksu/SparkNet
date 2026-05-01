import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import axios from 'axios';
import { useWeb3 } from '../context/Web3Context';
import { useContracts } from '../hooks/useContracts';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useCurrency } from '../hooks/useCurrency';
import { useSustainability } from '../context/SustainabilityContext';
import { useAuth } from '../context/AuthContext';
import { saveTransaction, subscribeToUserTransactions } from '../firebase/firestore';
import { API_BASE_URL } from '../utils/constants';
import './styles/MarketPlace.css';

const Marketplace = () => {
  const { account, connected, connectWallet, loading: walletLoading } = useWeb3();
  const { erc20, connected: contractsConnected } = useContracts();
  const { energyData } = useRealTimeData();
  const { ethToInr, formatINR, formatETH, ethToInrRate } = useCurrency();
  const { increaseScore } = useSustainability();
  const { user } = useAuth();

  const [tokenBalance, setTokenBalance]   = useState('0');
  const [ethBalance, setEthBalance]       = useState('0');
  const [contractPrice, setContractPrice] = useState('0.0000125');
  const [buyAmount, setBuyAmount]         = useState('');
  const [loading, setLoading]             = useState(false);
  const [txList, setTxList]               = useState([]);
  const [showINR, setShowINR]             = useState(true);
  const [analytics, setAnalytics]         = useState(null);
  const [txSuccess, setTxSuccess]         = useState('');

  const marketData = energyData.marketData;
  const currentPriceETH = marketData?.current_price_eth || contractPrice;
  const currentPriceINR = marketData?.current_price_inr || ethToInr(parseFloat(currentPriceETH));

  // Fetch on-chain balances
  const fetchBalances = useCallback(async () => {
    if (!connected || !erc20 || !account) return;
    try {
      const prov = erc20.runner?.provider;
      if (prov) {
        const eth = await prov.getBalance(account);
        setEthBalance(ethers.formatEther(eth));
      }
      const tok = await erc20.balanceOf(account);
      setTokenBalance(ethers.formatEther(tok));
      const price = await erc20.getTokenPriceETH();
      setContractPrice(ethers.formatEther(price));
    } catch (e) { console.error('Balance fetch error:', e); }
  }, [connected, erc20, account]);

  useEffect(() => { fetchBalances(); const iv = setInterval(fetchBalances, 12000); return () => clearInterval(iv); }, [fetchBalances]);

  // Analytics
  useEffect(() => {
    axios.get(`${API_BASE_URL}/analytics/summary`).then(r => { if (r.data.success) setAnalytics(r.data.summary); }).catch(() => {});
    const iv = setInterval(() => { axios.get(`${API_BASE_URL}/analytics/summary`).then(r => { if (r.data.success) setAnalytics(r.data.summary); }).catch(() => {}); }, 60000);
    return () => clearInterval(iv);
  }, []);

  // Firestore real-time tx history
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserTransactions(user.uid, setTxList);
    return unsub;
  }, [user]);

  const cost = (() => {
    const n = parseFloat(buyAmount);
    if (!n || n <= 0) return { eth: 0, inr: 0 };
    const eth = n * parseFloat(contractPrice);
    return { eth, inr: ethToInr(eth) };
  })();

  const handleBuy = async () => {
    if (!buyAmount || !connected || !contractsConnected || !erc20) return;
    const amount = parseFloat(buyAmount);
    if (isNaN(amount) || amount <= 0) return;
    setLoading(true);
    setTxSuccess('');
    try {
      const totalETH = amount * parseFloat(contractPrice);
      if (parseFloat(ethBalance) < totalETH) {
        alert(`❌ Insufficient ETH.\nRequired: ${totalETH.toFixed(6)} ETH\nAvailable: ${parseFloat(ethBalance).toFixed(6)} ETH`);
        return;
      }
      const weiValue = ethers.parseEther(totalETH.toFixed(18));
      const tx = await erc20.buyTokens({ value: weiValue });
      const receipt = await tx.wait();
      // Save to Firestore
      if (user) {
        await saveTransaction(user.uid, {
          type: 'buy',
          tokenAmount: amount,
          ethCost: totalETH,
          inrCost: ethToInr(totalETH),
          txHash: receipt.hash,
        });
      }
      increaseScore(amount);
      setTxSuccess(`✅ Bought ${amount} kWh tokens! TX: ${receipt.hash.substring(0, 18)}…`);
      setBuyAmount('');
      await fetchBalances();
    } catch (err) {
      const msg = err.code === 'ACTION_REJECTED' ? '🚫 Transaction rejected by user'
        : err.message?.includes('insufficient funds') ? '❌ Insufficient ETH'
        : `❌ ${err.reason || err.message || 'Transaction failed'}`;
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Render: wallet not connected ─────────────────────────────
  if (!connected) {
    return (
      <div className="page-container marketplace-page">
        <div className="mp-connect-prompt glass-card">
          <div className="mp-connect-icon">🦊</div>
          <h2>Connect Your Wallet</h2>
          <p>Link MetaMask to access the energy token marketplace and start trading.</p>
          <button onClick={connectWallet} disabled={walletLoading} className="btn btn-primary btn-lg">
            {walletLoading ? 'Connecting…' : 'Connect MetaMask →'}
          </button>
          <p className="mp-hint">Make sure Hardhat local node is running · Chain ID 31337</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container marketplace-page">
      <div className="mp-header">
        <div>
          <h1 className="section-title" style={{ marginBottom: 4 }}>Energy Marketplace</h1>
          <p className="section-subtitle">Buy kWh tokens backed by real solar production</p>
        </div>
        <div className="currency-toggle-group">
          <button className={`toggle-btn ${showINR ? 'active' : ''}`} onClick={() => setShowINR(true)}>₹ INR</button>
          <button className={`toggle-btn ${!showINR ? 'active' : ''}`} onClick={() => setShowINR(false)}>Ξ ETH</button>
        </div>
      </div>

      {/* Top row */}
      <div className="mp-top-grid">
        {/* Price Hero */}
        <div className="glass-card mp-price-card">
          <div className="mp-price-label">Current Price / kWh</div>
          <div className="mp-price-main">
            {showINR ? formatINR(currentPriceINR) : formatETH(currentPriceETH)}
          </div>
          <div className="mp-price-sub">
            {showINR ? formatETH(currentPriceETH) : formatINR(currentPriceINR)}
          </div>
          <div className="mp-rate-info">
            <span className="dot dot-green" style={{ marginRight: 6 }} />
            Live · 1 ETH = {formatINR(ethToInrRate)}
          </div>
        </div>

        {/* Wallet */}
        <div className="glass-card mp-wallet-card">
          <h3 className="mp-section-label">Your Wallet</h3>
          <div className="mp-wallet-address">
            🦊 {account.substring(0, 8)}…{account.slice(-6)}
          </div>
          <div className="mp-balance-row">
            <div>
              <div className="mp-bal-label">ENERGY Tokens</div>
              <div className="mp-bal-value">{parseFloat(tokenBalance).toFixed(4)} kWh</div>
            </div>
            <div>
              <div className="mp-bal-label">ETH Balance</div>
              <div className="mp-bal-value">{parseFloat(ethBalance).toFixed(5)} ETH</div>
            </div>
          </div>
          <div className="mp-bal-inr">{formatINR(ethToInr(parseFloat(ethBalance)))} equivalent</div>
        </div>

        {/* Market Stats */}
        {marketData && (
          <div className="glass-card mp-stats-card">
            <h3 className="mp-section-label">Market Overview</h3>
            <div className="mp-stats-grid">
              <div className="mp-stat"><div className="mp-stat-label">Supply</div><div className="mp-stat-val">{marketData.total_supply_kwh} kWh</div></div>
              <div className="mp-stat"><div className="mp-stat-label">Demand</div><div className="mp-stat-val">{marketData.estimated_demand_kwh} kWh</div></div>
              <div className="mp-stat"><div className="mp-stat-label">Producers</div><div className="mp-stat-val">{marketData.active_producers}/{marketData.total_producers}</div></div>
              <div className="mp-stat"><div className="mp-stat-label">ETH Rate</div><div className="mp-stat-val">{formatINR(marketData.eth_to_inr_rate)}</div></div>
            </div>
          </div>
        )}
      </div>

      {/* Buy Section */}
      <div className="glass-card mp-buy-card">
        <h2 className="mp-buy-title">🛒 Buy Energy Tokens</h2>
        {!contractsConnected && (
          <div className="alert alert-error">⚠️ Smart contracts unavailable — check network & Hardhat node.</div>
        )}
        {txSuccess && <div className="alert alert-success">{txSuccess}</div>}

        <div className="mp-buy-form">
          <div className="form-group">
            <label className="form-label">Amount of kWh tokens</label>
            <div className="mp-input-row">
              <input
                id="buy-amount"
                type="number"
                className="form-input"
                placeholder="e.g. 100"
                value={buyAmount}
                onChange={e => setBuyAmount(e.target.value)}
                min="0"
                step="1"
              />
              <button className="btn btn-ghost btn-sm" onClick={() => {
                const maxTokens = Math.floor(parseFloat(ethBalance) / parseFloat(contractPrice) * 0.95);
                setBuyAmount(String(maxTokens > 0 ? maxTokens : ''));
              }}>MAX</button>
            </div>
          </div>

          {buyAmount && parseFloat(buyAmount) > 0 && (
            <div className="mp-cost-preview">
              <div className="mp-cost-row">
                <span>Token amount</span>
                <span className="mp-cost-val">{buyAmount} kWh</span>
              </div>
              <div className="mp-cost-row">
                <span>Cost in ETH</span>
                <span className="mp-cost-val">{cost.eth.toFixed(8)} ETH</span>
              </div>
              <div className="mp-cost-row mp-cost-total">
                <span>Total Cost</span>
                <span className="mp-cost-val-big">{showINR ? formatINR(cost.inr) : formatETH(cost.eth)}</span>
              </div>
              <div className="mp-blockchain-notice">
                🔗 Real Ethereum transaction · Gas fees may apply
              </div>
            </div>
          )}

          <button
            id="buy-tokens-btn"
            onClick={handleBuy}
            disabled={loading || !contractsConnected || !buyAmount || parseFloat(buyAmount) <= 0}
            className="btn btn-primary mp-buy-btn"
          >
            {loading ? <><div className="spinner" style={{width:18,height:18,borderWidth:2}} /> Processing…</> : '⚡ Buy Energy Tokens'}
          </button>
        </div>
      </div>

      {/* Transaction History Preview */}
      {txList.length > 0 && (
        <div className="glass-card mp-tx-card">
          <div className="flex-between" style={{ marginBottom: 'var(--space-4)' }}>
            <h2 className="mp-section-label" style={{ fontSize: '1rem', margin: 0 }}>Recent Activity</h2>
            <Link to="/history" className="btn btn-ghost btn-sm">View All History →</Link>
          </div>
          <div className="mp-tx-preview-list">
            {txList.slice(0, 3).map(tx => (
              <div key={tx.id} className="mp-tx-item">
                <div className="mp-tx-type-icon">
                  {tx.type === 'buy' ? '📥' : '📤'}
                </div>
                <div className="mp-tx-details">
                  <div className="mp-tx-title">
                    {tx.type === 'buy' ? 'Purchased' : 'Sold'} {tx.tokenAmount} kWh
                  </div>
                  <div className="mp-tx-meta">
                    {tx.ethCost?.toFixed(6)} ETH · {new Date(tx.timestamp?.toDate ? tx.timestamp.toDate() : tx.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div className="mp-tx-status">
                  <span className="badge badge-green">Success</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
