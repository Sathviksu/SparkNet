import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LandingPage from '../components/LandingPage';
import axios from 'axios';

jest.mock('axios');

describe('LandingPage', () => {
  test('renders hero title and call to action', () => {
    axios.get.mockResolvedValue({ data: { success: true, market_data: {}, summary: {} } });

    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/Trade Solar Energy/i)).toBeInTheDocument();
    expect(screen.getByText(/Peer-to-Peer/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Start Trading/i)[0]).toBeInTheDocument();
  });

  test('renders key features', () => {
    render(
      <BrowserRouter>
        <LandingPage />
      </BrowserRouter>
    );

    expect(screen.getByText(/IoT-Powered Data/i)).toBeInTheDocument();
    expect(screen.getByText(/Blockchain Trading/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Analytics/i)).toBeInTheDocument();
  });
});
