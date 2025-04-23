"use client";

import { useEffect, useState } from "react";
import { Loader2, MessageCircle, Plus, Sparkles, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import VideoItem from "./blocks/VideoItem";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChatContainer from "./blocks/ChatContainer";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

import {
  Project,
  Video,
  VideoInsights,
  Synthesis,
} from "../../../../../voxraven-server-private/node_modules/@prisma/client";

export default function VideoSelectionInterface() {
  const { id } = useParams();

  // User Input
  const [selectedVideos, setSelectedVideos] = useState<any[]>([]);
  const [videoUrl, setVideoUrl] = useState("");

  // Retrieved Data
  const [projectVideos, setProjectVideos] = useState<Video[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [currentChatVideo, setCurrentChatVideo] = useState<Video | null>(null);

  // State Management
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  const handleGenerateSynthesis = async () => {
    const response = await fetch(`http://localhost:3000/api/synthesis/${id}`, {
      method: "POST",
    });

    router.push(`/insights/${id}`);
  };

  const handleAddVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsAddingManual(true);

    const response = await fetch(
      `http://localhost:3000/api/projects/${id}/videos`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl: videoUrl }),
      }
    );

    const videos: Video[] = await response.json();

    setProjectVideos(videos);
    setIsAddingManual(false);
    setIsModalOpen(false);
    setVideoUrl("");
  };

  useEffect(() => {
    const fetchProject = async () => {
      const projectResponse = await fetch(
        `http://localhost:3000/api/projects/${id}`
      );
      const project: Project = await projectResponse.json();
      setProject(project);

      const videosResponse = await fetch(
        `http://localhost:3000/api/projects/${id}/videos`
      );
      const videos: Video[] = await videosResponse.json();
      setProjectVideos(videos);
    };
    fetchProject();
  }, []);

  const handleStartChat = (video: Video) => {
    setCurrentChatVideo(video);
    setIsChatOpen(true);
  };

  return (
    <div className="w-full h-full rounded-lg flex">
      <div className="flex-1 relative transition-all duration-300 ease-in-out">
        <div className="space-y-2 p-4 overflow-y-auto h-[900px]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">
              {project?.title || "Loading..."}
            </h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-purple-700 hover:bg-purple-600 text-white"
                onClick={handleGenerateSynthesis}
              >
                <Sparkles className="h-4 w-4" />
                Generated Insights
              </Button>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
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
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
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
          {projectVideos.map((video) => (
            <VideoItem
              key={video.id}
              video={video}
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
                {currentChatVideo?.tags}
              </div>

              <ChatContainer currentChatVideo={currentChatVideo} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
