# Phân tích: `origin/dev` vs `master` — Sự khác biệt thực sự & Conflict khi merge

> Phân tích ngày 2026-04-12
> So sánh trực tiếp bằng `git diff master origin/dev`

---

## Kết luận nhanh

Branch `dev` **KHÔNG phải** là một repo khác push vào — nó là **cùng một codebase** với bạn, nhưng bạn của bạn đã **sửa đổi nhiều thứ** trên đó. Cụ thể, `dev` có nhiều thay đổi thực chất so với `master`:

- **7 file Modified** (BE + FE) — sẽ **conflict** khi merge nếu bạn cũng đã sửa những file này
- **Nhiều file Added** — thêm mới, không conflict
- **Nhiều file Deleted** — xóa file, cần quyết định giữ hay bỏ

---

## Phần 1: Những gì KHÁC NHAU (file Modified — tiềm năng conflict)

### 1.1 `backend/app/Http/Controllers/AuthController.php`

| | `master` (bạn) | `origin/dev` (bạn của bạn) |
|---|---|---|
| Login field | `email` | `maGV` |
| Tìm user | `GiangVien::where('email')` + fallback `SinhVien::where('email')` | Chỉ `GiangVien::where('maGV')` (không hỗ trợ SinhVien login) |
| Kiểm tra password | `Hash::check($request->password, $user->matKhau)` | So sánh plain text `$request->password === $user->matKhau` |
| Response user | Trả về `type`, `roles` (array nhiều role) | Trả về `type`, `role` (1 role duy nhất từ bảng `thanhvien_hoidong`) |
| isAdmin logic | Có — `$user->isAdmin` | Bỏ — không dùng `isAdmin` nữa |

**Đây là conflict nghiêm trọng nhất.** Hai bên có logic auth hoàn toàn khác nhau. Cần ngồi lại quyết định dùng cái nào.

---

### 1.2 `backend/database/migrations/2026_04_05_000001_create_giangvien_table.php`

| | `master` | `origin/dev` |
|---|---|---|
| Cột `isAdmin` | Có (`boolean`, default false) | **Bỏ** |

**Conflict schema DB.** Nếu merge, migration sẽ mâu thuẫn. Cần chọn một phiên bản dứt khoát.

---

### 1.3 `backend/database/migrations/2026_04_05_000002_create_sinhvien_table.php`

| | `master` | `origin/dev` |
|---|---|---|
| `lop` | `varchar(20)` | `varchar(50)` |
| `email` | `unique()->nullable()` | `nullable()` (bỏ unique) |
| `ky_lvtn_id` | Có | **Bỏ** |

---

### 1.4 `backend/database/seeders/DatabaseSeeder.php`

`origin/dev` bỏ:
- Tạo `KyLvtn` trong seeder
- `isAdmin` khi tạo GiangVien
- `matKhau` và `ky_lvtn_id` khi tạo SinhVien

---

### 1.5 `backend/app/Models/GiangVien.php`

`origin/dev` bỏ:
- `isAdmin` khỏi `$fillable`
- `$casts = ['isAdmin' => 'boolean']`

---

### 1.6 `backend/app/Models/SinhVien.php`

`origin/dev` thay đổi `$fillable`:
- Bỏ `ky_lvtn_id`
- Thêm `created_at`, `updated_at` vào fillable (không cần thiết)

---

### 1.7 `backend/config/cors.php`

| | `master` | `origin/dev` |
|---|---|---|
| `paths` | `['api/*', 'sanctum/csrf-cookie']` | `['*']` (tất cả paths) |
| `allowed_origins` | Chỉ `FRONTEND_URL` env | `['*']` (tất cả origins) |
| `supports_credentials` | `true` | `false` |

**Lưu ý bảo mật:** `origin/dev` mở CORS hoàn toàn (`*`) — phù hợp dev nhưng **không nên dùng production**.

---

### 1.8 `backend/routes/api.php`

