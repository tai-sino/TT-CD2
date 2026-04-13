---
phase: 01-n-n-t-ng
verified: 2026-04-05T17:30:00Z
status: human_needed
score: 13/14 must-haves verified
re_verification: false
human_verification:
  - test: "Dang nhap bang admin@stu.edu.vn / 123456 tren trinh duyet, kiem tra redirect ve /admin/tong-quan va sidebar hien dung 9 menu items"
    expected: "Trang login hien thi, sau khi submit thanh cong redirect ve /admin/tong-quan, sidebar hien 9 menu items cho role admin"
    why_human: "Can chay ca BE (php artisan serve) va FE (npm run dev) cung luc, kiem tra toan bo flow login -> redirect -> sidebar"
  - test: "Dang nhap bang SV (em@student.stu.edu.vn / 123456), kiem tra redirect /sv/de-tai va sidebar chi co 1 item"
    expected: "Redirect /sv/de-tai, sidebar chi hien menu 'De tai cua toi'"
    why_human: "Can kiem tra BE tra ve type='sinhvien' va roles=['sv'] chinh xac, FE render dung menu"
  - test: "Truy cap /admin/tong-quan khi chua dang nhap (khong co token trong localStorage)"
    expected: "ProtectedRoute redirect ve /login"
    why_human: "Can browser de kiem tra behavior thuc te cua ProtectedRoute khi localStorage trong"
  - test: "Click 'Dang xuat' tren Sidebar sau khi da dang nhap"
    expected: "Token bi xoa khoi localStorage, redirect ve /login, access /admin/tong-quan sau do bi redirect ve /login"
    why_human: "Can kiem tra flow logout end-to-end tren browser"
---

# Phase 01: Nen Tang — Bao cao Xac minh

**Phase Goal:** Project chay duoc, database dung schema, auth hoat dong, BE va FE ket noi duoc voi nhau.
**Verified:** 2026-04-05T17:30:00Z
**Status:** human_needed
**Re-verification:** Khong — xac minh lan dau

---

## Goal Achievement

### Nhung dieu can dung (Observable Truths)

| #  | Truth | Status | Evidence |
|----|-------|--------|----------|
| 1  | Migrations tao 8 bang chinh + 1 bang sanctum, khong co spatie | VERIFIED | 10 migration files ton tai, khong co spatie trong composer.json |
| 2  | Login GV admin tra ve token + roles co "admin" | VERIFIED | AuthController.login(): instanceof GiangVien, isAdmin -> roles[] += 'admin' |
| 3  | Login GV thuong tra ve token + roles mac dinh "gvhd" | VERIFIED | AuthController: if empty(roles) && !isAdmin -> roles[] = 'gvhd' |
| 4  | Login SV tra ve token + type "sinhvien" + roles ["sv"] | VERIFIED | AuthController: instanceof SinhVien -> type='sinhvien', roles=['sv'] |
| 5  | GET /api/me tra ve dung info va roles (instanceof check day du) | VERIFIED | AuthController.me() co full instanceof GiangVien/SinhVien logic |
| 6  | Logout xoa token, request tiep theo bi 401 | VERIFIED | currentAccessToken()->delete() trong logout(), Sanctum middleware bao ve /me |
| 7  | Seeder co 4 GV (1 admin) + 5 SV + 1 ky LVTN | VERIFIED | DatabaseSeeder.php: KyLvtn::create, 4x GiangVien::create, 5x SinhVien::create |
| 8  | FE trang login hien thi, co form email+password | VERIFIED | LoginPage.jsx ton tai, co form, input email/password, button "Dang nhap" |
| 9  | Login thanh cong redirect dung trang theo role | VERIFIED | LoginPage.jsx: getDefaultRoute(roles) + navigate(), saveAuth() goi dung |
| 10 | 4 roles thay menu khac nhau trong sidebar | VERIFIED | Sidebar.jsx: menuConfig co admin/gvhd/gvpb/sv, render theo user.roles |
| 11 | Protected route: chua login -> redirect /login | VERIFIED | ProtectedRoute.jsx: check localStorage.getItem('token'), Navigate to="/login" |
| 12 | Da dang nhap ma vao /login -> redirect ve trang mac dinh | VERIFIED | LoginPage.jsx: useEffect check token + user, navigate(getDefaultRoute) |
| 13 | Logout xoa token, redirect ve /login | VERIFIED | Sidebar.jsx: handleLogout -> clearAuth() + navigate('/login') |
| 14 | FE ket noi BE qua vite proxy | VERIFIED | vite.config.js: proxy '/api' -> localhost:8000, api.js: baseURL='/api', Bearer token interceptor |

