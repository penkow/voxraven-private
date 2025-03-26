"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

import InsightsItem from "./InsightsItem";
import { InsightsDialog } from "./InsightsDialog";
import { VideoInfo, VideoData } from "./types";

const formatDate = (dateString: string) => {
  // Handle numeric format YYYYMMDD
  if (/^\d{8}$/.test(dateString)) {
    const year = dateString.substring(0, 4);
    const month = parseInt(dateString.substring(4, 6)) - 1; // months are 0-based
    const day = dateString.substring(6, 8);
    const date = new Date(parseInt(year), month, parseInt(day));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  // Handle other date formats
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

interface VideoItemProps {
  video: VideoInfo;
  videoData: VideoData;
  videoSummary: string;
  videoEmpathyMap: string;
  videoPainPoints: string;
  videoTargetAudience: string;
  videoCommentsAnalysis: string;
  onSelect: (video: VideoInfo) => void;
  onStartChat: (video: VideoData) => void;
  onDeselect: (video: VideoInfo) => void;
}

export default function VideoItem({
  video,
  videoData,
  videoSummary,
  videoEmpathyMap,
  videoPainPoints,
  videoTargetAudience,
  videoCommentsAnalysis,
  onSelect,
  onDeselect,
  onStartChat,
}: VideoItemProps) {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const handleSelect = () => {
    onSelect(video);
    setIsSelected(true);
  };

  const handleDeselect = () => {
    onDeselect(video);
    setIsSelected(false);
  };

  return (
    <div className="flex flex-col md:flex-row p-4 border rounded-md bg-background gap-4">
      <div className="flex flex-col items-center w-full md:w-1/4">
        <div className="h-[100px] w-full">
          <a href={video.url} target="_blank" rel="noopener noreferrer">
            <Image
              src={video.thumbnails[video.thumbnails.length - 2].url}
              alt={video.title}
              width={200}
              height={100}
              className="object-cover object-center rounded-md w-full h-full border border-gray-300"
              sizes="(max-width: 768px) 100vw, 200px"
            />
          </a>
        </div>

        <div className="flex flex-col mx-auto gap-1 mt-2 w-full">
          <div className="text-xs font-thin">
            <span className="font-bold">Published:</span>{" "}
            {formatDate(video.published_at)}
          </div>

          <div className="text-xs font-thin">
            <span className="font-bold">Views:</span> {video.view_count}
          </div>

          <div className="text-xs font-thin">
            <span className="font-bold">Comments:</span> {video.comment_count}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-4">
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sm hover:underline"
        >
          {video.title}
        </a>
        <div className="flex flex-col gap-1">
          <div className="text-xs font-bold">Description:</div>
          <div className="text-xs text-muted-foreground line-clamp-4">
            {video.description}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="w-auto">
            <InsightsItem title="Summary" content={videoSummary} />
          </div>

          <div className="w-auto">
            <InsightsItem
              title="Target Audience"
              content={videoTargetAudience}
            />
          </div>

          <div className="w-auto">
            <InsightsItem title="Pain Points" content={videoPainPoints} />
          </div>

          <div className="w-auto">
            <InsightsItem title="Empathy Map" content={videoEmpathyMap} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-start items-center">
        <InsightsDialog
          summary={videoSummary}
          targetAudience={videoTargetAudience}
          painPoints={videoPainPoints}
          empathyMap={videoEmpathyMap}
          commentsAnalysis={videoCommentsAnalysis}
        />

        {isSelected ? (
          <Button
            size="sm"
            variant="destructive"
            className="h-6 w-24 px-2"
            onClick={handleDeselect}
          >
            Remove
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-24 px-2"
            onClick={handleSelect}
          >
            Select
          </Button>
        )}
        <Button
          onClick={() => onStartChat(videoData)}
          size="sm"
          className="h-6 w-24 px-2"
        >
          Chat
        </Button>
      </div>
    </div>
  );
}
