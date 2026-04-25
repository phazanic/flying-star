# Flying Star (ดาวเหิน) - Agent Guide

## Project Overview

โปรเจค **"ดาวเหิน 9 ช่อง" (Flying Star Calculator)** เป็นเว็บแอปพลิเคชันแบบ Static (HTML/CSS/JS) สำหรับแสดงตารางดาวเหิน (Flying Star) ตามหลักฮวงจุ้ย ในรูปแบบกริด 3×3 พร้อมระบบหมุนทิศและอนิเมชันที่สวยงาม

## Tech Stack

| เทคโนโลยี | รายละเอียด |
|---|---|
| **HTML5** | โครงสร้างหน้าเพจ |
| **Vanilla CSS** | สไตล์ทั้งหมด ใช้ CSS Variables, Glassmorphism, Responsive Design |
| **Vanilla JavaScript** | ลอจิกการคำนวณดาวเหิน, DOM manipulation, อนิเมชัน |
| **Google Fonts** | Sarabun (Thai text), Outfit (ตัวเลข & หัวข้อ) |

> **ไม่มี** build tool, framework, หรือ dependency ใดๆ — เปิดไฟล์ `index.html` ในเบราว์เซอร์ได้โดยตรง

## File Structure

```
ดาวเหิน/
├── index.html   # โครงสร้างหน้าเว็บหลัก (กริด 3×3, ปุ่มควบคุม, เข็มทิศ)
├── style.css    # สไตล์ทั้งหมด (ธีม Imperial Red & Gold, อนิเมชัน, Responsive)
├── script.js    # ลอจิกดาวเหิน (การคำนวณ, การหมุนทิศ, อนิเมชัน)
└── agent.md     # ไฟล์นี้
```

## Design Theme

- **ธีม**: Imperial Red & Gold — พื้นหลังโทนแดงเข้ม `#450a0a` ผสมสีทอง `#fbbf24`
- **สไตล์**: Glassmorphism (backdrop-filter, semi-transparent backgrounds, subtle borders)
- **อนิเมชัน**: Scale + rotation transitions สำหรับตัวเลข, staggered fade in/out เมื่อหมุนทิศ
- **Responsive**: รองรับหน้าจอมือถือ (breakpoint 480px)

## Core Concepts

### ตารางดาวเหิน (Flying Star Grid)

กริด 3×3 แสดงตัวเลข 1–9 ตามตำแหน่งทิศ พร้อมความหมายของแต่ละดาว:

| ดาว | ความหมาย |
|-----|----------|
| 1 | การเงิน การงาน |
| 2 | เจ็บป่วย |
| 3 | ฉ้อฉล หลอกลวง |
| 4 | ไหวพริบ ปฏิภาณ |
| 5 | อุบัติเหตุ เสียเงิน * |
| 6 | โชคลาภ |
| 7 | ศัตรู ทะเลาะ อาฆาต |
| 8 | ดาวเฮง * |
| 9 | ความก้าวหน้า |

### การเรียงลำดับดาว (Flying Path)

ลำดับการเดินทางของดาว: **C → NW → W → NE → S → N → SW → E → SE**

โดย "C" คือจุดกลาง (cell-4) จากนั้นกระจายไปตามทิศ 8 ทิศตามลำดับ

### ระบบหมุนทิศ (Compass Rotation)

- ทิศ 8 ทิศเรียงตามเข็มนาฬิกา: `S → SW → W → NW → N → NE → E → SE`
- ค่าเริ่มต้น: ทิศ S อยู่ด้านบน
- กดปุ่มหมุน → ทิศหมุนตามเข็มนาฬิกา 1 ขั้น
- เมื่อหมุนทิศ ตำแหน่งดาวในกริดจะถูกคำนวณใหม่ตาม Direction Mapping

## Key Functions (script.js)

### `getDirectionMapping(facingTop)`
คำนวณ mapping ระหว่าง cell index (0–8) กับทิศ โดยอิงจากทิศที่อยู่ด้านบน (`facingTop`)

