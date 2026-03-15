import { useState, useMemo } from 'react';
import { useGetAllProducts, useSearchProducts, useGetProductsByCategory } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import { Loader2 } from 'lucide-react';

export default function ProductCatalogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: allProducts, isLoading: allLoading } = useGetAllProducts();
  const { data: searchResults, isLoading: searchLoading } = useSearchProducts(searchTerm);
  const { data: categoryProducts, isLoading: categoryLoading } = useGetProductsByCategory(selectedCategory);

  const categories = useMemo(() => {
    if (!allProducts) return [];
    const uniqueCategories = new Set(allProducts.map((p) => p.category));
    return Array.from(uniqueCategories);
  }, [allProducts]);

  const products = useMemo(() => {
    if (searchTerm) return searchResults || [];
    if (selectedCategory && selectedCategory !== 'all') return categoryProducts || [];
    return allProducts || [];
  }, [searchTerm, selectedCategory, searchResults, categoryProducts, allProducts]);

  const isLoading = allLoading || searchLoading || categoryLoading;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Product Catalog</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar onSearch={setSearchTerm} />
          </div>
          <CategoryFilter
            categories={categories}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              setSearchTerm('');
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
