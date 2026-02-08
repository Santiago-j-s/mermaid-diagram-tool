"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { TextEditor } from "@/components/text-editor";
import { ReferencePanel } from "@/components/reference-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { DiagramPreview } from "@/components/diagram-preview";
import { ExportMenu } from "@/components/export-menu";
import { AutoSaveIndicator } from "@/components/auto-save-indicator";
import { ResizablePanels } from "@/components/resizable-panels";
import { defaultDiagram, exampleDiagrams } from "@/lib/mermaid/examples";
import { getFriendlyErrorMessage } from "@/lib/mermaid/getFriendlyErrorMessage";
import { getAISuggestion } from "@/lib/mermaid/getAISuggestion";
import {
  detectDiagramType,
  isBeautifulMermaidSupportedType,
} from "@/lib/mermaid/detectDiagramType";
import { useMermaid } from "@/hooks/use-mermaid";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarInset,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import Image from "next/image";

export default function MermaidEditor() {
  const [isMounted, setIsMounted] = useState(false);
  const [code, setCode] = useLocalStorage({
    storageKey: "mermaid-diagram-code",
    defaultValue: defaultDiagram,
  });
  const [svgContent, setSvgContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const renderTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const { isReady, renderDiagram } = useMermaid();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  function getErrorPreviewHtml(
    friendlyError: ReturnType<typeof getFriendlyErrorMessage>,
    aiSuggestion?: string,
  ) {
    const lineNumberDisplay = friendlyError.lineNumber
      ? `Line ${friendlyError.lineNumber}: `
      : "";

    const aiSuggestionHtml = aiSuggestion
      ? `<p class="text-xs text-gray-700 dark:text-gray-300 mt-2">${aiSuggestion}</p>`
      : "";

    return `
      <div class="flex items-center justify-center h-full">
        <div class="text-center max-w-md p-6">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <div class="space-y-2">
            <p class="text-sm text-red-600 dark:text-red-400 font-medium">${lineNumberDisplay}${friendlyError.message}</p>
            <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div class="flex items-start gap-2">
                <div class="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                    <path d="M4 0l4 4-4 4z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">Quick Fix:</p>
                  <p class="text-sm text-blue-700 dark:text-blue-400">${friendlyError.suggestion}</p>
                </div>
              </div>
            </div>
          </div>
          ${aiSuggestionHtml}
        </div>
      </div>
    `;
  }

  useEffect(() => {
    if (!isReady) return;

    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    renderTimeoutRef.current = setTimeout(() => {
      void (async () => {
        setError(null);

        const containerId = `mermaid-${Date.now()}`;
        const result = await renderDiagram(code, containerId);

        if ("error" in result) {
          const diagramType = detectDiagramType(code);
          const friendlyError = getFriendlyErrorMessage(
            result.error,
            diagramType,
          );
          setError(friendlyError.message);
          setSvgContent(
            getErrorPreviewHtml(
              friendlyError,
              "Getting AI-powered suggestion...",
            ),
          );

          const aiSuggestion = await getAISuggestion(
            result.error,
            code,
            diagramType,
            friendlyError.lineNumber,
          );

          if (aiSuggestion) {
            setSvgContent(getErrorPreviewHtml(friendlyError, aiSuggestion));
          }

          return;
        }

        setSvgContent(result.svg);
        setLastSaved(new Date());
      })();
    }, 500);

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [code, isReady, renderDiagram]);

  function getSvgElement() {
    return previewRef.current?.querySelector("svg") || null;
  }

  function loadExample(example: (typeof exampleDiagrams)[0]) {
    setCode(example.code);
    toast.success("Example loaded", {
      description: `${example.name} diagram loaded`,
    });
  }

  function isTemplateSupported(templateCode: string) {
    const diagramType = detectDiagramType(templateCode);
    return (
      diagramType !== "unknown" && isBeautifulMermaidSupportedType(diagramType)
    );
  }

  const supportedExampleDiagrams = exampleDiagrams.filter((example) =>
    isTemplateSupported(example.code),
  );

  function loadReferenceExample(example: string) {
    setCode(example);
    toast.success("Example loaded", {
      description: "Reference example loaded into editor",
    });
  }

  if (!isMounted || !isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="p-3 bg-accent/10 rounded-lg mb-3 inline-block">
            <div className="w-6 h-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">
            Preparing editor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex flex-col w-full theme-transition">
        <SidebarInset>
          {!isFullscreen && (
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 theme-transition">
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
                    <AutoSaveIndicator lastSaved={lastSaved} />
                    <ThemeToggle />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSidebarOpen(!sidebarOpen)}
                      className="gap-2 theme-transition"
                    >
                      <BookOpen className="w-4 h-4" />
                      Cheatsheet
                    </Button>
                  </div>
                </div>
              </div>
            </header>
          )}

          <main className="flex-1 flex flex-col">
            <div
              className={`container mx-auto ${isFullscreen ? "px-0 py-0 max-w-none h-screen" : "px-6 py-8"} flex-1 flex flex-col gap-8`}
            >
              {!isFullscreen && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        Not sure where to start?
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Get started with these diagram templates
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {supportedExampleDiagrams.map((example) => (
                      <Button
                        key={example.name}
                        variant="outline"
                        size="sm"
                        onClick={() => loadExample(example)}
                        className="theme-transition"
                      >
                        {example.name}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <ExportMenu
                      getSvgElement={getSvgElement}
                      disabled={!!error}
                    />
                  </div>
                </div>
              )}

              <div
                className={`flex-1 flex flex-col ${isFullscreen ? "h-full" : ""}`}
                style={!isFullscreen ? { minHeight: "600px" } : {}}
              >
                <ResizablePanels
                  leftPanel={<TextEditor value={code} onChange={setCode} />}
                  rightPanel={
                    <div ref={previewRef}>
                      <DiagramPreview
                        svgContent={svgContent}
                        isLoading={!isReady}
                        error={error}
                        onFullscreen={() => setIsFullscreen((prev) => !prev)}
                      />
                    </div>
                  }
                  defaultLeftWidth={50}
                  minWidth={30}
                  maxWidth={70}
                />
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>

      {!isFullscreen && (
        <Sidebar side="right" collapsible="offcanvas">
          <SidebarContent>
            <ReferencePanel onLoadExample={loadReferenceExample} />
          </SidebarContent>
        </Sidebar>
      )}
    </SidebarProvider>
  );
}
