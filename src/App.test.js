import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Text Parser API screen', () => {
  render(<App />);
  const linkElement = screen.getByText(/Text Parser API/i);
  expect(linkElement).toBeInTheDocument();
});
