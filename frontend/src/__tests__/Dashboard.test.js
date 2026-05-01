import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import { AuthProvider } from '../context/AuthContext';
import { SustainabilityProvider } from '../context/SustainabilityContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');

// Mock Firebase
jest.mock('../firebase/auth', () => ({
  onAuthStateChanged: jest.fn((cb) => {
    cb({ uid: '123', email: 'test@example.com' });
    return () => {};
  }),
}));

jest.mock('../firebase/firestore', () => ({
  getUser: jest.fn().mockResolvedValue({ id: '123', email: 'test@example.com', role: 'consumer' }),
  subscribeToPriceHistory: jest.fn((cb) => {
    cb([{ price_inr: 5, timestamp: Date.now() }]);
    return () => {};
  }),
  savePricePoint: jest.fn(),
}));

// Mock Chart.js to avoid rendering issues in tests
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart" />,
  Doughnut: () => <div data-testid="doughnut-chart" />,
}));

const MockWrapper = ({ children }) => (
  <AuthProvider>
    <SustainabilityProvider>
      {children}
    </SustainabilityProvider>
  </AuthProvider>
);

describe('Dashboard', () => {
  test('renders KPI cards and loading state', async () => {
    axios.get.mockImplementation((url) => {
      if (url.includes('/devices')) return Promise.resolve({ data: { success: true, devices: [] } });
      if (url.includes('/readings/current')) return Promise.resolve({ data: { success: true, readings: [] } });
      if (url.includes('/market/data')) return Promise.resolve({ data: { success: true, market_data: { current_price_inr: 5.5 } } });
      if (url.includes('/analytics/summary')) return Promise.resolve({ data: { success: true, summary: {} } });
      return Promise.reject(new Error('not found'));
    });

    render(
      <MockWrapper>
        <Dashboard />
      </MockWrapper>
    );

    // Should show spinner initially
    expect(document.querySelector('.spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Total Output/i)).toBeInTheDocument();
      expect(screen.getByText(/₹5.50/i)).toBeInTheDocument();
      expect(screen.getByText(/Carbon Offset/i)).toBeInTheDocument();
    });
  });

  test('renders charts after loading', async () => {
    render(
      <MockWrapper>
        <Dashboard />
      </MockWrapper>
    );

    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });
});
