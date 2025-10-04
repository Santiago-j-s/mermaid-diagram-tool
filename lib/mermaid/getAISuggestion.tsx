"use client";
export const getAISuggestion = async (
  error: string,
  code: string,
  diagramType: string,
  lineNumber?: number,
): Promise<string> => {
  try {
    const response = await fetch("/api/suggest-fix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error, code, diagramType, lineNumber }),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI suggestion");
    }

    const { suggestion } = await response.json();
    return suggestion;
  } catch (error) {
    console.error("Failed to get AI suggestion:", error);
    return "Check the reference guide for syntax examples and common patterns.";
  }
};
