import { HeroCarousel } from '@/components/home/HeroCarousel';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { USPBanner } from '@/components/home/USPBanner';
import { CustomTshirtSection } from '@/components/home/CustomTshirtSection';
import { Layout } from '@/components/layout/Layout';

const Index = () => {
  return (
    <Layout>
      <HeroCarousel />
      <USPBanner />
      <FeaturedProducts 
        title="New Arrivals" 
        subtitle="Just Landed" 
        viewAllLink="/shop" 
      />
      <FeaturedProducts 
        title="Bestsellers" 
        subtitle="Customer Favorites" 
        viewAllLink="/shop" 
      />
      <CustomTshirtSection />
    </Layout>
  );
};

export default Index;
