"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";

interface TruncatedTextProps {
  text: string;
  className?: string;
  maxLines?: number;
  isLoading?: boolean;
  isSummary?: boolean;
}

export function TruncatedText({
  text,
  className,
  maxLines = 3,
  isLoading,
  isSummary = false,
}: TruncatedTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <p
        className={cn(
          "text-xs text-muted-foreground transition-colors",
          className
        )}
        style={{
          display: "-webkit-box",
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {(isSummary || isLoading) && (
          <span className="text-xs font-bold">Summary:</span>
        )}
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="w-full h-7" />
          </div>
        ) : (
          <ReactMarkdown>{text}</ReactMarkdown>
        )}
      </p>
      
      {isHovered && !isLoading && (
        <div className="absolute z-50 p-4 bg-background border border-black rounded-md shadow-lg max-w-[500px] text-sm prose prose-sm dark:prose-invert">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}
