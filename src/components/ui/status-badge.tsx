import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "pending" | "completed" | "in-progress";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        {
          "bg-yellow-100 text-yellow-800": status === "pending",
          "bg-green-100 text-green-800": status === "completed",
          "bg-blue-100 text-blue-800": status === "in-progress",
        },
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}