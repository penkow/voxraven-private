"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import VideoItem from "./blocks/VideoItem";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useParams, useRouter } from "next/navigation";

import { Project } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { LoadingAnimation } from "./blocks/LoadingAnimation";
import { ScrollArea } from "@/components/ui/scroll-area";

export type VideoFullType = Prisma.VideoGetPayload<{
  select: { [K in keyof Required<Prisma.VideoSelect>]: true };
}>;

export type ProjectFullType = Prisma.ProjectGetPayload<{
  select: { [K in keyof Required<Prisma.ProjectSelect>]: true };
}>;

export default function VideoSelectionInterface() {
  const { id } = useParams();

  const PROJECT_ENDPOINT = new URL(`api/projects/${id}`, process.env.NEXT_PUBLIC_API_URL);

  const VIDEOS_ENDPOINT = new URL(`api/videos`, process.env.NEXT_PUBLIC_API_URL);

  // User Input
  const [videoUrl, setVideoUrl] = useState("");

  // Retrieved Data
  const [project, setProject] = useState<ProjectFullType | null>(null);

  // State Management
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

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

    const video: VideoFullType = await response.json();

    console.log(video);
    setProject((prevProject) => {
      if (!prevProject) return null;
      return {
        ...prevProject,
        videos: [...(prevProject.videos || []), video],
      };
    });

    setIsAddingManual(false);
    setIsModalOpen(false);
    setVideoUrl("");
  };

  useEffect(() => {
    const fetchProject = async () => {
      const projectResponse = await fetch(PROJECT_ENDPOINT, {
        credentials: "include",
      });
      const project: ProjectFullType = await projectResponse.json();
      setProject(project);
    };
    fetchProject();
  }, []);

  return (
    <>
      <div className="flex flex-col w-full h-[calc(100vh-1rem)]">
        <div className="flex justify-between items-center p-4 border-b border-slate-100">
          <h2 className="text-2xl font-medium">{project?.title || "Loading..."}</h2>
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

        <ScrollArea className="h-full w-full">
          <div className="flex-1 w-full overflow-y-auto p-4 grid grid-cols-3 gap-4">
            {project?.videos && project?.videos.length > 0 ? (
              project?.videos.map((video) => <VideoItem key={video.id} video={video} />)
            ) : (
              <>
                <div className="flex flex-col text-center text-muted-foreground mt-36">
                  <div>No videos added yet.</div>
                  <div className="mt-4">
                    <Button type="submit" disabled={isAddingManual} onClick={() => setIsModalOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Add Video
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
