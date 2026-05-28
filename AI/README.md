## AI

### MCP

- It gives the AI the ability to fetch context, use tools on demand to provide more accurate and relevant answers. i.e for MUI MCP, without it, AI might not provide the accurate answer - might provide outdated code snippets. With it, it can query the latest documentation to return more accurate and up-to-date answers.
- A MCP server lets AI connect to it. `AI → MCP Server → Tool → Result → AI`
- Transport for client/server comms mechanisms is stdio.
- Common coding agent like opencode already implements mcp client.
- Simple workflow

```
User request:

“Build a login form using MUI”

MCP client does:

Ask server:
  list_components
Ask:
  get_component_docs(Button)
Ask:
  get_component_docs(TextField)

Send all results to model
Model generates React code
```

### AGENTS.md

- Think of AGENTS.md as a README for agents
- It is usually loaded once per session, not repeatedly per action, unless your specific agent framework explicitly supports dynamic reloading.

### SKILLS.md

Provide agent tooling information to guide its task execution. Guarantee deterministic process.

### INSTRUCTIONS.md (github copilot)

Pattern and guideline agent should follow when **generating** or **modifying** existing codebase. i.e you want double quotes to be used when it generates our code.


### Memory


