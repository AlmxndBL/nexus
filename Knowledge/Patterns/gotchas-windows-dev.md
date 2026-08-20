---
tags: [knowledge, gotchas, stack/universal, os/windows]
note_type: gotcha-collection
stack: universal
created: 2026-08-19
updated: 2026-08-19
parent: "[[Knowledge/Patterns/_Index]]"
---

# ⚠️ Gotchas: Windows Dev Environment

> รวมข้อควรระวังเฉพาะตัวสำหรับการพัฒนาซอฟต์แวร์บนระบบปฏิบัติการ Windows (PowerShell, CMD, Paths, Robocopy, Docker)

---

### 1. 🔀 Path Separator (Backslash vs Forward Slash)
- ❌ **ห้ามทำ:** อย่า Hardcode Path ด้วยเครื่องหมาย `\\` หรือ `/` ใน Code หรือ Script
- ✅ **วิธีที่ถูกต้อง:** ใช้ `path.join()` หรือ `path.resolve()` ใน Node.js เสมอ และใน Configuration (เช่น Vite, Nitro, Tailwind) ให้แปลงเป็น Forward Slash `/` เสมอ

### 2. 📜 PowerShell & CMD Execution in `npm run`
- ❌ **ห้ามทำ:** `npm run` บน Windows จะเรียกผ่าน `cmd.exe` ไม่ใช่ Bash หรือ PowerShell ดังนั้นคำสั่งอย่าง `sleep 1`, `~`, `& wait` จะพังทันที
- ✅ **วิธีที่ถูกต้อง:** ใช้ Node.js inline script เช่น `node -e "setTimeout(()=>{}, 1000)"` หรือใช้ package เช่น `cross-env`, `rimraf`

### 3. 📂 Windows Robocopy vs Rsync Syntax
- ❌ **ห้ามทำ:** อย่าส่ง `--exclude=` ให้กับ `robocopy` เพราะ robocopy ไม่รองรับ rsync flag
- ✅ **วิธีที่ถูกต้อง:** แปลง `.gitignore` เป็น `/XD` (Directory exclude) และ `/XF` (File exclude)
- ⚠️ **สำคัญ:** Exit code 0 ถึง 7 ของ `robocopy` ถือเป็น **Success ทั้งหมด** (Exit code > 7 ถึงจะเป็น Error) ดังนั้นถ้าใช้ `execSync` ต้อง try/catch และ throw เมื่อ exit code > 7 เท่านั้น

### 4. 🔄 Worker Detached Spawn (Self-Restart Pattern)
- ❌ **ห้ามทำ:** อย่าให้ Worker process ฆ่าตัวเองเพื่อ restart โดยตรง เพราะจะเกิด Race condition ที่ parent process ตายก่อน child สปอว์นเสร็จ
- ✅ **วิธีที่ถูกต้อง:** ใช้ `spawn` แบบ `detached: true` ร่วมกับ `unref()` เพื่อให้ Process ลูกอยู่รอดได้แม้ Process แม่จะดับไป

### 5. 🧪 Bun `mock.module` Limitation บน Windows
- ❌ **ห้ามทำ:** อย่าใช้ `mock.module` ของ Bun ในการ Mock built-in Node modules (เช่น `child_process`, `util`) เพราะ mock จะไม่ทำงาน
- ✅ **วิธีที่ถูกต้อง:** ใช้ **Dependency Injection** (เช่น inject `execOverride` ผ่าน constructor) เพื่อให้ Test ได้แบบ 100%

### 6. 📄 Line Endings (CRLF vs LF)
- ❌ **ห้ามทำ:** ห้าม Commit ไฟล์ Shell Scripts (`.sh`), Dockerfiles, หรือ Test fixtures ด้วย CRLF
- ✅ **วิธีที่ถูกต้อง:** ตั้งค่า `.gitattributes` บังคับ `* text=auto eol=lf` สำหรับ Scripts และ Configs

### 7. ⏱️ Heavy I/O Overhead on Full Production Builds (`npm run build`)
- ❌ **ห้ามทำ:** อย่าสั่ง `npm run build` หรือ `nuxt build` ทุกครั้งที่แก้โค้ดชิ้นเล็กๆ เพราะ Windows File System (NTFS & Defender Scanning) ทำให้ File I/O ใน `.nuxt/` หรือ `.next/` ช้ากว่า Linux ถึง 3–5 เท่า (กินเวลา 45s ถึง 2 นาทีต่อรอบ)
- ✅ **วิธีที่ถูกต้อง:** ใช้ In-memory TypeCheck (`npx vue-tsc --noEmit` หรือ `npx tsc --noEmit`) ซึ่งกินเวลาเพียง 1–3 วินาที และเก็บ Full Build ไว้รันเฉพาะเมื่อแก้ Global Config ใหญ่หรือก่อน Release เท่านั้น

