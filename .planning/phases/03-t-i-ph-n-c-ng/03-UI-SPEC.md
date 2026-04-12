---
phase: 3
slug: de-tai-phan-cong
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-07
---

# Phase 03 — UI Design Contract

> Hop dong visual va interaction cho Phase 3: De tai & Phan cong.
> Tao boi gsd-ui-researcher, kiem tra boi gsd-ui-checker.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | none (Tailwind CSS 4 utility-first) |
| Icon library | react-icons/hi2 (Heroicons v2 Outline) |
| Font | Inter, system-ui, -apple-system, sans-serif |

**Ghi chu:** Ke thua design system tu Phase 1 va Phase 2. Khong thay doi, giu nhat quan.

---

## Spacing Scale

Gia tri khai bao (boi so cua 4, dung Tailwind spacing tokens):

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| xs | 4px | p-1, gap-1 | Khoang cach inline nho, gap giua icon va text |
| sm | 8px | p-2, gap-2 | Khoang cach compact giua cac element trong form |
| md | 16px | p-4, gap-4 | Spacing mac dinh giua cac element (form fields, table cells) |
| lg | 24px | p-6, gap-6 | Padding section, sidebar header/footer |
| xl | 32px | p-8, gap-8 | Padding main content area |
| 2xl | 48px | p-12 | Login card padding (da co tu Phase 1) |

Ngoai le: Khong co.

---

## Typography

| Role | Size | Tailwind | Weight | Line Height |
|------|------|----------|--------|-------------|
| Body | 14px | text-sm | 400 (font-normal) | 1.5 (leading-normal) |
| Label | 14px | text-sm | 600 (font-semibold) | 1.5 |
| Heading | 20px | text-xl | 600 (font-semibold) | 1.2 |
| Display / Number | 24px | text-2xl | 600 (font-semibold) | — |
| Small / Caption | 12px | text-xs | 400 (font-normal) | 1.5 |

**Ghi chu:** Nhat quan voi Phase 2 — khong dung text-lg trong trang noi dung. text-2xl chi dung cho summary number cards (GVHD dashboard), khong dung trong body text.

---

## Color

| Role | Value | Tailwind Class | Usage |
|------|-------|----------------|-------|
| Dominant (60%) | #f8fafc | bg-slate-50 | Nen chinh cua main content area |
| Secondary (30%) | #ffffff | bg-white | Card, sidebar, modal, table header |
| Accent (10%) | #3b82f6 | bg-blue-500 / text-blue-600 | Xem danh sach ben duoi |
| Destructive | #ef4444 | bg-red-500 / text-red-500 | Nut xoa, thong bao loi, error text |

**Accent chi dung cho:**
- Nut hanh dong chinh (Phan cong, Luu de tai, Xac nhan)
- Sidebar active state (border-l-blue-600, text-blue-600, bg-blue-50)
- Focus ring tren input (ring-blue-500)
- Badge "Da co de tai" (bg-blue-50, text-blue-600)

**Mau bo sung:**
| Role | Value | Tailwind Class | Usage |
|------|-------|----------------|-------|
| Success | #22c55e | text-green-600 / bg-green-50 | Badge "Da phan cong", badge "Da co GVHD", badge "Da co de tai" |
| Warning | #f59e0b | text-amber-600 / bg-amber-50 | Canh bao GV da du 10 SV, canh bao GVPB trung voi GVHD |
| Border | #e2e8f0 | border-slate-200 | Border card, sidebar, table, input |
| Text primary | #0f172a | text-slate-900 | Tieu de, noi dung quan trong |
| Text secondary | #64748b | text-slate-500 | Placeholder, mo ta, caption |
| Text muted | #94a3b8 | text-slate-400 | Thong tin phu nho (role label) |

---

## Visual Hierarchy & Focal Points

| Screen | Focal Point | Ly do |
|--------|-------------|-------|
| Trang Phan cong GVHD (`/admin/phan-cong/gvhd`) | Nut "Phan cong" (primary button mau xanh, cuoi form) | La hanh dong chinh — assign SV vao GV |
| Trang GVHD dashboard (`/gvhd`) | Nut "Tao de tai" (primary button, goc phai heading khu vuc SV chua co de tai) | GVHD can tao de tai cho SV — day la action quan trong nhat |
| Trang Phan cong GVPB (`/admin/phan-cong/gvpb`) | Dropdown chon GVPB cho tung de tai | Moi hang trong bang la 1 de tai can phan — the primary interactive element la dropdown do |
| Trang GVPB (`/gvpb`) | Bang de tai duoc giao phan bien | La trang doc — focal point la danh sach ro rang, co the scan nhanh |

---

## Component Inventory — Phase 3

