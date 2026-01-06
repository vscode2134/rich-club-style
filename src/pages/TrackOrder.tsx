import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Search, Package, CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Order } from '@/types';

// Demo order for display
const demoOrder: Order = {
  _id: '1',
  invoiceNumber: 'RC-2024-001234',
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  },
  items: [
    {
      productId: '1',
      name: 'Classic Cotton Tee',
      price: 1499,
      size: 'M',
      quantity: 2,
      image: '/placeholder.svg',
    },
    {
      productId: '2',
      name: 'Linen Blend Shirt',
      price: 2499,
      size: 'L',
      quantity: 1,
      image: '/placeholder.svg',
    },
  ],
  subtotal: 5497,
  discount: 0,
  total: 5497,
  orderStatus: 'PLACED',
  paymentStatus: 'PAID',
  paymentMethod: 'RAZORPAY',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function TrackOrder() {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSearching(true);

    // Simulate API call
    setTimeout(() => {
      if (invoiceNumber.toUpperCase() === 'RC-2024-001234') {
        setOrder(demoOrder);
      } else {
        setError('Order not found. Please check your invoice number.');
        setOrder(null);
      }
      setIsSearching(false);
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PLACED':
        return <CheckCircle className="h-5 w-5 text-gold" />;
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'text-green-600';
      case 'FAILED':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="pt-20 min-h-[70vh]">
        <div className="container-elegant section-padding">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <Package className="h-12 w-12 mx-auto mb-6 text-gold" />
            <h1 className="heading-display mb-4">Track Your Order</h1>
            <p className="text-elegant">
              Enter your invoice number to check the status of your order.
            </p>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-12">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="Enter Invoice Number (e.g., RC-2024-001234)"
                  className="input-elegant border border-border px-4 pr-10 w-full"
                  required
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <button
                type="submit"
                disabled={isSearching}
                className="btn-primary"
              >
                {isSearching ? 'Searching...' : 'Track'}
              </button>
            </div>
            {error && (
              <p className="mt-4 text-sm text-destructive text-center">{error}</p>
            )}
          </form>

          {/* Order Details */}
          {order && (
            <div className="max-w-3xl mx-auto animate-fade-in">
              <div className="bg-secondary/30 p-6 lg:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
                  <div>
                    <p className="label-uppercase text-gold mb-2">Invoice Number</p>
                    <h2 className="font-display text-2xl">{order.invoiceNumber}</h2>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      {getStatusIcon(order.orderStatus)}
                      <span className="font-medium">{order.orderStatus}</span>
                    </div>
                    <p className={cn('text-sm', getPaymentStatusColor(order.paymentStatus))}>
                      Payment: {order.paymentStatus}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="py-6 border-b border-border">
                  <h3 className="label-uppercase mb-4">Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-16 h-20 bg-secondary overflow-hidden shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Size: {item.size} × {item.quantity}
                          </p>
                          <p className="text-sm mt-1">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping */}
                <div className="py-6 border-b border-border grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="label-uppercase mb-4">Shipping Address</h3>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-muted-foreground">{order.customer.address}</p>
                      <p className="text-muted-foreground">
                        {order.customer.city}, {order.customer.state} {order.customer.pincode}
                      </p>
                      <p className="text-muted-foreground">{order.customer.phone}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="label-uppercase mb-4">Order Total</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-gold">
                          <span>Discount</span>
                          <span>-₹{order.discount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-display text-lg pt-2 border-t border-border">
                        <span>Total</span>
                        <span>₹{order.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/shop" className="btn-outline text-center">
                    Continue Shopping
                  </Link>
                  <button className="btn-primary">
                    Need Help?
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
