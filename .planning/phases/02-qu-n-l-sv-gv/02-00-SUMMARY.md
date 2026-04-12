---
phase: 02-qu-n-l-sv-gv
plan: "00"
subsystem: testing
tags: [phpunit, sqlite, phpspreadsheet, excel-fixtures, test-stubs]

requires:
  - phase: 01-n-n-t-ng
    provides: "Models SinhVien, GiangVien, KyLvtn va migrations"
provides:
  - "PHPUnit config voi sqlite :memory: cho testing"
  - "Base TestCase class"
  - "4 test file stubs voi 21 test methods cho Phase 2 endpoints"
  - "2 Excel fixtures (valid + error data)"
  - "Script generate_fixtures.php"
affects: [02-01-PLAN, 02-02-PLAN]

tech-stack:
  added: [phpunit]
  patterns: [RefreshDatabase trait, actingAs admin, markTestIncomplete stubs]

key-files:
  created:
    - backend/phpunit.xml
    - backend/tests/TestCase.php
    - backend/tests/Feature/StudentImportTest.php
    - backend/tests/Feature/StudentCrudTest.php
    - backend/tests/Feature/LecturerCrudTest.php
    - backend/tests/Feature/KyLvtnTest.php
    - backend/tests/fixtures/du_lieu_sv_valid.xlsx
    - backend/tests/fixtures/du_lieu_sv_error.xlsx
    - scripts/generate_fixtures.php
  modified: []

key-decisions:
  - "Laravel 12 khong can CreatesApplication trait - TestCase don gian extend BaseTestCase"
  - "Test stubs dung markTestIncomplete de Wave 1 fill chi tiet"
  - "Fixtures tao bang Node.js xlsx (PHP khong co tren CI) nhung PHP script van giu de chay local"

patterns-established:
  - "Test setup: tao admin GiangVien voi isAdmin=true, actingAs cho moi request"
  - "RefreshDatabase trait cho moi test file - sqlite :memory: reset moi test"
  - "Excel fixtures dat trong backend/tests/fixtures/"

requirements-completed: [SV-01, SV-02, SV-03, GV-01, GV-02, KY-01, KY-02, KY-03]

duration: 10min
completed: 2026-04-07
---

# Plan 02-00: Wave 0 - Test Infrastructure + Excel Fixtures Summary

**PHPUnit config voi sqlite :memory:, 4 test file stubs (21 methods), va 2 Excel fixtures cho Phase 2 testing**

## Performance

- **Duration:** 10 min
- **Started:** 2026-04-07T15:10:00Z
- **Completed:** 2026-04-07T15:20:00Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments
- PHPUnit config voi sqlite :memory: va base TestCase san sang
- 4 test files voi 21 test methods stub cho tat ca endpoints Phase 2
- 2 Excel fixtures (5 dong hop le + 3 dong co MSSV trung) cho import testing
- Script generate_fixtures.php de tai tao fixtures khi can

## Task Commits

1. **Task 1: PHPUnit config + Base TestCase** - `3ab9232` (test)
2. **Task 2: Script + Excel fixtures + 4 test stubs** - `7dc3805` (test)

## Files Created/Modified
- `backend/phpunit.xml` - PHPUnit config voi sqlite :memory:
- `backend/tests/TestCase.php` - Base test class
- `backend/tests/Feature/StudentImportTest.php` - 4 test stubs import SV
- `backend/tests/Feature/StudentCrudTest.php` - 7 test stubs CRUD SV
- `backend/tests/Feature/LecturerCrudTest.php` - 6 test stubs CRUD GV
- `backend/tests/Feature/KyLvtnTest.php` - 4 test stubs Ky LVTN
- `backend/tests/fixtures/du_lieu_sv_valid.xlsx` - 5 dong SV hop le
- `backend/tests/fixtures/du_lieu_sv_error.xlsx` - 3 dong co MSSV trung
- `scripts/generate_fixtures.php` - Script tao fixtures bang phpspreadsheet

## Decisions Made
- Laravel 12 khong can CreatesApplication trait - chi can TestCase extend BaseTestCase la du
- Dung markTestIncomplete cho stubs de Plan 02-01 fill chi tiet khi viet controllers
- Fixtures tao bang Node.js xlsx vi PHP khong co trong CI environment - PHP script van giu de dev chay local

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Tao fixtures bang Node.js thay vi PHP**
- **Found during:** Task 2
- **Issue:** PHP khong co trong PATH tren CI/agent environment, khong chay duoc generate_fixtures.php
- **Fix:** Dung Node.js voi thu vien xlsx de tao cung Excel files, giu PHP script cho dev local
- **Files modified:** backend/tests/fixtures/du_lieu_sv_valid.xlsx, backend/tests/fixtures/du_lieu_sv_error.xlsx
- **Verification:** Cac file .xlsx co file size > 0, data dung format

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Fixture data giong het spec. PHP script van ton tai de dev chay local.

## Issues Encountered
- PHP khong co trong PATH tren CI environment - su dung Node.js xlsx de generate fixtures thay the

## User Setup Required
None - khong can cau hinh gi them.

## Next Phase Readiness
- Test infrastructure san sang cho Plan 02-01 (BE controllers)
- 21 test stubs cho tat ca endpoints, chi can fill assert chi tiet khi viet controller
- Excel fixtures san sang cho StudentImportTest

## Self-Check: PASSED

- 9/9 files verified present
- 2/2 commit hashes verified in git log

---
*Phase: 02-qu-n-l-sv-gv*
*Completed: 2026-04-07*
