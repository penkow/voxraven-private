"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingAnimationProps {
  messages?: string[];
  dotCount?: number;
  speed?: number;
  hidden?: boolean;
  className?: string;
}

export function LoadingAnimation({
  messages = [
    "Loading your content",
    "Preparing your experience",
    "Almost there",
    "Just a moment",
    "Fetching data",
  ],
  dotCount = 5,
  speed = 200,
  hidden = false,
  className,
}: LoadingAnimationProps) {
  const [activeDots, setActiveDots] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Animate the dots
    const dotInterval = setInterval(() => {
      setActiveDots((prev) => (prev + 1) % (dotCount + 1));
    }, speed);

    // Change the message every few seconds
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, speed * 8);

    return () => {
      clearInterval(dotInterval);
      clearInterval(messageInterval);
    };
  }, [dotCount, messages.length, speed]);

  return (
    <div
      className={cn(
        `flex flex-col items-center justify-center gap-4  ${
          hidden ? `visible` : `hidden`
        }`,
        className
      )}
    >
      <div
        className="flex items-center justify-center gap-2"
        aria-hidden="true"
      >
        {Array.from({ length: dotCount }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-3 w-3 rounded-full transition-all duration-300 ease-in-out",
              index < activeDots ? "scale-100 bg-primary" : "scale-75 bg-muted"
            )}
          />
        ))}
      </div>

      <div className="h-6 text-center">
        <p
          className="animate-fade-in text-sm text-muted-foreground"
          key={messageIndex}
        >
          {messages[messageIndex]}
        </p>
      </div>

      <span className="sr-only">Loading. {messages[messageIndex]}</span>
    </div>
  );
}
