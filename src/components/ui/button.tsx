"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
          {
            "rounded-xl bg-primary text-primary-foreground shadow-[0_14px_32px_-18px_rgba(33,81,70,0.65)] hover:bg-primary-hover":
              variant === "primary",
            "rounded-xl border border-border/80 bg-muted/85 text-foreground hover:bg-[#ebe1d1]":
              variant === "secondary",
            "rounded-lg text-foreground hover:bg-muted/85": variant === "ghost",
            "rounded-xl bg-destructive text-white hover:bg-red-700":
              variant === "destructive",
            "rounded-xl border border-border/90 bg-card/90 text-foreground hover:bg-muted/70 hover:border-[#d7cbb9]":
              variant === "outline",
          },
          {
            "h-8 px-3 text-sm gap-1.5": size === "sm",
            "h-10 px-4 text-sm gap-2": size === "md",
            "h-12 px-6 text-[15px] gap-2.5": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
