import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type UseCreateArtifactProps = {
  text: string;
  artifactMessage?: string;
};

export function useCreateArtifact({
  text,
  artifactMessage = "Artifact created!",
}: UseCreateArtifactProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCreateArtifact = useCallback(() => {
    console.log(isAdded)
    if (!isAdded) {
      setIsCreating(true);
      toast.success(artifactMessage);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      timeoutRef.current = setTimeout(() => {
        setIsCreating(false);
        setIsAdded(true);
      }, 2000);
    } else {
      toast.info("Artifact already added");
    }
  }, [text, artifactMessage]);

  return { isCreating, isAdded, handleCreateArtifact };
}
