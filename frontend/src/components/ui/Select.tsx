import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showSuccess?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      showSuccess = false,
      className = '',
      children,
      required,
      ...props
    },
    ref
  ) => {
    const baseSelectStyles = `
      w-full px-4 py-3
      bg-dark-bg
      border border-dark-border
      rounded-lg
      transition-all duration-200
      text-dark-text-primary
      text-sm
      focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error ? 'border-input-error focus:ring-input-error' : ''}
      ${showSuccess ? 'border-input-success focus:ring-input-success' : ''}
      pr-10
    `.trim();

    return (
      <div className={`${className}`}>
        {label && (
          <label className="block text-sm font-semibold text-dark-text-primary mb-1.5">
            {label}
            {required && <span className="text-input-error ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select ref={ref} className={baseSelectStyles} required={required} {...props}>
            {children}
          </select>
          <div className="absolute inset-y-0 right-8 flex items-center pr-3 pointer-events-none">
            {error && <AlertCircle className="h-5 w-5 text-input-error" />}
            {!error && showSuccess && <Check className="h-5 w-5 text-input-success" />}
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-input-error">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-1.5 text-xs text-dark-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
