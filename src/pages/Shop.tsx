import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Product, ProductCategory, ProductSize } from '@/types';
import { ChevronDown, Grid, List, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Demo products
const demoProducts: Product[] = [
  {
    _id: '1',
    name: 'Classic Cotton Tee',
    description: 'Premium cotton t-shirt with a relaxed fit',
    price: 1499,
    images: ['/placeholder.svg'],
    category: 'men',
    stock: { S: 5, M: 10, L: 8, XL: 6, XXL: 3 },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    name: 'Linen Blend Shirt',
    description: 'Breathable linen blend for summer comfort',
    price: 2499,
    images: ['/placeholder.svg'],
    category: 'men',
    stock: { S: 3, M: 7, L: 5, XL: 4, XXL: 2 },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    name: 'Silk Blend Blouse',
    description: 'Elegant silk blend with subtle sheen',
    price: 3299,
    images: ['/placeholder.svg'],
    category: 'women',
    stock: { S: 4, M: 6, L: 4, XL: 2, XXL: 0 },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '4',
    name: 'Tailored Trousers',
    description: 'Slim fit trousers with stretch fabric',
    price: 2899,
    images: ['/placeholder.svg'],
    category: 'men',
    stock: { S: 2, M: 5, L: 7, XL: 4, XXL: 1 },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '5',
    name: 'Elegant Midi Dress',
    description: 'Flowing midi dress perfect for any occasion',
    price: 3999,
    images: ['/placeholder.svg'],
    category: 'women',
    stock: { S: 6, M: 8, L: 5, XL: 3, XXL: 0 },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6',
    name: 'Kids Cotton Set',
    description: 'Comfortable cotton set for active kids',
    price: 1299,
    images: ['/placeholder.svg'],
    category: 'kids',
    stock: { S: 10, M: 10, L: 8, XL: 5, XXL: 0 },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '7',
    name: 'Leather Belt',
    description: 'Premium leather belt with gold buckle',
    price: 1899,
    images: ['/placeholder.svg'],
    category: 'accessories',
    stock: { S: 0, M: 15, L: 12, XL: 8, XXL: 0 },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '8',
    name: 'Canvas Sneakers',
    description: 'Classic canvas sneakers for everyday wear',
    price: 2499,
    images: ['/placeholder.svg'],
    category: 'footwear',
    stock: { S: 0, M: 8, L: 10, XL: 6, XXL: 0 },
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const categories: { value: ProductCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Products' },
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'Kids' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'footwear', label: 'Footwear' },
];

const sizes: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const selectedCategory = (searchParams.get('category') as ProductCategory | 'all') || 'all';
  const selectedSize = searchParams.get('size') as ProductSize | null;
  const sortBy = searchParams.get('sort') || 'newest';

  const updateFilter = (key: string, value: string | null) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    let products = [...demoProducts];

    // Filter by category
    if (selectedCategory !== 'all') {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Filter by size availability
    if (selectedSize) {
      products = products.filter((p) => p.stock[selectedSize] > 0);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return products;
  }, [selectedCategory, selectedSize, sortBy]);

  return (
    <Layout>
      <div className="pt-20">
        {/* Header */}
        <div className="bg-secondary/30 py-12">
          <div className="container-elegant text-center">
            <h1 className="heading-display mb-4">
              {selectedCategory === 'all' 
                ? 'All Products' 
                : categories.find(c => c.value === selectedCategory)?.label}
            </h1>
            <p className="text-elegant">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
        </div>

        {/* Filters & Products */}
        <div className="container-elegant section-padding">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm uppercase tracking-[0.15em] font-medium hover:text-gold transition-colors"
              >
                Filters
                <ChevronDown className={cn('h-4 w-4 transition-transform', showFilters && 'rotate-180')} />
              </button>

              {/* Active Filters */}
              {(selectedCategory !== 'all' || selectedSize) && (
                <div className="flex gap-2">
                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => updateFilter('category', null)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-sm"
                    >
                      {categories.find(c => c.value === selectedCategory)?.label}
                      <X className="h-3 w-3" />
                    </button>
                  )}
                  {selectedSize && (
                    <button
                      onClick={() => updateFilter('size', null)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-sm"
                    >
                      Size: {selectedSize}
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-transparent text-sm border-none focus:ring-0 cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="hidden md:flex items-center gap-2 border-l border-border pl-4">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn('p-2', viewMode === 'grid' ? 'text-foreground' : 'text-muted-foreground')}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn('p-2', viewMode === 'list' ? 'text-foreground' : 'text-muted-foreground')}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          <div
            className={cn(
              'grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 overflow-hidden transition-all duration-300',
              showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            )}
          >
            {/* Categories */}
            <div>
              <h4 className="label-uppercase mb-4">Category</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => updateFilter('category', category.value === 'all' ? null : category.value)}
                    className={cn(
                      'block text-sm transition-colors',
                      selectedCategory === category.value
                        ? 'text-gold font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h4 className="label-uppercase mb-4">Size</h4>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => updateFilter('size', selectedSize === size ? null : size)}
                    className={cn(
                      'w-10 h-10 text-sm border transition-colors',
                      selectedSize === size
                        ? 'border-gold text-gold'
                        : 'border-border hover:border-foreground'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <ProductGrid products={filteredProducts} columns={viewMode === 'grid' ? 4 : 2} />
          ) : (
            <div className="text-center py-16">
              <h3 className="heading-section mb-4">No products found</h3>
              <p className="text-elegant mb-8">Try adjusting your filters</p>
              <button
                onClick={() => setSearchParams({})}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
