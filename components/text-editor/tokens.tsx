import { languages } from "monaco-editor";

export const tokens: languages.IMonarchLanguageRule[] = [
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
];
