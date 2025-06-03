# Firestore Permissions Troubleshooting Guide

If you're encountering "Missing or insufficient permissions" errors, this guide will help you resolve them.

## Common Error Messages

- `FirebaseError: [code=permission-denied]: Missing or insufficient permissions`
- `PERMISSION_DENIED: Missing or insufficient permissions`
- `FirebaseFirestoreException: PERMISSION_DENIED`

## Root Causes and Solutions

### 1. Authentication Issues

**Problem**: User is not properly authenticated when making Firestore requests.

**Solutions**:

#### Check Authentication State
```javascript
// In your component, verify user is authenticated
import { useAuth } from '@/app/contexts/AuthContext';

const { user, loading } = useAuth();

if (loading) {
  return <div>Loading...</div>;
}

if (!user) {
  return <div>Please sign in to access this feature.</div>;
}
```

#### Ensure Auth State is Initialized
```javascript
// Wait for auth state to be determined before making Firestore calls
useEffect(() => {
  if (user && !loading) {
    // Now it's safe to make Firestore requests
    fetchUserData();
  }
}, [user, loading]);
```

### 2. Firestore Security Rules Issues

**Problem**: Security rules are too restrictive or incorrectly configured.

#### Current Rules (from FIREBASE_SETUP.md)
Our current rules require authentication and role-based access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Allow admins to read all user documents
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      // Allow admins to create new user documents
      allow create: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

#### Temporary Testing Rules (Development Only)
If you need to test quickly, use these **INSECURE** rules temporarily:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **WARNING**: Never use these rules in production!

#### Time-Limited Testing Rules
For short-term testing (replace date with tomorrow's date):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2024, 12, 31);
    }
  }
}
```

### 3. First Admin Account Setup Issue

**Problem**: No admin user exists, creating a circular dependency.

**Solution**: Use the setup page with temporary rules:

1. **Temporarily update Firestore rules** to allow user creation:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Allow any authenticated user to create their own document
      allow create: if request.auth != null && request.auth.uid == userId;
      // Allow reading own document
      allow read: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

2. **Create your first admin** at `/setup`

3. **Restore secure rules** after admin creation

### 4. Network/Connection Issues

**Problem**: Client appears offline or has connectivity issues.

**Solutions**:

#### Check Network Connection
```javascript
// Add to your firebase.ts file
export async function checkFirestoreConnection(): Promise<boolean> {
  try {
    await enableNetwork(db);
    return true;
  } catch (error) {
    console.error('Firestore connection failed:', error);
    return false;
  }
}
```

#### Force Network Reconnection
```javascript
import { enableNetwork, disableNetwork } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Reconnect to Firestore
async function reconnectFirestore() {
  try {
    await disableNetwork(db);
    await enableNetwork(db);
    console.log('Firestore reconnected');
  } catch (error) {
    console.error('Failed to reconnect:', error);
  }
}
```

### 5. Environment Configuration Issues

**Problem**: Firebase configuration is missing or incorrect.

**Check List**:

1. ✅ `.env.local` file exists and contains all required variables
2. ✅ Firebase project ID matches your actual project
3. ✅ API key is valid and not restricted
4. ✅ Auth domain is correct

#### Verify Configuration
```javascript
// Add to your firebase.ts for debugging
console.log('Firebase Config:', {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // Don't log the API key for security
});
```

## Step-by-Step Debugging Process

### Step 1: Verify Authentication
```javascript
// Add this to your component to debug auth state
console.log('Auth State:', { user, loading });
console.log('User UID:', user?.uid);
console.log('User Email:', user?.email);
```

### Step 2: Test with Permissive Rules
1. Go to Firebase Console > Firestore > Rules
2. Temporarily use:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
3. Test your functionality
4. If it works, the issue is with your security rules
5. If it doesn't work, the issue is with authentication or configuration

### Step 3: Check Browser Console
Look for additional error messages that might provide more context:
- Authentication errors
- Network errors
- Configuration errors

### Step 4: Use Firestore Rules Simulator
1. Go to Firebase Console > Firestore > Rules
2. Click "Rules Playground"
3. Simulate your requests to see which rules are blocking them

## Production-Ready Security Rules

Once you've resolved the immediate issue, use these secure rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection with role-based access
    match /users/{userId} {
      // Users can read their own profile
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Users can update their own profile (limited fields)
      allow update: if request.auth != null && 
        request.auth.uid == userId &&
        !('role' in request.resource.data.diff(resource.data).affectedKeys()) &&
        !('permissions' in request.resource.data.diff(resource.data).affectedKeys());
      
      // Admins can read all user profiles
      allow read: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      
      // Admins can create and update user profiles
      allow create, update: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'customer_service', 'telesale', 'operation'];
    }
    
    // Vehicles collection
    match /vehicles/{vehicleId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'operation'];
    }
  }
}
```

## Quick Fixes

### For Development/Testing
1. Use permissive rules temporarily
2. Ensure user is signed in before making requests
3. Check browser console for detailed errors

### For Production
1. Implement proper role-based security rules
2. Add error handling for permission denied cases
3. Provide user-friendly error messages

## Common Mistakes to Avoid

1. **Making Firestore requests before auth state is determined**
2. **Using overly permissive rules in production**
3. **Not handling authentication state changes**
4. **Forgetting to update rules after creating admin users**
5. **Not testing rules with the Firestore simulator**

## Need More Help?

1. Check the browser console for detailed error messages
2. Use the Firestore Rules Playground to test your rules
3. Verify your Firebase project configuration
4. Ensure your authentication flow is working correctly

If you're still having issues, the problem is likely one of:
- Authentication not properly initialized
- Security rules too restrictive
- Network/configuration issues
- Circular dependency with admin user creation