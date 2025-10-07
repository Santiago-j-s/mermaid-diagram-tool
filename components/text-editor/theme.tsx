import { editor } from "monaco-editor";

export const mermaidLightTheme: editor.IStandaloneThemeData = {
  base: "vs",
  inherit: true,
  rules: [
    { token: "keyword", foreground: "1E90FF", fontStyle: "bold" },
    { token: "type", foreground: "00A8B5" },
    { token: "operator", foreground: "1E3A8A" },
    { token: "string", foreground: "0369a1" },
    { token: "number", foreground: "00BFFF" },
    { token: "comment", foreground: "6b7280", fontStyle: "italic" },
  ],
  colors: {
    "editor.background": "#ffffff",
    "editor.lineHighlightBackground": "#E0F2FE",
    "editorLineNumber.foreground": "#94a3b8",
    "editorLineNumber.activeForeground": "#1E90FF",
    "editor.selectionBackground": "#BAE6FD",
  },
};

export const mermaidDarkTheme: editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "keyword", foreground: "00BFFF", fontStyle: "bold" },
    { token: "type", foreground: "00CED1" },
    { token: "operator", foreground: "87CEEB" },
    { token: "string", foreground: "1E90FF" },
    { token: "number", foreground: "6495ED" },
    { token: "comment", foreground: "94a3b8", fontStyle: "italic" },
  ],
  colors: {
    "editor.background": "#0F2137",
    "editor.lineHighlightBackground": "#172C46",
    "editorLineNumber.foreground": "#475569",
    "editorLineNumber.activeForeground": "#00BFFF",
    "editor.selectionBackground": "#1E3A5F",
  },
};
