---
aliases: [example]
tags: [project]
status: active
created: {{date}}
---

# Project: {{title}}

## Overview
Brief description of the project.

## Stack
- **Language:** 
- **Runtime:** 
- **Framework:** 
- **Database:** 

## Repo
- **Path:** `~/projects/example`
- **Remote:** (GitHub/GitLab URL)

## Latest Activity
Summary of most recent work.

## Sessions
```dataview
TABLE date, summary
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
![[Graphs/example/_summary]]
