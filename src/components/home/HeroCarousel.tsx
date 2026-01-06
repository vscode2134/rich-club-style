import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroSlide } from '@/types';
import { cn } from '@/lib/utils';
import heroImage from '@/assets/hero-fashion.jpg';

// Demo slides - will be replaced with CMS data
const demoSlides: HeroSlide[] = [
  {
    _id: '1',
    image: heroImage,
    title: 'New Season Collection',
    subtitle: 'Discover the latest trends in premium fashion',
    ctaText: 'Shop Now',
    ctaLink: '/shop',
  },
  {
    _id: '2',
    image: heroImage,
    title: 'Summer Essentials',
    subtitle: 'Lightweight fabrics for the modern wardrobe',
    ctaText: 'Explore',
    ctaLink: '/shop?category=new',
  },
];

interface HeroCarouselProps {
  slides?: HeroSlide[];
}

export function HeroCarousel({ slides = demoSlides }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      {slides.map((s, index) => (
        <div
          key={s._id}
          className={cn(
            'absolute inset-0 transition-opacity duration-700 ease-in-out',
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          )}
        >
          <img
            src={s.image}
            alt={s.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/30" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container-elegant text-center text-primary-foreground">
          <span
            className={cn(
              'label-uppercase mb-4 block text-gold transition-all duration-500',
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            )}
          >
            Rich Club
          </span>
          <h1
            className={cn(
              'heading-display mb-6 max-w-4xl mx-auto transition-all duration-500 delay-100',
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            )}
          >
            {slide.title}
          </h1>
          <p
            className={cn(
              'text-lg md:text-xl mb-10 max-w-xl mx-auto text-primary-foreground/80 transition-all duration-500 delay-200',
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            )}
          >
            {slide.subtitle}
          </p>
          <Link
            to={slide.ctaLink}
            className={cn(
              'btn-outline border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary inline-block transition-all duration-500 delay-300',
              isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
            )}
          >
            {slide.ctaText}
          </Link>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              'h-0.5 transition-all duration-300',
              index === currentSlide
                ? 'w-12 bg-gold'
                : 'w-6 bg-primary-foreground/40 hover:bg-primary-foreground/60'
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
