"use client";

import { Message, useChat } from "@ai-sdk/react";

import { Chat } from "@/components/ui/chat";
import { useRef, useState, useEffect } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { handleChunkParts } from "./messageParsing";
import { useAuth } from "@/app/(providers)/auth-provider";
export default function ChatDemo() {
  const [messageId, setMessageId] = useState(1);
  const [toolOutput, setToolOutput] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [parts, setParts] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { get_jwt } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setParts([]);
    setIsLoading(true);
    const userMessage = input;
    setMessages([
      ...messages,
      { id: messageId.toString(), role: "user", content: userMessage },
    ]);
    setMessageId(messageId + 1);

    const jwt = await get_jwt();
    fetchStream(userMessage, jwt);
    setInput("");
  };

  useEffect(() => {
    // setMessages([
    //   ...messages,
    //   { id: messageId.toString(), role: "user", content: userMessage },
    // ]);
    const combinedParts = parts.join("");
    // update the last message with the combined parts

    if (messages.length > 0) {
      // if the last message is a user message add a new assistant message with the combined parts
      if (messages[messages.length - 1].role === "user") {
        setMessages((prev) => [
          ...prev,
          {
            id: messageId.toString(),
            role: "assistant",
            content: combinedParts,
          },
        ]);
      }
      // else update the last message with the combined parts
      else {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { ...prev[prev.length - 1], content: combinedParts },
        ]);
      }
    }
  }, [parts]);

  const stop = () => {
    console.log("stop");
  };

  const append = (message: Message) => {
    console.log("append", message);
  };

  const fetchStream = async (userMessage: string, jwt: string) => {
    const response = await fetch("http://localhost:8001/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        prompt: userMessage,
      }),
    }); // Replace with your API

    setIsLoading(true);

    if (response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const chunks: string[] = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Decode chunk and update UI
        const chunk = decoder.decode(value, { stream: true });
        const newParts = handleChunkParts(chunk);

        // Extend parts with parsedChunks
        setParts((prev) => [...prev, ...newParts]);
      }
    }
    setIsLoading(false);
  };

  const toolViewCallback = (toolOutput: string) => {
    setToolOutput(toolOutput);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full rounded-lg border"
    >
      <ResizablePanel defaultSize={80}>
        <div className="flex h-[calc(100vh-100px)] p-4 col-span-2 border-r border-slate-200">
          <Chat
            className="grow"
            messages={messages}
            handleSubmit={handleSubmit}
            input={input}
            handleInputChange={handleInputChange}
            isGenerating={isLoading}
            stop={stop}
            append={append}
            setMessages={setMessages}
            isLoading={isLoading}
            suggestions={[
              "Generate a tasty vegan lasagna recipe for 3 people.",
              "Generate a list of 5 questions for a job interview for a software engineer.",
              "Who won the 2022 FIFA World Cup?",
            ]}
            toolViewCallback={toolViewCallback}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={20}>
        <div className="h-[calc(100vh-100px)] overflow-y-auto p-4">
          <p>{toolOutput}</p>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
