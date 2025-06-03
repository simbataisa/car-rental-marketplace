"use client";

import { SearchForm } from "../components/SearchForm";
import { DealerMapModal } from "../components/DealerMapModal";
import { useState } from "react";

// Import SearchFilters type from SearchForm
type SearchFilters = {
  location: string;
  pickupDate: string;
  carType: string;
  rentalType: string;
  features: {
    keylessEntry: boolean;
    gpsNavigation: boolean;
    childSeat: boolean;
  };
};

interface Vehicle {
  id: string;
  name: string;
  provider: string;
  type: string;
  location: string;
  price: number;
  rating: number;
  seater: string;
  transmission: string;
  fuel: string;
  features: string[];
  isAutomated: boolean;
  gradient: string;
  buttonGradient: string;
  providerColor: string;
  category: string;
}

const vehicleData: Vehicle[] = [
  {
    id: "1",
    name: "VinFast VF8",
    provider: "AutoLease",
    type: "suv",
    location: "hanoi",
    price: 1500000,
    rating: 4.5,
    seater: "5 Seater",
    transmission: "Automatic",
    fuel: "EV",
    features: ["Keyless Entry", "GPS Navigation"],
    isAutomated: true,
    gradient: "from-blue-500 to-blue-700",
    buttonGradient: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
    providerColor: "text-blue-600",
    category: "Modern SUV"
  },
  {
    id: "2",
    name: "Toyota Vios",
    provider: "Hanoi Wheels",
    type: "sedan",
    location: "hanoi",
    price: 800000,
    rating: 4.0,
    seater: "5 Seater",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["GPS Navigation"],
    isAutomated: false,
    gradient: "from-emerald-500 to-emerald-700",
    buttonGradient: "from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800",
    providerColor: "text-emerald-600",
    category: "Reliable Sedan"
  },
  {
    id: "3",
    name: "Kia Carnival",
    provider: "Binh Dinh GoDrive",
    type: "van",
    location: "danang",
    price: 1800000,
    rating: 4.8,
    seater: "7 Seater",
    transmission: "Automatic",
    fuel: "Diesel",
    features: ["Keyless Entry"],
    isAutomated: true,
    gradient: "from-red-500 to-red-700",
    buttonGradient: "from-red-600 to-red-700 hover:from-red-700 hover:to-red-800",
    providerColor: "text-red-600",
    category: "Spacious Van"
  },
  {
    id: "4",
    name: "Mercedes E-Class",
    provider: "Saigon Premium Rides",
    type: "luxury",
    location: "hcmc",
    price: 3500000,
    rating: 5.0,
    seater: "5 Seater",
    transmission: "Automatic",
    fuel: "Petrol",
    features: ["GPS Navigation", "Child Seat"],
    isAutomated: false,
    gradient: "from-purple-600 to-purple-800",
    buttonGradient: "from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800",
    providerColor: "text-purple-600",
    category: "Luxury Car"
  },
  {
    id: "5",
    name: "Honda City",
    provider: "Da Nang Auto",
    type: "sedan",
    location: "danang",
    price: 650000,
    rating: 4.2,
    seater: "5 Seater",
    transmission: "Manual",
    fuel: "Petrol",
    features: ["GPS Navigation"],
    isAutomated: true,
    gradient: "from-teal-500 to-teal-700",
    buttonGradient: "from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800",
    providerColor: "text-teal-600",
    category: "Compact Car"
  },
  {
    id: "6",
    name: "VinFast Klara",
    provider: "Hue E-Mobility",
    type: "motorcycle",
    location: "hcmc",
    price: 300000,
    rating: 4.3,
    seater: "2 Seater",
    transmission: "Automatic",
    fuel: "Electric",
    features: ["Keyless Entry"],
    isAutomated: true,
    gradient: "from-indigo-500 to-indigo-700",
    buttonGradient: "from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800",
    providerColor: "text-indigo-600",
    category: "E-Motorcycle"
  },
  {
    id: "7",
    name: "Ford Ranger",
    provider: "Hai Phong Trucks",
    type: "pickup",
    location: "haiphong",
    price: 1800000,
    rating: 4.4,
    seater: "5 Seater",
    transmission: "Manual",
    fuel: "Diesel",
    features: ["GPS Navigation"],
    isAutomated: false,
    gradient: "from-orange-500 to-orange-700",
    buttonGradient: "from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800",
    providerColor: "text-orange-600",
    category: "Pickup Truck"
  },
  {
    id: "8",
    name: "VinFast VF9",
    provider: "VinFast Premium",
    type: "suv",
    location: "hcmc",
    price: 2200000,
    rating: 4.8,
    seater: "7 Seater",
    transmission: "Automatic",
    fuel: "EV",
    features: ["Keyless Entry", "GPS Navigation", "Child Seat"],
    isAutomated: true,
    gradient: "from-indigo-500 to-indigo-700",
    buttonGradient: "from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800",
    providerColor: "text-indigo-600",
    category: "Premium SUV"
  },
  {
    id: "9",
    name: "VinFast VF5",
    provider: "VinFast Compact",
    type: "hatchback",
    location: "danang",
    price: 900000,
    rating: 4.3,
    seater: "5 Seater",
    transmission: "Automatic",
    fuel: "EV",
    features: ["Keyless Entry", "GPS Navigation"],
    isAutomated: true,
    gradient: "from-cyan-500 to-cyan-700",
    buttonGradient: "from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800",
    providerColor: "text-cyan-600",
    category: "Compact EV"
  },
  {
    id: "10",
    name: "VinFast VF6",
    provider: "VinFast Urban",
    type: "sedan",
    location: "hanoi",
    price: 1200000,
    rating: 4.6,
    seater: "5 Seater",
    transmission: "Automatic",
    fuel: "EV",
    features: ["Keyless Entry", "GPS Navigation"],
    isAutomated: true,
    gradient: "from-violet-500 to-violet-700",
    buttonGradient: "from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800",
    providerColor: "text-violet-600",
    category: "Electric Sedan"
  },
  {
    id: "11",
    name: "VinFast VF7",
    provider: "VinFast Family",
    type: "suv",
    location: "hcmc",
    price: 1800000,
    rating: 4.7,
    seater: "5 Seater",
    transmission: "Automatic",
    fuel: "EV",
    features: ["Keyless Entry", "GPS Navigation", "Child Seat"],
    isAutomated: true,
    gradient: "from-rose-500 to-rose-700",
    buttonGradient: "from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800",
    providerColor: "text-rose-600",
    category: "Family SUV"
  }
];

