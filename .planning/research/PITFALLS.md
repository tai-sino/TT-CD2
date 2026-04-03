# Pitfalls: TT-CD2 Thesis Management

> Ghi chú các lỗi thường gặp, gotchas kỹ thuật, và cách tránh khi xây dựng hệ thống.
> Cập nhật khi phát hiện thêm vấn đề mới trong quá trình code.

---

## Critical Pitfalls (Sẽ Hỏng Nếu Không Xử Lý)

### 1. File mẫu Word là .doc, không phải .docx

**Vấn đề:** Các file template từ thầy (`docs/thesis/`) đều là `.doc` (Word 97-2003 format). PHPWord `TemplateProcessor` chỉ hỗ trợ `.docx` (Office Open XML). Nếu dùng file `.doc` trực tiếp sẽ crash hoặc output rỗng.

**Giải pháp:**
- Đã có bản `.docx` được convert sẵn trong `docs/huong_dan/huong_dan/` — dùng bản này.
- Khi dùng TemplateProcessor, chỉ truyền file `.docx`.
- Giữ file `.doc` gốc trong `docs/thesis/` để tham khảo, KHÔNG dùng để fill data.

### 2. PHPWord TemplateProcessor — Placeholder bị tách thành nhiều XML runs

**Vấn đề:** Đây là bug phổ biến nhất của PHPWord. Khi soạn template trong Word, nếu gõ `${ten_sv}` rồi chỉnh font/format giữa chừng, Word sẽ tách thành nhiều XML run: `<w:r>${</w:r><w:r>ten_sv</w:r><w:r>}</w:r>`. Khi đó `setValue('ten_sv', ...)` sẽ không tìm thấy placeholder → data không được fill vào.

**Giải pháp:**
- Khi soạn template .docx: gõ placeholder 1 lần, KHÔNG chỉnh sửa lại từng ký tự.
- Cách an toàn nhất: copy-paste placeholder từ file text vào Word.
- Sau khi soạn xong, mở file .docx (thực chất là zip) → đọc `word/document.xml` → kiểm tra placeholder có bị tách không.
- PHPWord 1.x có method `setMacroOpeningChars()` và `setMacroClosingChars()` — có thể đổi ký tự placeholder thành đơn giản hơn (vd: `#ten_sv#` thay vì `${ten_sv}`). Ký tự đơn giản ít bị tách hơn.
- Nếu vẫn bị tách: clean XML bằng cách merge runs trước khi setValue. Có thể tự viết hàm hoặc tìm snippet trên GitHub issues của PHPWord.

### 3. Sanctum SPA Auth — Cookie không gửi, 419 CSRF

**Vấn đề:** Laravel Sanctum cho SPA dùng cookie-based auth. Nếu config sai, cookie sẽ không được browser gửi → mọi request đều trả 401/419. Đây là lỗi phổ biến nhất khi dùng Sanctum + React SPA.

**Các chỗ HAY SAI:**
- `SANCTUM_STATEFUL_DOMAINS` trong `.env` thiếu port. Dev thường quên: `localhost:5173` (Vite) khác `localhost` khác `localhost:3000`.
- `SESSION_DOMAIN` trong `.env` phải set đúng (`.localhost` cho dev, `.yourdomain.io.vn` cho prod).
- `SESSION_DRIVER` phải là `cookie` hoặc `database`, không phải `file` (trên shared hosting có thể lỗi permission).
- `config/cors.php`: `supports_credentials` phải là `true`.
- React side: Axios phải set `withCredentials: true` cho mọi request.
- Phải gọi `GET /sanctum/csrf-cookie` trước khi login — nhiều người quên bước này.

**Giải pháp:**
```
# .env (dev)
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
SESSION_DRIVER=cookie

# .env (prod)
SANCTUM_STATEFUL_DOMAINS=yourdomain.io.vn
SESSION_DOMAIN=.yourdomain.io.vn
```

```php
// config/cors.php
'supports_credentials' => true,
'allowed_origins' => ['http://localhost:5173'], // prod: domain thật
```

```javascript
// axios config
axios.defaults.withCredentials = true;
// Trước khi login:
await axios.get('/sanctum/csrf-cookie');
await axios.post('/login', { email, password });
```

### 4. Import Excel — File từ trường có format lộn xộn

**Vấn đề:** File Excel từ Phòng Đào tạo (`Chốt_DSSV_GVHD_TenDeTai_LVTN_Dot2_17112025.xlsx`) thường có:
- Header bị merged cells (vd: "DANH SÁCH SINH VIÊN" merge cả dòng)
- Nhiều dòng trống ở đầu trước khi đến data thật
- Tên cột bằng tiếng Việt có dấu, viết HOA, có khoảng trắng thừa
- Có thể có nhiều sheet, data nằm ở sheet không phải sheet đầu
- Số điện thoại bắt đầu bằng 0 nhưng Excel tự convert thành number → mất số 0

