import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ArrowRight } from 'lucide-react';

// Demo products for display
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
];

interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  products?: Product[];
  viewAllLink?: string;
}

export function FeaturedProducts({
  title = 'Featured Products',
  subtitle = 'Handpicked favorites',
  products = demoProducts,
  viewAllLink = '/shop',
}: FeaturedProductsProps) {
  return (
    <section className="section-padding bg-secondary/30">
      <div className="container-elegant">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="label-uppercase text-gold mb-4 block">{subtitle}</span>
            <h2 className="heading-section">{title}</h2>
          </div>
          <Link
            to={viewAllLink}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm uppercase tracking-[0.15em] font-medium hover:text-gold transition-colors group"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <ProductGrid products={products} columns={4} />
      </div>
    </section>
  );
}
