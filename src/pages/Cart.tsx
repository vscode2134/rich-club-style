import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Cart() {
  const { items, itemCount, subtotal, removeItem, updateQuantity } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="pt-20 min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground/40" />
            <h1 className="heading-section mb-4">Your cart is empty</h1>
            <p className="text-elegant mb-8">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/shop" className="btn-primary inline-block">
              Continue Shopping
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-20">
        <div className="container-elegant section-padding">
          <h1 className="heading-display mb-12 text-center">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-sm text-muted-foreground">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Size</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
              </div>

              {/* Items */}
              {items.map((item) => (
                <div
                  key={`${item.product._id}-${item.size}`}
                  className="grid grid-cols-12 gap-4 py-6 border-b border-border items-center"
                >
                  {/* Product */}
                  <div className="col-span-12 md:col-span-6 flex gap-4">
                    <Link
                      to={`/product/${item.product._id}`}
                      className="w-24 h-32 bg-secondary overflow-hidden shrink-0"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <Link
                          to={`/product/${item.product._id}`}
                          className="font-medium hover:text-gold transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product._id, item.size)}
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive transition-colors md:hidden"
                      >
                        <X className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Size */}
                  <div className="col-span-4 md:col-span-2 text-center">
                    <span className="md:hidden text-sm text-muted-foreground mr-2">Size:</span>
                    <span className="text-sm font-medium">{item.size}</span>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-4 md:col-span-2 flex justify-center">
                    <div className="inline-flex items-center border border-border">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.size, item.quantity - 1)}
                        className="p-2 hover:bg-secondary transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.size, item.quantity + 1)}
                        className="p-2 hover:bg-secondary transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-4 md:col-span-2 text-right flex items-center justify-end gap-4">
                    <span className="font-medium">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => removeItem(item.product._id, item.size)}
                      className="hidden md:block p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-secondary/30 p-6 lg:p-8 sticky top-24">
                <h3 className="font-display text-xl mb-6">Order Summary</h3>

                <div className="space-y-4 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-gold">Free</span>
                  </div>
                </div>

                {/* Coupon */}
                <div className="py-6 border-b border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      className="flex-1 input-elegant border border-border px-4"
                    />
                    <button className="btn-outline py-2 px-4 text-xs">
                      Apply
                    </button>
                  </div>
                </div>

                <div className="py-6">
                  <div className="flex justify-between font-display text-lg mb-6">
                    <span>Total</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>

                  <Link
                    to="/checkout"
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/shop"
                    className="block text-center mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
