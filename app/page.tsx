"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Download, Eye, Code, Zap, BookOpen } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TextEditor } from "@/components/text-editor"
import { ReferencePanel } from "@/components/reference-panel"
import { exampleDiagrams, referenceData } from "@/lib/examples"

const defaultDiagram = `graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]`

const getFriendlyErrorMessage = (
  error: string,
  diagramType: "flowchart" | "sequence" | "journey" | "unknown" = "unknown",
): { message: string; suggestion: string; lineNumber?: number } => {
  const lowerError = error.toLowerCase()
  const originalError = error

  const lineMatch = originalError.match(/line (\d+)/i) || originalError.match(/on line (\d+)/i)
  const lineNumber = lineMatch ? Number.parseInt(lineMatch[1]) : undefined

  if (diagramType === "unknown") {
    if (lowerError.includes("sequence") || lowerError.includes("participant")) {
      diagramType = "sequence"
    } else if (lowerError.includes("journey") || lowerError.includes("section")) {
      diagramType = "journey"
    } else if (lowerError.includes("graph") || lowerError.includes("flowchart")) {
      diagramType = "flowchart"
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
      message: lineNumber ? `Missing closing bracket at line ${lineNumber}` : "Missing closing bracket",
      suggestion: lineNumber
        ? `Fix line ${lineNumber}: Add the missing closing bracket. Use [Text], (Text), {Text}, or ((Text)) for different node shapes`
        : "Add the missing closing bracket. Use [Text], (Text), {Text}, or ((Text)) for different node shapes",
      lineNumber,
    }
  }

  if (lowerError.includes("brkt") || lowerError.includes("bracket")) {
    return {
      message: lineNumber ? `Bracket mismatch at line ${lineNumber}` : "Bracket mismatch in flowchart",
      suggestion: lineNumber
        ? `Fix line ${lineNumber}: Match brackets correctly: [Rectangle], (Rounded), {Diamond}, ((Circle))`
        : "Match brackets: [Rectangle], (Rounded), {Diamond}, ((Circle))",
      lineNumber,
    }
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
      message: lineNumber ? `Connection syntax error at line ${lineNumber}` : "Connection syntax error",
      suggestion: lineNumber
        ? `Fix line ${lineNumber}: Use proper arrow syntax like A --> B, A --- B, or A -.-> B for connections`
        : "Use proper arrow syntax: A --> B, A --- B, or A -.-> B for connections",
      lineNumber,
    }
  }

  if (lowerError.includes("parse error") || lowerError.includes("expecting")) {
    if (lowerError.includes("eof")) {
      if (
        (originalError.includes("BRKT") ||
          originalError.includes("bracket") ||
          (diagramType === "flowchart" &&
            (originalError.includes("[") || originalError.includes("(") || originalError.includes("{")))) &&
        !originalError.includes("'-->'") &&
        !originalError.includes("'--->'") &&
        !originalError.includes("'amp'") &&
        !originalError.includes("'minus'")
      ) {
        return {
          message: lineNumber
            ? `Incomplete bracket or node definition at line ${lineNumber}`
            : "Incomplete bracket or node definition",
          suggestion: lineNumber
            ? `Check line ${lineNumber}: Make sure all brackets are properly closed: [Rectangle], (Rounded), {Diamond}, ((Circle))`
            : "Make sure all brackets are properly closed: [Rectangle], (Rounded), {Diamond}, ((Circle))",
          lineNumber,
        }
      }

      if (diagramType === "sequence") {
        return {
          message: lineNumber ? `Incomplete sequence diagram at line ${lineNumber}` : "Incomplete sequence diagram",
          suggestion: lineNumber
            ? `Check line ${lineNumber}: Make sure all messages have proper format: A->>B: Message text`
            : "Make sure all messages have proper format: A->>B: Message text",
          lineNumber,
        }
      } else if (diagramType === "journey") {
        return {
          message: lineNumber ? `Incomplete user journey at line ${lineNumber}` : "Incomplete user journey",
          suggestion: lineNumber
            ? `Check line ${lineNumber}: Ensure all tasks follow format: Task Name: Score: Actor`
            : "Ensure all tasks follow format: Task Name: Score: Actor",
          lineNumber,
        }
      } else {
        return {
          message: lineNumber ? `Connection issue at line ${lineNumber}` : "Connection issue",
          suggestion: lineNumber
            ? `Check line ${lineNumber}: Use proper arrow syntax like A --> B for connections`
            : "Use proper arrow syntax: A --> B for connections",
          lineNumber,
        }
      }
    }

    if (lowerError.includes("colon") || lowerError.includes(":")) {
      if (diagramType === "sequence") {
        return {
          message: lineNumber
            ? `Missing colon in sequence message at line ${lineNumber}`
            : "Missing colon in sequence message",
          suggestion: lineNumber
            ? `Fix line ${lineNumber}: Use format A->>B: Your message text (colon after arrow)`
            : "Use format: A->>B: Your message text (colon after arrow)",
          lineNumber,
        }
      } else if (diagramType === "journey") {
        return {
          message: lineNumber ? `Missing colon in journey task at line ${lineNumber}` : "Missing colon in journey task",
          suggestion: lineNumber
            ? `Fix line ${lineNumber}: Use format Task Name: Score: Actor (two colons needed)`
            : "Use format: Task Name: Score: Actor (two colons needed)",
          lineNumber,
        }
      }
    }
  }

  if (lowerError.includes("lexical error") || lowerError.includes("invalid")) {
    return {
      message: lineNumber ? `Invalid character or syntax at line ${lineNumber}` : "Invalid character or syntax",
      suggestion: lineNumber
        ? `Check line ${lineNumber} for typos in ${diagramType} keywords and remove special characters`
        : `Check for typos in ${diagramType} keywords and remove special characters`,
      lineNumber,
    }
  }

  if (diagramType !== "unknown" && referenceData[diagramType]?.errorPatterns) {
    for (const pattern of referenceData[diagramType].errorPatterns) {
      if (pattern.pattern.test(originalError)) {
        return {
          message: lineNumber ? `${pattern.message} at line ${lineNumber}` : pattern.message,
          suggestion: lineNumber ? `Fix line ${lineNumber}: ${pattern.suggestion}` : pattern.suggestion,
          lineNumber,
        }
      }
    }
  }

  if (lineNumber) {
    return {
      message: `Syntax error on line ${lineNumber}`,
      suggestion: `Check line ${lineNumber} for ${diagramType} syntax errors. Compare with the reference examples.`,
      lineNumber,
    }
  }

  const diagramGuidance = {
    flowchart: "Start with 'graph TD' and use A --> B for connections",
    sequence: "Start with 'sequenceDiagram' and define participants first",
    journey: "Start with 'journey' then 'title', followed by sections",
    unknown: "Check your diagram type declaration and syntax",
  }

  return {
    message: `${diagramType.charAt(0).toUpperCase() + diagramType.slice(1)} syntax error`,
    suggestion: diagramGuidance[diagramType],
  }
}

