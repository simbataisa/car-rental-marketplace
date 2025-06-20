'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Phone, Clock, Star, Search, Zap, Building2, MapPinIcon } from 'lucide-react';
import { GoogleMap } from './GoogleMap';
import { useRouter } from 'next/navigation';
import BookingSummary from './BookingSummary';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { createCustomerOrder, OrderData } from '@/lib/orderService';
import { useCart } from '@/app/contexts/CartContext';
import { VehicleRentalItem } from '@/lib/cartService';

interface Dealer {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  distance: string;
  openHours: string;
  lat: number;
  lng: number;
  available: boolean;
  type: 'automated' | 'traditional';
  region: 'north' | 'central' | 'south';
  city: string;
}

interface DealerMapModalProps {
  vehicleName: string;
  vehicleProvider: string;
  vehicleType: string;
  vehiclePrice: number;
  vehicleRating: number;
  vehicleSeater: string;
  vehicleTransmission: string;
  vehicleFuel: string;
  vehicleFeatures: string[];
  pickupDate?: string;
  location?: string;
  children: React.ReactNode;
}

const mockDealers: Dealer[] = [
  // SOUTH REGION - Ho Chi Minh City
  {
    id: '1',
    name: 'VinFast Smart Hub Central',
    address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
    phone: '+84 28 1234 5678',
    rating: 4.8,
    distance: '2.3 km',
    openHours: '24/7 Automated',
    lat: 10.762622,
    lng: 106.660172,
    available: true,
    type: 'automated',
    region: 'south',
    city: 'Ho Chi Minh City'
  },
  {
    id: '2',
    name: 'AutoLease Traditional Center',
    address: '456 Le Loi Boulevard, District 3, Ho Chi Minh City',
    phone: '+84 28 2345 6789',
    rating: 4.6,
    distance: '4.1 km',
    openHours: '7:00 AM - 9:00 PM',
    lat: 10.768000,
    lng: 106.658000,
    available: true,
    type: 'traditional',
    region: 'south',
    city: 'Ho Chi Minh City'
  },
  {
    id: '3',
    name: 'VinFast Express Depot',
    address: '789 Dong Khoi Street, District 1, Ho Chi Minh City',
    phone: '+84 28 3456 7890',
    rating: 4.4,
    distance: '1.8 km',
    openHours: '24/7 Automated',
    lat: 10.774300,
    lng: 106.703500,
    available: false,
    type: 'automated',
    region: 'south',
    city: 'Ho Chi Minh City'
  },
  {
    id: '4',
    name: 'Premium Car Rental',
    address: '321 Hai Ba Trung Street, District 1, Ho Chi Minh City',
    phone: '+84 28 4567 8901',
    rating: 4.9,
    distance: '3.2 km',
    openHours: '8:00 AM - 10:00 PM',
    lat: 10.7829,
    lng: 106.6953,
    available: true,
    type: 'traditional',
    region: 'south',
    city: 'Ho Chi Minh City'
  },
  {
    id: '5',
    name: 'VinFast Smart Station Binh Thanh',
    address: '88 Xo Viet Nghe Tinh Street, Binh Thanh District, Ho Chi Minh City',
    phone: '+84 28 5678 9012',
    rating: 4.7,
    distance: '5.5 km',
    openHours: '24/7 Automated',
    lat: 10.8012,
    lng: 106.7108,
    available: true,
    type: 'automated',
    region: 'south',
    city: 'Ho Chi Minh City'
  },
  {
    id: '6',
    name: 'Can Tho Auto Hub',
    address: '45 Tran Hung Dao Street, Ninh Kieu District, Can Tho',
    phone: '+84 292 123 4567',
    rating: 4.5,
    distance: '120 km',
    openHours: '6:00 AM - 10:00 PM',
    lat: 10.0452,
    lng: 105.7469,
    available: true,
    type: 'traditional',
    region: 'south',
    city: 'Can Tho'
  },
  {
    id: '7',
    name: 'VinFast Smart Depot Vung Tau',
    address: '12 Ha Long Street, Ward 2, Vung Tau',
    phone: '+84 254 234 5678',
    rating: 4.6,
    distance: '95 km',
    openHours: '24/7 Automated',
    lat: 10.3460,
    lng: 107.0843,
    available: true,
    type: 'automated',
    region: 'south',
    city: 'Vung Tau'
  },

  // CENTRAL REGION - Da Nang & Hue
  {
    id: '8',
    name: 'VinFast Central Hub Da Nang',
    address: '234 Bach Dang Street, Hai Chau District, Da Nang',
    phone: '+84 236 345 6789',
    rating: 4.8,
    distance: '450 km',
    openHours: '24/7 Automated',
    lat: 16.0544,
    lng: 108.2022,
    available: true,
    type: 'automated',
    region: 'central',
    city: 'Da Nang'
  },
  {
    id: '9',
    name: 'Da Nang Traditional Rentals',
    address: '567 Nguyen Van Linh Street, Thanh Khe District, Da Nang',
    phone: '+84 236 456 7890',
    rating: 4.4,
    distance: '455 km',
    openHours: '7:00 AM - 9:00 PM',
    lat: 16.0678,
    lng: 108.2208,
    available: true,
    type: 'traditional',
    region: 'central',
    city: 'Da Nang'
  },
  {
    id: '10',
    name: 'Hue Imperial Car Service',
    address: '89 Le Loi Street, Hue City, Thua Thien Hue',
    phone: '+84 234 567 8901',
    rating: 4.3,
    distance: '520 km',
    openHours: '8:00 AM - 8:00 PM',
    lat: 16.4637,
    lng: 107.5909,
    available: true,
    type: 'traditional',
    region: 'central',
    city: 'Hue'
  },
  {
    id: '11',
    name: 'VinFast Smart Point Hoi An',
    address: '15 Tran Phu Street, Hoi An Ancient Town, Quang Nam',
    phone: '+84 235 678 9012',
    rating: 4.7,
    distance: '480 km',
    openHours: '24/7 Automated',
    lat: 15.8801,
    lng: 108.3380,
    available: true,
    type: 'automated',
    region: 'central',
    city: 'Hoi An'
  },
  {
    id: '12',
    name: 'Quy Nhon Coastal Rentals',
    address: '78 An Duong Vuong Street, Quy Nhon, Binh Dinh',
    phone: '+84 256 789 0123',
    rating: 4.2,
    distance: '380 km',
    openHours: '6:00 AM - 10:00 PM',
    lat: 13.7563,
    lng: 109.2297,
    available: false,
    type: 'traditional',
    region: 'central',
    city: 'Quy Nhon'
  },

  // NORTH REGION - Hanoi & Halong
  {
    id: '13',
    name: 'VinFast Capital Hub Hanoi',
    address: '456 Ba Trieu Street, Hai Ba Trung District, Hanoi',
    phone: '+84 24 890 1234',
    rating: 4.9,
    distance: '1200 km',
    openHours: '24/7 Automated',
    lat: 21.028511,
    lng: 105.804817,
    available: true,
    type: 'automated',
    region: 'north',
    city: 'Hanoi'
  },
  {
    id: '14',
    name: 'Hanoi Premium Car Center',
    address: '123 Hoan Kiem Street, Hoan Kiem District, Hanoi',
    phone: '+84 24 901 2345',
    rating: 4.6,
    distance: '1195 km',
    openHours: '7:00 AM - 10:00 PM',
    lat: 21.024500,
    lng: 105.841200,
    available: true,
    type: 'traditional',
    region: 'north',
    city: 'Hanoi'
  },
  {
    id: '15',
    name: 'VinFast Smart Station Long Bien',
    address: '789 Nguyen Van Cu Street, Long Bien District, Hanoi',
    phone: '+84 24 012 3456',
    rating: 4.5,
    distance: '1210 km',
    openHours: '24/7 Automated',
    lat: 21.0583,
    lng: 105.8914,
    available: true,
    type: 'automated',
    region: 'north',
    city: 'Hanoi'
  },
  {
    id: '16',
    name: 'Halong Bay Car Rental',
    address: '34 Ha Long Road, Bai Chay Ward, Ha Long, Quang Ninh',
    phone: '+84 203 123 4567',
    rating: 4.4,
    distance: '1320 km',
    openHours: '6:00 AM - 9:00 PM',
    lat: 20.9101,
    lng: 107.1839,
    available: true,
    type: 'traditional',
    region: 'north',
    city: 'Ha Long'
  },
  {
    id: '17',
    name: 'VinFast Sapa Mountain Hub',
    address: '56 Cau May Street, Sapa Town, Lao Cai',
    phone: '+84 214 234 5678',
    rating: 4.3,
    distance: '1450 km',
    openHours: '24/7 Automated',
    lat: 22.3364,
    lng: 103.8438,
    available: false,
    type: 'automated',
    region: 'north',
    city: 'Sapa'
  },
  {
    id: '18',
    name: 'Hai Phong Port Rentals',
    address: '67 Tran Phu Street, Hong Bang District, Hai Phong',
    phone: '+84 225 345 6789',
    rating: 4.7,
    distance: '1280 km',
    openHours: '7:00 AM - 8:00 PM',
    lat: 20.8449,
    lng: 106.6881,
    available: true,
    type: 'traditional',
    region: 'north',
    city: 'Hai Phong'
  }
];

