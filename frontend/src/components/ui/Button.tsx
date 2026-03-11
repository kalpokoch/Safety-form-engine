import React from 'react';
import { LucideIcon } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'error' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      loading = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    // Variant styles
    const variantStyles: Record<ButtonVariant, string> = {
      primary: 'bg-input-focus text-white hover:bg-indigo-600 focus:ring-input-focus shadow-sm hover:shadow',
      secondary: 'bg-dark-card text-dark-text-primary border border-dark-border hover:bg-dark-hover hover:border-input-focus/50 focus:ring-input-focus',
      success: 'bg-input-success text-white hover:bg-emerald-700 focus:ring-input-success shadow-sm hover:shadow',
      error: 'bg-input-error text-white hover:bg-red-600 focus:ring-input-error shadow-sm hover:shadow',
      outline: 'bg-transparent text-dark-text-primary border border-dark-border hover:bg-dark-hover focus:ring-input-focus',
      ghost: 'bg-transparent text-dark-text-secondary hover:bg-dark-hover hover:text-dark-text-primary focus:ring-input-focus',
    };

    // Size styles
    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    // Icon size based on button size
    const iconSizeClass: Record<ButtonSize, string> = {
      sm: 'h-3.5 w-3.5',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    };

    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim();

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg className={`animate-spin ${iconSizeClass[size]}`} fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {children}
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && <Icon className={iconSizeClass[size]} />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className={iconSizeClass[size]} />}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
