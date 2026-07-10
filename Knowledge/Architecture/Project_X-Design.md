---
tags: [architecture, design, system]
status: implemented
created: 2026-07-10
updated: 2026-07-10
related_projects: ["[[Projects/Project_X]]"]
---

# System Design: Project_X Memory System

## 1. Problem Statement

**AI coding agents (OpenCode) have no memory between sessions.** When you close the terminal and start a new session, the agent knows nothing about:
- What you were working on yesterday
- Architectural decisions made
- Bugs found and their fixes
- Project context and file relationships

**Goal:** Build a persistent memory system that survives session boundaries, requires zero running daemons, and is queryable.

## 2. Constraints

| Constraint | Impact |
|------------|--------|
| No OpenCode plugin system | Can't hook into session lifecycle |
| No daemon/worker guarantee | Can't auto-save on Ctrl+C or window close |
| Must work offline | No cloud storage, no network dependencies |
| Plain text first | Files readable without any tool |
| Graphify must integrate | Knowledge graphs + BFS/DFS queries |

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    OPencode Session                     │
│                                                         │
│  ┌──────────────┐    injects    ┌───────────────────┐  │
│  │  CLAUDE.md   │──────────────▶│   System Prompt    │  │
│  │  (global)    │               │   (AI context)     │  │
│  └──────┬───────┘               └─────────┬─────────┘  │
│         │ reads                          │              │
│         ▼                               ▼              │
│  ┌──────────────┐              ┌───────────────────┐   │
│  │  _index.md   │              │  AI knows:        │   │
│  │  (dashboard) │              │  - Active projects │   │
│  └──────┬───────┘              │  - Recent sessions │   │
│         │ links to             │  - Key decisions   │   │
│         ▼                      └───────────────────┘   │
│  ┌─────────────────────────┐                           │
│  │  Obsidian Vault          │                           │
│  │  ├── Sessions/           │◀── AI writes on goodbye  │
│  │  ├── Projects/           │                           │
│  │  ├── Decisions/           │                           │
│  │  ├── Knowledge/           │                           │
│  │  ├── Graphs/              │                           │
│  │  └── Templates/           │                           │
│  └─────────────────────────┘                           │
└─────────────────────────────────────────────────────────┘
```

## 4. Component Breakdown

### 4.1 Storage Layer — Obsidian Vault

**Location:** `C:\Users\Admin\Desktop\work\Project_X\`

**Why Obsidian:**
- Plain markdown files (no lock-in, git-friendly)
- Free graph visualization
- Wikilinks for cross-referencing (`[[linked note]]`)
- Dataview plugin for SQL-like queries over markdown
- Templates and Calendar plugins for daily notes

**Why not just plain directory:**
- No graph view
- No auto-linking
- Harder to navigate as vault grows

**Why not claude-mem only:**
- Claude Code specific, no OpenCode hooks
- Requires running daemon (bun worker)

### 4.2 Instruction Layer — CLAUDE.md

**Location:** `~/.claude/CLAUDE.md`

**How it works:**
1. OpenCode has Claude Code compatibility built-in
2. On session start, OpenCode reads `~/.claude/CLAUDE.md` and injects it into the system prompt
3. Instruction tells AI: "read `_index.md` silently at session start"

**Precedence (from OpenCode docs):**
```
Project AGENTS.md > Project CLAUDE.md
Global ~/.config/opencode/AGENTS.md > ~/.claude/CLAUDE.md
```

Our `~/.claude/CLAUDE.md` is loaded because:
- No `~/.config/opencode/AGENTS.md` exists
- `OPENCODE_DISABLE_CLAUDE_CODE` env var is not set

**Key instructions injected:**
```
## Session Start
At the beginning of every session, read _index.md silently

## Session End
Write session note → update project → create decisions → update _index.md
```

### 4.3 Dashboard — `_index.md`

Single source of truth for AI context. Contains:
- Dataview queries (for Obsidian UI)
- Plain-text dump section (for AI to read without Dataview)
- Quick links to all key areas

**Why both Dataview + plain text:**
- Dataview works inside Obsidian GUI
- Plain text works for AI reading outside Obsidian

### 4.4 Templates

| Template | Purpose | Key Fields |
|----------|---------|------------|
| `tpl-session.md` | 1 session = 1 file | date, time, project, what was done, decisions, files changed, next steps |
| `tpl-project.md` | 1 project = 1 file | name, stack, repo path, sessions (dataview), decisions (dataview) |
| `tpl-decision.md` | 1 decision = 1 file | options table, rationale, consequences, related sessions |
| `tpl-daily-log.md` | 1 day = 1 file | focus, progress, blockers, tomorrow |
| `tpl-error-log.md` | 1 error = 1 file | symptoms, root cause, fix, prevention |

### 4.5 Knowledge Graph — Graphify

**Integration points:**
1. Export code graphs to `Graphs/{project}/` via `--obsidian` flag
2. Embed graph summaries in project notes: `![[Graphs/project/_summary]]`
3. Query via `/graphify query "question"`

**Commands:**
```
/graphify <project> --obsidian --obsidian-dir "Graphs/<project>/"
/graphify query "how does auth flow work?"
/graphify Sessions/ --obsidian --obsidian-dir "Graphs/sessions/"
```

## 5. Session Lifecycle

```
┌── START ──────────────────────────────────────────┐
│ 1. OpenCode launches                               │
│ 2. Reads ~/.claude/CLAUDE.md → system prompt       │
│ 3. CLAUDE.md instructs: "read _index.md"           │
│ 4. AI reads _index.md → gets context               │
│    - Active projects                               │
│    - Recent sessions (last 10)                     │
│    - Key decisions (last 30 days)                  │
│ 5. AI ready with full context                      │
└────────────────────────────────────────────────────┘
                          │
