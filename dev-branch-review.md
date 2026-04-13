# Review branch `origin/dev` — 2026-04-12

> **Tác giả:** Angel Git / khanh779-9 (Trần Quốc Khánh)
> **Branch:** `origin/dev`
> **Tổng commits hôm nay:** 11 commits

---

## Tổng quan kiến trúc (branch `dev`)

Branch `dev` là một project **khác cấu trúc** với `master`:

| Thông tin | Chi tiết |
|-----------|----------|
| Kiến trúc | Tách BE/FE — Laravel 12 API + React (Vite) |
| Backend | Laravel 12, PHP 8.3, MySQL |
| Frontend | React 18 + Vite + TailwindCSS + React Router 6 |
| Deploy | BE: Render (Docker) / FE: Vercel |
| Database | `temp_db/quanly_lvtn_v2.sql` (raw SQL dump) |

---

## Chi tiết từng commit

---

### `45be70e` — 08:58 — fix: fockerfile

> **Thực chất:** Đây là lần đầu tiên push **toàn bộ project** lên remote. Tên commit misleading.

**Files thêm mới (165 files, +35,787 dòng):**

- `backend/` — Toàn bộ Laravel 12:
  - `app/Http/Controllers/`: `AuthController`, `SinhVienController`, `GiangVienController`, `DeTaiController`, `KyLvtnController`, `TopicRegistrationFormController`, `CauHinhController`
  - `app/Models/`: `SinhVien`, `GiangVien`, `DeTai`, `KyLvtn`, `HoiDong`, `ThanhVienHoiDong`, `DiemHoiDong`, `CauHinh`, `TopicRegistrationForm`
  - `database/migrations/`: 11 migration files (từ `personal_access_tokens` đến `topic_registrations_form`)
  - `routes/api.php`, `routes/web.php`
  - `backend/Dockerfile` (php:8.3-cli, port 10000)
  - `tests/Feature/`: `StudentCrudTest`, `StudentImportTest`, `LecturerCrudTest`, `KyLvtnTest`
  - `tests/fixtures/`: 2 file Excel test (valid + error)

- `frontend/` — Toàn bộ React:
  - `src/pages/admin/`: `TongQuan`, `SinhVien`, `GiangVien`, `PhanCong`, `NhapLieu`, `DeTai`, `HoiDong`, `Diem`, `CaiDat`
  - `src/pages/gvhd/`: `SinhVien`, `DeTai`, `ChamDiem`
  - `src/pages/gvpb/`: `DeTai`, `ChamDiem`
  - `src/pages/sv/`: `DeTai`
  - `src/services/`: `api.js`, `authService.js`, `sinhVienService.js`, `giangVienService.js`, `deTaiService.js`, `nhapLieuService.js`, `kyLvtnService.js`
  - `src/context/AuthContext.jsx`, `src/components/Sidebar.jsx`, `src/layouts/MainLayout.jsx`
  - `public/assets/`: logo STU, background, animation Lottie

- `.planning/` — Toàn bộ tài liệu planning:
  - `PROJECT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`
  - `phases/01-nen-tang/`, `phases/02-quan-ly-sv-gv/`, `phases/03-phan-cong/`
  - `research/ARCHITECTURE.md`, `FEATURES.md`, `PITFALLS.md`, `STACK.md`

- `huong_dan/` — Tài liệu + dữ liệu:
  - `DS SV BV LVTN T10_2025.xlsx` — danh sách SV bảo vệ
  - `DSSV_GVHD_TenDeTai_LVTN_Dot2_17112025.xlsx` — danh sách SV + GVHD + đề tài
  - `Projects.docx`, `phieu_giao_de_tai.docx`
  - Template chấm điểm: `template_chamdiem_hd_1sv.docx`, `template_chamdiem_hd_2sv.docx`, `template_chamdiem_pb_1sv.docx`, `template_chamdiem_pb_2sv.docx`
  - `intro.txt`, `intro2.txt`, `intro3.txt`, `intro_kernel.txt`

- `render.yaml` — config deploy Render
- `scripts/generate_fixtures.php`
- `temp_db/quanly_lvtn_v2.sql` (588 dòng SQL)

---

### `10b0e4d` + `c6a18f8` — 10:30 / 10:34 — fix: fix docker

**File thay đổi:** `backend/Dockerfile`

Sửa lỗi Dockerfile backend. 2 lần commit liên tiếp cho cùng vấn đề.

---

### `d877dd9` + `eb07f7d` + `8b0d4a8` — 10:54 / 10:58 / 11:02 — chore: update main.jsx

**File thay đổi:** `frontend/src/main.jsx`

3 lần commit liên tiếp cùng nội dung — cập nhật `main.jsx` để wrap app trong `React.StrictMode` và `BrowserRouter`.

---

### `07ed6e2` — 11:25 — fix: redirect login

**File thay đổi:** `frontend/src/services/api.js` (+1/-1)

```diff
- window.location.href = '/login';
+ // window.location.href = '/login';
```

> Comment out dòng auto-redirect về `/login` khi nhận response 401. Tạm thời tắt để debug flow auth.

---

### `ed6a5a5` — 12:02 — chrore: change vali

**File thay đổi:** `backend/app/Http/Controllers/AuthController.php` (+2/-2)

```diff
- 'maGV' => 'required',
- 'password' => 'required',
+ 'maGV' => 'required|string',
+ 'password' => 'required|string',
```

> Thêm rule `|string` vào validation login để chặn input không phải string.

---

### `4d6c604` — 16:26 — refactor: restructure pages folder

**Files thay đổi:** 26 files (+1,967 dòng / -41 dòng)

**Thay đổi cấu trúc thư mục:**

