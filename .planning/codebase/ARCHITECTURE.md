# Architecture

## Pattern
**API + SPA (Monorepo)**
- Monorepo structure with separate `backend/` (Laravel 12 REST API) and `frontend/` (React 18 SPA)
- Backend exposes REST APIs; frontend consumes them
- Deployed together but logically separated

## Layers

### Backend (Laravel 12)
**Routing & Entry Points**
- `routes/web.php` - Simple JSON endpoints (GET users, POST users CRUD)
- `routes/api.php` - Main REST API (819 lines), protected by `ApiTokenAuth` middleware
  - Unprotected: `/api/login` (authentication)
  - Protected: `/api/me`, `/api/logout`, `/api/change-password`, `/api/dashboard`, settings, CRUD endpoints
  - Resource routes: students, lecturers, councils, topics, thesis forms

**Controllers** (`app/Http/Controllers/`)
- `StudentController` - CRUD for students (index, show, store, update, destroy, destroyAll)
- `LecturerController` - Lecturer management
- `CouncilController` - Council/hội đồng management
- `TopicController` - Thesis topics management
- `ThesisFormController` - Thesis form generation (export Word documents)
- `DashboardController` - Dashboard statistics
- `AuthController` - Authentication logic

**Models** (`app/Models/`) — Eloquent ORM
- `Student` (table: `sinhvien`, PK: `mssv`)
  - Relation: `belongsTo(Topic)` via `maDeTai`
- `Teacher` (table: `giangvien`, PK: `maGV`)
  - Roles: advisor (GVHD), reviewer (GVPB), council member
- `Topic` (table: `detai`, PK: `maDeTai`)
  - Relations: `belongsTo(Teacher as lecturer)`, `belongsTo(Teacher as reviewer)`, `belongsTo(Council)`, `hasMany(Student)`
  - Stores: topic info, scores (midterm, advisor, reviewer, council), feedback
- `Council` (table: `hoidong`, PK: `maHoiDong`)
  - Relations: `belongsToMany(Teacher)` via `thanhvienhoidong` (with pivot `vaiTro`)
  - Many-to-many: council members with roles (chủ tịch, thư ký, ủy viên)
- `CouncilMember` (table: `thanhvienhoidong`)
  - Junction table: maHoiDong, maGV, vaiTro
- `Score` (table: `diem`)
  - Stores midterm, advisor, reviewer, council scores
- `Setting` (table: `cauhinh`, PK: `id`)
  - Global settings: current stage (giaiDoan), midterm status (trangThaiChamGK)
- `ThesisForm`, `User` (for basic CRUD routes in web.php)

**Authentication & Authorization**
- Token-based auth using file cache (`Cache::store('file')`)
  - Login: validate teacher credentials from `giangvien` table
  - Token: UUID stored with TTL (7 days)
  - Payload: role, maGV
- Middleware `ApiTokenAuth` - checks Bearer token validity
- Roles: `admin`, `lecturer` (GVHD/GVPB), `UyVien` (council member)
- Admin password stored in cache (`legacy_admin_password`)

**Dependencies**
- `laravel/framework` 12.0
- `phpoffice/phpspreadsheet` - Excel import/export
- `phpoffice/phpword` - Word document generation (export scoring forms)

### Frontend (React 18 + Vite)
**Entry Point**
- `src/main.jsx` - React root, BrowserRouter setup
- `src/App.jsx` - Route definitions

**Routing** (React Router v6)
```
/thesis/login              - LoginPage (unprotected)
/thesis/dashboard          - Dashboard (protected)
/thesis/topicmanagement    - Data management
/thesis/assignment         - Student/topic assignment
/thesis/midterm            - Midterm scoring
/thesis/review             - Review/phản biện
/thesis/council            - Council management
/                          - HomePage
/users                     - UsersPage
```

**Layout System**
- `layouts/AdminLayout.jsx` - Main app layout with navbar, sidebar
- `layouts/ThesisLayout.jsx` - Thesis-specific layout
- Protected routes wrapped in layout + auth check

**State Management**
- Context API:
  - `context/AuthContext.jsx` - User state (login, logout, user object)
  - localStorage: token, user data persistence
- No Redux/Zustand — simple context + local state

**Components** (`src/components/`)
- `Modal.jsx` - Generic modal wrapper
- `FormField.jsx` - Reusable form input
- `Toast.jsx` - Notification system
- `LoadingSection.jsx` - Loading skeleton
- `ThesisFormModal.jsx` - Form for creating/editing thesis
- `ThesisTable.jsx` - Table display
- `AccessDenied.jsx` - Permission error view

**Services** (`src/services/`)
- `authService.js` - Login, logout, token/user management
- `studentService.js` - Student CRUD API calls
- `lecturerService.js` - Lecturer API calls
- `thesisService.js` - Topic/thesis API calls
- `councilService.js` - Council API calls
- `thesisFormService.js` - Thesis form export
- `dashboardService.js` - Dashboard stats
- `userService.js` - User management (for /users page)

**Utilities & Hooks**
- `utils/parseResponse.js` - Centralized API response parsing
- `hooks/` - Custom React hooks (if any)

