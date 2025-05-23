"use client";
import VideoPlayer from "@/app/(auth)/analysis/[id]/blocks/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chat } from "./chat-module/chat";
import { useChat } from "@ai-sdk/react";
import { Eye, MessageSquareText, ThumbsUp } from "lucide-react";
import { useYoutubeVideo } from "./use-youtube-video";
import TranscriptViewer from "./transcript-viewer";

export default function ResponsiveLayout() {
  const { description, summary, views, likes, comments, transcript } =
    useYoutubeVideo({
      videoId: "sladura",
    });
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    status,
    setMessages,
  } = useChat({
    api: "/api/chat",
    // body: {
    //   model: selectedModel,
    // },
  });

  return (
    <div className="rounded-md flex h-[calc(100vh-20px)]">
      <div className="m-4 flex flex-col w-[900px]">
        <div className="">
          <VideoPlayer
            videoId={"b9AKDd68-_c"}
            currentTime={0}
            playerTimeCallback={(time) => console.log("Current time:", time)}
          />
        </div>
        <div className="text-sm p-2 space-y-2">
          <div className="flex flex-row space-x-4">
            <div className="flex flex-row items-center space-x-1">
              <div className="text-xs">{likes}</div>
              <ThumbsUp className="h-4 w-4" />
            </div>

            <div className="flex flex-row items-center space-x-1">
              <div className="text-xs">{views}</div>
              <Eye className="h-4 w-4" />
            </div>

            <div className="flex flex-row items-center space-x-1">
              <div className="text-xs">{comments}</div>
              <MessageSquareText className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="font-bold">Description:</span>
            <p>{description}</p>
          </div>
          <div>
            <span className="font-bold">Category:</span> Lorem Ipsum Dolor Sit
            Amet
          </div>
        </div>
        <div className="font-bold text-sm">Transcript:</div>
        {/* <div className="flex-1 text-sm overflow-auto p-2 space-y-2 border border-slate-200 rounded-lg">
          {transcript.map((entry, idx) => (
            <div className="italic rounded-lg" key={idx}>
              {entry}
            </div>
          ))}
        </div> */}
        <TranscriptViewer />
      </div>
      <div className="w-full m-4 flex">
        <Tabs defaultValue="chat" className="flex flex-col w-full">
          <TabsList className="flex items-center justify-start w-full">
            <TabsTrigger value="chat" className="text-xs">
              Chat
            </TabsTrigger>
            <TabsTrigger value="summary" className="text-xs">
              Summary
            </TabsTrigger>
            <TabsTrigger value="target-audience" className="text-xs">
              Target Audience
            </TabsTrigger>
            <TabsTrigger value="pain-points" className="text-xs">
              Pain Points
            </TabsTrigger>
            <TabsTrigger value="artifacts" className="text-xs">
              Artifacts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="flex flex-1 h-2">
            <Chat
              messages={messages}
              handleSubmit={handleSubmit}
              className="border border-slate-200 px-4 rounded-lg"
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
            />
          </TabsContent>
          <TabsContent value="summary" className="debug">
            <div className="debug">{summary}</div>
          </TabsContent>
          <TabsContent value="target-audience">
            <div className="debug">{summary}</div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
