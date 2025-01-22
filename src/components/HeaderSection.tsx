import React from 'react';
import styled from 'styled-components';
import Dropdown from './Dropdown';

interface HeaderSectionProps {
  sortOption: string;
  onSortChange: (value: string) => void;
}

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'rating-high', label: 'Highest Rating' },
  { value: 'price-low', label: 'Lowest Price' }
];

const HeaderSection: React.FC<HeaderSectionProps> = ({ sortOption, onSortChange }) => {
  return (
    <HeaderContainer>
      <Dropdown
        options={sortOptions}
        value={sortOption}
        onChange={onSortChange}
        label="Sort by"
      />
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  display: flex;
  justify-content: end;
`;

export default HeaderSection;
