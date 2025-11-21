'use client'

import { cn } from "@/app/cn";

type LoadingSpinnerProps = {
  title?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
}

export default function LoadingSpinner({
                                         title = "Procesando...",
                                         subtitle = "Por favor espere",
                                         size = "md"
                                       }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-12 h-12 border-2",
    md: "w-16 h-16 border-4",
    lg: "w-20 h-20 border-4"
  };

  const titleSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl"
  };

  const subtitleSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={cn(
      "fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50",
      "flex items-center justify-center"
    )}>
      <div className={cn(
        "bg-slate-800 rounded-lg p-8 shadow-2xl border border-slate-700",
        "flex flex-col items-center space-y-4"
      )}>
        <div className={cn(
          sizeClasses[size],
          "border-slate-600 border-t-blue-500",
          "rounded-full animate-spin"
        )} />
        {title && (
          <p className={cn(
            "text-slate-300 font-medium",
            titleSizeClasses[size]
          )}>
            {title}
          </p>
        )}
        {subtitle && (
          <p className={cn(
            "text-slate-400",
            subtitleSizeClasses[size]
          )}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
