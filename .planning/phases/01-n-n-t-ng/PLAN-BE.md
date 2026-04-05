---
wave: 1
depends_on: []
files_modified:
  - backend/database/migrations/*
  - backend/app/Models/*
  - backend/routes/api.php
  - backend/app/Http/Controllers/AuthController.php
  - backend/database/seeders/*
  - backend/.env.example
  - backend/composer.json
  - backend/config/cors.php
  - backend/config/auth.php
  - backend/bootstrap/app.php
autonomous: true
requirements:
  - AUTH-01
  - AUTH-02
  - AUTH-03
  - AUTH-04
---

# PLAN-BE: Phase 1 Backend - Nen tang

Greenfield rebuild. KHONG tai su dung code cu.

## Tong quan

4 viec chinh:
1. Cai packages (sanctum)
2. Viet migrations 8 bang
3. Auth API (login/logout/me) voi Sanctum token
4. Seeder: 1 admin, 3 GV, 5 SV

---

## Wave 1: Setup + Migrations

### Task 1.1: Cai packages va cau hinh

<read_first>
- backend/composer.json
- backend/.env.example
- backend/config/cors.php
- backend/config/auth.php
- backend/bootstrap/app.php
</read_first>

<action>
1. Trong thu muc backend/, chay:
   - composer require laravel/sanctum
2. Publish sanctum: php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
3. Sua backend/.env.example them:
   SANCTUM_STATEFUL_DOMAINS=localhost:5173
   SESSION_DOMAIN=localhost
   FRONTEND_URL=http://localhost:5173
4. Sua backend/config/cors.php:
   'paths' => ['api/*', 'sanctum/csrf-cookie'],
   'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:5173')],
   'supports_credentials' => true,
5. Giu config/auth.php mac dinh cua Laravel. Sanctum tu resolve model tu tokenable_type
   trong bang personal_access_tokens, KHONG can them provider rieng.
   Chi dam bao co guard 'api' voi driver 'sanctum':
   'api' => ['driver' => 'sanctum']
6. Trong bootstrap/app.php, dang ky middleware cho api group co:
   \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class
   va throttle:60,1
</action>

<acceptance_criteria>
- backend/composer.json chua "laravel/sanctum" trong require
- backend/composer.json KHONG chua "spatie/laravel-permission"
- backend/.env.example chua dong SANCTUM_STATEFUL_DOMAINS=localhost:5173
- backend/config/cors.php chua 'supports_credentials' => true
- backend/config/auth.php chua 'api' => ['driver' => 'sanctum'
- backend/config/auth.php KHONG chua 'provider' => 'giangvien'
- backend/config/auth.php KHONG chua 'provider' => 'sinhvien'
- Lenh php artisan khong bi loi
</acceptance_criteria>

### Task 1.2: Migration bang giangvien + Model GiangVien

<read_first>
- backend/app/Models/Teacher.php
- .planning/research/ARCHITECTURE.md (section 2.3)
</read_first>

<action>
Tao migration 2026_04_05_000001_create_giangvien_table.php:
Schema::create('giangvien', function (Blueprint $table) {
    $table->string('maGV', 20)->primary();
    $table->string('tenGV', 100);
    $table->string('email', 100)->unique()->nullable();
    $table->string('soDienThoai', 15)->nullable();
    $table->string('hocVi', 50)->nullable();
    $table->string('matKhau', 255);
    $table->boolean('isAdmin')->default(false);
    $table->timestamps();
});

Tao model app/Models/GiangVien.php:
- extends Authenticatable
- use HasApiTokens
- $table = 'giangvien', $primaryKey = 'maGV', $incrementing = false, $keyType = 'string'
- $fillable = ['maGV', 'tenGV', 'email', 'soDienThoai', 'hocVi', 'matKhau', 'isAdmin']
- $hidden = ['matKhau']
- getAuthPassword() return $this->matKhau
- Relationships: deTaiHuongDan(), deTaiPhanBien(), thanhVienHoiDong()
</action>

<acceptance_criteria>
- File database/migrations/*_create_giangvien_table.php ton tai
- Migration chua Schema::create('giangvien'
- Migration chua $table->boolean('isAdmin')->default(false)
- File app/Models/GiangVien.php ton tai
- GiangVien.php chua use HasApiTokens
- GiangVien.php KHONG chua use HasRoles
- GiangVien.php KHONG chua Spatie
</acceptance_criteria>

### Task 1.3: Migration bang sinhvien + Model SinhVien

<read_first>
- backend/app/Models/Student.php
- .planning/research/ARCHITECTURE.md (section 2.3)
</read_first>

<action>
Tao migration 2026_04_05_000002_create_sinhvien_table.php:
Schema::create('sinhvien', function (Blueprint $table) {
    $table->string('mssv', 20)->primary();
    $table->string('hoTen', 100);
    $table->string('lop', 20)->nullable();
    $table->string('email', 100)->unique()->nullable();
    $table->string('soDienThoai', 15)->nullable();
    $table->string('matKhau', 255);
    $table->unsignedBigInteger('maDeTai')->nullable();
    $table->unsignedBigInteger('ky_lvtn_id')->nullable();
    $table->timestamps();
});

Tao model app/Models/SinhVien.php:
- extends Authenticatable
- use HasApiTokens
- $table = 'sinhvien', $primaryKey = 'mssv', $incrementing = false, $keyType = 'string'
- $fillable = ['mssv', 'hoTen', 'lop', 'email', 'soDienThoai', 'matKhau', 'maDeTai', 'ky_lvtn_id']
- $hidden = ['matKhau']
- getAuthPassword() return $this->matKhau
- Relationship: deTai() belongsTo DeTai
</action>

<acceptance_criteria>
- File migration *_create_sinhvien_table.php ton tai
- Migration chua $table->string('mssv', 20)->primary()
- File app/Models/SinhVien.php ton tai
- SinhVien.php chua use HasApiTokens
- SinhVien.php chua $table = 'sinhvien'
</acceptance_criteria>

### Task 1.4: Migration bang ky_lvtn + Model KyLvtn

<read_first>
- .planning/REQUIREMENTS.md (section KY)
</read_first>

<action>
Tao migration 2026_04_05_000003_create_ky_lvtn_table.php:
Schema::create('ky_lvtn', function (Blueprint $table) {
    $table->id();
    $table->string('ten', 100);
    $table->date('ngay_bat_dau')->nullable();
    $table->date('ngay_nhan_de_tai')->nullable();
    $table->date('ngay_cham_50')->nullable();
    $table->date('ngay_phan_bien')->nullable();
    $table->date('ngay_bao_ve')->nullable();
    $table->date('ngay_ket_thuc')->nullable();
    $table->boolean('is_active')->default(false);
    $table->timestamps();
});

Tao model app/Models/KyLvtn.php:
- $table = 'ky_lvtn'
- $fillable = ['ten', 'ngay_bat_dau', 'ngay_nhan_de_tai', 'ngay_cham_50', 'ngay_phan_bien', 'ngay_bao_ve', 'ngay_ket_thuc', 'is_active']
- $casts: tat ca ngay => date, is_active => boolean
</action>

<acceptance_criteria>
- File migration *_create_ky_lvtn_table.php ton tai
- Migration chua $table->boolean('is_active')
- File app/Models/KyLvtn.php ton tai
</acceptance_criteria>

### Task 1.5: Migration cac bang con lai (detai, hoidong, thanhvien_hoidong, diem_hoidong, cau_hinh)

<read_first>
- backend/app/Models/Topic.php
- backend/app/Models/Council.php
- backend/app/Models/CouncilMember.php
- backend/app/Models/Score.php
- backend/app/Models/Setting.php
- .planning/research/ARCHITECTURE.md (section 2.3 va 2.4)
</read_first>

<action>
Tao 5 migrations + models tuong ung:

**Migration 000004 - detai:**
Schema::create('detai', function (Blueprint $table) {
    $table->id('maDeTai');
    $table->string('tenDeTai', 255);
    $table->text('moTa')->nullable();
    $table->string('maGV_HD', 20)->nullable();
    $table->string('maGV_PB', 20)->nullable();
    $table->unsignedBigInteger('maHoiDong')->nullable();
    $table->unsignedBigInteger('ky_lvtn_id')->nullable();
    $table->integer('thuTuTrongHD')->nullable();
    $table->text('ghiChu')->nullable();
    $table->decimal('diemGiuaKy', 4, 2)->nullable();
    $table->string('trangThaiGiuaKy', 20)->nullable();
    $table->text('nhanXetGiuaKy')->nullable();
    $table->decimal('diemHuongDan', 4, 2)->nullable();
    $table->text('nhanXetHuongDan')->nullable();
    $table->decimal('diemPhanBien', 4, 2)->nullable();
    $table->text('nhanXetPhanBien')->nullable();
    $table->decimal('diemHoiDong', 4, 2)->nullable();
    $table->decimal('diemTongKet', 4, 2)->nullable();
    $table->string('diemChu', 5)->nullable();
    $table->string('trangThai', 30)->default('chua_phan_cong');
    $table->timestamps();
    $table->foreign('maGV_HD')->references('maGV')->on('giangvien')->nullOnDelete();
    $table->foreign('maGV_PB')->references('maGV')->on('giangvien')->nullOnDelete();
    $table->foreign('ky_lvtn_id')->references('id')->on('ky_lvtn')->nullOnDelete();
});
Model: app/Models/DeTai.php - relationships: giangVienHD(), giangVienPB(), hoiDong(), sinhVien(), kyLvtn()

**Migration 000005 - hoidong:**
Schema::create('hoidong', function (Blueprint $table) {
    $table->id('maHoiDong');
    $table->string('tenHoiDong', 100);
    $table->string('diaDiem', 100)->nullable();
    $table->date('ngayBaoVe')->nullable();
    $table->unsignedBigInteger('ky_lvtn_id')->nullable();
    $table->timestamps();
    $table->foreign('ky_lvtn_id')->references('id')->on('ky_lvtn')->nullOnDelete();
});
Model: app/Models/HoiDong.php - relationships: thanhVien(), deTai(), kyLvtn()

**Migration 000006 - thanhvien_hoidong:**
Schema::create('thanhvien_hoidong', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('maHoiDong');
    $table->string('maGV', 20);
    $table->enum('vaiTro', ['ChuTich', 'ThuKy', 'UyVien']);
    $table->timestamps();
    $table->foreign('maHoiDong')->references('maHoiDong')->on('hoidong')->cascadeOnDelete();
    $table->foreign('maGV')->references('maGV')->on('giangvien')->cascadeOnDelete();
    $table->unique(['maHoiDong', 'maGV']);
});
Model: app/Models/ThanhVienHoiDong.php

**Migration 000007 - diem_hoidong:**
Schema::create('diem_hoidong', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('maDeTai');
    $table->string('maGV', 20);
    $table->decimal('diemSo', 4, 2);
    $table->text('nhanXet')->nullable();
    $table->timestamps();
    $table->foreign('maDeTai')->references('maDeTai')->on('detai')->cascadeOnDelete();
    $table->foreign('maGV')->references('maGV')->on('giangvien')->cascadeOnDelete();
    $table->unique(['maDeTai', 'maGV']);
});
Model: app/Models/DiemHoiDong.php

**Migration 000008 - cau_hinh:**
Schema::create('cau_hinh', function (Blueprint $table) {
    $table->id();
    $table->string('key', 50)->unique();
    $table->text('value')->nullable();
    $table->timestamps();
});
Model: app/Models/CauHinh.php

**Migration 000009 - add foreign keys to sinhvien va detai:**
Schema::table('sinhvien', function (Blueprint $table) {
    $table->foreign('maDeTai')->references('maDeTai')->on('detai')->nullOnDelete();
    $table->foreign('ky_lvtn_id')->references('id')->on('ky_lvtn')->nullOnDelete();
});
Schema::table('detai', function (Blueprint $table) {
    $table->foreign('maHoiDong')->references('maHoiDong')->on('hoidong')->nullOnDelete();
});
</action>

<acceptance_criteria>
- 6 migration files moi ton tai trong database/migrations/
- Migration detai chua $table->decimal('diemHuongDan', 4, 2)
- Migration detai chua foreign('maGV_HD')->references('maGV')->on('giangvien')
- Migration thanhvien_hoidong chua enum('vaiTro', ['ChuTich', 'ThuKy', 'UyVien'])
- Migration diem_hoidong chua unique(['maDeTai', 'maGV'])
- Files ton tai: DeTai.php, HoiDong.php, ThanhVienHoiDong.php, DiemHoiDong.php, CauHinh.php trong app/Models/
- php artisan migrate chay thanh cong tren database trong
</acceptance_criteria>

---

## Wave 2: Auth API + Seeder

### Task 2.1: Viet AuthController voi Sanctum

<read_first>
- backend/routes/api.php
- backend/app/Http/Controllers/AuthController.php
- backend/app/Http/Middleware/ApiTokenAuth.php
- backend/app/Models/GiangVien.php (moi)
- backend/app/Models/SinhVien.php (moi)
</read_first>

<action>
Viet lai app/Http/Controllers/AuthController.php:

**login(Request $request):**
- Validate: email required|email, password required
- Tim GiangVien::where('email', $request->email)->first()
- Neu khong thay, tim SinhVien::where('email', $request->email)->first()
- Neu khong thay ca hai -> 401 "Email hoac mat khau khong dung"
- Check Hash::check($request->password, $user->matKhau)
- Neu sai -> 401 "Email hoac mat khau khong dung"
- Tao token: $token = $user->createToken('auth_token')->plainTextToken
  (Sanctum tu luu tokenable_type = GiangVien hoac SinhVien, tokenable_id = maGV hoac mssv)
- Xac dinh type va roles:
  + Neu $user instanceof GiangVien:
    - type = 'giangvien'
    - $roles = []
    - if ($user->isAdmin) $roles[] = 'admin'
    - if (DeTai::where('maGV_HD', $user->maGV)->exists()) $roles[] = 'gvhd'
    - if (DeTai::where('maGV_PB', $user->maGV)->exists()) $roles[] = 'gvpb'
    - if (ThanhVienHoiDong::where('maGV', $user->maGV)->exists()) $roles[] = 'tv_hd'
    - if (empty($roles) && !$user->isAdmin) $roles[] = 'gvhd'  // mac dinh
  + Neu $user instanceof SinhVien:
    - type = 'sinhvien'
    - $roles = ['sv']
- Return JSON: { token, user: { id: maGV/mssv, name: tenGV/hoTen, email, type, roles } }

**me(Request $request):**
- $user = $request->user()  // Sanctum resolve tu tokenable_type trong personal_access_tokens
- Xac dinh type va roles bang instanceof:
  + Neu $user instanceof GiangVien:
    - type = 'giangvien'
    - $roles = []
    - if ($user->isAdmin) $roles[] = 'admin'
    - if (DeTai::where('maGV_HD', $user->maGV)->exists()) $roles[] = 'gvhd'
    - if (DeTai::where('maGV_PB', $user->maGV)->exists()) $roles[] = 'gvpb'
    - if (ThanhVienHoiDong::where('maGV', $user->maGV)->exists()) $roles[] = 'tv_hd'
    - if (empty($roles) && !$user->isAdmin) $roles[] = 'gvhd'
    - id = $user->maGV, name = $user->tenGV
  + Neu $user instanceof SinhVien:
    - type = 'sinhvien'
    - $roles = ['sv']
    - id = $user->mssv, name = $user->hoTen
- Return JSON: { id, name, email, type, roles }

**logout(Request $request):**
- $request->user()->currentAccessToken()->delete()
- Return JSON 200: { message: "Dang xuat thanh cong" }
</action>

<acceptance_criteria>
- File AuthController.php chua function login(Request $request)
- File chua function logout(Request $request)
- File chua function me(Request $request)
- File chua createToken(
- File chua Hash::check(
- File chua GiangVien::where va SinhVien::where (tim trong ca 2 bang)
- File chua instanceof GiangVien
- File chua instanceof SinhVien
- me() co logic instanceof day du, khong chi ghi "tinh roles giong login"
</acceptance_criteria>

### Task 2.2: Cau hinh routes/api.php

<read_first>
- backend/routes/api.php
- backend/app/Http/Controllers/AuthController.php
</read_first>

<action>
Xoa toan bo noi dung cu trong routes/api.php. Viet lai:

<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Chi 3 routes. Cac route khac them phase sau.
</action>

<acceptance_criteria>
- File routes/api.php co duoi 15 dong code thuc (khong tinh comment)
- File chua Route::post('/login'
- File chua Route::get('/me'
- File chua Route::post('/logout'
- File chua middleware('auth:sanctum')
- File KHONG chua Cache::store
- File KHONG chua closure function lam logic
</acceptance_criteria>

### Task 2.3: DatabaseSeeder

<read_first>
- backend/app/Models/GiangVien.php
- backend/app/Models/SinhVien.php
- backend/app/Models/KyLvtn.php
</read_first>

<action>
Viet database/seeders/DatabaseSeeder.php:

1. Tao ky LVTN:
   KyLvtn::create(['ten' => 'HK2 2025-2026', 'is_active' => true, 'ngay_bat_dau' => '2026-02-01', 'ngay_ket_thuc' => '2026-06-30'])

2. Tao admin:
   GiangVien::create(['maGV' => 'GV001', 'tenGV' => 'Nguyen Van Admin', 'email' => 'admin@stu.edu.vn', 'hocVi' => 'ThS', 'matKhau' => Hash::make('123456'), 'isAdmin' => true])

3. Tao 3 GV:
   - GV002, Tran Thi Binh, binh@stu.edu.vn, TS, 123456, isAdmin=false
   - GV003, Le Van Cuong, cuong@stu.edu.vn, ThS, 123456, isAdmin=false
   - GV004, Pham Minh Duc, duc@stu.edu.vn, ThS, 123456, isAdmin=false

4. Tao 5 SV (ky_lvtn_id = 1):
   - DH52100001, Hoang Van Em, D21_TH01, em@student.stu.edu.vn, 123456
   - DH52100002, Vo Thi Phuong, D21_TH01, phuong@student.stu.edu.vn, 123456
   - DH52100003, Bui Quoc Gia, D21_TH02, gia@student.stu.edu.vn, 123456
   - DH52100004, Dang Ngoc Han, D21_TH02, han@student.stu.edu.vn, 123456
   - DH52100005, Ly Van Ich, D21_TH03, ich@student.stu.edu.vn, 123456
</action>

<acceptance_criteria>
- File database/seeders/DatabaseSeeder.php ton tai
- File chua GiangVien::create
- File chua SinhVien::create
- File chua KyLvtn::create
- File chua Hash::make('123456')
- File chua isAdmin => true (cho admin)
- php artisan db:seed chay thanh cong
</acceptance_criteria>

### Task 2.4: Xoa code cu, don dep

<read_first>
- backend/app/Models/Teacher.php
- backend/app/Models/Student.php
- backend/app/Models/Topic.php
- backend/app/Models/Council.php
- backend/app/Models/CouncilMember.php
- backend/app/Models/Score.php
- backend/app/Models/Setting.php
- backend/app/Models/User.php
- backend/app/Models/ThesisForm.php
- backend/app/Http/Middleware/ApiTokenAuth.php
</read_first>

<action>
Xoa cac files cu:
- app/Models/Teacher.php (thay = GiangVien.php)
- app/Models/Student.php (thay = SinhVien.php)
- app/Models/Topic.php (thay = DeTai.php)
- app/Models/Council.php (thay = HoiDong.php)
- app/Models/CouncilMember.php (thay = ThanhVienHoiDong.php)
- app/Models/Score.php (thay = DiemHoiDong.php)
- app/Models/Setting.php (thay = CauHinh.php)
- app/Models/User.php
- app/Models/ThesisForm.php
- app/Http/Middleware/ApiTokenAuth.php
- app/Http/Requests/StoreTopicRequest.php
- app/Http/Requests/UpdateTopicRequest.php
- app/Console/Commands/MigrateLegacyData.php

Giu cac controllers khac (DashboardController, StudentController, v.v.) nhung xoa het noi dung, chi giu class rong - se viet lai phase sau. Hoac xoa luon neu khong can.
</action>

<acceptance_criteria>
- File app/Models/Teacher.php KHONG ton tai
- File app/Models/Student.php KHONG ton tai
- File app/Models/User.php KHONG ton tai
- File app/Http/Middleware/ApiTokenAuth.php KHONG ton tai
- File app/Models/GiangVien.php TON TAI
- File app/Models/SinhVien.php TON TAI
- php artisan route:list chi hien 3 API routes
</acceptance_criteria>

---

## Verification

Sau khi hoan thanh tat ca tasks:

1. php artisan migrate:fresh --seed chay OK
2. POST /api/login { email: admin@stu.edu.vn, password: 123456 } -> tra ve token, roles co "admin"
3. GET /api/me voi Bearer token -> tra ve user info dung, co instanceof check
4. POST /api/login { email: em@student.stu.edu.vn, password: 123456 } -> tra ve token, type = "sinhvien", roles co "sv"
5. GET /api/me voi token SV -> tra ve type "sinhvien", roles ["sv"]
6. POST /api/logout -> 200
7. GET /api/me sau logout -> 401

---

## must_haves

- [ ] php artisan migrate chay OK tu database trong (8 bang + sanctum, KHONG co spatie)
- [ ] Login GV admin tra ve token + roles co "admin"
- [ ] Login GV thuong tra ve token + roles (mac dinh "gvhd")
- [ ] Login SV tra ve token + type "sinhvien" + roles co "sv"
- [ ] GET /api/me tra ve dung info va roles (dung instanceof GiangVien va instanceof SinhVien)
- [ ] Logout xoa token, request tiep theo bi 401
- [ ] Seeder co 4 GV (1 admin) + 5 SV + 1 ky LVTN
