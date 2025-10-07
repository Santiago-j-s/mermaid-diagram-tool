"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultLeftWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
}

export function ResizablePanels({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 50,
  minWidth = 30,
  maxWidth = 70,
  className,
}: ResizablePanelsProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

      setLeftWidth(Math.min(Math.max(newLeftWidth, minWidth), maxWidth));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  return (
    <div
      ref={containerRef}
      className={cn("flex gap-2 w-full h-full", className)}
      style={{ userSelect: isResizing ? "none" : "auto" }}
    >
      <div style={{ width: `${leftWidth}%` }} className="flex-shrink-0">
        {leftPanel}
      </div>

      <div
        className={cn(
          "w-1 bg-border hover:bg-accent cursor-col-resize transition-colors flex-shrink-0 relative group",
          isResizing && "bg-accent"
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute inset-y-0 -inset-x-2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-8 bg-muted-foreground rounded-full" />
            <div className="w-0.5 h-8 bg-muted-foreground rounded-full" />
          </div>
        </div>
      </div>

      <div className="flex-1 min-w-0">{rightPanel}</div>
    </div>
  );
}

