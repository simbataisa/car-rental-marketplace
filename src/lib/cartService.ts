import { collection, addDoc, serverTimestamp, doc, getDoc, query, where, orderBy, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { MultiItemOrderData, OrderItem } from './orderService';

// Base item interface
export interface CartItemBase {
  id: string;
  type: 'vehicle_rental' | 'addon_service' | 'car_care' | 'charging_voucher' | 'prepaid_item' | 'postpaid_item' | 'subscription_service';
  name: string;
  description?: string;
  price: number;
  quantity: number;
  images?: string[];
  metadata?: Record<string, any>;
  notes?: string;
}

// Vehicle rental specific item
export interface VehicleRentalItem extends CartItemBase {
  type: 'vehicle_rental';
  vehicleData: {
    vehicleName: string;
    vehicleType: string;
    vehicleProvider?: string;
    vehicleRating?: number;
    vehicleSeater?: string;
    vehicleTransmission?: string;
    vehicleFuel?: string;
    vehicleFeatures?: string[];
    vehicleImages?: string[];
    
    // Dealer Information
    dealerName: string;
    dealerAddress: string;
    dealerPhone?: string;
    dealerRating?: number;
    
    // Booking Information
    pickupDate: Date;
  pickupTime?: string;
  returnDate?: Date;
  returnTime?: string;
    pickupLocation: string;
    returnLocation: string;
  };
}

// Add-on service item
export interface AddonServiceItem extends CartItemBase {
  type: 'addon_service';
  serviceData: {
    category: 'insurance' | 'gps' | 'child_seat' | 'driver' | 'fuel_service' | 'delivery' | 'other';
    duration?: string;
    coverage?: string;
    provider?: string;
  };
}

// Car care item
export interface CarCareItem extends CartItemBase {
  type: 'car_care';
  careData: {
    serviceType: 'wash' | 'maintenance' | 'repair' | 'inspection' | 'detailing';
    scheduledDate?: Date;
    location?: string;
    provider?: string;
  };
}

// Charging voucher item
export interface ChargingVoucherItem extends CartItemBase {
  type: 'charging_voucher';
  voucherData: {
    energyAmount: number; // kWh
    validityPeriod: string;
    chargingNetwork?: string;
    locations?: string[];
  };
}

// Prepaid item
export interface PrepaidItem extends CartItemBase {
  type: 'prepaid_item';
  prepaidData: {
    category: 'fuel' | 'toll' | 'parking' | 'maintenance' | 'other';
    creditAmount: number;
    validityPeriod: string;
    restrictions?: string[];
  };
}

// Postpaid item
export interface PostpaidItem extends CartItemBase {
  type: 'postpaid_item';
  postpaidData: {
    category: 'fuel' | 'toll' | 'parking' | 'maintenance' | 'other';
    billingCycle: 'monthly' | 'quarterly' | 'yearly';
    creditLimit?: number;
    autoTopup?: boolean;
  };
}

// Subscription service item
export interface SubscriptionServiceItem extends CartItemBase {
  type: 'subscription_service';
  subscriptionData: {
    plan: 'basic' | 'premium' | 'enterprise';
    billingCycle: 'monthly' | 'quarterly' | 'yearly';
    features: string[];
    autoRenewal: boolean;
    startDate?: Date;
  };
}

// Union type for all cart items
export type CartItem = VehicleRentalItem | AddonServiceItem | CarCareItem | ChargingVoucherItem | PrepaidItem | PostpaidItem | SubscriptionServiceItem;

// Shopping cart interface
export interface ShoppingCart {
  id: string;
  customerId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: 'VND';
  createdAt: any;
  updatedAt: any;
  expiresAt?: any; // Cart expiration
}

// Order interface (updated to support multiple items)
export interface CartOrder {
  id: string;
  orderNumber: string;
  customerId: string;
  items: CartItem[];
  
  // Customer Information
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Pricing
  subtotal: number;
  tax: number;
  discount: number;
  totalPrice: number;
  currency: 'VND';
  
  // Order Status
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  
  // Timestamps
  createdAt: any;
  updatedAt: any;
  
  // Order Source Tracking
  createdBy: string;
  createdByRole: 'customer' | 'telesale' | 'admin' | 'customer_service' | 'operation';
  source: 'website' | 'phone' | 'email' | 'walk_in';
  
  // Assignment
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Additional Information
  notes?: string;
  specialRequests?: string;
}

// Cart service class
export class CartService {
  private static instance: CartService;
  
  public static getInstance(): CartService {
    if (!CartService.instance) {
      CartService.instance = new CartService();
    }
    return CartService.instance;
  }
  
  // Get or create cart for user
  async getOrCreateCart(customerId: string): Promise<ShoppingCart> {
    try {
      // Try to find existing cart
      const cartQuery = query(
        collection(db, 'carts'),
        where('customerId', '==', customerId),
        orderBy('createdAt', 'desc')
      );
      
      const cartSnapshot = await getDocs(cartQuery);
      
      if (!cartSnapshot.empty) {
        const cartDoc = cartSnapshot.docs[0];
        const cartData = cartDoc.data() as Omit<ShoppingCart, 'id'>;
        
        // Check if cart is not expired
        const now = new Date();
        const expiresAt = cartData.expiresAt?.toDate();
        
        if (!expiresAt || expiresAt > now) {
          // Convert Firestore timestamps back to Date objects for vehicleData
          const processedItems = cartData.items.map(item => {
            if (item.type === 'vehicle_rental' && (item as any).vehicleData) {
              const vehicleItem = item as any;
              return {
                ...vehicleItem,
                vehicleData: {
                  ...vehicleItem.vehicleData,
                  pickupDate: vehicleItem.vehicleData.pickupDate?.toDate ? vehicleItem.vehicleData.pickupDate.toDate() : vehicleItem.vehicleData.pickupDate,
                  returnDate: vehicleItem.vehicleData.returnDate?.toDate ? vehicleItem.vehicleData.returnDate.toDate() : vehicleItem.vehicleData.returnDate
                }
              };
            }
            return item;
          });
          
          return {
            id: cartDoc.id,
            ...cartData,
            items: processedItems
          } as ShoppingCart;
        }
      }
      
      // Create new cart
      const newCart: Omit<ShoppingCart, 'id'> = {
        customerId,
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        currency: 'VND',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      };
      
      const cartRef = await addDoc(collection(db, 'carts'), newCart);
      
      return {
        id: cartRef.id,
        ...newCart,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      };
    } catch (error) {
      console.error('Error getting or creating cart:', error);
      throw error;
    }
  }
  
  // Add item to cart
  async addItemToCart(customerId: string, item: Omit<CartItem, 'id'>): Promise<ShoppingCart> {
    try {
      const cart = await this.getOrCreateCart(customerId);
      
      // Generate unique ID for the item
      const itemId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newItem: CartItem = {
        ...item,
        id: itemId
      } as CartItem;
      
      // Add item to cart
      const updatedItems = [...cart.items, newItem];
      const updatedCart = this.calculateCartTotals({
        ...cart,
        items: updatedItems
      });
      
      // Update cart in database
      await updateDoc(doc(db, 'carts', cart.id), {
        items: updatedItems,
        subtotal: updatedCart.subtotal,
        tax: updatedCart.tax,
        discount: updatedCart.discount,
        total: updatedCart.total,
        updatedAt: serverTimestamp()
      });
      
      return updatedCart;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }
  
  // Update item quantity
  async updateItemQuantity(customerId: string, itemId: string, quantity: number): Promise<ShoppingCart> {
    try {
      const cart = await this.getOrCreateCart(customerId);
      
      const updatedItems = cart.items.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ).filter(item => item.quantity > 0); // Remove items with 0 quantity
      
      const updatedCart = this.calculateCartTotals({
        ...cart,
        items: updatedItems
      });
      
      await updateDoc(doc(db, 'carts', cart.id), {
        items: updatedItems,
        subtotal: updatedCart.subtotal,
        tax: updatedCart.tax,
        discount: updatedCart.discount,
        total: updatedCart.total,
        updatedAt: serverTimestamp()
      });
      
      return updatedCart;
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    }
  }
  
  // Remove item from cart
  async removeItemFromCart(customerId: string, itemId: string): Promise<ShoppingCart> {
    try {
      const cart = await this.getOrCreateCart(customerId);
      
      const updatedItems = cart.items.filter(item => item.id !== itemId);
      const updatedCart = this.calculateCartTotals({
        ...cart,
        items: updatedItems
      });
      
      await updateDoc(doc(db, 'carts', cart.id), {
        items: updatedItems,
        subtotal: updatedCart.subtotal,
        tax: updatedCart.tax,
        discount: updatedCart.discount,
        total: updatedCart.total,
        updatedAt: serverTimestamp()
      });
      
      return updatedCart;
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }
  
  // Clear cart
  async clearCart(customerId: string): Promise<void> {
    try {
      const cart = await this.getOrCreateCart(customerId);
      
      await updateDoc(doc(db, 'carts', cart.id), {
        items: [],
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }
  
  // Calculate cart totals
  private calculateCartTotals(cart: ShoppingCart): ShoppingCart {
    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1; // 10% tax
    const discount = 0; // Can be implemented based on business logic
    const total = subtotal + tax - discount;
    
    return {
      ...cart,
      subtotal,
      tax,
      discount,
      total
    };
  }
  
  // Convert cart to order
  async checkoutCart(customerId: string, customerInfo: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes?: string;
    specialRequests?: string;
  }): Promise<any> {
    try {
      const cart = await this.getOrCreateCart(customerId);
      
      if (cart.items.length === 0) {
        throw new Error('Cart is empty');
      }
      
      // Import the createMultiItemOrder function
      const { createMultiItemOrder } = await import('./orderService');
      const { auth } = await import('./firebase');
      
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }
      
      // Convert cart items to order items with proper structure
      const orderItems = cart.items.map(item => {
        const orderItem: any = {
          id: item.id,
          type: item.type,
          name: item.name,
          description: item.description,
          price: item.price,
          quantity: item.quantity,
          status: 'pending' as any,
          metadata: item.metadata,
          images: item.images,
          notes: item.notes
        };
        
        // Only include type-specific data if it exists to avoid undefined values
        if ((item as VehicleRentalItem).vehicleData) {
          orderItem.vehicleData = (item as VehicleRentalItem).vehicleData;
        }
        if ((item as AddonServiceItem).serviceData) {
          orderItem.serviceData = (item as AddonServiceItem).serviceData;
        }
        if ((item as CarCareItem).careData) {
          orderItem.careData = (item as CarCareItem).careData;
        }
        if ((item as ChargingVoucherItem).voucherData) {
          orderItem.voucherData = (item as ChargingVoucherItem).voucherData;
        }
        if ((item as PrepaidItem).prepaidData) {
          orderItem.prepaidData = (item as PrepaidItem).prepaidData;
        }
        if ((item as PostpaidItem).postpaidData) {
          orderItem.postpaidData = (item as PostpaidItem).postpaidData;
        }
        if ((item as SubscriptionServiceItem).subscriptionData) {
          orderItem.subscriptionData = (item as SubscriptionServiceItem).subscriptionData;
        }
        
        // Filter out any remaining undefined values
        return Object.fromEntries(
          Object.entries(orderItem).filter(([_, value]) => value !== undefined) as [string, any][]
        ) as OrderItem;
      });
      
      // Prepare multi-item order data with proper typing
      const orderData: MultiItemOrderData = {
        items: orderItems,
        customerName: customerInfo.customerName,
        customerEmail: customerInfo.customerEmail,
        customerPhone: customerInfo.customerPhone,
        subtotal: cart.subtotal,
        tax: cart.tax,
        discount: cart.discount,
        totalPrice: cart.total,
        currency: 'VND',
        ...(customerInfo.notes && { notes: customerInfo.notes }),
        ...(customerInfo.specialRequests && { specialRequests: customerInfo.specialRequests })
      };
      
      // Create multi-item order
      const order = await createMultiItemOrder(orderData, auth.currentUser);
      
      // Clear cart after successful order creation
      await this.clearCart(customerId);
      
      return order;
    } catch (error) {
      console.error('Error checking out cart:', error);
      throw error;
    }
  }
  
  // Helper methods
  private generateOrderNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = now.getTime().toString().slice(-6);
    
    return `ORD-${year}${month}${day}-${timestamp}`;
  }
  
  private async getUserRole(userId: string): Promise<string> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data().role || 'customer';
      }
      return 'customer';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'customer';
    }
  }
  
  private determineOrderSource(createdByRole: string): CartOrder['source'] {
    switch (createdByRole) {
      case 'telesale':
      case 'customer_service':
        return 'phone';
      case 'admin':
      case 'operation':
        return 'email';
      default:
        return 'website';
    }
  }
}

// Export singleton instance
export const cartService = CartService.getInstance();