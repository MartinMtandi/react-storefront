import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Search, ShoppingCart } from 'react-feather';
import Divider from './Divider';
import Typography from './Typography';
import Pill from './Pill';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';
import { convertPrice, getCurrencySymbol } from '../utils/currencyUtils';

interface SearchboxProps {
  placeholder?: string;
  onSearch?: (searchTerm: string) => void;
}

const Searchbox: React.FC<SearchboxProps> = ({
  placeholder = 'Search products...',
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { selectedCurrency, rates } = useSelector((state: RootState) => state.currency);

  const cartTotalUSD = useMemo(() =>
    cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0),
    [cartItems]
  );

  const cartTotal = useMemo(() =>
    convertPrice(cartTotalUSD, 'USD', selectedCurrency, rates),
    [cartTotalUSD, selectedCurrency, rates]
  );

  const itemCount = useMemo(() =>
    cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [cartItems]
  );

  const currencySymbol = useMemo(() =>
    getCurrencySymbol(selectedCurrency),
    [selectedCurrency]
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (onSearch) {
        onSearch(searchTerm);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, onSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSearchClick = useCallback(() => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  }, [onSearch, searchTerm]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(searchTerm);
    }
  }, [onSearch, searchTerm]);

  const handleClear = useCallback(() => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  }, [onSearch]);

  return (
    <GTXSearch>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {searchTerm && (
          <ClearButton onClick={handleClear} aria-label="clear">
            ×
          </ClearButton>
        )}
        <SearchButton onClick={handleSearchClick}>
          <SearchIcon />
        </SearchButton>
      </SearchContainer>
      <CartLink to="/cart">
        <CartDisplay>
          <CartPillWrapper>
            <Pill>{itemCount}</Pill>
          </CartPillWrapper>
          <IconWrapper $borderStyle="none">
            <ShoppingCartIcon />
          </IconWrapper>
          <Divider height="36px" />
          <Spacer>
            <Typography fontSize={"14px"}>{currencySymbol}{cartTotal.toFixed(2)}</Typography>
          </Spacer>
        </CartDisplay>
      </CartLink>
    </GTXSearch>
  );
};

const GTXSearch = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

const CartLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover {
    opacity: 0.8;
  }
`;

const CartDisplay = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid #ddd;
  position: relative;
  transition: opacity 0.2s;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  position: relative;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  padding: 14px 16px;
  font-size: 14px;
  color: #5A5A5A;

  &::placeholder {
    color: #A4A4A4;
  }
`;

const SearchIcon = styled(Search)`
  color: #A4A4A4;
  width: 18px;
  height: 18px;
`;

const ShoppingCartIcon = styled(ShoppingCart)`
  color: #212121;
  width: 18px;
  height: 18px;
`;

const Spacer = styled.div`
  margin: 0 10px;
`;

const IconWrapper = styled.div<{ $borderStyle?: 'none' | 'left' | 'all' }>`
  display: flex;
  align-items: center;
  ${props => {
    switch (props.$borderStyle) {
      case 'left':
        return 'border-left: 1px solid #ddd;';
      case 'all':
        return 'border: 1px solid #ddd;';
      default:
        return 'border: none;';
    }
  }}
  padding: 13.5px;
  cursor: pointer;
`;

const CartPillWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 40px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #666;
  padding: 0 8px;
  
  &:hover {
    color: #333;
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background: none;
  border: none;
  padding: 0 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

export default React.memo(Searchbox);
