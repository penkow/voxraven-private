"use client";

import React, { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { Plate } from "@udecode/plate/react";

import { useCreateEditor } from "@/components/editor/use-create-editor";
import { SettingsDialog } from "@/components/editor/settings";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { MarkdownPlugin, remarkMdx } from "@udecode/plate-markdown";

import { Synthesis } from "@prisma/client";
import { useDebounce } from "./use-debounce";
import { useSaved } from "@/app/(auth)/insights/[id]/save-provider";

interface PlateEditorProps {
  projectId: string;
}

export function PlateEditor({ projectId }: PlateEditorProps) {
  const [markdownValue, setMarkdownValue] = useState("");
  const debouncedMarkdownValue = useDebounce(markdownValue, 500);
  const { setIsSaved } = useSaved();
  const [isFetched, setIsFetched] = useState(false);

  const SYNTHESIS_ENDPOINT = new URL(
    `api/synthesis/${projectId}`,
    process.env.NEXT_PUBLIC_API_URL
  );

  const editor = useCreateEditor();

  useEffect(() => {
    setIsSaved(false);
  }, [markdownValue]);

  useEffect(() => {
    const updateSynthesis = async () => {
      try {
        const response = await fetch(SYNTHESIS_ENDPOINT, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            synthesis: debouncedMarkdownValue,
          }),
        });
        console.log(response.status);
        setIsSaved(true);
      } catch (error) {
        console.error("Failed to update synthesis:", error);
      }
    };

    if (debouncedMarkdownValue) {
      updateSynthesis();
    }
  }, [debouncedMarkdownValue, projectId]);

  useEffect(() => {
    const fetchProject = async () => {
      const synthesisResponse = await fetch(SYNTHESIS_ENDPOINT, {
        credentials: "include",
      });
      const synthesis: Synthesis = await synthesisResponse.json();

      const data = editor
        .getApi(MarkdownPlugin)
        .markdown.deserialize(synthesis.synthesis, {
          remarkPlugins: [remarkMath, remarkGfm, remarkMdx, remarkEmoji as any],
        });

      editor.tf.setValue(data);
      setIsFetched(true);
    };
    fetchProject();
  }, [projectId]);

  if (!isFetched) {
    return <div>Loading...</div>; 
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        onChange={(e) => {
          setMarkdownValue(
            editor.getApi(MarkdownPlugin).markdown.serialize({ value: e.value })
          );
        }}
      >
        <EditorContainer>
          <Editor variant="fullWidth" />
        </EditorContainer>

        <SettingsDialog />
      </Plate>
    </DndProvider>
  );
}
