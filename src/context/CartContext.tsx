import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, Product, ProductSize } from '@/types';

interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; size: ProductSize; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size: ProductSize } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; size: ProductSize; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  itemCount: 0,
  subtotal: 0,
};

function calculateTotals(items: CartItem[]): { itemCount: number; subtotal: number } {
  return items.reduce(
    (acc, item) => ({
      itemCount: acc.itemCount + item.quantity,
      subtotal: acc.subtotal + item.product.price * item.quantity,
    }),
    { itemCount: 0, subtotal: 0 }
  );
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, size, quantity } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product._id === product._id && item.size === size
      );

      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, size, quantity }];
      }

      return { items: newItems, ...calculateTotals(newItems) };
    }

    case 'REMOVE_ITEM': {
      const { productId, size } = action.payload;
      const newItems = state.items.filter(
        (item) => !(item.product._id === productId && item.size === size)
      );
      return { items: newItems, ...calculateTotals(newItems) };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, size, quantity } = action.payload;
      if (quantity <= 0) {
        const newItems = state.items.filter(
          (item) => !(item.product._id === productId && item.size === size)
        );
        return { items: newItems, ...calculateTotals(newItems) };
      }

      const newItems = state.items.map((item) =>
        item.product._id === productId && item.size === size
          ? { ...item, quantity }
          : item
      );
      return { items: newItems, ...calculateTotals(newItems) };
    }

    case 'CLEAR_CART':
      return initialState;

    case 'LOAD_CART':
      return { items: action.payload, ...calculateTotals(action.payload) };

    default:
      return state;
  }
}

interface CartContextType extends CartState {
  addItem: (product: Product, size: ProductSize, quantity?: number) => void;
  removeItem: (productId: string, size: ProductSize) => void;
  updateQuantity: (productId: string, size: ProductSize, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'richclub_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: items });
      } catch (e) {
        console.error('Failed to load cart from storage:', e);
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addItem = (product: Product, size: ProductSize, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, size, quantity } });
  };

  const removeItem = (productId: string, size: ProductSize) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, size } });
  };

  const updateQuantity = (productId: string, size: ProductSize, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, size, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