`origin/dev` thêm:
- Route `GET /giai-doan` → `CauHinhController@giaiDoan`
- CRUD routes cho đề tài: `GET/POST/PUT/DELETE /de-tai`
- **Đổi tên route**: `/nhap-lieu/import-excel` → `/nhap-lieu-import-excel` (bỏ dấu `/` trong URL)

---

### 1.9 `frontend/src/App.jsx`

| | `master` | `origin/dev` |
|---|---|---|
| `BrowserRouter` | Có (wrap trong App) | **Bỏ** (chuyển sang `main.jsx`) |
| Import pages | Từ `pages/admin/`, `pages/gvhd/`, v.v. | Tất cả từ `pages/` (flat) |
| Route mới | Không | Thêm `/de-tai` |

---

### 1.10 `frontend/src/services/api.js`

| | `master` | `origin/dev` |
|---|---|---|
| `baseURL` | `/api` (relative) | `import.meta.env.VITE_API_BASE_URL + '/api'` (cần env var) |
| Auto-redirect 401 | `window.location.href = '/login'` | **Comment out** (tắt) |

**Quan trọng:** `origin/dev` yêu cầu biến môi trường `VITE_API_BASE_URL` trong `.env`. Nếu merge mà không có file `.env` FE thì API sẽ gọi sai URL.

---

### 1.11 `frontend/src/services/authService.js`

| | `master` | `origin/dev` |
|---|---|---|
| Tham số login | `login(email, password)` | `login(maGV, password)` |
| Request body | `{ email, password }` | `{ maGV, password }` |

---

### 1.12 `frontend/src/services/nhapLieuService.js`

| | `master` | `origin/dev` |
|---|---|---|
| Import Excel URL | `/nhap-lieu/import-excel` | `/nhap-lieu-import-excel` |

Phải khớp với route BE (`api.php`) — cả 2 bên đều thay đổi giống nhau nên consistent với nhau trong `dev`.

---

### 1.13 `frontend/src/pages/LoginPage.jsx`

| | `master` | `origin/dev` |
|---|---|---|
| Logic redirect | Dựa vào `user.role` (string) | Dựa vào `user.type` + `user.role` |
| SinhVien login | Có (redirect `/sv/de-tai`) | Vẫn có |
| GiangVien hội đồng | Không xử lý rõ | Xử lý `ChuTich/ThuKy/UyVien` → `/admin/tong-quan` |

---

## Phần 2: File THÊM MỚI trong `origin/dev` (không conflict, nhưng cần review)

### Backend — File mới:
- `backend/app/Exceptions/Handler.php` — custom exception handler
- `backend/app/Http/Controllers/CauHinhController.php` — quản lý cấu hình kỳ LVTN
- `backend/app/Http/Controllers/DeTaiController.php` — CRUD đề tài

### Frontend — File mới:
- `frontend/src/pages/TongQuan.jsx` — dashboard với stats thực từ API
- `frontend/src/pages/SinhVien.jsx` (526 dòng) — CRUD sinh viên đầy đủ
- `frontend/src/pages/GiangVien.jsx` (349 dòng) — CRUD giảng viên
- `frontend/src/pages/NhapLieu.jsx` (529 dòng) — nhập liệu + import Excel
- `frontend/src/pages/PhanCong.jsx` (210 dòng) — phân công GVHD
- `frontend/src/pages/DeTai.jsx` — trang đề tài
- `frontend/src/pages/CaiDat.jsx`, `ChamDiem.jsx`, `Diem.jsx`, `HoiDong.jsx` — các trang còn lại
- `frontend/src/services/dashboardService.js` — service cho trang tổng quan
- `frontend/src/services/deTaiService.js` — service CRUD đề tài
- `frontend/src/assets/student with laptop.json` — animation Lottie

### Tài liệu — File mới trong `huong_dan/`:
- `huong_dan/ss/repo_review.md` — review chi tiết codebase (691 dòng)
- `huong_dan/ss/teacher_requirement_check.md` — đối chiếu yêu cầu thầy (454 dòng)
- `huong_dan/ss/audit_report_reference.md` — audit report tham khảo (301 dòng)
- `huong_dan/phieu_giao_de_tai.docx` — phiếu giao đề tài mới
- 4 template Word chấm điểm mới (thay thế Mau 01.01 - 02.02)

