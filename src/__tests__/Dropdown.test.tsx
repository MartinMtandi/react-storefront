import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dropdown from '../components/Dropdown';
import '@testing-library/jest-dom';

const mockNavigate = vi.fn();

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const defaultOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

const renderDropdown = (props = {}) => {
  const defaultProps = {
    options: defaultOptions,
    onChange: vi.fn(),
    ...props,
  };

  return render(
    <BrowserRouter>
      <Dropdown {...defaultProps} />
    </BrowserRouter>
  );
};

describe('Dropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default props', () => {
    renderDropdown();
    expect(screen.getByText('Select option')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    renderDropdown({ placeholder: 'Custom placeholder' });
    expect(screen.getByText('Custom placeholder')).toBeInTheDocument();
  });

  it('renders with label', () => {
    renderDropdown({ label: 'Test Label' });
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('opens dropdown menu on click', () => {
    renderDropdown();
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    defaultOptions.forEach(option => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('calls onChange when option is selected', () => {
    const onChange = vi.fn();
    renderDropdown({ onChange });
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const option = screen.getByText('Option 1');
    fireEvent.click(option);
    
    expect(onChange).toHaveBeenCalledWith('option1');
  });

  it('navigates when isNavigationDropdown is true', () => {
    renderDropdown({ isNavigationDropdown: true });
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    const option = screen.getByText('Option 1');
    fireEvent.click(option);
    
    expect(mockNavigate).toHaveBeenCalledWith('option1');
  });

  it('closes dropdown when clicking outside', () => {
    renderDropdown();
    
    // Open dropdown
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Verify dropdown is open
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    
    // Click outside
    fireEvent.mouseDown(document.body);
    
    // Verify options are not visible
    expect(screen.queryByText('Option 1')).not.toBeVisible();
  });

  it('displays selected value with label', () => {
    renderDropdown({
      value: 'option1',
      label: 'Test Label'
    });
    
    expect(screen.getByText('Test Label: Option 1')).toBeInTheDocument();
  });
});
