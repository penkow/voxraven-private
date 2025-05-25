"use client";
import VideoPlayer from "@/app/(auth)/analysis/[id]/blocks/VideoPlayer";
import { Eye, MessageSquare, ThumbsUp } from "lucide-react";
import { useYoutubeVideo } from "./use-youtube-video";
import TranscriptViewer from "./transcript-viewer";
import { Badge } from "@/components/ui/badge";
import { FlexTabs } from "./flex-tabs";

export default function ResponsiveLayout() {
  const { description, views, likes, commentsCount, transcript } =
    useYoutubeVideo({
      videoId: "sladura",
    });

  return (
    <div className="w-full h-[calc(100vh-1rem)] flex p-4 gap-4">
      <div className="w-1/2 flex flex-col">
        <div className="flex gap-2 flex-col md:flex-row">
          <div className="p-4 border border-slate-200 rounded-lg md:w-1/2">
            <VideoPlayer
              videoId={"b9AKDd68-_c"}
              currentTime={0}
              playerTimeCallback={(time) => console.log("Current time:", time)}
            />
            <div className="flex items-center gap-4 justify-center mt-3 mx-2 text-xs">
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
          </div>
          <div className="md:w-1/2 p-4 border border-slate-200 rounded-lg text-sm flex flex-col gap-2">
            <div className="font-bold">Description</div>
            <div>{description}</div>
            <div>
              <Badge variant="outline">Category</Badge> Lorem Ipsum Dolor Sit
              Amet
            </div>
          </div>
        </div>
        <div className="font-bold text-sm">Transcript:</div>
        <TranscriptViewer transcript={transcript} currentSegmentId={7} />
      </div>

      <div className="w-1/2 flex">
        {/* <Chat
          messages={messages}
          handleSubmit={handleSubmit}
          className="border border-slate-200 px-4 rounded-lg flex-1"
          input={input}
          handleInputChange={handleInputChange}
          isGenerating={status != "ready"}
          stop={stop}
          append={append}
          setMessages={setMessages}
          // transcribeAudio={transcribeAudio}
          suggestions={[
            "What is the weather in San Francisco?",
            "Explain step-by-step how to solve this math problem: If x² + 6x + 9 = 25, what is x?",
            "Design a simple algorithm to find the longest palindrome in a string.",
          ]}
        /> */}
        <FlexTabs />
      </div>
    </div>
  );
}
