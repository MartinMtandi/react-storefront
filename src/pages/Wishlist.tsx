import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { ShoppingCart, Trash2 } from 'react-feather';
import { RootState } from '../store';
import { removeFromWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';
import { convertPrice, getCurrencySymbol } from '../utils/currencyUtils';
import StarRating from '../components/StarRating';

const Wishlist: React.FC = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const { selectedCurrency, rates } = useSelector((state: RootState) => state.currency);
  const currencySymbol = getCurrencySymbol(selectedCurrency);

  const handleRemoveFromWishlist = (productId: number) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (product: any) => {
    dispatch(addToCart(product));
    dispatch(removeFromWishlist(product.id));
  };

  return (
    <WishlistContainer>
      <WishlistContent>
        {wishlistItems.length === 0 ? (
          <EmptyWishlist>Your wishlist is empty</EmptyWishlist>
        ) : (
          <>
            {wishlistItems.map(item => (
              <WishlistItem key={item.id}>
                <ProductImage src={item.image} alt={item.title} />
                <ProductInfo>
                  <h3>{item.title}</h3>
                  <StarRating rating={item.rating.rate} />
                  <ButtonGroup>
                    <ActionButton onClick={() => handleAddToCart(item)} variant="primary">
                      <ShoppingCart size={16} />
                      Add to Cart
                    </ActionButton>
                    <ActionButton variant="danger" onClick={() => handleRemoveFromWishlist(item.id)}>
                      <Trash2 size={16} />
                      Remove
                    </ActionButton>
                  </ButtonGroup>
                </ProductInfo>
                <p>{currencySymbol}{convertPrice(item.price, 'USD', selectedCurrency, rates).toFixed(2)}</p>
              </WishlistItem>
            ))}
          </>
        )}
      </WishlistContent>
    </WishlistContainer>
  );
};

const WishlistContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const WishlistContent = styled.div`
  background: white;
  border: 1px solid #ddd;
  min-height: 400px;
`;

const EmptyWishlist = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  font-size: 1.2rem;
  color: #5A5A5A;
`;

const WishlistItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;

  p {
    margin: 0;
    font-size: 14px;
    color: #C09578;
    font-weight: bold;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ProductImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
`;

const ProductInfo = styled.div`
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    color: #212121;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  display: flex;
  background-color: transparent;
  align-items: center;
  gap: 4px;
  padding: 10px 0px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  transition: opacity 0.2s;
  text-decoration: underline;
  font-size: 14px;

  &:hover {
    color: ${props => props.variant === 'danger' ? '#C09578' : '#212121'};
  }
`;

export default Wishlist;
