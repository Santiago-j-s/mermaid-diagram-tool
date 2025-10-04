"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Eye, Code, Zap, BookOpen } from "lucide-react";
import { TextEditor } from "@/components/text-editor";
import { ReferencePanel } from "@/components/reference-panel";
import { defaultDiagram, exampleDiagrams } from "@/lib/mermaid/examples";
import { getFriendlyErrorMessage } from "@/lib/mermaid/getFriendlyErrorMessage";
import { getAISuggestion } from "../lib/mermaid/getAISuggestion";
import { detectDiagramType } from "../lib/mermaid/detectDiagramType";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import Image from "next/image";

export default function MermaidEditor() {
  const [code, setCode] = useState(defaultDiagram);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [documentReady, setDocumentReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const mermaidRef = useRef<any>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const checkDocumentReady = () => {
      const isReady =
        typeof window !== "undefined" &&
        typeof document !== "undefined" &&
        document.head !== null &&
        document.body !== null &&
        document.readyState === "complete";

      console.log("[v0] Document readiness check:", {
        window: typeof window !== "undefined",
        document: typeof document !== "undefined",
        head: document?.head !== null,
        body: document?.body !== null,
        readyState: document?.readyState,
      });

      return isReady;
    };

    if (checkDocumentReady()) {
      setDocumentReady(true);
      return;
    }

    const handleLoad = () => {
      console.log("[v0] Window load event");
      if (checkDocumentReady()) {
        setDocumentReady(true);
      }
    };

    const handleDOMContentLoaded = () => {
      console.log("[v0] DOMContentLoaded event");
      if (checkDocumentReady()) {
        setDocumentReady(true);
      }
    };

    const handleReadyStateChange = () => {
      console.log("[v0] ReadyState changed to:", document.readyState);
      if (checkDocumentReady()) {
        setDocumentReady(true);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("load", handleLoad);
      document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
      document.addEventListener("readystatechange", handleReadyStateChange);
    }

    // Polling fallback
    const pollInterval = setInterval(() => {
      if (checkDocumentReady()) {
        setDocumentReady(true);
        clearInterval(pollInterval);
      }
    }, 100);

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("load", handleLoad);
        document.removeEventListener(
          "DOMContentLoaded",
          handleDOMContentLoaded,
        );
        document.removeEventListener(
          "readystatechange",
          handleReadyStateChange,
        );
      }
      clearInterval(pollInterval);
    };
  }, []);

  useEffect(() => {
    if (!documentReady) {
      console.log("[v0] Waiting for document to be ready...");
      return;
    }

    const initMermaid = async () => {
      try {
        console.log("[v0] Starting Mermaid initialization with document ready");

        // Additional safety check
        if (!document.head || !document.body) {
          console.warn(
            "[v0] Document head or body still not available, retrying...",
          );
          initTimeoutRef.current = setTimeout(initMermaid, 500);
          return;
        }

        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        console.log("[v0] Mermaid module loaded, initializing...");

        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "DM Sans, sans-serif",
          suppressErrorRendering: true,
          logLevel: "error",
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
          },
        });

        console.log("[v0] Mermaid initialized successfully");
        mermaidRef.current = mermaid;
        setIsLoading(false);

        // Small delay before first render
        setTimeout(() => {
          renderDiagram();
        }, 200);
      } catch (err) {
        console.error("[v0] Failed to load mermaid:", err);
        setError("Failed to load diagram renderer");
        setIsLoading(false);
      }
    };

    // Additional delay to ensure everything is stable
    initTimeoutRef.current = setTimeout(initMermaid, 2000);

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, [documentReady]);

  useEffect(() => {
    if (!isLoading && mermaidRef.current && documentReady) {
      const timeoutId = setTimeout(() => {
        renderDiagram();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [code, isLoading, documentReady]);

  const renderDiagram = async () => {
    if (!previewRef.current || !mermaidRef.current || !documentReady) {
      console.log("[v0] Skipping render - not ready:", {
        preview: !!previewRef.current,
        mermaid: !!mermaidRef.current,
        documentReady,
      });
      return;
    }

    try {
      console.log("[v0] Starting diagram render");
      setError(null);
      setAiSuggestion(null);

      previewRef.current.innerHTML = "";

      // Safe cleanup
      try {
        if (document.querySelectorAll) {
          const existingErrors = document.querySelectorAll(
            '[id^="mermaid-"], .mermaid-error, .error, [class*="error"]',
          );
          existingErrors.forEach((el) => {
            if (
              el &&
              el.textContent &&
              (el.textContent.includes("Syntax error in text") ||
                el.textContent.includes("mermaid version"))
            ) {
              try {
                el.remove();
              } catch (e) {
                // Ignore removal errors
              }
            }
          });
        }
      } catch (e) {
        console.warn("[v0] Error during cleanup:", e);
      }

      const id = `mermaid-${Date.now()}`;
      console.log("[v0] Rendering with ID:", id);

      const { svg } = await mermaidRef.current.render(id, code);
      previewRef.current.innerHTML = svg;
      console.log("[v0] Diagram rendered successfully");

      // Post-render cleanup
      setTimeout(() => {
        try {
          if (document.querySelectorAll) {
            const errorSelectors = [
              '[class*="error"]',
              '[id*="mermaid-error"]',
            ];

            errorSelectors.forEach((selector) => {
              try {
                const elements = document.querySelectorAll(selector);
                elements.forEach((el) => {
                  if (
                    el &&
                    el.nodeType === Node.ELEMENT_NODE &&
                    el.textContent
                  ) {
                    if (
                      el.textContent.includes(
                        "Syntax error in text mermaid version",
                      ) ||
                      el.textContent.includes("mermaid version")
                    ) {
                      try {
                        el.remove();
                      } catch (e) {
                        // Ignore removal errors
                      }
                    }
                  }
                });
              } catch (e) {
                // Ignore selector errors
              }
            });
          }
        } catch (e) {
          console.warn("[v0] Error during post-render cleanup:", e);
        }
      }, 100);
    } catch (err: any) {
      console.error("[v0] Mermaid render error:", err);

      const diagramType = detectDiagramType(code);
      const friendlyError = getFriendlyErrorMessage(
        err.message || "Unknown error",
        diagramType,
      );
      setError(friendlyError.message);

      setIsLoadingSuggestion(true);
      getAISuggestion(
        err.message || "Unknown error",
        code,
        diagramType,
        friendlyError.lineNumber,
      ).then((suggestion) => {
        setAiSuggestion(suggestion);
        setIsLoadingSuggestion(false);
      });

      const lineNumberDisplay = friendlyError.lineNumber
        ? `Line ${friendlyError.lineNumber}: `
        : "";

      previewRef.current.innerHTML = `
        <div class="flex items-center justify-center h-full">
          <div class="text-center max-w-md p-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="space-y-2">
              <p class="text-sm text-red-600 font-medium">${lineNumberDisplay}${
                friendlyError.message
              }</p>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div class="flex items-start gap-2">
                  <div class="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                      <path d="M4 0l4 4-4 4z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-blue-800 mb-1">💡 Quick Fix:</p>
                    <p class="text-sm text-blue-700">${
                      friendlyError.suggestion
                    }</p>
                  </div>
                </div>
              </div>
            </div>
            ${
              isLoadingSuggestion
                ? '<p class="text-xs text-gray-500">Getting AI-powered suggestion...</p>'
                : aiSuggestion
            }
          </div>
        </div>
      `;
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Copied!", {
        description: "Diagram code copied to clipboard",
      });
    } catch (err) {
      toast.error("Failed to copy", {
        description: "Could not copy to clipboard",
      });
    }
  };

  const downloadSVG = () => {
    if (!documentReady) return;

    const svgElement = previewRef.current?.querySelector("svg");
    if (!svgElement) return;

    try {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = "diagram.svg";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);

      toast.success("Downloaded!", {
        description: "Diagram saved as SVG file",
      });
    } catch (err) {
      console.error("[v0] Download error:", err);
      toast.error("Download failed", {
        description: "Could not download SVG file",
      });
    }
  };

  const loadExample = (example: (typeof exampleDiagrams)[0]) => {
    setCode(example.code);
    toast.success("Example loaded", {
      description: `${example.name} diagram loaded`,
    });
  };

  const loadReferenceExample = (example: string) => {
    setCode(example);
    toast.success("Example loaded", {
      description: "Reference example loaded into editor",
    });
  };

  if (!documentReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="p-3 bg-accent/10 rounded-lg mb-3 inline-block">
            <Zap className="w-6 h-6 animate-pulse text-accent" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Preparing editor...
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Ensuring document is ready
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col w-full">
        <SidebarInset>
          <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/logo.svg"
                      alt="Mermaid Wave"
                      width={50}
                      height={50}
                    />

                    <div>
                      <h1 className="text-xl font-semibold text-foreground tracking-tight">
                        Mermaid Wave
                      </h1>
                      <p className="text-sm text-muted-foreground">
                        Live Mermaid editor with AI suggestions and syntax
                        validation
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="gap-2 bg-muted/20 hover:bg-slate-600 hover:text-white border-border text-foreground"
                  >
                    <BookOpen className="w-4 h-4" />
                    Cheatsheet
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 flex flex-col">
            <div className="container mx-auto px-6 py-8 flex-1 flex flex-col gap-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Not sure where to start?{" "}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Get started with these diagram templates
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {exampleDiagrams.map((example) => (
                    <Button
                      key={example.name}
                      variant="outline"
                      size="sm"
                      onClick={() => loadExample(example)}
                      className="text-sm font-medium bg-muted/20 hover:bg-slate-600 hover:text-white border-border text-foreground transition-all duration-200"
                    >
                      {example.name}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="gap-2 bg-muted/20 hover:bg-slate-600 hover:text-white border-border text-foreground"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadSVG}
                    disabled={!!error}
                    className="gap-2 bg-muted/20 hover:bg-slate-600 hover:text-white border-border text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    Download SVG
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-8">
                <div className="grid gap-8 flex-1 lg:grid-cols-2">
                  <TextEditor value={code} onChange={setCode} />
                  <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200/60 bg-slate-50/50">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">
                          Preview
                        </span>
                      </div>
                      {error && (
                        <Badge
                          variant="destructive"
                          className="text-xs ml-auto font-medium"
                        >
                          Error
                        </Badge>
                      )}
                    </div>
                    <div className="flex-1 p-6 overflow-auto bg-background">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="p-3 bg-accent/10 rounded-lg mb-3 inline-block">
                              <Zap className="w-6 h-6 animate-pulse text-accent" />
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">
                              Loading renderer...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div
                          ref={previewRef}
                          className="w-full h-full flex items-center justify-center"
                          style={{ minHeight: "400px" }}
                        />
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>

      <Sidebar side="right" collapsible="offcanvas">
        <SidebarContent>
          <ReferencePanel onLoadExample={loadReferenceExample} />
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
