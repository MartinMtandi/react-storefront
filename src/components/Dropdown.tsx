import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'react-feather';
import Typography from './Typography';
import { useNavigate } from 'react-router-dom';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  position?: 'left' | 'right' | 'center';
  label?: string;
  placeholder?: string;
  isNavigationDropdown?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ 
  options, 
  value, 
  onChange, 
  position = 'right',
  label,
  placeholder = 'Select option',
  isNavigationDropdown = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (value: string) => {
    if (isNavigationDropdown) {
      navigate(value);
    } else {
      onChange(value);
    }
    setIsOpen(false);
  };

  const displayText = label 
    ? selectedOption 
      ? `${label}: ${selectedOption.label}`
      : label
    : selectedOption
      ? selectedOption.label
      : placeholder;

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        <Typography fontSize="14px">
          {displayText}
        </Typography>
        <ChevronIcon size={16} $isOpen={isOpen} />
      </DropdownButton>
      <DropdownMenu $isOpen={isOpen} $position={position}>
        {options.map((option) => (
          <DropdownItem
            key={option.value}
            onClick={() => handleSelect(option.value)}
            $isSelected={option.value === value}
          >
            <Typography fontSize="14px">{option.label}</Typography>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </DropdownContainer>
  );
};

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid #ddd;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  min-width: 150px;
  justify-content: space-between;

  &:hover {
    border-color: #999;
  }

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean; $position: string }>`
  position: absolute;
  top: calc(100% + 4px);
  ${props => {
    switch (props.$position) {
      case 'left':
        return 'left: 0;';
      case 'right':
        return 'right: 0;';
      default:
        return 'left: 50%; transform: translateX(-50%);';
    }
  }}
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 1000;
  min-width: 150px;
`;

const DropdownItem = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: ${props => props.$isSelected ? '#f5f5f5' : 'white'};
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ChevronIcon = styled(ChevronDown)<{ $isOpen: boolean }>`
  transition: transform 0.2s ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
`;

export default Dropdown;
