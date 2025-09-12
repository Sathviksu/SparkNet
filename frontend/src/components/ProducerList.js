import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { useSustainability } from '../context/SustainabilityContext';
import { API_BASE_URL } from '../utils/constants';

const ProducerList = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { energyData, connected } = useRealTimeData();
  const { decreaseScore } = useSustainability();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/devices`);
        if (response.data.success) {
          setDevices(response.data.devices);
        }
      } catch (error) {
        console.error('Error fetching devices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  const enrichedProducers = devices.map(device => {
    const currentReading = energyData.readings.find(r => r.device_id === device.id);
    return {
      ...device,
      currentReading,
      isOnline: connected && currentReading && currentReading.current_power_kw > 0,
    };
  });

  const handleSell = (amount) => {
    decreaseScore(amount);
    alert(`Successfully sold ${amount.toFixed(2)} kWh of energy! Your sustainability score has been updated.`);
  };

  if (loading) {
    return <div className="loading-message">Loading solar producers...</div>;
  }

  return (
    <div className="producer-list">
      <div className="section-header">
        <h2>Solar Energy Producers</h2>
        <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? 'Live Data Feed' : 'Feed Disconnected'}
        </div>
      </div>

      {enrichedProducers.length === 0 ? (
        <div className="no-producers-message">No solar producers are currently registered.</div>
      ) : (
        <div className="producers-grid">
          {enrichedProducers.map((producer) => (
            <div key={producer.id} className={`producer-card ${!producer.isOnline ? 'offline' : ''}`}>
              <div className="producer-header">
                <h3>{producer.name || producer.id}</h3>
                <span className={`status-badge ${producer.isOnline ? 'online' : 'offline'}`}>
                  {producer.isOnline ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="producer-body">
                <div className="producer-info">
                  <p><strong>Location:</strong> {producer.location}</p>
                  <p><strong>Owner:</strong> {producer.owner.substring(0, 15)}...</p>
                  <p><strong>Capacity:</strong> {producer.capacity_kw} kW</p>
                </div>

                {producer.isOnline && producer.currentReading ? (
                  <div className="live-data">
                    <h4>Live Readings</h4>
                    <p><strong>Power:</strong> {producer.currentReading.current_power_kw.toFixed(2)} kW</p>
                    <p><strong>Energy Today:</strong> {producer.currentReading.energy_produced_kwh.toFixed(2)} kWh</p>
                    <p><strong>Weather:</strong> {producer.currentReading.weather_condition}</p>
                  </div>
                ) : (
                  <div className="no-live-data">
                    <p>No live data available</p>
                  </div>
                )}
              </div>

              <div className="producer-footer">
                <button 
                  className="sell-button" 
                  onClick={() => handleSell(producer.currentReading.energy_produced_kwh)}
                  disabled={!producer.isOnline || !producer.currentReading || producer.currentReading.energy_produced_kwh <= 0}
                >
                  Sell Energy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProducerList;
