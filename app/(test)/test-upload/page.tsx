import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUploadForm } from "./file-upload-form";

export default function ResponsiveLayout() {
  return (
    // SideBar Inset has m-2 (2x 0.5 rem on top and bottom). This is why we substract 1rem here to fit
    <div className="flex flex-col w-full h-[calc(100vh-1rem)]">
      {/* Green div - fixed height header */}
      <div className="w-full h-[100px] min-h-[100px] bg-green-100 border border-green-300 flex items-center justify-center">
        <span className="text-green-800 font-medium">
          Green Header (Fixed Height)
        </span>
      </div>

      {/* Red div - scrollable content area */}
      <div className="flex-1 w-full overflow-hidden border my-auto mx-auto debug ">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">File Upload</h1>
          <FileUploadForm />
        </div>
      </div>

      {/* Blue div - fixed height footer */}
      <div className="w-full h-[100px] min-h-[100px] bg-blue-100 border border-blue-300 flex items-center justify-center">
        <span className="text-blue-800 font-medium">
          Blue Footer (Fixed Height)
        </span>
      </div>
    </div>
  );
}
