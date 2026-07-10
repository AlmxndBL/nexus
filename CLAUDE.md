# project-x-memory
Session memory system for persistent context across AI coding sessions using Obsidian vault + Graphify.

**Vault:** `{{VAULT_PATH}}` — replace with your vault location.

## Session Start
At the beginning of every session, read `{{VAULT_PATH}}/_index.md` silently to load:
- Active projects and their status
- Recent sessions (last 10)
- Key decisions from last 30 days
- Today's tasks

## Session End
When the user ends the session or says goodbye (or trigger `/save-session`):
 1. Write session note to `{{VAULT_PATH}}/Sessions/YYYY-MM-DD-HHmm-slug.md`
    - Format: timestamp + short English slug (e.g. `2026-07-10-1545-system-tab-wiring.md`)
    - Use template from `Templates/tpl-session.md` — fill in `summary` frontmatter with brief 1-liner
    - Include: date, project, summary, files changed, decisions, next steps
2. Update `Projects/<project>.md` with latest activity summary
3. If any decisions were made → create `Decisions/YYYY-MM-DD-title.md` using template
4. Update `_index.md` — append to "Current State" section
5. Update `_changelog.md` if system-level changes

## Memory Commands
- `/save-session` — checkpoint: write session note now without ending session
- `/memory-status` — show current vault state (active projects, recent sessions)
- `/save-decision "<title>"` — quick decision capture

## Graphify Commands
- `/graphify <project-path> --obsidian --obsidian-dir "{{VAULT_PATH}}/Graphs/<project-name>"` — Build knowledge graph
- `/graphify "{{VAULT_PATH}}/Sessions" --obsidian --obsidian-dir "{{VAULT_PATH}}/Graphs/sessions"` — Graph sessions
- `/graphify query "<question>"` — Query existing knowledge graph

## Templates
- Session: `Templates/tpl-session.md`
- Project: `Templates/tpl-project.md`
- Decision: `Templates/tpl-decision.md`
- Daily log: `Templates/tpl-daily-log.md`
- Error log: `Templates/tpl-error-log.md`
