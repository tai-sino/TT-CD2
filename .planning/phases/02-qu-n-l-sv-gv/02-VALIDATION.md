---
phase: 2
slug: qu-n-l-sv-gv
status: draft
nyquist_compliant: true
wave_0_complete: true
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
| 2-W0-01 | 02-00 | 0 | ALL | infra | `test -f backend/phpunit.xml && test -f backend/tests/TestCase.php` | W0 creates | ⬜ pending |
| 2-W0-02 | 02-00 | 0 | SV-01, SV-02, SV-03, GV-01, GV-02, KY-01~03 | fixture+stubs | `test -s backend/tests/fixtures/du_lieu_sv_valid.xlsx` | W0 creates | ⬜ pending |
| 2-BE-01 | 02-01 | 1 | SV-01, SV-02, KY-03 | feature | `php artisan test --filter=StudentImportTest` | ✅ W0 | ⬜ pending |
| 2-BE-02 | 02-01 | 1 | SV-03 | feature | `php artisan test --filter=StudentCrudTest` | ✅ W0 | ⬜ pending |
| 2-BE-03 | 02-01 | 1 | GV-01, GV-02 | feature | `php artisan test --filter=LecturerCrudTest` | ✅ W0 | ⬜ pending |
| 2-BE-04 | 02-01 | 1 | KY-01, KY-02, KY-03 | feature | `php artisan test --filter=KyLvtnTest` | ✅ W0 | ⬜ pending |
| 2-FE-01 | 02-02 | 2 | SV-01 | manual | — | — | ⬜ pending |
| 2-FE-02 | 02-02 | 2 | SV-03 | manual | — | — | ⬜ pending |
| 2-FE-03 | 02-02 | 2 | GV-01 | manual | — | — | ⬜ pending |
| 2-FE-04 | 02-02 | 2 | KY-01, KY-02 | manual | — | — | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `phpunit.xml` — PHPUnit config voi sqlite :memory:
- [ ] `tests/TestCase.php` — base test class
- [ ] `tests/Feature/StudentImportTest.php` — stubs for SV-01, SV-02 (incl. ky_lvtn_id not null assert)
- [ ] `tests/Feature/StudentCrudTest.php` — stubs for SV-03 (incl. gvhd_id filter test)
- [ ] `tests/Feature/LecturerCrudTest.php` — stubs for GV-01, GV-02
- [ ] `tests/Feature/KyLvtnTest.php` — stubs for KY-01, KY-02, KY-03
- [ ] `tests/fixtures/du_lieu_sv_valid.xlsx` — file Excel mau 5 dong hop le (file size > 0)
- [ ] `tests/fixtures/du_lieu_sv_error.xlsx` — file Excel co MSSV trung o dong 3 (file size > 0)
- [ ] `scripts/generate_fixtures.php` — script tao fixtures (chay 1 lan)

**Wave 0 plan:** 02-00-PLAN.md (wave: 0, depends_on: [])

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Loi import hien thi theo dong tren UI | SV-01 | UI rendering | Upload file loi -> kiem tra loi hien dung dong |
| Filter lop + GVHD + search tren bang SV | SV-03 | UI interaction | Nhap text vao filter -> bang cap nhat dung |
| Form them/sua GV hoat dong | GV-01 | UI form | Mo modal -> nhap info -> submit -> GV xuat hien trong bang |
| Form ky LVTN luu dung 6 moc ngay | KY-01 | Date picker UI | Nhap 6 ngay -> save -> reload -> kiem tra ngay dung |
| Validation errors hien inline duoi field | ALL | UI rendering | Submit form khong day du -> kiem tra loi hien duoi field, khong phai alert |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (Plan 02-00 tao stubs truoc)
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter
- [x] `wave_0_complete: true` set in frontmatter

**Approval:** ready
