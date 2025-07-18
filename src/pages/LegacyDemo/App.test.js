import { render, screen } from '@testing-library/react';
import App from './app/App';

test('renders TradeMarkCheck login page', () => {
  render(<App />);
  const headingElement = screen.getByText(/TradeMarkCheck/i);
  expect(headingElement).toBeInTheDocument();
});

test('renders login form', () => {
  render(<App />);
  const emailInput = screen.getByPlaceholderText(/jan.kowalski@example.com/i);
  const passwordInput = screen.getByPlaceholderText(/Wprowadź hasło/i);
  const loginButton = screen.getByText(/Zaloguj się/i);

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(loginButton).toBeInTheDocument();
});
