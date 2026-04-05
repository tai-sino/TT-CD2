---
phase: 2
slug: quan-ly-sv-gv
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-05
---

# Phase 02 — UI Design Contract

> Hop dong visual va interaction cho Phase 2: Quan ly Sinh vien & Giang vien.
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

**Ghi chu:** Project khong dung shadcn. Phase 1 da thiet lap pattern voi Tailwind thuan.
Giu nguyen approach nay de nhat quan va phu hop phong cach sinh vien.

---

## Spacing Scale

Gia tri khai bao (boi so cua 4, dung Tailwind spacing tokens):

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| xs | 4px | p-1, gap-1 | Khoang cach inline nho, gap giua icon va text |
| sm | 8px | p-2, gap-2 | Khoang cach compact giua cac element trong form |
| md | 16px | p-4, gap-4 | Spacing mac dinh giua cac element (form fields, table cells) |
| lg | 24px | p-6, gap-6 | Padding section, sidebar header/footer |
| xl | 32px | p-8, gap-8 | Padding main content area (da co tu Phase 1: `p-8`) |
| 2xl | 48px | p-12 | Login card padding (da co tu Phase 1: `p-12`) |

Ngoai le: Khong co.

---

## Typography

| Role | Size | Tailwind | Weight | Line Height |
|------|------|----------|--------|-------------|
| Body | 14px | text-sm | 400 (font-normal) | 1.5 (leading-normal) |
| Label | 14px | text-sm | 500 (font-medium) | 1.5 |
| Heading | 20px | text-xl | 600 (font-semibold) | 1.2 |
| Small / Caption | 12px | text-xs | 400 (font-normal) | 1.5 |

**Ghi chu tu Phase 1:**
- Tieu de trang dung `text-xl font-semibold text-slate-900` (da thiet lap o PlaceholderPage)
- Label form dung `text-sm font-medium text-slate-700` (da thiet lap o LoginPage)
- Body text dung `text-sm text-slate-500` cho secondary content
- Khong dung text-lg hoac text-2xl trong cac trang noi dung (chi dung o login)

---

## Color

| Role | Value | Tailwind Class | Usage |
|------|-------|----------------|-------|
| Dominant (60%) | #f8fafc | bg-slate-50 | Nen chinh cua main content area |
| Secondary (30%) | #ffffff | bg-white | Card, sidebar, modal, table header |
| Accent (10%) | #3b82f6 | bg-blue-500 / text-blue-600 | Xem danh sach ben duoi |
| Destructive | #ef4444 | bg-red-500 / text-red-500 | Nut xoa, thong bao loi, error text |

**Accent chi dung cho:**
- Nut hanh dong chinh (Import, Them moi, Luu)
- Sidebar active state (border-l-blue-600, text-blue-600, bg-blue-50)
- Focus ring tren input (ring-blue-500)
- Link/text dang click duoc khi can phan biet voi body text

**Mau bo sung:**
| Role | Value | Tailwind Class | Usage |
|------|-------|----------------|-------|
| Success | #22c55e | text-green-600 / bg-green-50 | Thong bao import thanh cong, badge trang thai "da co de tai" |
| Warning | #f59e0b | text-amber-600 / bg-amber-50 | Canh bao (VD: loi import theo dong) |
| Border | #e2e8f0 | border-slate-200 | Border card, sidebar, table, input |
| Text primary | #0f172a | text-slate-900 | Tieu de, noi dung quan trong |
| Text secondary | #64748b | text-slate-500 | Placeholder, mo ta, caption |
| Text muted | #94a3b8 | text-slate-400 | Thong tin phu nho (role label, timestamp) |

---

## Component Inventory — Phase 2

### 1. Trang Sinh Vien (`/admin/sinh-vien`)

**Layout:**
```
+------------------------------------------+
| Heading: "Sinh vien"                     |
| [Dropdown Ky LVTN] [Input Search] [Btn Import] [Btn Them SV] |
+------------------------------------------+
| Table: MSSV | Ho ten | Lop | Email | GVHD | De tai | Actions |
| row ...                                  |
| row ...                                  |
+------------------------------------------+
| Pagination: < 1 2 3 ... >               |
+------------------------------------------+
```

**Chi tiet component:**

