"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Film, Settings, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import VideoItem from "./video-item";
import { type FoundVideo, searchVideos } from "./api";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import MarkdownRenderer from "@/components/ui/markdown-renderer";

function VideoItemSkeleton() {
  return (
    <div className="grid grid-cols-10 p-2 border rounded-md bg-background gap-2 animate-pulse">
      <div className="col-span-2 items-center w-full h-[100px] bg-muted rounded-md" />
      <div className="flex flex-col col-span-7 gap-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-5 bg-muted rounded w-20" />
          <div className="h-5 bg-muted rounded w-24" />
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-5/6" />
          <div className="h-3 bg-muted rounded w-4/6" />
        </div>
      </div>
      <div className="col-span-1 flex flex-col gap-2 justify-center items-center">
        <div className="h-6 w-24 bg-muted rounded" />
        <div className="h-6 w-24 bg-muted rounded" />
        <div className="h-6 w-24 bg-muted rounded" />
      </div>
    </div>
  );
}

const fetchManualVideo = async (youtube_url: string) => {
  const url = `http://localhost:3000/videoInfo?url=${youtube_url}`;
  console.log("Fetching manual video", url);
  try {
    const response = await fetch(url, {
      method: "GET",
    });

    console.log(response);
    const data = await response.json();
    console.log("Data", data);
    return data;
  } catch (error) {
    console.error(error);
    toast.error("Failed to add video");
  }
};

export default function VideoSelectionInterface() {
  const [selectedVideos, setSelectedVideos] = useState<any[]>([]);
  const [foundVideos, setFoundVideos] = useState<FoundVideo[]>([]);
  const [manualUrl, setManualUrl] = useState(
    "https://www.youtube.com/watch?v=290Ytj96vL4"
  );
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [synthesis, setSynthesis] = useState<string>("");

  const handleAddVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const videoUrl = manualUrl;

    setIsAddingManual(true);
    const videoData = await fetchManualVideo(videoUrl);

    if (foundVideos.some((v) => v.url === videoData.url)) {
      toast.error("Video already added");
    } else {
      console.log(videoData);
      setFoundVideos([...foundVideos, videoData]);
    }
    setIsAddingManual(false);
  };

  const handleSelectVideo = (
    video: FoundVideo,
    summary: string,
    empathyMap: string,
    painPoints: string,
    targetAudience: string
  ) => {
    const selectedVideoData = {
      url: video.url,
      title: video.title,
      summary,
      empathyMap,
      painPoints,
      targetAudience,
    };
    setSelectedVideos([...selectedVideos, selectedVideoData]);
    console.log("Selected videos", selectedVideos);
  };

  const handleDeselectVideo = (video: FoundVideo) => {
    setSelectedVideos(selectedVideos.filter((v) => v.url !== video.url));
    console.log("Selected videos", selectedVideos);
  };

  const handleSynthesis = async () => {
    console.log("Selected videos", selectedVideos);
    console.log("Running synthesis");
    let payload: any[] = [];
    selectedVideos.forEach((sv) => {
      payload.push({
        url: sv.url,
        videoTitle: sv.title,
        videoSummary: sv.summary,
        empathyMap: sv.empathyMap,
        painPoints: sv.painPoints,
        targetAudience: sv.targetAudience,
      });
    });
    const response = await fetch(`http://localhost:3000/runSynthesis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ analyses: payload }),
    });
    const data = await response.json();
    console.log("Synthesis", data);
    setSynthesis(data.synthesis);
  };

  return (
    <div className="flex w-full h-[calc(100vh-6rem)] gap-4 border rounded-lg overflow-hidden">
      <div className="flex-1 relative">
        <div className="h-full overflow-auto">
          <div className="p-4">
            {synthesis ? (
              <MarkdownRenderer>{synthesis}</MarkdownRenderer>
            ) : (
              <div className="space-y-2">
                <>
                  {foundVideos.map((video) => (
                    <VideoItem
                      key={video.url}
                      video={video}
                      onSelect={handleSelectVideo}
                      onDeselect={handleDeselectVideo}
                    />
                  ))}
                </>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right column with tools panel */}
      <div className="w-64 border-l bg-muted/10">
        <div className="p-4 h-full">
          <h2 className="font-bold mb-4 ">Tools panel</h2>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Add video manually</h3>
              <form onSubmit={handleAddVideo} className="space-y-2">
                <Input
                  placeholder="Paste video URL..."
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  disabled={isAddingManual}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isAddingManual}
                >
                  {isAddingManual ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Video
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="pt-4 flex flex-col gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Analyse transcript (3 🪙 / video)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Identify target audience
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Identify audience pain points
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Identify missed pain points
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Identify content gaps
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Identify content gaps
                </label>
              </div>
              <div>
                <Button>Batch Process</Button>
              </div>
              <div>
                <Button onClick={handleSynthesis}>Run Synthesis</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
