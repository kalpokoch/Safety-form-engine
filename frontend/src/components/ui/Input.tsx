import React from 'react';
import { Check, AlertCircle, LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightIcon?: LucideIcon;
  leftIcon?: LucideIcon;
  helperText?: string;
  showSuccess?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      rightIcon: RightIcon,
      leftIcon: LeftIcon,
      helperText,
      showSuccess = false,
      className = '',
      required,
      ...props
    },
    ref
  ) => {
    const baseInputStyles = `
      w-full px-4 py-3
      bg-dark-bg
      border border-dark-border
      rounded-lg
      transition-all duration-200
      text-dark-text-primary
      placeholder-dark-text-muted
      text-sm
      focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error ? 'border-input-error focus:ring-input-error' : ''}
      ${showSuccess ? 'border-input-success focus:ring-input-success' : ''}
      ${LeftIcon ? 'pl-10' : ''}
      ${RightIcon || error || showSuccess ? 'pr-10' : ''}
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
          {LeftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LeftIcon className="h-5 w-5 text-dark-text-muted" />
            </div>
          )}
          <input ref={ref} className={baseInputStyles} required={required} {...props} />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {error && <AlertCircle className="h-5 w-5 text-input-error" />}
            {!error && showSuccess && <Check className="h-5 w-5 text-input-success" />}
            {!error && !showSuccess && RightIcon && <RightIcon className="h-5 w-5 text-dark-text-muted" />}
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

Input.displayName = 'Input';

export default Input;
