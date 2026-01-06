// Product Types
export interface ProductStock {
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
}

export type ProductSize = keyof ProductStock;

export type ProductCategory = 'men' | 'women' | 'kids' | 'accessories' | 'footwear' | 'other';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: ProductCategory;
  stock: ProductStock;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  product: Product;
  size: ProductSize;
  quantity: number;
}

// Order Types
export type OrderStatus = 'PLACED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: ProductSize;
  quantity: number;
  image: string;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  _id: string;
  invoiceNumber: string;
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'RAZORPAY' | 'COD';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}

// Coupon Types
export interface Coupon {
  _id: string;
  code: string;
  discountType: 'FLAT' | 'PERCENTAGE';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
  isActive: boolean;
}

// CMS Types
export interface HeroSlide {
  _id: string;
  image: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export interface LookbookItem {
  _id: string;
  image: string;
  title: string;
  link: string;
}

export interface USPItem {
  _id: string;
  icon: string;
  title: string;
  description: string;
}

export interface HomeContent {
  heroSlides: HeroSlide[];
  lookbook: LookbookItem[];
  featuredProducts: string[];
  newArrivals: string[];
  customTshirtSection: {
    title: string;
    description: string;
    image: string;
    ctaText: string;
    ctaLink: string;
  };
  uspItems: USPItem[];
}

// Auth Types
export interface Admin {
  _id: string;
  email: string;
}

export interface AuthState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
}
