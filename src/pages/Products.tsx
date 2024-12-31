import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Search } from 'react-feather';
import SideNavigation from '../components/SideNavigation';
import ProductCard from '../components/ProductCard';
import { RootState } from '../store';
import { addToCart, removeFromCart } from '../store/cartSlice';
import { addToWishlist } from '../store/wishlistSlice';
import { setProducts, setLoading, setError } from '../store/productsSlice';
import { apiService } from '../services/api';
import { useSearch } from '../components/Layout';
import Typography from '../components/Typography';

interface PriceRange {
  min: number;
  max: number;
}

const Products: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products.products);
  const loading = useSelector((state: RootState) => state.products.loading);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 0 });
  const [priceRangeLimits, setPriceRangeLimits] = useState<PriceRange>({ min: 0, max: 0 });
  const { searchTerm } = useSearch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        dispatch(setLoading(true));
        const data = await apiService.getProducts();
        dispatch(setProducts(data));
        
        // Set initial price range based on product prices
        const prices = data.map(product => product.price);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRangeLimits({ min: minPrice, max: maxPrice });
        setPriceRange({ min: minPrice, max: maxPrice });
      } catch (error) {
        console.error('Error fetching products:', error);
        dispatch(setError(error instanceof Error ? error.message : 'Failed to fetch products'));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchProducts();
  }, [dispatch]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes('all') || 
      selectedCategories.includes(product.category);
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    const matchesSearch = !searchTerm || product.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  return (
    <Container>
      {!loading && (
        <>
          <SideNavigation
            selectedCategories={selectedCategories}
            onCategoryChange={setSelectedCategories}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            priceRangeLimits={priceRangeLimits}
          />
          <Content>
            <ProductGrid>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={() => dispatch(addToCart(product))}
                    onRemoveFromCart={cartItems.some(item => item.id === product.id) ? () => dispatch(removeFromCart(product.id)) : undefined}
                    onAddToWishlist={() => dispatch(addToWishlist(product))}
                    isInWishlist={wishlistItems.some(item => item.id === product.id)}
                  />
                ))
              ) : (
                <NoResults>
                  <SearchIcon size={48} />
                  <NoResultsContent>
                    <Typography fontSize="18px" color="#212121" fontWeight="500">
                      No results found
                    </Typography>
                    {searchTerm && (
                      <Typography fontSize="14px" color="#5A5A5A">
                        No products match "{searchTerm}"
                      </Typography>
                    )}
                  </NoResultsContent>
                </NoResults>
              )}
            </ProductGrid>
          </Content>
        </>
      )}
      {loading && (
        <LoadingText>Loading products...</LoadingText>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 0;
`;

const Content = styled.div`
`;

const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
  background: white;
  border: 1px solid #ddd;
  text-align: center;
  min-height: 300px;
`;

const NoResultsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
`;

const SearchIcon = styled(Search)`
  color: #C09578;
  opacity: 0.5;
`;

const LoadingText = styled.p`
  text-align: center;
  color: #5A5A5A;
  padding: 2rem;
  grid-column: 1 / -1;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;

  > ${NoResults} {
    grid-column: 1 / -1;
  }
`;

export default Products;
