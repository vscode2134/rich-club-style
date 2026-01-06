import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'Men', href: '/shop?category=men' },
    { name: 'Women', href: '/shop?category=women' },
    { name: 'Kids', href: '/shop?category=kids' },
    { name: 'Accessories', href: '/shop?category=accessories' },
    { name: 'New Arrivals', href: '/shop?category=new' },
  ],
  help: [
    { name: 'Track Order', href: '/track-order' },
    { name: 'Shipping Info', href: '/shipping' },
    { name: 'Returns & Exchanges', href: '/returns' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Contact Us', href: '/contact' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-elegant section-padding">
        {/* Newsletter */}
        <div className="text-center mb-16 pb-16 border-b border-primary-foreground/20">
          <h3 className="heading-section mb-4">Join the Club</h3>
          <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
            Subscribe to receive updates on new arrivals, exclusive offers, and styling tips.
          </p>
          <form className="flex max-w-md mx-auto gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-transparent border-b border-primary-foreground/40 py-3 text-sm focus:border-gold focus:outline-none placeholder:text-primary-foreground/50"
            />
            <button type="submit" className="btn-gold">
              Subscribe
            </button>
          </form>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-2xl font-semibold tracking-[0.1em] block mb-6">
              RICH CLUB
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Premium fashion for the modern individual. Quality craftsmanship meets contemporary design.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 border border-primary-foreground/30 hover:border-gold hover:text-gold transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 border border-primary-foreground/30 hover:border-gold hover:text-gold transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 border border-primary-foreground/30 hover:border-gold hover:text-gold transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="label-uppercase text-primary-foreground mb-6">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="label-uppercase text-primary-foreground mb-6">Help</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="label-uppercase text-primary-foreground mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-gold transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Rich Club. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <img src="/placeholder.svg" alt="Visa" className="h-6 opacity-70" />
            <img src="/placeholder.svg" alt="Mastercard" className="h-6 opacity-70" />
            <img src="/placeholder.svg" alt="UPI" className="h-6 opacity-70" />
          </div>
        </div>
      </div>
    </footer>
  );
}
