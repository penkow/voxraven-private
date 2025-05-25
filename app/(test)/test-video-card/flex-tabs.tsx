"use client";
import { Chat } from "./chat-module/chat";

import type React from "react";

import { useState } from "react";
import {
  AlertTriangle,
  BarChart3,
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

export function FlexTabs() {
  const [activeTab, setActiveTab] = useState("chat");

  const {
    description,
    summary,
    views,
    likes,
    commentsCount,
    commentsAnalysis,
    painPoints,
    targetAudience,
    transcript,
  } = useYoutubeVideo({
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
    //api: "/api/chat",
    api: "http://localhost:3000/api/ai/chat",
    // body: {
    //   model: selectedModel,
    // },
  });

  const tabs: TabItem[] = [
    // {
    //   id: "overview",
    //   label: "Overview",
    //   icon: <FileText className="h-4 w-4" />,
    //   content: <div className="bg-yellow-300 w-full">test</div>,
    // },

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
          // transcribeAudio={transcribeAudio}
          suggestions={[]}
          // {[
          //   "What is the weather in San Francisco?",
          //   "Explain step-by-step how to solve this math problem: If x² + 6x + 9 = 25, what is x?",
          //   "Design a simple algorithm to find the longest palindrome in a string.",
          // ]}
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