**Giải pháp:**
- KHÔNG dùng `WithHeadingRow` — heading sẽ sai vì merged cells và tiếng Việt.
- Dùng `ToCollection` hoặc `ToArray`, tự xác định dòng bắt đầu data.
- Skip N dòng đầu (đếm từ file mẫu), đọc từ dòng có data thật.
- Validate từng dòng: check MSSV format, tên không rỗng.
- Số điện thoại: ép kiểu string, prefix '0' nếu thiếu.
- Nên có nút "Preview" trước khi import thật — cho user xem data sẽ import, confirm rồi mới lưu DB.

### 5. Một GV đảm nhiều vai trò cùng lúc

**Vấn đề:** Thầy A vừa là GVHD nhóm 1, vừa là GVPB nhóm 2, vừa là thành viên hội đồng nhóm 3. Nếu thiết kế role cứng (1 user = 1 role) sẽ không hoạt động.

**Giải pháp:**
- KHÔNG gắn role vào bảng users kiểu `role: 'gvhd'`.
- Dùng cách: mỗi user có 1 `type` cơ bản (admin/lecturer/student). Lecturer tự động có quyền GVHD/GVPB tùy theo data (được phân công HD hay PB).
- Kiểm tra quyền dựa trên relationship, không dựa trên role field:
  - "User này có phải GVHD của topic X không?" → check bảng topics/assignments
  - "User này có phải GVPB của topic Y không?" → check bảng review_assignments
  - "User này có trong hội đồng Z không?" → check bảng council_members
- Menu/dashboard: hiển thị tất cả chức năng mà GV đang có (HD + PB + HĐ).

---

## Common Mistakes (Dễ Mắc Phải)

### 6. PHPWord — Tiếng Việt hiển thị sai trong file xuất

**Vấn đề:** Khi `setValue()` với text tiếng Việt, output có thể bị lỗi font hoặc hiển thị sai ký tự đặc biệt (ă, ơ, ư, đ...).

**Giải pháp:**
- Đảm bảo file template .docx dùng font hỗ trợ Unicode (Times New Roman, Arial — KHÔNG dùng font lạ).
- PHP string phải là UTF-8 (Laravel mặc định UTF-8 nên thường OK).
- Escape ký tự XML đặc biệt trước khi setValue: `&`, `<`, `>`, `"`, `'` cần escape thành `&amp;`, `&lt;`, `&gt;`...
- PHPWord 1.x tự xử lý escape, nhưng kiểm tra lại nếu output bị lỗi.
- Test với tên có dấu đầy đủ: "Nguyễn Thị Hồng Nhung", "Trần Đức Anh", "Lê Phước Đại".

### 7. Rounding điểm — Mỗi trường có quy tắc riêng

**Vấn đề:** Công thức 20% HD + 20% PB + 60% HĐ sẽ ra số thập phân. Làm tròn sai = sai điểm = nghiêm trọng.

**Giải pháp:**
- Hỏi thầy rõ quy tắc làm tròn: 1 chữ số thập phân? 2 chữ số? Làm tròn lên/xuống/4-5?
- Mặc định: dùng `round($score, 1)` (1 chữ số thập phân, PHP round half up).
- Lưu điểm thành phần với 2 decimal (`DECIMAL(4,2)` trong MySQL).
- Lưu điểm tổng kết cũng 2 decimal, chỉ làm tròn khi hiển thị.
- KHÔNG dùng `float` trong MySQL — dùng `DECIMAL` để tránh lỗi floating point.

### 8. React SPA + Laravel API — Routing conflict

**Vấn đề:** React SPA dùng client-side routing (React Router). Khi user refresh page ở `/students/123`, server sẽ tìm route `/students/123` → 404 vì đó là React route, không phải Laravel route.

**Giải pháp:**
- Laravel catch-all route cho SPA: trả về `index.html` cho mọi route không phải `/api/*`.
```php
// web.php — đặt cuối cùng
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '.*');
```
- Hoặc dùng .htaccess redirect.
- API routes đặt prefix `/api/` rõ ràng, SPA routes là phần còn lại.

### 9. CORS khi dev — React chạy port khác Laravel

**Vấn đề:** Dev thường chạy React ở `localhost:5173` (Vite) và Laravel ở `localhost:8000`. Browser block cross-origin request.

