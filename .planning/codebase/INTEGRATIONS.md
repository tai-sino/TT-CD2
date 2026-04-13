# Integrations

## Database

### Primary Database
- Type: MySQL
- Version: 8.0+ (recommended)
- ORM: Eloquent (Laravel's native ORM)
- Query Builder: Illuminate\Database\Query\Builder
- Configuration: `backend/config/database.php`
- Default connection: MySQL (configurable via `DB_CONNECTION` env)
- Connection details:
  - Host: 127.0.0.1 (localhost)
  - Port: 3306
  - Database: quanly_lvtn
  - Character set: utf8mb4
  - Collation: utf8mb4_unicode_ci

### Database Tables (from Models)
| Table | Model | Purpose |
|-------|-------|---------|
| sinhvien | Student | Student records |
| giangvien | Teacher | Lecturer/teacher records |
| detai | Topic | Thesis topics |
| hoidong | Council | Defense council records |
| hoidong_members (inferred) | CouncilMember | Council member assignments |
| diem | Score | Scoring records |
| settings | Setting | Global application settings |
| thesis_forms | ThesisForm | Thesis registration forms |

### Migrations
- Location: `backend/database/migrations/`
- Status: Run via `php artisan migrate`
- Default migration table: `migrations`

## Authentication

### Method
- Type: API token-based (not OAuth, not JWT)
- Implementation: Custom file-based cache authentication
- Guard: `web` (session-based via Eloquent)
- Provider: Eloquent (User model)

### Authentication Flow
1. POST `/api/login` with username (`maGV`) and password (`matKhau`)
2. Backend validates against `giangvien` table
3. Server generates UUID token
4. Token stored in file cache with 7-day expiry
5. Token includes user role from `hoidong_members` table (`vaiTro`)
6. Client sends token in Authorization header: `Bearer <token>`
7. ApiTokenAuth middleware validates token on each request

### User Roles
| Role | Description |
|------|-------------|
| ThuKy | Secretary (admin) |
| ChuTich | Council chairman |
| ThuKy | Council secretary |
| UyVien | Council member |
| (default) | Regular lecturer (GVHD/GVPB) |

### Password Storage
- Current: Plain text comparison (legacy system)
- Hash support: Laravel Hash::make() (available but optional)
- Reset: POST `/api/change-password` (supports both plain & hashed comparison)
- Admin password: Stored in file cache under key `legacy_admin_password` (default: "123")

### Session Configuration
- Driver: `file` (filesystem-based)
- Lifetime: 120 minutes
- Storage: `storage/framework/sessions/`

## File Handling

### Import - Excel (Students)
- Library: phpoffice/phpspreadsheet v5.5
- Endpoint: POST `/api/students/import-excel` (NOT YET IMPLEMENTED - returns 501)
- Format: Excel file (.xlsx, .xls)
- Purpose: Import student list from registrar office
- Expected use: `StudentController::import()`

### Export - Word (Scoring Sheets)
- Library: phpoffice/phpword v1.4
- Endpoints (NOT YET IMPLEMENTED - return 501):
  - GET/POST `/api/exports/word/assignment` - Form_NhiemvuLVTN (task assignment form)
  - GET/POST `/api/exports/word/gvhd/{topic}` - Mau 01.01/01.02 (GVHD scoring sheet)
  - GET/POST `/api/exports/word/gvpb/{topic}` - Mau 02.01/02.02 (GVPB scoring sheet)
- Template files: Located in `docs/thesis/` (Word .doc files)
- Purpose: Generate scoring sheets for instructors

### Export - Excel (Lists)
- Library: phpoffice/phpspreadsheet v5.5
- Endpoints (NOT YET IMPLEMENTED - return 501):
  - POST `/api/exports/midterm` - Midterm evaluation results
  - POST `/api/exports/hoidong` - Council defense schedule list
  - POST `/api/exports/phanbien` - Reviewer assignment list
  - POST `/api/exports/tongket` - Final scores summary
- Purpose: Generate various administrative lists

### File Storage
- Driver: Local filesystem
- Configuration: `backend/config/filesystems.php`
- Disk: `local` (default)
- Storage path: `storage/app/`
- Public path: `storage/app/public/`

## External Services

### Email
- Mailer: log (development default)
- Configuration: `backend/config/mail.php`
- Alternative drivers available: smtp, sendmail, mailgun, ses, postmark, resend
- From address: hello@example.com
- From name: QuanLyLVTN
- Current status: NOT IN USE (no mail routes implemented)

### Queue System
- Driver: database
- Configuration: `backend/config/queue.php`
- Queue table: `jobs`
- Queue name: `default`
- Retry after: 90 seconds
- Current status: Available but NOT IN USE (no jobs dispatched)
- Can be enabled via `php artisan queue:listen`

### Cache Store
- Driver: file (development default)
- Configuration: `backend/config/cache.php`
- Storage location: `storage/framework/cache/`
- Usage: Token storage, API session tokens
- Alternative drivers available: redis, memcached, database

## API Communication

### Frontend-Backend Communication
- Method: HTTP/HTTPS REST API
- Base URL: `http://localhost:8000/api`
- Header: `Content-Type: application/json`
- Auth header: `Authorization: Bearer <token>`

### CORS Configuration
- File: `backend/config/cors.php`
- Supports cross-origin requests from frontend (Vite dev server)
- Configurable per environment

### Response Format
All API responses return JSON:
```json
{
  "data": {},           // or
  "message": "...",
  "error": "..."        // if error
}
```

HTTP status codes:
- 200: Success
- 201: Created
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation error
- 501: Not Implemented

## No External Integrations
- ❌ No third-party OAuth (Google, Facebook, etc.)
- ❌ No webhook integrations
- ❌ No payment gateway
- ❌ No SMS service
- ❌ No push notifications
- ❌ No analytics tools
- ❌ No cloud storage (S3, etc.)
- ❌ No CDN
