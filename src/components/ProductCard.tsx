import React, { memo, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import Typography from './Typography';
import type { Product } from '../store/cartSlice';
import { ShoppingCart, Heart, Trash2 } from 'react-feather';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Pill from './Pill';
import { convertPrice, getCurrencySymbol } from '../utils/currencyUtils';
import ErrorBoundary from './ErrorBoundary';

interface ProductCardProps {
  product: Product;
  onAddToCart: () => void;
  onRemoveFromCart?: () => void;
  onAddToWishlist?: () => void;
  isInWishlist?: boolean;
}

const ProductCardContent: React.FC<ProductCardProps> = memo(({ 
  product, 
  onAddToCart,
  onRemoveFromCart,
  onAddToWishlist,
  isInWishlist = false
}) => {
  // Optimize selectors to select only needed data
  const cartItem = useSelector((state: RootState) => 
    state.cart.items.find(item => item.id === product.id)
  );
  const selectedCurrency = useSelector((state: RootState) => state.currency.selectedCurrency);
  const rates = useSelector((state: RootState) => state.currency.rates);
  
  const quantity = cartItem?.quantity || 0;

  const convertedPrice = useMemo(() => 
    convertPrice(product.price, 'USD', selectedCurrency, rates),
    [product.price, selectedCurrency, rates]
  );

  const currencySymbol = useMemo(() => 
    getCurrencySymbol(selectedCurrency),
    [selectedCurrency]
  );

  // Memoize event handlers
  const handleAddToCart = useCallback(() => {
    onAddToCart();
  }, [onAddToCart]);

  const handleRemoveFromCart = useCallback(() => {
    onRemoveFromCart?.();
  }, [onRemoveFromCart]);

  const handleAddToWishlist = useCallback(() => {
    onAddToWishlist?.();
  }, [onAddToWishlist]);

  return (
    <Card>
      <ImageContainer>
        <ProductImage src={product.image} alt={product.title} $category={product.category} />
        <ButtonsContainer>
          <IconButton onClick={handleAddToCart} data-testid="add-to-cart-button">
            <CartIconWrapper>
              <ShoppingCart size={18} />
              {quantity > 0 && (
                <CartPillWrapper>
                  <Pill>{quantity}</Pill>
                </CartPillWrapper>
              )}
            </CartIconWrapper>
          </IconButton>
          {onRemoveFromCart && (
            <IconButton onClick={handleRemoveFromCart}>
              <Trash2 size={18} />
            </IconButton>
          )}
          {onAddToWishlist && (
            <IconButton onClick={handleAddToWishlist} $isActive={isInWishlist} data-testid="add-to-wishlist-button">
              <Heart 
                size={18} 
                fill={isInWishlist ? "#C09578" : "transparent"} 
                stroke="currentColor"
              />
            </IconButton>
          )}
        </ButtonsContainer>
      </ImageContainer>
      <Content>
        <TopContent>
          <Typography fontSize="14px" color="#5A5A5A">
            {product.category}
          </Typography>
          <Typography fontSize="14px" color="#212121">
            {product.title}
          </Typography>
        </TopContent>
        <Typography fontSize="18px" fontWeight="bold" color="#C09578">
          {currencySymbol}{convertedPrice}
        </Typography>
      </Content>
    </Card>
  );
});

const Card = styled.div`
  background: white;
  border: 1px solid #ddd;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .buttons-container {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  padding-top: 100%;
`;

const ProductImage = styled.img<{ $category?: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${props => props.$category === 'jewelery' ? '55%' : '100%'};
  height: ${props => props.$category === 'jewelery' ? '55%' : '100%'};
  object-fit: contain;
  padding: 1rem;
`;

const ButtonsContainer = styled.div.attrs({ className: 'buttons-container' })`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
`;

const IconButton = styled.button<{ $isActive?: boolean }>`
  background-color: white;
  color: #212121;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, background-color 0.2s, color 0.2s;
  color: ${props => props.$isActive ? '#C09578' : '#666'};

  &:hover {
    background-color: #C09578;
    color: white;
    transform: scale(1.1);
  }
`;

const CartIconWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CartPillWrapper = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 1;
`;

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-bottom: 1rem;
`;

const Content = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

const ProductCard: React.FC<ProductCardProps> = (props) => (
  <ErrorBoundary>
    <ProductCardContent {...props} />
  </ErrorBoundary>
);

export default ProductCard;
