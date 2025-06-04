'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useLoading } from './LoadingContext';
import { cartService, ShoppingCart, CartItem } from '@/lib/cartService';
import { toast } from 'sonner';

// Cart state interface
interface CartState {
  cart: ShoppingCart | null;
  isLoading: boolean;
  error: string | null;
}

// Cart actions
type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: ShoppingCart }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CART' };

// Cart context interface
interface CartContextType {
  state: CartState;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

// Initial state
const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null
};

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
        isLoading: false,
        error: null
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: null,
        error: null
      };
    default:
      return state;
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();
  const { withLoading } = useLoading();

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user]);

  // Refresh cart from database
  const refreshCart = async () => {
    if (!user) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const cart = await cartService.getOrCreateCart(user.uid);
      dispatch({ type: 'SET_CART', payload: cart });
    } catch (error) {
      console.error('Error refreshing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart' });
      toast.error('Failed to load cart');
    }
  };



  // Get total number of items in cart
  const getCartItemCount = (): number => {
    if (!state.cart) return 0;
    return state.cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Get cart total price
  const getCartTotal = (): number => {
    return state.cart?.total || 0;
  };

  // Wrap original functions with withLoading
  const wrappedAddToCart = async (item: Omit<CartItem, 'id'>): Promise<void> => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    const promise = (async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await cartService.addItemToCart(user.uid, item);
      dispatch({ type: 'SET_CART', payload: updatedCart });
      toast.success(`${item.name} added to cart`);
      return updatedCart;
    })();

    try {
      await withLoading(promise, 'Adding item to cart...');
    } catch (error) {
      console.error('Error adding to cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart' });
      toast.error('Failed to add item to cart');
      throw error;
    }
  };

  const wrappedUpdateQuantity = async (itemId: string, quantity: number): Promise<void> => {
    if (!user) return;

    const promise = (async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await cartService.updateItemQuantity(user.uid, itemId, quantity);
      dispatch({ type: 'SET_CART', payload: updatedCart });
      
      if (quantity === 0) {
        toast.success('Item removed from cart');
      } else {
        toast.success('Quantity updated');
      }
      return updatedCart;
    })();

    try {
      await withLoading(promise, 'Updating quantity...');
    } catch (error) {
      console.error('Error updating quantity:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update quantity' });
      toast.error('Failed to update quantity');
      throw error;
    }
  };

  const wrappedRemoveFromCart = async (itemId: string): Promise<void> => {
    if (!user) return;

    const promise = (async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCart = await cartService.removeItemFromCart(user.uid, itemId);
      dispatch({ type: 'SET_CART', payload: updatedCart });
      toast.success('Item removed from cart');
      return updatedCart;
    })();

    try {
      await withLoading(promise, 'Removing item...');
    } catch (error) {
      console.error('Error removing from cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item' });
      toast.error('Failed to remove item');
      throw error;
    }
  };

  const wrappedClearCart = async (): Promise<void> => {
    if (!user) return;

    const promise = (async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      await cartService.clearCart(user.uid);
      await refreshCart();
      toast.success('Cart cleared');
    })();

    try {
      await withLoading(promise, 'Clearing cart...');
    } catch (error) {
      console.error('Error clearing cart:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart' });
      toast.error('Failed to clear cart');
      throw error;
    }
  };

  const contextValue: CartContextType = {
    state,
    addToCart: wrappedAddToCart,
    updateQuantity: wrappedUpdateQuantity,
    removeFromCart: wrappedRemoveFromCart,
    clearCart: wrappedClearCart,
    refreshCart,
    getCartItemCount,
    getCartTotal
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Hook to use cart context
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}