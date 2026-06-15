import type { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps {
  label?: string;
  type?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  placeholder?: string;
  className?: string;
  step?: string;
}

export default function Input({
  label,
  type = 'text',
  error,
  register,
  placeholder,
  className = '',
  step,
}: InputProps) {
  return (
    <div className="mb-4">
      {label && (
        <label className="font-semibold text-sm mb-1 block">{label}</label>
      )}
      <input
        type={type}
        className={`block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${error ? 'border-red-500' : ''} ${className}`}
        placeholder={placeholder}
        step={step}
        {...register}
      />
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
}
