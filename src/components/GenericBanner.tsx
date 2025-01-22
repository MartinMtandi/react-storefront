import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Typography from './Typography';
import { useDispatch, useSelector } from 'react-redux';
import { Currency, setCurrency } from '../store/currencySlice';
import { RootState } from '../store';
import Divider from './Divider';
import Dropdown from './Dropdown';

const currencyOptions = [
  { value: 'DIRHAM', label: 'DIRHAM (د.إ)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'PULA', label: 'PULA (P)' },
  { value: 'RAND', label: 'RAND (R)' },
  { value: 'USD', label: 'USD ($)' }
];

const accountOptions = [
  { value: '/cart', label: 'Cart' },
  { value: '/wishlist', label: 'Wishlist' },
  { value: '/checkout', label: 'Checkout' }
];

function GenericBanner() {
  const dispatch = useDispatch();
  const selectedCurrency = useSelector((state: RootState) => state.currency.selectedCurrency);

  const handleCurrencySelect = (currencyCode: string) => {
    dispatch(setCurrency(currencyCode as Currency));
  };

  return (
    <Banner>
      <BannerContainer>
        <Typography fontSize="12px">
          Free shipping on all domestic orders with coupon code{' '}
          <Typography fontWeight={500} color="#C09578">
            StoreCoupon
          </Typography>
        </Typography>
        <AccountLinks>
          <DropdownWrapper>
            <Dropdown
              options={currencyOptions}
              value={selectedCurrency}
              onChange={handleCurrencySelect}
              position="right"
            />
          </DropdownWrapper>
          <Divider $margin="0 16px 0 0" />
          <DropdownWrapper>
            <Dropdown
              options={accountOptions}
              onChange={() => {}}
              label="My Account"
              position="right"
              isNavigationDropdown
            />
          </DropdownWrapper>
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
`;

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
  align-items: center;
`;

const DropdownWrapper = styled.div`
  > div > button {
    border: none;
    padding: 0;
    min-width: auto;
    
    &:hover {
      border: none;
    }
  }
`;

export default GenericBanner;
