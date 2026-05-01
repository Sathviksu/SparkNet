# Blockchain Dockerfile
FROM node:20

WORKDIR /app/blockchain

# Copy package files
COPY package*.json ./

# Install dependencies and curl
RUN apt-get update && apt-get install -y curl && npm install

# Copy the rest of the blockchain code
COPY . .

# Expose Hardhat port
EXPOSE 8545

# Start Hardhat node on 0.0.0.0 to be accessible outside the container
CMD ["npx", "hardhat", "node", "--hostname", "0.0.0.0"]
