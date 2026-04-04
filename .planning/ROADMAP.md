# Roadmap: TT-CD2 — Hệ thống Quản lý Luận văn Tốt nghiệp

**Created:** 2026-04-03
**Target:** 2026-05-25 (~5-6 tuần)
**Team:** 6 người — BE/FE tách riêng, làm remote
**Phases:** 6 phases → Demo Ready (v1.0)

> Greenfield project — không tái sử dụng code cũ trong `backend/` và `frontend/`.

---

## Nguyên tắc làm việc 6 người

**Chia team:**
- **BE team (2-3 người)**: Laravel 12 — migrations, API endpoints, auth, logic nghiệp vụ, export
- **FE team (2-3 người)**: React 19 — UI, routing, kết nối API, UX

**Quy tắc để không bị block nhau:**
1. **Phase 1 làm cùng nhau** — setup project, thống nhất API contract trước khi tách
2. **Mỗi phase có API contract rõ** — BE và FE dùng chung tài liệu endpoint để làm song song
3. **FE dùng mock data khi BE chưa xong** — không ngồi chờ
4. **Cuối mỗi phase integrate và test chung** — không để dồn lại

---

## Phase Overview

| Phase | Tên | BE làm | FE làm | Tuần |
|-------|-----|--------|--------|------|
| 1 | Nền tảng | Laravel setup, DB, Auth API | React setup, Login UI, Layout | 1-1.5 |
| 2 | Quản lý SV & GV | Import Excel API, CRUD API | Import UI, Danh sách SV/GV | 1 |
| 3 | Đề tài & Phân công | Topic API, Phân công API | Trang GVHD, Giao đề tài UI | 1 |
| 4 | Chấm điểm & Export | Score API, Export Word API | Form chấm điểm, Download UI | 1-1.5 |
| 5 | Hội đồng & Điểm HĐ | Council API, Điểm TV HĐ API | Trang lập hội đồng, SV portal | 1 |
| 6 | Tích hợp & Deploy | Fix bugs BE, Deploy | Fix bugs FE, Build prod | 0.5-1 |

---

## Phase 1: Nền tảng

**Goal:** Project chạy được, database đúng schema, auth hoạt động, BE và FE kết nối được với nhau.

**Tại sao cần làm chung phase này:** Đây là nền để cả team build lên — sai ở đây thì tất cả phải sửa lại.

### BE làm:
1. **Khởi tạo Laravel 12** — `composer create-project`, cài packages: `phpoffice/phpword`, `phpoffice/phpspreadsheet`, `spatie/laravel-permission v6`, config CORS cho React
2. **Viết migrations** — 8 bảng: `giangvien`, `sinhvien`, `ky_lvtn`, `detai`, `hoidong`, `thanhvien_hoidong`, `diem_hoidong`, `cau_hinh`
3. **Auth API** — `POST /api/login`, `POST /api/logout`, `GET /api/me` — token lưu DB (`personal_access_tokens` của Sanctum), check cả bảng GV và SV
4. **Seeder** — 1 admin, 3 GV mẫu, 5 SV mẫu

### FE làm:
1. **Khởi tạo React 19 + Vite + Tailwind 4** — cấu trúc thư mục, React Router 6
2. **AuthContext** — lưu token localStorage, `useAuth` hook
3. **LoginPage** — form email + password, gọi API login
4. **Layout** — sidebar với menu theo role (admin/gvhd/gvpb/sv), protected routes

### API Contract (thống nhất trước khi làm):
```
POST /api/login       { email, password } → { token, user: { id, name, role[] } }
POST /api/logout      Header: Bearer token → 200
GET  /api/me          Header: Bearer token → { id, name, email, roles[] }
```

### Success criteria:
- [ ] `php artisan migrate` chạy thành công từ database trống
- [ ] Login GV → token trả về, `/api/me` trả về đúng roles
- [ ] Login SV → cùng endpoint, phân biệt được loại user
- [ ] FE đăng nhập được, redirect đúng trang theo role
- [ ] 4 role thấy menu khác nhau

**Requirements covered:** AUTH-01, AUTH-02, AUTH-03, AUTH-04

---

## Phase 2: Quản lý SV & GV

**Goal:** Thư ký import được danh sách SV từ Excel, xem và quản lý danh sách SV/GV.

### BE làm:
1. **Import Excel** — `POST /api/students/import` dùng phpspreadsheet đọc file, parse MSSV/tên/lớp/email, validate, insert, tự tạo tài khoản SV
2. **CRUD SV** — `GET /api/students`, `POST /api/students`, `PUT /api/students/{id}`, `DELETE /api/students/{id}`
3. **CRUD GV** — tương tự, thêm `isAdmin` flag
4. **Quản lý kỳ LVTN** — `GET/POST/PUT /api/ky-lvtn`, lưu tên kỳ + các mốc ngày (linh động, admin chỉnh được)

