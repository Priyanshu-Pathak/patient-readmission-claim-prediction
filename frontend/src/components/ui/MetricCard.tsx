import React from "react";
import { SurfaceCard } from "./SurfaceCard";
import { cn } from "@/lib/utils";

export function MetricCard({
  title,
  value,
  description,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  description?: string;
  trend?: { value: string; isPositive: boolean };
  className?: string;
}) {
  return (
    <SurfaceCard className={cn("flex flex-col gap-2", className)} hoverEffect>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-foreground tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-success" : "text-danger"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </SurfaceCard>
  );
}
