"use client";

import * as React from "react";
import { Bird } from "lucide-react";
import { useRouter } from "next/navigation";
import { NavMain } from "./nav-main";
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

import { CreditsCard } from "./credits-card";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();

  const handleNewProject = async () => {
    router.push(`/project`);
  };

  const handleNewVideo = async () => {
    router.push(`/video`);
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
                  <span className="truncate text-xs text-gray-500">
                    Version v0.4.2-b.1
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="pt-4">
            <Button
              size="default"
              variant="outline"
              className="w-full font-medium"
              onClick={handleNewProject}
            >
              New Project
            </Button>

            {/* <Button
              size="default"
              variant="outline"
              className="w-full font-medium"
              onClick={handleNewVideo}
            >
              New Video
            </Button> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div className="overflow-y-auto">
          <NavMain />
        </div>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 pb-2">
          <CreditsCard />
        </div>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
