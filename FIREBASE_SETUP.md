# Firebase Setup Guide

This guide will help you set up Firebase Authentication and Firestore for your car rental marketplace application.

## Prerequisites

- A Google account
- Node.js installed on your machine
- This project cloned locally

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "car-rental-marketplace")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following sign-in providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and add your project's domain

## Step 3: Create Firestore Database

1. In your Firebase project console, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development) or "Start in production mode" (for production)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## Step 4: Get Firebase Configuration

1. In your Firebase project console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click "Web" icon (</>) to add a web app
5. Enter an app nickname (e.g., "car-rental-web")
6. Click "Register app"
7. Copy the Firebase configuration object

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here
   ```

## Step 6: Set Up Firestore Security Rules

For development, you can use these basic rules. **Update them for production!**

1. Go to Firestore Database > Rules
2. Replace the default rules with:

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
    
    // Orders collection - role-based access
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

3. Click "Publish"

## Step 7: Initialize Your First Admin Account

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3001/setup`
3. Create your first administrator account
4. This account will have full system privileges

## Step 8: Test the Setup

1. Try signing in with your admin account
2. Navigate to User Management to create additional accounts
3. Test creating users with different roles

## Troubleshooting

### "Client is offline" Error

If you see this error:
```
FirebaseError: Failed to get document because the client is offline
```

**Solutions:**
1. Check your internet connection
2. Verify your Firebase configuration in `.env.local`
3. Ensure Firestore is properly initialized in your Firebase project
4. Check browser console for additional error details
5. Try refreshing the page or restarting the development server

### Configuration Issues

1. **Missing environment variables**: Check that all required Firebase variables are set in `.env.local`
2. **Invalid project ID**: Ensure `NEXT_PUBLIC_FIREBASE_PROJECT_ID` matches your Firebase project
3. **Authentication domain**: Verify `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is correct

### Permission Denied Errors

1. Check Firestore security rules
2. Ensure the user has the correct role in the database
3. Verify the user is properly authenticated

## Production Considerations

1. **Security Rules**: Update Firestore rules for production use
2. **API Key Restrictions**: Restrict your Firebase API keys to your domain
3. **Environment Variables**: Use secure environment variable management
4. **Backup**: Set up regular Firestore backups
5. **Monitoring**: Enable Firebase monitoring and alerts

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your Firebase project settings
3. Ensure all environment variables are correctly set
4. Review the Firestore security rules

For more detailed Firebase documentation, visit: https://firebase.google.com/docs