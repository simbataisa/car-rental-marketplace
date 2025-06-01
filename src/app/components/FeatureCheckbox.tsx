"use client";

interface FeatureCheckboxProps {
  label: string;
}

export function FeatureCheckbox({ label }: FeatureCheckboxProps) {
  return (
    <label className="flex items-center space-x-3 p-4 h-14 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-gray-700">{label}</span>
    </label>
  );
}
