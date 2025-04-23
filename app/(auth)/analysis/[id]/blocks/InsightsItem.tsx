"use client";

import { Info } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface InsightsItemProps {
  title: string;
  content: string;
}

export default function InsightsItem({ title, content }: InsightsItemProps) {
  if (content) {
    return (
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger asChild>
          <div className="text-xs font-bold flex decoration-dashed underline text-blue-600 hover:text-blue-400 items-center gap-1 cursor-pointer">
            <Info className="w-3 h-3" />
            {title}
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="text-xs w-[800px]">
          <div
            style={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "20",
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  } else {
    return (
      <div className="text-xs font-bold flex items-center gap-1 text-muted-foreground">
        <Info className="w-3 h-3" />
        {title}
      </div>
    );
  }
}
