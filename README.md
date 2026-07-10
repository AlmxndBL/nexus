# Project_X — Persistent Memory System for AI Coding Agents

Turn any coding session into a searchable, linked graph of knowledge. Built on Obsidian + Markdown.

## What It Does

- **Remembers across sessions** — context persists even when you close the terminal
- **Links everything** — sessions → projects → decisions → code (via wikilinks)
- **Queryable** — find past work with Obsidian search + Dataview queries
- **Visual** — Obsidian graph view shows all connections at once
- **Zero dependencies** — plain Markdown, works offline

## Tech Stack

| Layer | Tech | Role |
|-------|------|------|
| Storage | Obsidian Vault (Markdown) | All notes, templates, links |
| AI Agent | OpenCode / Claude Code | Reads context at start, writes summary at end |
| Search | Dataview + Obsidian Search | Dynamic queries across vault |
| Graph | Obsidian Graph View + Graphify (optional) | Interactive visual graph |

## Directory Structure

```
Project_X/
├── _index.md                    # Master dashboard (injected into every session)
├── _settings.md                 # System configuration
├── _changelog.md                # System evolution log
├── CLAUDE.md                    # AI instructions (copy to ~/.claude/)
├── Templates/                   # Note templates (5 templates)
├── Sessions/                    # 1 file per coding session
├── Projects/                    # 1 file per project
├── Decisions/                   # Key architectural decisions
├── Knowledge/                   # Curated knowledge base
│   ├── Architecture/
│   ├── Patterns/
│   ├── Tools/
│   └── References/
├── Daily/                       # Daily stand-up logs
├── Graphs/                      # Knowledge graph exports (optional)
└── Attachments/                 # Screenshots, PDFs, binaries
```

## How It Works

### Session Start
1. AI reads `_index.md` → gets active projects, recent sessions, key decisions
2. AI knows context automatically — no need to re-explain

### During Session
- `/save-session` — checkpoint mid-session
- `/memory-status` — see current vault state
- `/save-decision "title"` — quick decision capture

### Session End
1. AI writes session note to `Sessions/YYYY-MM-DD-HHmm-slug.md`
2. Updates `Projects/<project>.md` with latest summary
3. Creates `Decisions/` if any decisions were made
4. Updates `_index.md` recent sessions

## Getting Started

### 1. Clone this repo
```bash
git clone <repo-url> ~/work/Project_X
```

### 2. Install CLAUDE.md instructions
```bash
mkdir -p ~/.claude
cp ~/work/Project_X/CLAUDE.md ~/.claude/CLAUDE.md
```
Edit the file — replace `{{VAULT_PATH}}` with your vault path.

### 3. Open in Obsidian
Open `~/work/Project_X` as a vault.

### 4. Install Recommended Obsidian Plugins
- **Dataview** — dynamic queries in _index.md
- **Templater** — auto-fill `{{date}}`, `{{time}}`, `{{title}}`

### 5. Start coding
Just use your AI coding agent. It reads `_index.md` for context automatically.

## Commands Reference

| Command | What It Does |
|---------|-------------|
| `/save-session` | Write session checkpoint |
| `/memory-status` | Show vault state (projects, sessions) |
| `/save-decision "X"` | Quick decision capture |

## Design Principles

- **Plain text always** — every file is readable without tools
- **Wikilinks everywhere** — sessions, projects, decisions all linked
- **No external dependencies** — works offline, no databases, no servers
- **Obsidian as UI** — graph view, search, and plugins for free
- **Portable** — copy the folder, you have everything

## First Session

After setup, your first session will:
1. AI reads `_index.md` — sees empty state, ready for new project
2. You work normally
3. On goodbye → AI writes first session note, updates everything

Memory accrues session by session. Give it 5-10 sessions and you'll have a searchable history of every decision, fix, and discovery.
