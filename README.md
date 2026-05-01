# ⚡ SparkNet: Decentralized Energy Trading Platform

[![Blockchain: Polygon Amoy](https://img.shields.io/badge/Blockchain-Polygon%20Amoy-8247E5?style=for-the-badge&logo=polygon&logoColor=white)](https://amoy.polygonscan.com/)
[![Frontend: React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Backend: Flask](https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![Database: Firebase](https://img.shields.io/badge/Database-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

**SparkNet** is a production-grade decentralized energy marketplace that empowers users to trade renewable energy (solar) directly using blockchain technology. It features real-time IoT simulation, NFT producer credentials, and a gamified sustainability leaderboard.

---

## 🌟 Key Features

### 🏦 Decentralized Marketplace
- Buy and sell energy tokens (ENERGY) at fair market rates (₹5/kWh).
- Real-time price tracking with ETH/INR conversion.
- Automated peer-to-peer trading via Smart Contracts.

### ☀️ IoT Solar Simulation
- Live telemetry simulation of solar panels across multiple Indian cities.
- Weather-aware production forecasting using orbital mechanics simulation.
- Temperature and sunlight intensity impact on energy yields.

### 🏆 Sustainability & Gamification
- **Leaderboard**: Rank up based on your green energy impact.
- **Ranks**: Seedling → Sprout → Green Knight → Forest Guardian.
- **Achievements**: Earn "Elite" and "Pro" badges for trading milestones.

### 🔐 Secure & Modern Auth
- Google One-Tap Login integrated with Firebase.
- Role-based access for Producers (Sellers) and Consumers (Buyers).
- NFT-backed producer verification.

---

## 🛠 Tech Stack

- **Blockchain**: Solidity, Hardhat, Ethers.js (Polygon Amoy Testnet).
- **Frontend**: React.js, Glassmorphism CSS, Framer Motion animations.
- **Backend**: Python, Flask, Gunicorn (Production server).
- **Services**: Firebase Auth, Firestore (Real-time data).
- **Infrastructure**: Docker, Docker Compose, Vercel, Render.

---

## 📂 Project Structure

```text
sparknet-iotopia-2025/
├── blockchain/          # Smart contracts (Solidity) & Hardhat scripts
├── backend/             # Flask IoT simulation engine
├── frontend/            # React dashboard & Marketplace UI
└── docker-compose.yml   # Full-stack orchestration
```

---

## 🚀 Getting Started

### 🐳 Running with Docker (Recommended)
1. Ensure Docker Desktop is running.
2. Clone the repo and run:
   ```bash
   docker-compose up --build
   ```
3. Access the dashboard at `http://localhost:3000`.

### 💻 Local Development
1. **Blockchain**: `cd blockchain && npx hardhat node`
2. **Backend**: `cd backend && python app.py`
3. **Frontend**: `cd frontend && npm start`

---

## 🌍 Deployment

### ⛓ Smart Contracts
Deployed on **Polygon Amoy**:
- **EnergyToken**: `0x0d12E81e9dbc888123143d9A1C58342E472EEdA4`
- **ProducerNFT**: `0xc385D7E60A77593CD6401Abf64411eBd7dfa3392`

### ⚛️ Frontend (Vercel)
The frontend is hosted on Vercel with automated GitHub CI/CD.

### 🐍 Backend (Render)
The simulation engine is hosted on Render using a Gunicorn production server.

---

## 🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request for any feature additions or bug fixes.

## 📄 License
This project is licensed under the MIT License.
