import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from './firebase';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'customer_service' | 'telesale' | 'operation' | 'customer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  department?: string;
  permissions: string[];
  createdAt: any;
  updatedAt: any;
  isActive: boolean;
  createdBy?: string;
  phone?: string;
}

// Role-based permissions
const ROLE_PERMISSIONS = {
  admin: [
    'manage_users',
    'manage_orders',
    'manage_vehicles',
    'view_analytics',
    'manage_system_settings',
    'access_all_data'
  ],
  customer_service: [
    'manage_orders',
    'view_customer_data',
    'handle_complaints',
    'process_refunds',
    'view_bookings'
  ],
  telesale: [
    'create_orders',
    'view_customer_data',
    'manage_leads',
    'view_vehicles',
    'process_bookings'
  ],
  operation: [
    'manage_vehicles',
    'view_orders',
    'update_vehicle_status',
    'manage_maintenance',
    'view_fleet_data'
  ],
  customer: [
    'view_own_bookings',
    'create_bookings',
    'update_profile',
    'view_vehicles'
  ]
};

/**
 * Create a new user account with role assignment
 */
export async function createUserAccount(
  email: string,
  password: string,
  displayName: string,
  role: UserRole,
  department?: string,
  createdByUid?: string
): Promise<UserProfile> {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName });

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      role,
      ...(department && { department }),
      permissions: ROLE_PERMISSIONS[role],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      ...(createdByUid && { createdBy: createdByUid })
    };

    // Save to Firestore
    await setDoc(doc(db, 'users', user.uid), userProfile);

    toast.success(`${role} account created successfully for ${displayName}`);
    return userProfile;
  } catch (error: any) {
    toast.error(error.message || 'Failed to create user account');
    throw error;
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Update user role and permissions
 */
export async function updateUserRole(
  uid: string,
  newRole: UserRole,
  updatedByUid: string
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      role: newRole,
      permissions: ROLE_PERMISSIONS[newRole],
      updatedAt: serverTimestamp(),
      updatedBy: updatedByUid
    });
    
    toast.success('User role updated successfully');
  } catch (error: any) {
    toast.error(error.message || 'Failed to update user role');
    throw error;
  }
}

/**
 * Get all users by role
 */
export async function getUsersByRole(role: UserRole): Promise<UserProfile[]> {
  try {
    const q = query(collection(db, 'users'), where('role', '==', role));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserProfile);
  } catch (error) {
    console.error('Error fetching users by role:', error);
    return [];
  }
}

/**
 * Get all staff users (non-customers)
 */
export async function getAllStaffUsers(): Promise<UserProfile[]> {
  try {
    const q = query(
      collection(db, 'users'), 
      where('role', 'in', ['admin', 'customer_service', 'telesale', 'operation'])
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserProfile);
  } catch (error) {
    console.error('Error fetching staff users:', error);
    return [];
  }
}

/**
 * Deactivate user account
 */
export async function deactivateUser(uid: string, deactivatedByUid: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      isActive: false,
      updatedAt: serverTimestamp(),
      deactivatedBy: deactivatedByUid,
      deactivatedAt: serverTimestamp()
    });
    
    toast.success('User account deactivated');
  } catch (error: any) {
    toast.error(error.message || 'Failed to deactivate user');
    throw error;
  }
}

/**
 * Check if user has specific permission
 */
export function hasPermission(userProfile: UserProfile | null, permission: string): boolean {
  if (!userProfile || !userProfile.isActive) return false;
  return userProfile.permissions.includes(permission);
}

/**
 * Check if user has admin privileges
 */
export function isAdmin(userProfile: UserProfile | null): boolean {
  return userProfile?.role === 'admin' && userProfile.isActive;
}

/**
 * Initialize default admin account (for first-time setup)
 */
export async function initializeDefaultAdmin(
  email: string,
  password: string,
  displayName: string = 'System Administrator'
): Promise<UserProfile> {
  try {
    // Check if any admin exists
    const existingAdmins = await getUsersByRole('admin');
    if (existingAdmins.length > 0) {
      throw new Error('Admin account already exists');
    }

    return await createUserAccount(email, password, displayName, 'admin');
  } catch (error: any) {
    toast.error(error.message || 'Failed to initialize admin account');
    throw error;
  }
}