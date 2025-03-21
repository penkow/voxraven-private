"use client";

import { Plus, Minus, Film, Loader2, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoundVideo } from "./api";
import { useState } from "react";
import { TruncatedText } from "./truncated-text";
import { Badge } from "@/components/ui/badge";

interface VideoItemProps {
  video: FoundVideo;
  onAction: () => void;
  actionIcon: "add" | "remove";
  disabled?: boolean;
  isAdded?: boolean;
}

export default function VideoItem({
  video,
  onAction,
  actionIcon,
  disabled,
  isAdded = false,
}: VideoItemProps) {
  const summarizeVideo = async (videoUrl: string) => {
    setIsLoading(true);
    console.log("Summarizing video", videoUrl);
    const response = await fetch(`http://localhost:8001/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ youtube_url: videoUrl }),
    });

    const data = await response.json();

    console.log(data);
    setVideoSummary(data);
    setIsLoading(false);
  };

  const [videoSummary, setVideoSummary] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div className="grid grid-cols-10  p-2 border rounded-md bg-background gap-2">
      <div className="col-span-2 items-center w-full h-[100px]">
        <a href={video.url} target="_blank" rel="noopener noreferrer">
          <img
            src={video.thumbnails.maxres.url}
            alt={video.title}
            className="w-full h-full object-cover object-center rounded-md"
          />
        </a>
      </div>
      <div className="flex flex-col col-span-7 gap-1">
        <a 
          href={video.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-semibold text-sm hover:underline"
        >
          {video.title}
        </a>
        <div className="flex gap-1">
          <Badge variant="secondary" className="text-xs font-thin">
            <div className="text-xs font-thin"> Views: {video.view_count}</div>
          </Badge>
          <Badge variant="secondary" className="text-xs font-thin">
            <div className="text-xs font-thin"> Comments: {video.comment_count}</div>
          </Badge>
        </div>
        <TruncatedText
          text={videoSummary ? videoSummary : "Click on the Summarize button to get a summary of the video"}
          isLoading={isLoading}
          isSummary={videoSummary !== ""}
          maxLines={3}
        />
      </div>
      <div className="col-span-1 flex flex-col gap-2 justify-center items-center">
        {isAdded ? (
          <div className="group relative">
            <div className="group-hover:hidden">
              <Badge
                variant="secondary"
                className="gap-1 w-24 bg-green-100 text-green-700"
              >
                <div className="text-center w-full flex items-center justify-center gap-1">
                  <div>
                    <Check className="h-3 w-3" />
                  </div>
                  <div>Selected</div>
                </div>
              </Badge>
            </div>
            <Button
              size="sm"
              variant="destructive"
              onClick={onAction}
              className="hidden group-hover:flex h-6 w-24 px-2"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        ) : (
          <Button size="sm" onClick={onAction} className="h-6 w-24 px-2">
            Add to list
          </Button>
        )}
        <Button
          size="sm"
          onClick={() => summarizeVideo(video.url)}
          className="h-6 w-24 px-2"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Summarize"}
        </Button>
        <Button size="sm" onClick={onAction} className="h-6 w-24 px-2">
          Analyze
        </Button>
      </div>
    </div>
  );
}
