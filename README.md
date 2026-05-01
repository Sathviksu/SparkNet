# SparkNet - IoT Energy Trading Platform

A decentralized peer-to-peer energy trading platform that combines IoT sensor data, real-time market simulations, smart contracts, and a web-based UI to enable consumers and producers to trade renewable energy efficiently.

![React](https://img.shields.io/badge/React-18.2-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-white)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Smart Contracts](#smart-contracts)
- [Frontend Features](#frontend-features)
- [Environment Variables](#environment-variables)

---

## 🌟 Overview

SparkNet enables:
- **Producers** to register as solar energy providers and sell energy tokens
- **Consumers** to browse the marketplace and purchase energy with ETH
- **Real-time monitoring** of IoT device energy production
- **Sustainability tracking** of carbon footprint impact

---

## ✨ Features

### Backend
- Real-time IoT solar energy simulation
- Market price dynamics with ETH/INR conversion
- 5 pre-configured demo devices across India

### Blockchain
- ERC20 Energy Token for trading
- ERC721 Producer NFT for producer registration
- Smart contract-based tokenomics

### Frontend
- MetaMask wallet integration
- Real-time energy marketplace
- Producer registration and management
- Dashboard with analytics and charts

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, ethers.js, chart.js |
| Backend | Python Flask, Flask-CORS |
| Blockchain | Solidity 0.8.24, Hardhat |
| Storage | localStorage (frontend) |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SPARKNET ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│    Backend   │────▶│  Blockchain  │
│   (React)    │     │   (Flask)    │     │  (Hardhat)   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
  Web3 Context         SolarSimulator      EnergyToken
  Auth Context         Market Engine       ProducerNFT
  Sustainability       Currency Conv.
```

---

## 📁 Project Structure

```
sparknet-iotopia-2025/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt   # Python dependencies
│   └── README.md          # Backend documentation
│
├── blockchain/
│   ├── contracts/
│   │   ├── EnergyToken.sol    # ERC20 token contract
│   │   └── ProducerNFT.sol    # ERC721 NFT contract
│   ├── scripts/
│   │   └── deploy.js          # Deployment script
│   ├── hardhat.config.cjs     # Hardhat configuration
│   └── deployment-info.json  # Deployed contract addresses
│
└── frontend/
    ├── src/
    │   ├── components/        # React components
    │   ├── context/           # React contexts
    │   ├── hooks/             # Custom hooks
    │   ├── abi/               # Contract ABIs
    │   └── utils/             # Utilities & constants
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- MetaMask browser extension

### 1. Blockchain Setup

```bash
cd blockchain
npm install
npx hardhat node
```

In a new terminal:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

Backend runs at: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs at: `http://localhost:3000`

---

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check with timestamp |
| `/devices` | GET | List all solar devices |
| `/readings/current` | GET | Real-time energy readings |
| `/market/data` | GET | Current price, supply, demand |
| `/currency/eth-inr-rate` | GET | ETH to INR exchange rate |
| `/currency/convert` | GET | Convert ETH ↔ INR |
| `/analytics/summary` | GET | Market analytics summary |

### Sample Response - `/api/market/data`

```json
{
  "price_eth": 0.0000125,
  "price_inr": 5,
  "total_supply": 1000000,
  "total_demand": 750000,
  "active_producers": 5,
  "timestamp": "2025-05-01T12:00:00Z"
}
```

---

## 📜 Smart Contracts

### EnergyToken (ERC20)

**Address:** `0x5FbDB2315678afecb367f032d93F642f64180aa3`

| Function | Description |
|----------|-------------|
| `buyTokens()` | Purchase energy tokens with ETH |
| `produceEnergy()` | Mint tokens (producers only) |
| `updatePrice()` | Adjust token price (owner) |
| `authorizeProducer()` | Register authorized producers |

### ProducerNFT (ERC721)

**Address:** `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`

| Function | Description |
|----------|-------------|
| `registerProducer()` | Register as energy producer (0.01 ETH) |
| `getProducer()` | Get producer metadata by token ID |
| `getOwnerTokens()` | List all NFTs owned by address |

---

## 🖥 Frontend Features

### Authentication
- Email/password login
- Signup with validation
- Persistent sessions via localStorage

### Wallet Connection
- MetaMask integration
- Auto network detection
- Account change handling

### Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | User login |
| `/signup` | User registration |
| `/dashboard` | Analytics & sustainability |
| `/consumer` | Buy energy tokens |
| `/seller` | Sell energy / register producer |

---

## ⚙️ Environment Variables

### Frontend (`frontend/src/utils/constants.js`)

```javascript
export const API_BASE_URL = "http://localhost:5000/api";
export const ERC20_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const ERC721_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const CHAIN_ID = 31337;
export const RPC_URL = "http://localhost:8545";
```

### Backend Configuration

- Default ETH/INR rate: ₹200,000
- Token price: ₹5/kWh (0.0000125 ETH)
- Market update interval: 30 seconds

---

## 📱 Demo Accounts

### Test User
```
Email: user@example.com
Password: password
```

### Demo Solar Devices

| ID | Location | Capacity | Efficiency |
|----|----------|----------|------------|
| SOLAR_001 | Delhi NCR | 5 kW | 18% |
| SOLAR_002 | Mumbai | 7.5 kW | 20% |
| SOLAR_003 | Bangalore | 3.5 kW | 17% |
| SOLAR_004 | Jaipur | 6 kW | 19% |
| SOLAR_005 | Kolkata | 4.5 kW | 16% |

---

## 🔧 Troubleshooting

### MetaMask Connection Issues
- Ensure Hardhat node is running
- Check chain ID matches (31337)
- Add network manually if auto-detect fails

### Backend Connection
- Verify Flask is running on port 5000
- Check CORS settings if experiencing cross-origin errors

### Contract Errors
- Ensure contracts are deployed
- Verify contract addresses in `constants.js`

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👥 Contributors

- [Shubham](https://github.com/shub11-gh)