**Giải pháp:**
- Config `config/cors.php` cho phép origin `http://localhost:5173`.
- HOẶC dùng Vite proxy — config `vite.config.js`:
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:8000',
    '/sanctum': 'http://localhost:8000',
  }
}
```
- Proxy approach đơn giản hơn, không cần lo CORS khi dev.

### 10. Migration — Quên foreign key hoặc sai thứ tự

**Vấn đề:** Laravel migration chạy theo thứ tự timestamp. Nếu tạo bảng `topics` reference `students` nhưng migration `topics` chạy trước `students` → error.

**Giải pháp:**
- Đặt tên migration theo đúng thứ tự dependency.
- Bảng không phụ thuộc gì tạo trước: users, students, lecturers.
- Bảng có foreign key tạo sau: topics, assignments, scores, councils.
- Nếu lỡ sai thứ tự: đổi timestamp trong tên file migration.

---

## Vietnamese-Specific Gotchas

### 11. Tên tiếng Việt — Sắp xếp và tìm kiếm

**Vấn đề:** Sắp xếp theo alphabet tiếng Việt khác tiếng Anh. "Đ" đứng sau "D", "Ơ" sau "O". MySQL mặc định sort theo `utf8mb4_0900_ai_ci` (Unicode standard) — có thể khác thứ tự mong đợi của người Việt.

**Giải pháp:**
- Dùng collation `utf8mb4_unicode_ci` hoặc `utf8mb4_vietnamese_ci` cho MySQL.
- Set trong migration hoặc `config/database.php`:
```php
'charset' => 'utf8mb4',
'collation' => 'utf8mb4_unicode_ci',
```
- Nếu cần sort chính xác theo tên Việt Nam (sort theo tên, không phải họ): tách field `ho`, `ten` riêng, sort theo `ten` trước.

### 12. Tên file có tiếng Việt — Download bị lỗi

**Vấn đề:** Khi export file Word/Excel với tên chứa tiếng Việt (`Phiếu chấm_Nguyễn Văn A.docx`), browser có thể hiển thị tên file sai hoặc download bị lỗi.

**Giải pháp:**
- Dùng ASCII cho tên file download, kèm header RFC 5987:
```php
$filename = 'Phieu_cham_Nguyen_Van_A.docx';
$encodedFilename = rawurlencode('Phiếu chấm_Nguyễn Văn A.docx');
return response()->download($path, $filename, [
    'Content-Disposition' => "attachment; filename=\"$filename\"; filename*=UTF-8''$encodedFilename"
]);
```
- Hoặc đơn giản: dùng tên file không dấu luôn (`Phieu_cham_Nguyen_Van_A.docx`).

### 13. MSSV và format số trong Excel

**Vấn đề:** MSSV dạng `DH52100123` thì OK, nhưng nếu có MSSV thuần số `2100123` thì Excel tự convert thành number → mất leading zero hoặc hiển thị dạng scientific notation.

**Giải pháp:**
- Khi import: đọc cell value as string, không để auto-detect type.
- Với phpspreadsheet: `$cell->getFormattedValue()` hoặc cast `(string)$cellValue`.
- Validate MSSV format sau khi import: regex check pattern.

### 14. Ngày tháng format Việt Nam

**Vấn đề:** Việt Nam dùng `dd/mm/yyyy`, Laravel/MySQL dùng `yyyy-mm-dd`. Excel có thể lưu ngày dạng serial number (45000 = 2023-03-14).

**Giải pháp:**
- Lưu DB luôn dùng `DATE` type (yyyy-mm-dd).
- Hiển thị ra FE: format `dd/mm/yyyy` bằng JavaScript hoặc Carbon.
- Import Excel: dùng `PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value)` để convert serial number.
- Form input: dùng date picker, tránh để user gõ tay.

---

## Library-Specific Issues

### 15. phpoffice/phpword ^1.4

**Đã cài trong project.**

- `TemplateProcessor` chỉ hỗ trợ `.docx`, không hỗ trợ `.doc`.
- `setValue()` case-sensitive — `${Ten_SV}` khác `${ten_sv}`.
- `cloneRow()` dùng để nhân bản dòng trong bảng — cần placeholder trong cùng 1 table row.
- `cloneBlock()` dùng để nhân bản đoạn văn bản.
- Không hỗ trợ fill data vào checkbox hoặc dropdown trong Word.
- Output file nên đặt tên khác input file — ghi đè input sẽ corrupt.

### 16. phpoffice/phpspreadsheet ^5.5

**Đã cài trong project** (thay thế maatwebsite/excel).

- Đọc file lớn (>1000 dòng) có thể tốn nhiều RAM — dùng `ReadFilter` để giới hạn.
- Merged cells: `getMergeCells()` trả về range, cell con trong merge range giá trị null — chỉ cell đầu tiên có value.
- `getCalculatedValue()` có thể chậm nếu file có nhiều formula.
- File `.xls` (Excel 97) cần reader riêng: `new Xls()`, file `.xlsx` dùng `new Xlsx()`.

### 17. Laravel Sanctum (chưa cài, cần cài)

- Sanctum SPA auth yêu cầu frontend và backend cùng domain hoặc subdomain (ví dụ: `api.domain.com` và `app.domain.com`).
- Nếu khác domain hoàn toàn → cookie sẽ không work → phải dùng token-based auth thay cookie.
- Token-based đơn giản hơn cho deploy nhưng kém secure hơn cho SPA.
- `EnsureFrontendRequestsAreStateful` middleware phải có trong API middleware group.

---

## Deployment Gotchas

### 18. Laravel trên Shared Hosting (cPanel)

**Vấn đề chính:** Shared hosting thường chỉ cho public access vào `public_html/`. Laravel cần `public/` folder là web root, nhưng code nằm ở ngoài.

**Giải pháp (2 cách):**

**Cách 1: Symlink / Document Root** (nếu hosting cho đổi)
- Upload toàn bộ Laravel vào `home/` (ngoài `public_html`).
- Đổi document root của domain trỏ vào `home/laravel-project/public/`.

**Cách 2: Copy public/** (phổ biến hơn trên shared hosting)
- Upload toàn bộ Laravel vào `home/laravel-app/`.
- Copy nội dung `public/` vào `public_html/`.
- Sửa `public_html/index.php`:
```php
// Sửa 2 dòng path:
require __DIR__.'/../laravel-app/vendor/autoload.php';
$app = require_once __DIR__.'/../laravel-app/bootstrap/app.php';
```

### 19. React Build + Laravel trên cùng domain

**Vấn đề:** React build ra thư mục `dist/` hoặc `build/` với `index.html` + JS/CSS. Cần serve cùng domain với Laravel API.

**Giải pháp:**
- Build React → copy output vào Laravel `public/` folder.
- Laravel catch-all route serve `index.html` cho non-API routes.
- Cấu trúc trên hosting:
```
public_html/
├── index.html          (React)
├── assets/             (React JS/CSS)
├── index.php           (Laravel entry)
├── .htaccess           (rewrite rules)
```
- `.htaccess` phải ưu tiên: file thật → Laravel API → React SPA.

### 20. .htaccess cho SPA + API trên Apache

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On

    # Nếu file/folder thật tồn tại → serve trực tiếp
    RewriteCond %{REQUEST_FILENAME} -f [OR]
    RewriteCond %{REQUEST_FILENAME} -d
    RewriteRule ^ - [L]

    # API routes → Laravel
    RewriteRule ^api/ index.php [L]
    RewriteRule ^sanctum/ index.php [L]

    # Còn lại → React SPA
    RewriteRule ^ index.html [L]
</IfModule>
```

