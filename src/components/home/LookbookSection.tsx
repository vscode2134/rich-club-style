import { Link } from 'react-router-dom';
import { LookbookItem } from '@/types';
import { cn } from '@/lib/utils';
import lookbook1 from '@/assets/lookbook-1.jpg';
import lookbook2 from '@/assets/lookbook-2.jpg';
import lookbook3 from '@/assets/lookbook-3.jpg';

// Demo lookbook items
const demoLookbook: LookbookItem[] = [
  {
    _id: '1',
    image: lookbook1,
    title: 'Urban Essentials',
    link: '/shop?category=men',
  },
  {
    _id: '2',
    image: lookbook2,
    title: 'Elegant Evenings',
    link: '/shop?category=women',
  },
  {
    _id: '3',
    image: lookbook3,
    title: 'Street Style',
    link: '/shop?category=accessories',
  },
];

interface LookbookSectionProps {
  items?: LookbookItem[];
}

export function LookbookSection({ items = demoLookbook }: LookbookSectionProps) {
  return (
    <section className="section-padding bg-background">
      <div className="container-elegant">
        <div className="text-center mb-12">
          <span className="label-uppercase text-gold mb-4 block">Curated Collections</span>
          <h2 className="heading-section">The Lookbook</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, index) => (
            <Link
              key={item._id}
              to={item.link}
              className={cn(
                'group relative aspect-[3/4] overflow-hidden',
                index === 1 && 'md:aspect-[3/5]'
              )}
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <h3 className="font-display text-xl md:text-2xl text-primary-foreground mb-2">
                  {item.title}
                </h3>
                <span className="text-sm text-primary-foreground/80 link-underline">
                  Shop Collection
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
