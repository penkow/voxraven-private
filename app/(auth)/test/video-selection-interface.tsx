"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Film, Settings, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import VideoItem from "./video-item";
import { type FoundVideo, searchVideos } from "./api";

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

export default function VideoSelectionInterface() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideos, setSelectedVideos] = useState<FoundVideo[]>([]);
  const [foundVideos, setFoundVideos] = useState<FoundVideo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [manualUrl, setManualUrl] = useState("https://www.youtube.com/watch?v=290Ytj96vL4");
  const [isAddingManual, setIsAddingManual] = useState(false);

  const fetchManualVideo = async (youtube_url: string) => {
    const response = await fetch("http://localhost:8001/video-info", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ youtube_url: youtube_url }),
    });
    const data = await response.json();

    setFoundVideos([...foundVideos, data]);
  };

  // Handle search
  const handleSearch = async () => {
    setIsSearching(true);
    setCurrentPage(1);
    setHasMore(true);
    try {
      const foundVideos = await searchVideos({
        query: searchQuery,
        page: 1,
        pageSize: 10,
      });
      setFoundVideos(foundVideos);
      setHasMore(foundVideos.length === 10); // If we got less than pageSize, we've reached the end
    } finally {
      setIsSearching(false);
    }
  };

  // Handle loading more videos
  const loadMoreVideos = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const moreVideos = await searchVideos({
        query: searchQuery,
        page: nextPage,
        pageSize: 10,
      });

      setFoundVideos((prev) => [...prev, ...moreVideos]);
      setCurrentPage(nextPage);
      setHasMore(moreVideos.length === 10);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      // loadMoreVideos();
    }
  };

  // Handle video selection
  const handleSelectVideo = (video: FoundVideo) => {
    if (!selectedVideos.some((v) => v.url === video.url)) {
      setSelectedVideos([...selectedVideos, video]);
    }
  };

  // Handle video removal from selection
  const handleRemoveVideo = (videoUrl: string) => {
    setSelectedVideos(selectedVideos.filter((video) => video.url !== videoUrl));
  };

  return (
    <div className="flex w-full h-[calc(100vh-6rem)] gap-4 border rounded-lg overflow-hidden">
      {/* Left column with video sections */}
      <div className="flex-1 relative">
        {/* Found videos section with padding at the bottom to make room for the fixed bar */}
        <div className="h-full overflow-auto pb-16" onScroll={handleScroll}>
          <div className="p-4">
            <h2 className="font-medium mb-2">
              Found videos{" "}
              <span className="text-sm text-muted-foreground">
                (grows with search)
              </span>
            </h2>

            <div className="space-y-2">
              {isSearching ? (
                <>
                  <VideoItemSkeleton />
                  <VideoItemSkeleton />
                  <VideoItemSkeleton />
                  <VideoItemSkeleton />
                  <VideoItemSkeleton />
                </>
              ) : foundVideos.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  {searchQuery
                    ? "No videos found"
                    : "Search for videos using the tools panel"}
                </p>
              ) : (
                <>
                  {foundVideos.map((video) => (
                    <VideoItem
                      key={video.url}
                      video={video}
                      onAction={() =>
                        selectedVideos.some((v) => v.url === video.url)
                          ? handleRemoveVideo(video.url)
                          : handleSelectVideo(video)
                      }
                      actionIcon={
                        selectedVideos.some((v) => v.url === video.url)
                          ? "remove"
                          : "add"
                      }
                      isAdded={selectedVideos.some((v) => v.url === video.url)}
                    />
                  ))}
                  {isLoadingMore && (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  )}
                  {!hasMore && foundVideos.length > 0 && (
                    <p className="text-center text-sm text-muted-foreground py-4">
                      No more videos to load
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Fixed bottom bar with selected count and next button */}
        <div className="absolute bottom-0 left-0 right-0 border-t p-4 bg-background flex justify-between items-center h-10">
          <div className="font-medium">
            {selectedVideos.length}{" "}
            {selectedVideos.length === 1 ? "video" : "videos"} selected
          </div>
          <Button
            onClick={() => {
              console.log("Next", selectedVideos);
            }}
            disabled={selectedVideos.length === 0}
            className="gap-2 h-6"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right column with tools panel */}
      <div className="w-64 border-l bg-muted/10">
        <div className="p-4 h-full">
          <h2 className="font-medium mb-4">
            Tools panel{" "}
            <span className="text-sm text-muted-foreground">
              (stays full height)
            </span>
          </h2>

          <div className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="space-y-2"
            >
              <Input
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={isSearching}>
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </form>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Add video manually</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!manualUrl) return;

                  setIsAddingManual(true);
                  try {
                    const response = await fetch(
                      "http://localhost:8001/search",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          query: manualUrl,
                          page: 1,
                          page_size: 1,
                        }),
                      }
                    );

                    if (!response.ok) {
                      throw new Error("Failed to fetch video");
                    }

                    const data = await response.json();
                    if (data.videos && data.videos.length > 0) {
                      handleSelectVideo(data.videos[0]);
                      setManualUrl("");
                    }
                  } catch (error) {
                    console.error("Failed to add video:", error);
                  } finally {
                    setIsAddingManual(false);
                  }
                }}
                className="space-y-2"
              >
                <Input
                  placeholder="Paste video URL..."
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  disabled={isAddingManual}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isAddingManual}
                  onClick={() => fetchManualVideo(manualUrl)}
                >
                  {isAddingManual ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Video"
                  )}
                </Button>
              </form>
            </div>

            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Film className="mr-2 h-4 w-4" />
                Video Library
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
