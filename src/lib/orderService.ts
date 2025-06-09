import { db } from './firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { User } from 'firebase/auth';

// Item status types for different product types
export type ItemStatus = 
  | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  | 'vehicle_reserved' | 'vehicle_picked_up' | 'vehicle_returned'
  | 'service_scheduled' | 'service_in_progress' | 'service_completed'
  | 'voucher_issued' | 'voucher_redeemed'
  | 'subscription_active' | 'subscription_paused' | 'subscription_expired';

// Order item interface for multi-item orders
export interface OrderItem {
  id: string;
  type: 'vehicle_rental' | 'addon_service' | 'car_care' | 'charging_voucher' | 'prepaid_item' | 'postpaid_item' | 'subscription_service';
  name: string;
  description?: string;
  price: number;
  quantity: number;
  status: ItemStatus;
  
  // Type-specific data
  vehicleData?: {
    vehicleType: string;
    vehicleProvider?: string;
    vehicleRating?: number;
    vehicleSeater?: string;
    vehicleTransmission?: string;
    vehicleFuel?: string;
    vehicleFeatures?: string[];
    vehicleImages?: string[];
    dealerName: string;
    dealerAddress: string;
    dealerPhone?: string;
    dealerRating?: number;
    pickupDate: Date;
    returnDate?: Date;
    pickupLocation: string;
    returnLocation: string;
  };
  
  serviceData?: {
    category: string;
    duration?: string;
    location?: string;
    scheduledDate?: Date;
  };
  
  voucherData?: {
    energyAmount: number;
    validityPeriod?: string;
    stationNetwork?: string;
  };
  
  subscriptionData?: {
    plan: string;
    billingCycle: 'monthly' | 'quarterly' | 'yearly';
    startDate?: Date;
    endDate?: Date;
  };
  
  images?: string[];
  notes?: string;
}

// Legacy single-item order data (for backward compatibility)
export interface OrderData {
  // Vehicle Information
  vehicleName: string;
  vehicleType: string;
  vehicleProvider?: string;
  vehiclePrice?: number;
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
  
  // Customer Information
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Pricing
  totalPrice: number;
  
  // Additional Information
  notes?: string;
  specialRequests?: string;
}

// Multi-item order data
export interface MultiItemOrderData {
  // Order items
  items: OrderItem[];
  
  // Customer Information
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Pricing
  subtotal: number;
  tax: number;
  discount: number;
  totalPrice: number;
  currency: string;
  
  // Additional Information
  notes?: string;
  specialRequests?: string;
}

// Base order interface
export interface BaseOrder {
  id: string;
  orderNumber: string;
  customerId: string; // Firebase UID of the customer
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  
  // Order Source Tracking
  createdBy: string; // Firebase UID of who created the order
  createdByRole: 'customer' | 'telesale' | 'admin' | 'customer_service' | 'operation';
  source: 'website' | 'phone' | 'email' | 'walk_in';
  
  // Assignment
  assignedTo?: string; // Firebase UID of assigned staff
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Customer Information
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  
  // Additional Information
  notes?: string;
  specialRequests?: string;
}

// Legacy single-item order (for backward compatibility)
export interface Order extends OrderData, BaseOrder {
  // Inherits all fields from OrderData and BaseOrder
}

// Multi-item order
export interface MultiItemOrder extends BaseOrder {
  // Order items
  items: OrderItem[];
  
  // Pricing breakdown
  subtotal: number;
  tax: number;
  discount: number;
  currency: string;
  
  // Order fulfillment status
  fulfillmentStatus: 'pending' | 'partial' | 'fulfilled';
  
  // Item status summary
  itemStatusSummary: {
    pending: number;
    confirmed: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
}

// Generate order number
function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const timestamp = now.getTime().toString().slice(-6); // Last 6 digits of timestamp
  
  return `ORD-${year}${month}${day}-${timestamp}`;
}

