import type { LucideIcon } from "lucide-react";
import { AnimatedCard } from "@/components/ui/animated-card";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative";
}

const StatsCard = ({ icon: Icon, label, value, change, changeType = "positive" }: StatsCardProps) => (
  <AnimatedCard>
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground card-label">{label}</span>
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center card-icon-bg">
        <Icon className="w-5 h-5 text-muted-foreground card-icon" />
      </div>
    </div>
    <div className="text-3xl font-bold text-foreground mt-3 card-value">{value}</div>
    {change && (
      <span className={`text-xs font-medium mt-3 inline-block ${changeType === "positive" ? "text-success" : "text-destructive"}`}>
        ↗ {change}
      </span>
    )}
  </AnimatedCard>
);

export default StatsCard;
