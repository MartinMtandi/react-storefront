import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ProductCard from '../components/ProductCard';
import cartReducer from '../store/cartSlice';
import currencyReducer from '../store/currencySlice';

const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 99.99,
  description: 'Test description',
  category: 'electronics',
  image: 'test-image.jpg',
  rating: { rate: 4.5, count: 100 }
};

const renderWithRedux = (component: React.ReactNode) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      currency: currencyReducer
    }
  });

  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const onAddToCart = vi.fn();
    renderWithRedux(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.title)).toHaveAttribute('src', mockProduct.image);
  });

  it('handles add to cart action', () => {
    const onAddToCart = vi.fn();
    renderWithRedux(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);

    const addToCartButton = screen.getByTestId('add-to-cart-button');
    fireEvent.click(addToCartButton);

    expect(onAddToCart).toHaveBeenCalled();
  });

  it('handles wishlist functionality when provided', () => {
    const onAddToCart = vi.fn();
    const onAddToWishlist = vi.fn();
    
    renderWithRedux(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={onAddToCart}
        onAddToWishlist={onAddToWishlist}
        isInWishlist={false}
      />
    );

    const wishlistButton = screen.getByTestId('add-to-wishlist-button');
    fireEvent.click(wishlistButton);

    expect(onAddToWishlist).toHaveBeenCalled();
  });
});
