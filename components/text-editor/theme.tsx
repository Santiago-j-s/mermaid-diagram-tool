import { editor } from "monaco-editor";

export const mermaidTheme: editor.IStandaloneThemeData = {
  base: "vs",
  inherit: true,
  rules: [
    { token: "keyword", foreground: "8b5cf6", fontStyle: "bold" },
    { token: "type", foreground: "059669" },
    { token: "operator", foreground: "dc2626" },
    { token: "string", foreground: "0369a1" },
    { token: "number", foreground: "ea580c" },
    { token: "comment", foreground: "6b7280", fontStyle: "italic" },
  ],
  colors: {
    "editor.background": "#ffffff",
    "editor.lineHighlightBackground": "#f8fafc",
    "editorLineNumber.foreground": "#94a3b8",
    "editorLineNumber.activeForeground": "#475569",
  },
};
