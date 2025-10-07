"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import { referenceData } from "@/lib/mermaid/examples";
import { toast } from "sonner";

interface ReferencePanelProps {
  onLoadExample: (code: string) => void;
}

export function ReferencePanel({ onLoadExample }: ReferencePanelProps) {
  const [selectedReference, setSelectedReference] =
    useState<keyof typeof referenceData>("flowchart");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const loadReferenceExample = (example: string) => {
    onLoadExample(example);
    toast.success("Example loaded", {
      description: "Reference example loaded into editor",
    });
  };

  return (
    <div className="flex flex-col h-full theme-transition">
      <div className="flex items-center gap-3 p-4 border-b border-border/50 theme-transition">
        <div className="p-1.5 bg-accent/10 rounded-md">
          <BookOpen className="w-4 h-4 text-accent" />
        </div>
        <span className="font-semibold text-sm text-foreground">
          Reference Guide
        </span>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-4 border-b border-border/30">
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(referenceData).map(([key, data]) => (
              <Button
                key={key}
                variant={selectedReference === key ? "default" : "ghost"}
                size="sm"
                onClick={() =>
                  setSelectedReference(key as keyof typeof referenceData)
                }
                className="text-xs justify-start h-8 theme-transition"
              >
                {data.title.split(" ")[0]}
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-1">
              {referenceData[selectedReference].title}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              {referenceData[selectedReference].description}
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
              Syntax
            </h4>
            {referenceData[selectedReference].syntax.map((item, index) => (
              <div key={index}>
                <button
                  onClick={() => toggleSection(`${selectedReference}-${index}`)}
                  className="flex items-center gap-2 w-full text-left p-2 hover:bg-accent/80 hover:text-accent-foreground dark:hover:bg-accent/60 rounded-md theme-transition text-foreground"
                >
                  {expandedSections[`${selectedReference}-${index}`] ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                  <span className="font-medium text-xs">{item.label}</span>
                </button>
                {expandedSections[`${selectedReference}-${index}`] && (
                  <div className="ml-5 pb-2">
                    <pre className="bg-muted p-2 rounded text-xs font-mono mb-2 overflow-x-auto theme-transition">
                      <code>{item.code}</code>
                    </pre>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wide">
                Example
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  loadReferenceExample(referenceData[selectedReference].example)
                }
                className="text-xs h-6 px-2 theme-transition"
              >
                Load
              </Button>
            </div>
            <pre className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto theme-transition">
              <code>{referenceData[selectedReference].example}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
