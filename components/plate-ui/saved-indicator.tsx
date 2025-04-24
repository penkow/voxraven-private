"use client"
import { cn } from "@/lib/utils"

interface SaveIndicatorProps {
  isSaved?: boolean
  className?: string
}

export function SaveIndicator({ isSaved = true, className }: SaveIndicatorProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <div
        className={cn("h-2 w-2 rounded-full transition-colors duration-300", isSaved ? "bg-green-500" : "bg-gray-400")}
      />
      <span className="ml-2 text-xs text-muted-foreground">{isSaved ? "Saved" : "Unsaved"}</span>
    </div>
  )
}
