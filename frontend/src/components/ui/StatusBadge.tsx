import React from "react";
import { cn } from "@/lib/utils";

export type StatusType = "success" | "warning" | "danger" | "neutral" | "info";

export function StatusBadge({
  status,
  label,
  className,
}: {
  status: StatusType;
  label: string;
  className?: string;
}) {
  const statusStyles = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    danger: "bg-danger/10 text-danger border-danger/20",
    info: "bg-primary/10 text-primary border-primary/20",
    neutral: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        statusStyles[status],
        className
      )}
    >
      {/* Decorative pulse indicator for active states */}
      {(status === "warning" || status === "danger") && (
        <span className="mr-1.5 flex h-1.5 w-1.5 relative">
          <span className={cn("absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping", 
            status === "danger" ? "bg-danger" : "bg-warning"
          )}></span>
          <span className={cn("relative inline-flex rounded-full h-1.5 w-1.5", 
            status === "danger" ? "bg-danger" : "bg-warning"
          )}></span>
        </span>
      )}
      {label}
    </span>
  );
}
