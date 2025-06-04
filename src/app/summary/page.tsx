'use client';

// Summary page for booking confirmation

import React, { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, Clock, User, Phone, Star, Car, Fuel, Users, Settings, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import { createCustomerOrder, OrderData } from '@/lib/orderService';
import { toast } from 'sonner';

interface BookingSummary {
  vehicleName: string;
  vehicleProvider: string;
  vehicleType: string;
  vehiclePrice: number;
  vehicleRating: number;
  vehicleSeater: string;
  vehicleTransmission: string;
  vehicleFuel: string;
  vehicleFeatures: string[];
  dealerName: string;
  dealerAddress: string;
  dealerPhone: string;
  dealerRating: number;
  pickupDate: string;
  location: string;
}

function SummaryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extract booking details from URL parameters
  const bookingData: BookingSummary = {
    vehicleName: searchParams.get('vehicleName') || '',
    vehicleProvider: searchParams.get('vehicleProvider') || '',
    vehicleType: searchParams.get('vehicleType') || '',
    vehiclePrice: parseInt(searchParams.get('vehiclePrice') || '0'),
    vehicleRating: parseFloat(searchParams.get('vehicleRating') || '0'),
    vehicleSeater: searchParams.get('vehicleSeater') || '',
    vehicleTransmission: searchParams.get('vehicleTransmission') || '',
    vehicleFuel: searchParams.get('vehicleFuel') || '',
    vehicleFeatures: searchParams.get('vehicleFeatures')?.split(',') || [],
    dealerName: searchParams.get('dealerName') || '',
    dealerAddress: searchParams.get('dealerAddress') || '',
    dealerPhone: searchParams.get('dealerPhone') || '',
    dealerRating: parseFloat(searchParams.get('dealerRating') || '0'),
    pickupDate: searchParams.get('pickupDate') || '',
    location: searchParams.get('location') || '',
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleConfirmBooking = async () => {
    if (!user) {
      toast.error('Please log in to confirm your booking');
      router.push('/login');
      return;
    }

    // Don't block booking if userProfile is null - we can still create orders
    // The user is authenticated, which is sufficient for booking
    console.log('Starting booking confirmation for user:', user.uid);
    console.log('User profile available:', !!userProfile);

    setIsSubmitting(true);

    try {
      // Prepare order data - use userProfile if available, otherwise fallback to user auth data
      const orderData: OrderData = {
        vehicleName: bookingData.vehicleName || 'Unknown Vehicle',
        vehicleType: bookingData.vehicleType || 'Not specified',
        vehicleProvider: bookingData.vehicleProvider || 'Unknown Dealer',
        dealerName: bookingData.dealerName || 'Unknown Dealer',
        dealerAddress: bookingData.dealerAddress || 'Not specified',
        pickupDate: bookingData.pickupDate ? new Date(bookingData.pickupDate) : new Date(),
        returnDate: undefined, // Optional field
        pickupLocation: bookingData.location || 'Pickup location not specified',
        returnLocation: bookingData.location || 'Return location not specified',
        customerName: userProfile?.displayName || user.displayName || user.email?.split('@')[0] || 'Customer',
        customerEmail: user.email || '',
        customerPhone: userProfile?.phone || 'Not specified',
        totalPrice: bookingData.vehiclePrice || 0,
        notes: 'Order created via website'
      };
      
      console.log('Order data prepared:', {
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        vehicleName: orderData.vehicleName,
        totalPrice: orderData.totalPrice,
        pickupDate: orderData.pickupDate
      });

      // Create the order
      const newOrder = await createCustomerOrder(orderData, user);
      console.log('Order created successfully:', newOrder);
      toast.success(`Booking confirmed! Order ${newOrder.orderNumber} created successfully!`);
      
      // Redirect to account page bookings tab to view the booking
      router.push('/account?tab=bookings');
      
    } catch (error: any) {
      console.error('Error confirming booking:', error);
      toast.error('Failed to confirm booking', {
        description: error.message || 'Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Booking Summary
          </h1>
          <p className="text-gray-600 text-lg">
            Review your booking details before confirmation
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Details */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Car className="h-6 w-6 text-blue-600" />
                Vehicle Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{bookingData.vehicleName}</h3>
                <p className="text-blue-600 font-medium">{bookingData.vehicleProvider}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{bookingData.vehicleRating}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{bookingData.vehicleSeater}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{bookingData.vehicleTransmission}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{bookingData.vehicleFuel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-gray-500" />
                  <span className="text-sm capitalize">{bookingData.vehicleType}</span>
                </div>
              </div>

              {bookingData.vehicleFeatures.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {bookingData.vehicleFeatures.map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Separator />
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total Price</p>
                <p className="text-3xl font-bold text-green-600">{formatPrice(bookingData.vehiclePrice)}</p>
                <p className="text-xs text-gray-500">per day</p>
              </div>
            </CardContent>
          </Card>

          {/* Pickup Details */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <MapPin className="h-6 w-6 text-purple-600" />
                Pickup Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date & Location */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pickup Date</p>
                    <p className="font-medium">{formatDate(bookingData.pickupDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium capitalize">{bookingData.location}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dealer Information */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Dealer Information
                </h4>
                
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-gray-800">{bookingData.dealerName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{bookingData.dealerRating}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <p className="text-sm text-gray-600">{bookingData.dealerAddress}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-600">{bookingData.dealerPhone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/search">
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto px-8 py-3 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 rounded-xl"
                  >
                    Back to Search
                  </Button>
                </Link>
                
                <Button 
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function SummaryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking summary...</p>
        </div>
      </div>
    }>
      <SummaryContent />
    </Suspense>
  );
}