'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile } from '@/lib/userService';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { UserProfile } from '@/lib/userService';

export default function UserProfileDebugger() {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user) {
      checkUserProfile();
    }
  }, [user]);

  const checkUserProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Check if profile exists in Firestore
      const firestoreProfile = await getUserProfile(user.uid);
      
      setDebugInfo({
        authUser: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime
        },
        contextProfile: userProfile,
        firestoreProfile: firestoreProfile,
        profileExists: !!firestoreProfile,
        profileMismatch: userProfile !== firestoreProfile
      });
    } catch (error) {
      console.error('Error checking user profile:', error);
      toast.error('Failed to check user profile');
    } finally {
      setLoading(false);
    }
  };

  const createMissingProfile = async () => {
    if (!user) return;
    
    setCreating(true);
    try {
      const userProfileData: UserProfile = {
        uid: user.uid,
        email: user.email!,
        displayName: user.displayName || user.email!.split('@')[0],
        role: 'customer',
        permissions: ['view_own_bookings', 'manage_own_profile'],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true
      };
      
      // Save to Firestore
      await setDoc(doc(db, 'users', user.uid), userProfileData);
      
      // Refresh the user profile in context
      await refreshUserProfile();
      
      // Re-check the profile
      await checkUserProfile();
      
      toast.success('User profile created successfully!');
    } catch (error) {
      console.error('Error creating user profile:', error);
      toast.error('Failed to create user profile');
    } finally {
      setCreating(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-semibold text-yellow-800">User Profile Debugger</h3>
        <p className="text-yellow-700">No authenticated user found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-semibold text-blue-800 mb-4">User Profile Debugger</h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={checkUserProfile}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check Profile'}
          </button>
          
          {debugInfo && !debugInfo.profileExists && (
            <button
              onClick={createMissingProfile}
              disabled={creating}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Profile'}
            </button>
          )}
        </div>
        
        {debugInfo && (
          <div className="space-y-3">
            <div className="p-3 bg-white rounded border">
              <h4 className="font-medium text-gray-800">Status Summary</h4>
              <div className="mt-2 space-y-1 text-sm">
                <div className={`flex items-center gap-2 ${debugInfo.profileExists ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${debugInfo.profileExists ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  Profile in Firestore: {debugInfo.profileExists ? 'EXISTS' : 'MISSING'}
                </div>
                <div className={`flex items-center gap-2 ${userProfile ? 'text-green-600' : 'text-red-600'}`}>
                  <span className={`w-2 h-2 rounded-full ${userProfile ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  Profile in Context: {userProfile ? 'LOADED' : 'NOT LOADED'}
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-white rounded border">
              <h4 className="font-medium text-gray-800">Firebase Auth User</h4>
              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                {JSON.stringify(debugInfo.authUser, null, 2)}
              </pre>
            </div>
            
            {debugInfo.firestoreProfile && (
              <div className="p-3 bg-white rounded border">
                <h4 className="font-medium text-gray-800">Firestore Profile</h4>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(debugInfo.firestoreProfile, null, 2)}
                </pre>
              </div>
            )}
            
            {debugInfo.contextProfile && (
              <div className="p-3 bg-white rounded border">
                <h4 className="font-medium text-gray-800">Context Profile</h4>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(debugInfo.contextProfile, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}