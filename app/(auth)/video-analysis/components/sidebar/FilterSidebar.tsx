import { useState, useEffect } from "react";
import { Sliders, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { FixedTextarea } from "../common/FixedTextarea";
import { FilterSettings, SearchResponse } from "../../lib/types";
import { searchVideos } from "../../lib/api";

interface FilterSidebarProps {
  setIsActive: (isActive: boolean) => void;
  setFinalResult: (result: SearchResponse) => void;
}

export function FilterSidebar({ setIsActive, setFinalResult }: FilterSidebarProps) {
  const [views, setViews] = useState<number>(1000);
  const [viewsInput, setViewsInput] = useState<string>("1000");
  const [minVideoCount, setMinVideoCount] = useState<number>(5);
  const [minVideoCountInput, setMinVideoCountInput] = useState<string>("5");
  const [topic, setTopic] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setViewsInput(views.toLocaleString());
  }, [views]);

  useEffect(() => {
    setMinVideoCountInput(minVideoCount.toString());
  }, [minVideoCount]);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setIsActive(true);

      const filters: FilterSettings = {
        topic,
        minViews: views,
        minVideoCount,
      };

      const data = await searchVideos(filters);
      setFinalResult(data);
    } catch (error) {
      console.error('Search failed:', error);
      // Handle error (e.g., show toast notification)
    } finally {
      setIsActive(false);
      setIsLoading(false);
    }
  };

  const handleViewsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setViewsInput(inputValue);

    const rawValue = inputValue.replace(/,/g, "");
    const numValue = Number.parseInt(rawValue);

    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1000000) {
      setViews(numValue);
    }
  };

  const handleViewsInputBlur = () => {
    if (viewsInput.trim() === "" || isNaN(Number.parseInt(viewsInput.replace(/,/g, "")))) {
      setViewsInput(views.toLocaleString());
    }
  };

  const handleMinVideoCountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setMinVideoCountInput(inputValue);

    const numValue = Number.parseInt(inputValue);

    if (!isNaN(numValue) && numValue >= 1 && numValue <= 500) {
      setMinVideoCount(numValue);
    }
  };

  const handleMinVideoCountInputBlur = () => {
    if (minVideoCountInput.trim() === "" || isNaN(Number.parseInt(minVideoCountInput))) {
      setMinVideoCountInput(minVideoCount.toString());
    }
  };

  return (
    <div className="h-full w-full bg-background border flex flex-col shadow-lg rounded-md">
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Video Filters</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b">
          <div className="space-y-2">
            <FixedTextarea
              width="200px"
              height="100px"
              label="Video topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a video topic..."
            />
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Filter Settings
          </h3>

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="views">Views</Label>
                <div className="w-24">
                  <input
                    type="text"
                    id="views-input"
                    value={viewsInput}
                    onChange={handleViewsInputChange}
                    onBlur={handleViewsInputBlur}
                    className="w-full h-8 px-2 text-right text-sm rounded-md border border-input bg-background"
                  />
                </div>
              </div>
              <Slider
                id="views"
                min={0}
                max={1000000}
                step={10}
                value={[views]}
                onValueChange={(value) => setViews(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>1,000,000</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="min-video-count">Min Results</Label>
                <div className="w-24">
                  <input
                    type="text"
                    id="min-video-count-input"
                    value={minVideoCountInput}
                    onChange={handleMinVideoCountInputChange}
                    onBlur={handleMinVideoCountInputBlur}
                    className="w-full h-8 px-2 text-right text-sm rounded-md border border-input bg-background"
                  />
                </div>
              </div>
              <Slider
                id="min-video-count"
                min={1}
                max={500}
                step={1}
                value={[minVideoCount]}
                onValueChange={(value) => setMinVideoCount(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t p-4">
        <Button
          type="submit"
          disabled={isLoading}
          onClick={handleSearch}
          className="w-full text-center"
        >
          <div className="flex items-center justify-center">
            <Search className="h-4 w-4 mr-2" />
            Analyze
          </div>
        </Button>
      </div>
    </div>
  );
} 