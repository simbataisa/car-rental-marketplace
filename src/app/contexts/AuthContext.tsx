'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile, UserProfile } from '@/lib/userService';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useLoading } from './LoadingContext';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { withLoading } = useLoading();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Load user profile from Firestore
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshUserProfile = async () => {
    if (user) {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    }
  };

  const signUp = async (email: string, password: string, displayName: string): Promise<void> => {
    const promise = (async () => {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(result.user, { displayName });
      
      // Create customer profile in Firestore
      const userProfile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName,
        role: 'customer',
        permissions: ['view_own_bookings', 'manage_own_profile'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      };
      
      // Save customer profile to Firestore
      await setDoc(doc(db, 'users', result.user.uid), userProfile);
      
      toast.success('Account created successfully!');
      return result;
    })();
    
    try {
      await withLoading(promise, 'Creating your account...');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    const promise = (async () => {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
      return result;
    })();
    
    try {
      await withLoading(promise, 'Signing you in...');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    const promise = (async () => {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user profile exists, if not create customer profile
      const existingProfile = await getUserProfile(result.user.uid);
      if (!existingProfile) {
        const userProfile: UserProfile = {
          uid: result.user.uid,
          email: result.user.email!,
          displayName: result.user.displayName || 'Google User',
          role: 'customer',
          permissions: ['view_own_bookings', 'manage_own_profile'],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          isActive: true
        };
        
        // Save customer profile to Firestore
        await setDoc(doc(db, 'users', result.user.uid), userProfile);
      }
      
      toast.success('Signed in with Google successfully!');
      return result;
    })();
    
    try {
      await withLoading(promise, 'Signing in with Google...');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google');
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    const promise = (async () => {
      await signOut(auth);
      toast.success('Signed out successfully!');
    })();
    
    try {
      await withLoading(promise, 'Signing you out...');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    const promise = (async () => {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    })();
    
    try {
      await withLoading(promise, 'Sending password reset email...');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send password reset email');
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}