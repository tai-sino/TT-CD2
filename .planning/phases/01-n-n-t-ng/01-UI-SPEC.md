---
phase: 1
slug: nen-tang
status: draft
shadcn_initialized: false
preset: none
created: 2026-04-05
---

# Phase 1 — UI Design Contract

> Visual and interaction contract cho Phase 1: Nen tang (Login, Layout, Sidebar, Protected Routes).

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | none (Tailwind utility classes + custom CSS) |
| Icon library | react-icons (bo Font Awesome `fa` + bo `hi2` Heroicons) |
| Font | `Inter`, fallback `system-ui, -apple-system, sans-serif` |

Ghi chu: Khong dung shadcn/radix. Component viet tay bang Tailwind — phu hop trinh do sinh vien. react-icons da co trong package.json, dung `FaUser`, `FaBars`, `HiOutlineLogout`... Khong can cai them icon library.

---

## Spacing Scale

Gia tri khai bao (boi so cua 4, dung Tailwind spacing mac dinh):

| Token | Value | Tailwind class | Usage |
|-------|-------|----------------|-------|
| xs | 4px | `p-1`, `gap-1` | Khoang cach icon-text, inline padding |
| sm | 8px | `p-2`, `gap-2` | Padding compact, gap giua cac element nho |
| md | 16px | `p-4`, `gap-4` | Spacing mac dinh giua cac element |
| lg | 24px | `p-6`, `gap-6` | Padding section, sidebar padding |
| xl | 32px | `p-8`, `gap-8` | Gap lon giua cac section |
| 2xl | 48px | `p-12` | Padding lon trang login card |
| 3xl | 64px | `p-16` | Khong dung trong Phase 1 |

Ngoai le: Sidebar width co dinh `w-64` (256px). Login card max-width `max-w-md` (448px).

---

## Typography

| Role | Size | Weight | Line Height | Tailwind class |
|------|------|--------|-------------|----------------|
| Body | 14px | 400 (normal) | 1.5 | `text-sm font-normal leading-normal` |
| Label | 14px | 500 (medium) | 1.4 | `text-sm font-medium` |
| Heading | 20px | 600 (semibold) | 1.3 | `text-xl font-semibold` |
| Display | 24px | 700 (bold) | 1.2 | `text-2xl font-bold` |

Ghi chu:
- Body 14px thay vi 16px — day la admin tool, can hien thi nhieu data, 14px tiet kiem khong gian.
- Chi dung 2 weight chinh: 400 (normal) cho body va 600 (semibold) cho heading/label. 500 va 700 chi dung khi can nhan manh them.
- Font: `Inter` — pho bien, doc tot o 14px, ho tro tieng Viet day du. Load tu Google Fonts hoac dung font-sans Tailwind mac dinh.

---

## Color

| Role | Value | Tailwind class | Usage |
|------|-------|----------------|-------|
| Dominant (60%) | `#f8fafc` (slate-50) | `bg-slate-50` | Background trang, main content area |
| Secondary (30%) | `#ffffff` | `bg-white` | Login card, sidebar, content cards |
| Accent (10%) | `#3b82f6` (blue-500) | `text-blue-500`, `bg-blue-500` | Xem danh sach ben duoi |
| Destructive | `#ef4444` (red-500) | `text-red-500`, `bg-red-500` | Nut logout, error message, validation error |

**Accent reserved for (CHI dung cho):**
- Nut "Dang nhap" (login button) — `bg-blue-500 hover:bg-blue-600 text-white`
- Sidebar menu item dang active — `text-blue-600 bg-blue-50 border-l-blue-600`
- Link text khi hover — `hover:text-blue-500`
- Focus ring tren input — `focus:ring-blue-500 focus:border-blue-500`

**Mau bo sung:**
| Role | Value | Tailwind class | Usage |
|------|-------|----------------|-------|
| Text primary | `#0f172a` (slate-900) | `text-slate-900` | Heading, body text |
| Text secondary | `#64748b` (slate-500) | `text-slate-500` | Placeholder, helper text, sidebar text |
| Border | `#e2e8f0` (slate-200) | `border-slate-200` | Border input, divider, sidebar border |
| Success | `#22c55e` (green-500) | `text-green-500` | Toast thanh cong (khong dung trong Phase 1) |
| Warning | `#f59e0b` (amber-500) | `text-amber-500` | Canh bao (khong dung trong Phase 1) |

---

## Component Inventory — Phase 1

### 1. LoginPage

**Layout:** Centered card tren nen slate-50. Card background white, rounded-xl, shadow-lg, padding 48px, max-width 448px.

**Thanh phan:**
- Logo/ten he thong: `text-2xl font-bold text-slate-900` — text "Quan ly Luan van Tot nghiep"
- Phu de: `text-sm text-slate-500` — text "Khoa Cong nghe Thong tin — Dai hoc Cong Nghe Sai Gon"
- Input email: `w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500`
- Input password: tuong tu email, co icon toggle show/hide
- Button dang nhap: `w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg`
- Error message: `text-red-500 text-sm mt-2` — hien phia tren form hoac duoi button
- Loading state: button disabled, text doi thanh "Dang xu ly..." voi spinner icon

