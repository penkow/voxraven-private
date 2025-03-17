"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface FixedTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  width?: string;
  height?: string;
  label?: string;
}

const FixedTextarea = React.forwardRef<HTMLTextAreaElement, FixedTextareaProps>(
  ({ className, width = "400px", height = "200px", label, ...props }, ref) => {
    const id = React.useId();

    return (
      <div className="grid w-full gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <Textarea
          id={id}
          className={cn("resize-none", className)}
          ref={ref}
          style={{
            width,
            height,
            minWidth: width,
            minHeight: height,
            maxWidth: width,
            maxHeight: height,
          }}
          {...props}
        />
      </div>
    );
  }
);
FixedTextarea.displayName = "FixedTextarea";

export { FixedTextarea };
