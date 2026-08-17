---
tags: [index, durable-index, folder-roles]
note_type: durable-index
created: 2026-07-25
updated: 2026-08-17
parent: "[[_index]]"
ai_surface: hot
---

# 🗺️ Vault Structure Map — Where Everything Goes

> แผนผังระบุหน้าที่ของแต่ละโฟลเดอร์ใน Nexus: บทบาท + สิ่งที่ควรใส่ + สิ่งที่ห้ามใส่ (One Artifact = One Canonical Home)

---

## 🧭 Quick Routing (เส้นทางจัดเก็บข้อมูล)

| ชนิดข้อมูล | จัดเก็บที่ | ชื่อไฟล์ / รูปแบบ |
|---|---|---|
| บริบทโปรเจกต์ / ข้อมูลงานจริง | `Projects/` | `Projects/<project-name>.md` |
| บันทึกประวัติการทำงานย้อนหลัง | `Sessions/` | `Sessions/YYYY-MM-DD-HHmm-<topic>.md` |
| ออกแบบสถาปัตยกรรม / System Design | `Knowledge/Architecture/` | `Knowledge/Architecture/<name>.md` |
| งานวิจัยทางเทคนิค / Benchmark | `Knowledge/Research/` | `Knowledge/Research/<topic>.md` |
| การตัดสินใจเชิงสถาปัตยกรรม (ADR) | `Decisions/` | `Decisions/YYYY-MM-DD-<slug>.md` |
| สภาพแวดล้อมและโฟกัสปัจจุบัน | `Shared/Operating-State/` | `current-state.md` |
| คิวงานที่ค้างอยู่และ Priority | `Shared/Task-Queue/` | `current-tasks.md` |
| ความชอบและสไตล์ของเจ้าของ | `Shared/User-Memory/` | `user-preferences.md` |
| ข้อเท็จจริงถาวรที่ห้ามละเมิด | `Shared/Core-Facts/` | `protected-facts.md` |
| แม่แบบเอกสารมาตรฐาน | `Templates/` | `Templates/<template-name>.md` |

---

## 📁 Full Folder Directory & Boundaries

### 1. `Projects/` (Project Hub)
- **หน้าที่:** รวบรวมเอกสารภาพรวม ข้อมูล Tech Stack, Domain Models และแผนงานของแต่ละโปรเจกต์
- **สิ่งที่ควรใส่:** บรีฟโปรเจกต์, ลิงก์ไปยัง Repo, แผนพัฒนา (Roadmap), สถานะฟีเจอร์
- **ห้ามใส่:** Session Log ย้อนหลัง (ให้ไปที่ `Sessions/`), Source Code ดิบ

### 2. `Sessions/` (Session History)
- **หน้าที่:** บันทึกประวัติการทำงานแบบ Action-First ในแต่ละรอบ (Context, What I Did, Files Changed, Decisions, DoD Verification Evidence)
- **สิ่งที่ควรใส่:** บันทึกสรุปจบงานแต่ละ Session
- **ห้ามใส่:** โน้ตลอยๆ ที่ไม่มีวันที่กำกับ, Configs หรือ Codebase files

### 3. `Knowledge/` (Engineering Knowledge Base)
- **หน้าที่:** เอกสารเชิงเทคนิคระดับระบบ เช่น สถาปัตยกรรม (`Architecture/`), งานวิจัย (`Research/`) และคู่มืออ้างอิงเชิงลึก
- **สิ่งที่ควรใส่:** เอกสาร System Design, Database Architecture, Research Findings
- **ห้ามใส่:** งานชั่วคราวที่ยังไม่สรุป

### 4. `Decisions/` (Architecture Decision Records - ADR)
- **หน้าที่:** บันทึกการตัดสินใจทางเทคนิคที่มีผลกระทบสำคัญ พร้อมระบุ Context, Alternatives, Decision และ Trade-offs
- **สิ่งที่ควรใส่:** ADR รายหัวข้อ
- **ห้ามใส่:** บันทึกการแก้งานทั่วไปประจำวัน

### 5. `Shared/` (Global Runtime & User Context)
- **หน้าที่:** หัวใจของระบบความจำและการสลับโหมดของ Agent
- **สิ่งที่ควรใส่:** `AI-Context-Index.md`, `Operating-State/`, `Task-Queue/`, `User-Memory/`, `Core-Facts/`
- **ห้ามใส่:** โฟลเดอร์งานเฉพาะโปรเจกต์ใดโปรเจกต์หนึ่ง

### 6. `Templates/` (Standard Templates)
- **หน้าที่:** แม่แบบเอกสารมาตรฐานสำหรับนำไปสร้างโน้ตใหม่
- **สิ่งที่ควรใส่:** แม่แบบ Session, ADR, Project Brief
