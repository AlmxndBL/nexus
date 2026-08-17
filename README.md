# 🏛️ Nexus 2.0 — Active Personal Engineering OS & Memory Vault

> **Personal Context, Project Hub, Decision Memory & Universal MCP Bridge**
> ส่วนขยายหน่วยความจำระยะยาว (Long-Term Memory) และระบบปฏิบัติการวิศวกรรมส่วนบุคคล ทำงานผสานรวมกับ [Master Agent Skill Rules](https://github.com/AlmxndBL/agent-skill)

![v2.0](https://img.shields.io/badge/v2.0-blue.svg) ![Status](https://img.shields.io/badge/status-active-00DC82.svg) ![MCP](https://img.shields.io/badge/MCP-enabled-818CF8.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🏛️ สถาปัตยกรรมคู่หู: Nexus 2.0 & Agent-Skill (The Twin-Engine Synergy)

Nexus 2.0 และ [agent-skill](https://github.com/AlmxndBL/agent-skill) ถูกออกแบบขึ้นคู่กันเพื่อสร้าง **Developer Productivity & AI Agent Framework** ระดับ Production-Ready:

```text
┌─────────────────────────────────────────────────────────────┐
│       🤖 Developer Productivity & AI Agent Framework        │
├──────────────────────────────┬──────────────────────────────┤
│ 🏛️ Nexus 2.0 (Memory Vault) │ 🧠 Master Agent Skill Rules  │
│ (Context & Engineering OS)   │ (Rules & Behavioral Engine)  │
├──────────────────────────────┼──────────────────────────────┤
│ • Cross-Project Memory Vault │ • 6 เสาหลักมาตรฐานวิศวกรรม   │
│ • JIT Context Compiler       │ • Strict TS (Matt Pocock)    │
│ • 5 MCP Tools เชื่อมทุก IDE │ • Universal Definition of Done│
│ • บันทึก ADRs & Session Auto │ • 🛡️ Git Shield ป้องกันหลุด  │
└──────────────────────────────┴──────────────────────────────┘
```

- **`agent-skill`** ทำหน้าที่เป็น **สมองและกฎระเบียบ (The Rules Engine):** ควบคุมให้ AI เขียนโค้ดตามมาตรฐานความปลอดภัย, Strict TypeScript, Zero Fluff และมี Definition of Done
- **`Nexus 2.0`** ทำหน้าที่เป็น **ความจำและระบบปฏิบัติการ (The Memory OS):** จัดเก็บสถานะโปรเจกต์, ประวัติการตัดสินใจ (ADRs), รวบรวมบริบทแบบ JIT, และเชื่อมต่อเข้ากับ AI IDE ผ่าน Universal MCP Server

---

## ⚡ 4 เสาหลักของ Nexus 2.0 (Core Pillars)

1. **🔌 Universal MCP Server:** เชื่อมต่อ Memory Vault เข้ากับ Google Antigravity, Cursor, Claude Code, Windsurf ผ่าน MCP Tools 5 ตัว:
   - `nexus_get_state` — ดึง Operating State ปัจจุบันและ Task Queue
   - `nexus_get_project_brief` — ดึง Context บรีฟของโปรเจกต์ที่ระบุในรูปแบบ High-Density
   - `nexus_save_session` — บันทึกประวัติ Session จบงานเข้า Vault
   - `nexus_record_decision` — บันทึก Architecture Decision Record (ADR)
   - `nexus_synthesize_pattern` — สกัด Production Blueprint ส่งเข้า `agent-skill`
2. **🔄 Closed-Loop Memory Engine:** สแกน Git Diff และบันทึก Session Log + อัปเดตสถานะงานอัตโนมัติเมื่อสั่ง Checkpoint
3. **🎯 JIT Context Compiler:** รวบรวมบริบทโปรเจกต์ + ADRs + Tech Stack เป็น High-Density Prompt ภายใน 1 วินาที ลดภาระ Token Consumption
4. **🧬 Cross-Project Pattern Synthesizer:** สกัดโค้ดจริงที่ทดสอบผ่านแล้ว ส่งเข้าไปเป็น Reusable Blueprints ใน [`agent-skill/templates/blueprints/`](https://github.com/AlmxndBL/agent-skill/tree/master/templates/blueprints)

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
├── Decisions/                 # บันทึกการตัดสินใจทางสถาปัตยกรรม (ADRs)
├── Knowledge/                 # เอกสารสถาปัตยกรรม (Architecture) และงานวิจัย (Research)
├── Projects/                  # บรีฟและสถานะแต่ละโปรเจกต์ (Active / Maintenance)
├── Sessions/                  # ประวัติการทำงานย้อนหลัง (Action-First Session Logs)
├── Shared/                    # ข้อมูลส่วนกลาง (Operating State, Task Queue, User Memory)
├── Skills/                    # คลัง Specialized Skills
└── Templates/                 # แม่แบบเอกสารมาตรฐาน
```

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
- **Nexus 2.0 Memory Vault:** 👉 [AlmxndBL/project-x-memory](https://github.com/AlmxndBL/project-x-memory)
- **Developer Profile:** 👉 [AlmxndBL](https://github.com/AlmxndBL)
