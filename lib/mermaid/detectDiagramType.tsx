"use client";
export const detectDiagramType = (
  code: string,
): "flowchart" | "sequence" | "journey" | "unknown" => {
  const trimmedCode = code.trim().toLowerCase();

  if (trimmedCode.startsWith("sequencediagram")) {
    return "sequence";
  } else if (trimmedCode.startsWith("journey")) {
    return "journey";
  } else if (
    trimmedCode.startsWith("graph") ||
    trimmedCode.startsWith("flowchart")
  ) {
    return "flowchart";
  }

  return "unknown";
};
