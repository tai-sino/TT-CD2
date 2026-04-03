# Stack: TT-CD2 Thesis Management

> Nghiên cứu ngày 2026-04-03. Tất cả phiên bản đã verify trực tiếp từ Packagist/npm.

---

## Recommended Stack

### Backend — Laravel 12

| Package | Version | Ghi chú |
|---------|---------|---------|
| `laravel/laravel` | 12.12.2 | Skeleton project, yêu cầu PHP ^8.2 |
| `laravel/framework` | ^12.0 (hiện tại 12.56.0) | Core framework |
| PHP | 8.2+ | Bản tối thiểu cho Laravel 12. Dùng 8.2 hoặc 8.3, KHÔNG cần 8.4 |

**Tại sao Laravel 12:**
- Thầy confirm dùng Laravel (không thương lượng)
- Bản mới nhất ổn định, hỗ trợ dài hạn
- Tất cả packages cần dùng đều đã support Laravel 12

**Setup:**
```bash
composer create-project laravel/laravel tt-cd2
```

### Frontend — React 19 (SPA riêng biệt)

| Package | Version | Mục đích |
|---------|---------|----------|
| `react` | 19.2.4 | UI library |
| `react-dom` | 19.2.4 | DOM rendering |
| `react-router` | 7.14.0 | Client-side routing (SPA) |
| `axios` | 1.14.0 | HTTP client gọi Laravel API |
| `@tanstack/react-query` | 5.96.2 | Server state management (cache API responses) |
| `vite` | 8.0.3 | Build tool (dev server + production build) |
| `tailwindcss` | 4.2.2 | CSS framework |

**Tại sao React:**
- Thầy confirm dùng React (PA2), không thương lượng
- Bản 19 ổn định, tất cả ecosystem đã support

**Tại sao react-router 7 (không dùng Next.js/Remix):**
- Project là SPA thuần, không cần SSR
- react-router 7 đủ mạnh cho SPA routing + protected routes
- Đơn giản hơn nhiều so với framework-based solutions
- Deploy dễ hơn trên shared hosting (build ra static files)

**Tại sao @tanstack/react-query:**
- Quản lý API state (loading, error, cache, refetch) tự động
- Giảm boilerplate so với tự quản lý bằng useState + useEffect
- Rất phổ biến, nhiều tài liệu để tham khảo
- Không cần Redux/Zustand — react-query xử lý server state, useState xử lý local state

**Tại sao Tailwind CSS 4:**
- Utility-first, nhanh để style giao diện
- Laravel 12 mặc định dùng Tailwind
- Phổ biến nhất hiện tại, dễ tìm template/component

**Cấu trúc project:** Laravel và React trong cùng 1 repo, nhưng chạy riêng:
- Laravel phục vụ API routes (`/api/*`)
- React build ra static files, có thể serve qua Laravel hoặc riêng
- Dev: Vite dev server cho React (port 5173), Laravel dev server cho API (port 8000)

### Database — MySQL 8.0+

| Thành phần | Phiên bản | Ghi chú |
|------------|-----------|---------|
| MySQL | 8.0+ | Bản đi kèm WAMP/XAMPP đều là 8.0+ |

**Tại sao MySQL:**
- Yêu cầu đề bài, không thương lượng
- Laravel support tốt nhất cho MySQL
- WAMP/XAMPP mặc định dùng MySQL
- Hosting thầy hỗ trợ chắc chắn có MySQL

**Lưu ý:**
- Dùng InnoDB engine (mặc định)
- Charset utf8mb4 cho tiếng Việt có dấu
- Không cần optimize phức tạp — data nhỏ (vài trăm SV/kỳ)

### Excel Import/Export — maatwebsite/excel

| Package | Version | Ghi chú |
|---------|---------|---------|
| `maatwebsite/excel` | 3.1.68 | Dựa trên PhpSpreadsheet |

**Tại sao package này:**
- Package phổ biến nhất cho Laravel import/export Excel (145M+ installs)
- Support Laravel 12 chính thức (composer.json confirm: illuminate/support ^12.0)
- API đơn giản: tạo Import/Export class, dùng `Excel::import()` / `Excel::download()`
- Hỗ trợ .xlsx, .xls, .csv
- Có chunked reading cho file lớn (nhưng project này file nhỏ, không cần)

**Dùng cho:**
- Import DSSV từ file Excel của phòng đào tạo (.xlsx)
- Export danh sách bảo vệ LVTN (nếu cần)

### Word Export — phpoffice/phpword

| Package | Version | Ghi chú |
|---------|---------|---------|
| `phpoffice/phpword` | 1.4.0 | Đọc/ghi .docx, .doc, .odt, .rtf, .html |

**Tại sao package này:**
- Package PHP duy nhất thực sự hỗ trợ đọc/ghi Word (.docx) đầy đủ
- Hỗ trợ template processing — load file .docx mẫu, thay thế placeholder bằng data thực
- 35M+ installs, dùng rộng rãi

