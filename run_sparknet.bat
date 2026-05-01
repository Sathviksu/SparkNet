@echo off
echo ============================================================
echo   ⚡ SPARKNET - STARTING ALL SYSTEMS ⚡
echo ============================================================

:: 1. Start Hardhat Node
echo ⛓️ Starting Hardhat Blockchain Node...
start "SparkNet-Blockchain" cmd /k "cd blockchain && npx hardhat node"

:: 2. Start Backend
echo 🐍 Starting Flask Backend...
start "SparkNet-Backend" cmd /k "cd backend && python app.py"

:: 3. Start Frontend
echo ⚛️ Starting React Frontend...
start "SparkNet-Frontend" cmd /k "cd frontend && npm start"

echo.
echo ⏳ Waiting 10 seconds for Blockchain Node to initialize...
ping 127.0.0.1 -n 11 > nul

:: 4. Deploy Contracts
echo 📜 Deploying Smart Contracts...
cd blockchain && npx hardhat run scripts/deploy.js --network localhost && cd ..

echo.
echo ============================================================
echo   🚀 ALL SYSTEMS GO! 🚀
echo.
echo   - Frontend:  http://localhost:3000
echo   - Backend:   http://localhost:5000
echo   - Blockchain: Local node running on port 8545
echo ============================================================
pause
