import { Product } from '../store/productsSlice';

if (!import.meta.env.VITE_API_URL) {
  throw new Error('VITE_API_URL environment variable is not defined');
}

const BASE_URL = import.meta.env.VITE_API_URL;

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

class ApiService {
  private cacheExpiryTime = 30 * 60 * 1000;

  private async fetchWithCache<T>(
    key: string,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    // Check if data exists in session storage and is not expired
    const cachedData = sessionStorage.getItem(key);
    if (cachedData) {
      const { data, timestamp }: CacheItem<T> = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > this.cacheExpiryTime;

      if (!isExpired) {
        console.log(`Using cached data for ${key}`);
        return data;
      }
      console.log(`Cache expired for ${key}`);
    }

    // If no cache or expired, fetch new data
    try {
      const data = await fetchFn();
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(key, JSON.stringify(cacheItem));
      return data;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      throw error;
    }
  }

  async getProducts(): Promise<Product[]> {
    return this.fetchWithCache('products', async () => {
      const response = await fetch(`${BASE_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    });
  }

  async getCategories(): Promise<string[]> {
    return this.fetchWithCache('categories', async () => {
      const response = await fetch(`${BASE_URL}/products/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return response.json();
    });
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.fetchWithCache(`products-${category}`, async () => {
      const response = await fetch(`${BASE_URL}/products/category/${category}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch products for category: ${category}`);
      }
      return response.json();
    });
  }

  async getProduct(id: number): Promise<Product> {
    return this.fetchWithCache(`product-${id}`, async () => {
      const response = await fetch(`${BASE_URL}/products/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product with id: ${id}`);
      }
      return response.json();
    });
  }

  clearCache(): void {
    sessionStorage.clear();
    console.log('API cache cleared');
  }

  clearCacheItem(key: string): void {
    sessionStorage.removeItem(key);
    console.log(`Cache cleared for ${key}`);
  }
}

export const apiService = new ApiService();