export function DealerMapModal({ 
  vehicleName, 
  vehicleProvider, 
  vehicleType, 
  vehiclePrice, 
  vehicleRating, 
  vehicleSeater, 
  vehicleTransmission, 
  vehicleFuel, 
  vehicleFeatures, 
  pickupDate, 
  location, 
  children 
}: DealerMapModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'north' | 'central' | 'south'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'automated' | 'traditional'>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filteredDealers, setFilteredDealers] = useState<Dealer[]>(mockDealers);
  const [showSummary, setShowSummary] = useState(false);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [mapZoom, setMapZoom] = useState<number | null>(null);
  const [localPickupDate, setLocalPickupDate] = useState<string>(pickupDate || '');
  const [returnDate, setReturnDate] = useState<string>('');
  const [pickupTime, setPickupTime] = useState<string>('09:00');
  const [returnTime, setReturnTime] = useState<string>('18:00');
  const [vehicleAvailability, setVehicleAvailability] = useState<{ [dealerId: string]: number }>({});
  const dealerListRef = useRef<HTMLDivElement>(null);
  const dealerItemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Filter dealers based on search and filters
  useEffect(() => {
    let filtered = mockDealers;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(dealer => 
        dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dealer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dealer.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by region
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(dealer => dealer.region === selectedRegion);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(dealer => dealer.type === selectedType);
    }

    setFilteredDealers(filtered);
  }, [searchQuery, selectedRegion, selectedType]);

  // Calculate vehicle availability for each dealer based on selected dates/times
  const calculateVehicleAvailability = () => {
    const availability: { [dealerId: string]: number } = {};
    
    mockDealers.forEach(dealer => {
      if (!dealer.available) {
        availability[dealer.id] = 0;
        return;
      }
      
      // Simulate availability calculation based on dealer type, date, and time
      let baseAvailability = dealer.type === 'automated' ? 15 : 8; // Automated hubs have more vehicles
      
      // Reduce availability during peak hours (8-10 AM, 5-7 PM)
      if (pickupTime) {
        const hour = parseInt(pickupTime.split(':')[0]);
        if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
          baseAvailability = Math.max(1, Math.floor(baseAvailability * 0.6));
        }
      }
      
      // Reduce availability on weekends
      if (localPickupDate) {
        const date = new Date(localPickupDate);
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
          baseAvailability = Math.max(1, Math.floor(baseAvailability * 0.8));
        }
      }
      
      // Add some randomness to make it more realistic
      const randomFactor = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
      availability[dealer.id] = Math.max(1, Math.floor(baseAvailability * randomFactor));
    });
    
    setVehicleAvailability(availability);
  };

  // Update availability when dates or times change
  useEffect(() => {
    calculateVehicleAvailability();
  }, [localPickupDate, returnDate, pickupTime, returnTime]);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting user location:', error);
          // Default to Ho Chi Minh City if location access is denied
          setUserLocation({ lat: 10.762622, lng: 106.660172 });
        }
      );
    } else {
      // Default to Ho Chi Minh City if geolocation is not supported
      setUserLocation({ lat: 10.762622, lng: 106.660172 });
    }
  }, []);

  const handleDealerSelect = (dealer: Dealer) => {
    setSelectedDealer(dealer);
    // Update map center and zoom to focus on selected dealer
    setMapCenter({ lat: dealer.lat, lng: dealer.lng });
    setMapZoom(16);
    
    // Scroll to the selected dealer in the list
    const dealerElement = dealerItemRefs.current[dealer.id];
    if (dealerElement && dealerListRef.current) {
      dealerElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  const handleBooking = () => {
    console.log('handleBooking called');
    console.log('selectedDealer:', selectedDealer);
    
    if (!selectedDealer) {
      console.log('No dealer selected');
      toast.error('Please select a pickup location before continuing.');
      return;
    }

    if (!localPickupDate) {
      toast.error('Please select a pickup date before continuing.');
      return;
    }

    if (!returnDate) {
      toast.error('Please select a return date before continuing.');
      return;
    }

    // Validate pickup date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickupDateObj = new Date(localPickupDate);
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1); // 1 year from now

    if (pickupDateObj < today) {
      toast.error('Pickup date cannot be in the past.');
      return;
    }

    if (pickupDateObj > maxFutureDate) {
      toast.error('Pickup date cannot be more than 1 year in the future.');
      return;
    }

    // Validate return date if provided
    if (returnDate) {
      const returnDateObj = new Date(returnDate);
      
      if (returnDateObj <= pickupDateObj) {
        toast.error('Return date must be after the pickup date.');
        return;
      }

      if (returnDateObj > maxFutureDate) {
        toast.error('Return date cannot be more than 1 year in the future.');
        return;
      }

      // Check if rental period is reasonable (not more than 30 days)
      const daysDifference = Math.ceil((returnDateObj.getTime() - pickupDateObj.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDifference > 30) {
        toast.error('Rental period cannot exceed 30 days. Please contact us for longer rentals.');
        return;
      }
    }

    // Check if user is authenticated
    if (!user) {
      toast.error('Please sign in to continue with your booking.');
      setIsOpen(false); // Close the modal
      router.push('/login'); // Redirect to login page
      return;
    }

    try {
      console.log('Showing booking summary');
      setShowSummary(true);
    } catch (error) {
      console.error('Error in handleBooking:', error);
      toast.error('An error occurred while processing your booking. Please try again.');
    }
  };

  const handleBackToSearch = () => {
    setShowSummary(false);
  };

  const handleConfirmBooking = async () => {
    // Double-check authentication before final booking confirmation
    if (!user) {
      toast.error('Please sign in to complete your booking.');
      setIsOpen(false);
      router.push('/login');
      return;
    }

    if (!selectedDealer) {
      toast.error('Please select a dealer location first.');
      return;
    }

    console.log('Starting booking confirmation for user:', user.uid);
    console.log('Selected dealer:', selectedDealer.name);

    try {
      // Prepare order data
      const orderData: OrderData = {
        vehicleName: vehicleName || 'Unknown Vehicle',
        vehicleType: vehicleType || 'Not specified',
        vehicleProvider: vehicleProvider || 'Unknown Dealer',
        dealerName: selectedDealer.name,
        dealerAddress: selectedDealer.address,
        pickupDate: new Date(localPickupDate),
        pickupTime: pickupTime,
        returnDate: new Date(returnDate),
        returnTime: returnTime,
        pickupLocation: selectedDealer.address,
        returnLocation: selectedDealer.address,
        customerName: user.displayName || user.email?.split('@')[0] || 'Customer',
        customerEmail: user.email || '',
        customerPhone: 'Not specified',
        totalPrice: vehiclePrice || 0,
        notes: 'Order created via dealer map modal'
      };
      
      console.log('Order data prepared:', {
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        vehicleName: orderData.vehicleName,
        totalPrice: orderData.totalPrice,
        pickupDate: orderData.pickupDate,
        dealerName: orderData.dealerName
      });

      // Create the order
      const newOrder = await createCustomerOrder(orderData, user);
      
      toast.success(`Booking confirmed! Order ${newOrder.orderNumber} created successfully!`);
      
      // Close modal and redirect to account page
      setIsOpen(false);
      setShowSummary(false);
      router.push('/account?tab=bookings');
      
    } catch (error: any) {
      console.error('Error confirming booking:', error);
      toast.error('Failed to confirm booking', {
        description: error.message || 'Please try again later.'
      });
    }
  };

  const handleAddToCart = async () => {
    if (!selectedDealer) {
      toast.error('Please select a pickup location before adding to cart.');
      return;
    }

    if (!localPickupDate) {
      toast.error('Please select a pickup date before adding to cart.');
      return;
    }

    if (!returnDate) {
      toast.error('Please select a return date before adding to cart.');
      return;
    }

    // Validate pickup date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pickupDateObj = new Date(localPickupDate);
    const maxFutureDate = new Date();
    maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1); // 1 year from now

    if (pickupDateObj < today) {
      toast.error('Pickup date cannot be in the past.');
      return;
    }

    if (pickupDateObj > maxFutureDate) {
      toast.error('Pickup date cannot be more than 1 year in the future.');
      return;
    }

    // Validate return date if provided
    if (returnDate) {
      const returnDateObj = new Date(returnDate);
      
      if (returnDateObj <= pickupDateObj) {
        toast.error('Return date must be after the pickup date.');
        return;
      }

      if (returnDateObj > maxFutureDate) {
        toast.error('Return date cannot be more than 1 year in the future.');
        return;
      }

      // Check if rental period is reasonable (not more than 30 days)
      const daysDifference = Math.ceil((returnDateObj.getTime() - pickupDateObj.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDifference > 30) {
        toast.error('Rental period cannot exceed 30 days. Please contact us for longer rentals.');
        return;
      }
    }

    if (!user) {
      toast.error('Please sign in to add items to cart.');
      setIsOpen(false);
      router.push('/login');
      return;
    }

    try {
      const cartItem: Omit<VehicleRentalItem, 'id'> = {
        type: 'vehicle_rental',
        name: vehicleName || 'Unknown Vehicle',
        description: `${vehicleType} from ${vehicleProvider || 'Unknown Provider'}`,
        price: vehiclePrice || 0,
        quantity: 1,
        images: [],
        vehicleData: {
          vehicleName: vehicleName || 'Unknown Vehicle',
          vehicleType: vehicleType || 'Not specified',
          vehicleProvider: vehicleProvider || 'Unknown Provider',
          vehicleRating: vehicleRating || 0,
          vehicleSeater: vehicleSeater || 'Not specified',
          vehicleTransmission: vehicleTransmission || 'Not specified',
          vehicleFuel: vehicleFuel || 'Not specified',
          vehicleFeatures: vehicleFeatures || [],
          vehicleImages: [],
          pickupLocation: selectedDealer.address,
          returnLocation: selectedDealer.address,
          pickupDate: new Date(localPickupDate),
        pickupTime: pickupTime,
        returnDate: new Date(returnDate),
        returnTime: returnTime,
          dealerName: selectedDealer.name,
          dealerAddress: selectedDealer.address,
          dealerPhone: selectedDealer.phone || '',
          dealerRating: selectedDealer.rating || 0
        }
      };

      await addToCart(cartItem);
      toast.success('Vehicle added to cart successfully!');
      setIsOpen(false);
      
      // Optionally redirect to cart page
      // router.push('/cart');
    } catch (error: any) {
       console.error('Error adding to cart:', error);
       toast.error('Failed to add to cart', {
         description: error.message || 'Please try again later.'
       });
     }
   };

  // Prepare booking data for the summary component
  const bookingData = selectedDealer ? {
    vehicleName: vehicleName || 'Unknown Vehicle',
    vehicleProvider: vehicleProvider || 'Unknown Provider',
    vehicleType: vehicleType || 'unknown',
    vehiclePrice: vehiclePrice || 0,
    vehicleRating: vehicleRating || 0,
    vehicleSeater: vehicleSeater || 'Unknown',
    vehicleTransmission: vehicleTransmission || 'Unknown',
    vehicleFuel: vehicleFuel || 'Unknown',
    vehicleFeatures: vehicleFeatures || [],
    dealerName: selectedDealer.name,
    dealerAddress: selectedDealer.address,
    dealerPhone: selectedDealer.phone,
    dealerRating: selectedDealer.rating,
    dealerLat: selectedDealer.lat,
    dealerLng: selectedDealer.lng,
    pickupDate: localPickupDate,
    pickupTime: pickupTime,
    returnDate: returnDate,
    returnTime: returnTime,
    location: location || ''
  } : null;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedType('all');
    // Reset map to default view
    setMapCenter(null);
    setMapZoom(null);
  };

  const getMapCenter = () => {
    // If a specific map center is set (e.g., from dealer selection), use it
    if (mapCenter) {
      return mapCenter;
    }
    
    if (userLocation && selectedRegion === 'all') {
      return userLocation;
    }
    
    switch (selectedRegion) {
      case 'north':
        return { lat: 21.028511, lng: 105.804817 }; // Hanoi
      case 'central':
        return { lat: 16.054400, lng: 108.202200 }; // Da Nang
      case 'south':
        return { lat: 10.762622, lng: 106.660172 }; // Ho Chi Minh City
      default:
        return { lat: 14.0583, lng: 108.2772 }; // Vietnam center
    }
  };

  const getMapZoom = () => {
    // If a specific map zoom is set (e.g., from dealer selection), use it
    if (mapZoom) {
      return mapZoom;
    }
    
    if (userLocation && selectedRegion === 'all') {
      return 10;
    }
    return selectedRegion === 'all' ? 6 : 11;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] md:max-w-6xl lg:max-w-7xl w-[95vw] h-[95vh] md:h-[95vh] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 border-0 shadow-2xl flex flex-col overflow-y-auto md:overflow-hidden rounded-2xl">
        {showSummary && bookingData ? (
          <>
            <DialogTitle className="sr-only">Booking Summary</DialogTitle>
            <BookingSummary 
              bookingData={bookingData}
              onBack={handleBackToSearch}
              onConfirm={handleConfirmBooking}
            />
          </>
        ) : (
        <>
        {/* Header Section */}
        <div className="flex flex-col space-y-4 pb-4 border-b border-gray-200/50 flex-shrink-0 rounded-t-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Select Pickup Location for {vehicleName}
            </DialogTitle>
            <p className="text-base md:text-lg text-gray-700">Choose the nearest {vehicleProvider} location to pick up your vehicle</p>
          </DialogHeader>
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search by name, city, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 bg-white/80 backdrop-blur-sm border-gray-200/50 rounded-xl"
            />
          </div>
          
          {/* Date Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Pickup Date *</label>
              <Input
                 type="date"
                 value={localPickupDate}
                 onChange={(e) => setLocalPickupDate(e.target.value)}
                 min={new Date().toISOString().split('T')[0]}
                 className="bg-white/80 backdrop-blur-sm border-gray-200/50 rounded-xl"
                 required
               />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Pickup Time *</label>
              <Input
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="bg-white/80 backdrop-blur-sm border-gray-200/50 rounded-xl"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Return Date</label>
              <Input
                type="date"
                value={returnDate || ''}
                onChange={(e) => setReturnDate(e.target.value)}
                min={localPickupDate || new Date().toISOString().split('T')[0]}
                className="bg-white/80 backdrop-blur-sm border-gray-200/50 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Return Time</label>
              <Input
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                className="bg-white/80 backdrop-blur-sm border-gray-200/50 rounded-xl"
              />
            </div>
          </div>
          
          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {/* Region Filter */}
            <div className="flex flex-wrap gap-1 items-center">
              {userLocation && (
                <button
                  onClick={() => {
                    setSelectedRegion('all');
                    setMapCenter(userLocation);
                    setMapZoom(13);
                  }}
                  className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center min-w-[36px] min-h-[36px] flex-shrink-0 mr-1"
                  title="Go to my location"
                >
                  <MapPinIcon className="w-4 h-4" />
                </button>
              )}
              {(['all', 'south', 'central', 'north'] as const).map((region) => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedRegion(region);
                    setMapCenter(null);
                    setMapZoom(null);
                  }}
                  className={`capitalize transition-all duration-300 text-xs sm:text-sm rounded-xl ${
                    selectedRegion === region 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 shadow-lg' 
                      : 'hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700'
                  }`}
                >
                  {region === 'all' ? 'All Regions' : `${region} Vietnam`}
                </Button>
              ))}
            </div>
            
            {/* Type Filter */}
            <div className="flex flex-wrap gap-1">
              {(['all', 'automated', 'traditional'] as const).map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className={`flex items-center gap-1 capitalize transition-all duration-300 text-xs sm:text-sm rounded-xl ${
                    selectedType === type 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white border-0 shadow-lg' 
                      : 'hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700'
                  }`}
                >
                  {type === 'automated' && <Zap className="w-3 h-3" />}
                  {type === 'traditional' && <Building2 className="w-3 h-3" />}
                  {type === 'all' ? 'All Types' : type}
                </Button>
              ))}
            </div>
            
            {(searchQuery || selectedRegion !== 'all' || selectedType !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700 hover:bg-red-50 hover:border-red-200 transition-all duration-300 text-xs sm:text-sm rounded-xl"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 gap-4 flex-1 min-h-0 overflow-y-auto md:overflow-visible">
          {/* Map Section */}
          <div className="bg-gradient-to-br from-blue-100 to-indigo-200 rounded-2xl overflow-hidden shadow-lg border border-white/50 h-[300px] md:h-[400px] lg:h-full">
            <GoogleMap
              dealers={filteredDealers}
              selectedDealer={selectedDealer}
              onDealerSelect={handleDealerSelect}
              center={getMapCenter()}
              zoom={getMapZoom()}
              userLocation={userLocation}
            />
          </div>

          {/* Dealer List Section */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 flex flex-col h-[400px] md:h-[400px] lg:h-full overflow-hidden">
            {/* List Header */}
            <div className="p-4 border-b border-gray-200/50 flex-shrink-0 rounded-t-2xl">
              <h3 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Dealer Locations ({filteredDealers.length})
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1">
                {filteredDealers.filter(d => d.available).length !== filteredDealers.length && (
                  <p className="text-sm text-green-600">
                    {filteredDealers.filter(d => d.available).length} available • {filteredDealers.filter(d => !d.available).length} unavailable
                  </p>
                )}
                <p className="text-sm font-semibold text-blue-600">
                  Total vehicles: {Object.values(vehicleAvailability).reduce((sum, count) => sum + count, 0)}
                </p>
              </div>
              {filteredDealers.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">No dealers found matching your criteria</p>
              )}
              {filteredDealers.length > 0 && filteredDealers.length < mockDealers.length && (
                <p className="text-sm text-gray-500 mt-1">
                  Showing {filteredDealers.length} of {mockDealers.length} locations
                </p>
              )}
            </div>
            
            {/* Scrollable Dealer List */}
            <div ref={dealerListRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            
              {filteredDealers.map((dealer) => (
                <div 
                  key={dealer.id}
                  ref={(el) => { dealerItemRefs.current[dealer.id] = el; }}
                  className={`p-4 border rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedDealer?.id === dealer.id
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg ring-2 ring-blue-200'
                      : dealer.available
                        ? 'border-gray-200 bg-white/80 backdrop-blur-sm hover:border-blue-300 hover:shadow-md hover:bg-gradient-to-br hover:from-blue-50 hover:to-white'
                        : 'border-gray-100 bg-gray-50/60 cursor-not-allowed opacity-60'
                  }`}
                  onClick={() => dealer.available && handleDealerSelect(dealer)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 text-sm">{dealer.name}</h4>
                          <div className="flex items-center gap-2 sm:hidden">
                            {dealer.type === 'automated' ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                <Zap className="w-3 h-3 mr-1" />
                                Smart
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                                <Building2 className="w-3 h-3 mr-1" />
                                Traditional
                              </span>
                            )}
                            {dealer.available ? (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white">
                                Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white">
                                Unavailable
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          {dealer.type === 'automated' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                              <Zap className="w-3 h-3 mr-1" />
                              Smart
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-500 to-gray-600 text-white">
                              <Building2 className="w-3 h-3 mr-1" />
                              Traditional
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="ml-1">{dealer.rating}</span>
                        <span className="mx-2">•</span>
                        <span>{dealer.distance}</span>
                        <span className="mx-2">•</span>
                        <span className="capitalize">{dealer.region}</span>
                        <span className="mx-2">•</span>
                        <span className={`font-semibold ${
                          vehicleAvailability[dealer.id] > 5 ? 'text-green-600' : 
                          vehicleAvailability[dealer.id] > 2 ? 'text-yellow-600' : 
                          vehicleAvailability[dealer.id] > 0 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {vehicleAvailability[dealer.id] || 0} vehicles
                        </span>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                      {dealer.available ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-500 to-green-600 text-white">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{dealer.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />
                      <span>{dealer.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-2 text-gray-400 flex-shrink-0" />
                      <span>{dealer.openHours}</span>
                    </div>
                  </div>
                  
                  {dealer.available && (
                    <div className="mt-3 flex items-center justify-between">
                      <button className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center hover:bg-blue-50 px-2 py-1 rounded-lg transition-all duration-200">
                        <Navigation className="w-3 h-3 mr-1" />
                        Directions
                      </button>
                      {selectedDealer?.id === dealer.id && (
                        <span className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">✓ Selected</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200/50 bg-white/60 backdrop-blur-sm rounded-2xl p-4 flex-shrink-0 sticky bottom-0 md:static">
          <div className="text-sm text-gray-700 text-center sm:text-left">
            {selectedDealer ? (
              <span className="font-medium">Selected: <strong className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{selectedDealer.name}</strong> <span className="text-gray-500">({selectedDealer.distance})</span></span>
            ) : (
              <span className="text-gray-600">Please select a pickup location</span>
            )}
          </div>
          <div className="flex space-x-3 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1 sm:flex-none hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddToCart}
              disabled={!selectedDealer}
              variant="outline"
              className="flex-1 sm:flex-none border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
            >
              Add to Cart
            </Button>
            <Button 
              onClick={(e) => {
                console.log('Continue Booking button clicked!');
                console.log('selectedDealer:', selectedDealer);
                console.log('Button disabled:', !selectedDealer);
                e.preventDefault();
                handleBooking();
              }}
              disabled={!selectedDealer}
              className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none rounded-xl"
            >
              Book Now
            </Button>
          </div>
        </div>
        </>
        )}
      </DialogContent>
    </Dialog>
  );
}