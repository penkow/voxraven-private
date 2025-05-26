"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { TranscriptSegment } from "./use-youtube-video";

interface TranscriptViewerProps {
  transcript: TranscriptSegment[];
  currentVideoTime: number;
  onSegmentClick?: (segment: TranscriptSegment) => void;
}

export default function TranscriptViewer({
  transcript,
  currentVideoTime,
  onSegmentClick = () => {}, // Default no-op function
}: TranscriptViewerProps) {
  const segmentRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [currentSegmentId, setCurrentSegmentId] = useState(0);

  // Format time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Scroll to the current segment when currentSegmentId changes
  useEffect(() => {
    transcript.forEach((s, idx) => {
      if (s.startTime <= currentVideoTime && s.endTime > currentVideoTime) {
        setCurrentSegmentId(idx);
      }
    });
    if (currentSegmentId && segmentRefs.current.has(currentSegmentId)) {
      segmentRefs.current.get(currentSegmentId)?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentVideoTime]);

  return (
    <div className="overflow-y-auto rounded-md border p-2">
      {transcript.map((segment) => (
        <div
          key={segment.id}
          ref={(el) => {
            if (el) segmentRefs.current.set(segment.id, el);
          }}
          onClick={() => onSegmentClick(segment)}
          className={cn(
            "mb-1 rounded-md p-3 transition-colors duration-300",
            currentSegmentId === segment.id
              ? "bg-primary/10 shadow-sm"
              : "bg-background hover:bg-muted/50"
          )}
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
            </span>
          </div>
          <p className="text-sm">{segment.text}</p>
        </div>
      ))}
    </div>
  );
}
