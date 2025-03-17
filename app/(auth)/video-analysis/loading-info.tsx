"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

interface ProgressMessage {
  start: number // Starting percentage (inclusive)
  end: number // Ending percentage (exclusive)
  message: string // Message to display in this range
}

interface LoadingBarProps {
  onComplete?: () => void
  messages?: ProgressMessage[]
}

export default function LoadingInfo({ onComplete, messages }: LoadingBarProps) {
  const [progress, setProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    // Total duration in milliseconds (5 minutes)
    const totalDuration = 5 * 60 * 1000

    // Use a non-linear function to calculate progress
    // This makes each percentage point take longer than the previous one
    const calculateProgress = (elapsedTime: number) => {
      // Using a square root function to create a slowing effect
      // As time progresses linearly, progress slows down
      const progressPercentage = Math.sqrt(elapsedTime / totalDuration) * 100
      return Math.min(progressPercentage, 100)
    }

    const startTime = Date.now()
    const intervalId = setInterval(() => {
      const elapsedTime = Date.now() - startTime
      const newProgress = calculateProgress(elapsedTime)

      setProgress(newProgress)

      if (newProgress >= 100) {
        clearInterval(intervalId)
        setIsCompleted(true)
        if (onComplete) onComplete()
      }
    }, 100) // Update every 100ms for smooth animation

    return () => {
      clearInterval(intervalId)
    }
  }, [onComplete])

  // Function to handle external completion signal
  const completeNow = () => {
    setProgress(100)
    setIsCompleted(true)
    if (onComplete) onComplete()
  }

  const getCurrentMessage = () => {
    if (!messages || messages.length === 0) {
      return progress < 80
        ? `Phase 1: ${Math.round((progress / 80) * 100)}% (to 80%)`
        : `Phase 2: ${Math.round(((progress - 80) / 20) * 100)}% (to 100%)`
    }

    const currentMessage = messages.find((msg) => progress >= msg.start && progress < msg.end)

    return currentMessage?.message || "Loading..."
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Loading: {Math.round(progress)}%</span>
          {isCompleted && <span className="text-green-500">Complete!</span>}
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">{getCurrentMessage()}</div>
        {/* <Button onClick={completeNow} disabled={isCompleted} size="sm">
          Complete Now
        </Button> */}
      </div>
    </div>
  )
}


