---
tags: [knowledge, gotchas, stack/universal, ai/memory, agents]
note_type: gotcha-collection
stack: universal
created: 2026-08-19
updated: 2026-08-19
parent: "[[Knowledge/Patterns/_Index]]"
---

# ⚠️ Gotchas: AI Agents, Memory & Tool Harness

> รวมข้อควรระวังและ Best Practices ในการรัน AI Coding Agents, Persistent Memory (Nexus / Claude-mem / Graphify) และ Multi-agent Workflows

---

### 1. 🔒 Single-Committer Git Architecture
- ❌ **ห้ามทำ:** อย่าให้ Agent หลายตัวที่รันขนานกันยิงคำสั่ง `git commit` หรือ `git push` เข้า Repo เดียวกันพร้อมกัน เพราะจะทำให้เกิด `.git/index.lock` ชนกันจนระบบค้าง
- ✅ **วิธีที่ถูกต้อง:** ใช้ **Single-Committer Pattern** โดยให้ Agent เขียนไฟล์ลงไดเรกทอรีของตัวเอง แล้วให้ Process กลาง (Orchestrator / Main Process) เป็นผู้ Commit ข้อมูลเพียงผู้เดียว

### 2. 🏷️ Session File Naming & Instant Scannability
- ❌ **ห้ามทำ:** อย่าบันทึก Session ด้วยตัวเลข Timestamp ล้วน เช่น `202607101607.md` เพราะดูไม่ออกว่างานนั้นทำอะไร
- ✅ **วิธีที่ถูกต้อง:** ใช้รูปแบบ `YYYY-MM-DD-HHmm-slug.md` (เช่น `2026-08-17-1653-implemented-admin-expense-mana.md`) พร้อมใส่ `summary` ใน Frontmatter เสมอ เพื่อให้สแกนหัวข้อง่ายใน 1 วินาที

### 3. 🧠 Token Diet in Memory Recall
- ❌ **ห้ามทำ:** อย่าโหลด Chat History หรือ Context ทั้งก้อนยัดใส่ Memory เพราะจะเปลือง Context Window และทำให้เกิด Hallucination
- ✅ **วิธีที่ถูกต้อง:** สรุปบทเรียนเป็น **Micro-Lessons (3-4 บรรทัดต่อเรื่อง)** มีเฉพาะ Trigger, Anti-pattern, และ Golden Rule เท่านั้น

### 4. 🌐 Graphify Knowledge Graph Hygiene
- ❌ **ห้ามทำ:** อย่ารัน `/graphify` สแกนทั้งโฟลเดอร์ที่มี `node_modules`, `.git`, หรือ `dist/build`
- ✅ **วิธีที่ถูกต้อง:** กำหนด Root Target เฉพาะโฟลเดอร์ `src/`, `server/`, `app/` หรือโฟลเดอร์ `Sessions/` เพื่อให้ได้ Knowledge Graph ที่สะอาดและมีแต่ความสัมพันธ์จริงของโค้ด

### 5. 🛡️ Vault Automated Backup & Remote Git Sync
- ❌ **ห้ามทำ:** ปล่อยให้ Knowledge Vault อยู่ใน Local Disk โดยไม่มี Automated Remote Sync หรือ Git Remote Backup ป้องกันข้อมูลสูญหายเมื่อเครื่องเกิด Hardware Failure
- ✅ **วิธีที่ถูกต้อง (Nexus Backup & Sync Standard):**
  1. **Git Remote Sync:** ตั้งค่า Git Remote (`origin`) ชี้ไปยัง Private Repository บน GitHub/GitLab
  2. **Automated Pre-Push Checkpoints:** ใช้ Nexus Git Hook (`installGitHook`) เพื่อ Auto-checkpoint Session ทุกครั้งก่อน Push
  3. **Disaster Recovery Checklist:**
     - โคลน Vault จาก Git Remote: `git clone <remote-url> Nexus`
     - ติดตั้ง Dependencies ของ Bridge: `cd Nexus/bridge && pnpm install && pnpm build`
     - รัน Health Audit: `pnpm run test` และรัน `nexus doctor` เพื่อยืนยันความสมบูรณ์ของ Vault 100%

---

up:: [[Knowledge/Patterns/_Index]]
