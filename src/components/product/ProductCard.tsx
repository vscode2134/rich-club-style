import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  priority?: boolean;
}

export function ProductCard({ product, className, priority }: ProductCardProps) {
  const hasStock = Object.values(product.stock).some((qty) => qty > 0);
  const availableSizes = Object.entries(product.stock)
    .filter(([, qty]) => qty > 0)
    .map(([size]) => size);

  return (
    <Link to={`/product/${product._id}`} className={cn('product-card group block', className)}>
      <div className="product-card-image relative">
        <img
          src={product.images[0] || '/placeholder.svg'}
          alt={product.name}
          loading={priority ? 'eager' : 'lazy'}
          className="h-full w-full object-cover"
        />
        {!hasStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="label-uppercase text-foreground">Sold Out</span>
          </div>
        )}
        {/* Quick view on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 bg-gradient-to-t from-primary/80 to-transparent">
          <div className="flex gap-2 justify-center">
            {availableSizes.map((size) => (
              <span
                key={size}
                className="text-xs uppercase text-primary-foreground px-2 py-1 border border-primary-foreground/40"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-body text-sm font-medium text-foreground truncate">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
      </div>
    </Link>
  );
}
