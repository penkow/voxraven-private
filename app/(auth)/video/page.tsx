"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Youtube } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const VideoStarterPage = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const youtubeID = extractYouTubeVideoId(youtubeUrl);

      if (!youtubeID) {
        toast.error("Bad YouTube URL");
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // delay 1 second
        router.push(`/video/${youtubeID}`);
      }
    } catch (error) {
      console.error("Error submitting video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function extractYouTubeVideoId(url: string): string | null {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.slice(1);
      }
      if (
        parsedUrl.hostname === "www.youtube.com" ||
        parsedUrl.hostname === "youtube.com" ||
        parsedUrl.hostname === "m.youtube.com"
      ) {
        if (parsedUrl.pathname === "/watch") {
          return parsedUrl.searchParams.get("v");
        }
        if (parsedUrl.pathname.startsWith("/embed/")) {
          return parsedUrl.pathname.split("/embed/")[1];
        }
        if (parsedUrl.pathname.startsWith("/shorts/")) {
          return parsedUrl.pathname.split("/shorts/")[1];
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  return (
    <div className="container mx-auto my-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center gap-1 flex flex-col">
          <h1 className="text-4xl font-bold">AI Chat with any video</h1>
          <p className="text-muted-foreground italic text-sm pt-1">
            Use our AI chat to interact with your videos and get instant
            insights...
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5" />
              YouTube Video
            </CardTitle>
            <CardDescription>
              Start by pasting a link to a YouTube video
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter YouTube video URL here"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !youtubeUrl}
                  className="min-w-[100px]"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Preparing...</span>
                    </div>
                  ) : (
                    "AI Chat"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VideoStarterPage;
