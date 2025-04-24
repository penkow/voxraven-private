"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

import { Project } from "../../../../voxraven-server-private/node_modules/@prisma/client";

export function NavMain({
  items,
}: {
  items: Project[] | null;
}) {
  if (items === null || items === undefined) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Analyses</SidebarGroupLabel>
        <SidebarMenu>
          {[...Array(3)].map((_, index) => (
            <SidebarMenuItem key={index}>
              <Skeleton className="h-8 w-full" />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Analyses</SidebarGroupLabel>
      <SidebarMenu>
        {items?.map((item) => (
          <Collapsible key={item.id} asChild defaultOpen={false}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={`/analysis/${item.id}`}>
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
