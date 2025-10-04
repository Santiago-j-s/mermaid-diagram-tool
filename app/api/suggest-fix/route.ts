import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  try {
    const { error, code, diagramType, lineNumber } = await request.json();

    const lineContext = lineNumber
      ? `The error is specifically on line ${lineNumber}.`
      : "";

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `You are a Mermaid diagram expert helping users fix syntax errors. 

User's ${diagramType} diagram code:
\`\`\`
${code}
\`\`\`

Error message: ${error}
${lineContext}

Provide a concise, actionable suggestion to fix this specific error. Focus on:
1. What exactly is wrong${lineNumber ? ` (especially on line ${lineNumber})` : ""}
2. How to fix it (be specific about syntax)
3. A corrected example if helpful

${lineNumber ? `Pay special attention to line ${lineNumber} and suggest the exact fix needed for that line.` : ""}

Keep your response under 100 words and be beginner-friendly.`,
    });

    return Response.json({ suggestion: text });
  } catch (error) {
    console.error("AI suggestion error:", error);
    return Response.json(
      {
        suggestion:
          "Unable to generate AI suggestion at the moment. Please check the reference guide for syntax examples.",
      },
      { status: 500 },
    );
  }
}
