import { referenceData } from "./examples";

export const getFriendlyErrorMessage = (
  error: string,
  diagramType: "flowchart" | "sequence" | "journey" | "unknown" = "unknown",
): { message: string; suggestion: string; lineNumber?: number } => {
  const lowerError = error.toLowerCase();
  const originalError = error;

  const lineMatch =
    originalError.match(/line (\d+)/i) || originalError.match(/on line (\d+)/i);
  const lineNumber = lineMatch ? Number.parseInt(lineMatch[1]) : undefined;

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
        ? `Missing closing bracket on line ${lineNumber}`
        : "Missing closing bracket",
      suggestion: lineNumber
        ? `Review line ${lineNumber}: Ensure brackets are properly closed. Use [Text] for rectangles, (Text) for rounded corners, {Text} for diamonds, or ((Text)) for circles`
        : "Ensure all brackets are properly closed. Use [Text] for rectangles, (Text) for rounded corners, {Text} for diamonds, or ((Text)) for circles",
      lineNumber,
    };
  }

  if (lowerError.includes("brkt") || lowerError.includes("bracket")) {
    return {
      message: lineNumber
        ? `Bracket mismatch on line ${lineNumber}`
        : "Bracket mismatch detected",
      suggestion: lineNumber
        ? `Review line ${lineNumber}: Ensure brackets match correctly: [Rectangle], (Rounded), {Diamond}, ((Circle))`
        : "Ensure brackets match correctly: [Rectangle], (Rounded), {Diamond}, ((Circle))",
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
        ? `Connection syntax error on line ${lineNumber}`
        : "Connection syntax error detected",
      suggestion: lineNumber
        ? `Review line ${lineNumber}: Use proper arrow syntax such as A --> B, A --- B, or A -.-> B for connections`
        : "Use proper arrow syntax such as A --> B, A --- B, or A -.-> B for connections",
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
            ? `Incomplete bracket or node definition on line ${lineNumber}`
            : "Incomplete bracket or node definition",
          suggestion: lineNumber
            ? `Review line ${lineNumber}: Ensure all brackets are properly closed: [Rectangle], (Rounded), {Diamond}, ((Circle))`
            : "Ensure all brackets are properly closed: [Rectangle], (Rounded), {Diamond}, ((Circle))",
          lineNumber,
        };
      }

      if (diagramType === "sequence") {
        return {
          message: lineNumber
            ? `Incomplete sequence diagram on line ${lineNumber}`
            : "Incomplete sequence diagram",
          suggestion: lineNumber
            ? `Review line ${lineNumber}: Ensure all messages follow the format A->>B: Message text`
            : "Ensure all messages follow the format A->>B: Message text",
          lineNumber,
        };
      } else if (diagramType === "journey") {
        return {
          message: lineNumber
            ? `Incomplete user journey on line ${lineNumber}`
            : "Incomplete user journey",
          suggestion: lineNumber
            ? `Review line ${lineNumber}: Ensure all tasks follow the format Task Name: Score: Actor`
            : "Ensure all tasks follow the format Task Name: Score: Actor",
          lineNumber,
        };
      } else {
        return {
          message: lineNumber
            ? `Connection issue detected on line ${lineNumber}`
            : "Connection issue detected",
          suggestion: lineNumber
            ? `Review line ${lineNumber}: Use proper arrow syntax such as A --> B for connections`
            : "Use proper arrow syntax such as A --> B for connections",
          lineNumber,
        };
      }
    }

    if (lowerError.includes("colon") || lowerError.includes(":")) {
      if (diagramType === "sequence") {
        return {
          message: lineNumber
            ? `Missing colon in sequence message on line ${lineNumber}`
            : "Missing colon in sequence message",
          suggestion: lineNumber
            ? `Review line ${lineNumber}: Use the format A->>B: Your message text (colon required after arrow)`
            : "Use the format A->>B: Your message text (colon required after arrow)",
          lineNumber,
        };
      } else if (diagramType === "journey") {
        return {
          message: lineNumber
            ? `Missing colon in journey task on line ${lineNumber}`
            : "Missing colon in journey task",
          suggestion: lineNumber
            ? `Review line ${lineNumber}: Use the format Task Name: Score: Actor (two colons required)`
            : "Use the format Task Name: Score: Actor (two colons required)",
          lineNumber,
        };
      }
    }
  }

  if (lowerError.includes("lexical error") || lowerError.includes("invalid")) {
    return {
      message: lineNumber
        ? `Invalid character or syntax on line ${lineNumber}`
        : "Invalid character or syntax detected",
      suggestion: lineNumber
        ? `Review line ${lineNumber} for typos in ${diagramType} keywords or unexpected special characters`
        : `Review your code for typos in ${diagramType} keywords or unexpected special characters`,
      lineNumber,
    };
  }

  if (diagramType !== "unknown" && referenceData[diagramType]?.errorPatterns) {
    for (const pattern of referenceData[diagramType].errorPatterns) {
      if (pattern.pattern.test(originalError)) {
        return {
          message: lineNumber
            ? `${pattern.message} on line ${lineNumber}`
            : pattern.message,
          suggestion: lineNumber
            ? `Review line ${lineNumber}: ${pattern.suggestion}`
            : pattern.suggestion,
          lineNumber,
        };
      }
    }
  }

  if (lineNumber) {
    return {
      message: `Syntax error on line ${lineNumber}`,
      suggestion: `Review line ${lineNumber} for ${diagramType} syntax issues. Refer to the syntax guide for correct formatting.`,
      lineNumber,
    };
  }

  const diagramGuidance = {
    flowchart: "Begin with 'graph TD' and use A --> B to create connections",
    sequence: "Begin with 'sequenceDiagram' and declare participants before defining interactions",
    journey: "Begin with 'journey' followed by a 'title', then define sections",
    unknown: "Verify your diagram type declaration and review the syntax",
  };

  return {
    message: `${
      diagramType.charAt(0).toUpperCase() + diagramType.slice(1)
    } syntax error detected`,
    suggestion: diagramGuidance[diagramType],
  };
};
