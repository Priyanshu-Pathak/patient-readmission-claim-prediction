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
    primary: "bg-primary bg-gradient-to-t from-black/10 to-transparent text-primary-foreground hover:brightness-110 shadow-sm",
    secondary: "bg-card backdrop-blur-md border border-primary/50 text-primary-foreground hover:bg-card/80 shadow-[0_0_10px_rgba(20,184,166,0.1)]",
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
