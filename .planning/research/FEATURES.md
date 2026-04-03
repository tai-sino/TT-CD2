# Features: TT-CD2 Thesis Management

> Phân tích tính năng dựa trên yêu cầu thầy (Projects.docx), flow nghiệp vụ (intro.txt), và PROJECT.md.
> Dùng làm input cho requirements definition.

---

## Table Stakes (Must Have)

Không có những tính năng này thì hệ thống không dùng được.

### 1. Auth & Phân quyền
- Đăng nhập email + password
- 4 role: admin (thư ký khoa), gvhd, gvpb, sv
- 1 GV có thể mang nhiều role cùng lúc (vừa GVHD nhóm A, vừa GVPB nhóm B, vừa thành viên HĐ nhóm C)
- Route guard theo role — mỗi role chỉ thấy menu/page của mình
- **Complexity**: Trung bình — phần multi-role trên cùng 1 user cần thiết kế DB cẩn thận
- **Phụ thuộc**: Không — đây là nền tảng, mọi module khác phụ thuộc vào Auth

### 2. Quản lý kỳ LVTN
- Admin tạo kỳ LVTN (VD: HK2 2025-2026)
- Thiết lập mốc thời gian: nhận đề tài, chấm 50%, phản biện, bảo vệ
- Mọi dữ liệu (SV, đề tài, điểm, HĐ) gắn với 1 kỳ cụ thể
- **Complexity**: Thấp — CRUD đơn giản
- **Phụ thuộc**: Auth

### 3. Import danh sách SV từ Excel
- Admin upload file Excel từ Phòng Đào tạo
- Parse: MSSV, tên, lớp, email (ít nhất)
- Validate trùng MSSV, thiếu trường bắt buộc
- Format import dựa trên file mẫu: `Chốt_DSSV_GVHD_TenDeTai_LVTN_Dot2_17112025.xlsx`
- **Complexity**: Trung bình — cần handle format Excel không chuẩn, row trống, header sai vị trí
- **Phụ thuộc**: Auth, Kỳ LVTN

### 4. Quản lý danh sách SV
- Xem danh sách SV theo kỳ
- Filter theo lớp, GVHD
- Hiển thị: MSSV, tên, lớp, GVHD (nếu đã phân), đề tài (nếu có)
- **Complexity**: Thấp
- **Phụ thuộc**: Import SV

### 5. Quản lý danh sách GV
- Admin quản lý danh sách giảng viên (tên, email, chức danh)
- Dùng để phân công GVHD, GVPB, thành viên HĐ
- **Complexity**: Thấp — CRUD
- **Phụ thuộc**: Auth

### 6. Phân công SV cho GVHD
- Admin gán SV cho GV hướng dẫn
- Ràng buộc: tối đa 10 SV / GV
- Hỗ trợ manual assign (chọn từng SV) + auto assign (chia đều)
- Hiển thị SV chưa có GVHD, dropdown chọn GV
- **Complexity**: Trung bình — auto assign cần logic phân bổ, UI cần trực quan
- **Phụ thuộc**: Danh sách SV, Danh sách GV

### 7. GVHD giao đề tài
- GVHD tạo đề tài cho SV mình hướng dẫn
- 1 đề tài = 1 SV hoặc 2 SV (nhóm)
- Nội dung: tên đề tài, mô tả, mục tiêu, output
- **Complexity**: Trung bình — cần xử lý nhóm 2 SV, 1 đề tài gắn nhiều SV
- **Phụ thuộc**: Phân công GVHD

### 8. Chấm điểm GVHD (hướng dẫn)
- GVHD chấm điểm SV mình hướng dẫn
- Form tiêu chí (5 mục theo mẫu), tổng điểm, nhận xét
- Xuất file Word: Mẫu 01.01 (nhóm), Mẫu 01.02 (cá nhân)
- **Complexity**: Trung bình-Cao — cần fill data vào template .docx, xử lý 2 mẫu khác nhau
- **Phụ thuộc**: Giao đề tài, Export Word

### 9. Đánh giá 50% (giữa kỳ)
- GVHD đánh giá tiến độ SV tại mốc 50%
- Kết quả: đạt / không đạt (hoặc điểm giữa kỳ)
- Admin xem tổng hợp kết quả 50%
- **Complexity**: Thấp — form đơn giản
- **Phụ thuộc**: Giao đề tài

