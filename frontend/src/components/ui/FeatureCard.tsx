import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  iconColor = 'text-input-focus',
}) => {
  return (
    <div className="p-4 rounded-lg bg-dark-bg border border-dark-border transition-all duration-200 hover:border-input-focus/30">
      <div className="flex justify-center mb-3">
        <div className={`p-2.5 rounded-lg border ${iconColor.includes('bg-') ? iconColor : 'bg-input-focus/10 border-input-focus/20'}`}>
          <Icon className={`w-6 h-6 ${iconColor.includes('text-') ? iconColor : 'text-input-focus'}`} />
        </div>
      </div>
      <h4 className="font-semibold text-dark-text-primary mb-1.5 text-center text-sm">{title}</h4>
      <p className="text-xs text-dark-text-secondary leading-relaxed text-center">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