---

## Phần 3: File BỊ XÓA trong `origin/dev`

| File bị xóa | Ghi chú |
|-------------|---------|
| `.env.example` (root) | Dev bỏ, chỉ giữ `frontend/.env.example` |
| `.DS_Store` | macOS artifact, không cần |
| `frontend/public/assets/.DS_Store` | macOS artifact |
| `frontend/src/pages/admin/PhanCong.jsx` | Thay bởi `pages/PhanCong.jsx` mới |
| `frontend/src/pages/admin/PhanCongGVHD.jsx` | **Xóa hẳn** — trang phân công GVHD riêng biến mất |
| `frontend/src/pages/admin/PhanCongGVPB.jsx` | **Xóa hẳn** — trang phân công GVPB riêng biến mất |
| `frontend/src/pages/admin/TongQuan.jsx` | Thay bởi `pages/TongQuan.jsx` mới |
| `huong_dan/Form_NhiemvuLVTN.docx` | Thay bởi template mới |
| `huong_dan/Mau 01.01...` + `Mau 01.02...` | Thay bởi template mới |
| `huong_dan/Mau 02.01...` + `Mau 02.02...` | Thay bởi template mới |
| `temp_db/quanly_lvtn .sql` | Thay bởi `quanly_lvtn_v2.sql` |
| `backend/vendor/` (toàn bộ) | Dev gitignore vendor, master đang track vendor |
| `backend/storage/` các `.gitignore` | Dev gitignore storage |

---

## Phần 4: Nếu merge — Conflict nào sẽ xảy ra?

Git sẽ **auto-conflict** (yêu cầu resolve tay) các file sau:

| File | Lý do conflict |
|------|---------------|
| `backend/app/Http/Controllers/AuthController.php` | Cả 2 branch sửa khác nhau — **conflict trực tiếp** |
| `backend/database/migrations/..._create_giangvien_table.php` | Bỏ cột `isAdmin` — **conflict** |
| `backend/database/migrations/..._create_sinhvien_table.php` | Sửa `lop`, `email`, bỏ `ky_lvtn_id` — **conflict** |
| `backend/database/seeders/DatabaseSeeder.php` | Bỏ nhiều trường — **conflict** |
| `backend/app/Models/GiangVien.php` | Bỏ `isAdmin` — **conflict** |
| `backend/app/Models/SinhVien.php` | Sửa `$fillable` — **conflict** |
| `backend/config/cors.php` | CORS config khác hoàn toàn |
| `backend/routes/api.php` | Thêm routes mới + đổi tên route |
| `frontend/src/App.jsx` | Cấu trúc import + `BrowserRouter` |
| `frontend/src/pages/LoginPage.jsx` | Logic redirect khác |
| `frontend/src/services/api.js` | `baseURL` + tắt auto-redirect 401 |
| `frontend/src/services/authService.js` | Tham số login: `email` → `maGV` |
| `frontend/src/services/nhapLieuService.js` | URL import Excel |

---

## Phần 5: Quyết định trước khi merge

Cần thống nhất với nhau:

1. **Auth bằng gì?** `email` hay `maGV`? (Hai bên đang dùng khác nhau)
2. **`isAdmin` field có cần không?** Hay dùng `thanhvien_hoidong` để xác định quyền admin?
3. **`ky_lvtn_id` trong SinhVien có giữ không?** `master` có, `dev` bỏ
4. **CORS:** Để `*` cho dev hay restore về specific origin?
5. **`VITE_API_BASE_URL`:** Cần thêm vào `.env` FE sau khi merge
6. **Auto-redirect 401:** Có bật lại không? (Dev đang comment out)
7. **Cấu trúc pages:** Giữ flat (`pages/`) hay theo role (`pages/admin/`, `pages/gvhd/`)?

---

*Phân tích dựa trên `git diff master origin/dev` — 2026-04-12*
