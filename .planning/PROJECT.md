# TT-CD2 — Hệ thống Quản lý Luận văn Tốt nghiệp

## What This Is

Ứng dụng web quản lý toàn bộ quy trình luận văn tốt nghiệp (LVTN) của Khoa CNTT — Trường ĐH Công Nghệ Sài Gòn (STU). Hệ thống phục vụ 4 vai trò: Thư ký khoa (Admin), Giảng viên hướng dẫn (GVHD), Giảng viên phản biện (GVPB), và Sinh viên. Tech stack: Laravel 12 backend + React frontend, MySQL database, deploy lên hosting với domain riêng.

## Core Value

Thư ký khoa có thể quản lý toàn bộ vòng đời LVTN — từ import danh sách SV đến xuất danh sách bảo vệ — mà không cần thao tác thủ công qua Excel/email.

## Requirements

### Validated

(None yet — ship to validate)

### Active

**Auth & Phân quyền**
- [ ] Đăng nhập bằng email + password với 4 role: admin, gvhd, gvpb, sv
- [ ] Mỗi role thấy đúng menu và chức năng của mình
- [ ] Session persist sau reload

**Thư ký — Quản lý kỳ LVTN**
- [ ] Tạo và quản lý kỳ LVTN (tên kỳ, các mốc thời gian: nhận đề tài, chấm 50%, phản biện, bảo vệ)
- [ ] Import danh sách SV từ file Excel (MSSV, tên, lớp, email)
- [ ] Phân công SV cho GVHD — tối đa 10 SV/GV, hỗ trợ cả manual và auto assign

**Thư ký — Phân công & Hội đồng**
- [ ] Phân công GVPB cho từng đề tài (sau khi GVHD giao đề tài)
- [ ] Lập hội đồng bảo vệ: ngày, phòng, số hội đồng, danh sách 3-4 GV (1 chủ tịch + 1 thư ký + 1-2 thành viên)
- [ ] Phân công đề tài vào hội đồng có thứ tự trình bày
- [ ] Xuất danh sách bảo vệ LVTN (SV, đề tài, hội đồng, thời gian, phòng)

**GVHD**
- [ ] Xem danh sách SV được phân công hướng dẫn
- [ ] Giao đề tài LVTN (1 hoặc 2 SV/đề tài — tên đề tài, mô tả, mục tiêu, output)
- [ ] Chấm điểm 50% (đánh giá giữa kỳ) với form tiêu chí
- [ ] Chấm điểm hướng dẫn và xuất file Word (Mẫu 01.01 cho nhóm, 01.02 cho cá nhân)

**GVPB**
- [ ] Xem danh sách đề tài phản biện
- [ ] Chấm điểm phản biện và xuất file Word (Mẫu 02.01 cho nhóm, 02.02 cho cá nhân)

**Sinh viên**
- [ ] Xem thông tin đề tài của mình
- [ ] Xuất/in tờ nhiệm vụ LVTN (Form_NhiemvuLVTN.doc — 2 template: 1SV và 2SV)

**Tính điểm**
- [ ] Tự động tính điểm tổng kết theo công thức: 20% HD + 20% PB + 60% HĐ
- [ ] Điểm HĐ = trung bình cộng điểm các thành viên hội đồng (làm tròn theo quy chế)

### Out of Scope

- Chấm điểm hội đồng (trong buổi bảo vệ) — chưa có trong yêu cầu thầy, thêm sau nếu cần
- Real-time concurrency khi nhiều GV chấm điểm cùng lúc — phức tạp, dùng page refresh thay thế
- In công bố kết quả 50% — thầy ghi "Không cần"
- Sinh viên tự đăng ký đề tài online — SV đăng ký qua link PDT, khoa chỉ import file kết quả
- Mobile app — web-first, responsive là đủ
- OAuth/SSO login — email + password đủ cho v1
- Notification email tự động — thêm sau nếu cần

## Context

- **Đây là đồ án tốt nghiệp thật** — khoa CNTT STU sẽ thực sự dùng, cần deploy và ổn định
- **Giảng viên hướng dẫn**: Thầy Trần Văn Hùng (fitstu.net) — đã confirm tech stack React + Laravel
- **Deadline**: Dưới 2 tháng — ưu tiên hoàn thành core flow trước, polish sau
- **Developer**: Mới bắt đầu với Laravel — cần code tự nhiên kiểu sinh viên, không over-engineer
- **File mẫu Word**: Đã có trong `docs/huong_dan/huong_dan/` — cần map đúng fields khi export
- **File Excel mẫu**: `Chốt_DSSV_GVHD_TenDeTai_LVTN_Dot2_17112025.xlsx` — import format từ đây
- **Công thức điểm**: 20% HD + 20% PB + 60% HĐ (đã confirm với thầy)
- **Một GV có thể đảm nhiều vai trò** cùng lúc (GVHD nhóm A, GVPB nhóm B, thành viên HĐ nhóm C) — RBAC phải xử lý đúng

## Constraints

- **Tech Stack**: Laravel 12 (API) + React (SPA) + MySQL — đã confirm với thầy
- **Hosting**: Thầy hỗ trợ hosting, cần mua domain (.io.vn hoặc .id.vn)
- **Packages**: maatwebsite/excel (import/export Excel), phpoffice/phpword (export Word từ template .doc)
- **Timeline**: Dưới 2 tháng — không có thời gian để refactor hoặc thay đổi architecture
- **Code style**: Phải trông như sinh viên viết — không quá clean, không dùng design pattern phức tạp
- **Anti-AI**: Không để lại bất kỳ dấu vết AI nào trong code/docs/commit

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Laravel 12 API + React SPA | Thầy confirm dùng React (PA2) | — Pending |
| maatwebsite/excel cho import | Package phổ biến nhất cho Laravel Excel | — Pending |
| phpoffice/phpword cho export Word | Chuẩn nhất cho fill template .docx trong PHP | — Pending |
| Auth bằng Laravel Sanctum (SPA) | Token-based auth phù hợp với React SPA | — Pending |
| Blade thuần cho admin panel (option) | Nếu React quá phức tạp trong thời gian ngắn, fallback về Blade | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-03 after initialization*