### 10. Phân công GV phản biện
- Admin gán GVPB cho từng đề tài
- Mỗi đề tài 1 GVPB
- GVPB không nên trùng GVHD của đề tài đó
- **Complexity**: Thấp-Trung bình
- **Phụ thuộc**: Giao đề tài (phải có đề tài trước mới phân GVPB)

### 11. Chấm điểm phản biện
- GVPB chấm điểm đề tài được phân
- Form tiêu chí, điểm, nhận xét
- Xuất file Word: Mẫu 02.01 (nhóm), Mẫu 02.02 (cá nhân)
- **Complexity**: Trung bình-Cao — tương tự chấm GVHD, cùng cơ chế export Word
- **Phụ thuộc**: Phân công GVPB, Export Word

### 12. Lập hội đồng bảo vệ
- Admin tạo hội đồng: số HĐ, ngày, phòng
- Mỗi HĐ: 1 chủ tịch + 1 thư ký + 1-2 thành viên (3-4 GV tổng)
- Chọn GV từ danh sách, gán vai trò trong HĐ
- **Complexity**: Trung bình — cần UI chọn GV + gán role trong HĐ
- **Phụ thuộc**: Danh sách GV

### 13. Phân công đề tài vào hội đồng
- Admin gán đề tài vào HĐ cụ thể
- Có thứ tự trình bày (STT)
- 1 đề tài thuộc 1 HĐ
- **Complexity**: Trung bình — cần quản lý thứ tự, có thể drag-drop hoặc số thứ tự
- **Phụ thuộc**: Lập HĐ, Giao đề tài

### 14. Xuất danh sách bảo vệ LVTN
- Export: SV, đề tài, hội đồng, thời gian, phòng, thứ tự
- Format: Excel hoặc PDF
- **Complexity**: Trung bình — cần aggregate data từ nhiều bảng
- **Phụ thuộc**: Phân công đề tài vào HĐ

### 15. Export Word từ template
- Fill data vào template .docx có sẵn (từ thầy)
- 5 template cần hỗ trợ:
  - Form_NhiemvuLVTN.doc (SV in nhiệm vụ)
  - Mẫu 01.01 (chấm HD nhóm)
  - Mẫu 01.02 (chấm HD cá nhân)
  - Mẫu 02.01 (chấm PB nhóm)
  - Mẫu 02.02 (chấm PB cá nhân)
- Package: phpoffice/phpword
- **Complexity**: Cao — cần convert .doc sang .docx, map placeholder → data, xử lý bảng trong Word
- **Phụ thuộc**: Data từ chấm điểm, đề tài, SV

### 16. Trang SV — Xem đề tài + In nhiệm vụ
- SV đăng nhập xem đề tài của mình
- Download tờ nhiệm vụ LVTN (Form_NhiemvuLVTN.doc đã fill data)
- **Complexity**: Thấp — read-only + 1 nút export
- **Phụ thuộc**: Auth (role SV), Giao đề tài, Export Word

### 17. Tính điểm tổng kết
- Công thức: 20% HD + 20% PB + 60% HĐ
- Điểm HĐ = trung bình cộng điểm các thành viên HĐ (làm tròn)
- Tự động tính khi có đủ điểm thành phần
- **Complexity**: Thấp — tính toán đơn giản, nhưng cần đợi chấm điểm HĐ
- **Phụ thuộc**: Chấm GVHD, Chấm GVPB, (Chấm HĐ — hiện chưa trong scope v1)

---

## Differentiators (Nice to Have)

Cải thiện UX nhưng thiếu cũng không chết. Làm nếu còn thời gian.

### D1. Dashboard thống kê
- Tổng SV, tổng đề tài, tiến độ theo stage
- Biểu đồ đơn giản (bar chart, pie chart)
- **Complexity**: Thấp-Trung bình
- **Giá trị**: Admin thấy overview nhanh, demo đẹp khi kiểm tra

### D2. Auto-assign GVHD
- Thuật toán chia đều SV cho GV (round-robin hoặc random)
- Admin vẫn review trước khi confirm
- **Complexity**: Thấp — logic chia đều không khó
- **Giá trị**: Tiết kiệm thời gian khi số SV lớn

### D3. Filter & Search nâng cao
- Tìm SV theo tên/MSSV, filter theo trạng thái (chưa có GV, chưa có đề tài, đã chấm...)
- Tìm đề tài theo tên, GV
- **Complexity**: Thấp
- **Giá trị**: UX tốt hơn khi data nhiều