### FE làm:
1. **Trang Import SV** — form upload file Excel, preview danh sách trước khi confirm, hiện lỗi từng dòng
2. **Danh sách SV** — bảng với filter theo lớp, search, phân trang
3. **Danh sách GV** — bảng, form thêm/sửa/xóa GV
4. **Trang Cài đặt kỳ LVTN** — form nhập tên kỳ + các mốc thời gian (ngày bắt đầu/kết thúc từng giai đoạn)

### API Contract:
```
POST   /api/students/import    multipart/form-data → { imported: N, errors: [] }
GET    /api/students           ?ky_id=&lop=&search= → { data: [...] }
POST   /api/students           { mssv, ten, lop, email } → student
GET    /api/giang-vien         → { data: [...] }
POST   /api/giang-vien         { ten, email, password } → gv
GET    /api/ky-lvtn            → { data: [...] }
POST   /api/ky-lvtn            { ten, ngay_nhan_de_tai, ngay_cham_50, ngay_phan_bien, ngay_bao_ve } → ky
PUT    /api/ky-lvtn/{id}       (same fields) → ky
```

### Success criteria:
- [ ] Upload file Excel mẫu → SV xuất hiện trong danh sách, tài khoản SV tự tạo
- [ ] Lỗi import hiển thị rõ theo dòng (VD: "Dòng 5: MSSV trùng")
- [ ] Admin thêm/sửa/xóa GV được
- [ ] Admin tạo kỳ LVTN với các mốc ngày, sửa lại được

**Requirements covered:** SV-01, SV-02, SV-03, GV-01, GV-02, KY-01, KY-02, KY-03

---

## Phase 3: Đề tài & Phân công

**Goal:** Thư ký phân công SV cho GVHD, GVHD giao đề tài cho SV, thư ký phân công GVPB.

### BE làm:
1. **Phân công GVHD** — `POST /api/phan-cong/gvhd` gán list SV vào 1 GV, check max 10 SV/GV
2. **Đề tài CRUD** — GVHD tạo đề tài, gán 1-2 SV: `POST /api/de-tai`, `PUT /api/de-tai/{id}`
3. **Phân công GVPB** — `PUT /api/de-tai/{id}/gvpb` gán GVPB cho đề tài
4. **Filter theo role** — `GET /api/de-tai` trả đúng data theo người đang login (GVHD thấy đề tài mình hướng dẫn, GVPB thấy đề tài mình phản biện)

### FE làm:
1. **Trang Phân công GVHD** — chọn GV, chọn nhiều SV, assign — hiện cảnh báo nếu GV đã đủ 10 SV
2. **Trang GVHD** — danh sách SV được phân công, form tạo đề tài (tên, mô tả, chọn 1-2 SV)
3. **Trang Phân công GVPB** — danh sách đề tài, dropdown chọn GVPB cho từng đề tài
4. **Trang GVPB** — danh sách đề tài được giao phản biện

### API Contract:
```
POST   /api/phan-cong/gvhd    { gv_id, sv_ids: [] } → { ok, errors }
GET    /api/de-tai             → filtered by current user role
POST   /api/de-tai             { ten, mo_ta, gv_hd_id, sv_ids: [1 or 2] } → de_tai
PUT    /api/de-tai/{id}        (same fields)
PUT    /api/de-tai/{id}/gvpb   { gv_pb_id } → de_tai
```

### Success criteria:
- [ ] Phân công 10 SV cho 1 GV OK, SV thứ 11 bị từ chối với thông báo rõ
- [ ] GVHD đăng nhập chỉ thấy SV và đề tài của mình
- [ ] GVHD tạo đề tài gán 2 SV thành công
- [ ] GVPB đăng nhập thấy danh sách đề tài phản biện

**Requirements covered:** PC-GVHD-01, PC-GVHD-02, PC-GVHD-03, DT-01, DT-02, DT-03, PC-GVPB-01, PC-GVPB-02

---

## Phase 4: Chấm điểm & Export Word

**Goal:** GVHD chấm điểm hướng dẫn và giữa kỳ, GVPB chấm điểm phản biện, xuất phiếu chấm ra file Word đúng mẫu.

> ⚠️ **Risk cao nhất của cả project** — test export Word sớm nhất có thể. Placeholder `${ten_sv}` trong file .docx có thể bị Word tách thành nhiều XML tag → `setValue()` không tìm thấy.

