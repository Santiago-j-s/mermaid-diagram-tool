"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileImage, FileCode } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { exportToPNG, exportToSVG } from "@/lib/export-utils";
import { toast } from "sonner";

interface ExportMenuProps {
  getSvgElement: () => SVGSVGElement | null;
  disabled?: boolean;
}

export function ExportMenu({ getSvgElement, disabled }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportSVG = () => {
    const svgElement = getSvgElement();
    if (!svgElement) {
      toast.error("Export failed", { description: "No diagram to export" });
      return;
    }

    try {
      exportToSVG(svgElement);
      toast.success("Downloaded!", { description: "Diagram saved as SVG file" });
    } catch (err) {
      toast.error("Export failed", { description: "Could not download SVG file" });
    }
  };

  const handleExportPNG = async () => {
    const svgElement = getSvgElement();
    if (!svgElement) {
      toast.error("Export failed", { description: "No diagram to export" });
      return;
    }

    setIsExporting(true);
    try {
      await exportToPNG(svgElement);
      toast.success("Downloaded!", { description: "Diagram saved as PNG file" });
    } catch (err) {
      toast.error("Export failed", { description: "Could not download PNG file" });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ButtonGroup>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportSVG}
        disabled={disabled || isExporting}
        className="gap-2 theme-transition"
      >
        <FileCode className="w-4 h-4" />
        SVG
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExportPNG}
        disabled={disabled || isExporting}
        className="gap-2 theme-transition"
      >
        <FileImage className="w-4 h-4" />
        PNG
      </Button>
    </ButtonGroup>
  );
}

