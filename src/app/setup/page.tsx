'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initializeDefaultAdmin, getUsersByRole } from '@/lib/userService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function SetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkingAdmins, setCheckingAdmins] = useState(true);
  const [adminExists, setAdminExists] = useState(false);
  const [setupAllowed, setSetupAllowed] = useState(false);
  const [setupToken, setSetupToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });

  useEffect(() => {
    checkSetupPermissions();
  }, []);

  const checkSetupPermissions = async () => {
    try {
      setCheckingAdmins(true);
      
      // Check if admins already exist
      const admins = await getUsersByRole('admin');
      const hasAdmins = admins.length > 0;
      setAdminExists(hasAdmins);
      
      // If admins exist, setup is not allowed
      if (hasAdmins) {
        setSetupAllowed(false);
        return;
      }
      
      // Check environment-based setup permissions
      const isDevelopment = process.env.NODE_ENV === 'development';
      const allowSetup = process.env.NEXT_PUBLIC_ALLOW_SETUP === 'true';
      
      // In development, allow setup without token
      if (isDevelopment && allowSetup) {
        setSetupAllowed(true);
      } else {
        // In production or when setup is restricted, require token
        setShowTokenInput(true);
      }
      
    } catch (error) {
      console.error('Error checking setup permissions:', error);
      setSetupAllowed(false);
    } finally {
      setCheckingAdmins(false);
    }
  };
  
  const validateSetupToken = () => {
    const validToken = process.env.NEXT_PUBLIC_SETUP_TOKEN;
    if (!validToken) {
      toast.error('Setup token not configured. Contact system administrator.');
      return false;
    }
    
    if (setupToken === validToken) {
      setSetupAllowed(true);
      setShowTokenInput(false);
      toast.success('Setup token validated successfully!');
      return true;
    } else {
      toast.error('Invalid setup token. Access denied.');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Double-check permissions before proceeding
    if (!setupAllowed) {
      toast.error('Setup not allowed. Invalid permissions.');
      return;
    }
    
    // Re-verify no admins exist (prevent race conditions)
    try {
      const admins = await getUsersByRole('admin');
      if (admins.length > 0) {
        toast.error('Admin account already exists. Setup cancelled.');
        setAdminExists(true);
        return;
      }
    } catch (error) {
      toast.error('Unable to verify system state. Setup cancelled.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      await initializeDefaultAdmin(
        formData.email,
        formData.password,
        formData.displayName || 'System Administrator'
      );
      
      toast.success('Admin account created successfully! You can now sign in.');
      router.push('/login');
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast.error(error.message || 'Failed to create admin account');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmins) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Checking system setup...</p>
        </div>
      </div>
    );
  }

  if (adminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <CardTitle>System Already Configured</CardTitle>
            <CardDescription>
              An administrator account already exists. The setup page is now disabled for security.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/login')} 
              className="w-full"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (showTokenInput && !setupAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <CardTitle>Setup Access Required</CardTitle>
            <CardDescription>
              This system is protected. Enter the setup token to proceed with initial configuration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Security Notice</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Setup access is restricted in production environments. Contact your system administrator for the setup token.
                  </p>
                </div>
              </div>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); validateSetupToken(); }} className="space-y-4">
              <div>
                <Label htmlFor="setupToken">Setup Token</Label>
                <Input
                  id="setupToken"
                  type="password"
                  placeholder="Enter setup token"
                  value={setupToken}
                  onChange={(e) => setSetupToken(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Validate Token
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <button 
                onClick={() => router.push('/login')}
                className="text-sm text-blue-600 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!setupAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader className="text-center">
            <Lock className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <CardTitle>Setup Not Allowed</CardTitle>
            <CardDescription>
              System setup is disabled. Contact your administrator if you need to initialize the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/login')} 
              className="w-full"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <CardTitle>System Setup</CardTitle>
          <CardDescription>
            Create the first administrator account to get started with your car rental management system.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-yellow-800">Security Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  This admin account will have full system access. After creation, this setup page will be permanently disabled for security.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="displayName">Administrator Name</Label>
              <Input
                id="displayName"
                type="text"
                placeholder="e.g., John Smith"
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@yourcompany.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                minLength={6}
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                required
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Creating Admin Account...' : 'Create Administrator Account'}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an admin account?{' '}
              <button 
                onClick={() => router.push('/login')}
                className="text-blue-600 hover:underline"
              >
                Sign in here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}