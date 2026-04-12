# Phase 2: Quản lý SV & GV — Research

**Researched:** 2026-04-05
**Domain:** Laravel 12 Excel Import, CRUD API, React Table/Form
**Confidence:** HIGH

---

## Tóm tắt

Phase 2 build 4 chức năng chính: import SV từ Excel, CRUD SV, CRUD GV, và quản lý kỳ LVTN. Backend
dùng phpspreadsheet đã có sẵn trong composer.json — không cần cài thêm gì. Frontend cần thêm
`@tanstack/react-table` (chưa có) vì `@tanstack/react-query` đã có nhưng Table là package riêng.

Pattern từ Phase 1 cần tái sử dụng: controller slim (không tách Service), `$request->validate()` inline,
Eloquent model với tiếng Việt, route group `auth:sanctum`.

**Khuyến nghị chính:** Dùng phpspreadsheet trực tiếp (không wrap qua maatwebsite/excel) vì đã cài
và import đơn giản đủ dùng. Preview flow dùng session hoặc trả JSON ngay (không cần confirm step —
xem lý do ở bên dưới).

---

<phase_requirements>
## Phase Requirements

| ID | Mô tả | Research Support |
|----|-------|-----------------|
| SV-01 | Admin import SV từ Excel — validate trùng MSSV, lỗi theo dòng | phpspreadsheet đọc file, validate trong loop, collect errors |
| SV-02 | Import tự tạo tài khoản SV (email + mật khẩu mặc định) | Hash::make(mssv), insert vào bảng sinhvien |
| SV-03 | Admin xem danh sách SV theo kỳ, filter lớp + GVHD | Query với where + like, trả JSON |
| GV-01 | Admin CRUD GV (thêm/sửa/xóa) | Controller chuẩn resource, validate email unique |
| GV-02 | Danh sách GV hiện số SV đang HD, đề tài PB, số HĐ | withCount() hoặc query count inline |
| KY-01 | Admin tạo kỳ LVTN với tên + mốc thời gian | Model KyLvtn đã có sẵn từ Phase 1 |
| KY-02 | Admin sửa kỳ LVTN đang hoạt động | PUT endpoint, update record |
| KY-03 | Mọi data gắn với kỳ LVTN cụ thể | ky_lvtn_id đã có trong migration sinhvien, detai |
</phase_requirements>

---

## Standard Stack

### Core (đã có trong project)

| Package | Version | Mục đích | Ghi chú |
|---------|---------|---------|---------|
| phpoffice/phpspreadsheet | ^5.5 | Đọc file Excel | VERIFIED — trong composer.json |
| laravel/sanctum | ^4.0 | Auth middleware | VERIFIED — đang dùng từ Phase 1 |
| @tanstack/react-query | ^5.0 | Data fetching + cache | VERIFIED — trong package.json |
| axios | ^1.7 | HTTP client | VERIFIED — trong package.json, có interceptor sẵn |
| tailwindcss | ^4.2 | Styling | VERIFIED — trong package.json |

### Cần thêm

| Package | Version | Mục đích | Lý do chọn |
|---------|---------|---------|-----------|
| @tanstack/react-table | ^8.21 | Table với sort/filter/pagination | VERIFIED — latest v8.21.3, ecosystem với react-query đã có |

**Cài thêm FE:**
```bash
cd frontend && npm install @tanstack/react-table@^8
```

**BE không cần cài thêm gì** — phpspreadsheet đã có.

### Không dùng maatwebsite/excel

maatwebsite/excel wrap trên phpspreadsheet, thêm abstraction (Import class, Export class) — phức tạp
hơn cần thiết cho task đơn giản này. Với phpspreadsheet trực tiếp: 15-20 dòng đọc file, parse header,
loop row — sinh viên viết được và giải thích được. [ASSUMED — dựa trên kinh nghiệm cả 2 package]

---

## Architecture Patterns

