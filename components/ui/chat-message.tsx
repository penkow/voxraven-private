"use client";

import React, { useMemo, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Ban, Code2, Loader2, Terminal } from "lucide-react";

import { cn } from "@/lib/utils";
import { FilePreview } from "@/components/ui/file-preview";
import { ToolCard } from "../ToolCard";
import MarkdownRenderer from "./markdown-renderer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { LoadingAnimation } from "./LoadingAnumation";

const chatBubbleVariants = cva(
  "group/message relative break-words rounded-lg p-3 text-sm sm:max-w-[70%]",
  {
    variants: {
      isUser: {
        true: "bg-primary text-primary-foreground",
        false: "bg-muted text-foreground",
      },
      animation: {
        none: "",
        slide: "duration-300 animate-in fade-in-0",
        scale: "duration-300 animate-in fade-in-0 zoom-in-75",
        fade: "duration-500 animate-in fade-in-0",
      },
    },
    compoundVariants: [
      {
        isUser: true,
        animation: "slide",
        class: "slide-in-from-right",
      },
      {
        isUser: false,
        animation: "slide",
        class: "slide-in-from-left",
      },
      {
        isUser: true,
        animation: "scale",
        class: "origin-bottom-right",
      },
      {
        isUser: false,
        animation: "scale",
        class: "origin-bottom-left",
      },
    ],
  }
);

type Animation = VariantProps<typeof chatBubbleVariants>["animation"];

interface Attachment {
  name?: string;
  contentType?: string;
  url: string;
}

export interface PartialToolCall {
  state: "partial-call";
  toolName: string;
}

export interface ToolCall {
  state: "call";
  toolName: string;
}

export interface ToolResult {
  state: "result";
  toolName: string;
  result: {
    __cancelled?: boolean;
    [key: string]: any;
  };
}

export type ToolInvocation = PartialToolCall | ToolCall | ToolResult;

export interface Message {
  id: string;
  role: "user" | "assistant" | (string & {});
  content: string;
  createdAt?: Date;
  experimental_attachments?: Attachment[];
  toolInvocations?: ToolInvocation[];
  toolViewCallback?: (toolOutput: string) => void;
}