**States:**
- Default: form trong, button enabled
- Loading: button disabled + spinner, inputs disabled
- Error: hien error text mau do, inputs giu nguyen gia tri da nhap
- Success: redirect toi trang chinh (khong hien gi tren login page)

### 2. Sidebar

**Layout:** Fixed left, width 256px (`w-64`), full height (`h-screen`), background white, border-right `border-r border-slate-200`. Position `fixed left-0 top-0`.

**Thanh phan:**
- Header: padding 24px, ten he thong `text-lg font-semibold text-slate-800`, duoi la divider `border-b border-slate-200`
- Menu items: danh sach link, moi item co icon + text. Padding `px-6 py-3`. Gap giua icon va text `gap-3`.
- Active state: `bg-blue-50 text-blue-600 border-l-4 border-l-blue-600 font-medium`
- Hover state: `hover:bg-slate-50 hover:text-slate-900`
- Default state: `text-slate-500`
- User info: o duoi cung sidebar (footer), hien ten user + role. `border-t border-slate-200 px-6 py-4`
- Nut logout: trong footer, text do `text-red-500 hover:text-red-700`, icon logout ben trai

**Menu theo role:**

| Role | Menu items |
|------|-----------|
| admin | Tong quan, Sinh vien, Giang vien, Phan cong GVHD, De tai, Phan cong GVPB, Hoi dong, Diem tong ket, Cai dat |
| gvhd | Sinh vien cua toi, De tai huong dan, Cham diem |
| gvpb | De tai phan bien, Cham diem phan bien |
| sv | De tai cua toi |

Ghi chu: Phase 1 chi can render menu, cac trang con chua co noi dung — hien placeholder "Chuc nang dang phat trien".

### 3. MainLayout

**Layout:** Sidebar fixed ben trai + main content area chiem phan con lai.

```
+--sidebar(256px)--+----------main content-----------+
|                  |                                  |
|  Logo/Ten        |   Page header (optional)         |
|  Menu items      |   Page content                   |
|  ...             |                                  |
|                  |                                  |
|  User info       |                                  |
|  Logout          |                                  |
+------------------+----------------------------------+
```

- Main content: `ml-64 min-h-screen bg-slate-50 p-8`
- Khong co top navbar — sidebar la navigation duy nhat

### 4. ProtectedRoute

**Behavior:**
- Check token trong localStorage
- Neu khong co token: redirect ve `/login`
- Neu co token: render children
- Khong can check role o route level trong Phase 1 — chi check da login hay chua

---

## Copywriting Contract

Tat ca text hien thi tren giao dien dung **tieng Viet co dau**.

| Element | Copy |
|---------|------|
| Tieu de login | Quan ly Luan van Tot nghiep |
| Phu de login | Khoa Cong nghe Thong tin — Dai hoc Cong Nghe Sai Gon |
| Label email | Email |
| Label password | Mat khau |
| Placeholder email | Nhap email cua ban |
| Placeholder password | Nhap mat khau |
| Primary CTA (login) | Dang nhap |
| Loading CTA | Dang xu ly... |
| Error: sai thong tin | Email hoac mat khau khong dung. Vui long thu lai. |
| Error: server | Khong the ket noi den may chu. Vui long thu lai sau. |
| Error: field required | Vui long nhap day du thong tin. |
| Sidebar header | QL Luan van |
| Placeholder page | Chuc nang dang phat trien |
| User greeting (sidebar footer) | Xin chao, {ten_user} |
| Role label: admin | Thu ky khoa |
| Role label: gvhd | Giang vien huong dan |
| Role label: gvpb | Giang vien phan bien |
| Role label: sv | Sinh vien |
| Logout button | Dang xuat |
| Confirm logout | Ban co chac chan muon dang xuat? |

---

## Interaction Contract

### Login Flow
1. User nhap email + password
2. Bam "Dang nhap" hoac Enter
3. Button chuyen sang loading state (disabled + spinner)
4. **Thanh cong:** luu token vao localStorage, goi `/api/me` lay user info, redirect theo role:
   - admin → `/admin/tong-quan`
   - gvhd → `/gvhd/sinh-vien`
   - gvpb → `/gvpb/de-tai`
   - sv → `/sv/de-tai`
5. **That bai:** hien error message mau do, button ve lai trang thai binh thuong, inputs giu nguyen value

### Sidebar Navigation
1. Click menu item → navigate toi route tuong ung
2. Active item duoc highlight (bg-blue-50 + border-left)
3. Logout: click "Dang xuat" → xoa token khoi localStorage → redirect ve `/login`

### Protected Route
1. Truy cap bat ky route nao (tru `/login`) khi chua dang nhap → redirect ve `/login`
2. Truy cap `/login` khi da dang nhap → redirect ve trang mac dinh theo role

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| none | n/a | not applicable |

Ghi chu: Project khong dung shadcn, khong co third-party registry. Tat ca component viet tay bang Tailwind CSS.

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS
- [ ] Dimension 2 Visuals: PASS
- [ ] Dimension 3 Color: PASS
- [ ] Dimension 4 Typography: PASS
- [ ] Dimension 5 Spacing: PASS
- [ ] Dimension 6 Registry Safety: PASS

**Approval:** pending
