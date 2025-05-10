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
import { Youtube } from "lucide-react";
import { useRouter } from "next/navigation";
import { Project } from "@prisma/client";

const AnalysisPage = () => {
  const [projectName, setProjectName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const PROJECTS_ENDPOINT = new URL(
    `api/projects`,
    process.env.NEXT_PUBLIC_API_URL
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(PROJECTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title: projectName,
        }),
      });
      const data: Project = await response.json();
      console.log(data);

      router.push(`/analysis/${data.id}`);
    } catch (error) {
      console.error("Error submitting video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4 pt-44">
          <h1 className="text-4xl font-bold">Video Analysis</h1>
          <p className="text-muted-foreground">
            Start by adding your first YouTube video URL for the analysis.
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              YouTube Video Analysis
            </CardTitle>
            <CardDescription>
              Start by naming your video analysis project
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
