---
tags: [knowledge, patterns, gotchas, agent-behavior, anti-patterns]
note_type: pattern
confidence: 1.0
times_applied: 1
last_validated: 2026-08-22
source: research
parent: "[[Knowledge/Patterns/_Index]]"
---

# 🤖 Agent Behavioral Anti-Patterns & Gotchas

> คลังข้อผิดพลาดเชิงพฤติกรรมของ AI Agent (LLM Coding Pitfalls) กลั่นจากบทวิเคราะห์ของ Andrej Karpathy และ Best Practices ของ ECC Framework เพื่อป้องกันข้อผิดพลาดในการพัฒนาซอฟต์แวร์

---

## 🚫 1. Silent Assumption Trap (การคิดไปเองเงียบๆ)

* **อาการ (Symptoms):** โมเดลเจอตีความ Requirement ได้หลายทิศทาง แต่แอบเลือกทิศทางหนึ่งเองเงียบๆ แล้วเขียนโค้ด 500 บรรทัดไปในทางที่ผู้ใช้ไม่ได้ต้องการ
* **ผลกระทบ:** เสียเวลา Context Window บวม และต้อง Revert งานทิ้งทั้งหมด
* **แนวทางแก้ไข (Remediation):**
  * บังคับใช้ **Confusion Surfacing Protocol**:
    - 🟢 *Clear:* ลุยต่อทันที
    - 🟡 *Partially Clear:* ระบุจุดสงสัย + เสนอ Default Assumption ให้ผู้ใช้เห็นก่อนทำ
    - 🔴 *Confused:* มีความขัดแย้งเกิน 50% ให้หยุดและถามผู้ใช้ทันที ห้ามสุ่มทำ

---

## 🚫 2. Overengineering Reflex (สร้างสถาปัตยกรรมเกินตัว)

* **อาการ (Symptoms):** ชอบสร้าง Generic Abstractions, Factory Patterns, Strategy Classes, Config Files ซับซ้อน สำหรับฟังก์ชันที่มีการเรียกใช้เพียงจุดเดียว (Single-use Code)
* **ผลกระทบ:** โค้ดอ่านยาก, Maintenance Cost สูง, Blast Radius กว้างขึ้นโดยไม่จำเป็น
* **แนวทางแก้ไข (Remediation):**
  * รัน **Anti-Overengineering Litmus Test (Karpathy Gate)** 3 คำถาม:
    1. *"ผู้ใช้ขอสิ่งนี้จริงหรือเปล่า?"* (ถ้าไม่ได้ขอ ห้ามเพิ่มตามหลัก YAGNI)
    2. *"Senior Engineer มาดูจะด่าว่า Overcomplicated ไหม?"* (ถ้า 50 บรรทัดจบ ห้ามเขียน 200 บรรทัด)
    3. *"มี Abstraction ไหนที่ถูกเรียกใช้แค่ที่เดียว?"* (ถ้ามี ให้ Inline แทน)

---

## 🚫 3. Drive-by Refactoring (การแอบแก้โค้ดข้างเคียง)

* **อาการ (Symptoms):** ระหว่างที่แก้บั๊กหรือเพิ่มฟังก์ชันในไฟล์ A แอบไปจัดฟอร์แมต ลบคอมเมนต์ หรือ Refactor โค้ดในไฟล์ B หรือบรรทัดข้างเคียงที่ไม่เกี่ยวกับ Task
* **ผลกระทบ:** Git Diff บวม, Code Review ยากขึ้น และเสี่ยงทำให้เกิด Regression บั๊กเงียบๆ
* **แนวทางแก้ไข (Remediation):**
  * ยึดหลัก **Diff Trace Accountability (Surgical Changes)**: ทุกบรรทัดที่ปรากฏใน Git Diff ต้องเชื่อมโยงกลับไปยัง User Request ได้โดยตรง
  * หากพบ Dead Code หรือ Code Smell เก่า ให้รายงานในแชทแทนการแอบลบทันที

---

## 🚫 4. Evidence-Free Completion (รายงานว่าเสร็จโดยไม่มีหลักฐาน)

* **อาการ (Symptoms):** Agent แจ้งผู้ใช้ว่า "แก้ไขเรียบร้อยแล้วครับ รันได้ 100%" โดยไม่มี Terminal Output, Test Logs หรือ Verification Output แนบมาด้วย
* **ผลกระทบ:** โค้ดพังตอน Runtime จริง ผู้ใช้เสียความเชื่อมั่น
* **แนวทางแก้ไข (Remediation):**
  * บังคับใช้ **Mandatory Evidence Delivery Gate (No Evidence = Not Done)**: ต้องแนบ Output การรัน Fast TypeCheck (`tsc --noEmit`), Test Runner, หรือ Inline Assertion Script เสมอ

---

## 🚫 5. Context Window Amnesia (ความจำเสื่อมจาก Context บวม)

* **อาการ (Symptoms):** โหลดไฟล์ขนาดใหญ่หรือรันคำสั่งที่ให้ Output ยาวเป็นหมื่นบรรทัดเข้ามาใน Context จนเกิน Budget แล้วลืมคำสั่งแรกๆ ของเซสชัน
* **ผลกระทบ:** โมเดลเริ่มหลอน (Hallucinate), ลืม Red Lines, และทำงานวนลูป
* **แนวทางแก้ไข (Remediation):**
  * ใช้ **Context Budget Skill**: อ่านไฟล์เฉพาะ Range บรรทัดที่ต้องการ (`view_file` with `StartLine`/`EndLine`) และใช้ `grep_search` แทนการ Dump ไฟล์ทั้งโฟลเดอร์
  * เมื่อจบงานใหญ่หรือเซสชันยาว ให้ทำการ **Session Handoff** แล้วเปิดเซสชันใหม่

---

## 🔗 Related References
- [[Knowledge/Patterns/_Index|Patterns Index]]
- [[Knowledge/Patterns/anti-patterns-architecture-and-routing|Architecture Anti-Patterns]]
- [[Knowledge/Patterns/gotchas-coding-and-typescript|TypeScript Gotchas]]
