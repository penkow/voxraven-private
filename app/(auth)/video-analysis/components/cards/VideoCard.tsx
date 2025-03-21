import { VideoResult } from '../../lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ViewerNeedsList } from './ViewerNeedsList';
import { useState } from 'react';

interface VideoCardProps {
  video: VideoResult;
}

export function VideoCard({ video }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card key={video.id} className="overflow-hidden">
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered ? (
          <video
            src={video.videoUrl}
            className="w-full h-[220px] object-cover"
            autoPlay
            muted
            playsInline
            loop
          />
        ) : (
          <img
            src={video.thumbnail || "/placeholder.svg"}
            alt={video.title}
            className="w-full h-[220px] object-cover"
          />
        )}
      </div>
      <CardHeader className="pb-2">
        <h3
          className="font-semibold text-lg line-clamp-2 hover:cursor-pointer"
          onClick={() => window.open(video.videoUrl, "_blank")}
        >
          {video.title}
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-5">
          {video.description}
        </p>
        {/* {video.viewerNeeds.length > 0 ? (
          <ViewerNeedsList viewerNeeds={video.viewerNeeds} />
        ) : ( */}
          <Button size="sm">Add Viewer Needs</Button>
         {/* )} */}
      </CardContent>
    </Card>
  );
} 