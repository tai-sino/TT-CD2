# Requirements: TT-CD2 — Hệ thống Quản lý Luận văn Tốt nghiệp

**Defined:** 2026-04-03
**Core Value:** Thư ký khoa có thể quản lý toàn bộ vòng đời LVTN — từ import danh sách SV đến xuất danh sách bảo vệ — mà không cần thao tác thủ công qua Excel/email.

---

## v1 Requirements

### AUTH — Xác thực & Phân quyền

- [x] **AUTH-01**: Người dùng đăng nhập bằng email + password, hệ thống trả về token lưu trong localStorage để duy trì session qua các lần reload
- [x] **AUTH-02**: Hệ thống hỗ trợ 4 role: admin (thư ký khoa), gvhd (giảng viên hướng dẫn), gvpb (giảng viên phản biện), sv (sinh viên)
- [x] **AUTH-03**: Một giảng viên có thể mang nhiều role cùng lúc theo context — vừa là GVHD của nhóm A, GVPB của nhóm B, thành viên HĐ nhóm C — và thấy đúng menu/chức năng tương ứng với từng role
- [x] **AUTH-04**: Mỗi role chỉ truy cập được các route và menu thuộc quyền của mình (route guard)
- [ ] **AUTH-05**: Người dùng có thể đổi mật khẩu của mình
- [ ] **AUTH-06**: Admin có thể tạo, sửa, xoá tài khoản giảng viên và sinh viên (khi import SV từ Excel, hệ thống tự tạo tài khoản SV)
- [ ] **AUTH-07**: Thành viên hội đồng (GV có vai trò trong 1 hội đồng) tự đăng nhập và thấy chức năng nhập điểm HĐ cho đề tài thuộc hội đồng của mình — đây là context role, không cần role mới, GV đã có tài khoản sẵn

### KY — Quản lý kỳ LVTN

- [ ] **KY-01**: Admin tạo kỳ LVTN mới với thông tin: tên kỳ (VD: HK2 2025-2026), các mốc thời gian (nhận đề tài, chấm 50%, phản biện, bảo vệ)
- [ ] **KY-02**: Admin chỉnh sửa thông tin và mốc thời gian của kỳ LVTN đang hoạt động
- [ ] **KY-03**: Mọi dữ liệu (SV, đề tài, điểm, hội đồng) đều gắn với 1 kỳ LVTN cụ thể
- [ ] **KY-04**: Hệ thống hiển thị trạng thái hiện tại của kỳ LVTN (đang ở giai đoạn nào dựa trên mốc thời gian)

### SV — Quản lý sinh viên

- [ ] **SV-01**: Admin import danh sách SV từ file Excel (từ Phòng Đào tạo) — parse được MSSV, họ tên, lớp, email. Hệ thống validate trùng MSSV và thiếu trường bắt buộc, báo lỗi cụ thể theo từng dòng
- [ ] **SV-02**: Khi import, hệ thống tự tạo tài khoản SV (email + mật khẩu mặc định) cho mỗi SV chưa có tài khoản
- [ ] **SV-03**: Admin xem danh sách SV theo kỳ LVTN, có filter theo lớp và theo GVHD đã phân công
- [ ] **SV-04**: Danh sách SV hiển thị: MSSV, họ tên, lớp, GVHD (nếu đã phân), đề tài (nếu có), trạng thái hiện tại

### GV — Quản lý giảng viên

- [ ] **GV-01**: Admin quản lý danh sách giảng viên (thêm, sửa, xoá) — thông tin gồm: họ tên, email, số điện thoại, học vị
- [ ] **GV-02**: Danh sách GV hiển thị số SV đang hướng dẫn, số đề tài đang phản biện, số hội đồng đang tham gia

### PC-GVHD — Phân công GVHD

