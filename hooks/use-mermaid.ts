import { useEffect, useRef, useState } from "react";
import type { RenderOptions } from "beautiful-mermaid";
import {
  detectDiagramType,
  isBeautifulMermaidSupportedType,
} from "@/lib/mermaid/detectDiagramType";

interface UseMermaidReturn {
  mermaidRef: React.MutableRefObject<BeautifulMermaidModule | null>;
  isReady: boolean;
  renderDiagram: (
    code: string,
    containerId: string,
  ) => Promise<{ svg: string } | { error: string }>;
}

type BeautifulMermaidModule = {
  renderMermaid: (text: string, options?: RenderOptions) => Promise<string>;
};

const renderOptions: RenderOptions = {
  font: "DM Sans, sans-serif",
};

const unsupportedTypeError =
  "This diagram type is not supported by the current renderer yet. Supported: flowchart, state, sequence, class, ER.";

export function useMermaid(): UseMermaidReturn {
  const mermaidRef = useRef<BeautifulMermaidModule | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initMermaid = async () => {
      if (typeof window === "undefined") return;

      try {
        const beautifulMermaidModule = await import("beautiful-mermaid");

        if (isMounted) {
          mermaidRef.current = beautifulMermaidModule;
          setIsReady(true);
        }
      } catch (err) {
        console.error("Failed to initialize renderer:", err);
      }
    };

    initMermaid();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderDiagram = async (code: string, _containerId: string) => {
    if (!mermaidRef.current || !isReady) {
      return { error: "Renderer not initialized" };
    }

    const diagramType = detectDiagramType(code);
    if (
      diagramType !== "unknown" &&
      !isBeautifulMermaidSupportedType(diagramType)
    ) {
      return { error: unsupportedTypeError };
    }

    try {
      const svg = await mermaidRef.current.renderMermaid(code, renderOptions);
      return { svg };
    } catch (err: unknown) {
      if (err instanceof Error) {
        return { error: err.message };
      }

      return { error: "Rendering failed" };
    }
  };

  return {
    mermaidRef,
    isReady,
    renderDiagram,
  };
}
