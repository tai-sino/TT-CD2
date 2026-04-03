# Research Summary: TT-CD2 Thesis Management

> Tổng hợp từ 4 file research: STACK.md, FEATURES.md, ARCHITECTURE.md, PITFALLS.md
> Ngày: 2026-04-03

---

## Key Findings

### Stack (Quyết định quan trọng nhất)

1. **Laravel 12 API + React 19 SPA — tách biệt hoàn toàn.** Thầy đã confirm, không thương lượng. React build ra static files, copy vào `public/` của Laravel để deploy cùng domain. Dev thì chạy 2 server riêng (Vite :5173 + artisan :8000).

2. **Auth dùng custom token + database table, KHÔNG dùng Sanctum cookie.** Lý do: Sanctum SPA cookie auth có quá nhiều chỗ dễ sai (SANCTUM_STATEFUL_DOMAINS, SESSION_DOMAIN, CORS credentials, csrf-cookie call). Với deadline ngắn, an toàn hơn là dùng token lưu DB (bảng `api_tokens`) + localStorage phía React. Nếu kịp thì migrate sang Sanctum sau.

3. **spatie/laravel-permission phải pin v6, KHÔNG dùng v7.** v7 yêu cầu PHP ^8.4, hosting thầy chỉ đảm bảo PHP 8.2+. Cài bằng `composer require spatie/laravel-permission:^6.0`.

4. **File mẫu Word: dùng bản .docx đã convert sẵn trong `docs/huong_dan/`.** File gốc trong `docs/thesis/` là `.doc` — PHPWord TemplateProcessor không đọc được. Bản convert đã có sẵn, dùng luôn.

5. **phpspreadsheet trực tiếp thay vì maatwebsite/excel.** ARCHITECTURE.md xác nhận phpspreadsheet đã có trong composer.json. Dùng trực tiếp thì kiểm soát tốt hơn khi xử lý file Excel lộn xộn từ Phòng Đào tạo.

---

### Features (Scope)

**17 tính năng table stakes** — tất cả đều cần để hệ thống dùng được. Critical path theo thứ tự:

```
Auth → Kỳ LVTN → Import SV + Quản lý GV → Phân công GVHD
→ Giao đề tài → Chấm HD/PB → Hội đồng → Xuất danh sách
```

**Ưu tiên làm ngay** (không có là không demo được):
- Auth 4 role
- Import Excel danh sách SV
- Phân công GVHD (max 10 SV/GV)
- Giao đề tài (1 hoặc 2 SV)
- Export Word từ template (Mẫu 01, 02, Form nhiệm vụ)

**Nice to have** (làm nếu còn thời gian):
- Dashboard thống kê — giúp demo đẹp
- Auto-assign GVHD — tiện nhưng không cần thiết
- Preview Excel trước khi import — tránh data bẩn

**Không làm trong v1** (đã xác nhận với thầy):
- Chấm điểm hội đồng realtime trong buổi bảo vệ
- In công bố kết quả 50% — thầy ghi "Không cần"
- SV tự đăng ký đề tài online
- Notification email
- OAuth/SSO

---

### Architecture (Thiết kế DB và code)

**Multi-role lecturer — giải pháp quan trọng nhất:**

GV không có `role` cố định. Vai trò xác định theo context:
- GVHD: GV nào có `detai.maGV_HD = maGV`
- GVPB: GV nào có `detai.maGV_PB = maGV`
- Thành viên HĐ: GV nào có record trong `thanhvienhoidong`
- Admin (thư ký khoa): flag `giangvien.isAdmin = 1`

API trả về object `roles` khi login để React biết hiển thị menu gì.

**Schema chính (giữ tên tiếng Việt như hiện tại):**
```
giangvien (maGV, tenGV, email, soDienThoai, hocVi, matKhau, isAdmin)
sinhvien  (mssv, hoTen, lop, email, maDeTai FK, matKhau)
detai     (maDeTai, tenDeTai, maGV_HD FK, maGV_PB FK, maHoiDong FK,
           diemGiuaKy, diemHuongDan, diemPhanBien, diemHoiDong, diemTongKet...)
hoidong   (maHoiDong, tenHoiDong, diaDiem, ngayBaoVe)
thanhvienhoidong (maHoiDong FK, maGV FK, vaiTro: ChuTich/ThuKy/UyVien)
diem      (maDeTai FK, maGV FK, loaiDiem, diemSo, nhanXet)
cauhinh   (trangThaiChamGK, giaiDoan)
```

**Controllers (~9 cái) — không tách service:**
```
AuthController, DashboardController, StudentController, LecturerController,
TopicController, CouncilController, ScoreController, SettingController, ExportController
```

**React state:** Context API (AuthContext) + useState/useEffect per page. Không cần Redux hay Zustand.

**File storage:** Local disk `storage/app/`. Template .docx để trong `storage/app/templates/`. Export stream về client, không lưu lại.

**Deploy:** React build copy vào `backend/public/`. `.htaccess` xử lý: file thật → API routes → React SPA. Cùng origin = không cần CORS.

---

### Pitfalls (Top 5 cần tránh)

1. **PHPWord placeholder bị tách XML runs** — khi soạn template .docx trong Word, gõ `${ten_sv}` một lần, KHÔNG chỉnh format từng ký tự. Nên dùng ký tự đơn giản (`#ten_sv#`) thay vì `${ten_sv}` để giảm nguy cơ bị tách.

2. **Import Excel — file từ trường lộn xộn** — KHÔNG dùng `WithHeadingRow` của maatwebsite/excel. Đọc thủ công bằng phpspreadsheet, tự xác định dòng bắt đầu data, skip merged header rows, ép kiểu MSSV sang string.

