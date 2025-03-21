import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { ProgressMessage } from "../../lib/types";

interface LoadingInfoProps {
  onComplete?: () => void;
  messages?: ProgressMessage[];
}

export function LoadingInfo({ onComplete, messages }: LoadingInfoProps) {
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const totalDuration = 5 * 60 * 1000; // 5 minutes

    const calculateProgress = (elapsedTime: number) => {
      // Using a square root function to create a slowing effect
      const progressPercentage = Math.sqrt(elapsedTime / totalDuration) * 100;
      return Math.min(progressPercentage, 100);
    };

    const startTime = Date.now();
    const intervalId = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newProgress = calculateProgress(elapsedTime);

      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(intervalId);
        setIsCompleted(true);
        onComplete?.();
      }
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(intervalId);
  }, [onComplete]);

  const getCurrentMessage = () => {
    if (!messages?.length) {
      return progress < 80
        ? `Phase 1: ${Math.round((progress / 80) * 100)}% (to 80%)`
        : `Phase 2: ${Math.round(((progress - 80) / 20) * 100)}% (to 100%)`;
    }

    return messages.find(
      (msg) => progress >= msg.start && progress < msg.end
    )?.message || "Loading...";
  };

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
      </div>
    </div>
  );
} 