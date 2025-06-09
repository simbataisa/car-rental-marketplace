'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, User, Phone, Star, Car, Fuel, Users, Settings, CheckCircle, ArrowLeft, Navigation } from 'lucide-react';
import { GoogleMap } from './GoogleMap';

interface BookingSummaryData {
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
  dealerLat?: number;
  dealerLng?: number;
  pickupDate: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
  location: string;
}

interface BookingSummaryProps {
  bookingData: BookingSummaryData;
  onBack: () => void;
  onConfirm: () => void;
}

export default function BookingSummary({ bookingData, onBack, onConfirm }: BookingSummaryProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setShowDirections(true);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
          // Fallback to a default location (Kuala Lumpur)
          setUserLocation({ lat: 3.139, lng: 101.6869 });
          setShowDirections(true);
        }
      );
    } else {
      setIsLoadingLocation(false);
      // Fallback to a default location
      setUserLocation({ lat: 3.139, lng: 101.6869 });
      setShowDirections(true);
    }
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

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Booking Summary
        </h2>
        <p className="text-gray-600">
          Review your booking details before confirmation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vehicle Details */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Car className="h-5 w-5 text-blue-600" />
              Vehicle Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-1">{bookingData.vehicleName}</h3>
              <p className="text-blue-600 font-medium">{bookingData.vehicleProvider}</p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{bookingData.vehicleRating}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
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
              <p className="text-2xl font-bold text-green-600">{formatPrice(bookingData.vehiclePrice)}</p>
              <p className="text-xs text-gray-500">per day</p>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Details */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-purple-600" />
              Pickup Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Date & Location */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Pickup Date & Time</p>
                  <p className="font-medium">
                    {formatDate(bookingData.pickupDate)}
                    {bookingData.pickupTime && (
                      <span className="text-blue-600 ml-2">at {bookingData.pickupTime}</span>
                    )}
                  </p>
                </div>
                {bookingData.returnDate && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Return Date & Time</p>
                    <p className="font-medium">
                      {formatDate(bookingData.returnDate)}
                      {bookingData.returnTime && (
                        <span className="text-blue-600 ml-2">at {bookingData.returnTime}</span>
                      )}
                    </p>
                  </div>
                )}
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

            <Separator />

            {/* Map and Directions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location Map
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={getCurrentLocation}
                  disabled={isLoadingLocation}
                  className="text-xs px-3 py-1 h-8"
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  {isLoadingLocation ? 'Getting Location...' : 'Get Directions'}
                </Button>
              </div>
              
              {bookingData.dealerLat && bookingData.dealerLng && (
                <div className="h-64 rounded-lg overflow-hidden border border-gray-200">
                  <GoogleMap
                    dealers={[{
                      id: 'selected-dealer',
                      name: bookingData.dealerName,
                      address: bookingData.dealerAddress,
                      phone: bookingData.dealerPhone,
                      rating: bookingData.dealerRating,
                      distance: '',
                      openHours: '',
                      lat: bookingData.dealerLat,
                      lng: bookingData.dealerLng,
                      available: true,
                      type: 'traditional',
                      region: 'central',
                      city: bookingData.location
                    }]}
                    selectedDealer={{
                      id: 'selected-dealer',
                      name: bookingData.dealerName,
                      address: bookingData.dealerAddress,
                      phone: bookingData.dealerPhone,
                      rating: bookingData.dealerRating,
                      distance: '',
                      openHours: '',
                      lat: bookingData.dealerLat,
                      lng: bookingData.dealerLng,
                      available: true,
                      type: 'traditional',
                      region: 'central',
                      city: bookingData.location
                    }}
                    onDealerSelect={() => {}}
                    center={{ lat: bookingData.dealerLat, lng: bookingData.dealerLng }}
                    zoom={15}
                    userLocation={showDirections ? userLocation : null}
                  />
                </div>
              )}
              
              {(!bookingData.dealerLat || !bookingData.dealerLng) && (
                <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Map location not available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-6">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="w-full sm:w-auto px-6 py-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 rounded-xl flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dealers
              </Button>
              
              <Button 
                onClick={onConfirm}
                className="w-full sm:w-auto px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                Confirm Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}