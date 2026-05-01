import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MarketPlace from '../components/MarketPlace';
import { Web3Provider } from '../context/Web3Context';
import { AuthProvider } from '../context/AuthContext';
import { SustainabilityProvider } from '../context/SustainabilityContext';
import axios from 'axios';
import { ethers } from 'ethers';

jest.mock('axios');
jest.mock('ethers');

// Mock Firebase
jest.mock('../firebase/auth', () => ({
  onAuthStateChanged: jest.fn((cb) => {
    cb({ uid: '123' });
    return () => {};
  }),
}));

jest.mock('../firebase/firestore', () => ({
  getUser: jest.fn().mockResolvedValue({ id: '123', role: 'consumer' }),
  subscribeToUserTransactions: jest.fn((uid, cb) => {
    cb([]);
    return () => {};
  }),
  saveTransaction: jest.fn(),
}));

// Mock Hooks
jest.mock('../hooks/useContracts', () => ({
  useContracts: () => ({
    erc20: {
      balanceOf: jest.fn().mockResolvedValue(ethers.parseEther('100')),
      getTokenPriceETH: jest.fn().mockResolvedValue(ethers.parseEther('0.0001')),
      buyTokens: jest.fn().mockResolvedValue({ wait: jest.fn().mockResolvedValue({ hash: '0x123' }) }),
      runner: { provider: { getBalance: jest.fn().mockResolvedValue(ethers.parseEther('1.0')) } }
    },
    connected: true
  })
}));

const MockWrapper = ({ children }) => (
  <AuthProvider>
    <Web3Provider>
      <SustainabilityProvider>
        {children}
      </SustainabilityProvider>
    </Web3Provider>
  </AuthProvider>
);

describe('MarketPlace', () => {
  test('renders marketplace title and balances', async () => {
    axios.get.mockResolvedValue({ data: { success: true, summary: {} } });

    render(
      <MockWrapper>
        <MarketPlace />
      </MockWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Energy Marketplace/i)).toBeInTheDocument();
      expect(screen.getByText(/100.0000 kWh/i)).toBeInTheDocument();
    });
  });

  test('calculates cost based on input', async () => {
    render(
      <MockWrapper>
        <MarketPlace />
      </MockWrapper>
    );

    const input = screen.getByPlaceholderText(/e.g. 100/i);
    fireEvent.change(input, { target: { value: '50' } });

    await waitFor(() => {
      expect(screen.getByText(/0.00500000 ETH/i)).toBeInTheDocument();
    });
  });
});