export interface ChatMessageProps extends Message {
  showTimeStamp?: boolean;
  animation?: Animation;
  actions?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  createdAt,
  showTimeStamp = false,
  animation = "scale",
  actions,
  className,
  experimental_attachments,
  toolInvocations,
  toolViewCallback,
  isLoading = false,
}) => {
  const files = useMemo(() => {
    return experimental_attachments?.map((attachment) => {
      const dataArray = dataUrlToUint8Array(attachment.url);
      const file = new File([dataArray], attachment.name ?? "Unknown");
      return file;
    });
  }, [experimental_attachments]);

  if (toolInvocations && toolInvocations.length > 0) {
    return <ToolCall toolInvocations={toolInvocations} />;
  }

  const isUser = role === "user";

  const formattedTime = createdAt?.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [viewToolOutput, setViewToolOutput] = useState(false);
  const [toolOutput, setToolOutput] = useState("");
  const findToolCallLocations = (input: string): number[][] => {
    const regex = /<ToolCall>(.*?)<\/ToolCall>/g;
    let match;
    const locations: number[][] = [];

    while ((match = regex.exec(input)) !== null) {
      locations.push([match.index, match.index + match[0].length]);
    }

    return locations;
  };

  const extractSingleToolCall = (input: string): string | null => {
    const regex = /<ToolCall>(.*?)<\/ToolCall>/;
    const match = input.match(regex);

    return match ? JSON.parse(match[1]) : null;
  };

  const extractSingleToolFinish = (input: string): string | null => {
    const regex = /<ToolFinish>(.*?)<\/ToolFinish>/;
    const match = input.match(regex);

    return match ? JSON.parse(match[1]) : null;
  };

  const findToolFinishLocations = (input: string): number[][] => {
    const regex = /<ToolFinish>(.*?)<\/ToolFinish>/g;
    let match;
    const locations: number[][] = [];

    while ((match = regex.exec(input)) !== null) {
      locations.push([match.index, match.index + match[0].length]);
    }

    return locations;
  };

  const removeFinishedToolCalls = (content: string) => {
    const toolCallLocations = findToolCallLocations(content);
    const toolFinishLocations = findToolFinishLocations(content);

    const toolCalls = toolCallLocations.map((location) =>
      extractSingleToolCall(content.slice(location[0], location[1]))
    );
    const toolFinishes = toolFinishLocations.map((location) =>
      extractSingleToolFinish(content.slice(location[0], location[1]))
    );

    const finishedToolCalls = toolCalls.filter((call) => {
      return toolFinishes.some((finish) => finish?.call_id === call?.call_id);
    });

    const unfinishedToolCalls = toolCalls.filter((call) => {
      return !toolFinishes.some((finish) => finish?.call_id === call?.call_id);
    });

    // Replace all of the finished too calls in the content with empty strings
    finishedToolCalls.forEach((call) => {
      // Find the index of the call in the toolCalls using the call.id
      const index = toolCalls.findIndex((c) => c.call_id === call.call_id);

      // Find the toolCalllocation coordinates
      const toolCallLocation = toolCallLocations[index];

      // Remove the call from the content
      content =
        content.slice(0, toolCallLocation[0]) +
        content.slice(toolCallLocation[1]);
    });

    return content;
  };

  const prepareContent = (content: string) => {
    // let cleanContent = removeFinishedToolCalls(content);
    // console.log(cleanContent);
    // This regex matches both <ToolFinish>...</ToolFinish> and <ToolCall>...</ToolCall>
    // It captures the tag type in group 1 and the inner content in group 2.
    const regex = /<(ToolFinish|ToolCall)>(.*?)<\/\1>/gs;

    const toolCalls = [];
    const toolFinishes = [];
    let parts: string[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    // Loop through all matches of the regex in the text
    while ((match = regex.exec(content)) !== null) {
      // Add text before the current match (if any)
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      // Add the captured text inside the tag (group 2)
      const toolData = JSON.parse(match[2]);
      parts.push(toolData);

      if ("tool_output" in toolData) {
        toolFinishes.push(toolData);
      } else {
        toolCalls.push(toolData);
      }

      // Update lastIndex to continue after the current match
      lastIndex = regex.lastIndex;
    }

    // If there's any text after the last tag, add it as well
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    toolFinishes.forEach((finish) => {
      const call = toolCalls.find((call) => call.call_id === finish.call_id);

      //If a call is found, remove it from the parts array
      if (call) {
        // console.log("removing call", call);
        parts = parts.filter((part) => part !== call);
      }
    });

    return parts;
  };

  return (
    <div className={cn("flex flex-col", isUser ? "items-end" : "items-start")}>
      {files ? (
        <div className="mb-1 flex flex-wrap gap-2">
          {files.map((file, index) => {
            return <FilePreview file={file} key={index} />;
          })}
        </div>
      ) : null}

      <AlertDialog open={viewToolOutput} onOpenChange={setViewToolOutput}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>{toolOutput}</AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

      <div className={cn(chatBubbleVariants({ isUser, animation }), className)}>
        <div className="space-y-2">
          {prepareContent(content).map((lines, index) => {
            return typeof lines === "string" ? (
              <MarkdownRenderer key={index}>{lines}</MarkdownRenderer>
            ) : (
              <ToolCard
                title={
                  "tool_output" in lines ? "Tool Finished" : "Calling Tool"
                }
                key={index}
                finished={"tool_output" in lines}
                // onView={() => {
                //   toolViewCallback?.(lines.tool_output);
                // }}
                steps={[
                  {
                    step: lines.tool_name,
                    status: "tool_output" in lines ? "generated" : "generating",
                  },
                ]}
              />
            );
          })}
        </div>

        {role === "assistant" && actions ? (
          <div className="absolute -bottom-4 right-2 flex space-x-1 rounded-lg border bg-background p-1 text-foreground opacity-0 transition-opacity group-hover/message:opacity-100">
            {actions}
          </div>
        ) : null}
      </div>

      {showTimeStamp && createdAt ? (
        <time
          dateTime={createdAt.toISOString()}
          className={cn(
            "mt-1 block px-1 text-xs opacity-50",
            animation !== "none" && "duration-500 animate-in fade-in-0"
          )}
        >
          {formattedTime}
        </time>
      ) : null}
    </div>
  );
};

function dataUrlToUint8Array(data: string) {
  const base64 = data.split(",")[1];
  const buf = Buffer.from(base64, "base64");
  return new Uint8Array(buf);
}

function ToolCall({
  toolInvocations,
}: Pick<ChatMessageProps, "toolInvocations">) {
  if (!toolInvocations?.length) return null;

  return (
    <div className="flex flex-col items-start gap-2">
      {toolInvocations.map((invocation, index) => {
        const isCancelled =
          invocation.state === "result" &&
          invocation.result.__cancelled === true;

        if (isCancelled) {
          return (
            <div
              key={index}
              className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground"
            >
              <Ban className="h-4 w-4" />
              <span>
                Cancelled{" "}
                <span className="font-mono">
                  {"`"}
                  {invocation.toolName}
                  {"`"}
                </span>
              </span>
            </div>
          );
        }

        switch (invocation.state) {
          case "partial-call":
          case "call":
            return (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-2 text-sm text-muted-foreground"
              >
                <Terminal className="h-4 w-4" />
                <span>
                  Calling{" "}
                  <span className="font-mono">
                    {"`"}
                    {invocation.toolName}
                    {"`"}
                  </span>
                  ...
                </span>
                <Loader2 className="h-3 w-3 animate-spin" />
              </div>
            );
          case "result":
            return (
              <div
                key={index}
                className="flex flex-col gap-1.5 rounded-lg border bg-muted px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Code2 className="h-4 w-4" />
                  <span>
                    Result from{" "}
                    <span className="font-mono">
                      {"`"}
                      {invocation.toolName}
                      {"`"}
                    </span>
                  </span>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap text-foreground">
                  {JSON.stringify(invocation.result, null, 2)}
                </pre>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
