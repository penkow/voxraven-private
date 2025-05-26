"use client";
import { Chat } from "./chat-module/chat";

import type React from "react";

import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Box,
  FileText,
  MessageCircle,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useYoutubeVideo } from "./use-youtube-video";
import { useChat } from "@ai-sdk/react";

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export function FlexTabs({ videoId }: { videoId: string }) {
  const [activeTab, setActiveTab] = useState("chat");

  const { summary, commentsAnalysis, painPoints, targetAudience, transcript } =
    useYoutubeVideo({
      videoId: videoId,
    });

  const AI_CHAT_API = new URL(`api/ai/chat`, process.env.NEXT_PUBLIC_API_URL);

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
    api: AI_CHAT_API.toString(),
    credentials: "include",
    body: {
      videoId: videoId,
    },
  });

  const tabs: TabItem[] = [
    {
      id: "chat",
      label: "Chat",
      icon: <MessageCircle className="h-4 w-4" />,
      content: (
        <Chat
          messages={messages as any}
          handleSubmit={handleSubmit}
          className="border border-slate-200 px-4 pb-4 rounded-lg overflow-auto"
          input={input}
          handleInputChange={handleInputChange}
          isGenerating={status != "ready"}
          stop={stop}
          append={append}
          setMessages={setMessages}
          suggestions={[]}
        />
      ),
    },
    {
      id: "summary",
      label: "Summary",
      icon: <FileText className="h-4 w-4" />,
      content: (
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Summary</h3>
          <p className="text-muted-foreground">{summary}</p>
        </div>
      ),
    },
    {
      id: "pain-points",
      label: "Pain Points",
      icon: <AlertTriangle className="h-4 w-4" />,
      content: (
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Pain Points</h3>
          <p className="text-muted-foreground">{painPoints}</p>
        </div>
      ),
    },
    {
      id: "target-audience",
      label: "Audience",
      icon: <Users className="h-4 w-4" />,
      content: (
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Target Audience</h3>
          <p className="text-muted-foreground">{targetAudience}</p>
        </div>
      ),
    },
    {
      id: "comments-analysis",
      label: "Comments",
      icon: <BarChart3 className="h-4 w-4" />,
      content: (
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Comments Analysis</h3>
          <p className="text-muted-foreground">{commentsAnalysis}</p>
        </div>
      ),
    },
    {
      id: "artifacts",
      label: "Artifacts",
      icon: <Box className="h-4 w-4" />,
      content: (
        <div className="p-6 bg-card rounded-lg border">
          <h3 className="text-xl font-semibold mb-4">Artifacts</h3>
          <p className="text-muted-foreground">{commentsAnalysis}</p>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Custom TabsList with Flexbox */}
      <div className="flex w-full rounded-md bg-muted p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-sm p-2 text-xs font-medium transition-all",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex flex-1 overflow-auto">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
