import { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function ProductGrid({ products, columns = 4, className }: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-6 md:gap-8', gridCols[columns], className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
