import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../components/LoginPage';
import { AuthProvider } from '../context/AuthContext';

// Mock Firebase Auth
jest.mock('../firebase/auth', () => ({
  signInWithEmail: jest.fn(),
  onAuthStateChanged: jest.fn((cb) => {
    cb(null); // Not logged in
    return () => {};
  }),
}));

// Mock Firebase Firestore
jest.mock('../firebase/firestore', () => ({
  getUser: jest.fn(),
  upsertUser: jest.fn(),
}));

const MockWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('LoginPage', () => {
  test('renders login form', () => {
    render(
      <MockWrapper>
        <LoginPage />
      </MockWrapper>
    );
    
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  test('shows error message on failed login', async () => {
    const { signInWithEmail } = require('../firebase/auth');
    signInWithEmail.mockRejectedValueOnce({ code: 'auth/invalid-credential', message: 'Invalid credentials' });

    render(
      <MockWrapper>
        <LoginPage />
      </MockWrapper>
    );

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });
});