### D4. Drag & Drop xếp lịch bảo vệ
- Kéo thả đề tài vào hội đồng + sắp thứ tự
- **Complexity**: Trung bình-Cao — cần library DnD, state management
- **Giá trị**: UX mượt, nhưng dùng dropdown + số thứ tự cũng được

### D5. Forgot password
- Reset password qua email
- **Complexity**: Thấp — Laravel có sẵn
- **Giá trị**: Cần thiết nếu nhiều user, nhưng v1 admin có thể reset thủ công

### D6. Export danh sách bảo vệ ra PDF
- Xuất bảng đẹp hơn Excel, có header khoa/trường
- **Complexity**: Trung bình — cần thêm package PDF (dompdf hoặc tương tự)
- **Giá trị**: Thư ký khoa in ra dán bảng tin

### D7. Quản lý user (CRUD)
- Admin tạo/sửa/xoá tài khoản GV, SV
- Đổi mật khẩu, reset password
- **Complexity**: Thấp — CRUD cơ bản
- **Giá trị**: Cần nếu muốn admin tự quản lý, nhưng có thể seed/import ban đầu

### D8. Validation Excel khi import
- Hiển thị preview trước khi import
- Chỉ rõ row nào lỗi (thiếu MSSV, trùng, sai format)
- Cho phép admin sửa/bỏ row lỗi trước khi confirm
- **Complexity**: Trung bình
- **Giá trị**: Tránh data bẩn, UX tốt

---

## Anti-Features (Do NOT Build)

Tưởng cần nhưng không nên làm trong v1. Lý do kèm theo.

### X1. Chấm điểm hội đồng (trong buổi bảo vệ)
- Thầy chưa yêu cầu. Buổi bảo vệ chấm trên giấy, nhập sau.
- Nếu làm: cần UI cho 3-4 GV chấm cùng lúc, real-time, phức tạp.
- **Quyết định**: Bỏ. Công thức 60% HĐ để placeholder hoặc admin nhập thủ công.

### X2. Real-time concurrent editing
- Nhiều GV chấm điểm cùng lúc trên cùng trang → cần WebSocket, conflict resolution.
- **Quyết định**: Dùng page refresh bình thường. Conflict gần như không xảy ra vì mỗi GV chấm đề tài khác nhau.

### X3. SV tự đăng ký đề tài online
- Flow thực tế: SV đăng ký qua link Phòng Đào tạo → PDT lọc → khoa import file.
- Hệ thống này chỉ nhận kết quả import, không cần flow đăng ký.
- **Quyết định**: Bỏ.

### X4. Notification email tự động
- Gửi mail khi phân công, khi có điểm, khi có lịch bảo vệ.
- Cần setup mail server, queue, template mail — phức tạp và dễ gặp lỗi hosting.
- **Quyết định**: Bỏ khỏi v1. Thêm sau nếu cần.

### X5. Mobile app
- Web responsive là đủ. Không ai dùng app riêng cho việc quản lý LVTN.
- **Quyết định**: Bỏ. Responsive web thôi.

### X6. OAuth / SSO (đăng nhập Google, SSO trường)
- Phức tạp, cần tích hợp với hệ thống trường.
- Email + password đủ cho scope project.
- **Quyết định**: Bỏ.

### X7. In công bố kết quả 50%
- Thầy ghi rõ "Không cần" trong yêu cầu.
- **Quyết định**: Bỏ.

### X8. Audit log / History
- Ghi lại ai sửa gì, khi nào — hay nhưng quá phức tạp cho v1.
- **Quyết định**: Bỏ.

### X9. Multi-tenant (nhiều khoa)
- Chỉ phục vụ khoa CNTT. Không cần hỗ trợ nhiều khoa.
- **Quyết định**: Bỏ. Hardcode cho 1 khoa.

### X10. Plagiarism check / Turnitin integration
- Ngoài scope, khoa dùng tool riêng.
- **Quyết định**: Bỏ.

---

## Feature Dependencies

