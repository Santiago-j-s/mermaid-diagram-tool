"use client";

export type SupportedDiagramType =
  | "flowchart"
  | "sequence"
  | "state"
  | "class"
  | "er";

export type UnsupportedDiagramType = "journey" | "gantt" | "pie";

export type DiagramType =
  | SupportedDiagramType
  | UnsupportedDiagramType
  | "unknown";

const BEAUTIFUL_MERMAID_SUPPORTED_TYPES: ReadonlySet<SupportedDiagramType> =
  new Set(["flowchart", "sequence", "state", "class", "er"]);

export const isBeautifulMermaidSupportedType = (
  type: DiagramType,
): type is SupportedDiagramType => {
  return BEAUTIFUL_MERMAID_SUPPORTED_TYPES.has(type as SupportedDiagramType);
};

export const detectDiagramType = (code: string): DiagramType => {
  const trimmedCode = code.trim().toLowerCase();

  if (trimmedCode.startsWith("sequencediagram")) return "sequence";
  if (trimmedCode.startsWith("journey")) return "journey";
  if (trimmedCode.startsWith("classdiagram")) return "class";
  if (trimmedCode.startsWith("erdiagram")) return "er";
  if (trimmedCode.startsWith("statediagram")) return "state";
  if (trimmedCode.startsWith("gantt")) return "gantt";
  if (trimmedCode.startsWith("pie")) return "pie";
  if (trimmedCode.startsWith("graph") || trimmedCode.startsWith("flowchart")) {
    return "flowchart";
  }

  return "unknown";
};
