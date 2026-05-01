import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { useWeb3 } from '../context/Web3Context';
import { useContracts } from '../hooks/useContracts';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useCurrency } from '../hooks/useCurrency';
import { useSustainability } from '../context/SustainabilityContext';
import { useAuth } from '../context/AuthContext';
import { saveProducer, saveTransaction } from '../firebase/firestore';
import { API_BASE_URL } from '../utils/constants';
import './styles/Seller.css';

const ENERGY_TYPES = ['Solar', 'Wind', 'Hydro', 'Biomass'];
const WEATHER_ICONS = { sunny: '☀️', partly_cloudy: '⛅', cloudy: '☁️', overcast: '🌫️' };

const Seller = () => {
  const { account, connected, connectWallet } = useWeb3();
  const { erc721, erc20, connected: contractsConnected } = useContracts();
  const { energyData, connected: backendOnline } = useRealTimeData();
  const { ethToInr, formatINR } = useCurrency();
  const { decreaseScore } = useSustainability();
  const { user } = useAuth();

  // IoT device state
  const [devices, setDevices]         = useState([]);
  const [loadingDevices, setLoadingDevices] = useState(true);

  // My NFT producers
  const [myProducers, setMyProducers] = useState([]);
  const [loadingNFTs, setLoadingNFTs] = useState(false);

  // Register form
  const [form, setForm] = useState({ location: '', capacity: '', efficiency: '', energyType: 'Solar', tokenURI: '' });
  const [registering, setRegistering]   = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [activeTab, setActiveTab]       = useState('devices'); // 'devices' | 'register' | 'mynfts'

  // Fetch IoT devices
  useEffect(() => {
    axios.get(`${API_BASE_URL}/devices`)
      .then(r => { if (r.data.success) setDevices(r.data.devices); })
      .catch(() => {})
      .finally(() => setLoadingDevices(false));
  }, []);

  // Fetch my NFTs from chain
  const fetchMyNFTs = async () => {
    if (!account || !erc721) return;
    setLoadingNFTs(true);
    try {
      const tokenIds = await erc721.getOwnerTokens(account);
      const producers = await Promise.all(
        tokenIds.map(async (id) => {
          const data = await erc721.getProducer(id);
          return { tokenId: id.toString(), ...data };
        })
      );
      setMyProducers(producers);
    } catch (e) { console.error('NFT fetch error:', e); }
    finally { setLoadingNFTs(false); }
  };

  useEffect(() => {
    if (connected && erc721) fetchMyNFTs();
  }, [connected, erc721, account]); // eslint-disable-line

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError(''); setRegisterSuccess('');
    if (!form.location || !form.capacity || !form.efficiency) {
      setRegisterError('Please fill in all required fields.');
      return;
    }
    setRegistering(true);
    try {
      const fee = ethers.parseEther('0.01');
      const tx = await erc721.registerProducer(
        form.location,
        Math.round(parseFloat(form.capacity) * 100),     // capacity in 0.01 kW units
        Math.round(parseFloat(form.efficiency)),           // efficiency 1-100
        form.energyType,
        form.tokenURI || `ipfs://sparknet-${Date.now()}`,
        { value: fee }
      );
      const receipt = await tx.wait();
      // Mirror to Firestore
      if (user) {
        const tokenIdEvent = receipt.logs?.[0];
        await saveProducer(Date.now(), {
          location: form.location,
          capacity: form.capacity,
          efficiency: form.efficiency,
          energyType: form.energyType,
          ownerAddress: account,
          txHash: receipt.hash,
        });
      }
      setRegisterSuccess(`🎉 Producer NFT minted! TX: ${receipt.hash.substring(0, 20)}…`);
      setForm({ location: '', capacity: '', efficiency: '', energyType: 'Solar', tokenURI: '' });
      await fetchMyNFTs();
      setActiveTab('mynfts');
    } catch (err) {
      const msg = err.code === 'ACTION_REJECTED' ? '🚫 Transaction rejected'
        : err.message?.includes('insufficient funds') ? '❌ Need 0.01 ETH + gas for registration'
        : `❌ ${err.reason || err.message}`;
      setRegisterError(msg);
    } finally {
      setRegistering(false);
    }
  };

  const handleSell = async (device, reading) => {
    if (!reading || reading.energy_produced_kwh <= 0 || !erc20 || !connected) return;
    const amount = reading.energy_produced_kwh;
    
    // Check if authorized
    try {
      const isAuthorized = await erc20.authorizedProducers(account);
      if (!isAuthorized) {
        alert("❌ Your address is not an authorized producer on the blockchain.\n\nYou must be authorized by the contract owner to sell energy.");
        return;
      }
    } catch (e) { console.error("Auth check error:", e); }

    try {
      const weiAmount = ethers.parseEther(amount.toFixed(18));
      const tx = await erc20.produceEnergy(weiAmount);
      await tx.wait();
      
      // Save to Firestore
      if (user) {
        await saveTransaction(user.uid, {
          type: 'produce',
          tokenAmount: amount,
          ethCost: 0,
          inrCost: 0,
          txHash: tx.hash,
        });
      }
      
      decreaseScore(amount);
      alert(`✅ Success! Produced and sold ${amount.toFixed(2)} kWh tokens.`);
    } catch (err) {
      const msg = err.code === 'ACTION_REJECTED' ? '🚫 Transaction rejected'
        : err.message?.includes('Not authorized') ? '❌ Not an authorized producer'
        : `❌ ${err.reason || err.message}`;
      alert(msg);
    }
  };

  const enriched = devices.map(d => ({
    ...d,
    reading: energyData.readings.find(r => r.device_id === d.id),
    isActive: energyData.readings.find(r => r.device_id === d.id)?.current_power_kw > 0,
  }));

  return (
    <div className="page-container seller-page">
      <div className="seller-header">
        <div>
          <h1 className="section-title" style={{ marginBottom: 4 }}>Seller Dashboard</h1>
          <p className="section-subtitle">Monitor IoT devices, sell energy, and register as an NFT producer</p>
        </div>
        <span className={`badge ${backendOnline ? 'badge-green' : 'badge-red'}`}>
          <span className={`dot ${backendOnline ? 'dot-green' : 'dot-red'}`} />
          {backendOnline ? 'Live Feed' : 'Feed Offline'}
        </span>
      </div>

      {!connected && (
        <div className="glass-card mp-connect-prompt">
          <div className="mp-connect-icon">☀️</div>
          <h2>Connect Your Wallet</h2>
          <p>You need MetaMask to register as a producer or sell energy tokens.</p>
          <button onClick={connectWallet} className="btn btn-primary btn-lg">Connect MetaMask →</button>
        </div>
      )}

      {/* Tab Nav */}
      <div className="seller-tabs">
        {[{id:'devices',label:'IoT Devices'},  {id:'register',label:'Register Producer'}, {id:'mynfts',label:`My NFTs (${myProducers.length})`}].map(t => (
          <button key={t.id} className={`tab-btn ${activeTab===t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: IoT Devices ─────────────────────────────── */}
      {activeTab === 'devices' && (
        loadingDevices ? (
          <div style={{ display:'flex', justifyContent:'center', padding: 60 }}><div className="spinner spinner-lg" /></div>
        ) : (
          <div className="grid-3">
            {enriched.map((device, idx) => {
              const pct = device.capacity_kw > 0 ? Math.min(100, ((device.reading?.current_power_kw || 0) / device.capacity_kw) * 100) : 0;
              return (
                <div key={device.id} className={`glass-card device-card seller-device-card ${!device.isActive ? 'device-offline' : ''}`}>
                  <div className="device-card-header">
                    <div>
                      <div className="device-id">{device.id}</div>
                      <div className="device-location">📍 {device.location}</div>
                    </div>
                    <span className={`badge ${device.isActive ? 'badge-green' : 'badge-gray'}`}>
                      <span className={`dot ${device.isActive ? 'dot-green' : 'dot-gray'}`} />
                      {device.isActive ? 'Producing' : 'Idle'}
                    </span>
                  </div>

                  <div className="device-reading">
                    <span className="device-power">{(device.reading?.current_power_kw || 0).toFixed(2)}</span>
                    <span className="device-power-unit">kW</span>
                  </div>

                  <div className="progress-track" style={{ marginBottom: 'var(--space-3)' }}>
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>

                  <div className="device-meta">
                    <span>Cap: {device.capacity_kw} kW</span>
                    <span>Eff: {(device.efficiency * 100).toFixed(0)}%</span>
                  </div>

                  {device.reading && (
                    <div className="device-weather">
                      {WEATHER_ICONS[device.reading.weather_condition] || '🌤'}{' '}
                      {device.reading.weather_condition?.replace('_',' ')}
                      <span style={{marginLeft:'auto'}}>{device.reading.temperature_celsius?.toFixed(1)}°C</span>
                    </div>
                  )}

                  <button
                    className="btn btn-primary btn-sm sell-energy-btn"
                    disabled={!device.isActive || !device.reading || !connected}
                    onClick={() => handleSell(device, device.reading)}
                  >
                    ⚡ Sell {device.reading?.energy_produced_kwh?.toFixed(2) || '0'} kWh
                  </button>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ── TAB: Register Producer ───────────────────────── */}
      {activeTab === 'register' && (
        <div className="register-layout">
          <div className="glass-card register-form-card">
            <h2 className="register-title">Register as Producer</h2>
            <p className="register-sub">Mint your Energy Producer NFT (ERC-721) for <strong style={{color:'var(--color-primary)'}}>0.01 ETH</strong>. This credentials you as an authorized energy seller on the blockchain.</p>

            {registerError   && <div className="alert alert-error">{registerError}</div>}
            {registerSuccess && <div className="alert alert-success">{registerSuccess}</div>}

            <form onSubmit={handleRegister} className="register-form">
              <div className="form-group">
                <label className="form-label">Location *</label>
                <input className="form-input" placeholder="e.g. Delhi NCR, India" value={form.location}
                  onChange={e => setForm(f => ({...f, location: e.target.value}))} required />
              </div>
              <div className="register-form-row">
                <div className="form-group">
                  <label className="form-label">Capacity (kW) *</label>
                  <input type="number" className="form-input" placeholder="e.g. 5.0" value={form.capacity}
                    onChange={e => setForm(f => ({...f, capacity: e.target.value}))} min="0.1" step="0.1" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Efficiency (%) *</label>
                  <input type="number" className="form-input" placeholder="e.g. 18" value={form.efficiency}
                    onChange={e => setForm(f => ({...f, efficiency: e.target.value}))} min="1" max="100" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Energy Type</label>
                <select className="form-select" value={form.energyType}
                  onChange={e => setForm(f => ({...f, energyType: e.target.value}))}>
                  {ENERGY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Token URI (optional)</label>
                <input className="form-input" placeholder="ipfs://... or leave blank for auto" value={form.tokenURI}
                  onChange={e => setForm(f => ({...f, tokenURI: e.target.value}))} />
              </div>

              <div className="register-fee-note">
                <span>🔗 Registration fee:</span> <strong>0.01 ETH</strong>
                <span style={{color:'var(--text-muted)',marginLeft:8}}>≈ {formatINR(ethToInr(0.01))}</span>
              </div>

              <button type="submit" className="btn btn-primary" style={{width:'100%',padding:'var(--space-4)'}}
                disabled={registering || !connected || !contractsConnected}>
                {registering ? <><div className="spinner" style={{width:16,height:16,borderWidth:2}} /> Minting NFT…</> : '🏭 Mint Producer NFT →'}
              </button>
            </form>
          </div>

          <div className="register-info-card glass-card">
            <h3 className="register-info-title">What you get</h3>
            {[
              { icon: '🎖', title: 'ERC-721 NFT', desc: 'Unique token stored on the Ethereum blockchain' },
              { icon: '⚡', title: 'Producer Rights', desc: 'Authorized to mint ENERGY tokens by producing solar power' },
              { icon: '💰', title: 'Revenue Stream', desc: 'Earn ETH each time you produce and sell energy to consumers' },
              { icon: '📊', title: 'Dashboard Access', desc: 'Monitor your device performance and earnings' },
            ].map(item => (
              <div key={item.title} className="register-perk">
                <span className="register-perk-icon">{item.icon}</span>
                <div>
                  <div className="register-perk-title">{item.title}</div>
                  <div className="register-perk-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: My NFTs ─────────────────────────────────── */}
      {activeTab === 'mynfts' && (
        loadingNFTs ? (
          <div style={{ display:'flex', justifyContent:'center', padding: 60 }}><div className="spinner spinner-lg" /></div>
        ) : myProducers.length === 0 ? (
          <div className="glass-card" style={{padding:'var(--space-10)',textAlign:'center'}}>
            <div style={{fontSize:'2.5rem',marginBottom:'var(--space-4)'}}>🏭</div>
            <h3 style={{marginBottom:'var(--space-3)'}}>No Producer NFTs Yet</h3>
            <p style={{color:'var(--text-muted)',marginBottom:'var(--space-5)'}}>Register as a producer to mint your first NFT and start selling energy.</p>
            <button className="btn btn-primary" onClick={() => setActiveTab('register')}>Register Now →</button>
          </div>
        ) : (
          <div className="grid-3">
            {myProducers.map(p => (
              <div key={p.tokenId} className="glass-card nft-card">
                <div className="nft-card-header">
                  <div className="nft-badge">NFT #{p.tokenId}</div>
                  <span className="badge badge-green">Active</span>
                </div>
                <div className="nft-energy-type">{p.energyType || 'Solar'} ☀️</div>
                <div className="nft-detail"><span>Location:</span><span>{p.location}</span></div>
                <div className="nft-detail"><span>Capacity:</span><span>{(Number(p.capacity) / 100).toFixed(1)} kW</span></div>
                <div className="nft-detail"><span>Efficiency:</span><span>{p.efficiency?.toString()}%</span></div>
                <div className="nft-detail"><span>Status:</span><span>{p.isActive ? '✅ Active' : '⏸ Inactive'}</span></div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Seller;
