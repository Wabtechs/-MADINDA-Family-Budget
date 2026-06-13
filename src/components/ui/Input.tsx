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
    <div className="mb-3">
      {label && (
        <label className="form-label fw-semibold text-sm mb-1">{label}</label>
      )}
      <input
        type={type}
        className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
        placeholder={placeholder}
        step={step}
        {...register}
      />
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