┌── WORK ───────────────────────────────────────────┐
│ - AI uses context to answer questions about past   │
│ - /save-session → checkpoint mid-session           │
│ - /memory-status → show current state              │
│ - /save-decision "X" → quick decision capture      │
└────────────────────────────────────────────────────┘
                          │
┌── END ────────────────────────────────────────────┐
│ 1. Write Sessions/YYYY-MM-DD-HHmmss.md             │
│    - Follow tpl-session.md template                │
│    - Link to project, decisions                    │
│ 2. Update Projects/<project>.md                   │
│    - Append latest session summary                 │
│ 3. If decisions made:                              │
│    - Create Decisions/YYYY-MM-DD-title.md          │
│ 4. Update _index.md                                │
│    - Append to plain-text session dump              │
│ 5. (Optional) /graphify --update on sessions/      │
└────────────────────────────────────────────────────┘
```

## 6. Edge Cases

### 6.1 Starting a new project (unrelated to old work)
- Just tell AI: "new project, ignore previous context"
- AI still has background knowledge but focuses on new task
- Previous sessions remain for future reference

### 6.2 Multiple projects in parallel
- Each project gets its own `Projects/<name>.md`
- Sessions link to the relevant project
- `_index.md` shows all active projects

### 6.3 AI doesn't read _index.md on start
- Rare but possible if AI trims instructions
- Manual trigger: `/memory-status` or say "load memory"
- Fallback: `opencode.json` with `instructions` field auto-injects

### 6.4 Ctrl+C / Terminal close
- Memory is NOT auto-saved (no daemon to catch this)
- Mitigation: `/save-session` frequently (like git early and often)
- Long-term: could create an OpenCode custom command that saves on every prompt

### 6.5 Vault gets too large
- Session retention setting (90 days default)
- Archive old sessions to `Sessions/Archive/`
- Graphify can summarize clusters

## 7. Data Flow

```
CLAUDE.md ──(inject)──▶ System Prompt
                            │
                    (instructs to read)
                            │
                            ▼
_index.md ◀──(links to)── Projects/*.md
    │                           │
    │◀──(links to)── Sessions/*.md
    │                           │
    │◀──(links to)── Decisions/*.md
    │
    │◀──(embed)──── Graphs/*/_summary
    │
    └──(references)── Knowledge/**/*
```

## 8. Implementation Checklist

- [x] Create vault directory structure
- [x] Create 5 templates (session, project, decision, daily, error)
- [x] Create `_index.md` dashboard
- [x] Create `_settings.md` config
- [x] Create `_changelog.md`
- [x] Create `README.md`
- [x] Create `Projects/claude-mem.md`
- [x] Create `Projects/Project_X.md`
- [x] Create `.graphify-root`
- [x] Update `~/.claude/CLAUDE.md`
- [x] Save first 2 sessions
- [x] Create first decision
- [x] Create this design document
- [ ] Open Obsidian with vault
- [ ] Install Dataview plugin
- [ ] Install Templater plugin
- [ ] Build graphify graph for claude-mem
- [ ] Test cross-session memory (fresh OpenCode session)

## 9. Verbesserungspotential (Future Improvements)

| Idea | Priority | Effort |
|------|----------|--------|
| Graphify sessions folder for searchable history | Medium | Low |
| Add `/daily` command for daily standup | Low | Low |
| Auto-prune old sessions (90+ days) | Low | Medium |
| Git init the vault for version control | Medium | Low |
| Create OpenCode custom command for auto-save-on-prompt | High | Medium |
| Integrate claude-mem worker for background auto-save | Low | High |

## 10. Key Design Decisions

See also: [[Decisions/2026-07-10-obsidian-vault-for-memory]]

| Decision | Rationale |
|----------|-----------|
| Obsidian over plain directory | Free graph view + wikilinks |
| Manual instruction over auto-inject | Simpler, no config drift |
| Dataview + plain text hybrid | Works in both Obsidian and AI context |
| No daemon dependency | KISS — user triggers save explicitly |
| Markdown only | Universal, git-friendly, no lock-in |
