"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Step {
  step: string;
  status: "generated" | "generating";
}

interface ToolCardProps {
  title: string;
  steps: Step[];
  onView?: () => void;
  className?: string;
  finished?: boolean;
}

export function ToolCard({ title, steps, onView, className, finished }: ToolCardProps) {
  return (
    <div
      className={cn(
        "w-full py-2 px-4 rounded-xl border border-zinc-200 bg-white",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        </div>
        {/* {finished && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onView}
            className="h-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 font-normal"
          >
            View
          </Button>
        )} */}
      </div>

      <div className="relative space-y-3">
        {/* Vertical line connecting dots */}
        {/* <div className="absolute left-[4.5px] top-2 bottom-3 w-[1px] bg-zinc-200" /> */}

        {steps.map((step) => (
          <div key={step.step} className="flex items-center gap-4">
            <div className="relative z-10 flex items-center">
              <div
                className={cn(
                  "h-2 w-2 rounded-full",
                  step.status === "generating"
                    ? "bg-sky-600"
                    : "bg-emerald-500"
                )}
              />
              {step.status === "generating" && (
                <div className="absolute inset-0 h-2 w-2">
                  <div className="absolute inset-0 rounded-full bg-sky-500 animate-ping opacity-75" />
                </div>
              )}
            </div>
            <span className="text-xs text-zinc-500 flex-1">{step.step}</span>
            <span className="text-xs text-zinc-600">
              {step.status === "generating" ? "Generating" : "Finished"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
