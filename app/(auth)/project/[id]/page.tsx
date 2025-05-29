"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import VideoItem from "./blocks/VideoItem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useParams, useRouter } from "next/navigation";

import { Project } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { LoadingAnimation } from "./blocks/LoadingAnimation";
import { ScrollArea } from "@/components/ui/scroll-area";
export type VideoFullType = Prisma.VideoGetPayload<{
  select: { [K in keyof Required<Prisma.VideoSelect>]: true };
}>;
export default function VideoSelectionInterface() {
  const { id } = useParams();

  const PROJECTS_ENDPOINT = new URL(
    `api/projects/${id}`,
    process.env.NEXT_PUBLIC_API_URL
  );

  const SYNTHESIS_ENDPOINT = new URL(
    `api/synthesis/${id}`,
    process.env.NEXT_PUBLIC_API_URL
  );

  // const VIDEOS_ENDPOINT = new URL(
  //   `api/projects/${id}/videos`,
  //   process.env.NEXT_PUBLIC_API_URL
  // );

  const VIDEOS_ENDPOINT = new URL(
    `api/video/${id}`,
    process.env.NEXT_PUBLIC_API_URL
  );

  const [isGeneratingSynthesis, setIsGeneratingSynthesis] =
    useState<boolean>(false);

  // User Input
  const [videoUrl, setVideoUrl] = useState("");

  // Retrieved Data
  const [projectVideos, setProjectVideos] = useState<VideoFullType[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [currentChatVideo, setCurrentChatVideo] =
    useState<VideoFullType | null>(null);

  // State Management
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSynthesis, setHasSynthesis] = useState(false);

  const router = useRouter();

  const handleGenerateSynthesis = async () => {
    setIsGeneratingSynthesis(true);
    const response = await fetch(SYNTHESIS_ENDPOINT, {
      method: "POST",
      credentials: "include",
    });

    router.push(`/insights/${id}`);
    setIsGeneratingSynthesis(false);
  };

  const handleAddVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsAddingManual(true);

    const response = await fetch(VIDEOS_ENDPOINT, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoUrl: videoUrl, projectId: id }),
    });

    const videos: VideoFullType[] = await response.json();

    setProjectVideos(videos);
    setIsAddingManual(false);
    setIsModalOpen(false);
    setVideoUrl("");
  };


  useEffect(() => {
    const fetchProject = async () => {
      const projectResponse = await fetch(PROJECTS_ENDPOINT, {
        credentials: "include",
      });
      const project: Project = await projectResponse.json();
      setProject(project);

      const videosResponse = await fetch(VIDEOS_ENDPOINT, {
        credentials: "include",
      });
      const videos: VideoFullType[] = await videosResponse.json();
      setProjectVideos(videos);

      const synthesisResponse = await fetch(SYNTHESIS_ENDPOINT, {
        credentials: "include",
      });
      const synthesis = await synthesisResponse.json();

      if (synthesis) {
        setHasSynthesis(true);
      } else {
        setHasSynthesis(false);
      }
    };
    fetchProject();
  }, []);

  const handleStartChat = (video: VideoFullType) => {
    setCurrentChatVideo(video);
    setIsChatOpen(true);
  };

  return (
    <>
      <div className="flex flex-col w-full h-[calc(100vh-18px)]">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 className="text-2xl font-medium">
            {project?.title || "Loading..."}
          </h2>
          <div className="flex gap-2">
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
                    disabled={isAddingManual}
                  />
                  <LoadingAnimation
                    messages={[
                      "Fetching video transcript...",
                      "Analyzing video content...",
                      "Extracting insights...",
                      "Finding viewer interests...",
                    ]}
                    hidden={isAddingManual}
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
        {/* </div> */}

        {/* Red div - scrollable content area */}
        <div className="flex-1 w-full overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="p-4">
              <div className="space-y-4">
                {projectVideos.length > 0 ? (
                  projectVideos.map((video) => (
                    <VideoItem
                      key={video.id}
                      video={video}
                      onStartChat={handleStartChat}
                    />
                  ))
                ) : (
                  <>
                    <div className="flex flex-col text-center text-muted-foreground mt-36">
                      <div>No videos added yet.</div>
                      <div className="mt-4">
                        <Button
                          type="submit"
                          disabled={isAddingManual}
                          onClick={() => setIsModalOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                          Add Video
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Blue div - fixed height footer */}
        <div className="w-full h-[30px] min-h-[30px] bg-blue-100 border border-blue-300 flex items-center justify-center">
          <span className="text-blue-800 font-medium text-xs">
            Blue Footer (Fixed Height)
          </span>
        </div>
      </div>
    </>
  );
}
