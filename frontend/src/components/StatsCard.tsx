import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative";
}

const StatsCard = ({ icon: Icon, label, value, change, changeType = "positive" }: StatsCardProps) => (
  <div className="stats-card flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
    </div>
    <div className="text-3xl font-bold text-foreground">{value}</div>
    {change && (
      <span className={`text-xs font-medium ${changeType === "positive" ? "text-success" : "text-destructive"}`}>
        ↗ {change}
      </span>
    )}
  </div>
);

export default StatsCard;
