# Roadmap: TT-CD2 — Hệ thống Quản lý Luận văn Tốt nghiệp

**Created:** 2026-04-03
**Target:** 2026-05-25 (~7 tuần)
**Phases:** 6 phases → Demo Ready (v1.0)

> **Lưu ý:** Đây là project mới hoàn toàn (greenfield). Thư mục `backend/` và `frontend/` trong repo hiện tại chỉ để tham khảo logic nghiệp vụ, KHÔNG tái sử dụng code.

---

## Phase Overview

| Phase | Name | Goal | Est. Duration |
|-------|------|------|---------------|
| 1 | Nền tảng | Laravel project mới, DB migrations, auth, React setup | 1.5 tuần |
| 2 | Import SV & Phân công GVHD | Import Excel, phân công, GVHD giao đề tài | 1.5 tuần |
| 3 | Chấm điểm & Export Word | GVHD/GVPB chấm điểm, xuất phiếu Word | 1.5 tuần |
| 4 | Hội đồng & Phân công PB | Lập hội đồng, phân công GVPB, xuất danh sách | 1 tuần |
| 5 | SV Portal & Điểm tổng kết | SV đăng nhập, xem đề tài, in form nhiệm vụ, tính điểm | 1 tuần |
| 6 | Deploy & Polish | Deploy hosting, test toàn bộ flow, UI cleanup | 0.5-1 tuần |

**Tổng:** ~7 tuần (vừa đủ deadline)

---

## Phase 1: Nền tảng

**Goal:** Laravel 12 project mới chạy được, database schema đúng, auth hoạt động với 4 role, React SPA kết nối được với backend.

**Delivers:**
- Laravel 12 project mới với cấu trúc chuẩn
- Migrations cho toàn bộ schema (giangvien, sinhvien, detai, hoidong, thanhvienhoidong, diem, cauhinh)
- Auth: login/logout/me — token lưu DB, check cả bảng giangvien + sinhvien
- Role system: `isAdmin` flag cho thư ký, role-per-context cho GVHD/GVPB
- React 19 + Vite + Tailwind setup, routing, AuthContext, login page hoạt động
- Seeders: 1 admin, vài GV mẫu, vài SV mẫu để test

**Plans:**
1. **Laravel setup** — `composer create-project laravel/laravel`, cài packages (phpoffice/phpword, phpoffice/phpspreadsheet, spatie/laravel-permission v6), cấu hình CORS
2. **Database schema** — viết migrations cho 7 bảng chính, foreign keys, indexes
3. **Auth API** — endpoint login/logout/me, middleware xác thực token từ DB, response trả về roles
4. **React setup** — Vite project, React Router 6, Tailwind 4, AuthContext, LoginPage, layout với sidebar theo role
5. **Seeder** — admin + GV mẫu + SV mẫu, test login từng role

**Success criteria:**
- [ ] `php artisan migrate` chạy thành công từ database trống
- [ ] Login GV → token trả về, `/api/me` trả về user info với roles đúng
- [ ] Login SV → cùng endpoint, phân biệt được GV vs SV
- [ ] React SPA đăng nhập được, redirect đúng trang theo role
- [ ] 4 role thấy menu khác nhau

**Requirements covered:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, KY-01, KY-02

---

## Phase 2: Import SV & Phân công GVHD

**Goal:** Thư ký import được danh sách SV từ file Excel, phân công SV cho GVHD (max 10 SV/GV), GVHD tạo và giao đề tài.

**Delivers:**
- Upload file Excel → parse → validate → import SV vào DB
- Tự tạo tài khoản SV khi import
- Giao diện phân công SV cho GVHD
- GVHD xem danh sách SV mình hướng dẫn
- GVHD tạo đề tài và gán 1-2 SV

**Plans:**
1. **Import Excel** — dùng phpspreadsheet đọc file trực tiếp, parse theo format file mẫu `Chốt_DSSV_GVHD_TenDeTai_LVTN_Dot2_17112025.xlsx`, validate, insert vào DB
2. **UI Import** — form upload, hiển thị preview trước khi import, báo lỗi theo từng dòng
3. **Phân công GVHD** — API gán SV cho GV (max 10), FE dropdown chọn GV cho từng SV hoặc nhóm SV
4. **GVHD giao đề tài** — GVHD tạo đề tài (tên, mô tả, mục tiêu, output), gán 1 hoặc 2 SV, xem danh sách đề tài