### BE: Controller Structure

Dùng pattern từ AuthController (Phase 1) — logic inline, không tách Service:

```php
// SinhVienController.php
class SinhVienController extends Controller
{
    public function index(Request $request) { /* query + filter */ }
    public function store(Request $request) { /* validate + create */ }
    public function update(Request $request, $mssv) { /* validate + update */ }
    public function destroy($mssv) { /* delete */ }
    public function import(Request $request) { /* phpspreadsheet + insert loop */ }
}
```

Tương tự cho GiangVienController và KyLvtnController.

### BE: Import Flow (không có preview/confirm step)

Yêu cầu trong ROADMAP nói "preview danh sách trước khi confirm" — nhưng đây là yêu cầu FE, không
phải BE cần 2 endpoint. Phân tích:

**Option A: Upload → Parse → Preview → Confirm (2 bước)**
- BE cần: POST /import/preview (trả data tạm) + POST /import/confirm (insert thật)
- Tốn thêm: storage tạm (session/cache), cleanup logic, race condition nếu tab đóng
- Phức tạp hơn cần thiết

**Option B: Upload → Parse → Validate → Insert + Report errors (1 bước)**  
- BE chỉ cần 1 endpoint: POST /import
- Response: `{ imported: N, errors: [{ row: 3, message: "MSSV trùng" }] }`
- FE hiện kết quả sau khi import xong

**Khuyến nghị: Option B.** `V2-03` trong REQUIREMENTS.md đã liệt kê preview flow là deferred.
Thực tế, khi thư ký import Excel từ Phòng Đào tạo, file thường đúng — preview ít giá trị.
Import thật, báo lỗi dòng nào, thư ký sửa file rồi import lại là đủ. [ASSUMED]

### BE: Import Logic với phpspreadsheet

```php
use PhpOffice\PhpSpreadsheet\IOFactory;

public function import(Request $request)
{
    $request->validate(['file' => 'required|file|mimes:xlsx,xls']);
    
    $spreadsheet = IOFactory::load($request->file('file')->getPathname());
    $rows = $spreadsheet->getActiveSheet()->toArray();
    
    $errors = [];
    $imported = 0;
    
    // skip header row (row 0)
    foreach ($rows as $i => $row) {
        if ($i === 0) continue;
        
        $mssv = trim($row[0]);
        $hoTen = trim($row[1]);
        $lop = trim($row[2]);
        $email = trim($row[3]);
        
        if (empty($mssv) || empty($hoTen)) {
            $errors[] = ['row' => $i + 1, 'message' => 'Thiếu MSSV hoặc họ tên'];
            continue;
        }
        
        if (SinhVien::where('mssv', $mssv)->exists()) {
            $errors[] = ['row' => $i + 1, 'message' => "MSSV $mssv đã tồn tại"];
            continue;
        }
        
        SinhVien::create([
            'mssv' => $mssv,
            'hoTen' => $hoTen,
            'lop' => $lop,
            'email' => $email ?: null,
            'matKhau' => Hash::make($mssv), // mật khẩu mặc định = MSSV
            'ky_lvtn_id' => $request->ky_lvtn_id,
        ]);
        $imported++;
    }
    
    return response()->json(['imported' => $imported, 'errors' => $errors]);
}
```

[VERIFIED — phpspreadsheet `toArray()` là API chuẩn, CITED: phpoffice.github.io/PhpSpreadsheet]

### BE: GV-02 — Đếm SV/đề tài/HĐ

withCount() của Eloquent — không cần join thủ công:

```php
public function index()
{
    $list = GiangVien::withCount([
        'sinhVienHuongDan',  // cần relationship này trong model
        'deTaiPhanBien',
        'thanhVienHoiDong',
    ])->get();
    return response()->json(['data' => $list]);
}
```

