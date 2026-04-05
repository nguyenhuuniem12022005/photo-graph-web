import { render, screen } from '@testing-library/react';
import App from './App';

test('renders top bar title', () => {
  window.history.pushState({}, "Test page", "/users");
  render(<App />);
  const titleElement = screen.getByText(/your name/i);
  expect(titleElement).toBeInTheDocument();
});
