import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: AlertVariant;
  title?: string;
  message?: string;
  icon?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    { variant, title, message, icon = true, children, className = '', ...props },
    ref
  ) => {
    const variantConfig = {
      success: {
        bg: 'bg-input-success/10',
        border: 'border-input-success/50',
        text: 'text-input-success',
        Icon: CheckCircle,
      },
      error: {
        bg: 'bg-input-error/10',
        border: 'border-input-error/50',
        text: 'text-input-error',
        Icon: XCircle,
      },
      warning: {
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/50',
        text: 'text-yellow-500',
        Icon: AlertCircle,
      },
      info: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/50',
        text: 'text-blue-500',
        Icon: Info,
      },
    };

    const config = variantConfig[variant];
    const Icon = config.Icon;

    return (
      <div
        ref={ref}
        className={`${config.bg} border ${config.border} ${config.text} px-4 py-3 rounded-lg flex items-start gap-2.5 ${className}`}
        {...props}
      >
        {icon && <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" />}
        <div className="flex-1">
          {title && <div className="font-semibold text-sm mb-1">{title}</div>}
          {message && <div className="text-sm">{message}</div>}
          {children && <div className="text-sm">{children}</div>}
        </div>
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