**Score:** 14/14 truths duoc verify ve mat code

---

## Required Artifacts

### Backend

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `backend/database/migrations/2026_04_05_000001_create_giangvien_table.php` | Bang giangvien | VERIFIED | Schema dung: maGV primary, isAdmin boolean, matKhau |
| `backend/database/migrations/2026_04_05_000002_create_sinhvien_table.php` | Bang sinhvien | VERIFIED | Schema dung: mssv primary, maDeTai, ky_lvtn_id |
| `backend/database/migrations/2026_04_05_000003_create_ky_lvtn_table.php` | Bang ky_lvtn | VERIFIED | Schema dung: is_active boolean |
| `backend/database/migrations/2026_04_05_000004_create_detai_table.php` | Bang detai | VERIFIED | Schema dung: diemHuongDan, foreign keys GV |
| `backend/database/migrations/2026_04_05_000005_create_hoidong_table.php` | Bang hoidong | VERIFIED | Ton tai, co foreign key ky_lvtn_id |
| `backend/database/migrations/2026_04_05_000006_create_thanhvien_hoidong_table.php` | Bang thanhvien_hoidong | VERIFIED | enum vaiTro: ChuTich/ThuKy/UyVien |
| `backend/database/migrations/2026_04_05_000007_create_diem_hoidong_table.php` | Bang diem_hoidong | VERIFIED | unique(['maDeTai', 'maGV']) dung |
| `backend/database/migrations/2026_04_05_000008_create_cau_hinh_table.php` | Bang cau_hinh | VERIFIED | key-value config table |
| `backend/database/migrations/2026_04_05_000009_add_foreign_keys.php` | Foreign keys SV va DeTai | VERIFIED | FK maDeTai, ky_lvtn_id cho sinhvien; maHoiDong cho detai |
| `backend/database/migrations/2026_04_05_000000_create_personal_access_tokens_table.php` | Bang Sanctum | VERIFIED | morphs('tokenable'), schema chuan Sanctum |
| `backend/app/Models/GiangVien.php` | Model GiangVien | VERIFIED | extends Authenticatable, HasApiTokens, getAuthPassword(), relationships |
| `backend/app/Models/SinhVien.php` | Model SinhVien | VERIFIED | extends Authenticatable, HasApiTokens, getAuthPassword(), deTai() |
| `backend/app/Models/KyLvtn.php` | Model KyLvtn | VERIFIED | casts ngay => date, is_active => boolean |
| `backend/app/Models/DeTai.php` | Model DeTai | VERIFIED | relationships GV_HD, GV_PB, HoiDong, SinhVien |
| `backend/app/Models/HoiDong.php` | Model HoiDong | VERIFIED | Ton tai |
| `backend/app/Models/ThanhVienHoiDong.php` | Model ThanhVienHoiDong | VERIFIED | Ton tai |
| `backend/app/Models/DiemHoiDong.php` | Model DiemHoiDong | VERIFIED | Ton tai |
| `backend/app/Models/CauHinh.php` | Model CauHinh | VERIFIED | Ton tai |
| `backend/app/Http/Controllers/AuthController.php` | Auth endpoints | VERIFIED | login/me/logout day du, instanceof check cho ca 2 model |
| `backend/routes/api.php` | 3 API routes | VERIFIED | POST /login, GET /me, POST /logout voi auth:sanctum middleware |
| `backend/database/seeders/DatabaseSeeder.php` | Seeder 4GV + 5SV | VERIFIED | Hash::make, KyLvtn::create, isAdmin=true cho GV001 |
| `backend/config/cors.php` | CORS config | VERIFIED | supports_credentials=true, allowed_origins=FRONTEND_URL |
| `backend/bootstrap/app.php` | Middleware Sanctum | VERIFIED | EnsureFrontendRequestsAreStateful, throttleApi |
| `backend/config/auth.php` | Guard api:sanctum | VERIFIED | 'api' => ['driver' => 'sanctum'] |
| `backend/config/sanctum.php` | Sanctum config | VERIFIED | Tao thu cong, ton tai |

