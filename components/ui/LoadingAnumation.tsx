"use client"
import { cn } from "@/lib/utils"

interface LoadingAnimationProps {
  size?: "sm" | "md" | "lg"
  color?: "default" | "primary" | "secondary" | "muted"
  className?: string
}

export function LoadingAnimation({ size = "md", color = "primary", className }: LoadingAnimationProps) {
  const sizeClasses = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3",
  }

  const dotSizeClasses = {
    sm: "h-1 w-1",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  }

  const colorClasses = {
    default: "bg-foreground",
    primary: "bg-primary",
    secondary: "bg-secondary",
    muted: "bg-muted-foreground",
  }

  return (
    <div
      className={cn("flex items-center justify-center", sizeClasses[size], className)}
      role="status"
      aria-label="Loading"
    >
      <div
        className={cn("animate-bounce rounded-full", dotSizeClasses[size], colorClasses[color], "animation-delay-0")}
      />
      <div
        className={cn("animate-bounce rounded-full", dotSizeClasses[size], colorClasses[color], "animation-delay-150")}
      />
      <div
        className={cn("animate-bounce rounded-full", dotSizeClasses[size], colorClasses[color], "animation-delay-300")}
      />
      <style jsx>{`
        .animation-delay-0 {
          animation-delay: 0ms;
        }
        .animation-delay-150 {
          animation-delay: 150ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  )
}

