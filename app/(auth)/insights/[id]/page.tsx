"use client";

import { useEffect, useState } from "react";
import { Content } from "@tiptap/react";
import { MinimalTiptapEditor } from "../minimal-tiptap";
import { useParams } from "next/navigation";

import {
  Project,
  Video,
  VideoInsights,
  Synthesis,
} from "../../../../../voxraven-server-private/node_modules/@prisma/client";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [value, setValue] = useState<Content>("## Test");

  const { id } = useParams();

  useEffect(() => {
    const fetchProject = async () => {
      const synthesisResponse = await fetch(
        `http://localhost:3000/api/projects/${id}/synthesis`
      );
      const synthesis: Synthesis = await synthesisResponse.json();
      console.log(synthesis);
      setValue(synthesis.synthesis);
    };
    fetchProject();
  }, []);

  return (
    <>
      <MinimalTiptapEditor
        value={value}
        onChange={setValue}
        className="w-full"
        editorContentClassName="p-5"
        output="html"
        placeholder="Enter your description..."
        autofocus={true}
        editable={true}
        editorClassName="focus:outline-hidden"
      />
    </>
  );
}
