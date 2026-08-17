---
tags: [system, index]
auto_update: true
---

# Nexus — Personal Context & Knowledge Vault

> **Single Source of Truth:** `[[Shared/AI-Context-Index]]`
> **Master Agent Rules:** `AGENTS.md` (4-Step Engineering Workflow & Action-First Persona)

---

## 🚀 Active Projects

- [[Projects/SaiJai-Phareab|SaiJai-Phareab]] — Laundry storefront SaaS (Nuxt 4 + LINE Bot + Prisma)
- [[Projects/personal-finance-tracker|Personal Finance Tracker]] — React Bento Grid + Fastify + Supabase
- [[Projects/claude-mem|claude-mem]] — Persistent memory plugin (v13.4.0)
- [[Projects/Project_Y/_Index|Project_Y]] — Stock support/resistance web app (Nuxt + Express + Supabase)
- [[Projects/Nuxt-App|Nuxt-App]] — Nuxt 4 + Vue 3.5 + TailwindCSS 4
- [[Projects/y|y (Next.js)]] — Next.js 15 + React 19 + TailwindCSS 4

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
| `Projects/` | ข้อมูลและสถานะของแต่ละโปรเจกต์ |
| `Sessions/` | บันทึกประวัติการทำงานย้อนหลัง (Action-first logs) |
| `Knowledge/` | สถาปัตยกรรมระบบ (Architecture) และงานวิจัย (Research) |
| `Decisions/` | บันทึกการตัดสินใจเชิงสถาปัตยกรรม (ADRs) |
| `Shared/` | ข้อมูลระบบส่วนกลาง (Current State, Tasks, User Memory) |
| `Skills/` | การตั้งค่าและอ้างอิงสกิล AI |
| `Templates/` | แม่แบบเอกสารมาตรฐาน |

---

## 💡 Knowledge Graph
- **Vault Graph:** `/graphify "." --obsidian --obsidian-dir "Graphs\nexus"`