3. **Sanctum cookie không work** — nếu dùng Sanctum: `SANCTUM_STATEFUL_DOMAINS` phải có port (vd: `localhost:5173`), axios phải `withCredentials: true`, phải gọi `/sanctum/csrf-cookie` trước login. **Khuyến nghị: tránh rủi ro này bằng cách dùng token DB thay vì Sanctum cookie.**

4. **spatie/laravel-permission v7 break PHP version** — luôn pin `^6.0`, không để composer tự upgrade lên v7.

5. **React SPA routing 404 khi refresh** — phải có catch-all route trong Laravel trả về `index.html` cho mọi URL không phải `/api/*`. Nếu không, F5 trang `/students` sẽ 404.

---

## Critical Risks

### Risk 1: Export Word template không fill được đúng data
**Khả năng xảy ra:** Cao  
**Tác động:** Mất 4-5 ngày, feature quan trọng không hoàn thành  
**Giảm thiểu:**
- Test PHPWord TemplateProcessor với file .docx converted ngay từ đầu sprint, trước khi code các module khác
- Nếu placeholder bị tách XML: viết script clean XML hoặc đổi ký tự placeholder đơn giản hơn
- Fallback: nếu PHPWord không xử lý được bảng phức tạp, tạo file Word mới programmatically thay vì dùng template

### Risk 2: File Excel từ Phòng Đào tạo khác format dự kiến
**Khả năng xảy ra:** Trung bình (file thật chưa xem)  
**Tác động:** Import bị lỗi, data bẩn vào DB  
**Giảm thiểu:**
- Xem file Excel thật (`Chốt_DSSV_GVHD_TenDeTai_LVTN_Dot2_17112025.xlsx`) trước khi code import
- Không dùng `WithHeadingRow` — parse thủ công, linh hoạt hơn
- Thêm validation và preview step trước khi import thật

### Risk 3: Deploy lên shared hosting gặp vấn đề PHP version hoặc extension thiếu
**Khả năng xảy ra:** Trung bình  
**Tác động:** System không chạy được trên môi trường thầy cho  
**Giảm thiểu:**
- Kiểm tra hosting ngay khi có: PHP version, extension `zip`, `mbstring`, `xml`, `memory_limit`
- Deploy thử sớm (sau khi xong Auth module) để phát hiện sớm
- Backup plan: nếu thiếu extension → liên hệ thầy nâng cấp hosting hoặc dùng VPS

---

## Constraints Ảnh Hưởng Đến Requirements

1. **Deadline dưới 2 tháng** → Không có thời gian refactor lớn. Code ngay từ đầu đúng architecture, không "sẽ clean sau". Ưu tiên critical path, nice-to-have chỉ làm khi core xong.

2. **Shared hosting, không có SSH chắc chắn** → Không dùng Laravel Queue, không dùng scheduler/cron. Mọi xử lý phải sync. Export Word/Excel phải đủ nhanh để không bị timeout (< 30s).

3. **GV có thể đảm nhiều role cùng lúc** → Không thể dùng RBAC đơn giản. Phải thiết kế DB theo role-per-context từ đầu. Nếu sai chỗ này, phải refactor lớn sau.

4. **File mẫu Word là .doc gốc, không phải .docx** → Phải dùng file đã convert trong `docs/huong_dan/`. Không thể dùng trực tiếp file trong `docs/thesis/`.

5. **Thầy kiểm tra "không bắt buộc làm hết"** → Nên có ít nhất 1 flow hoàn chỉnh demo được: Auth → Import SV → Phân công GVHD → Giao đề tài → Chấm điểm → Xuất Word. Hơn là có nhiều feature dở dang.

6. **Code phải trông như sinh viên viết** → Không dùng Service Layer, Repository Pattern, TypeScript. Logic trong Controller. Tên biến đơn giản. Comment ít.

---

## Recommendations cho Requirements Definition

### V1 Scope — Làm theo thứ tự này

**Sprint 1 (1 tuần): Nền tảng**
- Setup project: Laravel 12 API + React 19 SPA + MySQL
- Auth system: login/logout, 4 loại user, token persist DB + localStorage
- Migration đầy đủ với đúng charset utf8mb4
- Deploy thử lên hosting

**Sprint 2 (1.5 tuần): Core Admin**
- Quản lý GV (CRUD)
- Import SV từ Excel
- Phân công SV cho GVHD (max 10 SV/GV)

**Sprint 3 (1.5 tuần): Core GVHD flow**
- GVHD giao đề tài (1 hoặc 2 SV)
- Đánh giá 50%
- Chấm điểm hướng dẫn

**Sprint 4 (1 tuần): Export Word — test sớm nhất có thể**
- Export Mẫu 01.01, 01.02 (GVHD)
- Export Form nhiệm vụ (SV)

**Sprint 5 (1 tuần): GVPB + Hội đồng**
- Phân công GVPB
- Chấm điểm phản biện
- Export Mẫu 02.01, 02.02
- Lập hội đồng + phân công đề tài

**Sprint 6 (còn lại): Hoàn thiện**
- Xuất danh sách bảo vệ
- Tính điểm tổng kết
- Trang SV xem đề tài
- Dashboard thống kê (nếu còn thời gian)
- UI/UX polish

### Quyết định cần confirm với thầy trước khi code
- [ ] Quy tắc làm tròn điểm: 1 hay 2 chữ số thập phân?
- [ ] Điểm HĐ nhập thủ công bởi admin hay các thành viên HĐ tự nhập?
- [ ] File Excel thật từ Phòng Đào tạo — cột nào, dòng nào là data?
- [ ] Kỳ LVTN có nhiều đợt trong năm không, hay chỉ 1 đợt?
