"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeatureCheckbox } from "./FeatureCheckbox";

const baseInputStyles =
  "h-14 text-base bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors";

export function SearchForm() {
  return (
    <div className="bg-white p-10 rounded-2xl shadow-xl mb-12 max-w-6xl mx-auto border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="space-y-3">
          <label className="block text-base font-semibold text-gray-800 mb-2">
            Location
          </label>
          <Select>
            <SelectTrigger className={baseInputStyles}>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="hanoi">Hanoi</SelectItem>
              <SelectItem value="hcmc">Ho Chi Minh City</SelectItem>
              <SelectItem value="danang">Da Nang</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="block text-base font-semibold text-gray-800 mb-2">
            Pick-up Date
          </label>
          <Input
            type="date"
            className={baseInputStyles}
            placeholder="dd/mm/yyyy"
          />
        </div>

        <div className="space-y-3">
          <label className="block text-base font-semibold text-gray-800 mb-2">
            Car Type
          </label>
          <Select>
            <SelectTrigger className={baseInputStyles}>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="block text-base font-semibold text-gray-800 mb-2">
            Rental Type
          </label>
          <Select>
            <SelectTrigger className={baseInputStyles}>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="traditional">Traditional Dealer</SelectItem>
              <SelectItem value="automated">Automated Self-Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-base font-semibold text-gray-800 mb-4">
          Features
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FeatureCheckbox label="Keyless Entry" />
          <FeatureCheckbox label="GPS Navigation" />
          <FeatureCheckbox label="Child Seat" />
        </div>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-semibold rounded-xl transition-colors">
        Search Cars
      </Button>
    </div>
  );
}