```
Auth & Phân quyền
├── Quản lý kỳ LVTN
│   └── Import SV từ Excel
│       └── Danh sách SV
│           └── Phân công GVHD
│               └── GVHD giao đề tài
│                   ├── Đánh giá 50%
│                   ├── Chấm điểm GVHD ──→ Export Word (Mẫu 01)
│                   ├── SV xem đề tài + In nhiệm vụ ──→ Export Word (Form)
│                   └── Phân công GVPB
│                       └── Chấm điểm GVPB ──→ Export Word (Mẫu 02)
├── Danh sách GV
│   ├── Phân công GVHD (dùng chung)
│   ├── Phân công GVPB (dùng chung)
│   └── Lập hội đồng bảo vệ
│       └── Phân công đề tài vào HĐ
│           └── Xuất danh sách bảo vệ
└── Tính điểm tổng kết (cần: điểm HD + điểm PB + điểm HĐ)
```

**Critical path** (thứ tự phải làm):
1. Auth → 2. Kỳ LVTN → 3. Import SV + Quản lý GV → 4. Phân công GVHD → 5. Giao đề tài → 6. Chấm điểm HD/PB → 7. Hội đồng → 8. Xuất danh sách

**Có thể làm song song**:
- Export Word engine có thể develop riêng, integrate sau
- Dashboard thống kê có thể làm bất cứ lúc nào
- Trang SV (xem đề tài) có thể làm sau khi có đề tài

---

## Complexity Notes

| Khu vực | Complexity | Lý do | Thời gian ước lượng |
|---------|-----------|-------|---------------------|
| Auth + Role | Trung bình | Multi-role trên 1 user, guard theo role | 3-4 ngày |
| Import Excel | Trung bình | Parse file thực tế hay bị lỗi format, cần validate kỹ | 2-3 ngày |
| Phân công GVHD | Trung bình | UI gán SV cho GV, check constraint 10 SV/GV | 2 ngày |
| Giao đề tài | Trung bình | Nhóm 1 hoặc 2 SV, GVHD tự tạo | 2 ngày |
| Chấm điểm (HD + PB) | Trung bình | Form tiêu chí, lưu điểm, 2 role tương tự | 3 ngày |
| Export Word (.docx) | **Cao** | 5 template khác nhau, fill placeholder, bảng trong Word, .doc→.docx | 4-5 ngày |
| Hội đồng + Xếp lịch | Trung bình | CRUD HĐ + gán GV + gán đề tài có thứ tự | 3 ngày |
| Xuất danh sách bảo vệ | Thấp-TB | Aggregate data, export Excel/PDF | 1-2 ngày |
| Trang SV | Thấp | Read-only + 1 nút download | 1 ngày |
| Dashboard | Thấp-TB | Query thống kê + hiển thị | 1-2 ngày |

**Tổng ước lượng**: ~22-27 ngày dev (1 người). Với deadline ~2 tháng, cần ưu tiên critical path.

### Rủi ro cao nhất
1. **Export Word** — phpoffice/phpword làm việc với .doc (cũ) hay .docx? File mẫu thầy cho là .doc → có thể cần convert sang .docx trước. Nên test sớm.
2. **Import Excel** — file thực tế từ Phòng Đào tạo có thể format khác file mẫu → cần xem file thật.
3. **Multi-role GV** — 1 user vừa là GVHD vừa là GVPB vừa là thành viên HĐ → thiết kế DB phải linh hoạt (role gắn theo context, không phải gắn cứng vào user).

---

## So sánh nhanh với hệ thống tương tự

Các hệ thống quản lý LVTN ở đại học VN (ĐH Bách Khoa, ĐH KHTN, FPT) thường có:

| Feature | Phổ biến? | TT-CD2 có? |
|---------|----------|------------|
| Import SV từ Excel | Có | ✅ |
| Phân công GVHD | Có | ✅ |
| Giao đề tài | Có | ✅ |
| Chấm điểm online | Có | ✅ |
| Export biểu mẫu Word | Ít — đa số chấm giấy | ✅ (differentiator nhẹ) |
| Lập hội đồng | Có | ✅ |
| SV đăng ký đề tài | Có (nhiều trường) | ❌ (out of scope) |
| Notification email | Có (một số) | ❌ (v2) |
| SV upload báo cáo | Có (một số) | ❌ (không yêu cầu) |
| Plagiarism check | Hiếm | ❌ |

**Nhận xét**: TT-CD2 cover đủ table stakes cho 1 khoa cỡ nhỏ-trung bình. Export Word từ template là điểm khác biệt nhỏ so với các hệ thống chỉ quản lý data mà không xuất biểu mẫu.
