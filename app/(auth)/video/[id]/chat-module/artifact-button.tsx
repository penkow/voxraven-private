"use client";

import { Check, Box, Package, PackageCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import { useCreateArtifact } from "./use-create-artifact";

type ArtifactButtonProps = {
  content: string;
  videoId: string;
  artifactMessage?: string;
};

export function ArtifactButton({
  content,
  videoId,
  artifactMessage,
}: ArtifactButtonProps) {
  const { isCreating, isAdded, handleCreateArtifact } = useCreateArtifact({
    text: content,
    videoId: videoId,
    artifactMessage,
  });

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-6 w-6"
            aria-label="Create artifact"
            onClick={handleCreateArtifact}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Check
                className={cn(
                  "h-4 w-4 transition-transform ease-in-out",
                  isCreating ? "scale-100" : "scale-0"
                )}
              />
            </div>

            {!isAdded ? (
              <Package
                className={cn(
                  "h-4 w-4 transition-transform ease-in-out",
                  isCreating ? "scale-0" : "scale-100"
                )}
              />
            ) : (
              <PackageCheck
                className={cn(
                  "h-4 w-4 transition-transform ease-in-out",
                  isCreating ? "scale-0" : "scale-100"
                )}
              />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {isAdded ? <p>Already created</p> : <p>Create artifact</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