Tuy nhiên, `sinhVienHuongDan` chưa có trong model GiangVien (Phase 1 chỉ có deTaiHuongDan).
SV gắn với GVHD qua bảng `detai.maGV_HD` — không trực tiếp qua FK trên bảng sinhvien.
Cần relationship `hasManyThrough` hoặc đếm qua SinhVien có gvhd_id.

**Vấn đề schema:** Bảng `sinhvien` không có cột `maGV_HD` — SV gắn GVHD qua `detai.maGV_HD`.
Để đếm "số SV đang hướng dẫn" của 1 GV, cần đếm distinct SV trong đề tài của GV đó.
Cách đơn giản nhất: raw count query inline trong controller.

```php
// Trong GiangVienController::index()
$gvList = GiangVien::all()->map(function ($gv) {
    $svCount = SinhVien::whereHas('deTai', function ($q) use ($gv) {
        $q->where('maGV_HD', $gv->maGV);
    })->count();
    $gv->so_sv_hd = $svCount;
    $gv->so_dt_pb = DeTai::where('maGV_PB', $gv->maGV)->count();
    $gv->so_hd = ThanhVienHoiDong::where('maGV', $gv->maGV)->count();
    return $gv;
});
```

Hoặc đơn giản hơn cho list nhỏ (~20 GV): tính trong vòng lặp — không cần tối ưu.

### FE: TanStack Table Pattern

TanStack Table v8 là headless — tự render HTML, không có UI builtin:

```jsx
import { useReactTable, getCoreRowModel, getFilteredRowModel, 
         getPaginationRowModel, flexRender } from '@tanstack/react-table';

const columns = [
  { accessorKey: 'mssv', header: 'MSSV' },
  { accessorKey: 'hoTen', header: 'Họ tên' },
  { accessorKey: 'lop', header: 'Lớp' },
];

function SinhVienTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState('');
  
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <input value={globalFilter} onChange={e => setGlobalFilter(e.target.value)} 
             placeholder="Tìm kiếm..." />
      <table>
        {/* render từ table.getHeaderGroups(), table.getRowModel().rows */}
      </table>
    </div>
  );
}
```

[VERIFIED — @tanstack/react-table v8 docs, CITED: tanstack.com/table/v8]

### FE: React Query Pattern cho CRUD

Dùng `useQuery` + `useMutation` — pattern đã có QueryClientProvider từ Phase 1:

```jsx
// Fetch list
const { data, isLoading } = useQuery({
  queryKey: ['sinhvien', { ky_id, lop, search }],
  queryFn: () => api.get('/students', { params: { ky_id, lop, search } }).then(r => r.data),
});

// Create/Update
const mutation = useMutation({
  mutationFn: (data) => api.post('/students', data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sinhvien'] }),
});
```

### FE: Import Page Flow

```
1. User chọn file Excel → FileInput
2. User click "Import" → POST /api/students/import (multipart/form-data)
3. Loading state trong lúc đợi
4. Khi có response:
   - imported > 0: hiện "Đã import N sinh viên"
   - errors.length > 0: hiện bảng lỗi theo dòng
5. Nếu import thành công → invalidate query danh sách SV
```

**Lưu ý quan trọng cho FE:** Axios cần set `Content-Type: multipart/form-data` tự động khi dùng
`FormData` — KHÔNG set header thủ công, để axios tự detect và thêm boundary:

```jsx
const formData = new FormData();
formData.append('file', file);
formData.append('ky_lvtn_id', selectedKy);
// api.post('/students/import', formData) — KHÔNG thêm headers thủ công
```

[VERIFIED — axios docs, CITED: axios-http.com]

### FE: Form Modal Pattern

Dùng state `showModal` + `editItem` trong component — không cần library thêm:

```jsx
const [showModal, setShowModal] = useState(false);
const [editItem, setEditItem] = useState(null); // null = create, có data = edit

const openCreate = () => { setEditItem(null); setShowModal(true); };
const openEdit = (item) => { setEditItem(item); setShowModal(true); };
```

