"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Bird } from "lucide-react";
import { useRouter } from "next/navigation";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";


import { Project } from "@prisma/client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch("http://localhost:3000/api/projects");
      const data: Project[] = await response.json();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  const handleNewAnalysis = async () => {
    router.push(`/analysis`);
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Bird className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">VoxRaven</span>
                  <span className="truncate text-xs">Alpha v0.1.2</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="pt-4">
            <Button
              size="default"
              variant="outline"
              className="w-full font-medium"
              onClick={handleNewAnalysis}
            >
              New Analysis
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div className="overflow-y-auto">
          <NavMain items={projects} />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