| Trước | Sau |
|-------|-----|
| `pages/admin/SinhVien.jsx` | `pages/SinhVien.jsx` |
| `pages/admin/GiangVien.jsx` | `pages/GiangVien.jsx` |
| `pages/admin/NhapLieu.jsx` | `pages/NhapLieu.jsx` |
| `pages/admin/PhanCong.jsx` | `pages/PhanCong.jsx` |
| `pages/admin/TongQuan.jsx` | `pages/TongQuan.jsx` |
| `pages/admin/CaiDat.jsx` | `pages/CaiDat.jsx` |
| `pages/admin/Diem.jsx` | `pages/Diem.jsx` |
| `pages/admin/HoiDong.jsx` | `pages/HoiDong.jsx` |

Các file cũ theo role được backup vào `pages/_backup_before_delete/`.

**Pages được viết đầy đủ (code mới):**

| File | Dòng | Nội dung |
|------|------|----------|
| `pages/SinhVien.jsx` | 526 | CRUD sinh viên, import Excel, filter, phân trang |
| `pages/NhapLieu.jsx` | 529 | Nhập liệu đề tài, upload Excel, xem danh sách |
| `pages/GiangVien.jsx` | 349 | CRUD giảng viên, filter, phân trang |
| `pages/PhanCong.jsx` | 210 | Phân công GVHD cho SV, giao diện 2 tab |
| `pages/DeTai.jsx` | 40 | Viết lại, trang đề tài đơn giản |

---

### `1decf07` — 16:47 — commit "."

**Files thay đổi:** 9 files (+39/-30)

**1. `frontend/src/App.jsx`** — cập nhật import theo cấu trúc mới:

```diff
- import TongQuan from './pages/admin/TongQuan';
- import AdminSinhVien from './pages/admin/SinhVien';
- import GiangVien from './pages/admin/GiangVien';
+ import TongQuan from './pages/TongQuan';
+ import AdminSinhVien from './pages/SinhVien';
+ import GiangVien from './pages/GiangVien';
```

Tất cả pages theo role (`gvhd/`, `gvpb/`, `sv/`) giờ đều import từ `pages/` chung.

**2. `frontend/src/pages/LoginPage.jsx`** — sửa logic redirect sau login:

```diff
- function getDefaultRoute(role) {
-   if (role === "admin") return "/admin/tong-quan";
-   if (role === "gvhd") return "/gvhd/sinh-vien";
+ function getDefaultRoute(user) {
+   if (user.type === "giangvien") {
+     if (user.role === "ChuTich" || user.role === "ThuKy" || ...) return "/admin/tong-quan";
+     if (user.role === "gvhd") return "/gvhd/sinh-vien";
+     return "/gvhd/sinh-vien"; // default giảng viên
+   }
+   if (user.type === "sinhvien") return "/sv/de-tai";
```

Trước đây dựa vào `role`, nay dựa vào `user.type` (`giangvien` / `sinhvien`) để quyết định redirect.

**3. Các pages khác** — minor import fixes: `CaiDat.jsx`, `ChamDiem.jsx`, `DeTai.jsx`, `Diem.jsx`, `HoiDong.jsx`, `TongQuan.jsx`

**4. `assets/student with laptop.json`** — thêm file animation Lottie

---

### `dc6b21c` — 22:47 — commit "." *(commit mới nhất)*

**Files thay đổi:** 5 files (+1,498 dòng)

**1. `frontend/src/pages/TongQuan.jsx`** — refactor hoàn toàn phần fetch data:

```diff
- const token = localStorage.getItem("token");
- fetch("/api/giai-doan", { headers: { Authorization: `Bearer ${token}` } })
-   .then(res => res.json())
-   .then(data => { setStats({ presentations: Number(data.giaiDoan) }) })

+ async function fetchStats() {
+   const giaiDoanRes = await getGiaiDoan();
+   const deTaiStats = await getDeTaiStats();
+   const studentStats = await getStudentStats();
+   setStats({ total, students, finished, presentations });
+ }
+ fetchStats();
```

Thay raw `fetch()` bằng 3 service functions. Dashboard giờ hiển thị đủ 4 số liệu: tổng đề tài, tổng SV, đề tài hoàn thành, giai đoạn hiện tại.

**2. `frontend/src/services/dashboardService.js`** — file mới (16 dòng):

```js
export async function getGiaiDoan()    // GET /api/giai-doan
export async function getDeTaiStats()  // GET /api/de-tai/stats
export async function getStudentStats() // GET /api/students/stats
```

**3. `huong_dan/ss/` — 3 file docs mới:**

| File | Dòng | Nội dung |
|------|------|----------|
| `repo_review.md` | 691 | Review chi tiết toàn bộ codebase (kiến trúc, từng controller, từng page, issues) |
| `teacher_requirement_check.md` | 454 | Đối chiếu yêu cầu thầy vs những gì đã làm |
| `audit_report_reference.md` | 301 | Báo cáo audit tham khảo |

---

## Timeline hôm nay

```
08:58  45be70e  Push toàn bộ project lần đầu
10:30  10b0e4d  fix docker (lần 1)
10:34  c6a18f8  fix docker (lần 2)
10:54  d877dd9  update main.jsx (lần 1)
10:58  eb07f7d  update main.jsx (lần 2)
11:02  8b0d4a8  update main.jsx (lần 3)
11:25  07ed6e2  comment out auto-redirect login
12:02  ed6a5a5  thêm |string vào validation login
16:26  4d6c604  gộp cấu trúc pages, thêm 4 pages đầy đủ
16:47  1decf07  update App.jsx + sửa logic redirect login
22:47  dc6b21c  refactor TongQuan + thêm dashboardService + 3 file docs
```

---

*Generated: 2026-04-12*
