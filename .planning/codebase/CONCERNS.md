# Concerns — TT-CD2 Codebase Analysis

**Ngày phân tích:** 2026-04-03  
**Phạm vi:** Backend (Laravel 12), Frontend (React + Vite), Database (MySQL)

---

## Security (Nghiêm trọng)

### 1. Mật khẩu lưu plaintext, so sánh trực tiếp
- **Vị trí:** `backend/routes/api.php` (dòng 52)
- **Vấn đề:** `$isValidPassword = $password === $storedPassword;`
  - Mật khẩu giảng viên lưu trong DB dưới dạng plaintext
  - Không dùng hashing (không dùng `Hash::check()`)
  - Nếu DB bị lộ → tất cả password bị lộ
  - Commented code ở dòng 50-51 cho thấy người viết biết cách đúng nhưng chưa triển khai
- **Ảnh hưởng:** Cao — Dữ liệu người dùng không an toàn
- **Khắc phục:** 
  - Hash mật khẩu trước khi lưu (dùng `Hash::make()`)
  - Dùng `Hash::check()` để so sánh thay vì `===`

### 2. Admin password lưu hardcoded trong cache
- **Vị trí:** `backend/routes/api.php` (dòng 121)
- **Vấn đề:** 
  ```php
  $oldPassword = (string) $tokenStore->get('legacy_admin_password', '123');
  ```
  - Admin password default là `'123'` (hardcoded)
  - Lưu trong file cache (có thể lấy trực tiếp từ file)
  - Server restart → mất token nhưng admin password vẫn là '123'
- **Ảnh hưởng:** Cao — Ai biết default password là '123' có thể đăng nhập admin
- **Khắc phục:**
  - Tạo bảng `admin` riêng hoặc dùng `users` table
  - Lưu password hashed trong DB
  - Không hardcode default password

### 3. Token lưu trong file cache — không persistent
- **Vị trí:** `backend/routes/api.php` (dòng 61-64), `Middleware/ApiTokenAuth.php` (dòng 25-26)
- **Vấn đề:**
  - Token lưu trong `Cache::store('file')` (file cache system)
  - Server restart hoặc file cache clear → mất hết token
  - Tất cả user bị logout sau khi deploy
  - Không có revocation mechanism (token không thể invalidate trước khi hết hạn)
- **Ảnh hưởng:** Trung bình — UX xấu khi deploy, nhưng security-wise có lợi (token hết hạn 7 ngày)
- **Khắc phục:**
  - Dùng database hoặc Redis để lưu token thay vì file cache
  - Hoặc dùng JWT (no server-side storage)

### 4. Không có role-based access control (RBAC)
- **Vị trí:** `backend/routes/api.php` — toàn bộ routes không check quyền
- **Vấn đề:**
  - Role lấy từ vai trò hội đồng (`CouncilMember.vaiTro`), không phải vai trò hệ thống
  - Mỗi route chỉ check auth (có token), không check role
  - Admin, GVHD, GVPB, Sinh viên có cùng quyền truy cập (chỉ khác maGV)
  - Sinh viên đăng nhập được nếu có token (vì chỉ check token, không check role)
- **Ảnh hưởng:** Cao — Khả năng privilege escalation hoặc xem dữ liệu người khác
- **Khắc phục:**
  - Tạo bảng role/permission riêng
  - Thêm middleware check quyền theo role trên từng route
  - Phân chia routes thành groups: admin, gvhd, gvpb, sv

### 5. Sinh viên không thể đăng nhập
- **Vị trí:** `backend/routes/api.php` (dòng 41)
- **Vấn đề:**
  - Đăng nhập chỉ tìm trong bảng `giangvien` (teacher)
  - Sinh viên nằm trong bảng `sinhvien` → không có cách đăng nhập
  - Không có bảng `users` chung để auth (bảng users tồn tại nhưng chỉ mẫu)
