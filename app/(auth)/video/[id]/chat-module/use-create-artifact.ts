import { set } from "date-fns";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type UseCreateArtifactProps = {
  text: string;
  videoId: string;
  artifactMessage?: string;
};

export function useCreateArtifact({ text, videoId, artifactMessage = "Artifact created!" }: UseCreateArtifactProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const ARTIFACT_ENDPOINT = new URL(`api/ai/artifact`, process.env.NEXT_PUBLIC_API_URL);

  const handleCreateArtifact = async () => {
    setIsCreating(true);
    const resp = await fetch(ARTIFACT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: text, videoId: videoId }),
    });
    setIsCreating(false);
    setIsAdded(true);

    const json = await resp.json();

    console.log("Artifact response:", json);
  };

  return { isCreating, isAdded, handleCreateArtifact };
}