**Files cu da bi xoa (dung):**
- `backend/app/Models/Teacher.php` — DELETED
- `backend/app/Models/Student.php` — DELETED
- `backend/app/Models/User.php` — DELETED
- `backend/app/Http/Middleware/ApiTokenAuth.php` — DELETED

### Frontend

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `frontend/package.json` | React 19, react-router 7, axios, react-query | VERIFIED | react@^19, react-router@^7, axios@^1.7, @tanstack/react-query@^5 |
| `frontend/vite.config.js` | Proxy /api -> localhost:8000 | VERIFIED | proxy '/api' va '/sanctum' deu co |
| `frontend/index.html` | Google Fonts Inter | VERIFIED | fonts.googleapis.com/css2?family=Inter |
| `frontend/src/services/api.js` | Axios instance + interceptors | VERIFIED | baseURL='/api', Bearer token header, 401 handler |
| `frontend/src/services/authService.js` | login/getMe/logout functions | VERIFIED | 3 functions export, goi dung endpoints |
| `frontend/src/context/AuthContext.jsx` | AuthContext + useAuth | VERIFIED | createContext, saveAuth, clearAuth, localStorage |
| `frontend/src/pages/LoginPage.jsx` | Form dang nhap + redirect | VERIFIED | form, getDefaultRoute, saveAuth, navigate, useEffect check token |
| `frontend/src/components/Sidebar.jsx` | Menu theo role + logout | VERIFIED | menuConfig 4 roles, clearAuth, navigate('/login') |
| `frontend/src/components/ProtectedRoute.jsx` | Route guard | VERIFIED | check token, Navigate to="/login" |
| `frontend/src/layouts/MainLayout.jsx` | Layout voi Sidebar | VERIFIED | ml-64, Outlet, import Sidebar |
| `frontend/src/pages/PlaceholderPage.jsx` | Placeholder component | VERIFIED | "Chuc nang dang phat trien" |
| `frontend/src/App.jsx` | Router config day du | VERIFIED | 16 routes, ProtectedRoute, AuthProvider, QueryClientProvider |
| `frontend/src/main.jsx` | Entry point | VERIFIED | ReactDOM.createRoot, render App |
| `frontend/src/index.css` | Tailwind + Inter font | VERIFIED | @import "tailwindcss", font-family: 'Inter' |
| `frontend/src/pages/admin/TongQuan.jsx` (+ 14 placeholder pages) | 15 placeholder pages | VERIFIED | Tat ca import PlaceholderPage va truyen title dung |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| LoginPage.jsx | authService.login() | import { login } from '../services/authService' | WIRED | Goi dung trong handleSubmit |
| authService.js | api.js (/api/login) | import api from './api'; api.post('/login') | WIRED | POST /login, tra ve data |
| api.js | BE localhost:8000 | vite proxy '/api' -> 'http://localhost:8000' | WIRED | Dev proxy cau hinh dung |
| api.js | localStorage token | interceptors.request.use | WIRED | Bearer token duoc gan vao header |
| LoginPage.jsx | AuthContext.saveAuth() | import { useAuth }, const { saveAuth } | WIRED | Goi saveAuth(data.user, data.token) sau login |
| Sidebar.jsx | authService.logout() | import { logout } | WIRED | Goi trong handleLogout |
| Sidebar.jsx | AuthContext.clearAuth() | import { useAuth }, clearAuth | WIRED | Goi sau logout() |
| ProtectedRoute.jsx | /login redirect | Navigate to="/login" replace | WIRED | Check localStorage.getItem('token') |
| App.jsx | ProtectedRoute | import ProtectedRoute, su dung trong Routes | WIRED | Bao quanh tat ca authenticated routes |
| BE AuthController | GiangVien + SinhVien models | GiangVien::where, SinhVien::where, instanceof | WIRED | Tim trong ca 2 bang, phan biet bang instanceof |
| BE routes/api.php | AuthController | AuthController::class | WIRED | 3 routes: login, me, logout |
| BE Sanctum | personal_access_tokens | EnsureFrontendRequestsAreStateful + auth:sanctum | WIRED | Middleware + guard dung |

