# Nghien cuu Architecture — Laravel 12 API + React SPA

> Tai lieu research cho viec refactor/rebuild he thong quan ly LVTN.
> Dua tren phan tich code hien tai + yeu cau nghiep vu tu PROJECT.md.

---

## 1. Hien trang code hien tai

### Nhung gi da co
- **Backend**: Laravel 12 project voi cac model: Student, Teacher, Topic, Council, CouncilMember, Score, Setting, ThesisForm
- **Frontend**: React 18 + Vite + TailwindCSS 4 + React Router 6
- **Database**: MySQL — 7 bang chinh (sinhvien, giangvien, detai, hoidong, thanhvienhoidong, diem, cauhinh) + 1 bang topic_registrations_form
- **Auth**: Custom token-based (Cache file store), khong dung Sanctum
- **API routes**: Tat ca nam trong 1 file api.php (~820 dong), phan lon la closure routes (khong dung controller)
- **Frontend state**: Context API don gian (AuthContext)

### Van de hien tai can giai quyet
1. **api.php qua lon**: ~820 dong, closure routes lan lon, kho bao tri
2. **Auth system khong chuan**: Dung Cache file store cho token, khong persist qua restart server
3. **Role system bi loi logic**: Role duoc lay tu `council_members` table — neu GV chua duoc gan vao hoi dong thi khong co role dung
4. **Khong co migrations**: Database chi co file SQL dump, khong co Laravel migrations
5. **Thieu nhieu chuc nang**: Import Excel, Export Word, Phan cong GVPB, xuat danh sach bao ve — tat ca deu tra 501
6. **Password luu plaintext**: Mot so GV van dung mat khau plaintext `'123'`

---

## 2. Kien nghi Architecture

### Tong quan

```
[React SPA]  <--HTTP/JSON-->  [Laravel 12 API]  <-->  [MySQL]
   |                               |
   Vite dev server                 php artisan serve (dev)
   Build static -> host rieng      hoac cung origin (public/)
```

**Chon phuong an**: React build ra static files, copy vao `backend/public/` khi deploy. Dev thi chay 2 server rieng (Vite + artisan serve).

**Ly do**: Shared hosting thuong chi co 1 domain/subdomain. Dat React build vao public folder cua Laravel la cach don gian nhat de deploy tren cPanel ma khong can setup CORS phuc tap.

### 2.1 API Structure — Resource Routes + Custom Routes

**Khuyen nghi**: Dung `Route::apiResource()` cho cac CRUD don gian, them custom routes khi can.

```php
// routes/api.php — chi de route definitions, khong de logic

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth.api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::apiResource('students', StudentController::class);
    Route::delete('/students', [StudentController::class, 'destroyAll']);
    Route::post('/students/import', [StudentController::class, 'import']);

    Route::apiResource('lecturers', LecturerController::class);

    Route::apiResource('topics', TopicController::class);
    Route::post('/topics/create-group', [TopicController::class, 'createGroup']);
    Route::patch('/topics/{topic}/status', [TopicController::class, 'updateStatus']);
    Route::post('/topics/{topic}/score-gvhd', [TopicController::class, 'scoreGvhd']);
    Route::post('/topics/{topic}/score-gvpb', [TopicController::class, 'scoreGvpb']);
    Route::post('/topics/assign-council', [TopicController::class, 'assignCouncil']);
    Route::post('/topics/council-score', [TopicController::class, 'councilScore']);

    Route::apiResource('councils', CouncilController::class);

    Route::apiResource('scores', ScoreController::class);

    Route::get('/settings', [SettingController::class, 'index']);
    Route::put('/settings/stage', [SettingController::class, 'updateStage']);
    Route::post('/settings/toggle-midterm', [SettingController::class, 'toggleMidterm']);

    // Export routes
    Route::get('/exports/word/gvhd/{topic}', [ExportController::class, 'wordGvhd']);
    Route::get('/exports/word/gvpb/{topic}', [ExportController::class, 'wordGvpb']);
    Route::get('/exports/word/assignment/{topic}', [ExportController::class, 'wordAssignment']);
    Route::get('/exports/defense-list', [ExportController::class, 'defenseList']);

    Route::get('/options', [OptionController::class, 'index']);
});
```

