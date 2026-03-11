import React from 'react';
import { LucideIcon } from 'lucide-react';

export type CardVariant = 'default' | 'elevated' | 'bordered' | 'interactive';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hoverable?: boolean;
  clickable?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
}

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { variant = 'default', hoverable = false, clickable = false, children, className = '', ...props },
    ref
  ) => {
    const baseStyles = 'bg-dark-card rounded-lg border border-dark-border';
    
    const variantStyles: Record<CardVariant, string> = {
      default: 'shadow-lg',
      elevated: 'shadow-xl',
      bordered: 'shadow-sm border-2',
      interactive: 'shadow-lg hover:shadow-xl transition-all duration-200',
    };

    const hoverStyles = hoverable ? 'hover:shadow-xl transition-all duration-200' : '';
    const clickableStyles = clickable ? 'cursor-pointer hover:border-input-focus/50' : '';

    const combinedClassName = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${hoverStyles}
      ${clickableStyles}
      ${className}
    `.trim();

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ icon: Icon, iconColor, title, description, className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`p-6 ${className}`} {...props}>
        {Icon && (
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3 border ${iconColor || 'bg-input-focus/10 border-input-focus/20'}`}>
            <Icon className={`w-6 h-6 ${iconColor ? iconColor.replace('bg-', 'text-').replace('/10', '') : 'text-input-focus'}`} />
          </div>
        )}
        <h2 className="text-xl font-bold text-dark-text-primary mb-2">{title}</h2>
        {description && (
          <p className="text-sm text-dark-text-secondary leading-relaxed">{description}</p>
        )}
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

const CardBody = React.forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`p-6 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div ref={ref} className={`p-6 pt-0 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter };
