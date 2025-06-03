'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  createUserAccount, 
  getUserProfile, 
  getAllStaffUsers, 
  updateUserRole, 
  deactivateUser,
  UserProfile,
  UserRole,
  hasPermission,
  isAdmin
} from '@/lib/userService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, UserPlus, Shield, Settings, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

const ROLE_COLORS = {
  admin: 'bg-red-100 text-red-800',
  customer_service: 'bg-blue-100 text-blue-800',
  telesale: 'bg-green-100 text-green-800',
  operation: 'bg-yellow-100 text-yellow-800',
  customer: 'bg-gray-100 text-gray-800'
};

const DEPARTMENTS: Record<Exclude<UserRole, 'customer'>, string[]> = {
  admin: ['IT', 'Management', 'System Administration'],
  customer_service: ['Customer Support', 'Help Desk', 'Quality Assurance'],
  telesale: ['Sales', 'Lead Generation', 'Business Development'],
  operation: ['Fleet Management', 'Maintenance', 'Logistics']
};

export default function UserManagementPage() {
  const { user } = useAuth();
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [staffUsers, setStaffUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    role: '' as UserRole,
    department: ''
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const profile = await getUserProfile(user.uid);
      setCurrentUserProfile(profile);
      
      if (profile && isAdmin(profile)) {
        const users = await getAllStaffUsers();
        setStaffUsers(users);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserProfile || !isAdmin(currentUserProfile)) {
      toast.error('Unauthorized: Admin access required');
      return;
    }

    try {
      await createUserAccount(
        formData.email,
        formData.password,
        formData.displayName,
        formData.role,
        formData.department,
        user?.uid
      );
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        displayName: '',
        role: '' as UserRole,
        department: ''
      });
      
      setIsCreateDialogOpen(false);
      loadUserData(); // Refresh the list
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateRole = async (targetUid: string, newRole: UserRole) => {
    if (!currentUserProfile || !isAdmin(currentUserProfile)) {
      toast.error('Unauthorized: Admin access required');
      return;
    }

    try {
      await updateUserRole(targetUid, newRole, user?.uid || '');
      loadUserData(); // Refresh the list
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleDeactivateUser = async (targetUid: string) => {
    if (!currentUserProfile || !isAdmin(currentUserProfile)) {
      toast.error('Unauthorized: Admin access required');
      return;
    }

    if (targetUid === user?.uid) {
      toast.error('Cannot deactivate your own account');
      return;
    }

    try {
      await deactivateUser(targetUid, user?.uid || '');
      loadUserData(); // Refresh the list
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading user management...</p>
        </div>
      </div>
    );
  }

  if (!currentUserProfile || !isAdmin(currentUserProfile)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need administrator privileges to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage user accounts and roles for your organization</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Create New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User Account</DialogTitle>
                <DialogDescription>
                  Create a new account for staff members with appropriate role and permissions.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
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
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    minLength={6}
                  />
                </div>
                
                <div>
                  <Label htmlFor="displayName">Full Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value: UserRole) => {
                      setFormData({...formData, role: value, department: ''});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="customer_service">Customer Service</SelectItem>
                      <SelectItem value="telesale">Telesale</SelectItem>
                      <SelectItem value="operation">Operation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {formData.role && (
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Select 
                      value={formData.department} 
                      onValueChange={(value) => setFormData({...formData, department: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS[formData.role as keyof typeof DEPARTMENTS]?.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">Create Account</Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {(['admin', 'customer_service', 'telesale', 'operation'] as UserRole[]).map((role) => {
          const count = staffUsers.filter(u => u.role === role && u.isActive).length;
          return (
            <Card key={role}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 capitalize">
                      {role.replace('_', ' ')}
                    </p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Members</CardTitle>
          <CardDescription>
            Manage all staff accounts and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffUsers.map((staffUser) => (
                <TableRow key={staffUser.uid}>
                  <TableCell className="font-medium">{staffUser.displayName}</TableCell>
                  <TableCell>{staffUser.email}</TableCell>
                  <TableCell>
                    <Badge className={ROLE_COLORS[staffUser.role]}>
                      {staffUser.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{staffUser.department || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={staffUser.isActive ? 'default' : 'secondary'}>
                      {staffUser.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedUser(staffUser);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      {staffUser.uid !== user?.uid && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeactivateUser(staffUser.uid)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogDescription>
              Update the role and permissions for {selectedUser?.displayName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>Current Role</Label>
                <p className="text-sm text-gray-600 capitalize">
                  {selectedUser.role.replace('_', ' ')}
                </p>
              </div>
              
              <div>
                <Label htmlFor="newRole">New Role</Label>
                <Select 
                  defaultValue={selectedUser.role}
                  onValueChange={(value: UserRole) => {
                    handleUpdateRole(selectedUser.uid, value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="customer_service">Customer Service</SelectItem>
                    <SelectItem value="telesale">Telesale</SelectItem>
                    <SelectItem value="operation">Operation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}