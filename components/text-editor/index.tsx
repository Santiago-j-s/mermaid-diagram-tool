"use client";

import { Editor } from "@monaco-editor/react";
import { mermaidTheme } from "./theme";
import { options } from "./options";
import { tokens } from "./tokens";
import { Zap } from "lucide-react";

function LoadingState() {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-muted/20 rounded-lg">
      <div className="text-center">
        <div className="p-3 bg-accent/10 rounded-lg mb-3 inline-block">
          <Zap className="w-6 h-6 animate-pulse text-accent" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          Loading editor...
        </p>
      </div>
    </div>
  );
}

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextEditor({ value, onChange }: TextEditorProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage="mermaid"
      theme="vs"
      value={value}
      loading={<LoadingState />}
      onMount={(editor, monaco) => {
        monaco.languages.register({ id: "mermaid" });
        monaco.languages.setMonarchTokensProvider("mermaid", {
          tokenizer: { root: tokens },
        });

        monaco.editor.defineTheme("mermaid-theme", mermaidTheme);

        monaco.editor.setTheme("mermaid-theme");
        editor.setValue(value);
        editor.onDidChangeModelContent(() => {
          onChange(editor.getValue());
        });
      }}
      options={options}
    />
  );
}