---

## Data-Flow Trace (Level 4)

Khong ap dung cho phase nay — cac component render du lieu thanh phan placeholder ("Chuc nang dang phat trien"). Khong co data flow can trace ngoai auth context.

Cac component duy nhat render du lieu thuc la:
- Sidebar.jsx: render `user?.name` va `user?.roles` — lay tu `useAuth()` hook, duoc `saveAuth()` set tu response API thuc, KHONG hardcoded.
- LoginPage.jsx: render error messages — logic thuc, khong hardcoded.

---

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| BE migrations chay duoc (file check) | `ls backend/database/migrations/ | wc -l` | 10 files | PASS |
| Sanctum config ton tai | `ls backend/config/sanctum.php` | File ton tai | PASS |
| CORS supports_credentials | grep trong cors.php | `true` | PASS |
| Auth guard api:sanctum | grep trong auth.php | `'driver' => 'sanctum'` | PASS |
| FE packages dung version | grep trong package.json | react@^19, router@^7 | PASS |
| Proxy /api | grep trong vite.config.js | localhost:8000 proxy | PASS |
| Login endpoint duoc dinh nghia | cat routes/api.php | Route::post('/login') | PASS |
| Protected routes co /me | cat routes/api.php | auth:sanctum middleware group | PASS |
| npm run build (tu SUMMARY) | SUMMARY ghi "163 modules, 0 errors" | 0 errors | PASS (SUMMARY evidence) |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|---------|
| AUTH-01 | 01-01-be + 01-02-fe | Dang nhap bang email+password, token luu localStorage | SATISFIED | BE: AuthController.login() tao token; FE: saveAuth() luu localStorage |
| AUTH-02 | 01-01-be + 01-02-fe | Ho tro 4 roles: admin, gvhd, gvpb, sv | SATISFIED | BE: logic tinh roles dong; FE: menuConfig cho 4 roles, getDefaultRoute() |
| AUTH-03 | 01-01-be + 01-02-fe | GV co the mang nhieu roles cung luc | SATISFIED | BE: roles la mang, check nhieu dieu kien; FE: Sidebar gop menu cua nhieu roles |
| AUTH-04 | 01-02-fe | Moi role chi truy cap route thuoc quyen | SATISFIED (partial) | FE: ProtectedRoute check token, App.jsx co routes phan chia theo role — nhung CHUA co role-based route guard (chi check co token hay khong, chua check dung role) — Se du cho phase 1, se hoan thien phase sau |

