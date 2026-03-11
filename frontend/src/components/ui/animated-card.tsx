import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  withCorner?: boolean;
  disabled?: boolean;
}

const AnimatedCard = ({ children, className, withCorner = false, disabled = false }: AnimatedCardProps) => {
  return (
    <div className={cn("animated-card", disabled && "disabled", className)}>
      {withCorner && (
        <div className="go-corner">
          <div className="go-arrow">→</div>
        </div>
      )}
      {children}
    </div>
  );
};

export { AnimatedCard };
