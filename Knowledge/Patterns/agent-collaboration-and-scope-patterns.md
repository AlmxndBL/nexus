---
title: Visual Reference Interpretation & Scope Assumption Pitfalls
tags: [agent/workflow, collaboration, pattern/scope-control, ui/reference]
author: Apex AI Framework & Nexus Memory
date: 2026-08-20
status: active
---

# 🎯 Visual Reference Interpretation & Scope Assumption Pitfalls

แนวทางปฏิบัติและข้อควรระวังในการรับภาพ UI Reference จากผู้ใช้งาน เพื่อป้องกันการตีความเกินขอบเขต (Over-engineering & Scope Creep)

---

## 🚨 1. The "Visual Assumption" Anti-Pattern

### ❌ พฤติกรรมที่ผิดพลาด:
เมื่อผู้ใช้ส่งภาพ Screenshot ดีไซน์ (เช่น หน้าเว็บตัวอย่าง Mood & Tone สไตล์ WoodNest / รีสอร์ตธรรมชาติ) พร้อมคำขอสั้นๆ:
- Agent ด่วนสรุปเอาเองว่าผู้ใช้ต้องการ **"รื้อดีไซน์ทั้งหน้าใหม่หมด"**
- Agent เขียนโค้ดเปลี่ยนสี พื้นหลัง Typography และ Layout ยกชุด
- **ผลลัพธ์:** ผู้ใช้สั่งยกเลิกงานและต้องสั่งให้ย้อนกลับ เพราะเจตนาจริงของผู้ใช้คือต้องการเพียง *"จัดข้อความให้ตรงบรรทัดเดียวตามตัวอย่าง"* ไม่ได้ต้องการเปลี่ยนธีมของเว็บไซต์

---

## 🛡️ 2. The 3-Tier Visual Reference Classifier

เมื่อได้รับภาพ Screenshot หรือ UI Reference Agent **ต้องแยกประเภทความต้องการออกเป็น 3 ระดับ** และถามยืนยันก่อนลงมือแก้ไข:

```
                      📸 รับรูปภาพ Reference จากผู้ใช้
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
1. 📐 Layout & Alignment    2. 🧩 Specific Component     3. 🎨 Total Visual Overhaul
(จัดบรรทัด/ระยะห่าง/กรอบ)   (ดึงเฉพาะ Card/Switch/Hero)  (รื้อธีม สี และโครงสร้างทั้งระบบ)
```

| ระดับ | เจตนาของผู้ใช้ | ตัวอย่างสิ่งที่ควรทำ |
|---|---|---|
| **Tier 1: Layout & Alignment** | จัดข้อความ, ความกว้าง, สัดส่วน grid ให้ตรงตามภาพ | รักษา Brand Color และ Components เดิม ปรับเฉพาะ CSS Layout / Flex / Grid |
| **Tier 2: Specific Component** | นำ Card ตัวอย่าง, ตาราง, หรือปุ่มในรูปมาใช้ | สร้างหรือปรับเฉพาะ Component นั้นๆ ไม่แตะ Shell หรือ Global Theme |
| **Tier 3: Total Visual Overhaul** | เปลี่ยน Mood & Tone ทั้งเว็บไซต์ตาม Reference | ต้องสรุปแผนการเปลี่ยนสี ฟอนต์ และ Layout เสนอให้ผู้ใช้ Approve ก่อนเริ่มแตะโค้ด |

---

## ❓ 3. Pre-Flight Clarification Template (สูตรคำถามสั้นก่อนทำ)

เมื่อได้รับภาพ Reference ให้ Agent ตั้งคำถามสั้นๆ 2-3 บรรทัดทันที:

> *"จากภาพ Reference ที่ส่งมา ต้องการให้นำส่วนไหนมาปรับใช้เป็นหลักครับ:*
> 1. **(Layout):** จัดวางสัดส่วนและข้อความให้ตรงบรรทัดตามแบบ (คงธีมและสีเดิมของระบบไว้)
> 2. **(Component):** ปรับเฉพาะส่วน [ระบุชื่อ Component เช่น Hero Banner / Card / Table]
> 3. **(Total Theme):** เปลี่ยน Mood & Tone และดีไซน์ทั้งระบบตามภาพตัวอย่าง"*

---

## 🛑 4. Rules of Engagement
1. **Never Assume Total Overhaul:** หากไม่ได้รับคำสั่งระบุชัดเจนว่า *"เปลี่ยนธีมใหม่หมดตามภาพนี้"* ให้ตั้งสมมติฐานเริ่มต้นเป็น **Tier 1 (Layout)** หรือ **Tier 2 (Specific Component)** เสมอ
2. **Preserve Domain Identity:** อย่าเปลี่ยน Brand Kit, โลโก้, หรือโครงสร้างสีของโปรเจกต์เดิมโดยไม่ได้รับคำสั่ง
