'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Phone, Clock, Star, Search, Zap, Building2, MapPinIcon } from 'lucide-react';
import { GoogleMap } from './GoogleMap';

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
    lat: 10.7769,
    lng: 106.7009,
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
    lat: 10.7891,
    lng: 106.6917,
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
    lat: 10.7743,
    lng: 106.7035,
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
    lat: 21.0285,
    lng: 105.8542,
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
    lat: 21.0245,
    lng: 105.8412,
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

export function DealerMapModal({ vehicleName, vehicleProvider, children }: DealerMapModalProps) {
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'north' | 'central' | 'south'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'automated' | 'traditional'>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filteredDealers, setFilteredDealers] = useState<Dealer[]>(mockDealers);
  const [mapCenter, setMapCenter] = useState<{lat: number, lng: number} | null>(null);
  const [mapZoom, setMapZoom] = useState<number | null>(null);

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
          setUserLocation({ lat: 10.7769, lng: 106.7009 });
        }
      );
    } else {
      // Default to Ho Chi Minh City if geolocation is not supported
      setUserLocation({ lat: 10.7769, lng: 106.7009 });
    }
  }, []);

  const handleDealerSelect = (dealer: Dealer) => {
    setSelectedDealer(dealer);
    // Update map center and zoom to focus on selected dealer
    setMapCenter({ lat: dealer.lat, lng: dealer.lng });
    setMapZoom(16);
  };

  const handleBooking = () => {
    if (selectedDealer) {
      alert(`Booking ${vehicleName} from ${selectedDealer.name}`);
      setIsOpen(false);
    }
  };

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
        return { lat: 21.0285, lng: 105.8542 }; // Hanoi
      case 'central':
        return { lat: 16.0544, lng: 108.2022 }; // Da Nang
      case 'south':
        return { lat: 10.7769, lng: 106.7009 }; // Ho Chi Minh City
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
      <DialogContent className="max-w-4xl md:max-w-6xl lg:max-w-7xl xl:max-w-[90vw] 2xl:max-w-[85vw] w-[95vw] max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Select Pickup Location for {vehicleName}
          </DialogTitle>
          <p className="text-gray-600">Choose the nearest {vehicleProvider} location to pick up your vehicle</p>
        </DialogHeader>
        
        {/* Search and Filter Controls */}
        <div className="space-y-4 border-b pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, city, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {userLocation && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Center map on user location
                  setSelectedRegion('all');
                  setMapCenter(userLocation);
                  setMapZoom(10);
                }}
                className="flex items-center gap-2"
              >
                <MapPinIcon className="w-4 h-4" />
                My Location
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {/* Region Filter */}
            <div className="flex gap-1">
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
                  className="capitalize"
                >
                  {region === 'all' ? 'All Regions' : `${region} Vietnam`}
                </Button>
              ))}
            </div>
            
            {/* Type Filter */}
            <div className="flex gap-1">
              {(['all', 'automated', 'traditional'] as const).map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="flex items-center gap-1 capitalize"
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
                className="text-gray-500 hover:text-gray-700"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 h-[500px] md:h-[600px] lg:h-[650px] xl:h-[700px] 2xl:h-[750px]">
          {/* Map Section */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden h-full">
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
          <div className="space-y-4 overflow-y-auto h-full">
            <div className="sticky top-0 bg-white py-2 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Available Locations ({filteredDealers.filter(d => d.available).length})
              </h3>
              {filteredDealers.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">No dealers found matching your criteria</p>
              )}
              {filteredDealers.length > 0 && filteredDealers.length < mockDealers.length && (
                <p className="text-sm text-gray-500 mt-1">
                  Showing {filteredDealers.length} of {mockDealers.length} locations
                </p>
              )}
            </div>
            
            {filteredDealers.map((dealer) => (
              <div 
                key={dealer.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedDealer?.id === dealer.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : dealer.available
                      ? 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                }`}
                onClick={() => dealer.available && handleDealerSelect(dealer)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{dealer.name}</h4>
                      {dealer.type === 'automated' ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Zap className="w-3 h-3 mr-1" />
                          Smart Depot
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Building2 className="w-3 h-3 mr-1" />
                          Traditional
                        </span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{dealer.rating}</span>
                      <span className="text-sm text-gray-400 ml-2">•</span>
                      <span className="text-sm text-gray-600 ml-2">{dealer.distance}</span>
                      <span className="text-sm text-gray-400 ml-2">•</span>
                      <span className="text-sm text-gray-600 ml-2 capitalize">{dealer.region} Vietnam</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {dealer.available ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Unavailable
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{dealer.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{dealer.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{dealer.openHours}</span>
                  </div>
                </div>
                
                {dealer.available && (
                  <div className="mt-3 flex items-center justify-between">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
                      <Navigation className="w-4 h-4 mr-1" />
                      Get Directions
                    </button>
                    {selectedDealer?.id === dealer.id && (
                      <span className="text-sm text-blue-600 font-medium">Selected</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-600">
            {selectedDealer ? (
              <span>Selected: <strong>{selectedDealer.name}</strong> ({selectedDealer.distance})</span>
            ) : (
              <span>Please select a pickup location</span>
            )}
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleBooking}
              disabled={!selectedDealer}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Continue Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}