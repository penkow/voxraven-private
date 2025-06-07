"use client";

import { Prisma, Video } from "@prisma/client";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export type VideoFullType = Prisma.VideoGetPayload<{
  select: { [K in keyof Required<Prisma.VideoSelect>]: true };
}>;

interface VideoItemProps {
  video: Video;
}

export default function VideoItem({ video }: VideoItemProps) {
  return (
    <Card
      className="w-full max-w-sm overflow-hidden shadow-none bg-transparent h-[23rem]"
      onClick={() => (window.location.href = `/video/${video.id}`)}
    >
      <div className="relative group cursor-pointer">
        {/* Video Thumbnail */}
        <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
          <img
            src={video.thumbnails[video.thumbnails.length - 1]}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
          {/* Duration Badge */}
          <Badge
            variant="secondary"
            className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 hover:bg-black/80"
          >
            {video.duration
              ? `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, "0")}`
              : "N/A"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-3">
        <div className="flex gap-3">
          <div className="flex-1 min-w-0">
            {/* Video Title */}
            <h3 className="font-medium text-sm leading-5 line-clamp-2 mb-1 group-hover:text-blue-600 cursor-pointer">
              {video.title || "Untitled Video"}
            </h3>

            {/* Video Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2 leading-5">
              {video.description || "No description available."}
            </p>

            {/* Channel Info */}
            {/* <div className="flex items-center gap-1 mb-1">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer">Tech Channel</span>
              <CheckCircle className="w-3 h-3 text-muted-foreground" />
            </div> */}

            {/* Video Stats */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>
                {typeof video.viewCount === "number"
                  ? video.viewCount >= 1_000_000
                    ? `${(video.viewCount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M views`
                    : video.viewCount >= 1_000
                    ? `${(video.viewCount / 1_000).toFixed(1).replace(/\.0$/, "")}k views`
                    : `${video.viewCount} views`
                  : "N/A"}
              </span>
              <span>•</span>
              <span>
                {(() => {
                  if (!video.publishedAt) return "N/A";
                  const dateStr = video.publishedAt;
                  const year = Number(dateStr.slice(0, 4));
                  const month = Number(dateStr.slice(4, 6)) - 1;
                  const day = Number(dateStr.slice(6, 8));
                  const date = new Date(year, month, day);

                  const now = new Date();
                  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                  const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

                  if (diffDays === 0) return "today";
                  if (diffDays === 1) return "yesterday";
                  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
                })()}
              </span>
            </div>
          </div>

          {/* More Options */}
          {/* <Button
          
            size="sm"
            className="w-8 h-8 p-0  debug opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="w-4 h-4" />
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
}
