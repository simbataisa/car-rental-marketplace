import { db } from './firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { User } from 'firebase/auth';

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
  returnDate?: Date;
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

export interface Order extends OrderData {
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
    
    const order: Omit<Order, 'id'> = {
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
    
    const order: Omit<Order, 'id'> = {
      ...orderData,
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

// Function to get customer orders
export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }
}