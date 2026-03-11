import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  icon: Icon,
  iconColor = 'text-input-focus',
  title,
  description,
  actions,
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-text-primary mb-2 flex items-center gap-2.5">
            <Icon className={`h-7 w-7 ${iconColor}`} />
            {title}
          </h1>
          {description && (
            <p className="text-base text-dark-text-secondary">{description}</p>
          )}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
