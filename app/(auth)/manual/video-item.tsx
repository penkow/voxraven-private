"use client";

import { Plus, Minus, Film, Loader2, Check, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoundVideo } from "./api";
import { useState } from "react";
import { TruncatedText } from "./truncated-text";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon } from "lucide-react";
import InsightsItem from "./InsightsItem";
import { InsightsDialog } from "./InsightsDialog";

const formatDate = (dateString: string) => {
  console.log("Input date string:", dateString);
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
  video: FoundVideo;
  onSelect: (
    video: FoundVideo,
    summary: string,
    empathyMap: string,
    painPoints: string,
    targetAudience: string
  ) => void;
  onDeselect: (video: FoundVideo) => void;
}

export default function VideoItem({
  video,
  onSelect,
  onDeselect,
}: VideoItemProps) {
  const [videoSummary, setVideoSummary] = useState<string>("");
  const [videoEmpathyMap, setVideoEmpathyMap] = useState<string>("");
  const [videoPainPoints, setVideoPainPoints] = useState<string>("");
  const [videoTargetAudience, setVideoTargetAudience] = useState<string>("");
  const [isAnalysisLoading, setIsAnalysisLoading] = useState<boolean>(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState<boolean>(false);

  const [isSelected, setIsSelected] = useState<boolean>(false);

  const handleSelect = () => {
    onSelect(
      video,
      videoSummary,
      videoEmpathyMap,
      videoPainPoints,
      videoTargetAudience
    );
    setIsSelected(true);
  };

  const handleDeselect = () => {
    onDeselect(video);
    setIsSelected(false);
  };

  const summarizeVideo = async (videoUrl: string) => {
    console.log("Summarizing video", videoUrl);
    const response = await fetch(`http://localhost:3000/createSummary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ youtubeUrl: videoUrl }),
    });

    const data = await response.json();

    console.log(data);
    setVideoSummary(data.summary);
  };

  const createEmpathyMap = async (videoUrl: string) => {
    console.log("Creating empathy map", videoUrl);
    const response = await fetch(`http://localhost:3000/createEmpathyMap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ youtubeUrl: videoUrl }),
    });

    const data = await response.json();
    console.log(data);
    setVideoEmpathyMap(data.empathyMap);
  };

  const createPainPoints = async (videoUrl: string) => {
    console.log("Creating pain points", videoUrl);
    const response = await fetch(`http://localhost:3000/createPainPoints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ youtubeUrl: videoUrl }),
    });

    const data = await response.json();
    console.log(data);
    setVideoPainPoints(data.painPoints);
  };

  const createTargetAudience = async (videoUrl: string) => {
    console.log("Creating target audience", videoUrl);
    const response = await fetch(`http://localhost:3000/createTargetAudience`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ youtubeUrl: videoUrl }),
    });

    const data = await response.json();
    console.log(data);
    setVideoTargetAudience(data.targetAudience);
  };

  const performAnalysis = async (videoUrl: string) => {
    setIsAnalysisLoading(true);

    await Promise.all([
      summarizeVideo(videoUrl),
      createEmpathyMap(videoUrl),
      createPainPoints(videoUrl),
      createTargetAudience(videoUrl),
    ]);

    setIsAnalysisLoading(false);
    setIsAnalysisComplete(true);
  };

  return (
    <div className="grid grid-cols-10 p-2 border rounded-md bg-background gap-2">
      <div className="flex flex-col col-span-2 items-center w-full">
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
      <div className="flex flex-col col-span-7 gap-4">
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
          <div className="text-xs text-muted-foreground line-clamp-2">
            {video.description}
          </div>
        </div>

        <div className="flex flex-row gap-4">
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
      <div className="col-span-1 flex flex-col gap-2 justify-top items-center">
        {isAnalysisComplete ? (
          // <Button size="sm" variant="outline" className="h-6 w-24 px-2">
          //   View Insights
          // </Button>
          <InsightsDialog
            summary={videoSummary}
            targetAudience={videoTargetAudience}
            painPoints={videoPainPoints}
            empathyMap={videoEmpathyMap}
          />
        ) : (
          <Button
            size="sm"
            onClick={() => performAnalysis(video.url)}
            className="h-6 w-24 px-2"
            disabled={isAnalysisLoading}
          >
            {isAnalysisLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Analyze"
            )}
          </Button>
        )}

        {isSelected ? (
          <Button
            size="sm"
            variant="destructive"
            className="h-6 w-24 px-2"
            onClick={handleDeselect}
            disabled={!isAnalysisComplete}
          >
            Remove
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="h-6 w-24 px-2"
            onClick={handleSelect}
            disabled={!isAnalysisComplete}
          >
            Select
          </Button>
        )}
      </div>
    </div>
  );
}