- **Ảnh hưởng:** Cao — Feature sinh viên không hoạt động
- **Khắc phục:**
  - Tạo bảng user chung hoặc extend auth để support cả SV + GV
  - Dùng column `role` để phân biệt

### 6. Plaintext password trong migration seed
- **Vị trí:** `backend/app/Console/Commands/MigrateLegacyData.php` (dòng 74)
- **Vấn đề:** 
  ```php
  'password' => '123', // Plaintext password
  ```
  - Comment này cho thấy biết là plaintext nhưng không sửa
  - Tất cả seed data dùng password '123'
- **Ảnh hưởng:** Trung bình — Dành cho test, nhưng nếu deploy production → vấn đề

---

## Tech Debt (Nợ kỹ thuật)

### 1. Routes 820 dòng closure — không dùng Controllers
- **Vị trị:** `backend/routes/api.php`
- **Vấn đề:**
  - Toàn bộ logic viết trong closure (lambda functions) thay vì controller
  - Đã tạo controllers (`LecturerController`, `TopicController`, `DashboardController`, etc.) nhưng phần lớn không dùng
  - StudentController và ThesisFormController được gọi đúng, nhưng các controller khác bị bỏ
  - Khó maintain, khó test, khó tái sử dụng logic
- **Ảnh hưởng:** Trung bình — Code maintainability
- **Khắc phục:**
  - Move logic từ closure vào controller methods
  - Dùng dependency injection trong controller
  - Tách business logic vào Service class nếu cần

### 2. Bug: Route lồng trong route
- **Vị trí:** `backend/routes/api.php` (dòng 429-436)
- **Vấn đề:**
  ```php
  Route::delete('/topics', function () {
      // Khai báo routes mới bên trong closure
      Route::get('/lecturers', [LecturerController::class, 'index']);
      // ...
      // Các routes này KHÔNG BAO GIỜ ĐƯỢC ĐĂNG KÝ
  });
  ```
  - `DELETE /topics` không xóa gì, bên trong chỉ khai báo routes (dead code)
  - Các routes trong này không bao giờ được đăng ký (chỉ khai báo khi DELETE /topics được gọi)
  - Nhưng route DELETE /topics không có handler → thành route rỗng
- **Ảnh hưởng:** Cao — Bug logic
- **Khắc phục:**
  - Xóa closure này
  - Dếp lecturers routes ra ngoài (đã khai báo ở chỗ khác)

### 3. Bảng `detai` gộp 20+ cột — denormalization
- **Vị trí:** `temp_db/quanly_lvtn .sql`
- **Vấn đề:**
  - 1 bảng chứa: đề tài (tenDeTai, maGV_HD) + điểm GK (diemGiuaKy, trangThaiGiuaKy) + điểm HD (diemHuongDan) + điểm PB (diemPhanBien) + điểm HĐ (diemHoiDong) + tất cả nhận xét
  - Khi query 1 đề tài → lấy cả 20 cột dù chỉ cần 5 cột
  - Khó thêm loại điểm mới (phải alter table)
  - Khó quản lý history điểm (không có bảng score riêng)
- **Ảnh hưởng:** Trung bình — Design kém, nhưng chạy được
- **Khắc phục:**
  - Tách bảng: topic (căn bản), score (điểm theo loại), comment (nhận xét)
  - Hoặc tối thiểu: tách score riêng

### 4. Bảng `diem` tồn tại nhưng không dùng
- **Vị trí:** DB schema + `app/Models/Score.php`
- **Vấn đề:**
  - Bảng `diem` được khai báo: `maDiem, maDeTai, maGV, loaiDiem, diemSo, nhanXet`
  - Mục đích: Lưu điểm riêng cho mỗi loại (HuongDan, PhanBien, HoiDong)
  - Nhưng KHÔNG có data, KHÔNG có code ghi vào
  - Tất cả logic chấm điểm ghi thẳng vào `detai` table
  - Model Score tồn tại nhưng không ai gọi
