"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";

interface VideoModalProps {
  videoId: string;
  currentTime?: number;
  playerTimeCallback: (time: number) => void;
  className?: string;
}

// Define YouTube Player type
declare global {
  interface Window {
    YT: {
      Player: any;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
      ready: (callback: () => void) => void;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function VideoPlayer({
  videoId,
  currentTime,
  playerTimeCallback,
  className = "",
}: VideoModalProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerReadyRef = useRef(false);

  useEffect(() => {
    if (currentTime && playerRef.current) {
      playerRef.current.seekTo(currentTime, true);
    }
  }, [currentTime, playerRef.current]);

  // Load YouTube API
  useEffect(() => {
    // Only load the API once
    if (!document.getElementById("youtube-api")) {
      const tag = document.createElement("script");
      tag.id = "youtube-api";
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    return () => {
      // Clean up player when component unmounts
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  // Initialize player when modal opens
  useEffect(() => {
    // Initialize player when modal is open
    const initPlayer = () => {
      if (!containerRef.current) return;

      // If YouTube API is not ready yet, wait for it
      if (!window.YT || !window.YT.Player) {
        window.onYouTubeIframeAPIReady = initPlayer;
        return;
      }

      // Create player
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          showinfo: 0,
          controls: 1,
        },
        events: {
          onReady: () => {
            playerReadyRef.current = true;
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              // Set up timeupdate event listener when video starts playing
              const interval = setInterval(() => {
                if (playerRef.current) {
                  playerTimeCallback(playerRef.current.getCurrentTime());
                }
              }, 100); // More frequent updates for smoother progress tracking

              // Store interval ID to clear it later
              playerRef.current._timeUpdateInterval = interval;
            } else if (
              event.data === window.YT.PlayerState.PAUSED ||
              event.data === window.YT.PlayerState.ENDED
            ) {
              // Clear interval when video is paused or ended
              if (playerRef.current._timeUpdateInterval) {
                clearInterval(playerRef.current._timeUpdateInterval);
              }
            }
          },
        },
      });
    };

    initPlayer();

    // Small delay to ensure DOM is ready
    // const timer = setTimeout(initPlayer, 1000);
    // return () => clearTimeout(timer);
  }, [videoId]);

  return (
    <div className={cn("aspect-video", className)}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
