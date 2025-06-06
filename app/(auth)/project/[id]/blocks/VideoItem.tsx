"use client";

import { useState } from "react";

import { Prisma, Video } from "@prisma/client";

export type VideoFullType = Prisma.VideoGetPayload<{
  select: { [K in keyof Required<Prisma.VideoSelect>]: true };
}>;

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
  video: Video;
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
          //href={video.url}
          href={"/video/" + video.id}
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

        {/* <div className="flex flex-wrap gap-4">
          <div className="w-auto">
            <InsightsItem
              title="Summary"
              content={video.videoInsights[0]?.summary}
            />
          </div>

          <div className="w-auto">
            <InsightsItem
              title="Target Audience"
              content={video.videoInsights[0]?.targetAudience}
            />
          </div>

          <div className="w-auto">
            <InsightsItem
              title="Pain Points"
              content={video.videoInsights[0]?.painPoints}
            />
          </div>

          <div className="w-auto">
            <InsightsItem
              title="Empathy Map"
              content={video.videoInsights[0]?.empathyMap}
            />
          </div>
        </div> */}

        {/* <div className="px-2">
          <VideoHooksTimeline
            hooks={
              video.videoInsights[0]?.hooks &&
              typeof video.videoInsights[0].hooks === "object"
                ? (video.videoInsights[0].hooks as any).hooks
                : []
            }
            videoDuration={video.duration}
            jumpToSecond={jumpToTime}
            videoWatchProgress={videoWatchProgress}
          />
        </div> */}
      </div>
    </div>
  );
}
