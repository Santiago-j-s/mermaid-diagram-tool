import { useEffect, useRef, useState } from "react";
import type { MermaidConfig } from "mermaid";

interface UseMermaidReturn {
  mermaidRef: React.MutableRefObject<any>;
  isReady: boolean;
  renderDiagram: (code: string, containerId: string) => Promise<{ svg: string } | { error: string }>;
}

const mermaidConfig: MermaidConfig = {
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
};

export function useMermaid(): UseMermaidReturn {
  const mermaidRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initMermaid = async () => {
      if (typeof window === "undefined") return;

      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;
        
        mermaid.initialize(mermaidConfig);
        
        if (isMounted) {
          mermaidRef.current = mermaid;
          setIsReady(true);
        }
      } catch (err) {
        console.error("Failed to initialize Mermaid:", err);
      }
    };

    initMermaid();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderDiagram = async (code: string, containerId: string) => {
    if (!mermaidRef.current || !isReady) {
      return { error: "Mermaid not initialized" };
    }

    try {
      const { svg } = await mermaidRef.current.render(containerId, code);
      return { svg };
    } catch (err: any) {
      return { error: err.message || "Rendering failed" };
    }
  };

  return {
    mermaidRef,
    isReady,
    renderDiagram,
  };
}

