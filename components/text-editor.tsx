"use client"

import { useEffect, useRef, useState } from "react"

interface TextEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function TextEditor({ value, onChange, className = "" }: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const initMonaco = async () => {
      try {
        if (typeof window === "undefined" || !document.head) {
          setTimeout(initMonaco, 100)
          return
        }

        const monaco = await import("@monaco-editor/react")

        if (!mounted) return

        const Editor = monaco.default

        const handleEditorDidMount = (editor: any, monaco: any) => {
          monacoRef.current = editor

          monaco.languages.register({ id: "mermaid" })
    monaco.languages.setMonarchTokensProvider("mermaid", {
      tokenizer: {
        root: [
          [
            /\b(graph|subgraph|flowchart|sequenceDiagram|journey|participant|activate|deactivate|Note|loop|alt|else|end|section|title)\b/,
            "keyword",
          ],
          [/\b(TD|LR|BT|RL)\b/, "type"],
          [/-->|->|-->>|->>|--x|-x|---|\.\.\./, "operator"],
          [/\[.*?\]/, "string"],
          [/$$.*?$$/, "string"],
          [/\{.*?\}/, "string"],
          [/$$$$.*?$$$$/, "string"],
          [/\|.*?\|/, "string"],
          [/".*?"/, "string"],
          [/\d+/, "number"],
          [/#.*$/, "comment"],
        ],
      },
    })

        monaco.editor.defineTheme("mermaid-theme", {
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
    })
    
    monaco.editor.setTheme("mermaid-theme")
          editor.setValue(value)
          editor.onDidChangeModelContent(() => {
            onChange(editor.getValue())
          })
        }

        const { createRoot } = await import("react-dom/client")
        if (editorRef.current && mounted) {
          const root = createRoot(editorRef.current)
          root.render(
            <Editor
              height="100%"
              defaultLanguage="mermaid"
              theme="vs"
              value={value}
              onMount={handleEditorDidMount}
              options={{
                      minimap: { enabled: false },
                      lineNumbers: "on",
                      lineNumbersMinChars: 4,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      fontSize: 14,
                      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
                      wordWrap: "on",
                      lineHeight: 1.7,
                      padding: { top: 20, bottom: 20, left: 16, right: 16 },
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
              }}
            />,
          )
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Failed to load Monaco Editor:", error)
        setIsLoading(false)
      }
    }

    initMonaco()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (monacoRef.current && monacoRef.current.getValue() !== value) {
      monacoRef.current.setValue(value)
    }
  }, [value])

  return (
    <div className={`flex-1 ${className}`}>
      {isLoading && (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-muted/20 rounded-lg">
          <div className="text-sm text-muted-foreground">Loading editor...</div>
        </div>
      )}
      <div
        ref={editorRef}
        className={`w-full h-full min-h-[400px] ${isLoading ? "hidden" : ""}`}
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace" }}
      />
    </div>
  )
}
