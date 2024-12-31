import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Typography from './Typography'
import { ChevronDown } from 'react-feather';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Currency, setCurrency } from '../store/currencySlice';
import { RootState } from '../store';
import Divider from './Divider';

const currencies = [
  { code: 'DIRHAM', symbol: 'د.إ' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'PULA', symbol: 'P'},
  { code: 'RAND', symbol: 'R' },
  { code: 'USD', symbol: '$' }
];

const accountMenuItems = [
  { label: 'Cart', path: '/cart' },
  { label: 'Wishlist', path: '/wishlist' },
  { label: 'Checkout', path: '/checkout' },
];

function GenericBanner() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const selectedCurrency = useSelector((state: RootState) => state.currency.selectedCurrency);
  const currentCurrency = currencies.find(curr => curr.code === selectedCurrency);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCurrencySelect = (currencyCode: string) => {
    dispatch(setCurrency(currencyCode as Currency));
    setIsDropdownOpen(false);
  };

  return (
    <Banner>
      <BannerContainer>
        <Typography fontSize={"12px"}>Free shipping on all domestic orders with coupon code <Typography fontWeight={500} color='#C09578'>DVTCoupon</Typography></Typography>
        <AccountLinks>
          <div ref={dropdownRef}>
            <AccountLink onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Typography fontSize={"12px"}>{currentCurrency?.code} ({currentCurrency?.symbol})</Typography>
              <ChevronIcon size={16} $isOpen={isDropdownOpen} />
            </AccountLink>
            <DropdownMenu $isOpen={isDropdownOpen}>
              {currencies.map((currency) => (
                <DropdownItem
                  key={currency.code}
                  onClick={() => handleCurrencySelect(currency.code)}
                >
                  <Typography fontSize={"12px"}>{currency.code} ({currency.symbol})</Typography>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </div>
          <Divider $margin='0 16px 0 0' />
          <div ref={accountDropdownRef}>
            <AccountLink onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}>
              <Typography fontSize={"12px"}>My Account</Typography>
              <ChevronIcon size={16} $isOpen={isAccountDropdownOpen} />
            </AccountLink>
            <DropdownMenu $isOpen={isAccountDropdownOpen} $position="account">
              {accountMenuItems.map((item) => (
                <DropdownLink 
                  key={item.path} 
                  to={item.path}
                  onClick={() => setIsAccountDropdownOpen(false)}
                >
                  <Typography fontSize={"12px"}>{item.label}</Typography>
                </DropdownLink>
              ))}
            </DropdownMenu>
          </div>
        </AccountLinks>
      </BannerContainer>
    </Banner>
  );
}

const Banner = styled.nav`
  background-color: #FFFFFF;
  padding: 0.9rem;
  border-bottom: 1px solid #ddd;
  position: relative;
`

const BannerContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AccountLinks = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
`;

const AccountLink = styled.button`
  text-decoration: none;
  color: inherit;
  background: none;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  
  &:not(:last-child) {
    margin-right: 1rem;
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean; $position?: string }>`
  position: absolute;
  top: 100%;
  right: ${props => props.$position === 'account' ? '0' : '50%'};
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1000;
  min-width: 120px;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  display: block;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const DropdownLink = styled(Link)`
  width: 100%;
  padding: 8px 16px;
  text-decoration: none;
  color: inherit;
  display: block;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ChevronIcon = styled(ChevronDown)<{ $isOpen: boolean }>`
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.2s ease;
`;


export default GenericBanner;