- [ ] **PC-GVHD-01**: Admin phân công SV cho GVHD bằng cách chọn từng SV và chọn GV từ dropdown (manual assign)
- [ ] **PC-GVHD-02**: Hệ thống ràng buộc tối đa 10 SV / 1 GVHD — khi vượt quá thì không cho phân thêm và hiển thị cảnh báo
- [ ] **PC-GVHD-03**: Trang phân công hiển thị rõ: danh sách SV chưa có GVHD, danh sách GV kèm số SV hiện tại / tối đa (VD: 7/10)
- [ ] **PC-GVHD-04**: Admin xem tổng quan trạng thái phân công: bao nhiêu SV đã phân, bao nhiêu chưa phân

### DT — Đề tài

- [ ] **DT-01**: GVHD tạo đề tài cho SV mình hướng dẫn — 1 đề tài gán cho 1 SV (cá nhân) hoặc 2 SV (nhóm)
- [ ] **DT-02**: Thông tin đề tài gồm: tên đề tài, mô tả, mục tiêu, output dự kiến
- [ ] **DT-03**: GVHD xem danh sách SV được phân công hướng dẫn, kèm trạng thái: đã có đề tài / chưa có đề tài
- [ ] **DT-04**: GVHD chỉnh sửa thông tin đề tài đã tạo (trước khi chấm điểm)
- [ ] **DT-05**: Admin xem tổng quan đề tài: danh sách tất cả đề tài, filter theo GVHD, trạng thái (chưa giao / đã giao / đã chấm)

### GIAM50 — Đánh giá giữa kỳ (50%)

- [ ] **GIAM50-01**: GVHD đánh giá tiến độ SV tại mốc 50% — form gồm 5 tiêu chí đánh giá, điểm từng tiêu chí, nhận xét chung
- [ ] **GIAM50-02**: Kết quả 50%: đạt hoặc không đạt (dựa trên tổng điểm)
- [ ] **GIAM50-03**: Admin xem tổng hợp kết quả đánh giá 50% của toàn bộ SV trong kỳ

### CHAMSV — Chấm điểm GVHD (hướng dẫn)

- [ ] **CHAMSV-01**: GVHD chấm điểm hướng dẫn cho đề tài mình hướng dẫn — form gồm 5 tiêu chí, điểm từng tiêu chí (thang 10), nhận xét
- [ ] **CHAMSV-02**: Hệ thống tự tính tổng điểm hướng dẫn từ các tiêu chí
- [ ] **CHAMSV-03**: GVHD xuất phiếu chấm ra file Word — Mẫu 01.01 nếu đề tài nhóm (2 SV), Mẫu 01.02 nếu đề tài cá nhân (1 SV). File xuất ra đã fill đầy đủ data (tên SV, MSSV, đề tài, điểm, nhận xét)
- [ ] **CHAMSV-04**: GVHD có thể sửa điểm hướng dẫn trước khi admin khoá kỳ

### PC-GVPB — Phân công GV phản biện

- [ ] **PC-GVPB-01**: Admin phân công 1 GVPB cho mỗi đề tài (chỉ phân được khi đề tài đã có từ bước giao đề tài)
- [ ] **PC-GVPB-02**: Hệ thống cảnh báo nếu admin chọn GVPB trùng với GVHD của cùng đề tài
- [ ] **PC-GVPB-03**: GVPB xem danh sách đề tài mình được phân phản biện, kèm thông tin SV, GVHD, tên đề tài

### CHAMPB — Chấm điểm phản biện

- [ ] **CHAMPB-01**: GVPB chấm điểm phản biện cho đề tài được phân — form gồm tiêu chí, điểm từng tiêu chí (thang 10), nhận xét
- [ ] **CHAMPB-02**: Hệ thống tự tính tổng điểm phản biện từ các tiêu chí
- [ ] **CHAMPB-03**: GVPB xuất phiếu chấm ra file Word — Mẫu 02.01 nếu đề tài nhóm, Mẫu 02.02 nếu đề tài cá nhân. File xuất ra đã fill đầy đủ data
- [ ] **CHAMPB-04**: GVPB có thể sửa điểm phản biện trước khi admin khoá kỳ

