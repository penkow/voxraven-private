"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import { VideoData } from "./types";

type ChatMode = "auto" | "transcript" | "comments";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface ChatContainerProps {
  currentChatVideo: VideoData | null;
}

export default function ChatContainer({
  currentChatVideo,
}: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [chatMode, setChatMode] = useState<ChatMode>("auto");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isThinking, setIsThinking] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const askVideo = async (question: string, mode: ChatMode) => {
    console.log("Sending question to server");
    setIsThinking(true);
    const response = await fetch(`http://localhost:3000/api/video/askVideo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
        videoUrl: currentChatVideo?.info.url,
        mode: mode,
      }),
    });
    const data = await response.json();
    console.log("Received response from server");
    console.log(data);
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
          text:
            "You are chatting with the video: " + currentChatVideo?.info.title,
          isUser: false,
        },
      ]);
    }
  }, [currentChatVideo]);

  useEffect(() => {
    console.log(currentChatVideo);
  }, [currentChatVideo]);

  // Scroll to bottom whenever messages change or chat mode changes
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, chatMode]);

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

    const response = await askVideo(inputValue, chatMode);
    console.log(response);
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
    <div className="flex flex-col flex-1">
      <div
        ref={chatContainerRef}
        className="h-[41rem] overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 ${
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
            <div className="max-w-[85%] rounded-lg px-4 py-3 bg-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t bg-background">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Textarea
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-[100px] max-h-[200px] resize-none pr-12"
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {inputValue.length}/1000
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Select
              value={chatMode}
              onValueChange={(value: ChatMode) => setChatMode(value)}
            >
              <SelectTrigger className="h-8 w-32">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Agent</SelectItem>
                <SelectItem value="transcript">Transcript</SelectItem>
                <SelectItem value="comments">Comments</SelectItem>
              </SelectContent>
            </Select>
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isThinking}
              className="h-8 px-4"
            >
              {isThinking ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
