---
date: 2026-07-10
tags: [decision, example]
status: accepted
related_projects: ["[[Projects/_example-project]]"]
related_sessions: ["[[Sessions/_example-session]]"]
---

# Decision: Example Decision Title

## Context
Background information about why this decision was needed.

## Options Considered

| Option | Pros | Cons | Cost |
|--------|------|------|------|
| Option A | Simple, well-known | Limited scalability | Low |
| Option B | High performance, scalable | Complex setup | High |
| Option C | Balanced approach | Moderate learning curve | Medium |

## Decision
Chose Option C because it provides the best balance of simplicity and future scalability.

## Rationale
- Team is already familiar with the underlying technology
- Scales well enough for our expected growth (12-18 months)
- Community support and documentation are strong

## Consequences
- Initial setup takes ~2 days longer than Option A
- May need migration if we grow beyond 10x current scale
- Positive: faster onboarding for new team members vs Option B

## Related
- Session: [[Sessions/_example-session]]
- Project: [[Projects/_example-project]]