### `updateCompassLabels(animate)`
อัปเดตป้ายทิศรอบกริด (ทั้ง 8 ทิศ) พร้อม fade animation ถ้า `animate = true`

### `updateGrid(centerStar, animate)`
อัปเดตตัวเลขและความหมายในกริดทั้ง 9 ช่อง:
- `animate = true` → staggered fade-out/fade-in (ใช้ตอนหมุนทิศ)
- `animate = false` → scale + rotation animation (ใช้ตอนกด Next/Prev)

## User Interactions

| ปุ่ม | การทำงาน |
|------|----------|
| **ย้อนกลับ** (`#prev-btn`) | เลื่อนดาวกลางลง 1 (9 → 8 → 7 → ... → 1 → 9) |
| **ถัดไป** (`#next-btn`) | เลื่อนดาวกลางขึ้น 1 (1 → 2 → 3 → ... → 9 → 1) |
| **หมุนทิศ** (`#rotate-btn`) | หมุนทิศตามเข็มนาฬิกา 1 ขั้น พร้อม smooth animation |

## CSS Architecture

### CSS Variables (`:root`)
```css
--bg-color: #450a0a        /* พื้นหลัง */
--card-bg: rgba(69,10,10,0.7) /* พื้นหลังการ์ด */
--gold: #fbbf24            /* สีทอง (หลัก) */
--gold-dark: #d97706       /* สีทอง (เข้ม) */
--text-primary: #fef2f2    /* ข้อความหลัก */
--text-secondary: #fca5a5  /* ข้อความรอง */
--accent: #ef4444          /* สีเน้น */
--glass-border: rgba(255,255,255,0.1) /* ขอบ glassmorphism */
```

### Animation Keyframes
- **`fadeIn`** — Dashboard เลื่อนขึ้นพร้อม fade (โหลดครั้งแรก)
- **`fly`** — ตัวเลขบินเข้ามาพร้อม scale + rotation (Next/Prev)
- **`smoothFadeIn`** — ตัวเลข fade-in พร้อม scale + rotation (หมุนทิศ)
- **`smoothFadeInMeaning`** — ข้อความความหมาย slide-up fade-in (หมุนทิศ)

## Development Guidelines

### การเพิ่มฟีเจอร์

1. **เพิ่มความหมายดาว** → แก้ object `starMeanings` ใน `script.js`
2. **เปลี่ยนธีมสี** → แก้ CSS Variables ใน `:root` ของ `style.css`
3. **เพิ่มปุ่มควบคุม** → เพิ่ม HTML ใน `.controls` และ event listener ใน `script.js`
4. **ปรับอนิเมชัน** → แก้ `@keyframes` ใน `style.css` หรือ timing ใน `script.js`

### หลักการสำคัญ

- ใช้ **Vanilla JS** เท่านั้น — ไม่มี framework/library
- ใช้ **CSS Variables** สำหรับค่าสีทั้งหมด เพื่อให้เปลี่ยนธีมได้ง่าย
- ทำ **Responsive Design** — ทดสอบทั้ง Desktop และ Mobile (≤ 480px)
- อนิเมชันต้อง **ไม่แข็งกระด้าง** — ใช้ `cubic-bezier(0.34, 1.56, 0.64, 1)` สำหรับ bounce effect
- ข้อความทั้งหมดเป็น **ภาษาไทย** (ยกเว้นป้ายทิศที่เป็นภาษาอังกฤษ N, S, E, W, etc.)

### สิ่งที่ต้องระวัง

- ป้องกัน **double-click** ตอนหมุนทิศ ด้วย `isAnimating` flag
- ค่า `starValue` ต้องอยู่ในช่วง **1–9** เสมอ (wrap around)
- เมื่อหมุนทิศ ต้องอัปเดตทั้ง **compass labels** และ **grid values** พร้อมกัน
- **Staggered animation timing** — cell แต่ละช่องมี delay ต่างกัน (25ms สำหรับ fade-out, 30ms สำหรับ fade-in)