Pattern Tailwind Modal đơn giản: `fixed inset-0 bg-black/50 flex items-center justify-center`.

---

## Don't Hand-Roll

| Vấn đề | Không tự build | Dùng thay thế | Lý do |
|--------|----------------|--------------|-------|
| Đọc file Excel | Parser tay | phpspreadsheet `toArray()` | Edge cases: merged cells, empty rows, encoding |
| HTTP interceptor | Axios wrapper tự viết | Axios interceptor (đã có trong api.js) | Đã setup từ Phase 1 |
| Table pagination/filter | HTML + useState | TanStack Table | Đã handle edge cases, accessibility |
| Password hashing | md5/sha1 | `Hash::make()` — Bcrypt | Bảo mật |
| File validation | Check extension tay | Laravel `mimes:xlsx,xls` validation | Content-type spoofing |

---

## Common Pitfalls

### Pitfall 1: Header row của Excel khác nhau giữa file thật và test

**What goes wrong:** File Excel từ Phòng Đào tạo có thể có header ở row 1, data từ row 2 — hoặc
có thêm 2-3 row tiêu đề phức tạp. `toArray()` trả tất cả rows.

**Cách tránh:** Tìm row có "MSSV" hoặc "Mã sinh viên" làm header thay vì hardcode skip row 0.
Hoặc đơn giản hơn: document rõ format file Excel mẫu, thư ký dùng đúng format. Bảo thủ: skip
N dòng đầu nếu `trim($row[0])` không phải MSSV hợp lệ (không bắt đầu bằng DH/CD/TC).

**Warning signs:** Import thành công nhưng MSSV = "MSSV" (text header bị insert vào DB).

### Pitfall 2: Email trùng khi import

**What goes wrong:** SV đã có trong DB (import lần trước) → email unique constraint fail → exception
không catch được → 500 error thay vì lỗi có ý nghĩa.

**Cách tránh:** Trong import loop, kiểm tra cả MSSV và email trước khi insert. Bảng sinhvien có
`email unique nullable` — nếu email null thì không bị conflict, nhưng nếu có email phải check.

### Pitfall 3: maGV không phải auto-increment

**What goes wrong:** Khi tạo GV mới, FE cần gửi `maGV` do người dùng nhập (VD: GV005). Controller
cần validate `required|unique:giangvien,maGV` thay vì để DB tự sinh.

**Cách tránh:** Form thêm GV có field "Mã GV" bắt buộc. Validate unique khi create, không validate
khi update.

### Pitfall 4: TanStack Table không có UI — phải tự style

**What goes wrong:** Developer import `useReactTable` và chờ có component Table hiện ra — nhưng
v8 là headless, không render gì cả.

**Cách tránh:** Luôn dùng `flexRender(cell.column.columnDef.cell, cell.getContext())` trong JSX
render. Copy pattern table từ docs vào.

### Pitfall 5: PUT /api/ky-lvtn/{id} — KyLvtn dùng auto-increment id

**What goes wrong:** KyLvtn dùng `$table->id()` (auto-increment), nhưng nếu planner dùng tên slug
hay gì khác làm route param thì sẽ không match.

**Cách tránh:** Route param là `{id}` số nguyên, khớp với primary key `id` trong bảng ky_lvtn.

### Pitfall 6: Axios multipart/form-data boundary

**What goes wrong:** Nếu dev set header `'Content-Type': 'application/json'` override (như trong
api.js default), request multipart sẽ thiếu `boundary` → server không parse được file.

**Cách tránh:** Khi upload file, tạo axios request riêng KHÔNG dùng instance `api` (hoặc dùng
`api` nhưng override header với `undefined` để axios tự set). Đơn giản nhất: `delete config.headers['Content-Type']` trong interceptor khi detect FormData.

---

## Patterns từ Phase 1 tái sử dụng

