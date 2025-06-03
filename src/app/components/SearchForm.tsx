"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FeatureCheckbox from "./FeatureCheckbox";

const baseInputStyles =
  "h-14 text-base bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors";

interface SearchFilters {
  location: string;
  pickupDate: string;
  carType: string;
  rentalType: string;
  features: {
    keylessEntry: boolean;
    gpsNavigation: boolean;
    childSeat: boolean;
  };
}

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  onClear?: () => void;
}

export function SearchForm({ onSearch, onClear }: SearchFormProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    pickupDate: '',
    carType: '',
    rentalType: '',
    features: {
      keylessEntry: false,
      gpsNavigation: false,
      childSeat: false,
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleFeatureChange = (feature: keyof SearchFilters['features'], checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: checked,
      },
    }));
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
    setFilters(clearedFilters);
    onClear?.();
  };
  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl mb-12 max-w-6xl mx-auto border border-gray-100">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 block">
              Location
            </label>
            <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
              <SelectTrigger className={baseInputStyles}>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hanoi">Hanoi</SelectItem>
                <SelectItem value="hcmc">Ho Chi Minh City</SelectItem>
                <SelectItem value="danang">Da Nang</SelectItem>
                <SelectItem value="haiphong">Hai Phong</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 block">
              Pick-up Date
            </label>
            <Input
              type="date"
              value={filters.pickupDate}
              onChange={(e) => setFilters(prev => ({ ...prev, pickupDate: e.target.value }))}
              className={baseInputStyles}
              placeholder="Select date"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 block">
              Car Type
            </label>
            <Select value={filters.carType} onValueChange={(value) => setFilters(prev => ({ ...prev, carType: value }))}>
              <SelectTrigger className={baseInputStyles}>
                <SelectValue placeholder="Select car type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="hatchback">Hatchback</SelectItem>
                <SelectItem value="luxury">Luxury</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="motorcycle">E-Motorcycle</SelectItem>
                <SelectItem value="pickup">Pickup Truck</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 block">
              Rental Type
            </label>
            <Select value={filters.rentalType} onValueChange={(value) => setFilters(prev => ({ ...prev, rentalType: value }))}>
              <SelectTrigger className={baseInputStyles}>
                <SelectValue placeholder="Select rental type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCheckbox
              id="keyless"
              label="Keyless Entry"
              description="Convenient keyless access"
              checked={filters.features.keylessEntry}
              onChange={(checked) => handleFeatureChange('keylessEntry', checked)}
            />
            <FeatureCheckbox
              id="gps"
              label="GPS Navigation"
              description="Built-in navigation system"
              checked={filters.features.gpsNavigation}
              onChange={(checked) => handleFeatureChange('gpsNavigation', checked)}
            />
            <FeatureCheckbox
              id="child-seat"
              label="Child Seat"
              description="Safety seat for children"
              checked={filters.features.childSeat}
              onChange={(checked) => handleFeatureChange('childSeat', checked)}
            />
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Search Cars
          </Button>
          <Button 
            type="button"
            onClick={handleClear}
            className="bg-gray-500 hover:bg-gray-600 text-white px-12 py-4 text-lg font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Clear Filters
          </Button>
        </div>
      </form>
    </div>
  );
}
