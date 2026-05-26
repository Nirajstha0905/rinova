import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
});

test('renders rinova creation login form', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  expect(screen.getByText(/consultancy and education management system/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /phase 1 mvp/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
});

test('authenticates a demo user and shows protected crm dashboard', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'admin@rinovacreation.com' },
  });
  fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
    target: { value: 'demo-password' },
  });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

  expect(screen.getByText(/consultancy admin/i)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  expect(screen.getByText(/total students/i)).toBeInTheDocument();
});

test('opens phase one lead management module', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /consultancy admin/i }));
  fireEvent.click(screen.getByRole('button', { name: /leads/i }));

  expect(screen.getByRole('heading', { name: /leads/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /prospective students/i })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /convert/i })).toHaveLength(3);
});
