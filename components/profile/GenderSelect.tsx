import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface GenderOption {
  value: string;
  label: string;
}

interface GenderSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const GenderSelect: React.FC<GenderSelectProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const options: GenderOption[] = [
    { value: "", label: "Select" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
  ];

  const handleSelect = (option: GenderOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label
        htmlFor="gender"
        className="block text-sm font-medium text-gray-300 mb-1"
      >
        Gender
      </label>
      <div
        className="w-full p-2 border-b border-gray-600 flex items-center justify-between cursor-pointer bg-transparent text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {options.find((option) => option.value === value)?.label || "Select"}
        </span>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </div>
      {isOpen && (
        <ul className="absolute z-10 w-full bg-[#2A2D36] border border-gray-600 mt-1 rounded-md shadow-lg max-h-[200px] overflow-y-auto">
          {options.map((option) => (
            <li
              key={option.value}
              className="p-2 hover:bg-[#00D897] cursor-pointer text-white"
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GenderSelect;
