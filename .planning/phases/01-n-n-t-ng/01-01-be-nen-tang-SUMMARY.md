---
phase: "01"
plan: "01"
subsystem: backend
tags: [laravel, sanctum, auth, migration, database, models]
dependency_graph:
  requires: []
  provides: [auth-api, database-schema, models]
  affects: [01-02-fe-nen-tang]
tech_stack:
  added: [laravel/sanctum]
  patterns: [Sanctum token auth, Eloquent models, Laravel migrations]
key_files:
  created:
    - backend/database/migrations/2026_04_05_000000_create_personal_access_tokens_table.php
    - backend/database/migrations/2026_04_05_000001_create_giangvien_table.php
    - backend/database/migrations/2026_04_05_000002_create_sinhvien_table.php
    - backend/database/migrations/2026_04_05_000003_create_ky_lvtn_table.php
    - backend/database/migrations/2026_04_05_000004_create_detai_table.php
    - backend/database/migrations/2026_04_05_000005_create_hoidong_table.php
    - backend/database/migrations/2026_04_05_000006_create_thanhvien_hoidong_table.php
    - backend/database/migrations/2026_04_05_000007_create_diem_hoidong_table.php
    - backend/database/migrations/2026_04_05_000008_create_cau_hinh_table.php
    - backend/database/migrations/2026_04_05_000009_add_foreign_keys.php
    - backend/app/Models/GiangVien.php
    - backend/app/Models/SinhVien.php
    - backend/app/Models/KyLvtn.php
    - backend/app/Models/DeTai.php
    - backend/app/Models/HoiDong.php
    - backend/app/Models/ThanhVienHoiDong.php
    - backend/app/Models/DiemHoiDong.php
    - backend/app/Models/CauHinh.php
    - backend/database/seeders/DatabaseSeeder.php
    - backend/config/sanctum.php
  modified:
    - backend/composer.json
    - backend/.env.example
    - backend/config/cors.php
    - backend/config/auth.php
    - backend/bootstrap/app.php
    - backend/app/Http/Controllers/AuthController.php
    - backend/routes/api.php
decisions:
  - "Dung Sanctum token auth thay vi custom middleware ApiTokenAuth"
  - "GiangVien va SinhVien la 2 model rieng biet cung implement HasApiTokens - Sanctum tu phan biet bang tokenable_type"
  - "Roles duoc tinh dong theo du lieu trong DB (DeTai, ThanhVienHoiDong), khong luu vao bang rieng"
  - "Xoa toan bo controllers/models cu va viet lai tu dau theo naming convention tieng Viet"
metrics:
  duration_minutes: 10
  completed_date: "2026-04-05"
  tasks_completed: 8
  files_created: 20
  files_modified: 7
  files_deleted: 19
---

# Phase 01 Plan 01: Backend Nen Tang Summary

Greenfield rebuild backend Laravel 12 voi Sanctum token auth, 8 bang database (+ sanctum), 8 Eloquent models theo naming tieng Viet, seeder 4 GV + 5 SV, va auth API 3 endpoints.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1.1 | Cai packages va cau hinh | b3b39ad | composer.json, cors.php, auth.php, bootstrap/app.php, .env.example, config/sanctum.php |
| 1.2 | Migration giangvien + Model GiangVien | 32d7325 | *_create_giangvien_table.php, GiangVien.php, *_create_personal_access_tokens.php |
| 1.3 | Migration sinhvien + Model SinhVien | 7e0c874 | *_create_sinhvien_table.php, SinhVien.php |
| 1.4 | Migration ky_lvtn + Model KyLvtn | 415a793 | *_create_ky_lvtn_table.php, KyLvtn.php |
| 1.5 | Migration cac bang con lai | 5d23f2b | 6 migration files, DeTai.php, HoiDong.php, ThanhVienHoiDong.php, DiemHoiDong.php, CauHinh.php |
| 2.1 | AuthController voi Sanctum | 1dc9f0f | AuthController.php |
| 2.2 | Routes api.php | 5050d75 | routes/api.php |
| 2.3 | DatabaseSeeder | b352ab5 | database/seeders/DatabaseSeeder.php |
| 2.4 | Xoa code cu, don dep | 0d8c5c0 | xoa 19 files cu |

## Schema Overview

