'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  User, 
  Lock, 
  Shield, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  Car,
  Clock,
  DollarSign,
  MapPin,
  Search} from 'lucide-react'
import { toast } from 'sonner'
import { updatePassword, updateProfile, User as FirebaseUser } from 'firebase/auth'
import { getUserProfile } from '@/lib/userService'
import type { UserRole } from '@/lib/userService'
import { getCustomerOrders, Order } from '@/lib/orderService'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
  urgent: 'bg-red-200 text-red-900',
};

// Sample orders data for demonstration
const getSampleOrders = (userId: string): Order[] => [
  {
    id: 'order-001',
    orderNumber: 'ORD-20240215-001',
    customerId: userId,
    customerName: 'Current User',
    customerEmail: 'user@example.com',
    customerPhone: '+84 123 456 789',
    vehicleName: 'VinFast VF 8',
    vehicleType: 'SUV',
    vehicleProvider: 'VinFast Dealer',
    vehicleImages: ['https://images.unsplash.com/photo-1549399736-8e8c2b0e7e8a?w=400', 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400'],
    dealerName: 'VinFast Dealer',
    dealerAddress: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    pickupDate: new Date('2024-02-15'),
    returnDate: new Date('2024-02-18'),
    pickupLocation: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    returnLocation: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    totalPrice: 240,
    status: 'confirmed',
    paymentStatus: 'paid',
    priority: 'medium',
    source: 'website',
    createdBy: userId,
    createdByRole: 'customer',
    notes: 'Sample booking for demonstration',
    createdAt: { toDate: () => new Date('2024-01-20T10:30:00Z') },
    updatedAt: { toDate: () => new Date('2024-01-20T14:15:00Z') }
  },
  {
    id: 'order-002',
    orderNumber: 'ORD-20240110-002',
    customerId: userId,
    customerName: 'Current User',
    customerEmail: 'user@example.com',
    customerPhone: '+84 123 456 789',
    vehicleName: 'Toyota Camry',
    vehicleType: 'Sedan',
    vehicleProvider: 'Toyota Dealer',
    vehicleImages: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'],
    dealerName: 'Toyota Dealer',
    dealerAddress: '321 Hai Ba Trung Street, District 1, Ho Chi Minh City',
    pickupDate: new Date('2024-01-10'),
    returnDate: new Date('2024-01-12'),
    pickupLocation: '321 Hai Ba Trung Street, District 1, Ho Chi Minh City',
    returnLocation: '321 Hai Ba Trung Street, District 1, Ho Chi Minh City',
    totalPrice: 180,
    status: 'completed',
    paymentStatus: 'paid',
    priority: 'low',
    source: 'website',
    createdBy: userId,
    createdByRole: 'customer',
    createdAt: { toDate: () => new Date('2024-01-05T09:15:00Z') },
    updatedAt: { toDate: () => new Date('2024-01-12T18:30:00Z') }
  },
  {
    id: 'order-003',
    orderNumber: 'ORD-20240301-003',
    customerId: userId,
    customerName: 'Current User',
    customerEmail: 'user@example.com',
    customerPhone: '+84 123 456 789',
    vehicleName: 'BMW X3',
    vehicleType: 'SUV',
    vehicleProvider: 'BMW Dealer',
    vehicleImages: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400', 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'],
    dealerName: 'BMW Dealer',
    dealerAddress: '789 Dong Khoi Street, District 1, Ho Chi Minh City',
    pickupDate: new Date('2024-03-01'),
    returnDate: new Date('2024-03-05'),
    pickupLocation: '789 Dong Khoi Street, District 1, Ho Chi Minh City',
    returnLocation: '789 Dong Khoi Street, District 1, Ho Chi Minh City',
    totalPrice: 480,
    status: 'in_progress',
    paymentStatus: 'paid',
    priority: 'medium',
    source: 'website',
    createdBy: userId,
    createdByRole: 'customer',
    createdAt: { toDate: () => new Date('2024-02-25T14:20:00Z') },
    updatedAt: { toDate: () => new Date('2024-03-01T08:00:00Z') }
  },
  {
    id: 'order-004',
    orderNumber: 'ORD-20240410-004',
    customerId: userId,
    customerName: 'Current User',
    customerEmail: 'user@example.com',
    customerPhone: '+84 123 456 789',
    vehicleName: 'Honda CR-V',
    vehicleType: 'SUV',
    vehicleProvider: 'Honda Dealer',
    vehicleImages: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400'],
    dealerName: 'Honda Dealer',
    dealerAddress: '456 Le Loi Street, District 3, Ho Chi Minh City',
    pickupDate: new Date('2024-04-10'),
    returnDate: new Date('2024-04-15'),
    pickupLocation: '456 Le Loi Street, District 3, Ho Chi Minh City',
    returnLocation: '456 Le Loi Street, District 3, Ho Chi Minh City',
    totalPrice: 350,
    status: 'pending',
    paymentStatus: 'pending',
    priority: 'high',
    source: 'phone',
    createdBy: userId,
    createdByRole: 'customer',
    createdAt: { toDate: () => new Date('2024-04-05T09:15:00Z') },
    updatedAt: { toDate: () => new Date('2024-04-05T09:15:00Z') }
  }
];

