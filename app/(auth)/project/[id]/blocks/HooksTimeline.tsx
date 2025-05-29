"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"

type Hook = {
  id: number
  timeInSeconds: number
  timeFormatted: string
  hookType: string
  explanation: string
  hookQuote: string
}

type VideoHooksTimelineProps = {
  hooks: Hook[] | null
  videoDuration: number
  jumpToSecond: (seconds: number) => void
  videoWatchProgress: number
}

export function VideoHooksTimeline({
  hooks,
  videoDuration,
  jumpToSecond,
  videoWatchProgress,
}: VideoHooksTimelineProps) {
  const [activeHook, setActiveHook] = useState<number | null>(null);
  
  // Function to get color based on hook type
  const getHookColor = (hookType: string) => {
    switch (hookType) {
    //   case "Question":
    //     return "bg-blue-500"
    //   case "Statistic":
    //     return "bg-green-500"
    //   case "Story":
    //     return "bg-yellow-500"
    //   case "Surprise":
    //     return "bg-purple-500"
    //   case "Challenge":
    //     return "bg-red-500"
      default:
        return "bg-white border border-gray-600"
    }
  }


  return (
    <div className="w-full space-y-2">
      <div className="relative h-16">
        <div className="absolute top-8 left-0 w-full">
          <Progress value={videoWatchProgress} className="h-1" />
        </div>

        {/* Hook markers */}
        {hooks?.map((hook, index) => {
          const position = (hook.timeInSeconds / videoDuration) * 100
          const isActive = activeHook === index

          return (
            <div
              key={index}
              className="absolute top-[30px] -translate-x-1/2 transform"
              style={{ left: `${position}%` }}
              onMouseEnter={() => setActiveHook(index)}
              onMouseLeave={() => setActiveHook(null)}
            >
              {/* Hook marker dot */}
              <div
                className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-200 ${getHookColor(hook.hookType)} ${isActive ? "scale-150" : ""}`}
                onClick={() => jumpToSecond(hook.timeInSeconds)}
              ></div>

              {/* Popup */}
              {isActive && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-72 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg z-10 text-sm border">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">{hook.hookType}</span>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 mr-1" />
                      {hook.timeFormatted}
                    </div>
                  </div>
                  <div className="text-xs">
                    <span className="font-bold">Quote: </span>{hook.hookQuote}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{hook.explanation}</p>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-gray-800 rotate-45 transform"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
    