### 1. Trang Phan cong GVHD (`/admin/phan-cong/gvhd`)

**Layout:**
```
+------------------------------------------+
| Heading: "Phan cong giang vien huong dan"|
+------------------------------------------+
| Panel trai (1/3)      | Panel phai (2/3)  |
|                       |                   |
| "Chon giang vien"     | "Chon sinh vien"  |
| [Dropdown chon GV]    | [Search SV]       |
|                       | [Checkbox list SV] |
| Thong tin GV da chon: | (filter: chua co GV) |
| - So SV hien tai: 7/10|                   |
| - Warning neu >= 10   |                   |
|                       |                   |
+-- [Huy] [Phan cong] --+-------------------+
```

**Chi tiet component:**

| Element | Tailwind Classes | Ghi chu |
|---------|-----------------|---------|
| Page heading | `text-xl font-semibold text-slate-900 mb-6` | Nhat quan voi cac trang khac |
| 2-panel layout | `grid grid-cols-3 gap-6` | Panel GV: col-span-1, Panel SV: col-span-2 |
| Panel card | `bg-white rounded-lg border border-slate-200 p-6` | |
| Panel heading | `text-sm font-semibold text-slate-700 mb-3` | "Chon giang vien", "Chon sinh vien" |
| GV dropdown | native `<select>` voi cung style dropdown cua Phase 2 | Hien ten GV + so SV: "Nguyen Van A (7/10 SV)" |
| GV capacity bar | `mt-2 text-sm` | "Hien tai: 7/10 SV" |
| GV capacity warning | `mt-2 text-sm text-amber-600 font-semibold flex items-center gap-1` | HiOutlineExclamationTriangle + "Giang vien nay da du 10 sinh vien" — hien khi >= 10 |
| SV search input | Same as Phase 2 search input | Placeholder: "Tim theo MSSV, ho ten..." |
| SV checkbox list | `mt-3 space-y-2 max-h-80 overflow-y-auto` | Scroll khi nhieu SV |
| SV checkbox row | `flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-slate-50` | |
| Checkbox | native `<input type="checkbox">` | `w-4 h-4 text-blue-600 rounded border-slate-300` |
| SV name | `text-sm text-slate-700` | "Nguyen Van A — DH52100123" |
| SV already assigned badge | `text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full` | "Da co GV" — disabled checkbox |
| Selected count | `text-xs text-slate-500 mt-2` | "Da chon: 3 sinh vien" |
| Action row | `flex justify-end gap-3 mt-6` | |
| Cancel button | Secondary button style | Text: "Huy" |
| Assign button | Primary button style | Text: "Phan cong GVHD", disabled khi chua chon GV va SV, hoac khi GV da du 10 SV |

### 2. Trang GVHD Dashboard (`/gvhd`)

**Layout:**
```
+------------------------------------------+
| Heading: "Trang giang vien huong dan"    |
+------------------------------------------+
| Section: "Sinh vien duoc phan cong"      |
|                                          |
| [Summary: X SV, Y co de tai, Z chua co] |
|                                          |
| Table: Ten SV | MSSV | De tai | Trang thai | Actions |
| Nguyen Van A | DH... | "Nghien cuu..." | Da co de tai | [Sua de tai] |
| Tran Van B   | DH... | —               | Chua co de tai | [Tao de tai] |
+------------------------------------------+
| [+ Tao de tai moi]                       |
+------------------------------------------+
```

**Chi tiet component:**

| Element | Tailwind Classes | Ghi chu |
|---------|-----------------|---------|
| Page heading | `text-xl font-semibold text-slate-900 mb-6` | |
| Summary cards row | `grid grid-cols-3 gap-4 mb-6` | |
| Summary card | `bg-white rounded-lg border border-slate-200 p-4` | |
| Summary number | `text-2xl font-semibold text-slate-900` | |
| Summary label | `text-xs text-slate-500 mt-1` | "Tong SV", "Co de tai", "Chua co de tai" |
| Section heading | `text-base font-semibold text-slate-700 mb-3` | |
| Badge "Da co de tai" | `bg-green-50 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full` | |
| Badge "Chua co de tai" | `bg-slate-100 text-slate-500 text-xs font-semibold px-2 py-0.5 rounded-full` | |
| Action "Tao de tai" | `text-sm text-blue-600 hover:text-blue-800` | Text link |
| Action "Sua de tai" | `text-sm text-blue-600 hover:text-blue-800` | Text link |
| Empty state (khong co SV) | Centered trong table area | Heading: "Chua co sinh vien", Body: "Ban chua duoc phan cong huong dan sinh vien nao." |
| Primary button | `bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors` | "Tao de tai moi" — o cuoi trang |

