import { AnalysisProject } from "../page";

const API_ENDPOINTS = {
  PROJECTS: "http://localhost:3000/projects",
} as const;

export async function getProjects(): Promise<AnalysisProject[]> {
  const response = await fetch(API_ENDPOINTS.PROJECTS, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

export async function createProject(title: string): Promise<AnalysisProject> {
  const response = await fetch(API_ENDPOINTS.PROJECTS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
} 