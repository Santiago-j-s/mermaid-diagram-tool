import { referenceData } from "./examples";
import type { DiagramType } from "./detectDiagramType";

export const getFriendlyErrorMessage = (
  error: string,
  diagramType: DiagramType = "unknown",
): { message: string; suggestion: string; lineNumber?: number } => {
  const lowerError = error.toLowerCase();
  const originalError = error;

  const lineMatch =
    originalError.match(/line (\d+)/i) || originalError.match(/on line (\d+)/i);
  const lineNumber = lineMatch ? Number.parseInt(lineMatch[1]) : undefined;

  if (lowerError.includes("not supported by the current renderer")) {
    return {
      message: "Diagram type not supported yet",
      suggestion:
        "Use flowchart, state, sequence, class, or ER diagram syntax. Journey, Gantt, and Pie are not available in the current renderer.",
    };
  }

  if (diagramType === "unknown") {
    if (lowerError.includes("sequence") || lowerError.includes("participant")) {
      diagramType = "sequence";
    } else if (
      lowerError.includes("journey") ||
      lowerError.includes("section")
    ) {
      diagramType = "journey";
    } else if (
      lowerError.includes("graph") ||
      lowerError.includes("flowchart")
    ) {
      diagramType = "flowchart";
    }
  }

  if (
    (lowerError.includes("brkt") ||
      lowerError.includes("bracket") ||
      originalError.includes("expecting ']'") ||
      originalError.includes("expecting ')'") ||
      originalError.includes("expecting '}'")) &&
    !originalError.includes("'-->'") &&
    !originalError.includes("'--->'") &&
    !originalError.includes("'amp'") &&
    !originalError.includes("'minus'") &&
    !originalError.includes("arrow")
  ) {
    return {
      message: lineNumber
        ? `Missing closing bracket at line ${lineNumber}`
        : "Missing closing bracket",
      suggestion: lineNumber
        ? `Fix line ${lineNumber}: Add the missing closing bracket. Use [Text], (Text), {Text}, or ((Text)) for different node shapes`
        : "Add the missing closing bracket. Use [Text], (Text), {Text}, or ((Text)) for different node shapes",
      lineNumber,
    };
  }

  if (lowerError.includes("brkt") || lowerError.includes("bracket")) {
    return {
      message: lineNumber
        ? `Bracket mismatch at line ${lineNumber}`
        : "Bracket mismatch in flowchart",
      suggestion: lineNumber
        ? `Fix line ${lineNumber}: Match brackets correctly: [Rectangle], (Rounded), {Diamond}, ((Circle))`
        : "Match brackets: [Rectangle], (Rounded), {Diamond}, ((Circle))",
      lineNumber,
    };
  }

  if (
    diagramType === "flowchart" &&
    lowerError.includes("expecting") &&
    (originalError.includes("'-->'") ||
      originalError.includes("'--->'") ||
      originalError.includes("'amp'") ||
      originalError.includes("'minus'") ||
      originalError.includes("arrow") ||
      (originalError.includes("'-'") && !originalError.includes("bracket")) ||
      (lowerError.includes("eof") && originalError.includes("--")))
  ) {
    return {
      message: lineNumber
        ? `Connection syntax error at line ${lineNumber}`
        : "Connection syntax error",
      suggestion: lineNumber
        ? `Fix line ${lineNumber}: Use proper arrow syntax like A --> B, A --- B, or A -.-> B for connections`
        : "Use proper arrow syntax: A --> B, A --- B, or A -.-> B for connections",
      lineNumber,
    };
  }

  if (lowerError.includes("parse error") || lowerError.includes("expecting")) {
    if (lowerError.includes("eof")) {
      if (
        (originalError.includes("BRKT") ||
          originalError.includes("bracket") ||
          (diagramType === "flowchart" &&
            (originalError.includes("[") ||
              originalError.includes("(") ||
              originalError.includes("{")))) &&
        !originalError.includes("'-->'") &&
        !originalError.includes("'--->'") &&
        !originalError.includes("'amp'") &&
        !originalError.includes("'minus'")
      ) {
        return {
          message: lineNumber
            ? `Incomplete bracket or node definition at line ${lineNumber}`
            : "Incomplete bracket or node definition",
          suggestion: lineNumber
            ? `Check line ${lineNumber}: Make sure all brackets are properly closed: [Rectangle], (Rounded), {Diamond}, ((Circle))`
            : "Make sure all brackets are properly closed: [Rectangle], (Rounded), {Diamond}, ((Circle))",
          lineNumber,
        };
      }

      if (diagramType === "sequence") {
        return {
          message: lineNumber
            ? `Incomplete sequence diagram at line ${lineNumber}`
            : "Incomplete sequence diagram",
          suggestion: lineNumber
            ? `Check line ${lineNumber}: Make sure all messages have proper format: A->>B: Message text`
            : "Make sure all messages have proper format: A->>B: Message text",
          lineNumber,
        };
      } else if (diagramType === "journey") {
        return {
          message: lineNumber
            ? `Incomplete user journey at line ${lineNumber}`
            : "Incomplete user journey",
          suggestion: lineNumber
            ? `Check line ${lineNumber}: Ensure all tasks follow format: Task Name: Score: Actor`
            : "Ensure all tasks follow format: Task Name: Score: Actor",
          lineNumber,
        };
      } else {
        return {
          message: lineNumber
            ? `Connection issue at line ${lineNumber}`
            : "Connection issue",
          suggestion: lineNumber
            ? `Check line ${lineNumber}: Use proper arrow syntax like A --> B for connections`
            : "Use proper arrow syntax: A --> B for connections",
          lineNumber,
        };
      }
    }

    if (lowerError.includes("colon") || lowerError.includes(":")) {
      if (diagramType === "sequence") {
        return {
          message: lineNumber
            ? `Missing colon in sequence message at line ${lineNumber}`
            : "Missing colon in sequence message",
          suggestion: lineNumber
            ? `Fix line ${lineNumber}: Use format A->>B: Your message text (colon after arrow)`
            : "Use format: A->>B: Your message text (colon after arrow)",
          lineNumber,
        };
      } else if (diagramType === "journey") {
        return {
          message: lineNumber
            ? `Missing colon in journey task at line ${lineNumber}`
            : "Missing colon in journey task",
          suggestion: lineNumber
            ? `Fix line ${lineNumber}: Use format Task Name: Score: Actor (two colons needed)`
            : "Use format: Task Name: Score: Actor (two colons needed)",
          lineNumber,
        };
      }
    }
  }

  if (lowerError.includes("lexical error") || lowerError.includes("invalid")) {
    return {
      message: lineNumber
        ? `Invalid character or syntax at line ${lineNumber}`
        : "Invalid character or syntax",
      suggestion: lineNumber
        ? `Check line ${lineNumber} for typos in ${diagramType} keywords and remove special characters`
        : `Check for typos in ${diagramType} keywords and remove special characters`,
      lineNumber,
    };
  }

  const referenceType =
    diagramType !== "unknown" && diagramType in referenceData
      ? (diagramType as keyof typeof referenceData)
      : null;

  if (referenceType && referenceData[referenceType]?.errorPatterns) {
    for (const pattern of referenceData[referenceType].errorPatterns) {
      if (pattern.pattern.test(originalError)) {
        return {
          message: lineNumber
            ? `${pattern.message} at line ${lineNumber}`
            : pattern.message,
          suggestion: lineNumber
            ? `Fix line ${lineNumber}: ${pattern.suggestion}`
            : pattern.suggestion,
          lineNumber,
        };
      }
    }
  }

  if (lineNumber) {
    return {
      message: `Syntax error on line ${lineNumber}`,
      suggestion: `Check line ${lineNumber} for ${diagramType} syntax errors. Compare with the reference examples.`,
      lineNumber,
    };
  }

  const diagramGuidance = {
    flowchart: "Start with 'graph TD' and use A --> B for connections",
    sequence: "Start with 'sequenceDiagram' and define participants first",
    state: "Start with 'stateDiagram-v2' and connect states using -->",
    class: "Start with 'classDiagram' and define classes before relationships",
    er: "Start with 'erDiagram' and define entities and relationships",
    journey: "Start with 'journey' then 'title', followed by sections",
    gantt: "Gantt is currently unsupported by this renderer",
    pie: "Pie is currently unsupported by this renderer",
    unknown: "Check your diagram type declaration and syntax",
  };

  return {
    message: `${
      diagramType.charAt(0).toUpperCase() + diagramType.slice(1)
    } syntax error`,
    suggestion: diagramGuidance[diagramType],
  };
};
