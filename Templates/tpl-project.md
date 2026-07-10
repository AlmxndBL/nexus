---
aliases: []
tags: [project]
status: active
created: {{date}}
---

# Project: {{title}}

## Overview
*(1 paragraph — what is this project?)*

## Stack
- **Language:** 
- **Framework:** 
- **Database:** 
- **Tools:** 

## Repo
- **Path:** 
- **Remote:** 

## Key Files / Entry Points
- `src/` — 
- `config/` — 

## Active Branches
- `main` — 
- `feature/` — 

## Sessions
```dataview
TABLE date, project
FROM "Sessions"
WHERE contains(file.outlinks, this.file.link)
SORT date DESC
LIMIT 20
```

## Linked Decisions
```dataview
TABLE status, date
FROM "Decisions"
WHERE contains(file.outlinks, this.file.link)
SORT date DESC
```

## Architecture Notes
- [[Knowledge/Architecture/...]]

## Graph
![[Graphs/{{title}}/_summary]]
