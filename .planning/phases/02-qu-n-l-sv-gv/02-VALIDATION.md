---
phase: 2
slug: qu-n-l-sv-gv
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-07
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | PHPUnit (Laravel built-in) + Vitest (React) |
| **Config file** | `phpunit.xml` / `vite.config.js` |
| **Quick run command** | `php artisan test --filter=Phase2` |
| **Full suite command** | `php artisan test && npm run test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `php artisan test --filter=Phase2`
- **After every plan wave:** Run `php artisan test && npm run test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-BE-01 | BE | 1 | SV-01, SV-02 | feature | `php artisan test --filter=StudentImportTest` | ❌ W0 | ⬜ pending |
| 2-BE-02 | BE | 1 | SV-03 | feature | `php artisan test --filter=StudentCrudTest` | ❌ W0 | ⬜ pending |
| 2-BE-03 | BE | 1 | GV-01, GV-02 | feature | `php artisan test --filter=LecturerCrudTest` | ❌ W0 | ⬜ pending |
| 2-BE-04 | BE | 1 | KY-01, KY-02, KY-03 | feature | `php artisan test --filter=KyLvtnTest` | ❌ W0 | ⬜ pending |
| 2-FE-01 | FE | 2 | SV-01 | manual | — | — | ⬜ pending |
| 2-FE-02 | FE | 2 | SV-03 | manual | — | — | ⬜ pending |
| 2-FE-03 | FE | 2 | GV-01 | manual | — | — | ⬜ pending |
| 2-FE-04 | FE | 2 | KY-01, KY-02 | manual | — | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/Feature/StudentImportTest.php` — stubs for SV-01, SV-02
- [ ] `tests/Feature/StudentCrudTest.php` — stubs for SV-03
- [ ] `tests/Feature/LecturerCrudTest.php` — stubs for GV-01, GV-02
- [ ] `tests/Feature/KyLvtnTest.php` — stubs for KY-01, KY-02, KY-03
- [ ] `tests/fixtures/du_lieu_sv_valid.xlsx` — file Excel mẫu 5 dòng hợp lệ
- [ ] `tests/fixtures/du_lieu_sv_error.xlsx` — file Excel có MSSV trùng ở dòng 3

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Preview danh sách SV trước khi confirm import | SV-01 | UI interaction | Upload file → xem preview → click Confirm → kiểm tra DB |
| Lỗi import hiển thị theo dòng trên UI | SV-01 | UI rendering | Upload file lỗi → kiểm tra lỗi hiện đúng dòng |
| Filter lớp + search trên bảng SV | SV-03 | UI interaction | Nhập text vào filter → bảng cập nhật đúng |
| Form thêm/sửa GV hoạt động | GV-01 | UI form | Mở modal → nhập info → submit → GV xuất hiện trong bảng |
| Form kỳ LVTN lưu đúng 4 mốc ngày | KY-01 | Date picker UI | Nhập 4 ngày → save → reload → kiểm tra ngày đúng |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
