import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { ReactNode } from "react";
import { Project } from "@prisma/client";

// Create ProjectsProviderContext
const ProjectsProviderContext = createContext<{
  projects: Project[];
  fetchProjects: () => Promise<void>;
  getProject: (id: string) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<void>;
  createProject: (title: string) => Promise<Project | null>;
}>({
  projects: [],
  fetchProjects: async () => {},
  getProject: async (id: string) => null,
  deleteProject: async (id: string) => {},
  createProject: async (title: string) => null,
});

interface ProjectsProviderProps {
  children: ReactNode;
}

export function ProjectsProvider({ children }: ProjectsProviderProps) {
  const [projects, setProjects] = useState<Project[]>([]);

  const PROJECTS_ENDPOINT = new URL(
    "api/projects",
    process.env.NEXT_PUBLIC_API_URL
  );

  const getProject = async (id: string) => {
    const response = await fetch(`${PROJECTS_ENDPOINT}/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 200) {
      const data = await response.json();
      return data;
    } else {
      console.error("Failed to fetch project");
      return null;
    }
  };

  const fetchProjects = async () => {
    const response = await fetch(PROJECTS_ENDPOINT, {
      method: "GET",
      credentials: "include",
    });

    if (response.status === 200) {
      const data = await response.json();
      setProjects(data);
    } else {
      console.error("Failed to fetch projects");
    }
  };

  const deleteProject = async (projectId: string) => {
    const response = await fetch(`${PROJECTS_ENDPOINT}/${projectId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (response.ok) {
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );
      toast.success("Project deleted successfully");
    } else {
      console.error("Failed to delete project");
      toast.error("Failed to delete project");
    }
  };

  const createProject = async (title: string): Promise<Project | null> => {
    const response = await fetch(PROJECTS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        title: title,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data: Project = await response.json();
    await fetchProjects();
    return data;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectsProviderContext.Provider
      value={{
        projects,
        fetchProjects,
        getProject,
        deleteProject,
        createProject,
      }}
    >
      {children}
    </ProjectsProviderContext.Provider>
  );
}

// Helper hook to access ProjectsProviderContext
export function useProjects() {
  return useContext(ProjectsProviderContext);
}