**8 bang chinh:**
- `giangvien` - GV voi isAdmin flag
- `sinhvien` - SV voi FK toi detai va ky_lvtn
- `ky_lvtn` - Ky luan van tot nghiep voi cac moc thoi gian
- `detai` - De tai luan van (chua diem va nhan xet)
- `hoidong` - Hoi dong bao ve
- `thanhvien_hoidong` - GV trong hoi dong (enum vaiTro: ChuTich, ThuKy, UyVien)
- `diem_hoidong` - Diem cua tung GV trong HoiDong cham cho de tai
- `cau_hinh` - Cau hinh chung

**1 bang sanctum:**
- `personal_access_tokens` - Luu token Sanctum (tokenable_type = GiangVien/SinhVien)

## Auth Flow

- POST /api/login: tim user trong ca 2 bang GiangVien va SinhVien bang email, check password, tao token Sanctum
- GET /api/me: Sanctum resolve user tu tokenable_type, tra ve info + roles
- POST /api/logout: xoa currentAccessToken

**Roles logic:** Tinh dong khi login/me - check DeTai.maGV_HD, DeTai.maGV_PB, ThanhVienHoiDong.maGV. Admin check isAdmin flag. SV luon co role 'sv'.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Tao thu muc database/ tu dau**
- **Found during:** Task 1.2
- **Issue:** Backend project khong co thu muc database/ (migrations, seeders, factories). Laravel project thieu.
- **Fix:** Tao cac thu muc can thiet: database/migrations/, database/seeders/, database/factories/
- **Files modified:** N/A (thu muc moi)

**2. [Rule 3 - Blocking] Tao sanctum migration thu cong**
- **Found during:** Task 1.1
- **Issue:** Khong the chay `php artisan vendor:publish` vi PHP khong co trong PATH cua bash shell. Sanctum migration phai duoc tao thu cong.
- **Fix:** Tao file migration `2026_04_05_000000_create_personal_access_tokens_table.php` thu cong theo schema chuan cua Sanctum
- **Files modified:** database/migrations/2026_04_05_000000_create_personal_access_tokens_table.php

**3. [Rule 3 - Blocking] Tao config/sanctum.php thu cong**
- **Found during:** Task 1.1
- **Issue:** Khong the chay `php artisan vendor:publish --provider=SanctumServiceProvider` vi PHP khong co trong PATH
- **Fix:** Tao file config/sanctum.php thu cong theo config chuan Sanctum
- **Files modified:** backend/config/sanctum.php

**4. [Rule 1 - Bug] Xoa controllers cu co import models da bi xoa**
- **Found during:** Task 2.4
- **Issue:** Cac controllers cu (CouncilController, DashboardController, v.v.) van import cac models da xoa (Council, Student, Topic, Setting). Se gay loi khi Laravel load.
- **Fix:** Xoa luon cac controllers nay - se viet lai phase sau
- **Files modified:** Xoa 6 controllers cu

## Known Stubs

Khong co stubs trong plan nay - day la backend API foundation, khong co UI/data rendering.

## Threat Flags

Khong co threat surface moi ngoai plan.

## Self-Check: PASSED

**Files created exist:**
- backend/app/Models/GiangVien.php: FOUND
- backend/app/Models/SinhVien.php: FOUND
- backend/database/migrations/2026_04_05_000001_create_giangvien_table.php: FOUND
- backend/database/seeders/DatabaseSeeder.php: FOUND
- backend/routes/api.php: FOUND (3 routes)
- backend/app/Http/Controllers/AuthController.php: FOUND

**Files deleted:**
- backend/app/Models/Teacher.php: DELETED (not found - correct)
- backend/app/Models/User.php: DELETED (not found - correct)
- backend/app/Http/Middleware/ApiTokenAuth.php: DELETED (not found - correct)

**Commits exist:**
- b3b39ad: chore(01-01): cai sanctum, cau hinh cors va auth guard
- 32d7325: feat(01-01): them migration giangvien va model GiangVien
- 7e0c874: feat(01-01): them migration sinhvien va model SinhVien
- 415a793: feat(01-01): them migration ky_lvtn va model KyLvtn
- 5d23f2b: feat(01-01): them migrations va models detai, hoidong, thanhvien, diem, cauhinh
- 1dc9f0f: feat(01-01): viet lai AuthController dung Sanctum token
- 5050d75: feat(01-01): viet lai routes api.php chi con 3 auth routes
- b352ab5: feat(01-01): them DatabaseSeeder voi 4 GV va 5 SV
- 0d8c5c0: chore(01-01): xoa code cu (models/controllers/middleware cu)
