import React from "react";
import { cn } from "@/lib/utils";

export function SurfaceCard({
  children,
  className,
  hoverEffect = false,
}: {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}) {
  return (
    <div
      className={cn(
        "glass-effect rounded-xl p-6 text-foreground",
        hoverEffect && "hover-card-elevation",
        className
      )}
    >
      {children}
    </div>
  );
}
