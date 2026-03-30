import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import FoodList from './FoodList';

// Mock the global fetch
global.fetch = jest.fn();

const mockFoodsData = {
  success: true,
  data: [
    {
      _id: '1',
      name: 'Burger',
      description: 'Cheesy beef burger',
      category: 'Fast Food',
      price: 15.99,
      image: 'burger.jpg'
    },
    {
      _id: '2',
      name: 'Salad',
      description: 'Fresh green salad',
      category: 'Healthy',
      price: 10.50,
      image: 'salad.jpg'
    }
  ]
};

describe('FoodList Component', () => {
  beforeEach(() => {
    fetch.mockClear();
    localStorage.clear();
  });

  test('renders food products correctly', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockFoodsData),
      })
    );

    render(<FoodList />);

    // Should show loading initially
    expect(screen.getByText(/Loading products.../i)).toBeInTheDocument();

    // Wait for the foods to be displayed
    await waitFor(() => {
      expect(screen.getByText('Burger')).toBeInTheDocument();
      expect(screen.getByText('Salad')).toBeInTheDocument();
    });

    expect(screen.getByText('$15.99')).toBeInTheDocument();
    expect(screen.getByText('$10.5')).toBeInTheDocument();
  });

  test('toggles the add food form correctly', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, data: [] }),
      })
    );

    render(<FoodList />);

    // Wait for the components to load and loading state to disappear
    await waitFor(() => {
      expect(screen.queryByText(/Loading products.../i)).not.toBeInTheDocument();
    });

    const addButton = screen.getByText('+ Add Food');
    fireEvent.click(addButton);

    expect(screen.getByText('Add New Food Item')).toBeInTheDocument();
    expect(screen.getByLabelText(/Food Name/i)).toBeInTheDocument();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(screen.queryByText('Add New Food Item')).not.toBeInTheDocument();
  });

  test('shows error message on fetch failure', async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: false, message: 'Failed to fetch' }),
      })
    );

    render(<FoodList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });
});
