"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import {
  generateResults,
  VideoResult,
} from "./comments-generator";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingInfo from "./loading-info";
import { FilterSidebar } from "./filter-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

// Define the type for progress messages
interface ProgressMessage {
  start: number;
  end: number;
  message: string;
}

const VideoCard = ({ video }: { video: VideoResult }) => (
  <Card key={video.id} className="overflow-hidden">
    <div className="relative">
      <img
        src={video.thumbnail || "/placeholder.svg"}
        alt={video.title}
        className="w-full h-[220px] object-cover"
      />
    </div>
    <CardHeader className="pb-2">
      <h3
        className="font-semibold text-lg line-clamp-2 hover:cursor-pointer"
        onClick={() => {
          window.open(video.videoUrl, "_blank");
        }}
      >
        {video.title}
      </h3>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-sm text-muted-foreground line-clamp-5">
        {video.description}
      </p>
      {video.viewerNeeds.length > 0 ? (
        <ViewerNeedsList viewerNeeds={video.viewerNeeds} />
      ) : (
        <Button
          size="sm"
          onClick={() => {
            // getViewerNeeds(video.videoUrl);
          }}
        >
          Add Viewer Needs
        </Button>
      )}
    </CardContent>
  </Card>
);

const ViewerNeedsList = ({ viewerNeeds }: { viewerNeeds: any[] }) => (
  <div>
    <h4 className="text-sm mb-2 font-bold">Viewer Needs & Requests:</h4>
    <ul className="space-y-1">
      {viewerNeeds.map((needItem, i) => (
        <ViewerNeedItem key={i} needItem={needItem} />
      ))}
    </ul>
  </div>
);

const ViewerNeedItem = ({ needItem }: { needItem: any }) => (
  <li className="text-sm flex items-start">
    <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0" />
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <button
          className="text-left hover:text-primary transition-colors flex items-center group"
          aria-label={`View comments for ${needItem.need}`}
        >
          <span className="border-b border-dashed border-muted-foreground group-hover:border-primary">
            {needItem.need}
          </span>
          <MessageSquare className="h-3.5 w-3.5 ml-1.5 opacity-60 group-hover:opacity-100" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent side="top" align="start" className="w-80 p-4">
        <CommentsList comments={needItem.quotes} />
      </HoverCardContent>
    </HoverCard>
  </li>
);

const CommentsList = ({ comments }: { comments: any[] }) => (
  <div className="space-y-2">
    <h5 className="text-sm font-medium flex items-center">
      <MessageSquare className="h-3.5 w-3.5 mr-1" />
      Comments supporting this need
    </h5>
    <div className="space-y-3 max-h-60 overflow-y-auto">
      {comments.map((comment, j) => (
        <div key={j} className="p-2 bg-muted rounded-md text-xs">
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium">NOT IMPLEMENTED YET</span>
            <span className="text-muted-foreground text-[10px] flex items-center">
              99999999999 likes
            </span>
          </div>
          <p className="italic">"{comment}"</p>
        </div>
      ))}
    </div>
  </div>
);

const extractVideoId = (youtubeUrl: string) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = youtubeUrl.match(regex);
  return match ? match[1] : null;
};

const getYoutubeThumbnail = (youtubeUrl: string) => {
  console.log("youtubeUrl", youtubeUrl);
  const videoId = extractVideoId(youtubeUrl);
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

const convertToVideoResult = (results: Array<any>): VideoResult[] => {
  console.log("Converting to VideoResult", results);

  return results.map((result: any, index: number) => ({
    id: index.toString(),
    title: result.title,
    videoUrl: result.url,
    thumbnail: getYoutubeThumbnail(result.url),
    description: result.short_description,
    viewerNeeds: [], //result.viewerNeeds,
  }));
};

export default function VideoAnalysis() {
  const [searchedTopic, setSearchedTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoResults, setVideoResults] = useState<VideoResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const [isActive, setIsActive] = useState(false);
  const [finalResult, setFinalResult] = useState<any>(null);

  // Example custom messages for different percentage ranges
  const progressMessages: ProgressMessage[] = [
    { start: 0, end: 20, message: "Looking for videos..." },
    { start: 20, end: 30, message: "Pulling transcripts..." },
    { start: 30, end: 50, message: "Reading comments..." },
    { start: 50, end: 80, message: "Analyzing data..." },
    { start: 80, end: 95, message: "Extracting insights..." },
    { start: 95, end: 100, message: "Almost there..." },
  ];

  const handleComplete = () => {
    setIsComplete(true);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log("finalResult", finalResult);
    if (finalResult) {
      setVideoResults(convertToVideoResult(finalResult.videos));
    }
  }, [finalResult]);

  return (
    <div className="grid grid-cols-12 h-full ">
      <main className="container col-span-10 w-full h-full p-6 ">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              YouTube Video Analysis Tool
            </h1>
            <p className="text-muted-foreground">
              Enter a topic to analyze trending videos and discover viewer needs
            </p>
          </div>

          {isActive ? (
            <div className="container max-w-md mx-auto py-10 px-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analyzing videos for "{searchedTopic}"</CardTitle>
                  <CardDescription>
                    Our AI agents are working on it, please wait...
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <LoadingInfo
                    onComplete={handleComplete}
                    messages={progressMessages}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videoResults.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      </main>

      <div className="col-span-2">
        <FilterSidebar
          setIsActive={setIsActive}
          setFinalResult={setFinalResult}
        />
      </div>
    </div>
  );
}
