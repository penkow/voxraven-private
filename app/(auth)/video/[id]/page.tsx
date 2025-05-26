"use client";
import VideoPlayer from "@/app/(auth)/analysis/[id]/blocks/VideoPlayer";
import { Eye, MessageSquare, ThumbsUp } from "lucide-react";
import { useYoutubeVideo } from "./use-youtube-video";
import TranscriptViewer from "./transcript-viewer";
import { Badge } from "@/components/ui/badge";
import { FlexTabs } from "./flex-tabs";
import { useEffect, useState } from "react";
import { set } from "date-fns";
import { useParams } from "next/navigation";
import { io } from "socket.io-client";

export default function ResponsiveLayout() {
  const { id } = useParams();

  const { description, views, likes, commentsCount, transcript } =
    useYoutubeVideo({
      videoId: id as string,
    });

  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="w-full h-[calc(100vh-1rem)] flex p-4 gap-4">
      <div className="w-5/12 flex flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 border border-slate-200 rounded-lg">
          <div className="flex">
            <VideoPlayer
              videoId={id as string}
              currentTime={currentTime}
              className="w-full"
              playerTimeCallback={(time) => {
                setCurrentVideoTime(time);
              }}
            />
          </div>
          <div className="flex gap-4 text-xs">
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
          </div>

          <div className="rounded-lg text-sm flex flex-col gap-2">
            <div className="font-bold">Description</div>
            <div className="line-clamp-4">{description}</div>
            {/* <div className="debug">^ Text is clamped</div> */}
            {/* <div>
              <Badge variant="outline">Category</Badge> Lorem Ipsum Dolor Sit
              Amet
            </div> */}
          </div>
        </div>

        <div className="font-bold text-sm">Transcript:</div>
        <TranscriptViewer
          transcript={transcript}
          currentVideoTime={currentVideoTime}
          onSegmentClick={(segment: any) => {
            console.log("Segment clicked:", segment);
            // You can add more functionality here, like seeking the video
            setCurrentTime(segment.startTime);
          }}
        />
      </div>

      <div className="flex flex-1">
        <FlexTabs videoId={id as string} />
      </div>
    </div>
  );
}
