import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Searchbox from '../components/Searchbox';
import type { ComponentProps } from 'react';
import { Search } from 'react-feather';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../store/productsSlice';
import cartReducer from '../store/cartSlice';
import currencyReducer from '../store/currencySlice';
import wishlistReducer from '../store/wishlistSlice';
import { RootState } from '../store';
import { BrowserRouter } from 'react-router-dom';

type IconProps = ComponentProps<typeof Search> & {
  'data-testid'?: string;
};

// Mock react-feather icons
vi.mock('react-feather', () => ({
  Search: vi.fn().mockImplementation((props: IconProps) => (
    <svg 
      data-testid={props['data-testid']}
      width={props.size} 
      height={props.size}
      fill={props.fill}
      stroke={props.stroke}
    />
  )),
  ShoppingCart: vi.fn().mockImplementation((props: IconProps) => (
    <svg 
      data-testid={props['data-testid']}
      width={props.size} 
      height={props.size}
      fill={props.fill}
      stroke={props.stroke}
    />
  ))
}));

const initialState: RootState = {
  products: {
    products: [],
    loading: false,
    error: null
  },
  cart: {
    items: [],
  },
  currency: {
    selectedCurrency: 'USD',
    rates: {
      USD: 1,
      EUR: 0.85,
      GBP: 0.73,
      PULA: 12.76,
      RAND: 18.95,
      DIRHAM: 3.67
    }
  },
  wishlist: {
    items: []
  }
};

// Create a mock store for testing
const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    currency: currencyReducer,
    wishlist: wishlistReducer
  },
  preloadedState: initialState
});

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <Provider store={store}>
        {ui}
      </Provider>
    </BrowserRouter>
  );
};

describe('Searchbox', () => {
  it('renders search input', () => {
    renderWithProvider(<Searchbox onSearch={() => {}} />);
    expect(screen.getByPlaceholderText(/search products/i)).toBeInTheDocument();
  });

  it('calls onSearch when user types', async () => {
    const onSearch = vi.fn();
    renderWithProvider(<Searchbox onSearch={onSearch} />);

    const searchInput = screen.getByPlaceholderText(/search products/i);
    await userEvent.type(searchInput, 'test');
    await new Promise(resolve => setTimeout(resolve, 300));

    expect(onSearch).toHaveBeenCalledWith('test');
  });

  it('clears input when clear button is clicked', async () => {
    const onSearch = vi.fn();
    renderWithProvider(<Searchbox onSearch={onSearch} />);

    const searchInput = screen.getByPlaceholderText(/search products/i);
    await userEvent.type(searchInput, 'test');

    const clearButton = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(onSearch).toHaveBeenCalledWith('');
  });
});
