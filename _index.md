---
tags: [system, index]
auto_update: true
---

# Nexus — Personal Context & Knowledge Vault

> **Single Source of Truth:** `[[Shared/AI-Context-Index]]`
> **Master Agent Rules:** `AGENTS.md` (4-Step Engineering Workflow & Action-First Persona)
> **Engineering Engine:** `[[Projects/Apex-core|Apex-core]]` (6-Pillar Rules Engine)

---

## 🚀 Active Projects Hub

- [[Projects/esport-draw-nuxt|esport-draw-nuxt]] — E-Sports Tournament Platform (Nuxt 4 + Nuxt UI 4 + Prisma 7 + Supabase)
- [[Projects/SaiJai-Phareab|SaiJai-Phareab]] — Laundry storefront SaaS (Nuxt 4 + Better Auth + LINE Bot + Prisma 7)
- [[Projects/demo-log-management|demo-log-management]] — Enterprise Log Management & Ingestion (Nuxt 4 + Supabase + Vitest)
- [[Projects/dorm-management|dorm-management]] — Dormitory & Room Billing SaaS (Nuxt 4 + PromptPay QR + Prisma 7)
- [[Projects/line-booking-saas|line-booking-saas]] — Multi-tenant LINE Booking SaaS (Node.js + Fastify + LINE OA)
- [[Projects/personal-finance-tracker|Personal Finance Tracker]] — React Bento Grid + Fastify + Supabase
- [[Projects/Project_Y/_Index|Project_Y]] — Stock support/resistance web app (Nuxt 4 + Express + Supabase)
- [[Projects/Mini-Leave-Management-System|Mini-Leave-Management-System]] — Enterprise Leave Portal (.NET 8 + Angular + EF Core)
- [[Projects/Apex-core|Apex-core]] — Production AI Coding Agent Framework (6 Pillars + Git Shield)
- [[Projects/Nexus|Nexus 2.0]] — Active Personal Engineering OS & Universal MCP Bridge

```dataview
TABLE status, stack, created
FROM "Projects"
WHERE status = "active"
SORT created DESC
```

---

## 📋 Task & State Quick Access

- 🎯 **Current Focus:** `[[Shared/Operating-State/current-state]]`
- 📋 **Task Queue:** `[[Shared/Task-Queue/current-tasks]]`
- 👤 **Owner Preferences:** `[[Shared/User-Memory/user-preferences]]`
- 🛡️ **Protected Facts:** `[[Shared/Core-Facts/protected-facts]]`
- 🧩 **Patterns & Gotchas:** `[[Knowledge/Patterns/_Index]]`

---

## 🕒 Recent Sessions

```dataview
TABLE project, summary, date
FROM "Sessions"
SORT date DESC
LIMIT 10
```

---

## 🏛️ Vault Navigation

| โฟลเดอร์ | หน้าที่ |
|---|---|
| `Projects/` | ข้อมูลและสถานะของแต่ละโปรเจกต์ (Hub) |
| `Sessions/` | บันทึกประวัติการทำงานย้อนหลัง (Action-first logs) |
| `Knowledge/` | สถาปัตยกรรมระบบ (Architecture), Gotchas (Patterns) และงานวิจัย (Research) |
| `Decisions/` | บันทึกการตัดสินใจเชิงสถาปัตยกรรม (ADRs) |
| `Shared/` | ข้อมูลระบบส่วนกลาง (Current State, Tasks, User Memory, Core Facts) |
| `Templates/` | แม่แบบเอกสารมาตรฐาน |

---

## 💡 Knowledge Graph
- **Vault Graph:** `/graphify "." --obsidian --obsidian-dir "Graphs\nexus"`
