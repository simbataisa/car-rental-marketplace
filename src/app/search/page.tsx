"use client";

import { SearchForm } from "../components/SearchForm";
import { DealerMapModal } from "../components/DealerMapModal";
import { useState } from "react";

export default function SearchPage() {
  const [automated] = useState(true);

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

            <SearchForm />

            {/* Car Listings */}
            <div className="mt-20">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Available Vehicles</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Choose from our premium selection of vehicles, each carefully maintained and ready for your journey.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Modern SUV */}
                <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                  <div className="relative h-56 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <h3 className="relative text-3xl text-white font-bold tracking-wide">Modern SUV</h3>
                    <div className="absolute top-4 right-4">
                      <svg className="w-8 h-8 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-900">VinFast VF8</h4>
                      {automated && (
                        <span className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                          Automated
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mb-3 font-medium">
                      Provided by: <span className="text-blue-600">AutoLease</span>
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">5 Seater</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">Automatic</span>
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md">EV</span>
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md">Keyless</span>
                    </div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-gray-900">
                          1,500,000
                        </span>
                        <span className="text-gray-500 text-sm ml-1">VND/day</span>
                      </div>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                        <span className="text-yellow-500 text-sm">★★★★☆</span>
                        <span className="text-gray-700 ml-1 text-sm font-medium">4.5</span>
                      </div>
                    </div>
                    <DealerMapModal vehicleName="VinFast VF8" vehicleProvider="AutoLease">
                      <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                        Select Pickup Location
                      </button>
                    </DealerMapModal>
                  </div>
                </div>

                 {/* Reliable Sedan */}
                 <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                   <div className="relative h-56 bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center overflow-hidden">
                     <div className="absolute inset-0 bg-black/10"></div>
                     <h3 className="relative text-3xl text-white font-bold tracking-wide">Reliable Sedan</h3>
                     <div className="absolute top-4 right-4">
                       <svg className="w-8 h-8 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                       </svg>
                     </div>
                   </div>
                   <div className="p-6">
                     <div className="flex items-center justify-between mb-4">
                       <h4 className="text-xl font-bold text-gray-900">Toyota Vios</h4>
                     </div>
                     <p className="text-gray-500 text-sm mb-3 font-medium">
                       Provided by: <span className="text-emerald-600">Hanoi Wheels</span>
                     </p>
                     <div className="flex flex-wrap gap-2 mb-4">
                       <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">5 Seater</span>
                       <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">Automatic</span>
                       <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-md">Petrol</span>
                       <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-md">GPS</span>
                     </div>
                     <div className="flex items-center justify-between mb-6">
                       <div className="flex items-baseline">
                         <span className="text-2xl font-bold text-gray-900">
                           800,000
                         </span>
                         <span className="text-gray-500 text-sm ml-1">VND/day</span>
                       </div>
                       <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                         <span className="text-yellow-500 text-sm">★★★★☆</span>
                         <span className="text-gray-700 ml-1 text-sm font-medium">4.0</span>
                       </div>
                     </div>
                     <DealerMapModal vehicleName="Toyota Vios" vehicleProvider="Hanoi Wheels">
                       <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                         Select Pickup Location
                       </button>
                     </DealerMapModal>
                   </div>
                 </div>

                 {/* Spacious Van */}
                 <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                   <div className="relative h-56 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center overflow-hidden">
                     <div className="absolute inset-0 bg-black/10"></div>
                     <h3 className="relative text-3xl text-white font-bold tracking-wide">Spacious Van</h3>
                     <div className="absolute top-4 right-4">
                       <svg className="w-8 h-8 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M17 8h1a1 1 0 011 1v6a1 1 0 01-1 1h-1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1H2a1 1 0 01-1-1V9a1 1 0 011-1h1V7a1 1 0 011-1h12a1 1 0 011 1v1zM4 10v4h12v-4H4z"></path>
                       </svg>
                     </div>
                   </div>
                   <div className="p-6">
                     <div className="flex items-center justify-between mb-4">
                       <h4 className="text-xl font-bold text-gray-900">Kia Carnival</h4>
                       {automated && (
                         <span className="bg-gradient-to-r from-green-400 to-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                           Automated
                         </span>
                       )}
                     </div>
                     <p className="text-gray-500 text-sm mb-3 font-medium">
                       Provided by: <span className="text-red-600">Binh Dinh GoDrive</span>
                     </p>
                     <div className="flex flex-wrap gap-2 mb-4">
                       <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">7 Seater</span>
                       <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">Automatic</span>
                       <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-md">Diesel</span>
                       <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md">Keyless</span>
                     </div>
                     <div className="flex items-center justify-between mb-6">
                       <div className="flex items-baseline">
                         <span className="text-2xl font-bold text-gray-900">
                           1,800,000
                         </span>
                         <span className="text-gray-500 text-sm ml-1">VND/day</span>
                       </div>
                       <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                         <span className="text-yellow-500 text-sm">★★★★★</span>
                         <span className="text-gray-700 ml-1 text-sm font-medium">4.8</span>
                       </div>
                     </div>
                     <DealerMapModal vehicleName="Kia Carnival" vehicleProvider="Binh Dinh GoDrive">
                       <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                         Select Pickup Location
                       </button>
                     </DealerMapModal>
                   </div>
                 </div>

                 {/* Luxury Car */}
                 <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                   <div className="relative h-56 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center overflow-hidden">
                     <div className="absolute inset-0 bg-black/10"></div>
                     <h3 className="relative text-3xl text-white font-bold tracking-wide">Luxury Car</h3>
                     <div className="absolute top-4 right-4">
                       <svg className="w-8 h-8 text-white/80" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"></path>
                       </svg>
                     </div>
                   </div>
                   <div className="p-6">
                     <div className="flex items-center justify-between mb-4">
                       <h4 className="text-xl font-bold text-gray-900">Mercedes E-Class</h4>
                       <span className="bg-gradient-to-r from-purple-400 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                         Premium
                       </span>
                     </div>
                     <p className="text-gray-500 text-sm mb-3 font-medium">
                       Provided by: <span className="text-purple-600">Saigon Premium Rides</span>
                     </p>
                     <div className="flex flex-wrap gap-2 mb-4">
                       <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">5 Seater</span>
                       <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">Automatic</span>
                       <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-md">Petrol</span>
                       <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-md">Safety+</span>
                     </div>
                     <div className="flex items-center justify-between mb-6">
                       <div className="flex items-baseline">
                         <span className="text-2xl font-bold text-gray-900">
                           3,500,000
                         </span>
                         <span className="text-gray-500 text-sm ml-1">VND/day</span>
                       </div>
                       <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
                         <span className="text-yellow-500 text-sm">★★★★★</span>
                         <span className="text-gray-700 ml-1 text-sm font-medium">5.0</span>
                       </div>
                     </div>
                     <DealerMapModal vehicleName="Mercedes E-Class" vehicleProvider="Saigon Premium Rides">
                       <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]">
                         Select Pickup Location
                       </button>
                     </DealerMapModal>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
      </div>
    </>
  );
}
