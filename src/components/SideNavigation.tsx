import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Typography from './Typography';
import { apiService } from '../services/api';
import { RootState } from '../store';
import { getCurrencySymbol, convertPrice } from '../utils/currencyUtils';

interface PriceRange {
  min: number;
  max: number;
}

interface SideNavigationProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  priceRange: PriceRange;
  onPriceRangeChange: (range: PriceRange) => void;
  priceRangeLimits: PriceRange;
}

const SideNavigation: React.FC<SideNavigationProps> = ({
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  priceRangeLimits
}) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCurrency, rates } = useSelector((state: RootState) => state.currency);
  const currencySymbol = getCurrencySymbol(selectedCurrency);
  
  // Convert price range limits to current currency
  const minDisplayPrice = Math.round(convertPrice(priceRangeLimits.min, 'USD', selectedCurrency, rates));
  const maxDisplayPrice = Math.round(convertPrice(priceRangeLimits.max, 'USD', selectedCurrency, rates));
  
  const [localPriceRange, setLocalPriceRange] = useState({
    min: minDisplayPrice,
    max: maxDisplayPrice
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService.getCategories();
        setCategories(['all', ...data]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    // Update local price range when currency changes
    const convertedMin = Math.round(convertPrice(priceRange.min, 'USD', selectedCurrency, rates));
    const convertedMax = Math.round(convertPrice(priceRange.max, 'USD', selectedCurrency, rates));
    setLocalPriceRange({
      min: convertedMin,
      max: convertedMax
    });
  }, [priceRange, selectedCurrency, rates]);

  const handlePriceChange = (value: [number, number]) => {
    const [min, max] = value;
    setLocalPriceRange({ min, max });

    // Convert back to USD for filtering
    const minUSD = Math.round(convertPrice(min, selectedCurrency, 'USD', rates));
    const maxUSD = Math.round(convertPrice(max, selectedCurrency, 'USD', rates));
    onPriceRangeChange({ min: minUSD, max: maxUSD });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    let newSelectedCategories: string[];

    if (category === 'all') {
      if (checked) {
        newSelectedCategories = ['all'];
      } else {
        newSelectedCategories = [];
      }
    } else {
      if (checked) {
        newSelectedCategories = [...selectedCategories.filter(cat => cat !== 'all'), category];
      } else {
        newSelectedCategories = selectedCategories.filter(cat => cat !== category);
      }
    }

    onCategoryChange(newSelectedCategories);
  };

  if (loading) {
    return <LoadingText>Loading categories...</LoadingText>;
  }

  return (
    <NavContainer>
      <Section>
        <Typography fontWeight={500}>Categories</Typography>
        <CategoryList>
          {categories.map(category => (
            <CategoryItem key={category}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={(e) => handleCategoryChange(category, e.target.checked)}
                />
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </label>
            </CategoryItem>
          ))}
        </CategoryList>
      </Section>

      <Section>
        <Typography fontWeight={500}>Price Range ({selectedCurrency} {currencySymbol})</Typography>
        <PriceRangeContainer>
          <RangeValues>
            <span>{currencySymbol}{localPriceRange.min}</span>
            <span>{currencySymbol}{localPriceRange.max}</span>
          </RangeValues>
          <RangeSliderContainer>
            <RangeSlider
              type="range"
              min={minDisplayPrice}
              max={maxDisplayPrice}
              value={localPriceRange.min}
              onChange={(e) => handlePriceChange([Number(e.target.value), localPriceRange.max])}
            />
            <RangeSlider
              type="range"
              min={minDisplayPrice}
              max={maxDisplayPrice}
              value={localPriceRange.max}
              onChange={(e) => handlePriceChange([localPriceRange.min, Number(e.target.value)])}
            />
          </RangeSliderContainer>
        </PriceRangeContainer>
      </Section>
    </NavContainer>
  );
};

const NavContainer = styled.nav`
  background: #FFFFFF;
  border: 1px solid #ddd;
  width: 100%;
  padding: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CategoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
`;

const CategoryItem = styled.li`
  margin: 0.5rem 0;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 14px;
    color: #5A5A5A;

    input[type="checkbox"] {
      margin: 0;
      appearance: none;
      width: 16px;
      height: 16px;
      border: 2px solid #ddd;
      border-radius: 3px;
      cursor: pointer;
      position: relative;

      &:checked {
        background-color: #C09578;
        border-color: #C09578;

        &:after {
          content: '';
          position: absolute;
          left: 3px;
          top: 0px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
      }

      &:hover {
        border-color: #C09578;
      }
    }
  }
`;

const PriceRangeContainer = styled.div`
  margin-top: 1rem;
`;

const RangeValues = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #5A5A5A;
  font-size: 14px;
`;

const RangeSliderContainer = styled.div`
  position: relative;
  height: 40px;
`;

const RangeSlider = styled.input`
  position: absolute;
  width: 100%;
  height: 2px;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #C09578;
    cursor: pointer;
    margin-top: -7px;
    pointer-events: all;
    position: relative;
    -webkit-appearance: none;
  }

  &::-moz-range-thumb {
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: #C09578;
    cursor: pointer;
    border: none;
    pointer-events: all;
    position: relative;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 2px;
    background: #ddd;
  }

  &::-moz-range-track {
    width: 100%;
    height: 2px;
    background: #ddd;
  }

  &:focus {
    outline: none;
  }
`;

const LoadingText = styled.div`
  padding: 1rem;
  color: #5A5A5A;
  font-size: 14px;
`;

export default SideNavigation;
