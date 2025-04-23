import { PlateEditor } from "@/components/editor/plate-editor";
import { SettingsProvider } from "@/components/editor/settings";

export default function Page() {


  return (
    <div className="h-[900px] w-[1400px] debug" data-registry="plate">
      <SettingsProvider>
        <PlateEditor projectId="e74dfd4d-36cc-46eb-bf9f-6f1bbb5554d7" />
      </SettingsProvider>
    </div>
  );
}