**So luong controllers**: ~8-9 controllers. Khong qua nhieu, khong qua it. Moi controller xu ly 1 nhom chuc nang lien quan.

**Cau truc folder**:
```
app/Http/Controllers/
    AuthController.php
    DashboardController.php
    StudentController.php
    LecturerController.php
    TopicController.php
    CouncilController.php
    ScoreController.php
    SettingController.php
    ExportController.php
    OptionController.php
```

### 2.2 State Management trong React — Context API

**Khuyen nghi**: **Giu Context API**. Khong can Redux hay Zustand.

**Ly do**:
- Project nho, ~10 trang, 1-2 dev
- State chinh chi co: user info (auth), va data fetch tu API (khong can global state)
- Moi trang tu fetch data rieng bang `useState` + `useEffect` la du
- Redux/Zustand them complexity khong can thiet cho project nay

**Cai thien AuthContext**:
```jsx
// Them persist vao localStorage de khong mat session khi reload
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = (userData, tokenStr) => {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', tokenStr);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 2.3 Database Design — Giai quyet van de multi-role lecturer

#### Van de chinh
Mot GV co the dong nhieu vai tro **cung luc** trong cung ky LVTN:
- GVHD cua nhom A
- GVPB cua nhom B
- Chu tich hoi dong 1
- Uy vien hoi dong 2

=> **Khong the gan 1 role co dinh cho GV**. Role phu thuoc vao context (de tai nao, hoi dong nao).

#### Giai phap: Role-per-context, khong phai role-per-user

**Bang `giangvien`** — khong co cot `role`. GV chi la GV.

```sql
CREATE TABLE giangvien (
    maGV VARCHAR(20) PRIMARY KEY,
    tenGV VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    soDienThoai VARCHAR(15),
    hocVi VARCHAR(50),
    matKhau VARCHAR(255) NOT NULL DEFAULT '123',
    isAdmin TINYINT(1) DEFAULT 0     -- chi 1 flag: co phai admin (thu ky) khong
);
```

**Vai tro GVHD**: Xac dinh qua `detai.maGV_HD` — GV la GVHD cua de tai nao thi xem trong bang detai.
**Vai tro GVPB**: Xac dinh qua `detai.maGV_PB` — tuong tu.
**Vai tro trong Hoi dong**: Xac dinh qua `thanhvienhoidong.vaiTro` — ChuTich/ThuKy/UyVien cua hoi dong nao.
**Vai tro Admin**: Xac dinh qua `giangvien.isAdmin = 1` — chi 1-2 nguoi (thu ky khoa).

**Logic xac dinh quyen khi login**:
```
1. Check isAdmin -> neu true => role = 'admin', full quyen
2. Query detai WHERE maGV_HD = loginUser => co de tai HD => co quyen GVHD
3. Query detai WHERE maGV_PB = loginUser => co de tai PB => co quyen GVPB
4. Query thanhvienhoidong WHERE maGV = loginUser => co hoi dong => co quyen HĐ
```

**API response khi login / GET /me**:
```json
{
  "maGV": "MA2431",
  "tenGV": "Tran Van Hung",
  "isAdmin": true,
  "roles": {
    "isGVHD": true,
    "isGVPB": true,
    "isCouncilMember": true,
    "councilRoles": [
      { "maHoiDong": 13, "vaiTro": "ThuKy" }
    ]
  },
  "topicsHD": [11, 12],
  "topicsPB": [10]
}
```

=> Frontend dua vao object `roles` nay de hien thi menu phu hop. GV thay tat ca cac tab lien quan den vai tro cua minh.

**Luu y ve Sinh vien**: SV dang nhap bang MSSV, khong phai maGV. Can 1 route login rieng hoac check ca 2 bang khi login.

#### Schema hoan chinh (giu lai ten bang tieng Viet nhu hien tai)

```
giangvien (maGV PK, tenGV, email, soDienThoai, hocVi, matKhau, isAdmin)
    |
    |--- detai.maGV_HD (FK) = GVHD
    |--- detai.maGV_PB (FK) = GVPB
    |--- thanhvienhoidong.maGV (FK) = thanh vien hoi dong
    |--- diem.maGV (FK) = nguoi cham diem

