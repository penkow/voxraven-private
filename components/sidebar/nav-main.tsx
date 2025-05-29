"use client";

import { Trash2 } from "lucide-react";

import { Collapsible } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/app/(providers)/projects-provider";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";

function SideMenuDialog({
  isOpen,
  setAlertIsOpen,
  projectId,
}: {
  isOpen: boolean;
  setAlertIsOpen: (isOpen: boolean) => void;
  projectId: string;
}) {
  const { deleteProject } = useProjects();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setAlertIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this project? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          {!isDeleting && (
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          )}
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting}
            onClick={async () => {
              setIsDeleting(true);
              setTimeout(async () => {
                await deleteProject(projectId);
                setAlertIsOpen(false);
                router.push("/project");
                setIsDeleting(false);
              }, 2000);
            }}
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function NavMain() {
  const { projects } = useProjects();
  const [alertIsOpen, setAlertIsOpen] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string>("");

  if (projects === null || projects === undefined) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
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
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Projects</SidebarGroupLabel>
        <SidebarMenu>
          {projects?.map((item) => (
            <Collapsible key={item.id} asChild defaultOpen={false}>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <a href={`/project/${item.id}`}>
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuAction
                  showOnHover
                  onClick={() => {
                    setDeleteProjectId(item.id);
                    setAlertIsOpen(true);
                    //deleteProject(item.id);
                  }}
                >
                  <Trash2 /> <span className="sr-only">Delete Project</span>
                </SidebarMenuAction>
              </SidebarMenuItem>
            </Collapsible>
          ))}

          <SidebarMenuItem>
            <SidebarMenuButton asChild disabled>
                <span className="text-muted-foreground ">
                🚧 Under construction…
                </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
      <SideMenuDialog
        isOpen={alertIsOpen}
        projectId={deleteProjectId}
        setAlertIsOpen={setAlertIsOpen}
      />
    </>
  );
}
