import { editor } from "monaco-editor";

export const options: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  lineNumbers: "on",
  lineNumbersMinChars: 4,
  scrollBeyondLastLine: false,
  automaticLayout: true,
  fontSize: 14,
  fontFamily:
    "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
  wordWrap: "on",
  lineHeight: 1.7,
  padding: { top: 20, bottom: 20 },
  renderLineHighlight: "line",
  cursorBlinking: "smooth",
  smoothScrolling: true,
  contextmenu: true,
  find: {
    addExtraSpaceOnTop: false,
    autoFindInSelection: "never",
    seedSearchStringFromSelection: "always",
  },
  folding: true,
  foldingStrategy: "indentation",
  showFoldingControls: "mouseover",
  bracketPairColorization: {
    enabled: true,
  },
  guides: {
    indentation: true,
    bracketPairs: true,
  },
  suggest: {
    showKeywords: true,
    showSnippets: true,
  },
  quickSuggestions: {
    other: true,
    comments: false,
    strings: false,
  },
};
