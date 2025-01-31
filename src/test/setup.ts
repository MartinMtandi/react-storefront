import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock Vite's import.meta.env
vi.stubGlobal('import.meta', {
  env: {
    VITE_API_URL: 'http://localhost:3000',
  },
});

// Mock react-feather
vi.mock('react-feather', () => ({
  Star: vi.fn().mockImplementation((props) => {
    const { size, fill, stroke, ...rest } = props;
    return React.createElement('div', {
      ...rest,
      'data-testid': 'star-icon',
      style: {
        width: size,
        height: size
      },
      children: React.createElement('path', {
        fill,
        stroke,
        d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
      })
    });
  }),
  ChevronDown: vi.fn().mockImplementation((props) => {
    const { size, ...rest } = props;
    return React.createElement('div', {
      ...rest,
      'data-testid': 'chevron-down',
      style: {
        width: size,
        height: size
      }
    });
  }),
  Heart: vi.fn().mockImplementation((props) => 
    React.createElement('div', {
      ...props,
      role: 'img',
      'aria-label': 'heart'
    })
  ),
  ShoppingCart: vi.fn().mockImplementation((props) => 
    React.createElement('div', {
      ...props,
      role: 'img',
      'aria-label': 'shopping cart'
    })
  ),
  Trash2: vi.fn().mockImplementation((props) => 
    React.createElement('div', {
      ...props,
      role: 'img',
      'aria-label': 'trash'
    })
  )
}));
