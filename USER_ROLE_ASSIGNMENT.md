# User Role Assignment System

## Overview

This document explains how user roles are assigned in the car rental marketplace system, ensuring proper access control and security.

## Role Assignment Rules

### 1. Regular User Signup (Customer Role)

**Path**: `/signup`

- **Default Role**: `customer`
- **Permissions**: 
  - `view_own_bookings`
  - `manage_own_profile`
- **Access Level**: Can only view and manage their own bookings
- **Creation Method**: Automatic profile creation in Firestore with customer role

#### Signup Methods:
- **Email/Password Signup**: Creates customer profile automatically
- **Google Sign-in**: Creates customer profile if none exists

### 2. Admin Account Creation (Admin Role)

**Path**: `/setup`

- **Default Role**: `admin`
- **Permissions**: Full system access (all permissions)
- **Access Level**: Can manage all users, bookings, and system settings
- **Creation Method**: Manual setup through protected setup page
- **Security**: 
  - Only available when no admin exists
  - Protected by setup token in production
  - Permanently disabled after first admin creation

### 3. Internal Staff Account Creation

**Path**: `/admin/users` (Admin-only)

- **Available Roles**: 
  - `admin`: Full system access
  - `customer_service`: Customer support capabilities
  - `telesale`: Sales and booking management
  - `operation`: Vehicle and fleet management
- **Creation Method**: Admin users can create internal staff accounts
- **Permissions**: Role-based permissions as defined in `userService.ts`

## Implementation Details

### AuthContext Modifications

```typescript
// Regular signup - automatically assigns customer role
const signUp = async (email: string, password: string, displayName: string) => {
  // Creates Firebase Auth user
  const result = await createUserWithEmailAndPassword(auth, email, password);
  
  // Automatically creates customer profile in Firestore
  const userProfile: UserProfile = {
    uid: result.user.uid,
    email: result.user.email!,
    displayName,
    role: 'customer',  // Default role for regular signups
    permissions: ['view_own_bookings', 'manage_own_profile'],
    // ... other fields
  };
  
  await setDoc(doc(db, 'users', result.user.uid), userProfile);
};
```

### Setup Page Logic

```typescript
// Admin creation through setup page
const handleSubmit = async (e: React.FormEvent) => {
  // Calls initializeDefaultAdmin which creates admin role
  await initializeDefaultAdmin(
    formData.email,
    formData.password,
    formData.displayName
  );
};
```

## Security Considerations

### 1. Role Verification
- All role assignments are verified server-side
- Frontend role checks are supplemented by backend validation
- User profiles are stored in Firestore with proper security rules

### 2. Setup Page Protection
- Setup page is only accessible when no admin exists
- Production environments require setup token
- Setup page is permanently disabled after admin creation

### 3. Permission System
- Each role has specific permissions defined in `ROLE_PERMISSIONS`
- Permissions are checked for sensitive operations
- Customer users have minimal permissions (own data only)

## User Experience Flow

### New Customer Journey
1. User visits `/signup`
2. Completes registration form
3. Account created with `customer` role automatically
4. Can immediately access their booking management
5. Redirected to customer-focused interface

### Admin Setup Journey
1. System administrator visits `/setup`
2. Verifies no existing admin accounts
3. Provides setup token (if required)
4. Creates admin account with full permissions
5. Setup page becomes permanently disabled
6. Can create additional staff accounts through admin panel

### Staff Account Creation
1. Admin logs into admin panel
2. Navigates to User Management
3. Creates staff accounts with appropriate roles
4. Staff members receive login credentials
5. Staff can access role-appropriate features

## Role Permissions Matrix

| Permission | Customer | Customer Service | Telesale | Operation | Admin |
|------------|----------|------------------|----------|-----------|-------|
| View Own Bookings | ✓ | ✓ | ✓ | ✓ | ✓ |
| View All Bookings | ✗ | ✓ | Partial* | ✓ | ✓ |
| Manage Orders | ✗ | ✓ | ✓ | ✓ | ✓ |
| Manage Users | ✗ | ✗ | ✗ | ✗ | ✓ |
| Manage Vehicles | ✗ | ✗ | ✗ | ✓ | ✓ |
| View Analytics | ✗ | ✗ | ✗ | ✗ | ✓ |
| System Settings | ✗ | ✗ | ✗ | ✗ | ✓ |

*Telesale can only see orders from phone/email sources

## Testing Scenarios

### Customer Role Assignment
1. Create new account via signup page
2. Verify customer role is assigned
3. Confirm limited permissions
4. Test Google sign-in role assignment

### Admin Role Assignment
1. Access setup page when no admin exists
2. Create admin account
3. Verify full permissions
4. Confirm setup page is disabled

### Staff Role Assignment
1. Login as admin
2. Create staff accounts with different roles
3. Verify role-specific permissions
4. Test role-based UI adaptations

This system ensures proper role assignment while maintaining security and providing appropriate access levels for different user types.