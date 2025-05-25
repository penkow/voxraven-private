import { ScrollArea } from "@/components/ui/scroll-area";

export default function ResponsiveLayout() {
  return (
    // SideBar Inset has m-2 (2x 0.5 rem on top and bottom). This is why we substract 1rem here to fit
    <div className="flex flex-col w-full h-[calc(100vh-1rem)] debug">
      {/* Green div - fixed height header */}
      <div className="w-full h-[100px] min-h-[100px] bg-green-100 border border-green-300 flex items-center justify-center">
        <span className="text-green-800 font-medium">
          Green Header (Fixed Height)
        </span>
      </div>

      {/* Red div - scrollable content area */}
      <div className="flex-1 w-full overflow-hidden border border-red-300 bg-red-100">
        <ScrollArea className="h-full w-full">
          <div className="p-4">
            <h2 className="text-red-800 font-medium mb-4">
              Red Scrollable Content Area
            </h2>
            <div className="space-y-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 bg-red-50 border border-red-200 rounded"
                >
                  Content Item {i + 1}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
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
