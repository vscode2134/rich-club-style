import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Product, ProductSize } from '@/types';
import { useCart } from '@/context/CartContext';
import { ChevronLeft, Minus, Plus, Heart, Share2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Demo product
const demoProduct: Product = {
  _id: '1',
  name: 'Classic Cotton Tee',
  description: 'Premium cotton t-shirt crafted from 100% organic cotton. Features a relaxed fit with dropped shoulders and a slightly cropped length. The soft, breathable fabric ensures all-day comfort while maintaining its shape wash after wash. Perfect for layering or wearing on its own.',
  price: 1499,
  images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
  category: 'normal-tshirts',
  stock: { S: 5, M: 10, L: 8, XL: 6, XXL: 0 },
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const sizes: ProductSize[] = ['S', 'M', 'L', 'XL', 'XXL'];

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { toast } = useToast();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // In production, fetch product by ID
  const product = demoProduct;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: 'Please select a size',
        variant: 'destructive',
      });
      return;
    }

    if (product.stock[selectedSize] < quantity) {
      toast({
        title: 'Not enough stock',
        description: `Only ${product.stock[selectedSize]} items available in size ${selectedSize}`,
        variant: 'destructive',
      });
      return;
    }

    setIsAdding(true);
    addItem(product, selectedSize, quantity);
    
    setTimeout(() => {
      setIsAdding(false);
      toast({
        title: 'Added to cart',
        description: `${product.name} (${selectedSize}) x ${quantity}`,
      });
    }, 500);
  };

  return (
    <Layout>
      <div className="pt-20">
        <div className="container-elegant section-padding">
          {/* Breadcrumb */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Shop
          </Link>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-secondary overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        'aspect-square bg-secondary overflow-hidden border-2 transition-colors',
                        selectedImage === index ? 'border-gold' : 'border-transparent'
                      )}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <span className="label-uppercase text-gold mb-2 block">
                  {product.category}
                </span>
                <h1 className="heading-section mb-4">{product.name}</h1>
                <p className="text-2xl font-display">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
              </div>

              <p className="text-elegant">{product.description}</p>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="label-uppercase">Select Size</h4>
                  <button className="text-sm text-muted-foreground hover:text-foreground link-underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map((size) => {
                    const inStock = product.stock[size] > 0;
                    const lowStock = product.stock[size] > 0 && product.stock[size] <= 3;
                    
                    return (
                      <button
                        key={size}
                        onClick={() => inStock && setSelectedSize(size)}
                        disabled={!inStock}
                        className={cn(
                          'relative w-14 h-14 text-sm font-medium border transition-all',
                          selectedSize === size
                            ? 'border-gold bg-gold text-primary-foreground'
                            : inStock
                            ? 'border-border hover:border-foreground'
                            : 'border-border text-muted-foreground/30 cursor-not-allowed line-through'
                        )}
                      >
                        {size}
                        {lowStock && inStock && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedSize && product.stock[selectedSize] <= 3 && (
                  <p className="text-sm text-destructive mt-2">
                    Only {product.stock[selectedSize]} left in stock
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <h4 className="label-uppercase mb-4">Quantity</h4>
                <div className="inline-flex items-center border border-border">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={cn(
                    'flex-1 btn-primary flex items-center justify-center gap-2',
                    isAdding && 'opacity-70'
                  )}
                >
                  {isAdding ? (
                    <>
                      <Check className="h-4 w-4" />
                      Added!
                    </>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
                <button className="p-4 border border-border hover:border-foreground transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
                <button className="p-4 border border-border hover:border-foreground transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              {/* Extra Info */}
              <div className="pt-6 border-t border-border space-y-3 text-sm text-muted-foreground">
                <p>✓ Free shipping on orders above ₹999</p>
                <p>✓ Easy 7-day returns</p>
                <p>✓ Secure checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
