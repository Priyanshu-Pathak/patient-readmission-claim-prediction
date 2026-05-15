import React from "react";
import { cn } from "@/lib/utils";

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline";
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-ring disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    secondary: "bg-secondary text-primary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-transparent hover:bg-muted text-foreground",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], "h-10 py-2 px-4", className)}
      {...props}
    >
      {children}
    </button>
  );
}
