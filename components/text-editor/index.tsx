"use client";

import { Editor } from "@monaco-editor/react";
import { mermaidTheme } from "./theme";
import { options } from "./options";
import { tokens } from "./tokens";
import { Code, Zap } from "lucide-react";
import { Card } from "../ui/card";
import { Spinner } from "../ui/spinner";

function LoadingState() {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-muted/20 rounded-lg">
      <div className="text-center">
        <div className="p-3 bg-accent/10 rounded-lg mb-3 inline-block">
          <Spinner className="w-6 h-6 animate-pulse text-accent" />
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
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200/60 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Editor</span>
        </div>
      </div>
      <div className="p-0 h-[calc(100vh-320px)] flex flex-col">
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
      </div>
    </Card>
  );
}
