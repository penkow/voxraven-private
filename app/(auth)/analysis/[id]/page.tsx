"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageCircle, Plus, Sparkles, X } from "lucide-react";
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
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

export default function VideoSelectionInterface() {
  const [selectedVideos, setSelectedVideos] = useState<any[]>([]);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [manualUrl, setManualUrl] = useState("");
  const [isAddingManual, setIsAddingManual] = useState(false);
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

    setProjectData(data);
    setIsAddingManual(false);
    setIsModalOpen(false);
    setManualUrl("");
  };

  useEffect(() => {
    const fetchProject = async () => {
      const response = await fetch(`http://localhost:3000/api/projects/${id}`);
      if (response.ok) {
        const data: ProjectData = await response.json();
        setProjectData(data);
      } else {
        console.error("Failed to fetch project");
        console.log(response);
      }
    };
    fetchProject();
  }, []);

  const handleStartChat = (videoData: VideoData) => {
    console.log("Starting chat", videoData);
    setCurrentChatVideo(videoData);
    setIsChatOpen(true);
  };

  return (
    <div className="w-full h-full rounded-lg flex">
      <div className="flex-1 relative transition-all duration-300 ease-in-out">
        <div className="space-y-2 p-4 overflow-y-auto h-[900px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">
              {projectData?.project.title || "Loading..."}
            </h2>
            <div className="flex items-center gap-2">
              <Button className="bg-purple-700 hover:bg-purple-600">
                <Sparkles className="h-4 w-4" />
                Idea Synthesis
              </Button>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Video
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
          </div>
          {projectData?.videosData.map((video) => (
            <VideoItem
              key={video.info.url}
              video={video.info}
              videoData={video}
              videoSummary={video.summary}
              videoEmpathyMap={video.empathyMap}
              videoPainPoints={video.painPoints}
              videoTargetAudience={video.targetAudience}
              videoCommentsAnalysis={video.commentsAnalysis}
              onStartChat={handleStartChat}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {isChatOpen && (
          <motion.div
            className="w-96 border-l border-gray-200"
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-2 border-b">
                <div className="flex items-center font-bold space-x-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>Chatting with:</div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsChatOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-2 text-center text-lg font-medium border-b">
                {currentChatVideo?.info.title}
              </div>

              <ChatContainer currentChatVideo={currentChatVideo} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
