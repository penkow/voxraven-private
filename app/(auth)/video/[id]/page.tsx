"use client";
import VideoPlayer from "@/app/(auth)/project/[id]/blocks/VideoPlayer";
import { Eye, MessageSquare, ThumbsUp } from "lucide-react";
import TranscriptViewer from "./transcript-viewer";
import { Badge } from "@/components/ui/badge";
import { FlexTabs } from "./flex-tabs";
import { use, useEffect, useState } from "react";
import { set } from "date-fns";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";
import { TranscriptSegment, useYouTube, YoutubeProvider } from "./youtube-provider";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResponsiveLayout() {
  const { id } = useParams();

  return (
    <YoutubeProvider videoId={id as string}>
      <YoutubeContent />
    </YoutubeProvider>
  );
}

function YoutubeContent() {
  const {
    videoId,
    description,
    summary,
    views,
    likes,
    commentsCount,
    commentsAnalysis,
    painPoints,
    targetAudience,
    transcript,
  } = useYouTube();

  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="w-full h-[calc(100vh-1rem)] flex p-4 gap-4">
      <div className="w-5/12 flex flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 border border-slate-200 rounded-lg">
          <div className="flex">
            <VideoPlayer
              videoId={videoId}
              currentTime={currentTime}
              className="w-full"
              playerTimeCallback={(time) => {
                setCurrentVideoTime(time);
              }}
            />
          </div>

          {/* <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{views}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>{commentsCount}</span>
            </div>
          </div> */}

          <div className="text-sm flex flex-col gap-2">
            <div className="font-bold">Description</div>
            {description ? (
              <div className="line-clamp-4">{description}</div>
            ) : (
              <div className="flex p-3 rounded-md bg-muted/50">
                <Skeleton className="h-8 w-full" />
              </div>
            )}
            {/* <div className="debug">^ Text is clamped</div> */}
            {/* <div>
              <Badge variant="outline">Category</Badge> Lorem Ipsum Dolor Sit
              Amet
            </div> */}
          </div>
        </div>

        <div className="font-bold text-sm">Transcript:</div>
        <TranscriptViewer
          transcript={transcript as TranscriptSegment[]}
          currentVideoTime={currentVideoTime}
          onSegmentClick={(segment: any) => {
            console.log("Segment clicked:", segment);
            // You can add more functionality here, like seeking the video
            setCurrentTime(segment.startTime);
          }}
        />
      </div>

      <div className="flex flex-1">
        <FlexTabs />
      </div>
    </div>
  );
}
