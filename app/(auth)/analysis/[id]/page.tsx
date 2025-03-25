"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageCircle, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import VideoItem from "./VideoItem";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChatContainer from "./ChatContainer";
import { useParams } from "next/navigation";
import { VideoData, ProjectData, VideoInfo } from "./types";

export default function VideoSelectionInterface() {
  const [selectedVideos, setSelectedVideos] = useState<any[]>([]);
  const [projectVideosData, setProjectVideosData] = useState<VideoData[]>([]);
  const [manualUrl, setManualUrl] = useState("");
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [synthesis, setSynthesis] = useState<string>("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentChatVideo, setCurrentChatVideo] = useState<VideoData | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id } = useParams();

  const handleAddVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const videoUrl = manualUrl;

    setIsAddingManual(true);

    const response = await fetch(`http://localhost:3000/api/projects/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoUrl: videoUrl }),
    });

    const data: ProjectData = await response.json();
    console.log("Project data", data);

    setProjectVideosData(data.videosData);
  };

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch(`http://localhost:3000/api/projects/${id}`);
      if (response.ok) {
        const data: ProjectData = await response.json();
        setProjectVideosData(data.videosData);
      } else {
        console.error("Failed to fetch project");
        console.log(response);
      }
    };
    fetchProject();
  }, []);

  const handleSelectVideo = (video: VideoInfo) => {
    setSelectedVideos([...selectedVideos, video]);
    console.log("Selected videos", selectedVideos);
  };

  const handleDeselectVideo = (video: VideoInfo) => {
    setSelectedVideos(selectedVideos.filter((v) => v.info.url !== video.url));
    console.log("Selected videos", selectedVideos);
  };

  const handleStartChat = (videoData: VideoData) => {
    console.log("Starting chat", videoData);
    setCurrentChatVideo(videoData);
    setIsChatOpen(true);
  };

  return (
    <div className="w-full h-full rounded-lg grid grid-cols-12 ">
      <div className="col-span-8 relative">
        <div className="space-y-2 p-4 overflow-y-auto h-[900px]">
          {projectVideosData.map((video) => (
            <VideoItem
              key={video.info.url}
              video={video.info}
              videoData={video}
              videoSummary={video.summary}
              videoEmpathyMap={video.empathyMap}
              videoPainPoints={video.painPoints}
              videoTargetAudience={video.targetAudience}
              videoCommentsAnalysis={video.commentsAnalysis}
              onSelect={handleSelectVideo}
              onDeselect={handleDeselectVideo}
              onStartChat={handleStartChat}
            />
          ))}
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              size="icon"
              className="absolute bottom-4 right-4 rounded-full w-12 h-12"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add YouTube Video</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddVideo} className="space-y-4">
              <Input
                type="url"
                placeholder="Enter YouTube URL"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                required
              />
              <Button type="submit" disabled={isAddingManual}>
                {isAddingManual ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Video"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="col-span-4 border-l border-slate-200">
        <div className="border-b flex items-center justify-center p-2 font-bold">
          <MessageCircle className="h-5 w-5 text-primary" />
          Chatting with:{" "}
          <span className="font-normal">{currentChatVideo?.info.title}</span>
        </div>
        <ChatContainer currentChatVideo={currentChatVideo} />
      </div>

      {/* <ChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentChatVideo={currentChatVideo}
      /> */}
    </div>
  );
}
