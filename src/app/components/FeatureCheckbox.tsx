"use client";

interface FeatureCheckboxProps {
  id?: string;
  label: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function FeatureCheckbox({ id, label, description, checked = false, onChange }: FeatureCheckboxProps) {
  return (
    <label className="flex items-center space-x-3 p-4 h-14 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        className="w-5 h-5 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
      />
      <div className="flex flex-col">
        <span className="text-base font-medium text-gray-700">{label}</span>
        {description && (
          <span className="text-sm text-gray-500">{description}</span>
        )}
      </div>
    </label>
  );
}
