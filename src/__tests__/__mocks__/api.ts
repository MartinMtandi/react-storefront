import { Product } from '@/store/productsSlice';
import { vi } from 'vitest';

export const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Product 1',
    price: 99.99,
    description: 'Test description 1',
    category: 'electronics',
    image: 'test-image-1.jpg',
    rating: { rate: 4.5, count: 100 }
  },
  {
    id: 2,
    title: 'Test Product 2',
    price: 149.99,
    description: 'Test description 2',
    category: 'clothing',
    image: 'test-image-2.jpg',
    rating: { rate: 4.0, count: 80 }
  }
];

export const mockCategories = [
  'electronics',
  'clothing',
  'jewelry',
  'accessories'
];

const api = {
  getProducts: vi.fn().mockResolvedValue(mockProducts),
  getProduct: vi.fn().mockImplementation((id: number) => 
    Promise.resolve(mockProducts.find(p => p.id === id))
  ),
  getCategories: vi.fn().mockResolvedValue(mockCategories),
  getProductsByCategory: vi.fn().mockImplementation((category: string) =>
    Promise.resolve(mockProducts.filter(p => p.category === category))
  )
};

export default api;
