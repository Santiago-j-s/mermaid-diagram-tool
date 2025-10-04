export const exampleDiagrams = [
  {
    name: "Flowchart",
    code: `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Process A]
    B -->|No| D[Process B]
    C --> E[End]
    D --> E`,
  },
  {
    name: "Sequence",
    code: `sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob, how are you?
    B-->>A: Great!
    A-)B: See you later!`,
  },
  {
    name: "User Journey",
    code: `journey
    title User Shopping Experience
    section Discovery
      Visit Website: 3: User
      Browse Products: 4: User
    section Purchase
      Add to Cart: 5: User
      Checkout: 2: User`,
  },
]

export const referenceData = {
  flowchart: {
    title: "Flowchart Diagrams",
    description: "Show processes, decisions, and workflows with connected nodes",
    syntax: [
      {
        label: "Direction",
        code: "graph TD\ngraph LR\ngraph BT\ngraph RL",
        desc: "TD (top-down), LR (left-right), BT (bottom-top), RL (right-left)",
      },
      {
        label: "Node Shapes",
        code: "A[Rectangle]\nB(Rounded)\nC{Diamond}\nD((Circle))\nE>Flag]\nF[[Subroutine]]",
        desc: "Different shapes convey different meanings in your process",
      },
      {
        label: "Connections",
        code: "A --> B\nA -.-> C\nA ==> D\nA --- E\nA -.- F",
        desc: "Solid arrows, dotted lines, thick arrows, and simple lines",
      },
      {
        label: "Labels on Connections",
        code: "A -->|Yes| B\nA -->|No| C\nA -.->|Maybe| D",
        desc: "Add descriptive text to your connections",
      },
      {
        label: "Subgraphs",
        code: "subgraph Main Process\n  A --> B\n  B --> C\nend",
        desc: "Group related nodes together for better organization",
      },
    ],
    example: `graph TD
    Start([Start Process]) --> Input[Get User Input]
    Input --> Validate{Valid Input?}
    Validate -->|Yes| Process[Process Data]
    Validate -->|No| Error[Show Error Message]
    Error --> Input
    Process --> Save[(Save to Database)]
    Save --> Success[Show Success]
    Success --> End([End Process])
    
    subgraph Error Handling
      Error
      Input
    end`,
    errorPatterns: [
      {
        pattern: /arrow|-->|edge/i,
        message: "Connection issue",
        suggestion: "Use proper arrow syntax: A --> B for connections",
      },
      {
        pattern: /node|id/i,
        message: "Node naming issue",
        suggestion: 'Use simple names like A, B, Start. Complex labels need quotes: A["My Label"]',
      },
      {
        pattern: /subgraph/i,
        message: "Subgraph syntax error",
        suggestion: "Use: subgraph Title\\n  nodes here\\nend",
      },
      {
        pattern: /direction|td|lr/i,
        message: "Invalid direction",
        suggestion: "Use: graph TD, graph LR, graph BT, or graph RL",
      },
    ],
  },
  sequence: {
    title: "Sequence Diagrams",
    description: "Show interactions between actors over time in chronological order",
    syntax: [
      {
        label: "Participants",
        code: "participant A as Alice\nparticipant B as Bob\nparticipant S as System",
        desc: "Define all actors in your sequence before using them",
      },
      {
        label: "Message Types",
        code: "A->>B: Synchronous call\nA-->>B: Response\nA-)B: Asynchronous\nA-xB: Failed call",
        desc: "Different arrow styles show different interaction types",
      },
      {
        label: "Activation Boxes",
        code: "activate A\nA->>B: Process\ndeactivate A",
        desc: "Show when participants are actively processing",
      },
      {
        label: "Notes and Comments",
        code: "Note over A: Important note\nNote left of A: Left note\nNote right of B: Right note",
        desc: "Add explanatory information to your sequence",
      },
      {
        label: "Loops and Conditions",
        code: "loop Every minute\n  A->>B: Heartbeat\nend\nalt Success\n  B-->>A: OK\nelse Failure\n  B-->>A: Error\nend",
        desc: "Show repeated actions and conditional flows",
      },
    ],
    example: `sequenceDiagram
    participant U as User
    participant W as Web App
    participant A as Auth Service
    participant D as Database
    
    U->>W: Login Request
    activate W
    W->>A: Validate Credentials
    activate A
    A->>D: Check User
    activate D
    D-->>A: User Data
    deactivate D
    
    alt Valid User
        A-->>W: Auth Token
        W-->>U: Login Success
    else Invalid User
        A-->>W: Auth Failed
        W-->>U: Login Error
    end
    
    deactivate A
    deactivate W
    
    Note over U,D: User is now authenticated`,
    errorPatterns: [
      {
        pattern: /participant.*undefined/i,
        message: "Undefined participant",
        suggestion: "Define participants first: participant A as Alice",
      },
      {
        pattern: /message|arrow/i,
        message: "Message syntax error",
        suggestion: "Use: A->>B: Message text (note the colon after arrow)",
      },
      {
        pattern: /activate|deactivate/i,
        message: "Activation error",
        suggestion: "Use: activate A before messages, deactivate A after",
      },
      {
        pattern: /loop|alt|opt/i,
        message: "Control structure error",
        suggestion: "Use: loop condition\\n  messages\\nend or alt condition\\n  messages\\nend",
      },
    ],
  },
  journey: {
    title: "User Journey Diagrams",
    description: "Map user experiences, emotions, and satisfaction scores through a process",
    syntax: [
      {
        label: "Basic Structure",
        code: "journey\n    title My User Journey\n    section Section Name\n        Task Name: Score: Actor",
        desc: "Start with 'journey', add title, then sections with scored tasks",
      },
      {
        label: "Satisfaction Scores",
        code: "Login: 1: User\nBrowse: 3: User\nPurchase: 5: User",
        desc: "Scores from 1 (worst) to 5 (best) show user satisfaction",
      },
      {
        label: "Multiple Actors",
        code: "Support Call: 2: User, Support\nIssue Resolution: 4: User, Support",
        desc: "Show when multiple people are involved in a task",
      },
      {
        label: "Journey Sections",
        code: "section Discovery\n    Find Product: 4: User\nsection Purchase\n    Checkout: 2: User",
        desc: "Organize the journey into logical phases or stages",
      },
    ],
    example: `journey
    title Online Shopping Experience
    
    section Discovery
        Visit Website: 3: User
        Search Products: 4: User
        Read Reviews: 5: User
        Compare Options: 3: User
    
    section Decision
        Add to Cart: 4: User
        Review Cart: 3: User
        Apply Coupon: 5: User
    
    section Purchase
        Enter Details: 2: User
        Payment Process: 1: User
        Confirmation: 5: User
    
    section Post-Purchase
        Receive Product: 4: User
        Product Review: 3: User`,
    errorPatterns: [
      {
        pattern: /journey.*title/i,
        message: "Journey structure error",
        suggestion: "Start with: journey\\n    title Your Title Here",
      },
      {
        pattern: /section/i,
        message: "Section syntax error",
        suggestion: "Use: section Section Name (no colon needed)",
      },
      {
        pattern: /score|rating/i,
        message: "Score format error",
        suggestion: "Use: Task Name: Score: Actor (scores 1-5)",
      },
    ],
  },
}