### 3. Modal Tao / Sua De Tai

**Trigger:** Click "Tao de tai" hoac "Sua de tai" tren trang GVHD.

**Layout:**
```
+-- Modal Card (max-w-lg) -----------------+
| [X close]                                |
| Heading: "Tao de tai" / "Sua de tai"    |
|                                          |
| Ten de tai:    [input]                  |
| Mo ta:         [textarea 3 rows]        |
| Sinh vien:     [multi-select: 1-2 SV]   |
|   (chi hien SV cua GVHD nay, chua co de tai) |
|                                          |
| [Huy]                          [Luu]    |
+------------------------------------------+
```

**Chi tiet component:**

| Element | Tailwind Classes | Ghi chu |
|---------|-----------------|---------|
| Overlay va card | Same as Phase 2 modal pattern | `max-w-lg` |
| Close button | `absolute top-4 right-4 text-slate-400 hover:text-slate-600`, HiOutlineXMark icon, `aria-label="Dong"` | |
| Textarea | `border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none` | 3 rows |
| SV multi-select | `space-y-2 mt-1 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-3` | Checkbox list giong trang phan cong |
| SV in modal already has topic | Gray out va khong cho chon | `opacity-50 cursor-not-allowed` |
| Max 2 SV hint | `text-xs text-slate-400 mt-1` | "Chon toi da 2 sinh vien" |
| Button row | Same as Phase 2 modal pattern | |

### 4. Trang Phan cong GVPB (`/admin/phan-cong/gvpb`)

**Layout:**
```
+------------------------------------------+
| Heading: "Phan cong giang vien phan bien"|
+------------------------------------------+
| Table:                                   |
| De tai | Ten SV | GVHD | GVPB hien tai | Chon GVPB |
| Nghien... | A, B | GV Hung | Chua phan | [dropdown] |
| Xay dung..| C    | GV Nam  | GV Lan ✓  | [dropdown] |
+------------------------------------------+
| [Luu tat ca]                             |
+------------------------------------------+
```

**Chi tiet component:**

| Element | Tailwind Classes | Ghi chu |
|---------|-----------------|---------|
| Page heading | `text-xl font-semibold text-slate-900 mb-6` | |
| Table container | `bg-white rounded-lg border border-slate-200 overflow-hidden` | |
| Table | Same as Phase 2 table pattern | |
| GVPB dropdown | native `<select>` | Hien "-- Chon GVPB --" khi chua phan, list GV available |
| GVPB warning (trung GVHD) | `text-xs text-amber-600 mt-1 flex items-center gap-1` | HiOutlineExclamationTriangle + "Trung voi GVHD" — hien duoi dropdown khi chon GVPB = GVHD |
| Badge "Da phan" | `bg-green-50 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full` | |
| Badge "Chua phan" | `bg-slate-100 text-slate-400 text-xs px-2 py-0.5 rounded-full` | |
| Save all button | Primary button style, cuoi trang | "Luu tat ca" — submit toan bo thay doi cung luc |
| Count indicator | `text-sm text-slate-500 mb-4` | "X / Y de tai da duoc phan cong GVPB" |

### 5. Trang GVPB Dashboard (`/gvpb`)

**Layout:**
```
+------------------------------------------+
| Heading: "De tai phan bien"              |
+------------------------------------------+
| Table: Ten de tai | Ten SV | MSSV | GVHD | Trang thai cham |
| Nghien...        | A, B   | ...  | Hung | Chua cham |
| Xay dung...      | C      | ...  | Nam  | Da cham   |
+------------------------------------------+
```

**Chi tiet component:**

| Element | Tailwind Classes | Ghi chu |
|---------|-----------------|---------|
| Page heading | `text-xl font-semibold text-slate-900 mb-6` | |
| Table | Same as Phase 2 table pattern | |
| Badge "Da cham" | `bg-green-50 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full` | |
| Badge "Chua cham" | `bg-slate-100 text-slate-500 text-xs font-semibold px-2 py-0.5 rounded-full` | |
| SV name in cell | Multiple SV thi xep hang: `space-y-1` | "Nguyen Van A<br>Tran Van B" |
| Empty state | Centered: "Ban chua duoc phan cong phan bien de tai nao." | |

---

## Interaction States

### Phan cong GVHD

| State | Behavior |
|-------|----------|
| GV chua duoc chon | Panel ben phai hien GV dropdown, Panel ben trai hien full list SV chua phan |
| GV da duoc chon | Hien thong tin GV (ten, so SV hien tai/toi da) |
| GV da du 10 SV | Warning amber, nut "Phan cong" bi disable |
| SV chua chon | Nut "Phan cong" disabled |
| Dang submit | Nut "Phan cong" hien "Dang xu ly...", disabled |
| Thanh cong | Trang refresh, SV da phan bien mat khoi danh sach "chua phan" |
| Loi server | Error banner phia tren form |

