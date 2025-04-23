"use client";

import { useParams } from "next/navigation";
import { Toaster } from "sonner";
import { PlateEditor } from "@/components/editor/plate-editor";
import { SettingsProvider } from "@/components/editor/settings";

export default function Page() {
  const { id } = useParams();

  return (
    <div className="h-[900px] w-[1400px] debug" data-registry="plate">
      <SettingsProvider>
        <PlateEditor projectId={id} />
      </SettingsProvider>
    </div>
  );
}
