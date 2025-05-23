"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { Project, Video, VideoInsights, Synthesis } from "@prisma/client";
interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface ChatContainerProps {
  currentChatVideo: Video | null;
}

export default function ChatContainer({
  currentChatVideo,
}: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isThinking, setIsThinking] = useState(false);

  const askVideo = async (question: string, videoId: string) => {
    const VIDEO_CHAT_ENDPOINT = new URL(
      `api/agent/${videoId}/askVideo`,
      process.env.NEXT_PUBLIC_API_URL
    );

    setIsThinking(true);
    const response = await fetch(VIDEO_CHAT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        question: question,
        videoUrl: currentChatVideo?.url,
      }),
    });
    const data = await response.json();

    setIsThinking(false);
    return data;
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (currentChatVideo) {
      setMessages([
        {
          id: 1,
          text: "You are chatting with the video: " + currentChatVideo?.title,
          isUser: false,
        },
      ]);
    }
  }, [currentChatVideo]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
    };
    setMessages([...messages, newMessage]);
    setInputValue("");

    const response = await askVideo(inputValue, currentChatVideo?.id || "");
    const responseMessage: Message = {
      id: messages.length + 2,
      text: response.answer,
      isUser: false,
    };
    setMessages((prev) => [...prev, responseMessage]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                message.isUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              <MarkdownRenderer>{message.text}</MarkdownRenderer>
            </div>
          </div>
        ))}
        {isThinking && (
          <div className={`flex justify-start`}>
            <div className="max-w-[80%] rounded-lg px-3 py-2 bg-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-3 pt-0">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