### 21. PHP version và extensions trên shared hosting

**Vấn đề:** Shared hosting có thể chạy PHP cũ hoặc thiếu extensions.

**Cần kiểm tra:**
- PHP >= 8.2 (Laravel 12 yêu cầu)
- Extensions: `zip` (PHPWord cần), `gd` hoặc `imagick`, `mbstring`, `xml`, `dom`
- `memory_limit` >= 128M (import Excel lớn cần nhiều RAM)
- `max_execution_time` >= 60 (export Word/Excel có thể chậm)
- `upload_max_filesize` >= 10M (file Excel từ trường có thể lớn)

### 22. .env và Storage trên shared hosting

- `.env` phải CHMOD 600 (chỉ owner đọc).
- `storage/` và `bootstrap/cache/` cần quyền ghi (CHMOD 775).
- Nếu hosting không cho `php artisan` → chạy migration qua route tạm (xóa sau).
- Symlink `storage/app/public` → `public/storage`: dùng `php artisan storage:link` hoặc tạo symlink thủ công.

---

## Checklist Trước Khi Code

- [ ] Template .docx (không phải .doc) có placeholder không bị tách XML runs
- [ ] Sanctum config đúng stateful domains + CORS + credentials
- [ ] File Excel mẫu đã phân tích: dòng nào là header, dòng nào bắt đầu data, merged cells ở đâu
- [ ] Database dùng DECIMAL cho điểm, utf8mb4 cho text
- [ ] User model xử lý multi-role dựa trên relationship, không dựa trên role field cứng
- [ ] Hosting có PHP 8.2+, zip extension, đủ memory
- [ ] .htaccess xử lý đúng SPA route + API route

---

*Cập nhật lần cuối: 2026-04-03 — Khởi tạo từ research phase*
