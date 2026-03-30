import { render, screen, waitFor } from '@testing-library/react';
import BillingDetails from './BillingDetails';

// Mock the global fetch
global.fetch = jest.fn();

const mockBillingData = {
  success: true,
  data: [
    {
      _id: '101',
      fullName: 'Alice Johnson',
      email: 'alice@example.com',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      paymentMethod: 'credit_card',
      createdAt: new Date().toISOString()
    },
    {
      _id: '102',
      fullName: 'Bob Smith',
      email: 'bob@example.com',
      address: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      paymentMethod: 'paypal',
      createdAt: new Date().toISOString()
    }
  ]
};

describe('BillingDetails Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  test('renders billing records correctly', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockBillingData),
      })
    );

    render(<BillingDetails />);

    // Should show loading initially
    expect(screen.getByText(/Loading billing details.../i)).toBeInTheDocument();

    // Wait for the records to be displayed
    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });

    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('credit card')).toBeInTheDocument();
    expect(screen.getByText('paypal')).toBeInTheDocument();
  });

  test('shows error message on fetch failure', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false, message: 'Billing API Error' }),
      })
    );

    render(<BillingDetails />);

    await waitFor(() => {
      expect(screen.getByText('Billing API Error')).toBeInTheDocument();
    });
  });

  test('displays "No billing records found" when list is empty', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, data: [] }),
      })
    );

    render(<BillingDetails />);

    await waitFor(() => {
      expect(screen.getByText(/No billing records found/i)).toBeInTheDocument();
    });
  });
});
