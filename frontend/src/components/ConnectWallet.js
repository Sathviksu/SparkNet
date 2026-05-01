import React from 'react';
import { useWeb3 } from '../context/Web3Context';
import './styles/ConnectWallet.css';

export default function ConnectWallet() {
  const { account, connected, connectWallet, disconnectWallet, loading, chainId, requiredChainId } = useWeb3();
  const isCorrectNetwork = chainId === requiredChainId;

  if (!connected) {
    return (
      <button onClick={connectWallet} disabled={loading} className="connect-btn">
        {loading ? (
          <><div className="spinner" style={{width:14,height:14,borderWidth:2}} /> Connecting…</>
        ) : (
          <><span className="metamask-icon">🦊</span> Connect Wallet</>
        )}
      </button>
    );
  }

  return (
    <div className="wallet-connected">
      <div className="wallet-pill">
        <span className={`dot ${isCorrectNetwork ? 'dot-green' : 'dot-red'}`} />
        <span className="wallet-address">
          {account.substring(0, 6)}…{account.slice(-4)}
        </span>
        {!isCorrectNetwork && (
          <span className="badge badge-red" style={{fontSize:'0.7rem'}}>Wrong Net</span>
        )}
      </div>
      <button onClick={disconnectWallet} className="disconnect-btn" title="Disconnect wallet">✕</button>
    </div>
  );
}
