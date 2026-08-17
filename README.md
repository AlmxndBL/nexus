# 🏛️ Nexus 2.0 — Active Personal Engineering OS & Memory Vault

> **Personal Context, Project Hub, Decision Memory & Knowledge OS for Jack (StxrFxll)**
> ควบคุมและทำงานร่วมกับ **`agent_skill`** ผ่านสถาปัตยกรรม 3-Tier และ Universal MCP Bridge

---

## 📌 โครงสร้างระบบ (System Architecture)

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
├── Decisions/                 # 3 ADRs (บันทึกการตัดสินใจทางสถาปัตยกรรม)
├── Knowledge/                 # เอกสารสถาปัตยกรรม (Architecture) และงานวิจัย (Research)
├── Projects/                  # บรีฟและสถานะแต่ละโปรเจกต์ (SaiJai-Phareab, Finance Tracker ฯลฯ)
├── Sessions/                  # ประวัติการทำงานย้อนหลัง (Action-First Session Logs)
├── Shared/                    # ข้อมูลส่วนกลาง (Operating State, Task Queue, User Memory)
├── Skills/                    # คลัง Skill
└── Templates/                 # แม่แบบเอกสารมาตรฐาน
```

---

## ⚡ 4 เสาหลักของ Nexus 2.0

1. **🔌 Universal MCP Server:** เชื่อมต่อ Vault เข้ากับ Cursor, Claude Code, Google Antigravity ผ่าน MCP Tools 5 ตัว (`nexus_get_state`, `nexus_get_project_brief`, `nexus_save_session`, `nexus_record_decision`, `nexus_synthesize_pattern`)
2. **🔄 Closed-Loop Memory:** บันทึก Session log และอัปเดตสถานะงานจาก Git Diff โดยอัตโนมัติ
3. **🎯 JIT Context Compiler:** รวบรวมบริบทโปรเจกต์ + ADRs + Stack เป็น High-Density Prompt ภายใน 1 วินาที
4. **🧬 Cross-Project Pattern Synthesizer:** สกัดโค้ดจริงที่ทดสอบผ่านแล้ว ส่งเข้าเป็น Reusable Blueprints ใน `agent_skill/templates/blueprints/`

---

## 🚀 Quick Commands

```bash
# ตรวจสอบสถานะและงานค้าง
node bridge/dist/cli.js status

# เสิร์ฟบริบทโปรเจกต์ SaiJai แบบกระชับ
node bridge/dist/cli.js brief SaiJai-Phareab

# บันทึก Checkpoint จบงาน
node bridge/dist/cli.js checkpoint [Project] "[Summary]"
```
