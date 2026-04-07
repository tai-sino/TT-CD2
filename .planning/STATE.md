---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: — Demo Ready
status: in-progress
last_updated: "2026-04-07T15:30:00Z"
progress:
  total_phases: 6
  completed_phases: 1
  total_plans: 5
  completed_plans: 4
---

# STATE: TT-CD2 — Hệ thống Quản lý Luận văn Tốt nghiệp

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-03)

**Core value:** Thư ký khoa quản lý toàn bộ vòng đời LVTN mà không cần Excel/email thủ công
**Current focus:** Phase 02 — qu-n-l-sv-gv

---

## Current Status

**Phase:** Phase 02 dang thuc hien — plan 00 va 01 hoan thanh, con plan 02 (FE)
**Milestone:** v1.0 — Demo Ready (target ~2026-05-25)

### Planning Artifacts

| File | Status |
|------|--------|
| .planning/PROJECT.md | ✓ Complete |
| .planning/config.json | ✓ Complete |
| .planning/REQUIREMENTS.md | ✓ Complete (48 requirements) |
| .planning/ROADMAP.md | ✓ Complete (6 phases) |
| .planning/research/STACK.md | ✓ Complete |
| .planning/research/FEATURES.md | ✓ Complete |
| .planning/research/ARCHITECTURE.md | ✓ Complete |
| .planning/research/PITFALLS.md | ✓ Complete |
| .planning/research/SUMMARY.md | ✓ Complete |

### Phase Progress

| Phase | Name | Status | Plans |
|-------|------|--------|-------|
| 1 | Nền tảng & Refactor | ✓ Complete | 2/2 done |
| 2 | Import SV & Phân công GVHD | ▶ In Progress | 2/3 done |
| 3 | Chấm điểm & Export Word | ○ Pending | — |
| 4 | Hội đồng & Phân công PB | ○ Pending | — |
| 5 | SV Portal & Điểm tổng kết | ○ Pending | — |
| 6 | Deploy & Polish | ○ Pending | — |

---

## Completed Plans

| Plan | Name | Commit Range | Summary |
|------|------|-------------|---------|
| 01-01 | BE Nen Tang | b3b39ad → 0d8c5c0 | Sanctum auth, 8 bang DB, 8 models, 3 API routes, seeder |
| 01-02 | FE Nen Tang | cd0af21 → bc08242 | React 19 + react-router v7, AuthContext, LoginPage, Sidebar, 15 placeholder pages |
| 02-00 | Test Infrastructure | 3ab9232 → 7dc3805 | PHPUnit config, 4 test stubs (21 methods), 2 Excel fixtures |
| 02-01 | BE API SV/GV/Ky | dfc3f8f → 0cf67bb | 3 controllers (SinhVien, GiangVien, KyLvtn), 15 API routes, import Excel |

---

## Decisions

1. Dung Sanctum token auth thay vi custom middleware ApiTokenAuth
2. GiangVien va SinhVien la 2 model rieng biet cung implement HasApiTokens - Sanctum tu phan biet bang tokenable_type
3. Roles duoc tinh dong theo du lieu trong DB (DeTai, ThanhVienHoiDong), khong luu vao bang rieng
4. Xoa toan bo controllers/models cu va viet lai tu dau theo naming convention tieng Viet

---
- [Phase 01]: Dung react-router v7 thay react-router-dom v6 - import tu react-router khong phai react-router-dom
- [Phase 01]: useAuth nam trong AuthContext.jsx, khong tach hook rieng - don gian hon
- [Phase 02]: Dung phpspreadsheet truc tiep (IOFactory::load) thay vi maatwebsite/excel - don gian, sinh vien hieu duoc
- [Phase 02]: Import SV bat buoc ky_lvtn_id (KY-03), filter SV theo GVHD dung whereHas('deTai') (SV-03)
- [Phase 02]: Laravel 12 khong can CreatesApplication trait - TestCase don gian extend BaseTestCase
- [Phase 02]: Test stubs dung markTestIncomplete de Wave 1 fill chi tiet

## Next Action

Tiep tuc Phase 02: Plan 02-02 (FE pages SinhVien, GiangVien, CaiDat)

---

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 01 | 01 | 10 min | 8 | 27 |
| 01 | 02 | 6 min | 7 | 35 |
| 02 | 00 | 10 min | 2 | 9 |
| 02 | 01 | 5 min | 2 | 4 |

---
*Last session: 2026-04-07 — Completed 02-00 (Test Infrastructure) and 02-01 (BE API SV/GV/Ky)*