**Styling**
- Tailwind CSS v4.2.2
- `src/index.css` - Global styles
- Component-level scoping via Tailwind classes
- Responsive design with Tailwind utilities

**Build & Dev**
- Vite 7.0.0 (build tool)
- Concurrent dev: `npm run dev` + Laravel dev server + queue listener
- Production: `vite build` → `dist/`

## Data Flow

### Request Flow (API → Backend → Database)
```
Frontend (React)
  ↓ (fetch with Bearer token)
API Routes (routes/api.php)
  ↓ (middleware: ApiTokenAuth)
Controller (validate, query)
  ↓
Model / Eloquent ORM
  ↓
Database (MySQL — giangvien, sinhvien, detai, hoidong, etc.)
```

### Authentication Flow
```
Frontend LoginPage
  → POST /api/login (maGV, matKhau)
  ← Bearer token + user object
  → store token + user in localStorage
  → subsequent requests: Authorization: Bearer {token}
  → ApiTokenAuth checks cache for token validity
  → attach auth_user, auth_role to request
```

### Scoring Flow (Example)
```
GVHD page → fill score form → POST /api/topics/{id}/score
  → TopicController validates & stores score
  → Model updates Topic record (diemHuongDan, etc.)
  → Frontend re-fetches topic list
  → Display updated scores
```

### Export Flow (Example)
```
GVHD → click "Export scores to Word"
  → POST /api/topics/{id}/export (or similar)
  → ThesisFormController generates .docx using phpword
  → reads template from `docs/thesis/Mau_01.01_...`
  → fills placeholders with teacher + student + score data
  → returns file download
```

## Entry Points

### Web
- **Home**: `http://localhost:8000/` → HomePage (static welcome)
- **Users**: `http://localhost:8000/users` → UsersPage (simple CRUD via web.php routes)

### API (Backend)
- **Health**: `GET http://localhost:8000/up` → Laravel health check
- **Login**: `POST http://localhost:8000/api/login` → authenticate, get token
- **Protected**: `GET http://localhost:8000/api/me` (+ all other /api/* routes) → requires Bearer token

### Frontend App
- **Thesis System**: `http://localhost:3000/thesis/login` (dev) or bundled SPA
  - All thesis routes protected by `ThesisLayout` + auth context check

## Authentication

### Approach
**Custom Token-based (Bearer token + file cache)**
- No session/cookie auth
- Token stored in cache (file-based)
- Token TTL: 7 days
- Each token carries: role, maGV

### Flow
1. POST `/api/login` with credentials (maGV, matKhau)
2. Backend validates against `giangvien.matKhau` (plain text or hashed)
3. Generate UUID token, store in file cache with TTL
4. Return token + user object to frontend
5. Frontend stores token in localStorage
6. All subsequent requests: `Authorization: Bearer {token}`
7. Middleware `ApiTokenAuth` validates token from cache
8. If valid: attach user info to request, proceed
9. If invalid/expired: return 401, frontend redirects to login

### Roles & Authorization
- **admin**: special role, password stored in cache separately
- **lecturer** (GVHD/GVPB): regular teacher account
- **UyVien**: council member role from `thanhvienhoidong` table
- Role checked via `request->attributes->get('auth_role')`
- Some endpoints check role before allowing action

### Security Notes
- CSRF protection disabled for all routes (config in bootstrap/app.php)
- Passwords: mixture of plain text (legacy) and hashed (new — Hash::make)
- Token stored server-side in cache (not JWT) → more secure, revocable
- Frontend: token in localStorage (not httpOnly) → possible XSS risk (acceptable for internal tool)

## Key Technologies

| Component | Technology | Version |
|-----------|-----------|---------|
| Backend Framework | Laravel | 12.0 |
| PHP Version | PHP | 8.2+ |
| Frontend Framework | React | 18.3.1 |
| Routing (Frontend) | React Router | 6.30.1 |
| Build Tool (Frontend) | Vite | 7.0.0 |
| Styling | Tailwind CSS | 4.2.2 |
| Database | MySQL | (via Docker/WAMP) |
| API Client | Fetch API | (native) |
| Icons | Font Awesome + React Icons | |
| Word Export | PHPWord | 1.4 |
| Excel | PHPSpreadsheet | 5.5 |

## Diagram (High Level)

```
┌──────────────────────────────────────────────────────────────┐
│                    MONOREPO (Single Repo)                    │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐              ┌──────────────────────┐  │
│  │    BACKEND       │              │      FRONTEND        │  │
│  │  (backend/)      │              │     (frontend/)      │  │
│  ├──────────────────┤              ├──────────────────────┤  │
│  │ Routes (API)     │              │ React App (SPA)      │  │
│  │ Controllers      │◄─────HTTP────│ Pages, Components    │  │
│  │ Models (ORM)     │              │ Services (fetch)     │  │
│  │ Auth Middleware  │              │ Context, Hooks       │  │
│  │ Database (MySQL) │              │ Tailwind Styling     │  │
│  └──────────────────┘              └──────────────────────┘  │
│         (Port 8000)                       (Port 3000, dev)   │
│                                    (Bundled in public/)      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```
