"use client";

import { useParams } from "next/navigation";
import { Toaster } from "sonner";
import { PlateEditor } from "@/components/editor/plate-editor";
import { SettingsProvider } from "@/components/editor/settings";
import { SavedProvider } from "./save-provider";

export default function Page() {
  const { id } = useParams();

  if (id) {
    return (
      <div className="" data-registry="plate">
        <SavedProvider>
          <SettingsProvider>
            <PlateEditor projectId={id as string} />
          </SettingsProvider>
        </SavedProvider>
      </div>
    );
  }
}
