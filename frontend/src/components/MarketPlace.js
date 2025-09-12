import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useContracts } from '../hooks/useContracts';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useCurrency } from '../hooks/useCurrency';
import { useSustainability } from '../context/SustainabilityContext';
import { ethers } from 'ethers';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const Marketplace = () => {
  const { account, connected, loading: walletLoading } = useWeb3();
  const { erc20, connected: contractsConnected } = useContracts();
  const { energyData } = useRealTimeData();
  const { ethToInr, inrToEth, formatINR, formatETH, ethToInrRate } = useCurrency();
  const { increaseScore } = useSustainability();

  const [userTokenBalance, setUserTokenBalance] = useState('0');
  const [userEthBalance, setUserEthBalance] = useState('0');
  const [buyAmount, setBuyAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [showINR, setShowINR] = useState(true);
  const [contractPrice, setContractPrice] = useState('0.001');

  const currentPriceETH = energyData.marketData?.current_price_eth || contractPrice;
  const currentPriceINR = energyData.marketData?.current_price_inr || ethToInr(parseFloat(currentPriceETH));
  const marketData = energyData.marketData;

  // Fetch balances
  useEffect(() => {
    const fetchBalances = async () => {
      if (!connected || !contractsConnected || !erc20 || !account) return;

      try {
        const provider = erc20.runner.provider;
        const ethBalance = await provider.getBalance(account);
        setUserEthBalance(ethers.formatEther(ethBalance));

        const tokenBalance = await erc20.balanceOf(account);
        setUserTokenBalance(ethers.formatEther(tokenBalance));

        const price = await erc20.getTokenPriceETH();
        setContractPrice(ethers.formatEther(price));
      } catch (error) {
        console.error('❌ Error fetching balances:', error);
      }
    };

    fetchBalances();
    const interval = setInterval(fetchBalances, 10000);
    return () => clearInterval(interval);
  }, [connected, contractsConnected, erc20, account]);

  // Fetch analytics
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/analytics/summary`);
        if (res.data.success) {
          setAnalytics(res.data.summary);
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
      }
    };

    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleBuyTokens = async () => {
    if (!buyAmount || !connected || !contractsConnected || !erc20) {
      alert('❌ Please connect your wallet and enter an amount');
      return;
    }

    const amount = parseFloat(buyAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('❌ Invalid token amount');
      return;
    }

    try {
      setLoading(true);

      const pricePerToken = parseFloat(contractPrice);
      const totalCostETH = amount * pricePerToken;
      const totalCostWei = ethers.parseEther(totalCostETH.toFixed(18));

      const ethBalance = parseFloat(userEthBalance);
      if (ethBalance < totalCostETH) {
        alert(`❌ Insufficient ETH balance!\nRequired: ${totalCostETH.toFixed(6)} ETH\nAvailable: ${ethBalance.toFixed(6)} ETH`);
        return;
      }

      // Optional: Estimate gas
      // const gasEstimate = await erc20.buyTokens.estimateGas({ value: totalCostWei });

      const tx = await erc20.buyTokens({ value: totalCostWei });

      alert(`🔄 Transaction sent!\nTX Hash: ${tx.hash.substring(0, 20)}...`);

      const receipt = await tx.wait();

      increaseScore(amount);

      const totalCostINR = ethToInr(totalCostETH);
      alert(`🎉 Purchase Successful!\n\nPurchased: ${amount} kWh tokens\nCost: ${totalCostETH.toFixed(6)} ETH (${formatINR(totalCostINR)})\nTX: ${receipt.hash.substring(0, 20)}...`);

      setBuyAmount('');

      // Refresh balances
      const provider = erc20.runner.provider;
      const newEthBalance = await provider.getBalance(account);
      setUserEthBalance(ethers.formatEther(newEthBalance));

      const newTokenBalance = await erc20.balanceOf(account);
      setUserTokenBalance(ethers.formatEther(newTokenBalance));

    } catch (error) {
      console.error('❌ Transaction failed:', error);
      let msg = 'Transaction failed: ';

      if (error.code === 'ACTION_REJECTED' || error.message?.includes('user rejected')) {
        msg = '🚫 Transaction rejected by user';
      } else if (error.message?.includes('insufficient funds')) {
        msg = '❌ Insufficient ETH for transaction';
      } else {
        msg += error.message || 'Unknown error';
      }

      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const calculateCost = () => {
    const amount = parseFloat(buyAmount);
    if (isNaN(amount) || amount <= 0) return { eth: 0, inr: 0 };

    const ethCost = amount * parseFloat(contractPrice);
    return {
      eth: ethCost,
      inr: ethToInr(ethCost)
    };
  };

  const cost = calculateCost();

  if (walletLoading) return <div className="marketplace">🔄 Connecting to wallet...</div>;
  if (!connected) {
    return (
      <div className="marketplace">
        <h2>⚡ Energy Token Marketplace</h2>
        <p>🔗 Please connect your MetaMask wallet to start trading energy tokens</p>
      </div>
    );
  }

  if (!contractsConnected) {
    return (
      <div className="marketplace">
        <h2>⚡ Energy Token Marketplace</h2>
        <p>❌ Smart contracts not available. Please check your network connection.</p>
      </div>
    );
  }

  return (
    <div className="marketplace">
      <div className="marketplace-header">
        <h2>⚡ Energy Token Marketplace</h2>
        <div className="currency-toggle">
          <button className={showINR ? 'active' : ''} onClick={() => setShowINR(true)}>₹ INR</button>
          <button className={!showINR ? 'active' : ''} onClick={() => setShowINR(false)}>Ξ ETH</button>
        </div>
      </div>

      <div className="market-info">
        <div className="price-display">
          <h3>💰 Current Price per kWh</h3>
          <div className="price-container">
            <p className="price-main">{showINR ? formatINR(currentPriceINR) : formatETH(contractPrice)}</p>
            <p className="price-secondary">{showINR ? formatETH(contractPrice) : formatINR(currentPriceINR)}</p>
          </div>
          <small>Live blockchain price • 1 ETH = {formatINR(ethToInrRate)}</small>
        </div>

        {marketData && (
          <div className="market-stats">
            <h4>📊 Market Overview</h4>
            <div className="stat-grid">
              <div className="stat-item">
                <span>Total Supply:</span>
                <span>{marketData.total_supply_kwh} kWh</span>
              </div>
              <div className="stat-item">
                <span>Demand:</span>
                <span>{marketData.estimated_demand_kwh} kWh</span>
              </div>
              <div className="stat-item">
                <span>Active Producers:</span>
                <span>{marketData.active_producers}/{marketData.total_producers}</span>
              </div>
            </div>
          </div>
        )}

        <div className="balance-info">
          <h4>💼 Your Wallet</h4>
          <div className="balance-item">
            <span>Energy Tokens:</span>
            <span>{parseFloat(userTokenBalance).toFixed(4)} kWh</span>
          </div>
          <div className="balance-item">
            <span>ETH Balance:</span>
            <span>{formatETH(userEthBalance)} ({formatINR(ethToInr(parseFloat(userEthBalance)))})</span>
          </div>
        </div>
      </div>

      <div className="buy-section">
        <h3>🛒 Buy Energy Tokens</h3>
        <div className="buy-form">
          <input
            type="number"
            placeholder="Amount of kWh tokens"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
            min="0"
            step="0.01"
            inputMode="decimal"
          />

          {buyAmount && (
            <div className="cost-breakdown">
              <div className="cost-item">
                <span>💵 Total Cost:</span>
                <span className="cost-main">
                  {showINR ? formatINR(cost.inr) : formatETH(cost.eth)}
                </span>
              </div>
              <div className="cost-item secondary">
                <span>Equivalent:</span>
                <span>{showINR ? formatETH(cost.eth) : formatINR(cost.inr)}</span>
              </div>
              <div className="blockchain-notice">
                🔗 Real blockchain transaction • Gas fees may apply
              </div>
            </div>
          )}

          <button
            onClick={handleBuyTokens}
            disabled={loading || isNaN(parseFloat(buyAmount)) || parseFloat(buyAmount) <= 0}
            className="buy-button"
          >
            {loading ? '⏳ Processing Transaction...' : '🚀 Buy Tokens'}
          </button>
        </div>
      </div>

      {analytics && (
        <div className="market-analytics">
          <h4>📈 Network Statistics</h4>
          <div className="analytics-grid">
            <div className="analytic-item">
              <span>Network Capacity:</span>
              <span>{analytics.total_capacity_kw} kW</span>
            </div>
            <div className="analytic-item">
              <span>Current Production:</span>
              <span>{analytics.current_production_kwh} kWh</span>
            </div>
            <div className="analytic-item">
              <span>Capacity Utilization:</span>
              <span>{analytics.capacity_utilization}%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
