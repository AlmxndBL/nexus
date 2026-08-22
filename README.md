# 🏛️ Nexus 2.0 — Active Personal Engineering OS, Memory Vault & Plugins Hub

> **Personal Context, Project Hub, Cross-Project Gotchas, Personal Plugins & Universal MCP Bridge**
> ส่วนขยายหน่วยความจำระยะยาว (Long-Term Memory), ศูนย์รวมปลั๊กอินเฉพาะทาง (Personal Plugins Hub) และคลังบทเรียนข้อผิดพลาดข้ามโปรเจกต์ (Stack-Aware Gotchas) ทำงานผสานรวมกับ [Apex Agent Framework](https://github.com/AlmxndBL/Apex-core)

![v2.4.0](https://img.shields.io/badge/v2.4.0-blue.svg) ![Status](https://img.shields.io/badge/status-active-00DC82.svg) ![MCP](https://img.shields.io/badge/MCP-enabled-818CF8.svg) ![Plugin](https://img.shields.io/badge/Plugin--Hub-ready-FF79C6.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🏛️ สถาปัตยกรรมคู่หู: Nexus 2.0 & Apex (The Twin-Engine Synergy)

Nexus 2.0 และ [Apex](https://github.com/AlmxndBL/Apex-core) ถูกออกแบบขึ้นคู่กันเพื่อสร้าง **Developer Productivity & AI Agent Framework** ระดับ Production-Ready:

```text
┌─────────────────────────────────────────────────────────────────┐
│         🤖 Developer Productivity & AI Agent Framework          │
├────────────────────────────────┬────────────────────────────────┤
│ 🏛️ Nexus 2.0 (Memory & Hub)    │ ⚡ Apex (Rules & Engine)       │
│ (Context & Engineering Memory) │ (Rules & Behavioral Engine)    │
├────────────────────────────────┼────────────────────────────────┤
│ • Cross-Project Memory Vault   │ • 6 เสาหลักมาตรฐานวิศวกรรม     │
│ • Stack-Aware Gotchas Library  │ • Strict TS (Matt Pocock)      │
│ • Personal Plugins Hub         │ • Karpathy Behavioral Gates    │
│ • Resumable Session Handoffs   │ • Context Budget & Token Diet  │
│ • Universal MCP Tools (8 tools)│ • Universal Definition of Done  │
│ • Auto-Launched MCP Server     │ • 8 Specialized Skills         │
└────────────────────────────────┴────────────────────────────────┘
```

- **`Apex`** ทำหน้าที่เป็น **สมองและกฎระเบียบ (The Rules Engine):** ควบคุมให้ AI เขียนโค้ดตามมาตรฐานความปลอดภัย, Strict TypeScript, Zero Fluff, Karpathy Behavioral Gates และมี Definition of Done
- **`Nexus 2.0`** ทำหน้าที่เป็น **ความจำและระบบปฏิบัติการ (The Memory OS & Hub):** จัดเก็บสถานะโปรเจกต์, ประวัติการตัดสินใจ (ADRs), คลังข้อควรระวังข้ามภาษา, ศูนย์รวมปลั๊กอินส่วนตัว (`plugins/`), และเชื่อมต่อเข้ากับ AI IDE ผ่าน Universal MCP Server

---

## ⚡ 6 เสาหลักของ Nexus 2.0 (Core Pillars)

1. **⚠️ Stack-Aware Gotchas & Confidence Scoring (`Knowledge/Patterns/`):**
   - คลังรวบรวมข้อควรระวังและบั๊กจริงที่สกัดจากประวัติการทำงาน (Nuxt 4, Prisma, TypeScript, Windows Dev)
   - ใช้ระบบ **Frontmatter Tagging & Confidence Scoring** (`confidence: 0.0-1.0`, `times_applied`) เพื่อจัดลำดับความน่าเชื่อถือ
2. **📦 Personal Plugins Hub (`plugins/`):**
   - ศูนย์รวมปลั๊กอินและสกิลเฉพาะทางของ Jack (เช่น `saijai-thesis`, `cmru-drought`) ที่เรียกใช้ได้ทันทีโดยไม่ต้องกระจายไฟล์หลายที่
3. **🔌 Universal MCP Server:** เชื่อมต่อ Memory Vault เข้ากับ Google Antigravity, Cursor, Claude Code, Windsurf ผ่าน MCP Tools:
   - `nexus_get_state` — ดึง Operating State ปัจจุบันและ Task Queue
   - `nexus_get_project_brief` — ดึง Context บรีฟของโปรเจกต์ที่ระบุในรูปแบบ High-Density
   - `nexus_save_session` — บันทึกประวัติ Session จบงานเข้า Vault
   - `nexus_record_decision` — บันทึก Architecture Decision Record (ADR)
   - `nexus_synthesize_pattern` — สกัด Production Blueprint ส่งต่อคลังความรู้
   - `nexus_doctor` — ตรวจสอบสุขภาพและคุณภาพของ Codebase ตามมาตรฐาน 6 เสาหลัก
   - `nexus_get_executive_brief` — สรุปรายงานสถานะผู้บริหาร
   - `nexus_install_git_hook` — ติดตั้ง Auto Checkpoint Hook
4. **🔄 Resumable Session Handoff Engine:** รองรับการบันทึก Checkpoint แบบมีโครงสร้าง เพื่อให้ Agent เซสชันถัดไปทำงานต่อได้ทันที
5. **🎯 JIT Context Compiler:** รวบรวมบริบทโปรเจกต์ + ADRs + Tech Stack เป็น High-Density Prompt ภายใน 1 วินาที ลดภาระ Token Consumption
6. **🧬 Cross-Project Pattern Synthesizer:** สกัดโค้ดจริงที่ทดสอบผ่านแล้ว ส่งเข้าไปเป็น Reusable Blueprints ในคลังความรู้ส่วนกลาง

---

## 📌 โครงสร้างระบบ (Vault, Plugins & Engine Structure)

```text
Nexus/
├── plugin.json                 # 🔌 Manifest ประกาศตัวตนเป็น Memory Plugin
├── mcp_config.json             # ⚡ เปิด Nexus Universal MCP Server อัตโนมัติ!
├── _index.md                   # Quick Dashboard & Current Focus
├── AGENTS.md                   # Master Agent Operating Rules
├── CLAUDE.md                   # System Constitution & Engineering Standards
├── USER.md                     # Owner Preferences & Personal Tone
├── Vault Structure Map.md      # แผนผังและขอบเขตหน้าที่ของโฟลเดอร์
│
├── plugins/                    # 📦 [Personal Plugins Hub] รวมปลั๊กอินส่วนตัวทั้งหมด
│   ├── saijai-thesis/          # ปลั๊กอินจัดเล่มธีสิสและเอกสารโครงงาน
│   │   ├── plugin.json
│   │   └── skills/format-saijai-document/
│   └── cmru-drought/           # ปลั๊กอินงานวิจัยภัยแล้ง (Streamlit + GEE)
│       ├── plugin.json
│       └── skills/cmru-drought-paper/
│
├── bridge/                     # 🚀 Nexus 2.0 Engine & MCP Server (Node.js + TS)
│   ├── src/core/compiler.ts    # 🎯 JIT Context Compiler
│   ├── src/core/checkpoint.ts  # 🔄 Closed-Loop Memory Engine
│   ├── src/core/synthesizer.ts # 🧬 Cross-Project Pattern Synthesizer
│   └── src/mcp-server.ts       # 🔌 Universal MCP Server
│
├── Knowledge/
│   └── Patterns/               # 🌍 [Public] คลัง Gotchas & System Blueprints
│       ├── _Index.md           # สารบัญกลางเชื่อมโยง Gotchas & Confidence Policy
│       ├── gotchas-nuxt4-nitro.md     # ข้อควรระวัง Nuxt 4 + Nitro + Vue 3
│       ├── gotchas-prisma-postgres.md # ข้อควรระวัง Prisma & Database
│       ├── gotchas-coding-and-typescript.md # ข้อควรระวัง TypeScript & Async State
│       ├── gotchas-agent-behavioral-anti-patterns.md # ข้อห้ามเชิงพฤติกรรมของ AI Agent
│       ├── gotchas-windows-dev.md     # ข้อควรระวัง Windows Path, Robocopy, PTY
│       ├── gotchas-ai-memory-tools.md # ข้อควรระวัง AI Agents & Single-committer Git
│       └── anti-patterns-security.md  # กฎเหล็ก OWASP & Secrets Prevention
│
├── Decisions/                  # 🔒 [Local] บันทึกการตัดสินใจทางสถาปัตยกรรม (ADRs)
├── Projects/                   # 🔒 [Local] บรีฟและสถานะแต่ละโปรเจกต์ (Active / Maintenance)
├── Sessions/                   # 🔒 [Local] ประวัติการทำงานย้อนหลัง (Action-First Session Logs)
├── Shared/                     # 🔒 [Local] ข้อมูลส่วนกลาง (Operating State, Task Queue)
└── Templates/                  # 📐 แม่แบบเอกสารมาตรฐาน (Session, Handoff, ADRs)
```

---

## ⚙️ การเชื่อมต่อกับ Google Antigravity & IDEs

### 🌟 ติดตั้งผ่าน `plugins.json` (แนะนำที่สุด 🏆)
เพิ่ม Path ของ `Nexus` และ `Nexus/plugins` ลงใน `~/.gemini/config/plugins.json`:

```json
{
  "entries": [
    { "path": "C:/Users/Admin/Desktop/work/Apex-core" },
    { "path": "C:/Users/Admin/Desktop/work/Nexus" },
    { "path": "C:/Users/Admin/Desktop/work/Nexus/plugins" }
  ]
}
```

- **✨ ผลลัพธ์:** Antigravity จะโหลดความจำ, เครื่องมือ MCP 8 ตัว, และปลั๊กอินทั้งหมดใน `Nexus/plugins/` มาให้ใช้งานอัตโนมัติทันที 100%!

---

## 🚀 Quick Commands (CLI)

```bash
# 1. ตรวจสอบสถานะภาพรวมและงานค้างใน Task Queue
node bridge/dist/cli.js status

# 2. เสิร์ฟบริบทโปรเจกต์แบบ High-Density JIT Context
node bridge/dist/cli.js brief [ProjectName]

# 3. บันทึก Checkpoint จบงาน (Auto Git Commit & Session Log)
node bridge/dist/cli.js checkpoint [ProjectName] "[Work Summary]"

# 4. ตรวจสุขภาพ Codebase ตามเกณฑ์ Apex 6 เสาหลัก
node bridge/dist/cli.js doctor [ProjectName]

# 5. เริ่มรัน Universal MCP Server
node bridge/dist/cli.js mcp
```

---

## 🔗 Repository Links & Ecosystem

- **Apex Agent Framework:** 👉 [AlmxndBL/Apex-core](https://github.com/AlmxndBL/Apex-core)
- **Nexus 2.0 Memory Vault:** 👉 [AlmxndBL/nexus](https://github.com/AlmxndBL/nexus)
- **Developer Profile:** 👉 [AlmxndBL](https://github.com/AlmxndBL)