sinhvien (mssv PK, hoTen, lop, email, soDienThoai, maDeTai FK, matKhau)
    |
    |--- detai.maDeTai (FK) = sinh vien thuoc de tai nao

detai (maDeTai PK AUTO_INCREMENT, maMH, tenDeTai, maGV_HD FK, maGV_PB FK,
       maHoiDong FK, ghiChu, diemGiuaKy, trangThaiGiuaKy,
       nhanXetGiuaKy, diemHuongDan, diemPhanBien, nhanXetPhanBien,
       diemHoiDong, nhanXetHoiDong, diemTongKet, diemChu, trangThaiHoiDong)

hoidong (maHoiDong PK AUTO_INCREMENT, tenHoiDong, diaDiem, ngayBaoVe DATE)

thanhvienhoidong (id PK AUTO_INCREMENT, maHoiDong FK, maGV FK,
                   vaiTro ENUM('ChuTich','ThuKy','UyVien'))

diem (maDiem PK AUTO_INCREMENT, maDeTai FK, maGV FK,
      loaiDiem ENUM('HuongDan','PhanBien','HoiDong'), diemSo FLOAT, nhanXet TEXT)

cauhinh (id PK, trangThaiChamGK TINYINT, giaiDoan INT)

topic_registrations_form (id PK AUTO_INCREMENT, ... giu nhu hien tai)
```

**ERD (Text-based)**:
```
giangvien 1---N detai (qua maGV_HD)
giangvien 1---N detai (qua maGV_PB)
giangvien N---M hoidong (qua thanhvienhoidong, voi vaiTro)
detai 1---N sinhvien (qua maDeTai)
detai N---1 hoidong (qua maHoiDong)
detai 1---N diem (qua maDeTai)
giangvien 1---N diem (qua maGV)
```

### 2.4 He thong cham diem (Scoring System)

#### Cong thuc
```
Diem tong ket = 20% * diemHuongDan + 20% * diemPhanBien + 60% * diemHoiDong
```

#### Chi tiet tung loai diem

**Diem Huong Dan (GVHD cham)**:
- 4 tieu chi: Phan tich, Thiet ke, Hien thuc, Bao cao
- Moi tieu chi co diem toi da (maxPhanTich, maxThietKe, ...) va diem thuc te
- Neu nhom 2 SV: GVHD cham rieng tung SV, diem trung binh
- Quy ve thang 10: `(tong diem thuc te / tong diem toi da) * 10`
- Luu vao `detai.diemHuongDan`

**Diem Phan Bien (GVPB cham)**: 
- Cung 4 tieu chi, cung cong thuc nhu tren
- Luu vao `detai.diemPhanBien`

**Diem Hoi Dong**:
- Moi thanh vien hoi dong cham 1 diem (co the ghi vao bang `diem` voi `loaiDiem = 'HoiDong'`)
- Diem hoi dong = trung binh cong cac thanh vien
- Luu vao `detai.diemHoiDong`

**Tinh diem tong ket** (trigger khi co du 3 loai diem):
```php
$diemTK = round(($diemHD * 0.2) + ($diemPB * 0.2) + ($diemHoiDong * 0.6), 1);
```

**Quy doi diem chu**:
```
>= 9.0 => A+     >= 7.0 => B      >= 5.0 => D+
>= 8.5 => A      >= 6.5 => C+     >= 4.0 => D
>= 8.0 => B+     >= 5.5 => C      < 4.0  => F
```

**Noi luu diem**: Luu truc tiep tren bang `detai`. Bang `diem` dung nhu log chi tiet (ai cham, bao nhieu, nhan xet gi). Khong can tinh tu bang `diem` len — de don gian, GVHD/GVPB cham xong la update thang vao `detai.diemHuongDan`/`detai.diemPhanBien`.

**Tuy nay code hien tai dang lam dung roi** — chi can giu lai, them logic tinh diem hoi dong tu trung binh cac thanh vien.

### 2.5 File Storage — Local Disk

**Khuyen nghi**: Dung **local disk** (`storage/app/`).

**Ly do**:
- Shared hosting khong co S3/cloud storage san
- File upload chi co Excel import (file nho, xu ly xong co the xoa)
- File export (Word/Excel) tao on-the-fly va stream ve client, khong can luu lau
- Neu can luu tam file import de debug: `storage/app/imports/`

**Flow xu ly file**:
```
Excel Import:
  Upload -> storage/app/temp/ -> phpspreadsheet doc -> insert DB -> xoa file temp