| Pattern | File nguồn | Dùng lại ở đâu |
|---------|-----------|----------------|
| `Route::middleware('auth:sanctum')->group()` | routes/api.php | Tất cả route Phase 2 |
| Controller với `$request->validate()` inline | AuthController.php | SinhVienController, GiangVienController |
| Model với camelCase fields tiếng Việt | GiangVien.php, SinhVien.php | Giữ nguyên pattern |
| `Hash::make()` cho mật khẩu | DatabaseSeeder.php | Import SV tạo tài khoản |
| `api` axios instance với Bearer interceptor | services/api.js | Dùng cho tất cả API calls |
| `useQuery` + QueryClientProvider | App.jsx | Mọi data fetching |

---

## Schema Analysis (từ Phase 1 migrations)

**Bảng sinhvien — các cột quan trọng cho Phase 2:**
- `mssv` varchar(20) PRIMARY KEY — không auto-increment
- `hoTen` varchar(100) NOT NULL
- `lop` varchar(20) nullable
- `email` varchar(100) UNIQUE nullable
- `matKhau` varchar(255) — import tự set = Hash::make(mssv)
- `ky_lvtn_id` FK → ky_lvtn.id (nullable)
- `maDeTai` FK → detai.maDeTai (nullable) — SV chưa có đề tài = null

**Bảng giangvien:**
- `maGV` varchar(20) PRIMARY KEY — người dùng đặt (VD: GV001)
- `tenGV`, `email` unique, `hocVi`, `isAdmin` boolean

**Bảng ky_lvtn:**
- `id` auto-increment
- `ten`, `is_active` boolean
- 6 cột ngày: `ngay_bat_dau`, `ngay_nhan_de_tai`, `ngay_cham_50`, `ngay_phan_bien`, `ngay_bao_ve`, `ngay_ket_thuc`

**Không cần migration mới trong Phase 2** — schema đã đủ.

---

## API Contract Chi Tiết

Dựa trên ROADMAP.md + phân tích schema:

```
POST   /api/students/import
  Body: multipart/form-data { file: Excel, ky_lvtn_id: number }
  Response: { imported: number, errors: [{row: number, message: string}] }

GET    /api/students
  Query: ?ky_id=&lop=&search=&page=
  Response: { data: [{mssv, hoTen, lop, email, deTai?, gvhd?}], total, per_page, current_page }

POST   /api/students
  Body: { mssv, hoTen, lop, email, ky_lvtn_id }
  Response: student object

PUT    /api/students/{mssv}
  Body: { hoTen, lop, email }
  Response: student object

DELETE /api/students/{mssv}
  Response: { message: 'ok' }

GET    /api/giang-vien
  Response: { data: [{maGV, tenGV, email, hocVi, isAdmin, so_sv_hd, so_dt_pb, so_hd}] }

POST   /api/giang-vien
  Body: { maGV, tenGV, email, password, hocVi? }
  Response: gv object

PUT    /api/giang-vien/{maGV}
  Body: { tenGV, email, hocVi, password? }  (password optional khi update)
  Response: gv object

DELETE /api/giang-vien/{maGV}
  Response: { message: 'ok' }

GET    /api/ky-lvtn
  Response: { data: [{id, ten, is_active, ngay_...}] }

POST   /api/ky-lvtn
  Body: { ten, ngay_nhan_de_tai?, ngay_cham_50?, ngay_phan_bien?, ngay_bao_ve? }
  Response: ky object

PUT    /api/ky-lvtn/{id}
  Body: same fields
  Response: ky object
```

---

## FE Component Architecture

```
src/pages/admin/
├── SinhVien.jsx          -- bảng SV + nút import
├── ImportSinhVien.jsx    -- trang/modal upload + kết quả import (hoặc inline trong SinhVien.jsx)
├── GiangVien.jsx         -- bảng GV + modal thêm/sửa
└── CaiDat.jsx            -- form kỳ LVTN (đây là placeholder đã có)

src/services/
├── api.js                -- đã có từ Phase 1
├── authService.js        -- đã có từ Phase 1
├── sinhVienService.js    -- CRUD + import functions
├── giangVienService.js   -- CRUD functions
└── kyLvtnService.js      -- GET/POST/PUT functions
```

