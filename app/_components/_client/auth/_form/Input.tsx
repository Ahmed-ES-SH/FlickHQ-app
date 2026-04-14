import React from "react";
import { IconType } from "react-icons/lib";

interface InputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  name: string;
  type: string;
  placeholder: string;
  icon: IconType;
  onclick?: () => void;
  error?: string;
}

export default function Input({
  onChange,
  value,
  name,
  type,
  placeholder,
  icon,
  onclick,
  error,
}: InputProps) {
  const Icon = icon;

  return (
    <div key={name} className="w-full relative group">
      <div
        onClick={onclick}
        className={`absolute left-3 top-1/2 z-20 -translate-y-1/2 text-gray-400 group-focus-within:text-accent duration-300 ${
          onclick ? "cursor-pointer hover:text-accent" : ""
        }`}
      >
        <Icon size={18} />
      </div>
      <input
        onChange={onChange}
        value={value}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent duration-300 placeholder:text-gray-500 ${error ? "border-red-600 focus:border-red-600" : ""}`}
      />

      {error && <p className="text-red-500 mt-2.5 text-sm">{error}</p>}
    </div>
  );
}
