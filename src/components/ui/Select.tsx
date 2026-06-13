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
    <div className="mb-3">
      {label && (
        <label className="form-label fw-semibold text-sm mb-1">{label}</label>
      )}
      <select
        className={`form-select ${error ? 'is-invalid' : ''}`}
        {...register}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
