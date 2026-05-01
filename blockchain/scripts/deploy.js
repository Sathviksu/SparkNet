async function main() {
  console.log("🚀 Deploying Energy Trading Contracts...");
  
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(await deployer.provider.getBalance(deployer.address)));
  
  // Deploy EnergyToken with ₹5 per kWh pricing
  console.log("\n📊 Deploying EnergyToken with affordable pricing...");
  
  // Calculate price: ₹5 per kWh
  // Current: 1 ETH = ₹400,871 (approximately)
  // Target: ₹5 per kWh
  // Price per token = 5 ÷ 400,871 = 0.0000125 ETH
  const initialPrice = hre.ethers.parseEther("0.0000125"); // 0.0000125 ETH per kWh token
  
  console.log("💰 Setting price: 0.0000125 ETH per kWh (≈ ₹5.00)");
  
  const EnergyToken = await hre.ethers.getContractFactory("EnergyToken");
  const energyToken = await EnergyToken.deploy(initialPrice);
  await energyToken.waitForDeployment();
  
  const energyTokenAddress = await energyToken.getAddress();
  console.log("✅ EnergyToken deployed to:", energyTokenAddress);
  
  // Deploy ProducerNFT
  console.log("\n🏠 Deploying ProducerNFT...");
  const ProducerNFT = await hre.ethers.getContractFactory("ProducerNFT");
  const producerNFT = await ProducerNFT.deploy();
  await producerNFT.waitForDeployment();
  
  const producerNFTAddress = await producerNFT.getAddress();
  console.log("✅ ProducerNFT deployed to:", producerNFTAddress);
  
  // Authorize demo producers (using valid checksum addresses)
  console.log("\n🔐 Setting up demo producers...");
  
  const demoProducers = [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Hardhat Account #1
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"  // Hardhat Account #2
  ];
  
  if (hre.network.name === "hardhat" || hre.network.name === "localhost") {
    for (const producer of demoProducers) {
      try {
        const tx = await energyToken.authorizeProducer(producer);
        await tx.wait();
        console.log(`✅ Authorized producer: ${producer}`);
      } catch (error) {
        console.log(`❌ Failed to authorize ${producer}:`, error.message);
      }
    }
  } else {
    console.log("⏩ Skipping demo producer authorization on live network.");
  }
  
  // Display pricing info
  const priceInETH = hre.ethers.formatEther(initialPrice);
  const priceInINR = parseFloat(priceInETH) * 400871; // Approximate conversion
  
  // Display summary
  console.log("\n" + "=".repeat(60));
  console.log("🎉 DEPLOYMENT COMPLETE!");
  console.log("=".repeat(60));
  console.log("📊 EnergyToken:", energyTokenAddress);
  console.log("🏠 ProducerNFT:", producerNFTAddress);
  console.log("💰 Token Price:", priceInETH, "ETH");
  console.log("💰 INR Equivalent: ≈ ₹", priceInINR.toFixed(2), "per kWh");
  console.log("🔗 Network:", hre.network.name);
  console.log("=".repeat(60));
  
  // Save addresses for frontend
  const fs = await import('fs');
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    energyToken: energyTokenAddress,
    producerNFT: producerNFTAddress,
    priceETH: priceInETH,
    priceINR: priceInINR.toFixed(2),
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync('./deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Saved deployment info to deployment-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
