---
tags: [system, index]
auto_update: true
---

# Project_X — Memory System Index

> Auto-injected into every AI coding session via CLAUDE.md

## Active Projects

```dataview
TABLE status, stack, created
FROM "Projects"
WHERE status = "active"
SORT created DESC
```

## Recent Sessions

```dataview
TABLE project, summary, date
FROM "Sessions"
SORT date DESC
LIMIT 10
```

## Key Decisions (Last 30 Days)

```dataview
TABLE status, date
FROM "Decisions"
WHERE date > date(today) - dur(30 days)
SORT date DESC
```

## Today's Tasks

```dataview
TASK
FROM "Daily"
WHERE !completed AND date = date(today)
```

---

## Current State (session-end dump)

**Active Projects:**
- (None yet — create your first project with `Projects/` template)

**Last Session:**
- (None yet — your first session will appear here)

---

## Quick Links

- [[_settings|System Settings]]
- [[_changelog|Changelog]]
- [[Templates/|Templates]]
- [[Projects/|Projects]]
- [[Knowledge/|Knowledge Base]]