| Element | Tailwind Classes | Ghi chu |
|---------|-----------------|---------|
| Page heading | `text-xl font-semibold text-slate-900 mb-6` | Nhat quan voi PlaceholderPage |
| Toolbar row | `flex items-center gap-4 mb-4` | Chua filter, search, action buttons |
| Search input | `border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none` | Placeholder: "Tim theo MSSV, ho ten..." |
| Filter dropdown (Ky) | `border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white` | native `<select>` — don gian |
| Filter dropdown (Lop) | same as Ky dropdown | Placeholder option: "Tat ca lop" |
| Primary button (Import) | `bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors` | Text: "Import Excel" |
| Secondary button (Them SV) | `border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium px-4 py-2 rounded-lg transition-colors` | Text: "Them sinh vien" |
| Table container | `bg-white rounded-lg border border-slate-200 overflow-hidden` | |
| Table header row | `bg-slate-50 text-left text-xs font-medium text-slate-500 uppercase tracking-wider` | |
| Table header cell | `px-4 py-3` | |
| Table body cell | `px-4 py-3 text-sm text-slate-700 border-t border-slate-100` | |
| Table row hover | `hover:bg-slate-50` | |
| Action buttons in row | `text-sm text-blue-600 hover:text-blue-800 mr-3` cho Sua, `text-sm text-red-500 hover:text-red-700` cho Xoa | Text links, khong phai icon buttons |
| Pagination container | `flex items-center justify-between mt-4` | |
| Pagination info | `text-sm text-slate-500` | "Hien thi 1-20 / 150 sinh vien" |
| Pagination buttons | `px-3 py-1 text-sm border border-slate-200 rounded hover:bg-slate-50` | Active: `bg-blue-500 text-white border-blue-500` |

### 2. Modal Import Excel

**Trigger:** Click nut "Import Excel" tren trang Sinh Vien.

**Layout:**
```
+-- Modal Overlay (bg-black/50) -----------+
| +-- Modal Card (max-w-lg) -------------+ |
| | Heading: "Import danh sach sinh vien"| |
| |                                      | |
| | [Dropdown chon Ky LVTN]             | |
| | [File Input: Chon file Excel]        | |
| | [Btn: Import]                        | |
| |                                      | |
| | --- Ket qua (sau khi import) ---     | |
| | Success: "Da import 45 sinh vien"    | |
| | Error table (neu co):                | |
| |   Dong | Loi                          | |
| |   5    | MSSV trung                   | |
| |   12   | Thieu ho ten                 | |
| +--------------------------------------+ |
+------------------------------------------+
```

**Chi tiet component:**

| Element | Tailwind Classes | Ghi chu |
|---------|-----------------|---------|
| Overlay | `fixed inset-0 bg-black/50 flex items-center justify-center z-50` | Click outside de dong |
| Modal card | `bg-white rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto` | |
| Modal heading | `text-lg font-semibold text-slate-900 mb-4` | |
| Close button (X) | `absolute top-4 right-4 text-slate-400 hover:text-slate-600` | HiOutlineXMark icon, size 20 |
| File input | native `<input type="file" accept=".xlsx,.xls">` voi styling | `text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100` |
| Import button | Same as Primary button | Text: "Import", disabled khi chua chon file hoac dang loading |
| Loading state | Spinner + "Dang xu ly..." thay doi text button | `disabled:opacity-50` |
| Success message | `bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg mt-4` | "Da import N sinh vien thanh cong" |
| Error table | `mt-4 border border-amber-200 rounded-lg overflow-hidden` | Header bg-amber-50 |
| Error row | `text-sm px-3 py-2 border-t border-amber-100` | Column: Dong (number), Loi (text) |

### 3. Modal Them/Sua Sinh Vien

**Layout:**
```
+-- Modal Card (max-w-md) -----------------+
| Heading: "Them sinh vien" / "Sua sinh vien" |
|                                          |
| MSSV:       [input]     (disabled khi sua) |
| Ho ten:     [input]                      |
| Lop:        [input]                      |
| Email:      [input]                      |
| Ky LVTN:    [dropdown]                   |
|                                          |
| [Huy]                          [Luu]    |
+------------------------------------------+
```

| Element | Ghi chu |
|---------|---------|
| Form fields | Dung chung style voi LoginPage: `border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none` |
| Label | `text-sm font-medium text-slate-700 mb-1` |
| Field spacing | `mb-4` giua cac field |
| Button row | `flex justify-end gap-3 mt-6` |
| Cancel button | `border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 text-sm rounded-lg` | Text: "Huy" |
| Save button | Primary button style | Text: "Luu" |
| Validation error | `text-red-500 text-xs mt-1` duoi field bi loi |

### 4. Trang Giang Vien (`/admin/giang-vien`)

**Layout:**
```
+------------------------------------------+
| Heading: "Giang vien"                    |
| [Input Search]               [Btn Them GV] |
+------------------------------------------+
| Table: Ma GV | Ten GV | Email | Hoc vi | SV HD | DT PB | HD | Actions |
| GV001 | Nguyen Van A | ... | ThS | 7/10 | 3 | 1 | Sua Xoa |
+------------------------------------------+
```