- **Ảnh hưởng:** Thấp — Lộn xộn, nhưng không ảnh hưởng chức năng
- **Khắc phục:**
  - Hoặc dùng bảng `diem` đúng cách (refactor logic)
  - Hoặc xóa bảng này + model này

### 5. Duplicate route `GET /topics/{topic}`
- **Vị trí:** `backend/routes/api.php` (dòng 391 và dòng 611)
- **Vấn đề:**
  - Route được khai báo 2 lần
  - Route thứ 2 sẽ ghi đè route thứ 1
  - Có thể có logic khác nhau ở 2 chỗ → logic bị mất
- **Ảnh hưởng:** Trung bình — Có thể gây bug
- **Khắc phục:**
  - Kiểm tra 2 route có khác nhau không
  - Xóa 1 route duplicate

### 6. Không có Laravel Migrations — chỉ SQL dump
- **Vị trí:** `temp_db/quanly_lvtn .sql` (có dấu cách trong tên file)
- **Vấn đề:**
  - Không dùng Laravel migration (file `database/migrations/*.php`)
  - Chỉ có raw SQL dump
  - Khó track lịch sử thay đổi schema
  - Khó deploy lên environment mới
  - Không có rollback mechanism
  - Ai muốn setup project phải import SQL dump thủ công
- **Ảnh hưởng:** Cao — DevOps khó khăn
- **Khắc phục:**
  - Viết migrations cho tất cả tables
  - Commit migrations vào git
  - Deploy dùng `php artisan migrate`

### 7. Frontend không persist auth state
- **Vị trí:** `frontend/src/context/AuthContext.jsx`
- **Vấn đề:**
  - Token lưu localStorage nhưng user state lưu trong Context (memory)
  - Khi refresh page → Context reset → state = null
  - Dù có token trong localStorage, user data mất → phải fetch lại
  - Một lúc có thể không có user state nhưng có token (inconsistent)
- **Ảnh hưởng:** Trung bình — UX xấu (flash loading)
- **Khắc phục:**
  - Persist user data vào localStorage
  - Hoặc lazy load user data từ `/me` endpoint khi mount

---

## Incomplete Features (Chức năng chưa xong)

### 1. Import Excel sinh viên — 501 Not Implemented
- **Vị trí:** `backend/routes/api.php` (dòng có route import-excel)
- **Vấn đề:**
  - Route tồn tại nhưng trả `501 Not Implemented`
  - Packages `maatwebsite/excel` đã cài nhưng không viết code
  - Thư ký cần import DSSV từ file Excel (yêu cầu thầy)
- **Ảnh hưởng:** Cao — Feature lõi bị thiếu
- **Ghi chú:** Đây là task priority cao theo CLAUDE.md

### 2. Export Word — 5 mẫu chưa triển khai
- **Vị trị:** `backend/routes/api.php` (dòng có routes `/exports/word/*`)
- **Vấn đề:**
  - 5 mẫu Word để xuất:
    - `Mau 01.01_PHIEU CHAM_HUONG DAN_NHOM SINH VIEN.doc`
    - `Mau 01.02_PHIEU CHAM_HUONG DAN_SINH VIEN.doc`
    - `Mau 02.01_PHIEU CHAM_PHAN BIEN_NHOM SINH VIEN.doc`
    - `Mau 02.02_PHIEU CHAM_PHAN BIEN_SINH VIEN.doc`
    - `Form_NhiemvuLVTN.doc`
  - Package `phpoffice/phpword` đã cài nhưng không viết code
  - Routes trả 501
- **Ảnh hưởng:** Cao — GV không thể xuất phiếu chấm
- **Ghi chú:** Nhóm phát triển đã tạo file mẫu ở `huong_dan/`

### 3. Export Excel — danh sách bảo vệ
- **Vị trị:** `backend/routes/api.php` (dòng có `/exports/excel`)
- **Vấn đề:**
  - Xuất danh sách bảo vệ LVTN
  - Route tồn tại nhưng 501
