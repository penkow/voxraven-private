"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";

import InsightsItem from "./InsightsItem";
import { InsightsDialog } from "./InsightsDialog";

import { Prisma } from "@prisma/client";
export type VideoFullType = Prisma.VideoGetPayload<{
  select: { [K in keyof Required<Prisma.VideoSelect>]: true };
}>;

import { VideoHooksTimeline } from "./HooksTimeline";
import VideoPlayer from "./VideoPlayer";
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
  video: VideoFullType;
  onStartChat: (video: VideoFullType) => void;
}

export default function VideoItem({ video, onStartChat }: VideoItemProps) {
  const extractYoutubeVideoId = (url: string) => {
    const videoIdMatch = url.match(/[?&]v=([^&]+)/);
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [videoWatchProgress, setVideoWatchProgress] = useState<number>(0);

  // Example usage:
  const jumpToTime = (seconds: number) => {
    console.log("jumpToTime", seconds);
    setCurrentTime(seconds);
  };

  const handlePlayerTime = (time: number) => {
    console.log("handlePlayerTime", time);
    const progress = (time / video.duration) * 100;
    setVideoWatchProgress(progress);
  };

  return (
    <div className="flex flex-col md:flex-row p-4 border rounded-md bg-background gap-4">
      <div className="flex flex-col items-center w-full  md:w-1/6">
        <div className="w-full">
          {/* <a href={video.url} target="_blank" rel="noopener noreferrer">
            <Image
              src={video.thumbnails[video.thumbnails.length - 2]}
              alt={video.title}
              width={200}
              height={100}
              className="object-cover object-center rounded-md w-full h-full border border-gray-300"
              sizes="(max-width: 768px) 100vw, 200px"
            />
          </a> */}
          <VideoPlayer
            videoId={extractYoutubeVideoId(video.url) || ""}
            currentTime={currentTime || 0}
            playerTimeCallback={handlePlayerTime}
          />
        </div>

        <div className="flex flex-col mx-auto gap-1 mt-2 w-full">
          <div className="text-xs font-thin">
            <span className="font-bold">Published:</span>{" "}
            {formatDate(video.publishedAt)}
          </div>

          <div className="text-xs font-thin">
            <span className="font-bold">Views:</span> {video.viewCount}
          </div>

          <div className="text-xs font-thin">
            <span className="font-bold">Comments:</span> {video.commentCount}
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
            <InsightsItem
              title="Summary"
              content={video.videoInsights[0].summary}
            />
          </div>

          <div className="w-auto">
            <InsightsItem
              title="Target Audience"
              content={video.videoInsights[0].targetAudience}
            />
          </div>

          <div className="w-auto">
            <InsightsItem
              title="Pain Points"
              content={video.videoInsights[0].painPoints}
            />
          </div>

          <div className="w-auto">
            <InsightsItem
              title="Empathy Map"
              content={video.videoInsights[0].empathyMap}
            />
          </div>
        </div>

        <div className="px-2">
          {/* <VideoHooksTimeline
            hooks={video.videoInsights[0].hooks}
            videoDuration={video.duration}
            jumpToSecond={jumpToTime}
            videoWatchProgress={videoWatchProgress}
          /> */}
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-start items-center">
        <InsightsDialog
          summary={video.videoInsights[0].summary}
          targetAudience={video.videoInsights[0].targetAudience}
          painPoints={video.videoInsights[0].painPoints}
          empathyMap={video.videoInsights[0].empathyMap}
          commentsAnalysis={video.videoInsights[0].commentsAnalysis}
        />

        <Button
          onClick={() => onStartChat(video)}
          size="sm"
          className="h-6 w-24 px-2"
        >
          Chat
        </Button>
      </div>
    </div>
  );
}
