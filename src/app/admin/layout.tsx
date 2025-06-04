'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { getUserProfile } from '@/lib/userService';
import type { UserRole } from '@/lib/userService';
import { toast } from 'sonner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!loading && !user) {
        router.push('/login');
        return;
      }

      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (!profile) {
            router.push('/');
            return;
          }
          
          // Only allow admin and staff to access admin routes
          if (profile.role !== 'admin') {
            router.push('/');
            return;
          }
          
          setUserRole(profile.role);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          router.push('/');
          return;
        }
      }
      setIsAuthorized(true);
    };

    checkAccess();
  }, [user, loading, router]);

  // Show loading while checking authentication
  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verifying access...</p>
        </div>
      </div>
    );
  }

  // Render admin content only for authorized users
  return <>{children}</>;
}