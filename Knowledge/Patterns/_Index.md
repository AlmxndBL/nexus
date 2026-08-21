---
tags: [knowledge, patterns, gotchas, index]
note_type: pattern-index
created: 2026-08-19
updated: 2026-08-22
parent: "[[Knowledge/_Index]]"
---

# 🧩 Patterns & Gotchas Index

> คลังความรู้สถาปัตยกรรม ข้อควรระวัง (Gotchas) และข้อห้าม (Anti-Patterns) แยกตาม Tech Stack
> รวบรวมจากประวัติการทำงานจริงใน Nexus และระบบ Apex Agent Framework

---

## ⚠️ Gotchas & Anti-Patterns (แยกตาม Stack)

| Tech Stack / Topic | Tags | Description | Link |
|---|---|---|---|
| **E-Sports Platform & Multi-Tenant RBAC** | `stack/nuxt4`, `stack/prisma`, `multi-tenant` | Prisma 7 Supabase pooler (`DIRECT_URL`), Layout separation, Spectator polling & Tab visibility, Theme overrides | [[gotchas-esport-tournament-platform\|E-Sports Tournament Gotchas]] |
| **Nuxt 4 + Nitro + Vue 3** | `stack/nuxt4`, `stack/vue`, `runtime/nitro` | ข้อควรระวัง Timezone (+7), Chart.client.vue, Webhook fast-ACK, Decoupled Scheduling, Cache Invalidation | [[gotchas-nuxt4-nitro\|Nuxt 4 Gotchas]] |
| **Next.js 15 + React 19 + App Router** | `stack/nextjs`, `stack/react`, `runtime/rsc` | ข้อควรระวัง Server Actions Public Endpoint, RSC Boundary Serialization, Hydration Mismatch, Caching Defaults | [[gotchas-react-nextjs\|Next.js & React Gotchas]] |
| **Prisma 7 + PostgreSQL + Supabase** | `stack/prisma`, `stack/postgres`, `stack/database` | Connection pool exhaustion, Interactive Transaction timeout, Decimal currency math, UTC+7 Date queries | [[gotchas-prisma-postgres\|Prisma & Postgres Gotchas]] |
| **Docker & DevOps Infrastructure** | `infra/docker`, `infra/devops`, `infra/ci-cd` | Multi-stage build caching, Alpine vs Debian native bindings (Prisma/Bcrypt), Compose healthchecks, Non-root user | [[gotchas-docker-devops\|Docker & DevOps Gotchas]] |
| **Next.js 15 + TradingView + Yahoo Finance** | `stack/nextjs`, `stack/react`, `chart/lightweight` | ข้อควรระวังเรื่อง Lightweight Charts `time` field, Next.js Standalone EPERM บน Windows, Yahoo Finance v4 Date | [[gotchas-nextjs-tradingview\|Next.js & TradingView Gotchas]] |
| **Database & API Performance** | `stack/prisma`, `stack/nextjs`, `performance/database` | N+1 Sequential Waterfall, Composite Indexes, SWR Choke, Noisy Logging | [[database-and-api-performance-gotchas\|DB & API Performance Gotchas]] |
| **TypeScript & Coding Logic** | `stack/universal`, `stack/typescript`, `stack/vue` | ข้อผิดพลาด async forEach, Race condition search, reactive destructure, Memory leaks, Nullish coalescing `??` | [[gotchas-coding-and-typescript\|TypeScript & Coding Gotchas]] |
| **Thai Typography & Micro-UI** | `stack/universal`, `ui/typography`, `stack/tailwind` | สระภาษาไทยชนกัน, Bounding Box Clearance, สูตรเรขาคณิตคำนวณ Slider Toggle | [[gotchas-thai-typography-and-custom-ui\|Thai Typography & UI Gotchas]] |
| **Windows Dev Environment** | `stack/universal`, `os/windows` | ข้อควรระวังเรื่อง Robocopy `/XD` `/XF`, Exit codes 0-7, `npm run` CMD, Worker Detached | [[gotchas-windows-dev\|Windows Dev Gotchas]] |
| **AI Agents & Memory Harness** | `stack/universal`, `ai/memory` | ข้อควรระวังเรื่อง Single-committer Git, Slug naming, Token diet, Graphify | [[gotchas-ai-memory-tools\|AI Memory Gotchas]] |
| **Security Anti-Patterns** | `stack/universal`, `sec/owasp` | ข้อห้ามเรื่อง Hardcoded Secrets, SQLi, Missing Authorization, Broken Object Level Auth | [[anti-patterns-security\|Security Anti-Patterns]] |
| **Monolithic Routing & God Dashboard** | `architecture/routing`, `pattern/anti-pattern` | ข้อห้ามเรื่อง God Dashboard รวมทุก Domain ไว้ใน Route เดียว, ผลกระทบ API Waterfall & RBAC | [[anti-patterns-architecture-and-routing\|Monolithic Routing Anti-Patterns]] |
| **Visual Reference & Scope Control** | `agent/workflow`, `pattern/scope-control` | แนวทางการถอดความต้องการจากภาพ UI Reference, 3-Tier Classification, ป้องกัน Scope Creep | [[agent-collaboration-and-scope-patterns\|Visual Reference Scope Patterns]] |

---

## 🏛️ System Blueprints (สถาปัตยกรรมพร้อมใช้)

- [[Knowledge/Architecture/idempotent-webhook-receiver-with-hmac-signature|Idempotent Webhook Receiver with HMAC Signature]]
- [[Knowledge/Architecture/enterprise-workspace-header-and-sidebar-deduplication-pattern|Enterprise Workspace Header & Sidebar Deduplication]]
- [[Knowledge/Architecture/universal-table-multi-select-and-floating-bulk-action-bar|Universal Table Multi-Select & Floating Action Bar]]
- [[Knowledge/Architecture/nuxt-4-nitro-server-module-import-resolution|Nuxt 4 Nitro Server Module Import Resolution]]

---

up:: [[Knowledge/_Index]]
