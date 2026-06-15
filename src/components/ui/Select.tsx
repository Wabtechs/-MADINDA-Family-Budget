import type { UseFormRegisterReturn } from 'react-hook-form';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label?: string;
  options: SelectOption[];
  error?: string;
  register?: UseFormRegisterReturn;
  placeholder?: string;
}

export default function Select({
  label,
  options,
  error,
  register,
  placeholder,
}: SelectProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="font-semibold text-sm mb-1 block">{label}</label>
      )}
      <select
        className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${error ? 'border-red-500' : ''}`}
        {...register}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}
