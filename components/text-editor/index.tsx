"use client";

import { useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { mermaidTheme } from "./theme";
import { options } from "./options";
import { tokens } from "./tokens";
import { Code, Copy, Redo2, Undo2, Zap } from "lucide-react";
import { Card } from "../ui/card";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { ButtonGroup } from "../ui/button-group";
import type { editor as MonacoEditor } from "monaco-editor";

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

const copyToClipboard = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    toast.success("Copied!", {
      description: "Diagram code copied to clipboard",
    });
  } catch (err) {
    toast.error("Failed to copy", {
      description: "Could not copy to clipboard",
    });
  }
};
interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextEditor({ value, onChange }: TextEditorProps) {
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);

  function undo() {
    editorRef.current?.trigger("keyboard", "undo", null);
  }

  function redo() {
    editorRef.current?.trigger("keyboard", "redo", null);
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200/60 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">Editor</span>
        </div>
        <div className="flex items-center gap-2 ">
          <ButtonGroup>
            <Button variant="outline" size="sm" onClick={undo}>
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={redo}>
              <Redo2 className="w-4 h-4" />
            </Button>
          </ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(value)}
            className="gap-2 "
            aria-label="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </Button>
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
            editorRef.current = editor;

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