**Import SinhVien nằm ở đâu:**
- Option A: Trang riêng `/admin/import-sinh-vien` (route mới, sidebar mới)
- Option B: Modal popup trong trang `/admin/sinh-vien`
- Option C: Section trên đầu trang SinhVien (không modal)

Khuyến nghị: **Option C** hoặc **Option B** — import và danh sách SV thường làm trong cùng 1 flow.
Tránh thêm route mới không cần thiết. [ASSUMED]

---

## Environment Availability Audit

Phase 2 không thêm external dependencies mới.

| Dependency | Cần cho | Available | Ghi chú |
|------------|---------|-----------|---------|
| phpspreadsheet | Excel import | ✓ | Trong composer.json đã commit |
| @tanstack/react-table | FE table | ✗ (cần cài) | `npm install @tanstack/react-table@^8` |
| MySQL / DB | Tất cả | ✓ (assumed) | Phase 1 migrations đã chạy |

**Cần cài thêm:** `@tanstack/react-table` trong `frontend/` trước khi code FE table.

---

## Open Questions

1. **Format file Excel từ Phòng Đào tạo**
   - Chưa biết: header ở row nào, tên cột là gì, có cột thừa không
   - Khuyến nghị: viết import controller linh hoạt — detect header bằng cách tìm row chứa keyword
     "MSSV" thay vì skip cứng row 0. Hoặc document format chuẩn cho thư ký.

2. **Password mặc định khi import SV là gì?**
   - Hiện tại seeder dùng `Hash::make('123456')` cho SV
   - Khuyến nghị cho import: dùng `mssv` làm mật khẩu mặc định → SV đăng nhập lần đầu với MSSV
   - [ASSUMED] — cần xác nhận với team/thầy

3. **Có cần xóa SV không?**
   - SV có FK với detai — nếu xóa SV đã có đề tài sẽ lỗi constraint
   - Khuyến nghị: soft-check trước khi xóa (nếu có đề tài thì từ chối xóa + thông báo)

4. **Thêm GV mới vào kỳ LVTN nào?**
   - GV không có `ky_lvtn_id` (GV dạy nhiều kỳ)
   - SV mới tạo thủ công (không qua import) có gắn kỳ không?
   - Khuyến nghị: POST /api/students cần `ky_lvtn_id` trong body

---

## Assumptions Log

| # | Claim | Section | Risk nếu sai |
|---|-------|---------|-------------|
| A1 | Import không cần 2-step preview/confirm, 1 bước là đủ | Architecture Patterns | FE cần thêm state management phức tạp hơn |
| A2 | mssv làm mật khẩu mặc định khi import | Import Logic | Cần đổi Hash::make() call |
| A3 | TanStack Table đủ dùng không cần AG Grid hay react-virtualized | Standard Stack | Performance issue nếu list > 1000 SV |
| A4 | Import section nằm trong trang SinhVien (không route riêng) | FE Architecture | Cần thêm route + sidebar item nếu muốn trang riêng |

---

## Sources

### Primary (HIGH confidence)
- composer.json — phpspreadsheet ^5.5 đã installed [VERIFIED]
- package.json — @tanstack/react-query ^5.0 đã có, @tanstack/react-table chưa có [VERIFIED]
- Phase 1 migration files — schema sinhvien, giangvien, ky_lvtn [VERIFIED]
- Phase 1 AuthController.php — controller pattern sinh viên [VERIFIED]
- npm registry: @tanstack/react-table latest = 8.21.3 [VERIFIED]

