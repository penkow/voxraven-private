import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { ReactNode } from "react";
import { Project } from "@prisma/client";

import { io } from "socket.io-client";

export interface TranscriptSegment {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
}

interface VideoDataResponse {
  videoInfo?: VideoInfo;
  transcript?: TranscriptSegment[];
  summary?: string;
  commentsAnalysis?: string;
  painPoints?: string;
  targetAudience?: string;
}

interface VideoInfo {
  description: string | null;
  comment_count: number;
  view_count: number;
  like_count: number;
}

// Define the context value type
const YoutubeProviderContext = createContext<{
  youtubeId: string;
  description: string | null | undefined;
  summary: string | null | undefined;
  views: number | null | undefined;
  likes: number | null | undefined;
  commentsCount: number | null | undefined;
  commentsAnalysis: string | null | undefined;
  painPoints: string | null | undefined;
  targetAudience: string | null | undefined;
  transcript: TranscriptSegment[] | null | undefined;
}>({
  youtubeId: "",
  description: null,
  summary: null,
  views: null,
  likes: null,
  commentsCount: null,
  commentsAnalysis: null,
  painPoints: null,
  targetAudience: null,
  transcript: null,
});

interface YoutubeProviderProps {
  children: ReactNode;
  videoId: string;
}

export function YoutubeProvider({ children, videoId }: YoutubeProviderProps) {
  const [summary, setSummary] = useState<string | null | undefined>(null);
  const [commentsAnalysis, setCommentsAnalysis] = useState<string | null | undefined>(null);
  const [painPoints, setPainPoints] = useState<string | null | undefined>(null);
  const [targetAudience, setTargetAudience] = useState<string | null | undefined>(null);
  const [views, setViews] = useState<number | null | undefined>(0);
  const [likes, setLikes] = useState<number | null | undefined>(0);
  const [commentsCount, setCommentsCount] = useState<number | null | undefined>(0);
  const [description, setDescription] = useState<string | null | undefined>(null);
  const [transcript, setTranscript] = useState<TranscriptSegment[] | null | undefined>([]);

  const [youtubeId, setYoutubeId] = useState("");

  const [loading, setLoading] = useState(false);

  const YOUTUBE_VIDEO_ENDPOINT = new URL(`api/youtube/${videoId}`, process.env.NEXT_PUBLIC_API_URL);
  const VIDEO_ENDPOINT = new URL(`api/videos/${videoId}`, process.env.NEXT_PUBLIC_API_URL);

  useEffect(() => {
    const fetchVideoData = async () => {
      console.log("Fetching video data");
      const response = await fetch(VIDEO_ENDPOINT, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      console.log("Video data fetched:", data);

      setYoutubeId(data?.youtubeId);
      setDescription(data?.description);
      setViews(data?.viewCount);
      setLikes(data?.likeCount);
      setCommentsCount(data?.commentCount);
      setTranscript(data?.transcript);
      setSummary(data?.videoInsights[0]?.summary);
      setPainPoints(data?.videoInsights[0]?.painPoints);
      setTargetAudience(data?.videoInsights[0]?.targetAudience);
      setCommentsAnalysis(data?.videoInsights[0]?.commentsAnalysis);
    };

    fetchVideoData();

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL, {
      withCredentials: true,
    });

    socket.on(`transcript/${videoId}`, (msg) => {
      //console.log("Received transcript:", msg);
      const transcript = msg.transcript;
      if (Array.isArray(transcript)) {
        setTranscript(transcript);
      }
    });

    socket.on(`videoInfo/${videoId}`, (msg) => {
      console.log("Received videoInfo:", msg);
      const videoInfo = msg.videoInfo;
      setDescription(videoInfo.description);
      setViews(videoInfo.views_count);
      setLikes(videoInfo.likes_count);
      setCommentsCount(videoInfo.comments_count);
    });

    socket.on(`summary/${videoId}`, (msg) => {
      console.log("Received summary:", msg);
      const summary = msg.summary;
      setSummary(summary);
    });

    socket.on(`painPoints/${videoId}`, (msg) => {
      console.log("Received pain points:", msg);
      const painPoints = msg.painPoints;
      setPainPoints(painPoints);
    });

    socket.on(`targetAudience/${videoId}`, (msg) => {
      console.log("Received target audience:", msg);
      const targetAudience = msg.targetAudience;
      setTargetAudience(targetAudience);
    });

    socket.on(`commentsAnalysis/${videoId}`, (msg) => {
      console.log("Received comments analysis:", msg);
      const commentsAnalysis = msg.commentsAnalysis;
      setCommentsAnalysis(commentsAnalysis);
    });

    return () => {
      socket.disconnect();
    };
  }, [videoId]);

  const contextValue = useMemo(
    () => ({
      youtubeId,
      description,
      summary,
      views,
      likes,
      commentsCount,
      commentsAnalysis,
      painPoints,
      targetAudience,
      transcript,
    }),
    [
      youtubeId,
      description,
      summary,
      views,
      likes,
      commentsCount,
      commentsAnalysis,
      painPoints,
      targetAudience,
      transcript,
    ]
  );

  return <YoutubeProviderContext.Provider value={contextValue}>{children}</YoutubeProviderContext.Provider>;
}

// Helper hook to access YoutubeProviderContext
export function useYouTube() {
  return useContext(YoutubeProviderContext);
}