**Dac biet:**
- Cot "SV HD" hien `{current}/{max}` — VD: `7/10`. Khi dat 10/10 thi text mau amber-600.
- Cot "DT PB" va "HD" hien so don gian.
- Admin voi `isAdmin: true` hien badge `Admin` nho mau blue.

| Element | Tailwind Classes |
|---------|-----------------|
| Badge Admin | `bg-blue-50 text-blue-600 text-xs font-medium px-2 py-0.5 rounded-full` |
| So SV gan day (7/10) | `text-sm text-slate-700` binh thuong, `text-sm text-amber-600 font-medium` khi = 10 |

### 5. Modal Them/Sua Giang Vien

**Layout:**
```
+-- Modal Card (max-w-md) -----------------+
| Heading: "Them giang vien" / "Sua giang vien" |
|                                          |
| Ma GV:     [input]      (disabled khi sua) |
| Ho ten:    [input]                       |
| Email:     [input]                       |
| Hoc vi:    [dropdown: ThS / TS / PGS.TS / GS.TS] |
| Mat khau:  [input]  (bat buoc khi them, optional khi sua) |
| [x] La Admin                             |
|                                          |
| [Huy]                          [Luu]    |
+------------------------------------------+
```

| Element | Ghi chu |
|---------|---------|
| Checkbox "La Admin" | `flex items-center gap-2` voi native checkbox + `text-sm text-slate-700` |
| Hoc vi dropdown | native `<select>` voi options: ThS, TS, PGS.TS, GS.TS |
| Password hint khi sua | `text-xs text-slate-400 mt-1` — "De trong neu khong doi mat khau" |

### 6. Trang Cai Dat Ky LVTN (`/admin/cai-dat`)

**Layout:**
```
+------------------------------------------+
| Heading: "Cai dat ky luan van"           |
+------------------------------------------+
| Card: Ky LVTN hien tai                   |
|                                          |
| Ten ky:            [input: "HK2 2025-2026"] |
| Ngay bat dau:      [date input]          |
| Ngay nhan de tai:  [date input]          |
| Ngay cham 50%:     [date input]          |
| Ngay phan bien:    [date input]          |
| Ngay bao ve:       [date input]          |
| Ngay ket thuc:     [date input]          |
|                                          |
| [Luu thay doi]                           |
+------------------------------------------+
| Card: Danh sach ky cu (neu co)           |
| Table nho: Ten ky | Trang thai | Actions |
+------------------------------------------+
```

| Element | Ghi chu |
|---------|---------|
| Card container | `bg-white rounded-lg border border-slate-200 p-6 mb-6` |
| Date input | native `<input type="date">` voi cung style input | `border border-slate-200 rounded-lg px-4 py-2 text-sm` |
| Form layout | 2 cot tren man hinh lon: `grid grid-cols-1 md:grid-cols-2 gap-4` |
| Active badge | `bg-green-50 text-green-600 text-xs font-medium px-2 py-0.5 rounded-full` — "Dang hoat dong" |
| Inactive badge | `bg-slate-100 text-slate-500 text-xs font-medium px-2 py-0.5 rounded-full` — "Da ket thuc" |

### 7. Dialog Xac Nhan Xoa

**Layout:**
```
+-- Modal Card (max-w-sm) -----------------+
| Icon canh bao (HiOutlineExclamationTriangle) |
| "Xoa sinh vien?"                         |
| "Ban co chac muon xoa sinh vien          |
|  Nguyen Van A (DH52100123)?              |
|  Hanh dong nay khong the hoan tac."      |
|                                          |
| [Huy]                          [Xoa]    |
+------------------------------------------+
```

| Element | Tailwind Classes |
|---------|-----------------|
| Warning icon | `text-red-500 mx-auto mb-3` size 40 |
| Heading | `text-lg font-semibold text-slate-900 text-center` |
| Body text | `text-sm text-slate-500 text-center mt-2` |
| Delete button | `bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg` | Text: "Xoa" |

---

## Interaction States

### Table

| State | Behavior |
|-------|----------|
| Loading | Skeleton rows: 5 dong voi `bg-slate-100 animate-pulse rounded h-4` thay cho text |
| Empty (chua import) | Empty state centered trong table area |
| Empty (filter khong co ket qua) | "Khong tim thay sinh vien phu hop" centered |
| Error (API fail) | Error banner phia tren table |
| Row hover | `hover:bg-slate-50` transition nhe |

### Form/Modal

