# Implementation Details

## Setup and Installation

1. **Prerequisites**
   - Node.js (latest LTS version)
   - npm (comes with Node.js)

2. **Installation Steps**
   ```bash
   # Clone the repository
   git clone [repository-url]
   
   # Navigate to project directory
   cd react-storefront
   
   # Install dependencies
   npm install
   ```

3. **Available Scripts**
   - `npm run dev` - Start development server using Vite
   - `npm run build` - Build production-ready code
   - `npm run preview` - Preview production build locally
   - `npm test` - Run unit tests
   - `npm run test:watch` - Run tests in watch mode
   - `npm run test:coverage` - Generate test coverage report

## Performance Optimizations

1. **React Performance Optimizations**
   - Used `memo` for `ProductCardContent` component to prevent unnecessary re-renders
   - Implemented `useMemo` for expensive calculations (price conversion, currency symbol)
   - Utilized `useCallback` for event handlers to maintain referential equality
   - Session Storage implementation to cache API responses and limit network calls

2. **State Management Optimizations**
   - Selective state updates using precise Redux selectors
   - Optimized Redux store structure for efficient data access
   - Used Redux Toolkit for reduced boilerplate and optimized state updates

3. **Error Handling**
   - Implemented Error Boundaries for graceful error handling
   - Fallback UI components to maintain user experience during errors

4. **Styling Optimizations**
   - Used styled-components with transient props ($) to prevent unnecessary DOM attributes
   - Implemented CSS transitions for smooth animations
   - Efficient CSS-in-JS implementation with styled-components

## State Management

The application uses **Redux Toolkit** for state management for several reasons:

1. **Why Redux Toolkit?**
   - Built-in immutability with Immer
   - Simplified store setup and reduced boilerplate
   - Integrated Redux DevTools for debugging
   - TypeScript support out of the box

2. **Key Features**
   - Centralized state management for cart and currency
   - Optimized selectors for efficient state access
   - Predictable state updates with Redux actions
   - Easy integration with React components through hooks

## Testing

The application uses a comprehensive testing setup with:

1. **Testing Tools**
   - Vitest as the test runner
   - React Testing Library for component testing
   - Jest DOM for DOM testing utilities
   - Coverage reporting with v8

2. **Test Types**
   - Unit tests for components

3. **Running Tests**
   ```bash
   # Run all tests
   npm test
   
   # Run tests with coverage
   npm run test:coverage
   
   # Watch mode for development
   npm run test:watch
   ```

## Key Dependencies

- React 18.2.0 - Core UI library
- Redux Toolkit 2.1.0 - State management
- React Router 6.22.0 - Routing
- Styled Components 6.1.8 - Styling
- TypeScript - Type safety
- Vite - Build tool and development server

## Best Practices Implemented

1. **Code Organization**
   - Component-based architecture
   - Separation of concerns
   - TypeScript for type safety

2. **Performance**
   - Session storage for API response caching
   - Memoization of expensive operations
   - Optimized Redux selectors

3. **Testing**
   - Comprehensive test coverage
   - Integration and unit tests
   - Mock implementations for external dependencies

4. **Error Handling”
   - Error boundaries for runtime errors
   - Graceful fallback UI
   - Comprehensive error logging
