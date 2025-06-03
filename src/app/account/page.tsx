'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
  MapPin,
  Clock,
  Star,
  Phone,
  Mail,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'
import { updatePassword, updateProfile, User as FirebaseUser } from 'firebase/auth'
import { auth } from '@/lib/firebase'

interface Booking {
  id: string
  vehicleName: string
  vehicleType: string
  dealerName: string
  dealerAddress: string
  pickupDate: string
  returnDate: string
  totalPrice: number
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  bookingDate: string
}

// Mock booking data - in a real app, this would come from your backend
const mockBookings: Booking[] = [
  {
    id: '1',
    vehicleName: 'VinFast VF 8',
    vehicleType: 'Electric SUV',
    dealerName: 'VinFast Smart Hub Central',
    dealerAddress: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    pickupDate: '2024-02-15',
    returnDate: '2024-02-18',
    totalPrice: 2400000,
    status: 'upcoming',
    bookingDate: '2024-01-20'
  },
  {
    id: '2',
    vehicleName: 'Toyota Camry',
    vehicleType: 'Sedan',
    dealerName: 'Premium Car Rental',
    dealerAddress: '321 Hai Ba Trung Street, District 1, Ho Chi Minh City',
    pickupDate: '2024-01-10',
    returnDate: '2024-01-12',
    totalPrice: 1800000,
    status: 'completed',
    bookingDate: '2024-01-05'
  }
]

export default function AccountPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [bookings] = useState<Booking[]>(mockBookings)
  
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
  }, [user, router])

  const handleProfileUpdate = async () => {
    if (!user) return
    
    try {
      await updateProfile(user as FirebaseUser, {
        displayName: profileForm.displayName
      })
      
      // In a real app, you'd also update additional profile info in your database
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile. Please try again.')
    }
  }

  const handlePasswordChange = async () => {
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
      await updatePassword(user as FirebaseUser, passwordForm.newPassword)
      toast.success('Password updated successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      console.error('Error updating password:', error)
      if (error.code === 'auth/requires-recent-login') {
        toast.error('Please sign out and sign back in before changing your password')
      } else {
        toast.error('Failed to update password. Please try again.')
      }
    }
  }

  const handleMfaToggle = () => {
    // In a real app, this would integrate with Firebase Auth MFA
    setMfaEnabled(!mfaEnabled)
    toast.success(`MFA ${!mfaEnabled ? 'enabled' : 'disabled'} successfully!`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-50'
      case 'active': return 'text-green-600 bg-green-50'
      case 'completed': return 'text-gray-600 bg-gray-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2">Manage your profile, security settings, and bookings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'security' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <Lock className="h-5 w-5" />
                  <span>Security</span>
                </button>
                <button
                  onClick={() => setActiveTab('mfa')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'mfa' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <Shield className="h-5 w-5" />
                  <span>Two-Factor Auth</span>
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="h-5 w-5" />
                  <span>My Bookings</span>
                </button>
              </div>
              
              <Separator className="my-6" />
              
              <Button 
                variant="outline" 
                onClick={logout}
                className="w-full"
              >
                Sign Out
              </Button>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Profile Information</h2>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="space-x-2">
                      <Button onClick={handleProfileUpdate}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsEditing(false)
                          setProfileForm({
                            displayName: user.displayName || '',
                            email: user.email || '',
                            phone: user.phoneNumber || '',
                            address: ''
                          })
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="displayName">Full Name</Label>
                    <Input
                      id="displayName"
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      disabled={true} // Email changes require special handling
                      className="mt-1 bg-gray-50"
                    />
                    <p className="text-sm text-gray-500 mt-1">Contact support to change your email</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                      placeholder="+84 xxx xxx xxx"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      disabled={!isEditing}
                      className="mt-1"
                      placeholder="Your address"
                    />
                  </div>
                </div>
              </Card>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Change Password</h2>
                
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handlePasswordChange}
                    disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </Card>
            )}

            {/* MFA Tab */}
            {activeTab === 'mfa' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Two-Factor Authentication</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Authenticator App</h3>
                      <p className="text-sm text-gray-600">Use an authenticator app to generate verification codes</p>
                    </div>
                    <Button 
                      onClick={handleMfaToggle}
                      variant={mfaEnabled ? 'destructive' : 'default'}
                    >
                      {mfaEnabled ? 'Disable' : 'Enable'}
                    </Button>
                  </div>
                  
                  {mfaEnabled && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        <span className="text-green-800 font-medium">Two-factor authentication is enabled</span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        Your account is protected with an additional layer of security.
                      </p>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Recommended authenticator apps:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Google Authenticator</li>
                      <li>Microsoft Authenticator</li>
                      <li>Authy</li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">My Bookings</h2>
                
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-4">Start exploring our vehicles to make your first booking!</p>
                    <Button onClick={() => router.push('/')}>
                      Browse Vehicles
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{booking.vehicleName}</h3>
                            <p className="text-gray-600">{booking.vehicleType}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">{booking.dealerName}</p>
                              <p className="text-sm text-gray-600">{booking.dealerAddress}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="font-medium">
                                {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Booked on {formatDate(booking.bookingDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="text-lg font-semibold">
                            {formatPrice(booking.totalPrice)}
                          </div>
                          
                          <div className="space-x-2">
                            {booking.status === 'upcoming' && (
                              <>
                                <Button variant="outline" size="sm">
                                  Modify
                                </Button>
                                <Button variant="destructive" size="sm">
                                  Cancel
                                </Button>
                              </>
                            )}
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}