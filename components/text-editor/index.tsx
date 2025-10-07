"use client";

import { useRef, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { mermaidLightTheme, mermaidDarkTheme } from "./theme";
import { options } from "./options";
import { tokens } from "./tokens";
import { Code, Copy, Redo2, Undo2 } from "lucide-react";
import { Card } from "../ui/card";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { ButtonGroup } from "../ui/button-group";
import { useTheme } from "next-themes";
import type { editor as MonacoEditor } from "monaco-editor";

function LoadingState() {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-muted/20 rounded-lg">
      <div className="text-center">
        <div className="p-3 bg-accent/10 rounded-lg mb-3 inline-block">
          <Spinner className="w-6 h-6 animate-pulse text-accent" />
        </div>
        <p className="text-sm text-muted-foreground font-medium">
          Initializing code editor...
        </p>
      </div>
    </div>
  );
}

const copyToClipboard = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    toast.success("Code Copied", {
      description: "Your diagram code has been copied to the clipboard",
    });
  } catch (err) {
    toast.error("Copy Failed", {
      description: "Unable to copy code to clipboard. Please try again",
    });
  }
};
interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextEditor({ value, onChange }: TextEditorProps) {
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<any>(null);
  const { resolvedTheme } = useTheme();

  function undo() {
    editorRef.current?.trigger("keyboard", "undo", null);
  }

  function redo() {
    editorRef.current?.trigger("keyboard", "redo", null);
  }

  const editorTheme = resolvedTheme === "dark" ? "mermaid-dark-theme" : "mermaid-light-theme";

  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      monacoRef.current.editor.setTheme(editorTheme);
    }
  }, [editorTheme]);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/60 shadow-lg theme-transition">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-muted/50 theme-transition">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-foreground/70" />
          <span className="text-sm font-medium text-foreground">Editor</span>
        </div>
        <div className="flex items-center gap-2 ">
          <ButtonGroup>
            <Button
              variant="outline"
              size="sm"
              onClick={undo}
              disabled={!editorRef.current?.getModel()?.canUndo()}
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={redo}
              disabled={!editorRef.current?.getModel()?.canRedo()}
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </ButtonGroup>
          <Button
            variant="outline"
            size="sm"
            onClick={() => copyToClipboard(value)}
            disabled={!value}
            className="gap-2"
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
          theme={editorTheme}
          value={value}
          loading={<LoadingState />}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            monacoRef.current = monaco;

            monaco.languages.register({ id: "mermaid" });
            monaco.languages.setMonarchTokensProvider("mermaid", {
              tokenizer: { root: tokens },
            });

            monaco.editor.defineTheme("mermaid-light-theme", mermaidLightTheme);
            monaco.editor.defineTheme("mermaid-dark-theme", mermaidDarkTheme);
            monaco.editor.setTheme(editorTheme);

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
