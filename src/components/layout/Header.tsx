import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'New Arrivals', href: '/shop?category=new' },
  { name: 'Men', href: '/shop?category=men' },
  { name: 'Women', href: '/shop?category=women' },
  { name: 'Kids', href: '/shop?category=kids' },
  { name: 'Accessories', href: '/shop?category=accessories' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();

  const isTransparent = location.pathname === '/';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isTransparent ? 'bg-transparent' : 'bg-background border-b border-border'
      )}
    >
      <nav className="container-elegant">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 -ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="link-underline text-sm uppercase tracking-[0.15em] font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Logo */}
          <Link
            to="/"
            className="absolute left-1/2 -translate-x-1/2 font-display text-2xl md:text-3xl font-semibold tracking-[0.1em]"
          >
            RICH CLUB
          </Link>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:text-gold transition-colors">
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/admin/login"
              className="p-2 hover:text-gold transition-colors hidden sm:block"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link to="/cart" className="p-2 relative hover:text-gold transition-colors">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-gold text-primary-foreground text-xs font-medium">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 top-20 bg-background z-40 transition-all duration-300',
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="container-elegant py-8 space-y-6">
          {navigation.map((item, index) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-2xl font-display font-light animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-8 border-t border-border">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-lg font-display font-light"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
