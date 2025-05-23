"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock transcript data with timestamps
const mockTranscript = [
  {
    id: 1,
    speaker: "John",
    text: "Good morning everyone. Thank you for joining today's meeting about the new product launch.",
    startTime: 0,
    endTime: 5.2,
  },
  {
    id: 2,
    speaker: "Sarah",
    text: "Thanks John. I'd like to start by discussing our marketing strategy for the first quarter.",
    startTime: 5.3,
    endTime: 9.8,
  },
  {
    id: 3,
    speaker: "John",
    text: "That sounds great. We've been working on some new social media campaigns that I think will be very effective.",
    startTime: 10.0,
    endTime: 15.5,
  },
  {
    id: 4,
    speaker: "Michael",
    text: "I have some data from our previous campaigns that might be helpful. Can I share my screen?",
    startTime: 15.6,
    endTime: 19.2,
  },
  {
    id: 5,
    speaker: "Sarah",
    text: "Of course, go ahead Michael. I'm particularly interested in seeing how our last video campaign performed.",
    startTime: 19.3,
    endTime: 24.1,
  },
  {
    id: 6,
    speaker: "Michael",
    text: "As you can see from these numbers, our engagement rate increased by 45% when we focused on customer testimonials.",
    startTime: 24.2,
    endTime: 30.5,
  },
  {
    id: 7,
    speaker: "John",
    text: "That's impressive. I think we should definitely incorporate more testimonials in our upcoming launch.",
    startTime: 30.6,
    endTime: 35.0,
  },
  {
    id: 8,
    speaker: "Sarah",
    text: "I agree. Let's plan to collect some testimonials from our beta testers before the official launch date.",
    startTime: 35.1,
    endTime: 40.2,
  },
  {
    id: 9,
    speaker: "Michael",
    text: "I can coordinate with the product team to identify our most enthusiastic beta users for testimonials.",
    startTime: 40.3,
    endTime: 45.8,
  },
  {
    id: 10,
    speaker: "John",
    text: "Perfect. Let's reconvene next week to review the testimonials and finalize our marketing materials.",
    startTime: 45.9,
    endTime: 50.0,
  },
];

// Total duration of the mock audio in seconds
const totalDuration = mockTranscript[mockTranscript.length - 1].endTime;

export default function TranscriptViewer() {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentId, setCurrentSegmentId] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const segmentRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Function to find the current segment based on time
  const findCurrentSegment = (time: number) => {
    const segment = mockTranscript.find(
      (seg) => time >= seg.startTime && time <= seg.endTime
    );
    return segment?.id || null;
  };

  // Start or stop the playback
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime + 0.1;
          if (newTime >= totalDuration) {
            setIsPlaying(false);
            return totalDuration;
          }
          return newTime;
        });
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying]);

  // Update the current segment based on time
  useEffect(() => {
    const segmentId = findCurrentSegment(currentTime);
    if (segmentId !== currentSegmentId) {
      setCurrentSegmentId(segmentId);

      // Scroll to the current segment
      if (segmentId && segmentRefs.current.has(segmentId)) {
        segmentRefs.current.get(segmentId)?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [currentTime, currentSegmentId]);

  // Toggle play/pause
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  // Reset playback
  const resetPlayback = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentSegmentId(null);
  };

  // Format time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="max-h-[400px] overflow-y-auto rounded-md border p-2">
      {mockTranscript.map((segment) => (
        <div
          key={segment.id}
          ref={(el) => {
            if (el) segmentRefs.current.set(segment.id, el);
          }}
          className={cn(
            "mb-3 rounded-md p-3 transition-colors duration-300",
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
