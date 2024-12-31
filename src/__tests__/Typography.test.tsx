import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Typography from '../components/Typography';

describe('Typography', () => {
  it('renders text content correctly', () => {
    render(<Typography>Hello World</Typography>);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('applies custom styles correctly', () => {
    render(
      <Typography 
        color="#FF0000" 
        fontSize="24px" 
        fontWeight="bold"
      >
        Styled Text
      </Typography>
    );
    
    const element = screen.getByText('Styled Text');
    expect(element).toHaveStyle({
      color: '#FF0000',
      fontSize: '24px',
      fontWeight: 'bold'
    });
  });

  it('applies custom className when provided', () => {
    render(<Typography className="custom-class">Custom Text</Typography>);
    const element = screen.getByText('Custom Text');
    expect(element).toHaveClass('custom-class');
  });

  it('uses default styles when no props provided', () => {
    render(<Typography>Default Text</Typography>);
    const element = screen.getByText('Default Text');
    expect(element).toHaveStyle({
      color: '#212121',
      fontWeight: 'normal',
      fontSize: 'inherit'
    });
  });
});