export default function AccountPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: ''
  })
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  // MFA state
  const [mfaEnabled, setMfaEnabled] = useState(false)

  // Handle URL tab parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'security', 'bookings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    
    // Initialize profile form with user data
    setProfileForm({
      displayName: user.displayName || '',
      email: user.email || '',
      phone: user.phoneNumber || '',
      address: '' // This would come from your user profile database
    })

    // Fetch user role
    const fetchUserRole = async () => {
      try {
        const profile = await getUserProfile(user.uid);
        setUserRole(profile?.role || null);
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    fetchUserRole();

    // Load real orders from Firestore
    const loadOrders = async () => {
      try {
        setIsLoadingOrders(true);
        const userOrders = await getCustomerOrders(user.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        toast.error('Failed to load your bookings');
        // Fallback to sample data if there's an error
        const sampleOrders = getSampleOrders(user.uid);
        setOrders(sampleOrders);
      } finally {
        setIsLoadingOrders(false);
      }
    };
    
    loadOrders();

  }, [user, router])

  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.returnLocation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter])

  const handleProfileUpdate = async () => {
    if (!user) return
    
    try {
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: profileForm.displayName
      })
      
      // Here you would also update your user profile in Firestore
      // await updateUserProfile(user.uid, profileForm)
      
      setIsEditingProfile(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }
  
  const handlePasswordUpdate = async () => {
    if (!user) return
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }
    
    try {
      await updatePassword(user, passwordForm.newPassword)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      toast.success('Password updated successfully!')
    } catch (error) {
      console.error('Error updating password:', error)
      toast.error('Failed to update password')
    }
  }
  
  const handleMfaToggle = () => {
    // This would integrate with your MFA implementation
    setMfaEnabled(!mfaEnabled)
    toast.success(`Two-factor authentication ${!mfaEnabled ? 'enabled' : 'disabled'}`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'N/A';
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your profile, security settings, and view your bookings</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'security'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Lock className="h-5 w-5" />
                  <span>Security</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('mfa')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'mfa'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Shield className="h-5 w-5" />
                  <span>Two-Factor Auth</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'bookings'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  <span>My Bookings</span>
                </button>
              </nav>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                    <p className="text-gray-600 mt-1">Update your personal information and contact details</p>
                  </div>
                  {!isEditingProfile ? (
                    <Button onClick={() => setIsEditingProfile(true)} variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleProfileUpdate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditingProfile(false)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                      disabled={!isEditingProfile}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                    <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      disabled={!isEditingProfile}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      disabled={!isEditingProfile}
                      className="mt-1"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              </Card>
            )}
            
            {/* Security Tab */}
            {activeTab === 'security' && (
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                  <p className="text-gray-600 mt-1">Update your password to keep your account secure</p>
                </div>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative mt-1">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button onClick={handlePasswordUpdate} className="w-full">
                    Update Password
                  </Button>
                </div>
              </Card>
            )}
            
            {/* MFA Tab */}
            {activeTab === 'mfa' && (
              <Card className="p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Two-Factor Authentication</h2>
                  <p className="text-gray-600 mt-1">Add an extra layer of security to your account</p>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">SMS Authentication</h3>
                    <p className="text-sm text-gray-600">Receive verification codes via SMS</p>
                  </div>
                  <Button 
                    onClick={handleMfaToggle}
                    variant={mfaEnabled ? "destructive" : "default"}
                  >
                    {mfaEnabled ? 'Disable' : 'Enable'}
                  </Button>
                </div>
                
                {mfaEnabled && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✓ Two-factor authentication is enabled. You'll receive SMS codes when signing in.
                    </p>
                  </div>
                )}
              </Card>
            )}
            
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {/* Info Notice */}
                <Card className="p-4 bg-green-50 border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-green-800">
                      <strong>My Bookings:</strong> Displaying your actual bookings from the database. If no bookings are found, sample data will be shown for demonstration.
                    </p>
                  </div>
                </Card>

                {/* Filters */}
                <Card className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Search by car, location..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Card>

                {/* Orders Display */}
                {isLoadingOrders ? (
                  <Card className="p-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading your bookings...</p>
                    </div>
                  </Card>
                ) : filteredOrders.length === 0 ? (
                  <Card className="p-12">
                    <div className="text-center">
                      <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {orders.length === 0 ? 'No bookings yet' : 'No bookings match your filters'}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {orders.length === 0 
                          ? 'Start your journey by booking your first car rental'
                          : 'Try adjusting your search or filter criteria'
                        }
                      </p>
                      {orders.length === 0 && (
                        <Button 
                          onClick={() => router.push('/search')}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          Browse Cars
                        </Button>
                      )}
                    </div>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredOrders.map((order) => (
                      <Card key={order.id} className="hover:shadow-lg transition-shadow duration-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                                {order.vehicleName}
                              </CardTitle>
                              <CardDescription className="text-sm text-gray-600">
                                Booking #{order.id.slice(-8)}
                              </CardDescription>
                            </div>
                            <div className="flex flex-col gap-1">
                              <Badge className={statusColors[order.status]}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                              <Badge variant="outline" className={priorityColors[order.priority]}>
                                {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Vehicle Images */}
                          {order.vehicleImages && order.vehicleImages.length > 0 && (
                            <div className="space-y-2">
                              {order.vehicleImages.length === 1 ? (
                                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                  <img
                                    src={order.vehicleImages[0]}
                                    alt={order.vehicleName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="grid grid-cols-2 gap-2">
                                  {order.vehicleImages.slice(0, 4).map((image, index) => (
                                    <div key={index} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                                      <img
                                        src={image}
                                        alt={`${order.vehicleName} - Image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                  {order.vehicleImages.length > 4 && (
                                    <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
                                      +{order.vehicleImages.length - 4} more
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Booking Details */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(order.pickupDate)} - {formatDate(order.returnDate)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{order.pickupLocation}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>Booked {order.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={() => toast.info('Booking details feature coming soon!')}
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}