# ⚡ SparkNet - Premium IoT Energy Trading Platform

A production-grade decentralized peer-to-peer energy trading platform. SparkNet combines real-time IoT sensor telemetry, automated market simulations, Ethereum smart contracts, and a high-performance React UI to enable seamless green energy trading.

![React](https://img.shields.io/badge/React-18.2-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-white)
![Firebase](https://img.shields.io/badge/Firebase-9.0-orange)
![Jest](https://img.shields.io/badge/Jest-Tests-green)

---

## 🌟 Premium Features

### 🎨 State-of-the-Art UI/UX
- **Dark-Mode First**: Premium aesthetic using a curated `#070B14` palette with electric neon accents.
- **Glassmorphism**: Modern frosted-glass design system with real-time blur and depth.
- **Dynamic Animations**: Smooth transitions, pulsing status indicators, and animated SVG backgrounds.
- **Fully Responsive**: Optimized for desktop, tablet, and mobile viewports.

### 🛡️ Secure Infrastructure
- **Firebase Auth**: Production-ready authentication replacing insecure mock systems.
- **Firestore Real-time DB**: Live synchronization of transaction history, price trends, and user profiles.
- **On-Chain Logic**: ERC-20 Energy Tokens and ERC-721 Producer NFTs ensure immutable ownership and transparency.

### 📊 Real-time Data Visualization
- **Live Price Charts**: Animated `Chart.js` integration showing real-time market fluctuations.
- **IoT Telemetry Grid**: 5 simulated solar installations across India feeding live production data.
- **Sustainability Score**: Gamified impact tracking based on clean energy trading volume.

### 🧪 Comprehensive Testing Suite
- **Frontend**: Unit and integration tests using **Jest** and **React Testing Library**.
- **Backend**: API endpoint validation using **pytest**.
- **Blockchain**: Smart contract security and logic tests using **Hardhat** & **Chai**.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, ethers.js v6, Chart.js, Firebase SDK |
| **Backend** | Python Flask, Flask-CORS, IoT Simulation Engine |
| **Blockchain** | Solidity 0.8.24, Hardhat, OpenZeppelin |
| **Database** | Firebase Firestore (Cloud persistence) |
| **Auth** | Firebase Auth (JWT based) |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SPARKNET ECOSYSTEM                      │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │◀───▶│   Firebase   │◀───▶│  Blockchain  │
│   (React)    │     │ (Auth/Store) │     │  (Hardhat)   │
└──────────────┘     └──────────────┘     └──────────────┘
       ▲                    ▲                    ▲
       │             ┌──────┴──────┐             │
       └────────────▶│   Backend   │◀────────────┘
                     │   (Flask)    │
                     └──────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MetaMask browser extension
- Firebase Project (Free tier)

### 1. Firebase Setup
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable **Email/Password** Authentication.
3. Create a **Firestore** database in test mode.
4. Create `.env` in `frontend/` with your config:
```env
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 2. Blockchain Setup
```bash
cd blockchain
npm install
npx hardhat node
# In new terminal
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python app.py
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 🧪 Running Tests

### Frontend (Jest)
```bash
cd frontend
npm test
```

### Backend (Pytest)
```bash
cd backend
pytest
```

### Smart Contracts (Hardhat)
```bash
cd blockchain
npx hardhat test
```

---

## 📄 License
MIT License - SparkNet IoTopia 2025