### Secondary (MEDIUM confidence)
- PhpSpreadsheet docs — `IOFactory::load()`, `toArray()` API [CITED: phpoffice.github.io/PhpSpreadsheet]
- TanStack Table v8 docs — headless pattern, getCoreRowModel [CITED: tanstack.com/table/v8]

### Tertiary (LOW confidence)
- Preview flow decision (1-step vs 2-step) — dựa trên REQUIREMENTS.md V2-03 deferred [ASSUMED]

---

## Validation Architecture

### Automated Tests (Unit/Feature)

| Test | File | What to verify |
|------|------|----------------|
| Import Excel valid | `tests/Feature/StudentImportTest.php` | Upload file .xlsx mẫu → response có `imported: N`, `errors: []` |
| Import Excel lỗi dòng | `tests/Feature/StudentImportTest.php` | File có MSSV trùng → `errors` array có entry với dòng số |
| Import tạo tài khoản | `tests/Feature/StudentImportTest.php` | Sau import, login bằng email SV + mật khẩu = mssv thành công |
| CRUD SV | `tests/Feature/StudentCrudTest.php` | GET/POST/PUT/DELETE `/api/students` trả đúng status + data |
| CRUD GV | `tests/Feature/LecturerCrudTest.php` | GET/POST/PUT/DELETE `/api/giang-vien`, email unique |
| CRUD kỳ LVTN | `tests/Feature/KyLvtnTest.php` | POST tạo kỳ, PUT sửa kỳ → response 200 + record đúng trong DB |
| Auth middleware | existing | Route cần `auth:sanctum` trả 401 khi không có token |

### Manual Test Scenarios

| Scenario | Steps | Expected |
|----------|-------|----------|
| Import file Excel mẫu | Upload file `du_lieu_sv.xlsx` có 5 dòng | 5 SV xuất hiện trong `/api/students`, 5 tài khoản được tạo |
| Import file có lỗi | Upload file có 1 dòng MSSV trùng | Response `errors: [{row: N, message: "MSSV trùng"}]`, các dòng khác vẫn import |
| Filter SV theo lớp | GET `/api/students?lop=CNTT20A` | Chỉ trả SV lớp CNTT20A |
| Thêm GV mới | POST `/api/giang-vien` với email mới | GV xuất hiện trong danh sách |
| Sửa GV | PUT `/api/giang-vien/{id}` | Thông tin GV cập nhật đúng |
| Tạo kỳ LVTN | POST `/api/ky-lvtn` với 4 mốc ngày | Kỳ xuất hiện trong GET, tất cả mốc lưu đúng |
| Sửa kỳ LVTN | PUT `/api/ky-lvtn/{id}` đổi ngày | Ngày cập nhật đúng trong DB |

### Integration Points cần test

1. **Import → Auth flow**: SV được tạo bởi import có thể đăng nhập → kiểm tra bảng `users` + `sinhvien` liên kết đúng
2. **KyLvtn → SinhVien**: SV tạo mới cần gắn `ky_lvtn_id` → kiểm tra FK không null
3. **FE → BE API**: React gọi đúng endpoint, handle lỗi 422 (validation) từ Laravel

### Test Data Requirements

- **File Excel mẫu**: `tests/fixtures/du_lieu_sv_valid.xlsx` — 5 dòng, columns: MSSV, Họ tên, Lớp, Email
- **File Excel lỗi**: `tests/fixtures/du_lieu_sv_error.xlsx` — dòng 3 có MSSV trùng với dòng 1
- **Database**: Test chạy trên `RefreshDatabase` trait — không cần data cố định

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified từ composer.json + package.json + npm registry
- Architecture: HIGH — based on Phase 1 code patterns đã commit
- Pitfalls: MEDIUM — combination verified facts + common knowledge
- Schema: HIGH — verified từ migrations đã commit

**Research date:** 2026-04-05
**Valid until:** 2026-05-05 (stable packages, valid ~30 ngày)