### HD — Hội đồng bảo vệ

- [ ] **HD-01**: Admin tạo hội đồng bảo vệ với thông tin: số hội đồng, ngày bảo vệ, phòng, danh sách 3-4 GV (1 chủ tịch, 1 thư ký, 1-2 thành viên)
- [ ] **HD-02**: Admin chỉnh sửa thông tin hội đồng (thay đổi GV, phòng, ngày)
- [ ] **HD-03**: Admin phân công đề tài vào hội đồng — mỗi đề tài thuộc 1 hội đồng, có thứ tự trình bày (STT)
- [ ] **HD-04**: Admin thay đổi thứ tự trình bày của đề tài trong hội đồng
- [ ] **HD-05**: Admin xuất danh sách bảo vệ LVTN ra file Excel — gồm: SV, MSSV, đề tài, hội đồng, ngày, phòng, thứ tự trình bày

### DIEM — Tính điểm tổng kết

- [ ] **DIEM-01**: Hệ thống tự động tính điểm tổng kết theo công thức: 20% điểm hướng dẫn + 20% điểm phản biện + 60% điểm hội đồng
- [ ] **DIEM-02**: Điểm hội đồng = trung bình cộng điểm của tất cả thành viên hội đồng đã nhập điểm cho đề tài đó
- [ ] **DIEM-03**: Từng thành viên hội đồng (chủ tịch, thư ký, uỷ viên) tự đăng nhập và nhập điểm riêng cho từng đề tài được phân vào hội đồng của mình (không phải admin nhập hộ)
- [ ] **DIEM-04**: Hệ thống hiển thị bảng tổng hợp điểm: điểm HD, điểm PB, điểm HĐ, điểm tổng kết — filter theo hội đồng, GVHD, hoặc lớp

### SV-PAGE — Trang sinh viên

- [ ] **SV-PAGE-01**: SV đăng nhập xem thông tin đề tài của mình: tên đề tài, mô tả, mục tiêu, output, GVHD, GVPB (nếu đã phân)
- [ ] **SV-PAGE-02**: SV tải/in tờ nhiệm vụ LVTN (Form_NhiemvuLVTN) — hệ thống tự chọn template 1 SV hoặc 2 SV tuỳ loại đề tài, file Word xuất ra đã fill đầy đủ data

### EXPORT — Xuất file Word từ template

- [ ] **EXPORT-01**: Hệ thống fill data vào 5 template Word (.docx đã convert): Form_NhiemvuLVTN, Mẫu 01.01, Mẫu 01.02, Mẫu 02.01, Mẫu 02.02 — dùng phpoffice/phpword TemplateProcessor
- [ ] **EXPORT-02**: File Word xuất ra phải giữ nguyên format gốc của template (bảng, font, layout), chỉ thay placeholder bằng data thật
- [ ] **EXPORT-03**: File xuất ra download trực tiếp về máy client, không lưu lại trên server

---

## v2 Requirements (deferred)

Các tính năng sẽ làm sau khi v1 hoàn thành, hoặc sau deadline nếu còn thời gian:

- [ ] **V2-01**: Auto-assign GVHD — thuật toán chia đều SV cho GV (round-robin), admin review trước khi confirm
- [ ] **V2-02**: Dashboard thống kê — tổng SV, tổng đề tài, tiến độ theo stage, biểu đồ đơn giản
- [ ] **V2-03**: Preview Excel trước khi import — hiển thị data sẽ import, chỉ rõ row lỗi, cho phép sửa/bỏ row trước khi confirm
- [ ] **V2-04**: Forgot password — reset mật khẩu qua email (Laravel có sẵn)
- [ ] **V2-05**: Xuất danh sách bảo vệ ra PDF — bảng đẹp hơn Excel, có header khoa/trường để in dán bảng tin
- [ ] **V2-06**: Drag & drop xếp lịch bảo vệ — kéo thả đề tài vào hội đồng + sắp thứ tự trình bày
- [ ] **V2-07**: Filter & search nâng cao — tìm SV theo tên/MSSV, filter theo trạng thái (chưa có GV, chưa có đề tài, đã chấm...)
- [ ] **V2-08**: Notification email — gửi mail khi phân công, khi có điểm, khi có lịch bảo vệ