### Tao De Tai

| State | Behavior |
|-------|----------|
| Ten de tai trong | Nut "Luu" disabled, error inline khi submit |
| Chua chon SV | Nut "Luu" disabled |
| Da chon 2 SV | Checkbox cac SV khac bi disabled |
| Dang submit | Loading state tuong tu Phase 2 |
| Thanh cong | Modal dong, table GVHD refresh |

### Phan cong GVPB

| State | Behavior |
|-------|----------|
| Dropdown chua chon | "-- Chon GVPB --" |
| Chon GVPB = GVHD | Warning amber hien ngay duoi dropdown (khong block nhung canh bao) |
| Nhan "Luu tat ca" | Submit cac de tai co thay doi, nut loading, sau do success toast |
| Khong co thay doi | Nut "Luu tat ca" disabled |

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA (phan cong GVHD) | "Phan cong GVHD" |
| Primary CTA (tao de tai) | "Tao de tai" |
| Primary CTA (luu de tai) | "Luu de tai" (khi tao moi), "Cap nhat de tai" (khi sua) |
| Primary CTA (phan cong GVPB) | "Luu tat ca" |
| Empty state heading (GVHD: chua co SV) | "Chua co sinh vien" |
| Empty state body (GVHD: chua co SV) | "Ban chua duoc phan cong huong dan sinh vien nao." |
| Empty state heading (GVPB: chua co de tai) | "Chua co de tai phan bien" |
| Empty state body (GVPB) | "Ban chua duoc phan cong phan bien de tai nao." |
| Empty state (phan cong GVPB: het de tai) | "Tat ca de tai da duoc phan cong GVPB." |
| Warning: GV du 10 SV | "Giang vien nay da du 10 sinh vien, khong the phan cong them." |
| Warning: GVPB trung GVHD | "Canh bao: GVPB trung voi GVHD cua de tai nay." |
| Error: chon qua 2 SV | "Chi duoc chon toi da 2 sinh vien cho 1 de tai." |
| GV dropdown option | "{Ten GV} ({so SV}/{max} SV)" — VD: "Nguyen Van A (7/10 SV)" |
| SV da co GV label | "Da co GV" |
| SV chua co GV label | Khong hien badge — mac dinh |
| Validation: ten de tai required | "Vui long nhap ten de tai" |
| Validation: chua chon SV | "Vui long chon it nhat 1 sinh vien" |
| Confirm phan cong | Khong can confirm dialog — hanh dong co the undo bang cach phan cong lai |
| Loading button | "Dang xu ly..." |
| Success toast (phan cong GVHD) | "Da phan cong thanh cong." |
| Success toast (luu de tai) | "Da luu de tai thanh cong." |
| Success toast (phan cong GVPB) | "Da luu phan cong GVPB." |
| SV da phan vao GV khac | "Da co GV" — checkbox disabled, text muted |
| De tai da phan GVPB badge | "Da phan" |
| De tai chua phan GVPB badge | "Chua phan" |
| Textarea placeholder (mo ta de tai) | "Mo ta ngan ve de tai..." |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | Khong su dung | not applicable |

**Ghi chu:** Nhat quan voi Phase 2 — khong dung third-party component registry.
Tat ca UI la Tailwind utility classes thuan.

---

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| >= 1024px (lg) | Sidebar co dinh 256px, trang phan cong hien 2-panel layout, table day du cot |
| 768-1023px (md) | Sidebar co dinh, trang phan cong switch sang 1 panel (GV dropdown tren, SV list duoi) |
| < 768px (sm) | Khong ho tro (admin tool, focus desktop) |

---

## Accessibility — Muc Co Ban

| Yeu cau | Cach lam |
|---------|---------|
| Focus visible | `focus:ring-2 focus:ring-blue-500` tren tat ca input, select, button |
| Label cho input | Moi `<input>` va `<select>` co `<label>` tuong ung |
| Checkbox accessibility | `<label>` bao quanh checkbox + text |
| Button text | Tat ca button co text label ro rang |
| Close button modal | `aria-label="Dong"` |
| Warning accessibility | `role="alert"` cho warning GV du 10 SV (hien dong) |
| Disabled state | `disabled:opacity-50 cursor-not-allowed` ro rang |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS (FLAG resolved)
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS (FLAG resolved)
- [x] Dimension 5 Spacing: PASS
- [-] Dimension 6 Registry Safety: SKIP (ui_safety_gate: false)

**Approval:** approved 2026-04-07
