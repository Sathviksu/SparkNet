const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SparkNet Smart Contracts", function () {
  let EnergyToken, energyToken;
  let ProducerNFT, producerNFT;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy EnergyToken
    EnergyToken = await ethers.getContractFactory("EnergyToken");
    energyToken = await EnergyToken.deploy();

    // Deploy ProducerNFT
    ProducerNFT = await ethers.getContractFactory("ProducerNFT");
    producerNFT = await ProducerNFT.deploy(await energyToken.getAddress());
  });

  describe("EnergyToken", function () {
    it("Should set the correct owner", async function () {
      expect(await energyToken.owner()).to.equal(owner.address);
    });

    it("Should allow buying tokens", async function () {
      const buyAmount = ethers.parseEther("100");
      const price = await energyToken.getTokenPriceETH();
      const totalCost = (BigInt(buyAmount) * BigInt(price)) / BigInt(ethers.parseEther("1"));

      await energyToken.connect(addr1).buyTokens({ value: totalCost });
      
      const balance = await energyToken.balanceOf(addr1.address);
      // Depending on contract logic, might need to adjust expectation
      expect(balance).to.equal(buyAmount);
    });
  });

  describe("ProducerNFT", function () {
    it("Should register a producer and mint NFT", async function () {
      const fee = ethers.parseEther("0.01");
      await producerNFT.connect(addr1).registerProducer(
        "Location A",
        500, // 5.00 kW
        18,  // 18% efficiency
        "Solar",
        "ipfs://test",
        { value: fee }
      );

      expect(await producerNFT.balanceOf(addr1.address)).to.equal(1);
      const producer = await producerNFT.getProducer(1);
      expect(producer.location).to.equal("Location A");
    });

    it("Should track tokens owned by an address", async function () {
      const fee = ethers.parseEther("0.01");
      await producerNFT.connect(addr1).registerProducer("Loc 1", 100, 10, "Solar", "uri1", { value: fee });
      await producerNFT.connect(addr1).registerProducer("Loc 2", 200, 20, "Wind", "uri2", { value: fee });

      const tokens = await producerNFT.getOwnerTokens(addr1.address);
      expect(tokens.length).to.equal(2);
      expect(tokens[0]).to.equal(1);
      expect(tokens[1]).to.equal(2);
    });
  });
});