const getAISuggestion = async (
  error: string,
  code: string,
  diagramType: string,
  lineNumber?: number,
): Promise<string> => {
  try {
    const response = await fetch("/api/suggest-fix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error, code, diagramType, lineNumber }),
    })

    if (!response.ok) {
      throw new Error("Failed to get AI suggestion")
    }

    const { suggestion } = await response.json()
    return suggestion
  } catch (error) {
    console.error("Failed to get AI suggestion:", error)
    return "Check the reference guide for syntax examples and common patterns."
  }
}

const detectDiagramType = (code: string): "flowchart" | "sequence" | "journey" | "unknown" => {
  const trimmedCode = code.trim().toLowerCase()

  if (trimmedCode.startsWith("sequencediagram")) {
    return "sequence"
  } else if (trimmedCode.startsWith("journey")) {
    return "journey"
  } else if (trimmedCode.startsWith("graph") || trimmedCode.startsWith("flowchart")) {
    return "flowchart"
  }

  return "unknown"
}

export default function MermaidEditor() {
  const [code, setCode] = useState(defaultDiagram)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false)
  const [showReference, setShowReference] = useState(false)
  const [selectedReference, setSelectedReference] = useState<keyof typeof referenceData>("flowchart")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [documentReady, setDocumentReady] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const mermaidRef = useRef<any>(null)
  const initTimeoutRef = useRef<NodeJS.Timeout>()
  const { toast } = useToast()

  useEffect(() => {
    const checkDocumentReady = () => {
      const isReady =
        typeof window !== "undefined" &&
        typeof document !== "undefined" &&
        document.head !== null &&
        document.body !== null &&
        document.readyState === "complete"

      console.log("[v0] Document readiness check:", {
        window: typeof window !== "undefined",
        document: typeof document !== "undefined",
        head: document?.head !== null,
        body: document?.body !== null,
        readyState: document?.readyState,
      })

      return isReady
    }

    if (checkDocumentReady()) {
      setDocumentReady(true)
      return
    }

    const handleLoad = () => {
      console.log("[v0] Window load event")
      if (checkDocumentReady()) {
        setDocumentReady(true)
      }
    }

    const handleDOMContentLoaded = () => {
      console.log("[v0] DOMContentLoaded event")
      if (checkDocumentReady()) {
        setDocumentReady(true)
      }
    }

    const handleReadyStateChange = () => {
      console.log("[v0] ReadyState changed to:", document.readyState)
      if (checkDocumentReady()) {
        setDocumentReady(true)
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("load", handleLoad)
      document.addEventListener("DOMContentLoaded", handleDOMContentLoaded)
      document.addEventListener("readystatechange", handleReadyStateChange)
    }

    // Polling fallback
    const pollInterval = setInterval(() => {
      if (checkDocumentReady()) {
        setDocumentReady(true)
        clearInterval(pollInterval)
      }
    }, 100)

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("load", handleLoad)
        document.removeEventListener("DOMContentLoaded", handleDOMContentLoaded)
        document.removeEventListener("readystatechange", handleReadyStateChange)
      }
      clearInterval(pollInterval)
    }
  }, [])

  useEffect(() => {
    if (!documentReady) {
      console.log("[v0] Waiting for document to be ready...")
      return
    }

    const initMermaid = async () => {
      try {
        console.log("[v0] Starting Mermaid initialization with document ready")

        // Additional safety check
        if (!document.head || !document.body) {
          console.warn("[v0] Document head or body still not available, retrying...")
          initTimeoutRef.current = setTimeout(initMermaid, 500)
          return
        }

        const mermaidModule = await import("mermaid")
        const mermaid = mermaidModule.default

        console.log("[v0] Mermaid module loaded, initializing...")

        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
          fontFamily: "DM Sans, sans-serif",
          suppressErrorRendering: true,
          logLevel: "error",
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
          },
        })

        console.log("[v0] Mermaid initialized successfully")
        mermaidRef.current = mermaid
        setIsLoading(false)

        // Small delay before first render
        setTimeout(() => {
          renderDiagram()
        }, 200)
      } catch (err) {
        console.error("[v0] Failed to load mermaid:", err)
        setError("Failed to load diagram renderer")
        setIsLoading(false)
      }
    }

    // Additional delay to ensure everything is stable
    initTimeoutRef.current = setTimeout(initMermaid, 2000)

    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current)
      }
    }
  }, [documentReady])

  useEffect(() => {
    if (!isLoading && mermaidRef.current && documentReady) {
      const timeoutId = setTimeout(() => {
        renderDiagram()
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [code, isLoading, documentReady])

  const renderDiagram = async () => {
    if (!previewRef.current || !mermaidRef.current || !documentReady) {
      console.log("[v0] Skipping render - not ready:", {
        preview: !!previewRef.current,
        mermaid: !!mermaidRef.current,
        documentReady,
      })
      return
    }

    try {
      console.log("[v0] Starting diagram render")
      setError(null)
      setAiSuggestion(null)

      previewRef.current.innerHTML = ""

      // Safe cleanup
      try {
        if (document.querySelectorAll) {
          const existingErrors = document.querySelectorAll('[id^="mermaid-"], .mermaid-error, .error, [class*="error"]')
          existingErrors.forEach((el) => {
            if (
              el &&
              el.textContent &&
              (el.textContent.includes("Syntax error in text") || el.textContent.includes("mermaid version"))
            ) {
              try {
                el.remove()
              } catch (e) {
                // Ignore removal errors
              }
            }
          })
        }
      } catch (e) {
        console.warn("[v0] Error during cleanup:", e)
      }

      const id = `mermaid-${Date.now()}`
      console.log("[v0] Rendering with ID:", id)

      const { svg } = await mermaidRef.current.render(id, code)
      previewRef.current.innerHTML = svg
      console.log("[v0] Diagram rendered successfully")

      // Post-render cleanup
      setTimeout(() => {
        try {
          if (document.querySelectorAll) {
            const errorSelectors = ['[class*="error"]', '[id*="mermaid-error"]']

            errorSelectors.forEach((selector) => {
              try {
                const elements = document.querySelectorAll(selector)
                elements.forEach((el) => {
                  if (el && el.nodeType === Node.ELEMENT_NODE && el.textContent) {
                    if (
                      el.textContent.includes("Syntax error in text mermaid version") ||
                      el.textContent.includes("mermaid version")
                    ) {
                      try {
                        el.remove()
                      } catch (e) {
                        // Ignore removal errors
                      }
                    }
                  }
                })
              } catch (e) {
                // Ignore selector errors
              }
            })
          }
        } catch (e) {
          console.warn("[v0] Error during post-render cleanup:", e)
        }
      }, 100)
    } catch (err: any) {
      console.error("[v0] Mermaid render error:", err)

      const diagramType = detectDiagramType(code)
      const friendlyError = getFriendlyErrorMessage(err.message || "Unknown error", diagramType)
      setError(friendlyError.message)

      setIsLoadingSuggestion(true)
      getAISuggestion(err.message || "Unknown error", code, diagramType, friendlyError.lineNumber).then(
        (suggestion) => {
          setAiSuggestion(suggestion)
          setIsLoadingSuggestion(false)
        },
      )

      const lineNumberDisplay = friendlyError.lineNumber ? `Line ${friendlyError.lineNumber}: ` : ""

      previewRef.current.innerHTML = `
        <div class="flex items-center justify-center h-full">
          <div class="text-center max-w-md p-6">
            <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div class="space-y-2">
              <p class="text-sm text-red-600 font-medium">${lineNumberDisplay}${friendlyError.message}</p>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div class="flex items-start gap-2">
                  <div class="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                      <path d="M4 0l4 4-4 4z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-medium text-blue-800 mb-1">💡 Quick Fix:</p>
                    <p class="text-sm text-blue-700">${friendlyError.suggestion}</p>
                  </div>
                </div>
              </div>
            </div>
            ${isLoadingSuggestion ? '<p class="text-xs text-gray-500">Getting AI-powered suggestion...</p>' : aiSuggestion}
          </div>
        </div>
      `
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      toast({
        title: "Copied!",
        description: "Diagram code copied to clipboard",
      })
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const downloadSVG = () => {
    if (!documentReady) return

    const svgElement = previewRef.current?.querySelector("svg")
    if (!svgElement) return

    try {
      const svgData = new XMLSerializer().serializeToString(svgElement)
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
      const svgUrl = URL.createObjectURL(svgBlob)

      const downloadLink = document.createElement("a")
      downloadLink.href = svgUrl
      downloadLink.download = "diagram.svg"
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
      URL.revokeObjectURL(svgUrl)

      toast({
        title: "Downloaded!",
        description: "Diagram saved as SVG file",
      })
    } catch (err) {
      console.error("[v0] Download error:", err)
      toast({
        title: "Download failed",
        description: "Could not download SVG file",
        variant: "destructive",
      })
    }
  }

  const loadExample = (example: (typeof exampleDiagrams)[0]) => {
    setCode(example.code)
    toast({
      title: "Example loaded",
      description: `${example.name} diagram loaded`,
    })
  }

  const loadReferenceExample = (example: string) => {
    setCode(example)
    toast({
      title: "Example loaded",
      description: "Reference example loaded into editor",
    })
  }

  if (!documentReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="p-3 bg-accent/10 rounded-lg mb-3 inline-block">
            <Zap className="w-6 h-6 animate-pulse text-accent" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Preparing editor...</p>
          <p className="text-xs text-muted-foreground mt-1">Ensuring document is ready</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground tracking-tight">Mermaid Editor</h1>
                  <p className="text-sm text-muted-foreground">Professional diagram creation</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
                Interactive
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowReference(!showReference)}
                className="gap-2 bg-muted/20 hover:bg-slate-600 hover:text-white border-border text-foreground"
              >
                <BookOpen className="w-4 h-4" />
                Reference
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="gap-2 bg-muted/20 hover:bg-slate-600 hover:text-white border-border text-foreground"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSVG}
                disabled={!!error}
                className="gap-2 bg-muted/20 hover:bg-slate-600 hover:text-white border-border text-foreground disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Download SVG
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <div className="container mx-auto px-6 py-8 flex-1 flex flex-col gap-8">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Quick Examples</h2>
                <p className="text-sm text-muted-foreground">Get started with these diagram templates</p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              {exampleDiagrams.map((example) => (
                <Button
                  key={example.name}
                  variant="outline"
                  size="sm"
                  onClick={() => loadExample(example)}
                  className="text-sm font-medium bg-muted/20 hover:bg-slate-600 hover:text-white border-border text-foreground transition-all duration-200"
                >
                  {example.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-8">
            <div className={`grid gap-8 flex-1 ${showReference ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
              {showReference && <ReferencePanel onLoadExample={loadReferenceExample} />}

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200/60 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Editor</span>
                  </div>
                </div>
                <div className="p-0 h-[calc(100vh-320px)] flex flex-col">
                  <TextEditor value={code} onChange={setCode} className="flex-1" />
                </div>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200/60 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Preview</span>
                  </div>
                  {error && (
                    <Badge variant="destructive" className="text-xs ml-auto font-medium">
                      Error
                    </Badge>
                  )}
                </div>
                <div className="flex-1 p-6 overflow-auto bg-background">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="p-3 bg-accent/10 rounded-lg mb-3 inline-block">
                          <Zap className="w-6 h-6 animate-pulse text-accent" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Loading renderer...</p>
                      </div>
                    </div>
                  ) : (
                    <div
                      ref={previewRef}
                      className="w-full h-full flex items-center justify-center"
                      style={{ minHeight: "400px" }}
                    />
                  )}
                </div>
              </Card>
            </div>

            {!showReference && (
              <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">Quick Reference</h3>
                      <p className="text-xs text-muted-foreground">Essential syntax patterns</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowReference(true)}
                      className="text-xs gap-2 bg-muted/20 hover:bg-slate-600 hover:text-white text-foreground"
                    >
                      <BookOpen className="w-3 h-3" />
                      View Full Reference
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div className="space-y-2">
                      <p className="font-semibold text-foreground">Flowchart</p>
                      <code className="bg-muted/50 px-2 py-1 rounded text-xs font-mono">graph TD</code>
                      <p className="text-muted-foreground text-xs">A --&gt; B: Decision</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-foreground">Sequence</p>
                      <code className="bg-muted/50 px-2 py-1 rounded text-xs font-mono">sequenceDiagram</code>
                      <p className="text-muted-foreground text-xs">A-&gt;&gt;B: Message</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold text-foreground">User Journey</p>
                      <code className="bg-muted/50 px-2 py-1 rounded text-xs font-mono">journey</code>
                      <p className="text-muted-foreground text-xs">Task: 5: User</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
