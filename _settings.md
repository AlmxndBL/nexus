---
tags: [system, config]
---

# System Settings

## Project_X Configuration

| Setting | Value | Description |
|---------|-------|-------------|
| `vault_path` | `~/work/Project_X` | Path to Obsidian vault |
| `session_retention_days` | 90 | Auto-archive sessions older than this |
| `max_context_sessions` | 10 | Max sessions shown in _index.md |
| `auto_graphify` | false | Auto-build knowledge graph on save |

## Graphify Settings

```json
{
  "obsidian_dir": "~/work/Project_X/Graphs",
  "projects": []
}
```

## Tracked Projects

```json
[]
```

## Required Obsidian Plugins
- **Dataview** — for dynamic queries in _index.md
- **Templater** — for template variable replacement ({{date}}, {{time}}, {{title}})

## Path Conventions
- Use `~` for home directory (cross-platform)
- All paths relative to vault root unless specified
