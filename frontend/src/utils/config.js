// Network Configuration Helper
// ----------------------------

export const NETWORKS = {
  localhost: {
    chainId: 31337,
    name: 'Hardhat Local',
    rpcUrl: 'http://127.0.0.1:8545',
    explorer: '',
  },
  amoy: {
    chainId: 80002,
    name: 'Polygon Amoy',
    rpcUrl: process.env.REACT_APP_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology',
    explorer: 'https://amoy.polygonscan.com',
  },
};

export const getActiveNetwork = () => {
  const chainId = parseInt(process.env.REACT_APP_CHAIN_ID || '31337');
  if (chainId === 80002) return NETWORKS.amoy;
  return NETWORKS.localhost;
};
