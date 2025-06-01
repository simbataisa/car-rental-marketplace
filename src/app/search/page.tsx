"use client";

import { SearchForm } from "../components/SearchForm";
import { useState } from "react";
import { Navbar } from "../components/Navbar";

export default function SearchPage() {
  const [automated] = useState(true);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Find Your <span className="text-blue-600">Perfect Ride</span>
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Search and compare vehicles from our diverse network of trusted
            dealers across Vietnam. Choose from traditional rentals or
            innovative automated self-service options.
          </p>

          <SearchForm />

          {/* Car Listings */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Modern SUV */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-48 bg-blue-600 flex items-center justify-center">
                <h3 className="text-3xl text-white font-bold">Modern SUV</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold">VinFast VF8</h4>
                  {automated && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Automated
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Provided by: AutoLease
                </p>
                <p className="text-gray-700 mb-4">
                  5 Seater, Automatic, EV, Keyless Entry
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-blue-600">
                      1,500,000 VND
                    </span>
                    <span className="text-gray-500 text-sm ml-1">/day</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★★★★</span>
                    <span className="text-gray-600 ml-1">4.5</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details & Book
                </button>
              </div>
            </div>

            {/* Reliable Sedan */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-48 bg-emerald-500 flex items-center justify-center">
                <h3 className="text-3xl text-white font-bold">
                  Reliable Sedan
                </h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold">Toyota Vios</h4>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Provided by: Hanoi Wheels
                </p>
                <p className="text-gray-700 mb-4">
                  5 Seater, Automatic, Petrol, GPS
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-blue-600">
                      800,000 VND
                    </span>
                    <span className="text-gray-500 text-sm ml-1">/day</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★★★★</span>
                    <span className="text-gray-600 ml-1">4.0</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details & Book
                </button>
              </div>
            </div>

            {/* Spacious Van */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-48 bg-yellow-400 flex items-center justify-center">
                <h3 className="text-3xl text-white font-bold">Spacious Van</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold">Kia Carnival</h4>
                  {automated && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Automated
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Provided by: Binh Dinh GoDrive
                </p>
                <p className="text-gray-700 mb-4">
                  7 Seater, Automatic, Diesel, Keyless
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-blue-600">
                      1,800,000 VND
                    </span>
                    <span className="text-gray-500 text-sm ml-1">/day</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-gray-600 ml-1">4.8</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details & Book
                </button>
              </div>
            </div>

            {/* Luxury Car */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-48 bg-red-500 flex items-center justify-center">
                <h3 className="text-3xl text-white font-bold">Luxury Car</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold">Mercedes E-Class</h4>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Provided by: Saigon Premium Rides
                </p>
                <p className="text-gray-700 mb-4">
                  5 Seater, Automatic, Petrol, Advanced Safety
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-xl font-bold text-blue-600">
                      3,500,000 VND
                    </span>
                    <span className="text-gray-500 text-sm ml-1">/day</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-gray-600 ml-1">5.0</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  View Details & Book
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
