import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  className?: string;
}

const StatsCard = ({ title, value, change, icon, className }: StatsCardProps) => {
  const isPositive = change > 0;

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg bg-primary/10">{icon}</div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-3xl font-bold">{value}</span>
          <span className={cn(
            "text-sm font-medium",
            isPositive ? "text-green-500" : "text-red-500"
          )}>
            {isPositive ? "+" : ""}{change}%
          </span>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;