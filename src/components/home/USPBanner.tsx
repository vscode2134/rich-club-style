import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import { USPItem } from '@/types';

const demoUSPs: USPItem[] = [
  {
    _id: '1',
    icon: 'Truck',
    title: 'Free Shipping',
    description: 'On orders above ₹999',
  },
  {
    _id: '2',
    icon: 'Shield',
    title: 'Secure Payments',
    description: 'SSL encrypted checkout',
  },
  {
    _id: '3',
    icon: 'RefreshCw',
    title: 'Easy Returns',
    description: '7-day return policy',
  },
  {
    _id: '4',
    icon: 'Headphones',
    title: '24/7 Support',
    description: 'Dedicated customer care',
  },
];

const iconMap: Record<string, React.ElementType> = {
  Truck,
  Shield,
  RefreshCw,
  Headphones,
};

interface USPBannerProps {
  items?: USPItem[];
}

export function USPBanner({ items = demoUSPs }: USPBannerProps) {
  return (
    <section className="py-12 bg-primary text-primary-foreground">
      <div className="container-elegant">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((item) => {
            const IconComponent = iconMap[item.icon] || Truck;
            return (
              <div key={item._id} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 mb-4 border border-gold/30 text-gold">
                  <IconComponent className="h-5 w-5" />
                </div>
                <h4 className="font-body text-sm font-medium mb-1">{item.title}</h4>
                <p className="text-xs text-primary-foreground/60">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