**Dùng cho:**
- Xuất phiếu chấm GVHD (Mẫu 01.01, 01.02)
- Xuất phiếu chấm GVPB (Mẫu 02.01, 02.02)
- Xuất tờ nhiệm vụ LVTN (Form_NhiemvuLVTN)

**Cách dùng Template Processor:**
```php
$template = new TemplateProcessor('templates/Mau_01_01.docx');
$template->setValue('ten_sv', $student->name);
$template->setValue('ten_de_tai', $topic->title);
$template->saveAs('output/phieu_cham.docx');
```

**Lưu ý quan trọng:**
- File mẫu gốc từ khoa là `.doc` (Word 97-2003) — cần convert sang `.docx` trước khi dùng làm template
- PHPWord TemplateProcessor chỉ hoạt động tốt với `.docx` (Office Open XML)
- Convert 1 lần bằng Word/LibreOffice, lưu file .docx vào repo

### Authentication (SPA) — Laravel Sanctum

| Package | Version | Ghi chú |
|---------|---------|---------|
| `laravel/sanctum` | 4.3.1 | Đi kèm Laravel 12 mặc định |

**Tại sao Sanctum (KHÔNG dùng JWT):**
- Sanctum là package chính thức của Laravel, đi kèm sẵn khi tạo project
- Sanctum có chế độ SPA Authentication dùng cookie-based sessions — phù hợp khi API và SPA cùng domain/subdomain
- Không cần cài thêm package bên thứ 3 (jwt-auth)
- Setup đơn giản hơn JWT nhiều
- Laravel docs hướng dẫn chi tiết cách dùng Sanctum cho SPA

**Cách hoạt động (SPA mode):**
1. React gọi `/sanctum/csrf-cookie` để lấy CSRF token
2. Gửi login request đến `/api/login` — Laravel tạo session
3. Các request tiếp theo gửi kèm session cookie tự động
4. Không cần quản lý token ở client — browser tự xử lý cookie

**Yêu cầu:**
- API và SPA phải cùng top-level domain (vd: `api.example.com` + `app.example.com`)
- Hoặc chạy cùng domain (Laravel serve cả API lẫn React build)
- Config `SANCTUM_STATEFUL_DOMAINS` trong `.env`

### Role-Based Access Control — spatie/laravel-permission

| Package | Version | Ghi chú |
|---------|---------|---------|
| `spatie/laravel-permission` | 6.25.0 | PHẢI dùng v6, KHÔNG dùng v7 |

**QUAN TRỌNG: Dùng v6, KHÔNG dùng v7:**
- v7 (7.2.4) yêu cầu **PHP ^8.4** — Laravel 12 chỉ yêu cầu PHP ^8.2
- v6 (6.25.0) yêu cầu PHP ^8.0 và support illuminate ^12.0 — hoàn toàn tương thích
- Cài bằng: `composer require spatie/laravel-permission:^6.0`

**Tại sao package này:**
- Package RBAC phổ biến nhất cho Laravel (90M+ installs)
- API đơn giản: `$user->assignRole('admin')`, `$user->hasRole('gvhd')`
- Middleware sẵn: `role:admin`, `permission:edit-students`
- Hoạt động tốt với Laravel Gate/Policy

**4 roles cần tạo:**
1. `admin` — Thư ký khoa
2. `gvhd` — Giảng viên hướng dẫn
3. `gvpb` — Giảng viên phản biện
4. `sv` — Sinh viên

**Lưu ý:** 1 GV có thể vừa là GVHD vừa là GVPB — Spatie cho phép assign nhiều roles cho 1 user.

### Deployment — Shared Hosting

**Cách deploy Laravel + React SPA trên shared hosting:**

1. **Build React** thành static files (`npm run build` → thư mục `dist/`)
2. **Copy `dist/`** vào thư mục `public/` của Laravel (hoặc serve riêng)
3. **Laravel API** chạy trên hosting bình thường
4. React SPA gọi API cùng domain → Sanctum cookie auth hoạt động

**Cấu trúc trên hosting:**
```
public_html/
├── index.html          (React SPA entry point)
├── assets/             (React build assets)
├── api/                (symlink hoặc rewrite đến Laravel public/)
```

Hoặc đơn giản hơn: Laravel serve tất cả, route catch-all trả về React index.html.

**Yêu cầu hosting:**
- PHP 8.2+
- MySQL 8.0+
- Composer access (hoặc upload vendor/)
- SSL certificate (cho cookie auth)

---

## What NOT to Use

### KHÔNG dùng `tymon/jwt-auth`
- **Lý do:** Sanctum đã đủ cho SPA auth. JWT phức tạp hơn (token refresh, blacklist, storage). JWT phù hợp cho mobile app hoặc API cho third-party — project này không cần.

### KHÔNG dùng `spatie/laravel-permission` v7
- **Lý do:** v7 yêu cầu PHP ^8.4. Laravel 12 chạy trên PHP 8.2/8.3. Dùng v6.25.0 thay thế.

### KHÔNG dùng Next.js hoặc Remix cho frontend
- **Lý do:** Over-engineering. Project là SPA đơn giản, không cần SSR, ISR, server components. react-router 7 đủ dùng. Deploy Next.js trên shared hosting rất khó.