Word Export:
  Request -> doc template tu storage/app/templates/ -> phpword fill data -> stream download -> khong luu

Excel Export:
  Request -> phpspreadsheet tao file -> stream download -> khong luu
```

**Luu y**: Copy cac file .docx template vao `storage/app/templates/` khi deploy. Khong de trong public/.

### 2.6 CORS Setup

#### Option A: Cung origin (KHUYEN NGHI cho shared hosting)

```
https://lvtn.domain.io.vn/           -> React SPA (index.html, assets/)
https://lvtn.domain.io.vn/api/       -> Laravel API
```

- React build output copy vao `backend/public/`
- Laravel routing: neu URL khong match route nao -> tra ve index.html (cho React Router xu ly)
- **Khong can CORS** vi cung origin
- Deploy don gian nhat tren shared hosting

**Cau hinh Laravel**:
```php
// routes/web.php
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '^(?!api).*$');
```

#### Option B: Khac origin (neu host rieng FE/BE)

```
https://lvtn.domain.io.vn/           -> React SPA
https://api.lvtn.domain.io.vn/       -> Laravel API
```

- Can cau hinh CORS trong Laravel:
```php
// config/cors.php
'paths' => ['api/*'],
'allowed_origins' => ['https://lvtn.domain.io.vn'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```
- Dev: Vite proxy hoac cau hinh CORS cho localhost

**Khuyen nghi Option A** vi:
- It config hon
- Khong gap van de CORS
- Shared hosting de deploy hon (chi 1 folder)
- SV khong can hieu CORS de giai thich cho thay

### 2.7 Authentication — Chuyen sang Sanctum

**Hien tai**: Custom token luu trong Cache file store — **khong on dinh** (cache co the bi clear).

**Khuyen nghi**: Chuyen sang **Laravel Sanctum** SPA authentication.

**Ly do**:
- Laravel co san, khong can cai them
- SPA mode dung cookie-based session auth — khong can quan ly token
- Bao mat hon custom token
- Code it hon

**Cach hoat dong**:
```
1. React goi GET /sanctum/csrf-cookie -> Laravel tra ve CSRF token cookie
2. React goi POST /login voi credentials -> Laravel tao session
3. Moi request sau do tu dong gui cookie -> Laravel xac thuc
4. Logout: POST /logout -> Laravel xoa session
```

**Tuy nhien**: Neu thay kho setup cookie cross-domain thi giu cach hien tai nhung **doi tu Cache sang database table** de persist:

```sql
CREATE TABLE api_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    maGV VARCHAR(20) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (maGV) REFERENCES giangvien(maGV)
);
```

=> Don gian hon Sanctum, van an toan, va khong mat token khi restart.

---

## 3. Deployment tren Shared Hosting

### Cau truc thu muc tren hosting

```
public_html/                    <- Document root
    index.php                   <- Laravel entry point
    .htaccess                   <- Rewrite rules
    assets/                     <- React build output (JS, CSS)
    index.html                  <- React SPA (fallback)
    
