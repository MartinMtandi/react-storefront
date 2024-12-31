import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store';
import { convertPrice, getCurrencySymbol } from '../utils/currencyUtils';

const Checkout: React.FC = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { selectedCurrency, rates } = useSelector((state: RootState) => state.currency);
  const navigate = useNavigate();
  
  const subtotalUSD = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const subtotal = convertPrice(subtotalUSD, 'USD', selectedCurrency, rates);
  const shippingUSD = subtotalUSD > 0 ? 10 : 0;
  const shipping = convertPrice(shippingUSD, 'USD', selectedCurrency, rates);
  const total = subtotal + shipping;
  
  const currencySymbol = getCurrencySymbol(selectedCurrency);

  return (
    <CheckoutContainer>
      <h2>Order Summary</h2>
      <SummaryItem>
        <span>Subtotal</span>
        <span>{currencySymbol}{subtotal.toFixed(2)}</span>
      </SummaryItem>
      <SummaryItem>
        <span>Shipping</span>
        <span>{currencySymbol}{shipping.toFixed(2)}</span>
      </SummaryItem>
      <Divider />
      <SummaryItem total>
        <span>Total</span>
        <span>{currencySymbol}{total.toFixed(2)}</span>
      </SummaryItem>
      <CheckoutButton onClick={() => navigate('/checkout')}>
        Proceed to Checkout
      </CheckoutButton>
    </CheckoutContainer>
  )
}

const CheckoutContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border: 1px solid #ddd;

  h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
    color: #212121;
  }
`;

const SummaryItem = styled.div<{ total?: boolean }>`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: ${props => props.total ? '1.2rem' : '1rem'};
  font-weight: ${props => props.total ? 'bold' : 'normal'};
  color: ${props => props.total ? '#212121' : '#5A5A5A'};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 1rem 0;
`;

const CheckoutButton = styled.button`
  width: 100%;
  background-color: #C09578;
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #A67B5B;
  }
`;

export default Checkout;