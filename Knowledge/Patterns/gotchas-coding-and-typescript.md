---
tags: [knowledge, gotchas, stack/universal, stack/typescript, stack/vue, stack/react]
note_type: gotcha-collection
stack: typescript
confidence: 0.95
times_applied: 50
last_validated: 2026-08-22
source: session
parent: "[[Knowledge/Patterns/_Index]]"
---

# ⚠️ Gotchas: TypeScript, Async & Reactive State Footguns

> รวมข้อผิดพลาดระดับตรรกะโค้ด (Logical Coding Traps) ใน TypeScript, Vue 3, และ React ที่ Compiler/Linter มักไม่เตือน แต่สร้างบั๊กใน Runtime

---

### 1. 🕳️ `Array.prototype.forEach` กับ `async/await` (Silent Skip & Unhandled Rejection)
- ❌ **ห้ามทำ:** อย่าใส่ Async Callback ใน `items.forEach(async (item) => { await ... })` เด็ดขาด เพราะ `forEach` ทำงานแบบ Synchronous และไม่เคยรอ Promise ให้ Resolve ทำให้โค้ดบรรทัดถัดไปทำงานทันที และ Error ข้างในจะกลายเป็น Unhandled Rejection
- ✅ **วิธีที่ถูกต้อง:**
  - **Sequential (ทำทีละรายการ):** ใช้ `for (const item of items) { await process(item); }`
  - **Parallel (ทำพร้อมกัน):** ใช้ `await Promise.all(items.map(async (item) => process(item)))`

---

### 2. 🏃‍♂️ Search & Debounce Race Condition (ผลลัพธ์เก่าทับผลลัพธ์ใหม่)
- ❌ **ห้ามทำ:** ยิง Async Request ใน Watcher/Search Event โดยไม่จัดการ Abort Signal หรือ Request Sequence เมื่อผู้ใช้พิมพ์คำค้นหาต่อกันอย่างรวดเร็ว Request เก่าที่ตอบกลับมาช้ากว่าจะนำข้อมูลเก่ามาทับผลลัพธ์ล่าสุด
- ✅ **วิธีที่ถูกต้อง:** ใช้ `AbortController` ยกเลิก Request ก่อนหน้าทุกครั้งที่มี Request ใหม่:
  ```typescript
  let currentController: AbortController | null = null;

  async function search(query: string) {
    currentController?.abort();
    currentController = new AbortController();
    
    try {
      const data = await $fetch('/api/search', {
        query: { q: query },
        signal: currentController.signal,
      });
      results.value = data;
    } catch (err: any) {
      if (err.name !== 'AbortError') throw err;
    }
  }
  ```

---

### 3. 🧨 Vue 3 `reactive()` Destructuring Trap (สูญเสีย Re 一ivity)
- ❌ **ห้ามทำ:** ทำ ES6 Destructuring กับ `reactive()` โดยตรง เช่น `const { count, user } = reactiveState` เพราะค่าที่ดึงออกมาจะกลายเป็น Primitive ทั่วไป ทำให้ UI ไม่ยอม Re-render เมื่อค่าข้างในเปลี่ยน
- ✅ **วิธีที่ถูกต้อง:**
  - แนะนำใช้ `ref()` เป็นหลักสำหรับ State ทั่วไป
  - หากใช้ `reactive()` และต้องการ Destructure ให้ครอบด้วย **`toRefs(reactiveState)`** เสมอ

---

### 4. 🧠 Memory Leaks จาก Event Listeners, Subscriptions & Timers
- ❌ **ห้ามทำ:** ผูก Event ด้วย `window.addEventListener()` หรือรัน `setInterval()` ใน `onMounted()` โดยลืมสั่ง `removeEventListener()` หรือ `clearInterval()` ใน `onUnmounted()` เพราะจะทำให้ Component เก่าไม่ถูก Garbage Collect และเกิด Memory Leak สะสม
- ✅ **วิธีที่ถูกต้อง:**
  - ใช้ VueUse Composables: `useEventListener()`, `useIntervalFn()`, `useTimeoutFn()` ซึ่งมี Auto-cleanup ในตัว 100%
  - หรือเขียน Cleanup คู่กันเสมอ: `onMounted(...)` $\longleftrightarrow$ `onUnmounted(...)`

---

### 5. 🐛 Nullish Coalescing Trap (`??` vs `||`)
- ❌ **ห้ามทำ:** ใช้ Logical OR (`||`) ในการกำหนดค่า Default กับตัวเลข (`0`) หรือ Boolean (`false`) เพราะค่า `0` และ `false` จะถูกมองเป็น Falsy ทำให้ได้ค่า Default แทนค่าจริงของผู้ใช้
  ```typescript
  // ❌ ถ้าผู้ใช้กรอก 0 บาท ค่าจะกลายเป็น 100
  const fee = inputFee || 100;
  // ❌ ถ้าตั้งค่า config.enabled = false ค่าจะกลายเป็น true
  const isEnabled = config.enabled || true;
  ```
- ✅ **วิธีที่ถูกต้อง:** บังคับใช้ Nullish Coalescing **`??`** สำหรับตัวเลขและ Boolean เสมอ:
  ```typescript
  const fee = inputFee ?? 100;
  const isEnabled = config.enabled ?? true;
  ```

---

### 6. 🚫 Mutation of Component Props & Shared Object References
- ❌ **ห้ามทำ:** แก้ไข Property ของ Object/Array ที่ส่งผ่าน Props เข้ามาโดยตรง (เช่น `props.filter.status = 'active'`) เพราะเป็นการทำ Direct State Mutation นอกขอบเขตของ Parent Component ทำให้ตามรอย Data Flow ได้ยากมาก
- ✅ **วิธีที่ถูกต้อง:** ใช้ `emit('update:modelValue')` หรือทำ Shallow/Deep Clone (`const localFilter = ref({ ...props.filter })`) ก่อนนำไปแก้ไข
