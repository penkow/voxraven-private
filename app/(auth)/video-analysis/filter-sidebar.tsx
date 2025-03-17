"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Sliders, Home, Search, Users, Settings } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FixedTextarea } from "./fixed-textarea";

export function FilterSidebar({
  setIsActive,
  setFinalResult,
}: {
  setIsActive: (isActive: boolean) => void;
  setFinalResult: (finalResult: any) => void;
}) {
  const [views, setViews] = useState<number>(1000);
  const [viewsInput, setViewsInput] = useState<string>("1000");

  const [minVideoCount, setminVideoCount] = useState<number>(5);
  const [minVideoCountInput, setminVideoCountInput] = useState<string>("5");

  const [topic, setTopic] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    setIsLoading(true);
    setIsActive(true);
    console.log("topic", topic);

    // fetch post localhost:8001/search
    const response = await fetch("http://localhost:8001/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: topic,
        min_views: views,
        min_results: minVideoCount,
      }),
    });
    const data = await response.json();
    console.log("data", data);

    setFinalResult(data);
    setIsActive(false);

    setIsLoading(false);
  };

  // Update input fields when slider values change
  useEffect(() => {
    setViewsInput(views.toLocaleString());
  }, [views]);

  useEffect(() => {
    setminVideoCountInput(minVideoCount.toString());
  }, [minVideoCount]);

  const handleViewsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setViewsInput(inputValue);

    // Only update the actual value if the input is valid
    if (inputValue.trim() === "") return;

    const rawValue = inputValue.replace(/,/g, "");
    const numValue = Number.parseInt(rawValue);

    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1000000) {
      setViews(numValue);
    }
  };

  const handleViewsInputBlur = () => {
    // On blur, reset to the last valid value if empty or invalid
    if (
      viewsInput.trim() === "" ||
      isNaN(Number.parseInt(viewsInput.replace(/,/g, "")))
    ) {
      setViewsInput(views.toLocaleString());
    }
  };

  const handleminVideoCountInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = e.target.value;
    setminVideoCountInput(inputValue);

    // Only update the actual value if the input is valid
    if (inputValue.trim() === "") return;

    const numValue = Number.parseInt(inputValue);

    if (!isNaN(numValue) && numValue >= 1 && numValue <= 500) {
      setminVideoCount(numValue);
    }
  };

  const handleminVideoCountInputBlur = () => {
    // On blur, reset to the last valid value if empty or invalid
    if (
      minVideoCountInput.trim() === "" ||
      isNaN(Number.parseInt(minVideoCountInput))
    ) {
      setminVideoCountInput(minVideoCount.toString());
    }
  };

  return (
    <div className="h-full w-full bg-background border flex flex-col shadow-lg rounded-md">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Video Filters</h2>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Navigation Section */}
        <div className="p-4 border-b">
          <div className="space-y-2 ">
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

        {/* Filter Settings Section */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Filter Settings
          </h3>

          <div className="space-y-6">
            {/* Views Slider */}
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

            {/* Max Videos Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="max-video-count">Min Results</Label>
                <div className="w-24">
                  <input
                    type="text"
                    id="max-video-count-input"
                    value={minVideoCountInput}
                    onChange={handleminVideoCountInputChange}
                    onBlur={handleminVideoCountInputBlur}
                    className="w-full h-8 px-2 text-right text-sm rounded-md border border-input bg-background"
                  />
                </div>
              </div>
              <Slider
                id="max-video-count"
                min={1}
                max={500}
                step={1}
                value={[minVideoCount]}
                onValueChange={(value) => setminVideoCount(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>500</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
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