---

## Out of Scope

| Feature | Lý do |
|---------|-------|
| Chấm điểm hội đồng realtime trong buổi bảo vệ | Thầy chưa yêu cầu. Buổi bảo vệ chấm trên giấy, nhập vào hệ thống sau. Nếu làm cần UI cho 3-4 GV chấm cùng lúc, quá phức tạp cho v1 |
| SV tự đăng ký đề tài online | SV đăng ký qua link Phòng Đào tạo, PDT lọc rồi đưa cho khoa. Hệ thống chỉ nhận file import kết quả |
| In công bố kết quả 50% | Thầy ghi rõ "Không cần" |
| Email notifications | Cần setup mail server, queue, template — phức tạp và dễ lỗi trên shared hosting. Thêm sau nếu cần |
| OAuth / SSO (Google, SSO trường) | Phức tạp, cần tích hợp hệ thống trường. Email + password đủ cho scope project |
| Mobile app | Web responsive là đủ. Không ai cần app riêng cho quản lý LVTN |
| Real-time concurrent editing | Nhiều GV chấm cùng lúc cần WebSocket — quá phức tạp. Dùng page refresh, conflict gần như không xảy ra vì mỗi GV chấm đề tài khác nhau |
| Audit log / History | Ghi lại ai sửa gì khi nào — hay nhưng quá phức tạp cho v1 |
| Multi-tenant (nhiều khoa) | Chỉ phục vụ khoa CNTT, hardcode cho 1 khoa |
| Plagiarism check / Turnitin | Ngoài scope, khoa dùng tool riêng |
| SV upload báo cáo | Không có trong yêu cầu thầy |

---

## Traceability

| Requirement | Phase |
|-------------|-------|
| AUTH-01 | TBD |
| AUTH-02 | TBD |
| AUTH-03 | TBD |
| AUTH-04 | TBD |
| AUTH-05 | TBD |
| AUTH-06 | TBD |
| KY-01 | TBD |
| KY-02 | TBD |
| KY-03 | TBD |
| KY-04 | TBD |
| SV-01 | TBD |
| SV-02 | TBD |
| SV-03 | TBD |
| SV-04 | TBD |
| GV-01 | TBD |
| GV-02 | TBD |
| PC-GVHD-01 | TBD |
| PC-GVHD-02 | TBD |
| PC-GVHD-03 | TBD |
| PC-GVHD-04 | TBD |
| DT-01 | TBD |
| DT-02 | TBD |
| DT-03 | TBD |
| DT-04 | TBD |
| DT-05 | TBD |
| GIAM50-01 | TBD |
| GIAM50-02 | TBD |
| GIAM50-03 | TBD |
| CHAMSV-01 | TBD |
| CHAMSV-02 | TBD |
| CHAMSV-03 | TBD |
| CHAMSV-04 | TBD |
| PC-GVPB-01 | TBD |
| PC-GVPB-02 | TBD |
| PC-GVPB-03 | TBD |
| CHAMPB-01 | TBD |
| CHAMPB-02 | TBD |
| CHAMPB-03 | TBD |
| CHAMPB-04 | TBD |
| HD-01 | TBD |
| HD-02 | TBD |
| HD-03 | TBD |
| HD-04 | TBD |
| HD-05 | TBD |
| DIEM-01 | TBD |
| DIEM-02 | TBD |
| DIEM-03 | TBD |
| DIEM-04 | TBD |
| SV-PAGE-01 | TBD |
| SV-PAGE-02 | TBD |
| EXPORT-01 | TBD |
| EXPORT-02 | TBD |
| EXPORT-03 | TBD |