**Success criteria:**
- [ ] Upload file Excel mẫu → import thành công, SV xuất hiện trong danh sách
- [ ] Phân công 10 SV cho 1 GV thành công, SV thứ 11 bị từ chối
- [ ] GVHD đăng nhập thấy chỉ danh sách SV của mình
- [ ] GVHD tạo đề tài và gán 2 SV vào thành công

**Requirements covered:** SV-01, SV-02, SV-03, GV-01, PC-GVHD-01, PC-GVHD-02, PC-GVHD-03, DT-01, DT-02, DT-03

---

## Phase 3: Chấm điểm & Export Word

**Goal:** GVHD chấm điểm hướng dẫn và giữa kỳ, GVPB chấm điểm phản biện, xuất phiếu chấm thành file Word đúng format mẫu của khoa.

**Delivers:**
- Form chấm điểm GVHD (tiêu chí, tổng điểm, nhận xét)
- Export Word: Mẫu 01.01 (nhóm), 01.02 (cá nhân)
- Form chấm điểm GVPB
- Export Word: Mẫu 02.01 (nhóm), 02.02 (cá nhân)
- Đánh giá giữa kỳ 50% (đạt/không đạt)

> ⚠️ **Risk cao:** Test export Word sớm nhất có thể — placeholder trong template có thể bị tách XML.

**Plans:**
1. **Chấm điểm GVHD** — form nhập tiêu chí, tính tổng tự động, lưu DB, hiển thị lại điểm đã chấm
2. **Export Word GVHD** — dùng PHPWord TemplateProcessor, load Mau_01.01.docx / 01.02.docx, fill dữ liệu, stream download. Test kỹ với file thực tế.
3. **Chấm điểm GVPB + Export** — tương tự GVHD, dùng Mau_02.01.docx / 02.02.docx
4. **Đánh giá giữa kỳ** — thư ký bật/tắt cho phép chấm GK, GVHD đánh giá trạng thái SV

**Success criteria:**
- [ ] GVHD chấm điểm đề tài 2 SV, lưu thành công
- [ ] Download Mẫu 01.01 có đầy đủ thông tin SV, đề tài, điểm — đúng format mẫu khoa
- [ ] Download Mẫu 02.02 cho GVPB tương tự
- [ ] Chữ tiếng Việt trong file Word không bị lỗi font

**Requirements covered:** GIAM50-01, GIAM50-02, GIAM50-03, CHAMSV-01, CHAMSV-02, CHAMSV-03, CHAMSV-04, CHAMPB-01, CHAMPB-02, CHAMPB-03, CHAMPB-04, EXPORT-01, EXPORT-02, EXPORT-03

---

## Phase 4: Hội đồng & Phân công PB

**Goal:** Thư ký lập hội đồng bảo vệ, phân công GVPB cho từng đề tài, phân công đề tài vào hội đồng có thứ tự, xuất danh sách bảo vệ.

**Delivers:**
- CRUD hội đồng (ngày, phòng, số HĐ, 3-4 GV với vai trò)
- Phân công GVPB cho đề tài
- Phân công đề tài vào hội đồng có thứ tự trình bày
- Xuất danh sách bảo vệ LVTN (Excel)

**Plans:**
1. **Phân công GVPB** — thư ký chọn đề tài → chọn GV phản biện, lưu vào DB. FE dropdown GV cho mỗi đề tài.
2. **Lập hội đồng** — form tạo/sửa hội đồng với chọn GV theo vai trò (chủ tịch, thư ký, uỷ viên), ngày bảo vệ, phòng
3. **Phân công đề tài vào HĐ** — chọn nhiều đề tài, gán vào 1 hội đồng, có thứ tự trình bày
4. **Xuất danh sách bảo vệ** — export Excel danh sách SV + đề tài + hội đồng + ngày + phòng

**Success criteria:**
- [ ] Phân công GVPB cho đề tài thành công, GVPB đăng nhập thấy đề tài phản biện
- [ ] Tạo hội đồng với 3 GV (Chủ tịch, Thư ký, Uỷ viên) thành công
- [ ] Gán 3 đề tài vào hội đồng có thứ tự 1-2-3
- [ ] Download file Excel danh sách bảo vệ đầy đủ thông tin

