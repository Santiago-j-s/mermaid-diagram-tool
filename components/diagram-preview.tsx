"use client";

import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";

interface DiagramPreviewProps {
  svgContent: string;
  isLoading: boolean;
  error: string | null;
  onFullscreen?: () => void;
}

export function DiagramPreview({
  svgContent,
  isLoading,
  error,
  onFullscreen,
}: DiagramPreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg theme-transition flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-muted/50 theme-transition">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-foreground/70" />
          <span className="text-sm font-medium text-foreground">Preview</span>
        </div>
        <div className="flex items-center gap-2">
          {!error && !isLoading && (
            <ButtonGroup>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </ButtonGroup>
          )}
          {onFullscreen && (
            <Button variant="outline" size="sm" onClick={onFullscreen}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
          {error && (
            <Badge
              variant="destructive"
              className="text-xs ml-auto font-medium"
            >
              Error
            </Badge>
          )}
        </div>
      </div>
      <div
        ref={containerRef}
        className="flex-1 p-6 overflow-hidden bg-background theme-transition relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="p-3 bg-accent/10 rounded-lg mb-3 inline-block">
                <div className="w-6 h-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Loading renderer...
              </p>
            </div>
          </div>
        ) : (
          <div
            data-diagram-content
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
              transition: isDragging ? "none" : "transform 0.2s ease-out",
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>
      {!error && !isLoading && (
        <div className="px-3 py-1 border-t border-border/60 bg-muted/30 text-xs text-muted-foreground text-center">
          {Math.round(zoom * 100)}% • Drag to pan
        </div>
      )}
    </Card>
  );
}
