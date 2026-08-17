# 🌉 Nexus Bridge — Active Personal Engineering OS & MCP Hub

> Engine ประจำ Nexus 2.0 สำหรับเชื่อมต่อ Vault ความจำเข้ากับ AI Coding Agent (Google Antigravity, Cursor, Claude Code, Windsurf)

---

## 🚀 ฟีเจอร์หลัก (Core Capabilities)

1. **🔌 Universal MCP Server (`nexus mcp`):** ให้ Agent ทุกตัวเรียก Tools อ่าน/เขียนความจำใน Nexus ได้สดๆ (รวมถึง `nexus_doctor` และ `nexus_get_executive_brief`)
2. **🪝 Git Auto-Checkpoint Hook (`nexus install-hook`):** ติดตั้ง Hook ให้ `git push` บันทึก Session log และอัปเดต `README.md` อัตโนมัติ 100%
3. **🩺 Nexus Doctor (`nexus doctor`):** ตรวจสุขภาพโค้ดและวัดคะแนนตามกฎ 6 เสาหลักของ `agent_skill` (จับ Any, ตรวจสอบ Secrets, เช็ค Test DoD)
4. **📊 Multi-Project Executive Catchup (`nexus summary`):** สรุปสถานะงานค้างและ 3 ก้าวถัดไปของทุกโปรเจกต์
5. **🎯 JIT Context Compiler (`nexus brief <project>`):** รวมรวบและย่อบริบทโปรเจกต์ + ADRs + Stack + Rules เป็น Prompt High-density
6. **🧬 Cross-Project Pattern Synthesizer (`nexus seed-blueprints`):** สกัดโค้ดจริงที่เทสต์ผ่านแล้ว แปลงเป็นพิมพ์เขียวส่งต่อให้ `agent_skill`

---

## ⚙️ การตั้งค่า MCP Server ใน IDE ต่างๆ

เพิ่ม Config นี้ลงในไฟล์ตั้งค่า MCP (เช่น `claude_desktop_config.json`, Cursor MCP Settings, หรือ `~/.gemini/config/mcp_config.json` ใน Antigravity):

```json
{
  "mcpServers": {
    "nexus": {
      "command": "node",
      "args": ["C:/Users/Admin/Desktop/work/Nexus/bridge/dist/cli.js", "mcp"],
      "env": {
        "NEXUS_VAULT_ROOT": "C:/Users/Admin/Desktop/work/Nexus",
        "AGENT_SKILL_ROOT": "C:/Users/Admin/Desktop/work/agent_skill"
      }
    }
  }
}
```

---

## 🛠️ CLI Commands สรุปครบทุกคำสั่ง

```bash
# 1. ดูสถานะและคิวงานทั้งหมด
node bridge/dist/cli.js status

# 2. สรุปความคืบหน้ารวมทุกโปรเจกต์ (แก้ปัญหาลืมงานค้าง)
node bridge/dist/cli.js summary

# 3. ตรวจสุขภาพโค้ดด้วย Nexus Doctor (ตามเกณฑ์ agent_skill)
node bridge/dist/cli.js doctor SaiJai-Phareab

# 4. ติดตั้ง Git Auto-Checkpoint Hook (สั่งครั้งเดียวในโฟลเดอร์โปรเจกต์)
node bridge/dist/cli.js install-hook C:/Users/Admin/Desktop/work/SaiJai-Phareab

# 5. คอมไพล์บริบทโปรเจกต์แบบ JIT
node bridge/dist/cli.js brief SaiJai-Phareab

# 6. บันทึก Session จบงาน และอัปเดต README.md ทันที
node bridge/dist/cli.js checkpoint SaiJai-Phareab "Implemented pickup notification cron"

# 7. สกัดพิมพ์เขียวใหม่เข้าสู่ agent_skill
node bridge/dist/cli.js seed-blueprints

# 8. สตาร์ต MCP Server ผ่าน Stdio
node bridge/dist/cli.js mcp
```