**Requirements covered:** PC-GVPB-01, PC-GVPB-02, PC-GVPB-03, HD-01, HD-02, HD-03, HD-04, HD-05

---

## Phase 5: SV Portal & Điểm tổng kết

**Goal:** Sinh viên đăng nhập xem đề tài, tải form nhiệm vụ LVTN. Hệ thống tính điểm tổng kết tự động từ 3 loại điểm.

**Delivers:**
- SV đăng nhập bằng MSSV + mật khẩu
- Trang SV xem thông tin đề tài, GVHD, trạng thái
- Tải form nhiệm vụ LVTN (Form_NhiemvuLVTN.docx) — bản 1SV và 2SV
- Admin nhập điểm hội đồng → tính điểm tổng kết: 20%HD + 20%PB + 60%HĐ
- Bảng điểm tổng hợp

**Plans:**
1. **SV login** — endpoint login check bảng sinhvien (MSSV + mật khẩu), trả về token + info
2. **Trang SV** — hiển thị đề tài, tên GVHD, trạng thái, điểm (nếu đã có)
3. **Export form nhiệm vụ** — PHPWord fill Form_NhiemvuLVTN.docx với tên SV, đề tài, GVHD, ...
4. **Tính điểm tổng kết** — admin nhập điểm HĐ, hệ thống tính tự động, hiển thị bảng điểm

**Success criteria:**
- [ ] SV đăng nhập bằng MSSV, thấy được đề tài của mình
- [ ] SV download form nhiệm vụ LVTN với thông tin đúng
- [ ] Nhập đủ 3 loại điểm → điểm tổng kết tính tự động đúng công thức
- [ ] Bảng điểm tổng hợp hiển thị đúng

**Requirements covered:** SV-04, DT-04, DT-05, GIAM50-03, DIEM-01, DIEM-02, DIEM-03, DIEM-04, SV-PAGE-01, SV-PAGE-02

---

## Phase 6: Deploy & Polish

**Goal:** Hệ thống chạy trên hosting thật, giao diện ổn định, flow chính demo được trọn vẹn.

**Delivers:**
- Deploy thành công lên hosting của thầy
- Domain .io.vn hoặc .id.vn trỏ về đúng
- UI responsive, không bị lỗi hiển thị
- Full demo flow chạy được end-to-end

**Plans:**
1. **Build React** — `npm run build`, config để serve từ Laravel `public/`
2. **Deploy Laravel** — upload lên hosting, cấu hình `.env`, chạy migrations, test API
3. **Cấu hình .htaccess** — rewrite rules cho API routes và SPA routing
4. **Test toàn bộ flow** — chạy thử từ đầu đến cuối, fix lỗi gặp phải
5. **UI polish** — sửa những chỗ bị lỗi UI, thêm loading states, responsive check

**Success criteria:**
- [ ] Truy cập domain.io.vn thấy giao diện login
- [ ] Demo full flow từ import SV đến xuất điểm tổng kết không bị lỗi
- [ ] Trang web hoạt động trên laptop khác (không chỉ máy dev)
- [ ] Không có lỗi console JS nghiêm trọng

---

## Milestone: v1.0 — Demo Ready

**Phases:** 1-6
**Target:** 2026-05-25

**Demo flow bắt buộc hoạt động:**
```
Admin login
→ Import DSSV từ Excel
→ Phân công SV cho GVHD
→ GVHD login → Giao đề tài → Chấm điểm giữa kỳ → Chấm điểm HD → Export Word
→ Admin phân công GVPB
→ GVPB login → Chấm điểm PB → Export Word
→ Admin lập hội đồng → Gán đề tài vào HĐ → Nhập điểm HĐ → Tính tổng kết
→ SV login → Xem đề tài → In form nhiệm vụ
→ Admin xuất danh sách bảo vệ
```

**Nếu bị trễ — thứ tự cắt feature:**
1. Dashboard thống kê (nice-to-have)
2. Auto-assign GVHD (làm manual thay thế)
3. Đánh giá giữa kỳ chi tiết (chỉ cần toggle đạt/không đạt)
4. UI polish (functional > beautiful)
5. **KHÔNG cắt:** core flow import → assign → topic → score → export

---
*Roadmap created: 2026-04-03*
*Updated: 2026-04-03 — greenfield project, không refactor code cũ*