### KHÔNG dùng Redux hoặc Zustand
- **Lý do:** @tanstack/react-query xử lý server state (95% state trong app này). Local state dùng useState/useContext đủ. Thêm state management library là phức tạp không cần thiết.

### KHÔNG dùng Inertia.js
- **Lý do:** Inertia kết hợp Laravel + React nhưng theo kiểu server-driven (không phải SPA thuần). Thầy yêu cầu React SPA + Laravel API — kiến trúc tách biệt rõ ràng. Inertia cũng khó giải thích trong bảo vệ LVTN nếu thầy hỏi về kiến trúc API.

### KHÔNG dùng Laravel Breeze/Jetstream
- **Lý do:** Breeze scaffold auth UI bằng Blade hoặc Inertia — không phù hợp với React SPA riêng. Jetstream quá phức tạp (teams, two-factor, API tokens). Tự viết auth đơn giản với Sanctum dễ hơn và dễ giải thích hơn.

### KHÔNG dùng TypeScript
- **Lý do:** Thêm complexity không cần thiết cho project 2 tháng. Developer mới với React — TS sẽ chậm tiến độ. Có thể giải thích với thầy nếu hỏi: "em dùng JS vì deadline ngắn, TypeScript sẽ thêm sau nếu có thời gian."

### KHÔNG dùng Repository Pattern / Service Layer Pattern
- **Lý do:** Project nhỏ, logic không phức tạp. Controller + Model đủ rồi. Thêm abstraction layers làm code trông quá "professional" cho sinh viên.

### KHÔNG dùng Laravel Passport
- **Lý do:** Passport dành cho full OAuth2 server (authorization codes, client credentials). Quá phức tạp cho project này. Sanctum là lựa chọn chính thức cho SPA auth.

---

## Tổng hợp packages cần cài

### Composer (Backend)
```bash
composer require laravel/sanctum          # đã có sẵn trong Laravel 12
composer require spatie/laravel-permission:^6.0
composer require maatwebsite/excel
composer require phpoffice/phpword
```

### npm (Frontend)
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install react-router axios @tanstack/react-query
npm install -D tailwindcss @tailwindcss/vite
```

---

## Confidence Levels

| Recommendation | Confidence | Ghi chú |
|----------------|------------|---------|
| Laravel 12 | **Chắc chắn** | Yêu cầu từ thầy, không có lựa chọn khác |
| React 19 | **Chắc chắn** | Yêu cầu từ thầy, phiên bản stable mới nhất |
| MySQL 8.0+ | **Chắc chắn** | Yêu cầu từ thầy, đi kèm WAMP/XAMPP |
| Sanctum 4.x | **Cao** | Package chính thức, đã verify compatibility. Rủi ro duy nhất: nếu hosting config CORS/cookie phức tạp → cần debug |
| spatie/laravel-permission 6.x | **Cao** | Đã verify: v6.25.0 support Laravel 12 + PHP 8.2. Rủi ro: phải nhớ pin v6, không upgrade v7 |
| maatwebsite/excel 3.1 | **Cao** | Đã verify: support Laravel 12. Package chuẩn cho Excel trong Laravel |
| phpoffice/phpword 1.4 | **Trung bình-Cao** | Đã verify: hoạt động tốt với .docx. Rủi ro: file mẫu gốc là .doc → cần convert sang .docx trước. Template phức tạp (bảng, format) có thể cần thử nghiệm |
| react-router 7 | **Cao** | SPA routing chuẩn, stable, phổ biến nhất |
| @tanstack/react-query 5 | **Cao** | Giảm boilerplate API calls đáng kể. Sinh viên có thể giải thích: "em dùng để cache và quản lý API data" |
| Tailwind CSS 4 | **Cao** | CSS framework phổ biến nhất, Laravel mặc định dùng |
| Vite 8 | **Cao** | Build tool mặc định của cả Laravel lẫn React ecosystem |
| Shared hosting deploy | **Trung bình** | Phụ thuộc vào hosting config cụ thể của thầy. Cần test sớm |

---

## Rủi ro cần theo dõi

1. **File .doc → .docx conversion:** File mẫu từ khoa là .doc cũ. PHPWord TemplateProcessor cần .docx. Phải convert thủ công 1 lần và test kỹ output.
2. **Sanctum cookie auth trên hosting:** Cần cùng domain/subdomain. Nếu hosting setup phức tạp, có thể phải fallback sang Sanctum token mode (Bearer token thay vì cookie).
3. **spatie/laravel-permission v6 bị EOL:** v7 đã ra, v6 có thể ngừng nhận patch. Nhưng trong 2 tháng project thì không ảnh hưởng.
4. **React SPA deploy trên shared hosting:** Cần config .htaccess hoặc nginx rewrite cho SPA routing (tất cả routes → index.html). Không khó nhưng cần test.

---

*Tài liệu này phục vụ cho việc lập roadmap. Tất cả phiên bản đã verify từ Packagist.org và npmjs.com ngày 2026-04-03.*
