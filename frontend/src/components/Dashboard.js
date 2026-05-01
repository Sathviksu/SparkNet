import React, { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, ArcElement, Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import { useSustainability } from '../context/SustainabilityContext';
import { subscribeToPriceHistory, savePricePoint } from '../firebase/firestore';
import './styles/Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, Filler);

const CHART_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false,
    backgroundColor: 'rgba(13,21,38,0.95)', borderColor: 'rgba(0,255,163,0.3)', borderWidth: 1,
    titleColor: '#E2E8F0', bodyColor: '#94A3B8', padding: 12 } },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', maxTicksLimit: 8, font: { size: 11 } } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#475569', font: { size: 11 } } },
  },
};

const DOUGHNUT_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { color: '#94A3B8', padding: 16, font: { size: 12 } } },
    tooltip: { backgroundColor: 'rgba(13,21,38,0.95)', borderColor: 'rgba(0,255,163,0.3)', borderWidth: 1,
      titleColor: '#E2E8F0', bodyColor: '#94A3B8', padding: 12 },
  },
  cutout: '68%',
};

const WEATHER_ICONS = { sunny: '☀️', partly_cloudy: '⛅', cloudy: '☁️', overcast: '🌫️' };

const Dashboard = () => {
  const { userProfile } = useAuth();
  const { sustainabilityScore } = useSustainability();
  const [devices, setDevices]       = useState([]);
  const [readings, setReadings]     = useState([]);
  const [marketData, setMarketData] = useState(null);
  const [analytics, setAnalytics]   = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = useCallback(async () => {
    console.log('🔄 Dashboard: Refreshing data...');
    try {
      // Use a timeout to prevent hanging Promise.all
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const endpoints = [
        `${API_BASE_URL}/devices`,
        `${API_BASE_URL}/readings/current`,
        `${API_BASE_URL}/market/data`,
        `${API_BASE_URL}/analytics/summary`
      ];

      const responses = await Promise.all(
        endpoints.map(url => axios.get(url, { signal: controller.signal }))
      );
      
      clearTimeout(timeoutId);
      const [devRes, readRes, mktRes, anlRes] = responses;

      if (devRes.data.success) setDevices(devRes.data.devices);
      if (readRes.data.success) setReadings(readRes.data.readings);
      if (mktRes.data.success) {
        const md = mktRes.data.market_data;
        setMarketData(md);
        savePricePoint(md.current_price_eth, md.current_price_inr).catch(() => {});
      }
      if (anlRes.data.success) setAnalytics(anlRes.data.summary);
      
      setBackendOnline(true);
      setLastRefresh(new Date());
    } catch (err) {
      console.error('❌ Dashboard Fetch Error:', err.message);
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Firestore real-time price history
  useEffect(() => {
    const unsub = subscribeToPriceHistory((pts) => setPriceHistory(pts), 60);
    return unsub;
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Chart Data
  const lineData = {
    labels: priceHistory.map((_, i) => `T-${priceHistory.length - 1 - i}`),
    datasets: [{
      label: 'Price (₹)',
      data: priceHistory.map(p => p.price_inr),
      borderColor: '#00FFA3',
      backgroundColor: 'rgba(0,255,163,0.06)',
      borderWidth: 2,
      pointRadius: 0,
      fill: true,
      tension: 0.4,
    }],
  };

  const deviceColors = ['#00FFA3','#00D4FF','#7B5EA7','#FFA502','#FF4757'];
  const doughnutData = {
    labels: readings.map(r => r.location),
    datasets: [{
      data: readings.map(r => Math.max(0, r.current_power_kw || 0)),
      backgroundColor: deviceColors.map(c => c + '33'),
      borderColor: deviceColors,
      borderWidth: 2,
    }],
  };

  const totalKwh = readings.reduce((s, r) => s + (r.energy_produced_kwh || 0), 0);
  const activeCount = readings.filter(r => r.current_power_kw > 0).length;
  const carbonOffset = (totalKwh * 0.82).toFixed(2); // ~0.82 kg CO2 offset per kWh

  if (loading) {
    return (
      <div className="page-container" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:400 }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="page-container dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="section-title" style={{ marginBottom: 4 }}>
            Dashboard
          </h1>
          <p className="section-subtitle">
            Welcome back{userProfile?.email ? `, ${userProfile.email.split('@')[0]}` : ''} · {' '}
            <span className={`badge ${backendOnline ? 'badge-green' : 'badge-red'}`}>
              <span className={`dot ${backendOnline ? 'dot-green' : 'dot-red'}`} />
              {backendOnline ? 'Live' : 'Offline'}
            </span>
            {lastRefresh && <span style={{color:'var(--text-muted)',fontSize:'0.78rem',marginLeft:8}}>Updated {lastRefresh.toLocaleTimeString()}</span>}
          </p>
        </div>
        <button onClick={fetchData} className="btn btn-ghost btn-sm">↻ Refresh</button>
      </div>
      
      {/* Energy Forecasting & Progress */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="glass-card forecasting-card">
          <div className="card-header-flex">
            <h3 className="card-mini-title">⚡ Production Forecast</h3>
            <span className="badge badge-cyan">Next 6 Hours</span>
          </div>
          <div className="forecast-row">
            {Array.from({ length: 6 }).map((_, i) => {
              const future = new Date();
              future.setHours(future.getHours() + i + 1);
              const hour = future.getHours() + future.getMinutes() / 60;
              let intensity = 0;
              if (hour >= 6 && hour <= 18) {
                intensity = Math.sin(((hour - 6) / 12) * Math.PI);
              }
              const pct = Math.round(intensity * 100);
              return (
                <div key={i} className="forecast-item">
                  <div className="forecast-time">{future.getHours()}:00</div>
                  <div className="forecast-bar-wrap">
                    <div className="forecast-bar-fill" style={{ height: `${pct}%`, opacity: 0.3 + (pct/100)*0.7 }} />
                  </div>
                  <div className="forecast-pct">{pct}%</div>
                </div>
              );
            })}
          </div>
          <p className="forecast-note">Predicted solar intensity based on orbital mechanics simulation.</p>
        </div>

        <div className="glass-card progress-card">
          <div className="card-header-flex">
            <h3 className="card-mini-title">🌱 Sustainability Rank</h3>
            <span className="badge badge-green">Level {Math.floor((sustainabilityScore || 0) / 100) + 1}</span>
          </div>
          <div className="rank-display">
            <div className="rank-name">
              {!sustainabilityScore ? 'Seedling' :
               sustainabilityScore < 100 ? 'Seedling' : 
               sustainabilityScore < 300 ? 'Sprout' : 
               sustainabilityScore < 600 ? 'Sapling' : 
               sustainabilityScore < 1000 ? 'Tree' : 'Forest Guardian'}
            </div>
            <div className="rank-score">{(sustainabilityScore || 0).toFixed(1)} / {Math.ceil(((sustainabilityScore || 0) + 1) / 100) * 100} PTS</div>
          </div>
          <div className="progress-track" style={{ height: 10, margin: '12px 0' }}>
            <div className="progress-fill" style={{ width: `${((sustainabilityScore || 0) % 100)}%` }} />
          </div>
          <p className="forecast-note">Earn {100 - ((sustainabilityScore || 0) % 100).toFixed(0)} more points to reach next rank.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="glass-card stat-card">
          <div className="stat-card-icon">⚡</div>
          <div className="stat-card-label">Total Output</div>
          <div className="stat-card-value">{totalKwh.toFixed(2)}</div>
          <div className="stat-card-sub">kWh produced now</div>
        </div>
        <div className="glass-card stat-card glass-card-cyan">
          <div className="stat-card-icon">💰</div>
          <div className="stat-card-label">Energy Price</div>
          <div className="stat-card-value stat-card-value-cyan">
            ₹{marketData?.current_price_inr?.toFixed(2) || '—'}
          </div>
          <div className="stat-card-sub">{marketData?.current_price_eth?.toFixed(8) || '—'} ETH / kWh</div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-card-icon">🏭</div>
          <div className="stat-card-label">Active Producers</div>
          <div className="stat-card-value">{activeCount}/{devices.length}</div>
          <div className="stat-card-sub">IoT devices online</div>
        </div>
        <div className="glass-card stat-card glass-card-cyan">
          <div className="stat-card-icon">🌱</div>
          <div className="stat-card-label">Carbon Offset</div>
          <div className="stat-card-value stat-card-value-cyan">{carbonOffset}</div>
          <div className="stat-card-sub">kg CO₂ saved · Score: {(sustainabilityScore || 0).toFixed(1)}</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        {/* Price History */}
        <div className="glass-card chart-card">
          <div className="chart-card-header">
            <h3 className="chart-title">Live Price History</h3>
            <span className="badge badge-green">Real-time</span>
          </div>
          <div className="chart-wrapper">
            {priceHistory.length > 1 ? (
              <Line data={lineData} options={CHART_OPTS} />
            ) : (
              <div className="chart-empty">
                <span>No price data yet — waiting for Firestore sync</span>
              </div>
            )}
          </div>
        </div>

        {/* Energy Mix */}
        <div className="glass-card chart-card">
          <div className="chart-card-header">
            <h3 className="chart-title">Energy by Device</h3>
            <span className="badge badge-cyan">kW</span>
          </div>
          <div className="chart-wrapper" style={{ height: 220 }}>
            {readings.some(r => r.current_power_kw > 0) ? (
              <Doughnut data={doughnutData} options={DOUGHNUT_OPTS} />
            ) : (
              <div className="chart-empty">No production data — start the backend</div>
            )}
          </div>
        </div>
      </div>

      {/* IoT Device Grid */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h2 className="section-title">IoT Device Feed</h2>
        <div className="grid-3">
          {devices.map((device, idx) => {
            const reading = readings.find(r => r.device_id === device.id);
            const isActive = reading && reading.current_power_kw > 0;
            const pct = device.capacity_kw > 0 ? Math.min(100, ((reading?.current_power_kw || 0) / device.capacity_kw) * 100) : 0;
            return (
              <div key={device.id} className={`glass-card device-card ${!isActive ? 'device-offline' : ''}`}>
                <div className="device-card-header">
                  <div>
                    <div className="device-id">{device.id}</div>
                    <div className="device-location">📍 {device.location}</div>
                  </div>
                  <span className={`badge ${isActive ? 'badge-green' : 'badge-gray'}`}>
                    <span className={`dot ${isActive ? 'dot-green' : 'dot-gray'}`} />
                    {isActive ? 'Active' : 'Offline'}
                  </span>
                </div>

                <div className="device-reading">
                  <span className="device-power">{(reading?.current_power_kw || 0).toFixed(2)}</span>
                  <span className="device-power-unit">kW</span>
                </div>

                <div className="progress-track" style={{ marginBottom: 'var(--space-3)' }}>
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>

                <div className="device-meta">
                  <span>Capacity: {device.capacity_kw} kW</span>
                  <span>Eff: {(device.efficiency * 100).toFixed(0)}%</span>
                </div>

                {reading && (
                  <div className="device-weather">
                    {WEATHER_ICONS[reading.weather_condition] || '🌤'}{' '}
                    <span>{reading.weather_condition?.replace('_', ' ')}</span>
                    <span style={{ marginLeft: 'auto' }}>{reading.temperature_celsius?.toFixed(1)}°C</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Analytics Summary */}
      {analytics && (
        <div className="glass-card" style={{ padding: 'var(--space-6)' }}>
          <h2 className="section-title" style={{ marginBottom: 'var(--space-5)' }}>Network Analytics</h2>
          <div className="grid-4">
            <div className="analytics-item">
              <div className="analytics-label">Total Devices</div>
              <div className="analytics-value">{analytics.total_devices}</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-label">Current Production</div>
              <div className="analytics-value">{analytics.current_production_kwh} kWh</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-label">Market Price ETH</div>
              <div className="analytics-value">{analytics.market_price_eth?.toFixed(8)}</div>
            </div>
            <div className="analytics-item">
              <div className="analytics-label">Market Price INR</div>
              <div className="analytics-value">₹{analytics.market_price_inr?.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