// Get user role from Firestore
async function getUserRole(userId: string): Promise<string> {
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

// Determine order source based on creator role
function determineOrderSource(createdByRole: string): Order['source'] {
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

// Create order for customer (self-service)
export async function createCustomerOrder(
  orderData: OrderData,
  currentUser: User
): Promise<Order> {
  try {
    // For customer self-service orders, always use 'customer' role
    // This avoids unnecessary Firestore queries and potential permission issues
    const userRole = 'customer';
    
    console.log('Creating customer order - skipping role lookup for performance');
    
    // Filter out undefined values from orderData to avoid Firestore errors
    const cleanOrderData = Object.fromEntries(
      Object.entries(orderData).filter(([_, value]) => value !== undefined)
    ) as OrderData;
    
    const orderRaw: Omit<Order, 'id'> = {
      ...cleanOrderData,
      orderNumber: generateOrderNumber(),
      customerId: currentUser.uid, // Customer creates order for themselves
      totalPrice: orderData.totalPrice,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      // Source tracking
      createdBy: currentUser.uid,
      createdByRole: userRole as Order['createdByRole'],
      source: 'website',
      
      // Default assignment
      priority: 'medium'
    };
    
    // Final filter to ensure no undefined values reach Firestore
    const order = Object.fromEntries(
      Object.entries(orderRaw).filter(([_, value]) => value !== undefined)
    ) as Omit<Order, 'id'>;
    
    console.log('Creating customer order with data:', {
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      createdBy: order.createdBy,
      createdByRole: order.createdByRole,
      source: order.source,
      vehicleName: order.vehicleName,
      totalPrice: order.totalPrice
    });
    
    const docRef = await addDoc(collection(db, 'orders'), order);
    
    console.log('Customer order created successfully:', {
      orderId: docRef.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      createdBy: order.createdBy,
      createdByRole: order.createdByRole,
      source: order.source
    });
    
    // Return the complete order object with the generated ID
    const completeOrder: Order = {
      ...order,
      id: docRef.id
    };
    
    return completeOrder;
  } catch (error) {
    console.error('Error creating customer order:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      stack: error instanceof Error ? error.stack : undefined
    });
    throw new Error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Create order for customer by telesale/staff
export async function createOrderForCustomer(
  orderData: OrderData,
  currentUser: User // The staff member creating the order
): Promise<Order> {
  try {
    const staffRole = await getUserRole(currentUser.uid);
    
    // Verify staff has permission to create orders
    if (!['admin', 'telesale', 'customer_service', 'operation'].includes(staffRole)) {
      throw new Error('You do not have permission to create orders for customers.');
    }
    
    // Generate a customer ID based on email (for external customers)
    const customerId = `external_${orderData.customerEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
    
    // Filter out undefined values from orderData to avoid Firestore errors
    const cleanOrderData = Object.fromEntries(
      Object.entries(orderData).filter(([_, value]) => value !== undefined)
    ) as OrderData;
    
    const order: Omit<Order, 'id'> = {
      ...cleanOrderData,
      orderNumber: generateOrderNumber(),
      customerId: customerId, // Order belongs to the customer
      totalPrice: orderData.totalPrice,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      
      // Source tracking - shows who actually created it
      createdBy: currentUser.uid, // Staff member who created it
      createdByRole: staffRole as Order['createdByRole'],
      source: determineOrderSource(staffRole),
      
      // Default assignment
      assignedTo: currentUser.uid, // Assign to the staff member who created it
      priority: 'medium'
    };
    
    const docRef = await addDoc(collection(db, 'orders'), order);
    
    console.log('Staff order created for customer:', {
      orderId: docRef.id,
      orderNumber: order.orderNumber,
      customerId: order.customerId,
      createdBy: order.createdBy,
      createdByRole: order.createdByRole,
      source: order.source,
      assignedTo: order.assignedTo
    });
    
    // Return the complete order object with the generated ID
    const completeOrder: Order = {
      ...order,
      id: docRef.id
    };
    
    return completeOrder;
  } catch (error) {
    console.error('Error creating order for customer:', error);
    throw error;
  }
}

// Helper function to check if order was created by staff
export function isOrderCreatedByStaff(order: Order): boolean {
  return ['admin', 'telesale', 'customer_service', 'operation'].includes(order.createdByRole);
}

// Helper function to get order creation context
export function getOrderCreationContext(order: Order): string {
  if (order.createdBy === order.customerId) {
    return 'Created by customer via website';
  } else {
    return `Created by ${order.createdByRole} via ${order.source}`;
  }
}

// Create multi-item order
export async function createMultiItemOrder(
  orderData: MultiItemOrderData,
  currentUser: User
): Promise<MultiItemOrder> {
  try {
    const userRole = 'customer';
    
    // Initialize all items with pending status
    const itemsWithStatus = orderData.items.map(item => ({
      ...item,
      status: 'pending' as ItemStatus
    }));
    
    // Calculate item status summary
    const itemStatusSummary = {
      pending: itemsWithStatus.length,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0
    };
    
    const order: Omit<MultiItemOrder, 'id'> = {
      orderNumber: generateOrderNumber(),
      customerId: currentUser.uid,
      items: itemsWithStatus,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      discount: orderData.discount,
      totalPrice: orderData.totalPrice,
      currency: orderData.currency,
      status: 'pending',
      paymentStatus: 'pending',
      fulfillmentStatus: 'pending',
      itemStatusSummary,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: currentUser.uid,
      createdByRole: userRole as any,
      source: 'website',
      priority: 'medium',
      ...(orderData.notes && { notes: orderData.notes }),
      ...(orderData.specialRequests && { specialRequests: orderData.specialRequests })
    };

    // Filter out any undefined values from the order object
    const filteredOrder = Object.fromEntries(
      Object.entries(order).filter(([_, value]) => value !== undefined)
    ) as Omit<MultiItemOrder, 'id'>;
    
    console.log('Creating multi-item order with data:', {
      orderNumber: filteredOrder.orderNumber,
      customerId: filteredOrder.customerId,
      itemCount: filteredOrder.items.length,
      totalPrice: filteredOrder.totalPrice
    });
    
    const docRef = await addDoc(collection(db, 'orders'), filteredOrder);
    
    console.log('Multi-item order created successfully:', {
      orderId: docRef.id,
      orderNumber: filteredOrder.orderNumber,
      itemCount: filteredOrder.items.length
    });
    
    return {
      ...filteredOrder,
      id: docRef.id
    };
  } catch (error) {
    console.error('Error creating multi-item order:', error);
    throw new Error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Update item status in multi-item order
export async function updateOrderItemStatus(
  orderId: string,
  itemId: string,
  newStatus: ItemStatus
): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }
    
    const orderData = orderDoc.data() as MultiItemOrder;
    
    // Update the specific item status
    const updatedItems = orderData.items.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    );
    
    // Recalculate item status summary
    const itemStatusSummary = {
      pending: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0
    };
    
    updatedItems.forEach(item => {
      if (item.status in itemStatusSummary) {
        itemStatusSummary[item.status as keyof typeof itemStatusSummary]++;
      }
    });
    
    // Determine overall fulfillment status
    let fulfillmentStatus: 'pending' | 'partial' | 'fulfilled' = 'pending';
    const completedCount = itemStatusSummary.completed;
    const totalItems = updatedItems.length;
    
    if (completedCount === totalItems) {
      fulfillmentStatus = 'fulfilled';
    } else if (completedCount > 0) {
      fulfillmentStatus = 'partial';
    }
    
    // Update order status based on fulfillment
    let orderStatus = orderData.status;
    if (fulfillmentStatus === 'fulfilled') {
      orderStatus = 'completed';
    } else if (fulfillmentStatus === 'partial') {
      orderStatus = 'in_progress';
    }
    
    await updateDoc(orderRef, {
      items: updatedItems,
      itemStatusSummary,
      fulfillmentStatus,
      status: orderStatus,
      updatedAt: serverTimestamp()
    });
    
    console.log('Order item status updated:', {
      orderId,
      itemId,
      newStatus,
      fulfillmentStatus,
      orderStatus
    });
  } catch (error) {
    console.error('Error updating order item status:', error);
    throw error;
  }
}

// Check if order can be fulfilled (all items completed)
export function canOrderBeFulfilled(order: MultiItemOrder): boolean {
  return order.items.every(item => item.status === 'completed');
}

// Get order fulfillment progress
export function getOrderFulfillmentProgress(order: MultiItemOrder): {
  completed: number;
  total: number;
  percentage: number;
} {
  const completed = order.itemStatusSummary.completed;
  const total = order.items.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return { completed, total, percentage };
}

// Function to get customer orders (updated to handle both types)
export async function getCustomerOrders(customerId: string): Promise<(Order | MultiItemOrder)[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: (Order | MultiItemOrder)[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      orders.push({
        id: doc.id,
        ...data
      } as Order | MultiItemOrder);
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }
}

// Helper function to determine if order is multi-item
export function isMultiItemOrder(order: Order | MultiItemOrder): order is MultiItemOrder {
  return 'items' in order && Array.isArray(order.items);
}