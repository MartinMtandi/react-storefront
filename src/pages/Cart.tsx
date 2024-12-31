import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components'
import { RootState } from '../store'
import { removeFromCart, updateQuantity, Product } from '../store/cartSlice'
import { addToWishlist } from '../store/wishlistSlice'
import Checkout from '../components/Checkout'
import StarRating from '../components/StarRating'
import { convertPrice, getCurrencySymbol } from '../utils/currencyUtils';
import { Plus, Minus, Heart, Trash2 } from 'react-feather';

function Cart() {
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const { selectedCurrency, rates } = useSelector((state: RootState) => state.currency);
  const dispatch = useDispatch()

  const currencySymbol = getCurrencySymbol(selectedCurrency);

  const handleRemoveFromCart = (id: number) => {
    dispatch(removeFromCart(id))
  }

  const handleAddToWishlist = (product: Product) => {
    dispatch(addToWishlist(product));
    dispatch(removeFromCart(product.id));
  };

  return (
    <CartContainer>
      <CartContent>
        {cartItems.length === 0 ? (
          <EmptyCart>Your cart is empty</EmptyCart>
        ) : (
          <>
            {cartItems.map(item => (
              <CartItem key={item.id}>
                <ProductImage src={item.image} alt={item.title} />
                <ProductInfo>
                  <h3>{item.title}</h3>
                  <StarRating rating={item.rating.rate} />
                  <QuantityCounter>
                    <CounterButton onClick={() => dispatch(updateQuantity({ id: item.id, quantity: -1 }))}>
                      <Minus size={16} />
                    </CounterButton>
                    <span>{item.quantity}</span>
                    <CounterButton onClick={() => dispatch(updateQuantity({ id: item.id, quantity: 1 }))}>
                      <Plus size={16} />
                    </CounterButton>
                  </QuantityCounter>
                  <ButtonGroup>
                    <ActionButton variant="wishlist" onClick={() => handleAddToWishlist(item)}>
                      <Heart size={16} />
                      Add to Wishlist
                    </ActionButton>
                    <ActionButton variant="danger" onClick={() => handleRemoveFromCart(item.id)}>
                    <Trash2 size={16} />
                      Remove
                    </ActionButton>
                  </ButtonGroup>
                </ProductInfo>
                <p>{currencySymbol}{convertPrice(item.price, 'USD', selectedCurrency, rates).toFixed(2)}</p>
              </CartItem>
            ))}
          </>
        )}
      </CartContent>
      {cartItems.length > 0 && (
        <CheckoutSection>
          <Checkout />
        </CheckoutSection>
      )}
    </CartContainer>
  )
}

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  align-items: start;
`;

const QuantityCounter = styled.div`
  border: 1px solid #ddd;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 20px;
  width: fit-content;
`;

const CounterButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  
  &:hover {
    color: #000;
  }
`;

const CartContent = styled.div`
  background: white;
  border: 1px solid #ddd;
  min-height: 400px;
`;

const EmptyCart = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  font-size: 1.2rem;
  color: #5A5A5A;
`;

const CheckoutSection = styled.div`
  position: relative;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto auto;
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h3 {
    margin: 0;
    font-size: 16px;
    color: #212121;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 18px;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' | 'wishlist' }>
`
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

  &:hover {
    color: ${props => {
    switch (props.variant) {
      case 'danger':
        return '#C09578';
      case 'wishlist':
        return '#212121';
      default:
        return '#666';
    }
  }};
  }
`;

export default Cart
