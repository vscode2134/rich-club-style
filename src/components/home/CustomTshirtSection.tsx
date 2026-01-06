import { Link } from 'react-router-dom';
import customTshirtImage from '@/assets/custom-tshirt.jpg';

interface CustomTshirtSectionProps {
  title?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
}

export function CustomTshirtSection({
  title = 'Design Your Own',
  description = 'Create unique, personalized t-shirts with your own designs. Express your style with our premium custom printing service.',
  image = customTshirtImage,
  ctaText = 'Start Designing',
  ctaLink = '/custom-design',
}: CustomTshirtSectionProps) {
  return (
    <section className="section-padding bg-background">
      <div className="container-elegant">
        <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="order-2 md:order-1">
            <span className="label-uppercase text-gold mb-4 block">Custom Collection</span>
            <h2 className="heading-section mb-6">{title}</h2>
            <p className="text-elegant mb-8 max-w-md">{description}</p>
            <Link to={ctaLink} className="btn-gold inline-block">
              {ctaText}
            </Link>
          </div>
          <div className="order-1 md:order-2">
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src={image}
                alt="Custom T-shirt Design"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
