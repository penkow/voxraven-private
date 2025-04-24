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

import { toast } from "sonner";

import { MarkdownPlugin, remarkMdx } from "@udecode/plate-markdown";

import { Synthesis } from "../../../voxraven-server-private/node_modules/@prisma/client";
import { useDebounce } from "./use-debounce";

interface PlateEditorProps {
  projectId: string;
}

export function PlateEditor({ projectId }: PlateEditorProps) {
  const [markdownValue, setMarkdownValue] = useState("");
  const debouncedMarkdownValue = useDebounce(markdownValue, 500);

  const editor = useCreateEditor();

  useEffect(() => {
    const updateSynthesis = async () => {
      try {
        await fetch(`http://localhost:3000/api/synthesis/${projectId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            synthesis: debouncedMarkdownValue,
          }),
        });
        toast.success("Success", {
          description: "Changes saved remotely.",
        });
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
      const synthesisResponse = await fetch(
        `http://localhost:3000/api/projects/${projectId}/synthesis`
      );
      const synthesis: Synthesis = await synthesisResponse.json();
      const data = editor
        .getApi(MarkdownPlugin)
        .markdown.deserialize(synthesis.synthesis, {
          remarkPlugins: [remarkMath, remarkGfm, remarkMdx, remarkEmoji as any],
        });

      editor.tf.setValue(data);
    };
    fetchProject();
  }, [projectId]);

  // useEffect(() => {
  //   const data = editor
  //     .getApi(MarkdownPlugin)
  //     .markdown.deserialize(markdownDemo, {
  //       remarkPlugins: [remarkMath, remarkGfm, remarkMdx, remarkEmoji as any],
  //     });

  //   editor.tf.setValue(data);
  // });

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        onChange={(e) => {
          setMarkdownValue(editor.getApi(MarkdownPlugin).markdown.serialize({value: e.value}));
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
