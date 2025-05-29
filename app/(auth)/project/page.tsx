"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderClosed, Youtube } from "lucide-react";
import { useRouter } from "next/navigation";
import { Project } from "@prisma/client";
import { useProjects } from "@/app/(providers)/projects-provider";

const AnalysisPage = () => {
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createProject } = useProjects();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const project = await createProject(projectName);

      if (!project) {
        throw new Error("Failed to create project");
      }

      router.push(`/project/${project.id}`);
    } catch (error) {
      console.error("Error submitting video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center gap-1 flex flex-col">
          <h1 className="text-4xl font-bold">New Project</h1>
          <p className="text-muted-foreground italic text-sm pt-1">
            Every great project begins with a single step. The important part is
            to begin — momentum will follow...
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderClosed className="h-5 w-5" />
              Project Name
            </CardTitle>
            <CardDescription>
              Create a project that will contain all of your videos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter the project name here..."
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !projectName}
                  className="min-w-[100px]"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      <span>Creating...</span>
                    </div>
                  ) : (
                    "Create Project"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisPage;