| State | Behavior |
|-------|----------|
| Pristine | Button "Luu" enabled, khong co error |
| Validating | Inline error text duoi field bi loi, border field chuyen sang `border-red-300` |
| Submitting | Button hien "Dang luu..." va `disabled:opacity-50`, tat ca input disabled |
| Success | Modal tu dong dong, table refetch (invalidate query) |
| Server error | Error message phia tren form: `bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg` |

### Import Flow

| State | Behavior |
|-------|----------|
| Chua chon file | Button "Import" disabled (`opacity-50 cursor-not-allowed`) |
| Da chon file | Hien ten file, button enabled |
| Dang import | Button hien "Dang xu ly...", spinner animation, file input disabled |
| Thanh cong (khong loi) | Success banner mau xanh + so luong da import. Table SV refetch. |
| Thanh cong (co loi 1 so dong) | Success banner + error table ben duoi liet ke tung dong loi |
| That bai (server error) | Error banner mau do: "Khong the import file. Vui long thu lai." |

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| Primary CTA (SV page) | "Import Excel" |
| Primary CTA (GV page) | "Them giang vien" |
| Primary CTA (Ky LVTN) | "Luu thay doi" |
| Secondary CTA | "Them sinh vien" |
| Empty state heading (SV) | "Chua co sinh vien" |
| Empty state body (SV) | "Import danh sach sinh vien tu file Excel de bat dau." |
| Empty state heading (GV) | "Chua co giang vien" |
| Empty state body (GV) | "Them giang vien dau tien de bat dau su dung he thong." |
| Empty state heading (Ky) | "Chua co ky luan van" |
| Empty state body (Ky) | "Tao ky luan van moi de bat dau quan ly." |
| Error state (API) | "Khong the tai du lieu. Vui long thu lai sau." |
| Error state (Import file) | "File khong hop le. Vui long su dung file Excel (.xlsx, .xls)." |
| Error state (Import dong) | "Dong {N}: {mo ta loi cu the}" — VD: "Dong 5: MSSV da ton tai" |
| Import success | "Da import {N} sinh vien thanh cong." |
| Import partial | "Da import {N} sinh vien. {M} dong bi loi (xem chi tiet ben duoi)." |
| Destructive: Xoa SV | "Xoa sinh vien?": "Ban co chac muon xoa sinh vien {ten} ({mssv})? Hanh dong nay khong the hoan tac." |
| Destructive: Xoa GV | "Xoa giang vien?": "Ban co chac muon xoa giang vien {ten} ({maGV})? Hanh dong nay khong the hoan tac." |
| Destructive blocked | "Khong the xoa giang vien {ten} vi dang huong dan {N} sinh vien." |
| Validation: field required | "Vui long nhap {ten field}" |
| Validation: email format | "Email khong hop le" |
| Validation: MSSV trung | "MSSV nay da ton tai trong he thong" |
| Pagination info | "Hien thi {start}-{end} / {total} {entity}" |
| Search placeholder (SV) | "Tim theo MSSV, ho ten..." |
| Search placeholder (GV) | "Tim theo ten, email..." |
| Filter all (Lop) | "Tat ca lop" |
| Filter all (Ky) | "Tat ca ky" |
| Loading button | "Dang xu ly..." |
| Loading save | "Dang luu..." |
| Modal close confirm | Khong can — modal chi co form data, dong = huy |

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| shadcn official | Khong su dung | not applicable |

**Ghi chu:** Project nay khong dung shadcn hoac bat ky third-party component registry nao.
Tat ca component duoc build truc tiep voi Tailwind CSS utility classes.
@tanstack/react-table la headless library (khong co UI components), khong thuoc registry.

---

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| >= 1024px (lg) | Sidebar co dinh 256px, main content ml-64, table hien day du cot |
| 768-1023px (md) | Sidebar co dinh, table an cot it quan trong (Email, De tai) |
| < 768px (sm) | Khong ho tro — he thong nay chu yeu dung tren desktop (admin/GV) |

**Ghi chu:** Theo CLAUDE.md — "Web responsive la du. Khong ai can app rieng cho quan ly LVTN."
Tuy nhien, day la admin tool — focus desktop. Khong can invest vao mobile layout.

---

## Accessibility — Muc Co Ban

| Yeu cau | Cach lam |
|---------|---------|
| Focus visible | Tailwind `focus:ring-2 focus:ring-blue-500` tren tat ca input va button |
| Label cho input | Moi `<input>` co `<label>` tuong ung (da co tu LoginPage pattern) |
| Button text | Tat ca button co text label ro rang, khong chi icon |
| Color contrast | text-slate-900 tren bg-white = ratio > 10:1 (PASS WCAG AA) |
| Error association | Error text nam ngay duoi input tuong ung |

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
