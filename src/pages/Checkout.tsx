import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Layout } from '@/components/layout/Layout';
import { ChevronLeft, CreditCard, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { CustomerDetails } from '@/types';

const initialCustomer: CustomerDetails = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [customer, setCustomer] = useState<CustomerDetails>(initialCustomer);
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate order processing
    setTimeout(() => {
      toast({
        title: 'Order placed successfully!',
        description: 'You will receive a confirmation email shortly.',
      });
      clearCart();
      navigate('/order-confirmation');
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="pt-20 min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="heading-section mb-4">Your cart is empty</h1>
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
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Cart
          </Link>

          <h1 className="heading-display mb-12">Checkout</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8 lg:gap-16">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Contact Info */}
                <div>
                  <h3 className="font-display text-xl mb-6">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      value={customer.name}
                      onChange={handleInputChange}
                      placeholder="Full Name *"
                      required
                      className="input-elegant border border-border px-4"
                    />
                    <input
                      type="email"
                      name="email"
                      value={customer.email}
                      onChange={handleInputChange}
                      placeholder="Email Address *"
                      required
                      className="input-elegant border border-border px-4"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={customer.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number *"
                      required
                      className="input-elegant border border-border px-4 md:col-span-2"
                    />
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="font-display text-xl mb-6">Shipping Address</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="address"
                      value={customer.address}
                      onChange={handleInputChange}
                      placeholder="Street Address *"
                      required
                      className="input-elegant border border-border px-4 md:col-span-2"
                    />
                    <input
                      type="text"
                      name="city"
                      value={customer.city}
                      onChange={handleInputChange}
                      placeholder="City *"
                      required
                      className="input-elegant border border-border px-4"
                    />
                    <input
                      type="text"
                      name="state"
                      value={customer.state}
                      onChange={handleInputChange}
                      placeholder="State *"
                      required
                      className="input-elegant border border-border px-4"
                    />
                    <input
                      type="text"
                      name="pincode"
                      value={customer.pincode}
                      onChange={handleInputChange}
                      placeholder="PIN Code *"
                      required
                      className="input-elegant border border-border px-4 md:col-span-2"
                    />
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="font-display text-xl mb-6">Payment Method</h3>
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('RAZORPAY')}
                      className={cn(
                        'w-full p-4 border flex items-center gap-4 transition-colors',
                        paymentMethod === 'RAZORPAY'
                          ? 'border-gold bg-gold/5'
                          : 'border-border hover:border-foreground'
                      )}
                    >
                      <CreditCard className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">Pay Online</p>
                        <p className="text-sm text-muted-foreground">
                          Credit/Debit Card, UPI, Net Banking
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('COD')}
                      className={cn(
                        'w-full p-4 border flex items-center gap-4 transition-colors',
                        paymentMethod === 'COD'
                          ? 'border-gold bg-gold/5'
                          : 'border-border hover:border-foreground'
                      )}
                    >
                      <Truck className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          Pay when your order arrives
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-secondary/30 p-6 lg:p-8 sticky top-24">
                  <h3 className="font-display text-xl mb-6">Order Summary</h3>

                  {/* Items */}
                  <div className="space-y-4 pb-6 border-b border-border max-h-60 overflow-y-auto">
                    {items.map((item) => (
                      <div
                        key={`${item.product._id}-${item.size}`}
                        className="flex gap-4"
                      >
                        <div className="w-16 h-20 bg-secondary overflow-hidden shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 text-sm">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-muted-foreground">
                            Size: {item.size} × {item.quantity}
                          </p>
                          <p className="mt-1">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="py-6 space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-gold">Free</span>
                    </div>
                    <div className="flex justify-between font-display text-lg pt-4 border-t border-border">
                      <span>Total</span>
                      <span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={cn(
                      'btn-gold w-full',
                      isProcessing && 'opacity-70 cursor-not-allowed'
                    )}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
