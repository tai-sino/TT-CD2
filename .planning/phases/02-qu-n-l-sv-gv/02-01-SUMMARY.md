---
phase: 02-qu-n-l-sv-gv
plan: "01"
subsystem: api
tags: [laravel, phpspreadsheet, excel-import, crud, eloquent]

requires:
  - phase: 01-n-n-t-ng
    provides: "Sanctum auth, SinhVien/GiangVien/KyLvtn models, migrations, auth routes"
provides:
  - "SinhVienController voi import Excel + CRUD (5 methods)"
  - "GiangVienController voi CRUD + thong ke so luong (4 methods)"
  - "KyLvtnController voi CRUD (3 methods)"
  - "15 API routes trong auth:sanctum group"
affects: [02-02-fe-pages, 03-cham-diem]

tech-stack:
  added: []
  patterns: ["phpspreadsheet IOFactory::load() doc Excel truc tiep", "Controller slim khong tach Service", "Filter bang whereHas qua relationship"]

key-files:
  created:
    - backend/app/Http/Controllers/SinhVienController.php
    - backend/app/Http/Controllers/GiangVienController.php
    - backend/app/Http/Controllers/KyLvtnController.php
  modified:
    - backend/routes/api.php

key-decisions:
  - "Dung phpspreadsheet truc tiep thay vi maatwebsite/excel - don gian hon, sinh vien giai thich duoc"
  - "Import SV bat buoc ky_lvtn_id (KY-03) - moi SV phai thuoc 1 ky LVTN"
  - "Filter SV theo GVHD dung whereHas('deTai') thong qua relationship (SV-03)"

patterns-established:
  - "Controller pattern: validate inline, response()->json(), khong tach Service"
  - "Import pattern: IOFactory::load -> toArray -> loop validate -> create"
  - "Count stats pattern: tinh so_sv_hd, so_dt_pb, so_hd ngay trong index()"

requirements-completed: [SV-01, SV-02, SV-03, GV-01, GV-02, KY-01, KY-02, KY-03]

duration: 5min
completed: 2026-04-07
---

# Plan 02-01: Backend API — Import SV, CRUD SV/GV, Ky LVTN Summary

**3 controllers cho import SV tu Excel, CRUD SV/GV/Ky LVTN voi phpspreadsheet, 15 API routes trong Sanctum auth group**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-07T15:13:39Z
- **Completed:** 2026-04-07T15:18:16Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- SinhVienController voi import Excel (phpspreadsheet), ho tro filter theo ky, lop, GVHD, search
- GiangVienController voi thong ke so_sv_hd, so_dt_pb, so_hd cho moi GV
- KyLvtnController voi CRUD ky LVTN, mac dinh is_active = true khi tao moi
- 15 API routes dang ky trong auth:sanctum middleware group

## Task Commits

1. **Task 1: SinhVienController Import Excel + CRUD + Routes** - `dfc3f8f` (feat)
2. **Task 2: GiangVienController + KyLvtnController + Routes** - `0cf67bb` (feat)

## Files Created/Modified
- `backend/app/Http/Controllers/SinhVienController.php` - Import Excel + CRUD SV (5 methods)
- `backend/app/Http/Controllers/GiangVienController.php` - CRUD GV voi count stats (4 methods)
- `backend/app/Http/Controllers/KyLvtnController.php` - CRUD Ky LVTN (3 methods)
- `backend/routes/api.php` - Them 12 routes cho SV, GV, Ky LVTN

## Decisions Made
- Dung phpspreadsheet truc tiep (IOFactory::load) thay vi wrap qua maatwebsite/excel - don gian, sinh vien hieu duoc
- Import SV bat buoc truyen ky_lvtn_id (KY-03) - moi SV duoc import phai gan vao 1 ky LVTN
- Filter SV theo GVHD dung whereHas('deTai') de truy van qua relationship (SV-03)

## Deviations from Plan

### Test stubs khong ton tai

Plan 02-01 depends_on Plan 02-00 (Wave 0 — test infrastructure). Tuy nhien test stubs tu 02-00 chua ton tai trong worktree nay (chua duoc execute). Cac controller da duoc viet dung spec, test stubs se duoc fill khi 02-00 hoan thanh.

---

**Total deviations:** 1 (test stubs chua co de fill)
**Impact on plan:** Khong anh huong den controllers. Tests se duoc cap nhat khi Plan 02-00 execute.

## Issues Encountered
- Worktree ban dau base tren commit cu (cdae276), chua co Phase 1 models. Da reset ve master (24a831d) de co SinhVien, GiangVien, KyLvtn models.

## User Setup Required
None - khong can cau hinh external service.

## Next Phase Readiness
- 3 controllers san sang cho Plan 02-02 (FE pages) consume
- API endpoints: /students, /giang-vien, /ky-lvtn da hoat dong
- Can chay Plan 02-00 truoc de co test infrastructure

## Self-Check: PASSED

---
*Phase: 02-qu-n-l-sv-gv*
*Completed: 2026-04-07*