export default function SearchPage() {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: "",
    pickupDate: "",
    carType: "",
    rentalType: "",
    features: {
      keylessEntry: false,
      gpsNavigation: false,
      childSeat: false
    }
  });

  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicleData);

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    
    let filtered = vehicleData.filter(vehicle => {
      // Location filter
      if (filters.location && vehicle.location !== filters.location) {
        return false;
      }
      
      // Car type filter
      if (filters.carType && vehicle.type !== filters.carType) {
        return false;
      }
      
      // Rental type filter
      if (filters.rentalType === "traditional" && vehicle.isAutomated) {
        return false;
      }
      if (filters.rentalType === "automated" && !vehicle.isAutomated) {
        return false;
      }
      
      // Features filter
      const requiredFeatures = [];
      if (filters.features.keylessEntry) requiredFeatures.push("Keyless Entry");
      if (filters.features.gpsNavigation) requiredFeatures.push("GPS Navigation");
      if (filters.features.childSeat) requiredFeatures.push("Child Seat");
      
      if (requiredFeatures.length > 0) {
        const hasAllFeatures = requiredFeatures.every(feature => 
          vehicle.features.includes(feature)
        );
        if (!hasAllFeatures) {
          return false;
        }
      }
      
      return true;
    });
    
    setFilteredVehicles(filtered);
  };

  const handleClear = () => {
    const clearedFilters = {
      location: '',
      pickupDate: '',
      carType: '',
      rentalType: '',
      features: {
        keylessEntry: false,
        gpsNavigation: false,
        childSeat: false,
      },
    };
    setSearchFilters(clearedFilters);
    setFilteredVehicles(vehicleData); // Reset to show all vehicles
  };

  const renderVehicleCard = (vehicle: Vehicle) => {
    const fuelColorMap: { [key: string]: string } = {
      "EV": "bg-green-100 text-green-700",
      "Electric": "bg-green-100 text-green-700",
      "Petrol": "bg-orange-100 text-orange-700",
      "Diesel": "bg-yellow-100 text-yellow-700"
    };

    const additionalFeatures = vehicle.features.map(feature => {
      if (feature === "Keyless Entry") return "bg-blue-100 text-blue-700";
      if (feature === "GPS Navigation") return "bg-purple-100 text-purple-700";
      if (feature === "Child Seat") return "bg-pink-100 text-pink-700";
      return "bg-gray-100 text-gray-700";
    });

    return (
      <div key={vehicle.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
        <div className={`relative h-56 bg-gradient-to-br ${vehicle.gradient} flex items-center justify-center overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <h3 className="relative text-3xl text-white font-bold tracking-wide">{vehicle.category}</h3>
          <div className="absolute top-4 right-4">
            <svg className="w-8 h-8 text-white/80" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
            </svg>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xl font-bold text-gray-900">{vehicle.name}</h4>
            {vehicle.isAutomated && (
              <span className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                Automated
              </span>
            )}
            {vehicle.type === "luxury" && (
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                Premium
              </span>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-3 font-medium">
            Provided by: <span className={vehicle.providerColor}>{vehicle.provider}</span>
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">{vehicle.seater}</span>
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">{vehicle.transmission}</span>
            <span className={`text-xs px-2 py-1 rounded-md ${fuelColorMap[vehicle.fuel] || "bg-gray-100 text-gray-700"}`}>{vehicle.fuel}</span>
            {vehicle.features.map((feature, index) => (
              <span key={index} className={`text-xs px-2 py-1 rounded-md ${additionalFeatures[index] || "bg-gray-100 text-gray-700"}`}>
                {feature === "Keyless Entry" ? "Keyless" : feature === "GPS Navigation" ? "GPS" : feature === "Child Seat" ? "Child Seat" : feature}
              </span>
            ))}
            {vehicle.fuel === "Diesel" && vehicle.type === "truck" && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-md">4WD</span>
            )}
            {vehicle.type === "luxury" && (
              <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-md">Safety+</span>
            )}
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-gray-900">
                {vehicle.price.toLocaleString()}
              </span>
              <span className="text-gray-500 text-sm ml-1">VND/day</span>
            </div>
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
              <span className="text-yellow-500 text-sm">{'★'.repeat(Math.floor(vehicle.rating))}{'☆'.repeat(5 - Math.floor(vehicle.rating))}</span>
              <span className="text-gray-700 ml-1 text-sm font-medium">{vehicle.rating}</span>
            </div>
          </div>
          <DealerMapModal vehicleName={vehicle.name} vehicleProvider={vehicle.provider}>
            <button className={`w-full bg-gradient-to-r ${vehicle.buttonGradient} text-white py-3 rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]`}>
              Select Pickup Location
            </button>
          </DealerMapModal>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Find Your <span className="text-blue-600">Perfect Ride</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover and compare premium vehicles from our curated network of trusted dealers across Vietnam. 
                Experience the future with traditional rentals or cutting-edge automated self-service options.
              </p>
              <div className="flex justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Instant Booking</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <span>Best Prices</span>
                </div>
              </div>
            </div>

            <SearchForm onSearch={handleSearch} onClear={handleClear} />

            {/* Car Listings */}
            <div className="mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Vehicles</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Choose from our premium selection of vehicles, each carefully maintained and ready for your journey.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map(vehicle => renderVehicleCard(vehicle))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No vehicles found</h3>
                    <p className="text-gray-500">Try adjusting your search filters to find more options.</p>
                  </div>
                )}
               </div>
             </div>
           </div>
         </div>
      </div>
    </>
  );
}
