// components/AIFormField.tsx
import React from "react";

interface AIFormFieldProps {
  label: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  placeholder: string;
  type?: "text" | "textarea";
  name?: string;
  rows?: number;
}

const AIFormField: React.FC<AIFormFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  name = "",
  rows = 1,
}) => {
  return (
    <div className="rounded-lg border border-gray-700 py-2 px-3 bg-[#1F222A]">
      <h3 className="mb-2 pb-1 border-b border-gray-700">{label}</h3>
      {type === "text" ? (
        <input
          type="text"
          value={value}
          onChange={onChange}
          name={name}
          placeholder={placeholder}
          className="w-full bg-transparent focus:outline-none focus:border-primary-900"
        />
      ) : (
        <textarea
          value={value}
          onChange={onChange}
          name={name}
          rows={rows}
          placeholder={placeholder}
          className="w-full bg-transparent resize-none focus:outline-none"
        />
      )}
    </div>
  );
};

export default AIFormField;