- **Ảnh hưởng:** Trung bình — Thư ký cần feature này

### 4. Trang sinh viên — hoàn toàn chưa làm
- **Vị trị:** `frontend/` không có trang cho sinh viên
- **Vấn đề:**
  - Sinh viên không thể đăng nhập (no SV auth)
  - Không có trang để SV xem đề tài của mình
  - Không có trang để in tờ nhiệm vụ (`Form_NhiemvuLVTN`)
- **Ảnh hưởng:** Cao — 1/4 user role không có feature
- **Ghi chú:** Yêu cầu thầy: SV phải xem được thông tin, in được form

### 5. Review.jsx có TODO comment
- **Vị trị:** `frontend/src/pages/thesis/Review.jsx` (dòng 175)
- **Vấn đề:**
  ```javascript
  const handleExport = () => {
    // TODO: Gọi API xuất file hoặc tạo file từ dữ liệu form
    showToast("Chức năng xuất file đang phát triển", "info");
  };
  ```
  - Export button không hoạt động
  - Chỉ hiển thị toast "đang phát triển"
- **Ảnh hưởng:** Trung bình — Có button nhưng không dùng được

---

## Missing Components (Thiếu so với CLAUDE.md)

### 1. Bảng `admin` / `users` — không có auth admin riêng
- **Yêu cầu:** CLAUDE.md nói có 4 vai trò: Admin (Thư ký), GVHD, GVPB, SV
- **Hiện tại:** Chỉ có GVHD (bảng giangvien) và SV (bảng sinhvien)
  - Admin password hardcoded '123' trong cache
  - Không có model/table riêng cho admin
- **Khắc phục:** Tạo bảng users hoặc extend auth để có admin riêng

### 2. Bảng `dot_lvtn` (đợt/kỳ luận văn)
- **Yêu cầu:** Quản lý timeline LVTN, mốc thời gian
- **Hiện tại:** Chỉ có giai đoạn (1-5) trong `cauhinh` table
  - Không có bảng riêng để lưu mốc thời gian cụ thể
  - Không có ngày bắt đầu, kết thúc cho mỗi giai đoạn
- **Khắc phục:** Tạo bảng `dot_lvtn` với các cột: dotLVTN, thoiGianBatDau, thoiGianKetThuc, etc.

### 3. Bảng `hoidong` thiếu trường `ngayBaoVe`
- **Yêu cầu:** Hội đồng cần có ngày bảo vệ
- **Hiện tại:** Bảng chỉ có: maHoiDong, tenHoiDong, diaDiem
  - Thiếu: `ngayBaoVe`, `gioiBatDau`, `giokKetThuc`
- **Khắc phục:** ALTER TABLE thêm cột hoặc viết migration

### 4. Role system chưa đúng
- **Yêu cầu:** 4 roles: Admin, GVHD, GVPB, SV
- **Hiện tại:** 
  - Role lấy từ `CouncilMember.vaiTro` (ChuTich, ThuKy, UyVien) — vai trò hội đồng, không phải role hệ thống
  - Không có role: Admin, GVHD, GVPB, SV
  - FE chỉ có 3 roles: THUKY, CHUTICH, UYVIEN
- **Khắc phục:** 
  - Tạo bảng role + permission
  - Thêm column role vào user table
  - Update middleware + FE

---

## Fragile Areas (Vùng dễ bị vỡ)

### 1. Login logic — plaintext so sánh
- **Vị trí:** `backend/routes/api.php` (dòng 52)
- **Vấn đề:** Code dễ bị break nếu ai đó chuyển sang Hash
  - Commented code ở dòng 50-51 cho thấy ai đó từng cố gắng sửa
  - Nếu migrate tất cả password sang Hash, login sẽ break
- **Khắc phục:** Ngay bây giờ chuyển sang Hash, không chờ

