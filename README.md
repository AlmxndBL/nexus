# 🏛️ Nexus 2.0 — Active Personal Engineering OS & Memory Vault

> **Personal Context, Project Hub, Cross-Project Gotchas & Universal MCP Bridge**
> ส่วนขยายหน่วยความจำระยะยาว (Long-Term Memory) และคลังบทเรียนข้อผิดพลาดข้ามโปรเจกต์ (Stack-Aware Gotchas) ทำงานผสานรวมกับ [Master Agent Skill Rules](https://github.com/AlmxndBL/agent-skill)

![v2.3.0](https://img.shields.io/badge/v2.3.0-blue.svg) ![Status](https://img.shields.io/badge/status-active-00DC82.svg) ![MCP](https://img.shields.io/badge/MCP-enabled-818CF8.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🏛️ สถาปัตยกรรมคู่หู: Nexus 2.0 & Agent-Skill (The Twin-Engine Synergy)

Nexus 2.0 และ [agent-skill](https://github.com/AlmxndBL/agent-skill) ถูกออกแบบขึ้นคู่กันเพื่อสร้าง **Developer Productivity & AI Agent Framework** ระดับ Production-Ready:

```text
┌─────────────────────────────────────────────────────────────────┐
│         🤖 Developer Productivity & AI Agent Framework          │
├────────────────────────────────┬────────────────────────────────┤
│ 🏛️ Nexus 2.0 (Memory Vault)   │ 🧠 Master Agent Skill Rules    │
│ (Context & Engineering Memory) │ (Rules & Behavioral Engine)    │
├────────────────────────────────┼────────────────────────────────┤
│ • Cross-Project Memory Vault   │ • 6 เสาหลักมาตรฐานวิศวกรรม     │
│ • Stack-Aware Gotchas Library  │ • Strict TS (Matt Pocock)      │
│ • JIT Context Compiler         │ • Universal Definition of Done  │
│ • Universal MCP Tools (8 tools)│ • Closed-Loop Memory Protocols │
│ • บันทึก ADRs & Session Auto   │ • 🛡️ Git Shield ป้องกันหลุด    │
└────────────────────────────────┴────────────────────────────────┘
```

- **`agent-skill`** ทำหน้าที่เป็น **สมองและกฎระเบียบ (The Rules Engine):** ควบคุมให้ AI เขียนโค้ดตามมาตรฐานความปลอดภัย, Strict TypeScript, Zero Fluff และมี Definition of Done
- **`Nexus 2.0`** ทำหน้าที่เป็น **ความจำและระบบปฏิบัติการ (The Memory OS):** จัดเก็บสถานะโปรเจกต์, ประวัติการตัดสินใจ (ADRs), คลังข้อควรระวังข้ามภาษา (Gotchas), และเชื่อมต่อเข้ากับ AI IDE ผ่าน Universal MCP Server

---

## ⚡ 5 เสาหลักของ Nexus 2.0 (Core Pillars)

1. **⚠️ Stack-Aware Gotchas Library (`Knowledge/Patterns/`):**
   - คลังรวบรวมข้อควรระวังและบั๊กจริงที่สกัดจากประวัติการทำงาน (Nuxt 4, Prisma, Windows Dev, Security)
   - ใช้ระบบ **Frontmatter Tagging** (`stack/nuxt4`, `stack/prisma`, `stack/universal`) เพื่อให้ AI โหลดเฉพาะกฎที่ตรงกับโปรเจกต์ ป้องกันปัญหา Context Contamination และไม่เปลือง Token
2. **🔌 Universal MCP Server:** เชื่อมต่อ Memory Vault เข้ากับ Google Antigravity, Cursor, Claude Code, Windsurf ผ่าน MCP Tools:
   - `nexus_get_state` — ดึง Operating State ปัจจุบันและ Task Queue
   - `nexus_get_project_brief` — ดึง Context บรีฟของโปรเจกต์ที่ระบุในรูปแบบ High-Density
   - `nexus_save_session` — บันทึกประวัติ Session จบงานเข้า Vault
   - `nexus_record_decision` — บันทึก Architecture Decision Record (ADR)
   - `nexus_synthesize_pattern` — สกัด Production Blueprint ส่งเข้า `agent-skill`
   - `nexus_doctor` — ตรวจสอบสุขภาพและคุณภาพของ Codebase ตามมาตรฐาน 6 เสาหลัก
3. **🔄 Closed-Loop Memory Engine:** สแกน Git Diff และบันทึก Session Log + อัปเดตสถานะงานอัตโนมัติเมื่อสั่ง Checkpoint
4. **🎯 JIT Context Compiler:** รวบรวมบริบทโปรเจกต์ + ADRs + Tech Stack เป็น High-Density Prompt ภายใน 1 วินาที ลดภาระ Token Consumption
5. **🧬 Cross-Project Pattern Synthesizer:** สกัดโค้ดจริงที่ทดสอบผ่านแล้ว ส่งเข้าไปเป็น Reusable Blueprints ใน [`agent-skill/templates/blueprints/`](https://github.com/AlmxndBL/agent-skill/tree/master/templates/blueprints)

---

## 📌 โครงสร้างระบบ (Vault & Engine Structure)

```text
Nexus/
├── _index.md                  # Quick Dashboard & Current Focus
├── AGENTS.md                  # Master Agent Operating Rules
├── CLAUDE.md                  # System Constitution & Engineering Standards
├── USER.md                    # Owner Preferences & Personal Tone
├── Vault Structure Map.md     # แผนผังและขอบเขตหน้าที่ของโฟลเดอร์
│
├── bridge/                    # 🚀 Nexus 2.0 Engine & MCP Server (Node.js + TS)
│   ├── src/core/compiler.ts   # 🎯 JIT Context Compiler
│   ├── src/core/checkpoint.ts # 🔄 Closed-Loop Memory Engine
│   ├── src/core/synthesizer.ts# 🧬 Cross-Project Pattern Synthesizer
│   └── src/mcp-server.ts      # 🔌 Universal MCP Server
│
├── Knowledge/
│   └── Patterns/              # 🌍 [Public] คลัง Gotchas & System Blueprints
│       ├── _Index.md          # สารบัญกลางเชื่อมโยง Gotchas
│       ├── gotchas-nuxt4-nitro.md     # ข้อควรระวัง Nuxt 4 + Nitro + Vue 3
│       ├── gotchas-prisma-postgres.md # ข้อควรระวัง Prisma & Database
│       ├── gotchas-windows-dev.md     # ข้อควรระวัง Windows Path, Robocopy, PTY
│       ├── gotchas-ai-memory-tools.md # ข้อควรระวัง AI Agents & Single-committer Git
│       └── anti-patterns-security.md  # กฎเหล็ก OWASP & Secrets Prevention
│
├── Decisions/                 # 🔒 [Local] บันทึกการตัดสินใจทางสถาปัตยกรรม (ADRs)
├── Projects/                  # 🔒 [Local] บรีฟและสถานะแต่ละโปรเจกต์ (Active / Maintenance)
├── Sessions/                  # 🔒 [Local] ประวัติการทำงานย้อนหลัง (Action-First Session Logs)
├── Shared/                    # 🔒 [Local] ข้อมูลส่วนกลาง (Operating State, Task Queue)
└── Templates/                 # 📐 แม่แบบเอกสารมาตรฐานสำหรับ Obsidian
```

---

## 🛠️ วิธีนำ Gotchas ไปใช้งานและเพิ่มภาษาใหม่ (How to use & extend Gotchas)

### 1. วิธีเพิ่ม Gotchas สำหรับภาษาหรือเฟรมเวิร์กใหม่
หากต้องการเพิ่มข้อควรระวังสำหรับ Stack อื่น ๆ (เช่น Python, Flutter, Go, Next.js):
1. สร้างไฟล์ใหม่ใน `Knowledge/Patterns/gotchas-<stack>.md`
2. ใส่ Frontmatter Tag ที่หัวไฟล์:
   ```yaml
   ---
   tags: [knowledge, gotchas, stack/fastapi, stack/python]
   note_type: gotcha-collection
   stack: fastapi
   created: 2026-08-19
   ---
   ```
3. บันทึกเนื้อหาแบบ Micro-Lessons (Trigger $\rightarrow$ ❌ ห้ามทำ $\rightarrow$ ✅ วิธีที่ถูก)
4. AI จะจับคู่กับโปรเจกต์ที่ตรงกับ Tag นั้นให้อัตโนมัติ!

---

## 🚀 Quick Commands (CLI)

```bash
# 1. ตรวจสอบสถานะภาพรวมและงานค้างใน Task Queue
node bridge/dist/cli.js status

# 2. เสิร์ฟบริบทโปรเจกต์แบบ High-Density JIT Context
node bridge/dist/cli.js brief [ProjectName]

# 3. บันทึก Checkpoint จบงาน (Auto Git Commit & Session Log)
node bridge/dist/cli.js checkpoint [ProjectName] "[Work Summary]"

# 4. เริ่มรัน Universal MCP Server
node bridge/dist/mcp-server.js
```

---

## 🔗 Repository Links & Ecosystem

- **Master Agent Skill Rules:** 👉 [AlmxndBL/agent-skill](https://github.com/AlmxndBL/agent-skill)
- **Nexus 2.0 Memory Vault:** 👉 [AlmxndBL/nexus](https://github.com/AlmxndBL/nexus)
- **Developer Profile:** 👉 [AlmxndBL](https://github.com/AlmxndBL)

