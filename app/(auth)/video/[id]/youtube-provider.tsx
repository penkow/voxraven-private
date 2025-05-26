import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { ReactNode } from "react";
import { Project } from "@prisma/client";

export interface TranscriptSegment {
  id: number;
  text: string;
  startTime: number;
  endTime: number;
}

interface VideoData {
  description: string;
  commentsCount: number;
  viewsCount: number;
  likesCount: number;
  transcript: TranscriptSegment[];
}

// Define the context value type
const YoutubeProviderContext = createContext<{
  videoId: string;
  description: string | null;
  summary: string | null;
  views: number | null;
  likes: number | null;
  commentsCount: number | null;
  commentsAnalysis: string | null;
  painPoints: string | null;
  targetAudience: string | null;
  transcript: TranscriptSegment[];
}>({
  videoId: "",
  description: null,
  summary: null,
  views: null,
  likes: null,
  commentsCount: null,
  commentsAnalysis: null,
  painPoints: null,
  targetAudience: null,
  transcript: [],
});

interface YoutubeProviderProps {
  children: ReactNode;
  videoId: string;
}

export function YoutubeProvider({ children, videoId }: YoutubeProviderProps) {
  const summary = predefinedSummary;
  const commentsAnalysis = predefinedCommentsAnalysis;
  const painPoints = predefinedPainPoints;
  const targetAudience = predefinedTargetAudience;
  const [views, setViews] = useState(0);
  const [likes, setLikes] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [description, setDescription] = useState("A Dummy Video Description");
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([]);

  const [loading, setLoading] = useState(false);
  const YOUTUBE_VIDEO_ENDPOINT = new URL(
    `api/youtube/${videoId}`,
    process.env.NEXT_PUBLIC_API_URL
  );

  useEffect(() => {
    const fetchVideoData = async () => {
      console.log("Fetching video data");
      const response = await fetch(YOUTUBE_VIDEO_ENDPOINT, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const videoData: VideoData = await response.json();

      console.log("Video Data:", videoData);

      setDescription(videoData.description);
      setViews(videoData.viewsCount);
      setLikes(videoData.likesCount);
      setCommentsCount(videoData.commentsCount);
      setTranscript(videoData.transcript);
    };

    fetchVideoData();
  }, [videoId]);

  const contextValue = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

  return (
    <YoutubeProviderContext.Provider value={contextValue}>
      {children}
    </YoutubeProviderContext.Provider>
  );
}

// Helper hook to access YoutubeProviderContext
export function useYouTube() {
  return useContext(YoutubeProviderContext);
}

const predefinedSummary = `Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.`;

const predefinedCommentsAnalysis = `Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.`;

const predefinedPainPoints = `Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.`;

const predefinedTargetAudience = `Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.`;

const predefinedTranscript = [
  {
    id: 1,
    speaker: "John",
    text: "Good morning everyone. Thank you for joining today's meeting about the new product launch.",
    startTime: 0,
    endTime: 5.2,
  },
  {
    id: 2,
    speaker: "Sarah",
    text: "Thanks John. I'd like to start by discussing our marketing strategy for the first quarter.",
    startTime: 5.3,
    endTime: 9.8,
  },
  {
    id: 3,
    speaker: "John",
    text: "That sounds great. We've been working on some new social media campaigns that I think will be very effective.",
    startTime: 10.0,
    endTime: 15.5,
  },
  {
    id: 4,
    speaker: "Michael",
    text: "I have some data from our previous campaigns that might be helpful. Can I share my screen?",
    startTime: 15.6,
    endTime: 19.2,
  },
  {
    id: 5,
    speaker: "Sarah",
    text: "Of course, go ahead Michael. I'm particularly interested in seeing how our last video campaign performed.",
    startTime: 19.3,
    endTime: 24.1,
  },
  {
    id: 6,
    speaker: "Michael",
    text: "As you can see from these numbers, our engagement rate increased by 45% when we focused on customer testimonials.",
    startTime: 24.2,
    endTime: 30.5,
  },
  {
    id: 7,
    speaker: "John",
    text: "That's impressive. I think we should definitely incorporate more testimonials in our upcoming launch.",
    startTime: 30.6,
    endTime: 35.0,
  },
  {
    id: 8,
    speaker: "Sarah",
    text: "I agree. Let's plan to collect some testimonials from our beta testers before the official launch date.",
    startTime: 35.1,
    endTime: 40.2,
  },
  {
    id: 9,
    speaker: "Michael",
    text: "I can coordinate with the product team to identify our most enthusiastic beta users for testimonials.",
    startTime: 40.3,
    endTime: 45.8,
  },
  {
    id: 10,
    speaker: "John",
    text: "Perfect. Let's reconvene next week to review the testimonials and finalize our marketing materials.",
    startTime: 45.9,
    endTime: 50.0,
  },
];