### BE làm:
1. **Chấm điểm GVHD** — `POST /api/de-tai/{id}/diem-hd` lưu các tiêu chí + tổng điểm + nhận xét
2. **Chấm điểm giữa kỳ** — `POST /api/de-tai/{id}/diem-gk` lưu trạng thái + nhận xét giữa kỳ
3. **Chấm điểm GVPB** — `POST /api/de-tai/{id}/diem-pb` tương tự
4. **Export Word GVHD** — `GET /api/de-tai/{id}/export/gvhd` fill Mau_01.01.docx (nhóm) hoặc 01.02 (cá nhân) bằng PHPWord TemplateProcessor, stream download
5. **Export Word GVPB** — `GET /api/de-tai/{id}/export/gvpb` tương tự với Mau_02.01/02.02

### FE làm:
1. **Form chấm điểm GVHD** — nhập từng tiêu chí, tính tổng tự động, nhận xét, submit
2. **Form chấm điểm giữa kỳ** — đánh giá trạng thái SV (Được làm tiếp / Đình chỉ / Cảnh cáo) + nhận xét
3. **Form chấm điểm GVPB** — tương tự GVHD
4. **Nút export** — download button gọi API export, hiện trạng thái loading

### API Contract:
```
POST   /api/de-tai/{id}/diem-hd     { tieu_chi: {}, tong_diem, nhan_xet } → ok
POST   /api/de-tai/{id}/diem-gk     { trang_thai, nhan_xet } → ok
POST   /api/de-tai/{id}/diem-pb     { tieu_chi: {}, tong_diem, nhan_xet } → ok
GET    /api/de-tai/{id}/export/gvhd → file download (Word)
GET    /api/de-tai/{id}/export/gvpb → file download (Word)
```

### Success criteria:
- [ ] GVHD chấm điểm lưu thành công, xem lại được điểm đã nhập
- [ ] Download Mẫu 01.01 có đầy đủ thông tin SV, đề tài, điểm — không lỗi font tiếng Việt
- [ ] Download Mẫu 02.02 cho GVPB tương tự
- [ ] Chọn đúng mẫu: 1 SV → dùng 01.02, 2 SV → dùng 01.01

**Requirements covered:** GIAM50-01, GIAM50-02, CHAMSV-01~04, CHAMPB-01~04, EXPORT-01~03

---

## Phase 5: Hội đồng & SV Portal

**Goal:** Thư ký lập hội đồng, phân công đề tài vào hội đồng, từng thành viên HĐ nhập điểm, SV xem đề tài và in form nhiệm vụ.

### BE làm:
1. **CRUD Hội đồng** — tạo HĐ với ngày/phòng/số HĐ, thêm 3-4 GV với vai trò (chủ tịch, thư ký, uỷ viên)
2. **Phân công đề tài vào HĐ** — `POST /api/hoi-dong/{id}/de-tai` gán đề tài có thứ tự trình bày
3. **Điểm thành viên HĐ** — `POST /api/de-tai/{id}/diem-hd-tv` TV HĐ tự nhập điểm sau khi bảo vệ
4. **Tính điểm tổng kết** — tự động tính khi đủ 3 loại điểm: `diem_hd * 0.2 + diem_pb * 0.2 + avg(diem_hd_tv) * 0.6`
5. **Xuất danh sách bảo vệ** — `GET /api/hoi-dong/{id}/export` export Excel danh sách SV + đề tài + HĐ + ngày + phòng
6. **Export Form nhiệm vụ SV** — `GET /api/sv/form-nhiem-vu` fill Form_NhiemvuLVTN.docx

### FE làm:
1. **Trang Hội đồng** — form tạo/sửa HĐ, chọn GV theo vai trò, ngày/phòng
2. **Phân công đề tài vào HĐ** — drag-drop hoặc input số thứ tự, gán đề tài vào HĐ
3. **Trang thành viên HĐ** — TV HĐ đăng nhập thấy danh sách đề tài cần chấm, form nhập điểm
4. **Bảng điểm tổng hợp** — admin xem bảng điểm tất cả SV (HD, PB, HĐ, tổng kết, điểm chữ)
5. **SV Portal** — SV đăng nhập thấy đề tài, GVHD, trạng thái, điểm (nếu có), nút download form nhiệm vụ

### API Contract:
```
GET/POST       /api/hoi-dong                           → list / tạo mới
PUT/DELETE     /api/hoi-dong/{id}
POST           /api/hoi-dong/{id}/thanh-vien           { gv_id, vai_tro } → ok
POST           /api/hoi-dong/{id}/de-tai               { de_tai_ids: [], thu_tu_start: 1 } → ok
POST           /api/de-tai/{id}/diem-hd-tv             { diem, nhan_xet } → ok  (TV HĐ gọi)
GET            /api/de-tai/{id}/diem-tong-ket          → { diem_hd, diem_pb, diem_hoi_dong, tong_ket, diem_chu }
GET            /api/hoi-dong/{id}/export               → file Excel
GET            /api/sv/de-tai                          → đề tài của SV đang login
GET            /api/sv/form-nhiem-vu                   → file Word download
```