### 2. Auth middleware — role check lỏng
- **Vị trí:** `backend/app/Http/Middleware/ApiTokenAuth.php` (dòng 34-40)
- **Vấn đề:**
  - Lấy role từ `CouncilMember` → nếu GV không phải thành viên hội đồng, role = 'lecturer'
  - Nếu admin không phải thành viên hội đồng, không thể vào
  - Tỷ lệ lỗi cao khi setup hội đồng không đầy đủ
- **Khắc phục:** Dùng role table riêng, không liên quan CouncilMember

### 3. Frontend routes — không có 404 boundary
- **Vị trí:** `frontend/src/App.jsx`
- **Vấn đề:**
  - Có NotFoundPage nhưng không có error boundary
  - Nếu API fail hoặc error trong component, app crash (white screen)
  - Không có fallback UI
- **Khắc phục:** Thêm Error Boundary component

### 4. Database file dump — không track được
- **Vị trí:** `temp_db/quanly_lvtn .sql` (file name có dấu cách)
- **Vấn đề:**
  - File lớn, khó diff khi commit
  - Không thể rollback schema
  - Tên file có dấu cách → khó script automation
- **Khắc phục:** Dùng migrations thay vì SQL dump

### 5. Review.jsx quá lớn (25KB)
- **Vị trí:** `frontend/src/pages/thesis/Review.jsx`
- **Vấn đề:**
  - 1 file xử lý: tab review + tab guide + form state + save logic
  - Khó maintain, khó test
  - Dễ bug khi edit
- **Khắc phục:** Tách thành component con hoặc tách Review + GuidanceReview

---

## Recommendations — Ưu tiên sửa

| # | Vấn đề | Mức độ | Khối lượng | Ưu tiên | Action |
|----|--------|--------|-----------|---------|--------|
| 1 | Plaintext password | Nghiêm trọng | Nhỏ (1-2h) | CAO | Hash ngay |
| 2 | Hardcoded admin pwd | Nghiêm trọng | Nhỏ (2h) | CAO | Tạo bảng admin hoặc users |
| 3 | Không có SV login | Nghiêm trọng | Lớn (1-2 ngày) | CAO | Extend auth cho SV |
| 4 | Route bug (nested) | Nghiêm trọng | Nhỏ (30 phút) | CAO | Xóa closure lỗi |
| 5 | Import Excel | Cao | Trung (4-6h) | CAO | Viết logic import |
| 6 | Export Word | Cao | Trung (8-10h) | CAO | Viết logic xuất phiếu chấm |
| 7 | RBAC (role-based access) | Cao | Lớn (2-3 ngày) | TRUNG | Thêm middleware role check |
| 8 | Không dùng controllers | Trung bình | Lớn (2-3 ngày) | TRUNG | Refactor routes → controllers |
| 9 | Bảng `detai` denormalized | Trung bình | Lớn (1-2 ngày) | TRUNG | Refactor schema (optional) |
| 10 | AuthContext persist | Trung bình | Nhỏ (1-2h) | THẤP | Persist user → localStorage |

---

## Summary

### Vấn đề Security
- ⚠️ **3 vấn đề nghiêm trọng:** plaintext password, hardcoded admin pwd, no RBAC
- ✅ `.env` được ignore tốt
- ✅ Không có credentials commit

### Vấn đề Code Quality
- 😒 Routes 820 dòng closure (không dùng controllers)
- 😒 Bug: route lồng route (dead code)
- 😒 Duplicate route
- 😒 Bảng diem tồn tại nhưng không dùng

### Vấn đề Features
- ❌ Sinh viên không đăng nhập được
- ❌ Import/Export chưa làm
- ❌ Review.jsx có TODO

### Vấn đề Database
- ⚠️ Không dùng migrations (SQL dump thay vì code)
- ⚠️ Denormalization (detai table quá nhiều cột)
- ⚠️ Thiếu cột (hoidong.ngayBaoVe)

**Tiến độ:** ~35-40% hoàn thành. Các issue lớn cần fixed trước khi production.