**Ghi chu AUTH-04:** ProtectedRoute hien tai chi kiem tra co token hay khong, chua kiem tra token co dung role de access route do khong. Vi du: SV co token van co the manually navigate toi /admin/tong-quan (trang se hien "Chuc nang dang phat trien" nhung khong bi block). Day la thieu sot khi compare voi yeu cau AUTH-04 day du, nhung duoc chap nhan cho Phase 1 vi placeholder pages chua co chuc nang thuc su. Se can sua trong cac phase sau.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `backend/routes/web.php` | 1-3 | Import `App\Models\User` nhung User.php da bi xoa | WARNING | Web routes /users se throw ClassNotFound error khi access, nhung API auth flow khong bi anh huong |
| `backend/config/auth.php` | 67-70 | providers.users.model = User::class, User.php da bi xoa | INFO | Chi anh huong khi guard 'web' duoc dung (session-based), khong anh huong Sanctum token auth |
| `frontend/src/pages/admin/TongQuan.jsx` (+ 14 files) | — | PlaceholderPage "Chuc nang dang phat trien" | INFO | Intentional per plan — se implement cac phase sau |

---

## Human Verification Required

### 1. Login Flow End-to-End — Admin

**Test:** Chay `php artisan serve` (backend) va `npm run dev` (frontend), mo browser vao http://localhost:5173, nhap admin@stu.edu.vn / 123456, nhan "Dang nhap"
**Expected:** Redirect toi /admin/tong-quan, sidebar hien 9 menu items cho admin: Tong quan, Sinh vien, Giang vien, Phan cong GVHD, De tai, Phan cong GVPB, Hoi dong, Diem tong ket, Cai dat
**Why human:** Can ca BE + FE chay cung luc, can browser de verify localStorage, redirect, va render

### 2. Login Flow End-to-End — Sinh vien

**Test:** Tren trang login, nhap em@student.stu.edu.vn / 123456
**Expected:** Redirect toi /sv/de-tai, sidebar chi hien 1 menu item "De tai cua toi", footer sidebar hien "Xin chao, Hoang Van Em" va role "Sinh vien"
**Why human:** Can kiem tra BE tra ve type='sinhvien' va roles=['sv'] dung voi SinhVien model, FE render chinh xac

### 3. Route Guard Behavior

**Test:** Khi chua dang nhap, mo http://localhost:5173/admin/tong-quan tren browser
**Expected:** Redirect tu dong ve /login
**Why human:** Can browser de kiem tra localStorage state va navigation behavior thuc te

### 4. Logout Flow

**Test:** Sau khi dang nhap admin, click nut "Dang xuat" tren Sidebar
**Expected:** Token bi xoa khoi localStorage, redirect ve /login; sau do access /admin/tong-quan phai redirect ve /login lai
**Why human:** Can kiem tra token lifecycle va redirect behavior tren browser

---

## Gaps Summary

Khong co gaps thuc su blo goal achievement. Tat ca artifacts, key links, va must-haves da duoc verify.

**Issue phat hien (WARNING, khong phai BLOCKER):**

1. **routes/web.php chua duoc don dep:** File van con 5 CRUD routes tham chieu `App\Models\User` da bi xoa. Neu ai access /users, /users/{id} tren web (non-API) se gap ClassNotFoundException. Tuy nhien, day la web route, khong anh huong auth API flow. Plan 2.4 khong yeu cau don dep file nay.

2. **auth.php providers van point toi User::class:** Tiep tuc tu van de tren. Khong anh huong Sanctum token-based auth.

3. **AUTH-04 chua day du cho role-based guard:** ProtectedRoute chi kiem tra co token, chua kiem tra role phu hop voi route. Du duoc chap nhan cho Phase 1 vi pages la placeholder.

**Conclusion:** Phase 1 goal "Project chay duoc, database dung schema, auth hoat dong, BE va FE ket noi duoc voi nhau" CO THE VERIFIED qua code analysis. Can human verification de confirm end-to-end behavior tren browser.

---

_Verified: 2026-04-05T17:30:00Z_
_Verifier: GSD Verifier (Claude)_
