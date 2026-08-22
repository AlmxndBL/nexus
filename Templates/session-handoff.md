---
session_id: "{{date}}-{{time}}-{{slug}}"
date: "{{date}}"
time: "{{time}}"
project: "[[Projects/{{project}}]]"
tags: [session, handoff, resumable]
status: paused # paused | completed | blocked
parent: "[[Shared/Operating-State/current-state]]"
---

# 🔄 Session Handoff: {{slug}}

> **Summary:** {{summary}}
> **Project:** [[Projects/{{project}}]]

---

## 🎯 Intent & Target Objective
- **เป้าหมายหลัก:** {{intent}}
- **Confusion Level ตอนเริ่ม:** 🟢 Clear / 🟡 Partially Clear / 🔴 Confused

---

## 📍 Progress Checkpoint
- [x] **สิ่งที่ทำเสร็จแล้ว:**
  - ...
- [/] **สิ่งที่กำลังทำค้างไว้ (In-Flight):**
  - `path/to/file` (L120-L150): กำลังแก้ ...
- [ ] **สิ่งที่ยังไม่ได้เริ่ม (Remaining):**
  - ...

---

## 🧠 Working Memory (Context สำหรับ Resume)
- **Key Decisions / Assumptions:**
  - ...
- **Files Modified (Touch List):**
  - `path/to/file.ts` $\rightarrow$ สรุปสิ่งที่เปลี่ยน
- **Gotchas / Roadblocks Encountered:**
  - ...
- **Open Questions / Pending Jack's Input:**
  - ...

---

## ✅ Success Criteria Status
1. [ ] Criteria 1 $\rightarrow$ verify: `npx vitest run ...`
2. [ ] Criteria 2 $\rightarrow$ verify: `npx tsc --noEmit`

---

## 🔗 Fast Resume Instructions (สำหรับ Agent เซสชันถัดไป)
1. อ่านไฟล์นี้ + ตรวจสอบไฟล์ใน **Files Modified**
2. อ่าน Task ที่ทำค้างไว้ใน **Progress Checkpoint**
3. รัน Verification Command ของ Criteria ที่ค้างอยู่
4. ทำงานต่อทันทีโดยไม่ต้องสแกน Codebase ทั้งหมดใหม่
