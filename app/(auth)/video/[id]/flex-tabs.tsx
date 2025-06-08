"use client";
import { Chat } from "./chat-module/chat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const customComponents = {
  ul: (props: any) => <ul className={cn("list-disc pl-6 space-y-1")} {...props} />,
  ol: (props: any) => <ol className={cn("list-decimal pl-6 space-y-1")} {...props} />,
  table: (props: React.JSX.IntrinsicAttributes) => <table className="table-auto border border-gray-300" {...props} />,
  th: (props: any) => <th className="border px-4 py-2 bg-gray-100" {...props} />,
  td: (props: any) => <td className="border px-4 py-2" {...props} />,
};

import type React from "react";

import { useEffect, useState } from "react";
import { AlertTriangle, BarChart3, Box, FileText, MessageCircle, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { Message, useChat } from "@ai-sdk/react";
import { TranscriptSegment, useYouTube } from "./youtube-provider";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export function FlexTabs() {
  const [activeTab, setActiveTab] = useState("chat");
  const { id } = useParams();

  const {
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
  } = useYouTube();

  const AI_CHAT_API = new URL(`api/ai/chat`, process.env.NEXT_PUBLIC_API_URL);

  const { messages, input, handleInputChange, handleSubmit, append, stop, status, setMessages } = useChat({
    api: AI_CHAT_API.toString(),
    credentials: "include",
    body: {
      videoId: id,
    },
  });

  function animateInitialMessage(message: Message, setMessages: (msgs: Message[]) => void) {
    const words = message.content.split(" ");
    let current = "";
    let index = 0;

    function showNextWord() {
      if (index < words.length) {
        current += (index === 0 ? "" : " ") + words[index];
        setMessages([{ ...message, content: current }]);
        index++;
        setTimeout(showNextWord, 20);
      }
    }

    showNextWord();
  }

  useEffect(() => {
    console.log("Setting initial messages for video chat", id);
    const initialMessage: Message = {
      id: "1",
      role: "system",
      content:
        "Hi there! I am **VoxRaven AI**, your personal **experienced content analysis assistant**.\n\n" +
        "I'm here to answer any questions about the video and its content!\n\n" +
        "Feel free to **ask complex questions** that go **beyound what was said in the video**. " +
        "I'm an expert in diverse fields, including self-improvement, marketing, sales, product management, and more.\n\n" +
        "How can I assist you today?",
    };
    animateInitialMessage(initialMessage, setMessages);
    //setMessages([initialMessage]);
  }, [id]);

  useEffect(() => {
    console.log("Setting initial messages for video chat", id);
    const initialMessage: Message = {
      id: "1",
      role: "system",
      content:
        "Hi there! I am **VoxRaven AI**, your personal **experienced content analysis assistant**.\n\n" +
        "I'm here to answer any questions about the video and its content!\n\n" +
        "Feel free to **ask complex questions** that go **beyound what was said in the video**. " +
        "I'm an expert in diverse fields, including self-improvement, marketing, sales, product management, and more.\n\n" +
        "How can I assist you today?",
    };
    animateInitialMessage(initialMessage, setMessages);
  }, [id]);

  const createChatTabItem = (transcript: TranscriptSegment[] | undefined | null) => {
    return transcript ? (
      <Chat
        videoId={id as string}
        messages={messages as any}
        handleSubmit={handleSubmit}
        className="border border-slate-200 px-4 pb-4 rounded-lg overflow-auto pt-2"
        input={input}
        handleInputChange={handleInputChange}
        isGenerating={status != "ready"}
        stop={stop}
        append={append}
        setMessages={setMessages}
        suggestions={[]}
      />
    ) : (
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground p-6 flex-1 border rounded-lg">
        <span className="text-xl font-extralight">Preparing AI chat</span>
        <span className="text-2xl font-bold">VoxRaven AI</span>
        <div className="flex items-center justify-center" role="status" aria-label="Loading">
          <motion.div
            className="rounded-full border-2 border-t-transparent h-12 w-12"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <span className="sr-only">Loading</span>
        </div>
      </div>
    );
  };

  const createTabItem = (label: string, content: string | undefined | null) => {
    return content ? (
      <div className="p-6 bg-card rounded-lg border overflow-auto text-sm">
        <h3 className="text-xl font-semibold mb-4">{label}</h3>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
          {content}
        </ReactMarkdown>
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground p-6 flex-1 border rounded-lg">
        <span className="text-xl font-extralight">
          Analyzing <span className="italic font-thin">{label}</span> with
        </span>
        <span className="text-2xl font-bold">VoxRaven AI</span>
        <div className="flex items-center justify-center" role="status" aria-label="Loading">
          <motion.div
            className="rounded-full border-2 border-t-transparent h-12 w-12"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <span className="sr-only">Loading</span>
        </div>
      </div>
    );
  };

  const tabs: TabItem[] = [
    {
      id: "chat",
      label: "Chat",
      icon: <MessageCircle className="h-4 w-4" />,
      content: createChatTabItem(transcript as TranscriptSegment[]),
    },
    {
      id: "summary",
      label: "Summary",
      icon: <FileText className="h-4 w-4" />,
      content: createTabItem("Summary", summary),
    },

    {
      id: "pain-points",
      label: "Pain Points",
      icon: <AlertTriangle className="h-4 w-4" />,
      content: createTabItem("Pain Points", painPoints),
    },
    {
      id: "target-audience",
      label: "Audience",
      icon: <Users className="h-4 w-4" />,
      content: createTabItem("Audience", targetAudience),
    },
    {
      id: "comments-analysis",
      label: "Comments",
      icon: <BarChart3 className="h-4 w-4" />,
      content: createTabItem("Comments", commentsAnalysis),
    },
    {
      id: "artifacts",
      label: "Artifacts",
      icon: <Box className="h-4 w-4" />,
      content: (
        <div className="p-6 bg-card rounded-lg flex-1 border">
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-8xl mb-2">🚧</span>
            <span className="text-4xl font-semibold">Under Construction</span>
            <span className="text-md text-muted-foreground mt-1">
              Track your self-selected insights here and use them as context for the AI.
            </span>
            <span className="text-md text-muted-foreground mt-1">Artifacts tab coming soon!</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col">
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
      <div className="flex flex-1 overflow-auto">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
    </div>
  );
}
