import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  showSuccess?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      showSuccess = false,
      className = '',
      required,
      ...props
    },
    ref
  ) => {
    const baseTextareaStyles = `
      w-full px-4 py-3
      bg-dark-bg
      border border-dark-border
      rounded-lg
      transition-all duration-200
      text-dark-text-primary
      placeholder-dark-text-muted
      text-sm
      min-h-[80px]
      resize-y
      focus:outline-none focus:ring-2 focus:ring-input-focus focus:border-transparent
      disabled:opacity-50 disabled:cursor-not-allowed
      ${error ? 'border-input-error focus:ring-input-error' : ''}
      ${showSuccess ? 'border-input-success focus:ring-input-success' : ''}
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
          <textarea ref={ref} className={baseTextareaStyles} required={required} {...props} />
          {(error || showSuccess) && (
            <div className="absolute top-3 right-3 pointer-events-none">
              {error && <AlertCircle className="h-5 w-5 text-input-error" />}
              {!error && showSuccess && <Check className="h-5 w-5 text-input-success" />}
            </div>
          )}
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

Textarea.displayName = 'Textarea';

export default Textarea;