app/                            <- Laravel app/ folder (ngoai public_html)
bootstrap/
config/
routes/
storage/
vendor/
.env
artisan
composer.json
```

### Buoc deploy

1. Upload toan bo Laravel project len hosting (tru public/)
2. Copy noi dung `public/` vao `public_html/`
3. Sua `index.php` de tro dung duong dan:
```php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
```
4. Build React: `npm run build` -> copy `dist/*` vao `public_html/`
5. Tao `.htaccess` trong `public_html/`:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /

    # API requests -> Laravel
    RewriteRule ^api/ index.php [L]

    # Existing files -> serve directly
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ - [L]

    # Everything else -> React SPA
    RewriteRule ^ index.html [L]
</IfModule>
```
6. Setup MySQL database qua cPanel phpMyAdmin
7. Cau hinh `.env` voi DB credentials
8. Chay `php artisan migrate` qua SSH hoac import SQL file

### Han che cua shared hosting
- **Khong co SSH** (doi khi): Phai upload file qua File Manager, import DB qua phpMyAdmin
- **PHP version**: Dam bao hosting co PHP 8.2+
- **Memory limit**: Co the gap loi khi import Excel lon -> can check `memory_limit` trong php.ini
- **Khong co queue worker**: Khong dung Laravel Queue, xu ly sync het
- **Khong co scheduler**: Khong dung `artisan schedule:run` tru khi setup cron job qua cPanel

---

## 4. Ke hoach Refactor tu code hien tai

### Uu tien cao (lam truoc)
1. **Tach api.php thanh controllers** — chuyen closure routes sang controller methods
2. **Them migrations** — viet migrations tu SQL dump hien tai
3. **Fix auth system** — them cot `isAdmin` vao `giangvien`, bo logic lay role tu council_members
4. **Persist auth** — localStorage tren FE, database token hoac Sanctum tren BE
5. **Implement import Excel** — dung phpspreadsheet (da co trong composer.json)

### Uu tien trung binh (lam sau khi core chay)
6. **Implement export Word** — dung phpoffice/phpword voi template .docx
7. **Hoan thien cham diem** — them UI cham diem hoi dong, tinh trung binh
8. **SV login** — them mat khau cho sinhvien, hoac login bang MSSV + password mac dinh

### Uu tien thap (polish)
9. **Them ThesisForm CRUD hoan chinh** — da co model, can ket noi voi flow chinh
10. **Export danh sach bao ve** — Excel/PDF
11. **UI/UX polish** — responsive, loading states, error messages

---

## 5. Tom tat quyet dinh

| Cau hoi | Quyet dinh | Ly do |
|---------|-----------|-------|
| API structure | apiResource + custom routes, tach controller | Code hien tai qua lon trong 1 file, kho bao tri |
| React state | Context API (giu nguyen) | Project nho, khong can Redux/Zustand |
| Multi-role lecturer | isAdmin flag + role-per-context (HD/PB/HĐ tu query) | GV co nhieu vai tro cung luc, khong the gan 1 role |
| File storage | Local disk (storage/app/) | Shared hosting, file nho, xu ly xong xoa |
| Scoring | Luu thang len bang detai, bang diem la log chi tiet | Don gian, code hien tai da lam dung |
| CORS | Cung origin (React build trong public/) | Tranh CORS, deploy don gian |
| Auth | Custom token + DB table (hoac Sanctum neu kip) | Cache file khong on dinh, can persist |
| Hosting | Shared hosting, React + Laravel cung 1 domain | Thay ho tro hosting, chi co 1 domain |

---

*Ghi chu: Document nay dua tren phan tich code hien tai (api.php, models, SQL dump) va yeu cau tu PROJECT.md. Cap nhat khi co thay doi.*
