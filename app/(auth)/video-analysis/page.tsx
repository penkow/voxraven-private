"use client";

import { useState } from "react";
import { VideoResult } from "./lib/types";
import { VideoCard } from "./components/cards/VideoCard";
import { LoadingInfo } from "./components/loading/LoadingInfo";
import { FilterSidebar } from "./components/sidebar/FilterSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generateMockVideos } from "./lib/utils";

const defaultProgressMessages = [
  { start: 0, end: 20, message: "Looking for videos..." },
  { start: 20, end: 30, message: "Pulling transcripts..." },
  { start: 30, end: 50, message: "Reading comments..." },
  { start: 50, end: 80, message: "Analyzing data..." },
  { start: 80, end: 95, message: "Extracting insights..." },
  { start: 95, end: 100, message: "Almost there..." },
];

export default function VideoAnalysis() {
  const [isActive, setIsActive] = useState(false);
  const [videoResults, setVideoResults] = useState<VideoResult[]>([]); //(() => generateMockVideos());

  const handleComplete = () => {
    setIsActive(false);
  };

  return (
    <div className="grid grid-cols-12 h-full">
      <main className="container col-span-10 w-full h-full p-6">
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
                  <CardTitle>Analyzing videos</CardTitle>
                  <CardDescription>
                    Our AI agents are working on it, please wait...
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <LoadingInfo
                    onComplete={handleComplete}
                    messages={defaultProgressMessages}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videoResults.map((video, index) => (
                <VideoCard key={index} video={video} />
              ))}
            </div>
          )}
        </div>
      </main>

      <div className="col-span-2">
        <FilterSidebar
          setIsActive={setIsActive}
          setFinalResult={(result) => {
            if (result?.videos) {
              setVideoResults(result.videos);
            }
          }}
        />
      </div>
    </div>
  );
}
