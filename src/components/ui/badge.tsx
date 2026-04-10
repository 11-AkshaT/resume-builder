import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase",
        {
          "bg-[#ece4d8] text-[#5d5a55]": variant === "default",
          "bg-[#e5efe9] text-[#215146]": variant === "success",
          "bg-[#f6ebd3] text-[#8a5a11]": variant === "warning",
          "bg-red-50 text-red-700": variant === "destructive",
        },
        className
      )}
      {...props}
    />
  );
}
