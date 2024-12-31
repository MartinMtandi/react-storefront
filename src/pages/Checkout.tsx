import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../store';
import { convertPrice, getCurrencySymbol } from '../utils/currencyUtils';
import Typography from '../components/Typography';
import { clearCart } from '../store/cartSlice';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  country: '',
  postalCode: ''
};

const CheckoutPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isProcessing, setIsProcessing] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { selectedCurrency, rates } = useSelector((state: RootState) => state.currency);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subtotalUSD = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  const subtotal = convertPrice(subtotalUSD, 'USD', selectedCurrency, rates);
  const shippingUSD = subtotalUSD > 0 ? 10 : 0;
  const shipping = convertPrice(shippingUSD, 'USD', selectedCurrency, rates);
  const total = subtotal + shipping;
  const currencySymbol = getCurrencySymbol(selectedCurrency);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear cart and redirect to success page
      dispatch(clearCart());
      navigate('/');
      alert('Order placed successfully!');
    } catch (error) {
      alert('Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container>
        <EmptyMessage>
          <Typography fontSize="16px" color="#5A5A5A">Your cart is empty</Typography>
        </EmptyMessage>
      </Container>
    );
  }

  return (
    <Container>
      <CheckoutForm onSubmit={handleSubmit}>
        <FormSection>
          <SectionTitle>Shipping Information</SectionTitle>
          <FormGrid>
            <FormGroup>
              <Label>First Name</Label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Last Name</Label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup fullWidth>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup fullWidth>
              <Label>Address</Label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>City</Label>
              <Input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Country</Label>
              <Input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Postal Code</Label>
              <Input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
          </FormGrid>
        </FormSection>

        <OrderSummary>
          <SectionTitle>Order Summary</SectionTitle>
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
          <CheckoutButton type="submit" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Place Order'}
          </CheckoutButton>
        </OrderSummary>
      </CheckoutForm>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const EmptyMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  background: white;
  border: 1px solid #ddd;
`;

const CheckoutForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  align-items: start;
`;

const FormSection = styled.div`
  background: white;
  padding: 1.5rem;
  border: 1px solid #ddd;
`;

const OrderSummary = styled.div`
  background: white;
  padding: 1.5rem;
  border: 1px solid #ddd;
  position: sticky;
  top: 2rem;
`;

const SectionTitle = styled.h2`
  margin: 0 0 1.5rem;
  font-size: 1.2rem;
  color: #212121;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  grid-column: ${props => props.fullWidth ? '1 / -1' : 'span 1'};
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #5A5A5A;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #C09578;
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

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default CheckoutPage;
