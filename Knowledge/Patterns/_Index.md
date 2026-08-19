---
tags: [knowledge, patterns, gotchas, index]
note_type: pattern-index
created: 2026-08-19
updated: 2026-08-19
parent: "[[Knowledge/_Index]]"
---

# 🧩 Patterns & Gotchas Index

> คลังความรู้สถาปัตยกรรม ข้อควรระวัง (Gotchas) และข้อห้าม (Anti-Patterns) แยกตาม Tech Stack
> รวบรวมจากประวัติการทำงานจริง 43 Sessions ใน Nexus และ 16 แหล่งข้อมูลของระบบ

---

## ⚠️ Gotchas & Anti-Patterns (แยกตาม Stack)

| Tech Stack / Topic | Tags | Description | Link |
|---|---|---|---|
| **Next.js 15 + TradingView + Yahoo Finance** | `stack/nextjs`, `stack/react`, `chart/lightweight` | ข้อควรระวังเรื่อง Lightweight Charts `time` field, Next.js Standalone EPERM บน Windows, และ Yahoo Finance v4 `period1` Date | [[gotchas-nextjs-tradingview\|Next.js & TradingView Gotchas]] |
| **Nuxt 4 + Nitro + Vue 3** | `stack/nuxt4`, `stack/vue`, `runtime/nitro` | ข้อควรระวัง Timezone (+7), Chart.client.vue, Webhook reply, Decoupled Scheduling | [[gotchas-nuxt4-nitro\|Nuxt 4 Gotchas]] |
| **Prisma + PostgreSQL** | `stack/prisma`, `stack/postgres`, `stack/database` | ข้อควรระวัง Connection pool, Transaction timeout, Expand-and-contract migration | [[gotchas-prisma-postgres\|Prisma & Postgres Gotchas]] |
| **Database & API Performance** | `stack/prisma`, `stack/nextjs`, `performance/database` | N+1 Sequential Waterfall, Composite Indexes, SWR Choke, Noisy Logging | [[database-and-api-performance-gotchas\|DB & API Performance Gotchas]] |
| **Windows Dev Environment** | `stack/universal`, `os/windows` | ข้อควรระวังเรื่อง Robocopy `/XD` `/XF`, Exit codes 0-7, `npm run` CMD, Worker Detached | [[gotchas-windows-dev\|Windows Dev Gotchas]] |
| **AI Agents & Memory Harness** | `stack/universal`, `ai/memory` | ข้อควรระวังเรื่อง Single-committer Git, Slug naming, Token diet, Graphify | [[gotchas-ai-memory-tools\|AI Memory Gotchas]] |
| **Security Anti-Patterns** | `stack/universal`, `sec/owasp` | ข้อห้ามเรื่อง Hardcoded Secrets, SQLi, Missing Authorization | [[anti-patterns-security\|Security Anti-Patterns]] |

---

## 🏛️ System Blueprints (สถาปัตยกรรมพร้อมใช้)

- _(เพิ่ม Blueprints ผ่านคำสั่ง `nexus_synthesize_pattern` หรือสร้างไฟล์ในโฟลเดอร์นี้)_