### Success criteria:
- [ ] Tạo hội đồng với 3 GV vai trò khác nhau thành công
- [ ] TV HĐ đăng nhập, thấy đề tài mình cần chấm, nhập điểm được
- [ ] Sau khi cả 3 TV HĐ nhập điểm → điểm tổng kết tính đúng
- [ ] SV đăng nhập thấy thông tin đề tài và download được form nhiệm vụ
- [ ] Admin download được Excel danh sách bảo vệ

**Requirements covered:** HD-01~05, DIEM-01~04, SV-PAGE-01~02

---

## Phase 6: Tích hợp & Deploy

**Goal:** Toàn bộ flow chạy end-to-end không lỗi, deploy lên hosting, demo được.

### BE làm:
1. Sửa bugs phát hiện khi integrate với FE
2. Config `.env.production`, storage symlink
3. Deploy lên hosting của thầy, chạy migrations

### FE làm:
1. Sửa bugs UI/UX phát hiện khi test
2. `npm run build`, config base URL production
3. Copy build output vào `backend/public/` hoặc serve riêng

### Chung:
1. Test toàn bộ demo flow từ đầu đến cuối
2. Fix lỗi gặp phải
3. Cấu hình `.htaccess` cho SPA routing + API routing
4. Kiểm tra trên máy khác (không chỉ máy dev)

### Success criteria:
- [ ] Truy cập domain thấy trang login
- [ ] Demo full flow không bị lỗi: Import SV → Phân công → Giao đề tài → Chấm điểm → Export Word → Lập HĐ → TV HĐ nhập điểm → Tổng kết → SV in form
- [ ] Chạy được trên laptop của thầy

---

## Milestone: v1.0 — Demo Ready

**Target:** 2026-05-25
**Phases:** 1-6

**Demo flow bắt buộc:**
```
Admin login
→ Tạo kỳ LVTN (tên + các mốc thời gian)
→ Import DSSV từ Excel
→ Phân công SV cho GVHD

GVHD login
→ Xem danh sách SV
→ Tạo đề tài, gán 2 SV
→ Chấm điểm giữa kỳ
→ Chấm điểm hướng dẫn → Export Word Mẫu 01.01

Admin login
→ Phân công GVPB cho đề tài

GVPB login
→ Xem đề tài phản biện
→ Chấm điểm → Export Word Mẫu 02.01

Admin login
→ Lập hội đồng (3 GV)
→ Gán đề tài vào HĐ (thứ tự)
→ Xuất danh sách bảo vệ (Excel)

TV HĐ login (3 người)
→ Nhập điểm cho đề tài

Admin xem bảng điểm tổng kết

SV login
→ Xem đề tài
→ Download form nhiệm vụ LVTN
```

**Nếu bị trễ — thứ tự cắt:**
1. Bảng điểm tổng hợp đẹp → bảng HTML đơn giản là đủ
2. Drag-drop sắp thứ tự → input số thứ tự thay thế
3. Auto-calculate realtime → tính khi load trang
4. **KHÔNG cắt:** import → phân công → chấm điểm → export Word → lập HĐ → nhập điểm HĐ → SV in form

---

## Phân công team (đã xác nhận)

| Người | Role | Phần phụ trách |
|-------|------|----------------|
| BE-1 | Backend | Laravel API — Auth, migrations, logic nghiệp vụ |
| BE-2 | Backend | Laravel API — Import Excel, Export Word, Hội đồng, Điểm |
| FE-1 | Frontend | React — Setup, Layout, Auth, trang Admin |
| FE-2 | Frontend | React — Trang GVHD, GVPB, Form chấm điểm |
| FE-3 | Frontend | React — Trang SV, Hội đồng, Bảng điểm |
| OPS | DevOps/QA | Deploy, test, viết tài liệu API |

**Lưu ý quan trọng:**
- OPS viết tài liệu API dựa trên contract đã thống nhất trong roadmap này
- BE và FE dùng chung tài liệu API — FE mock data khi BE chưa xong
- OPS test sau mỗi phase khi BE + FE integrate xong

---
*Roadmap created: 2026-04-03*
*Updated: 2026-04-03 — cập nhật cho team 6 người, TV HĐ tự nhập điểm, mốc thời gian linh động*
