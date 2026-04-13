# Structure

## Root

```
TT-CD2/
├── .git/                          # Git repository
├── .claude/                       # Claude-specific notes
├── .planning/                     # Planning & documentation
│   └── codebase/                  # Architecture docs
├── backend/                       # Laravel 12 API backend
├── frontend/                      # React 18 SPA frontend
├── docs/                          # Project documentation & templates
│   └── thesis/                    # Word templates for scoring forms
├── huong_dan/                     # Instructions/guides (if any)
├── screenshot/                    # Screenshots for reference
├── temp_db/                       # Temporary database files/exports
├── CLAUDE.md                      # Project rules & guidelines (REQUIRED READ)
├── README.md                      # Top-level project info
└── render.yaml                    # Deployment config (Render)
```

## Backend (`backend/`)

**Standard Laravel 12 structure:**

```
backend/
├── app/                           # Application code
│   ├── Console/
│   │   └── Commands/
│   │       └── MigrateLegacyData.php   # Data migration helper
│   ├── Http/
│   │   ├── Controllers/           # Request handlers
│   │   │   ├── AuthController.php       # Auth logic
│   │   │   ├── Controller.php           # Base controller
│   │   │   ├── StudentController.php    # Student CRUD
│   │   │   ├── LecturerController.php   # Lecturer management
│   │   │   ├── TopicController.php      # Topic/thesis management
│   │   │   ├── CouncilController.php    # Council (hội đồng)
│   │   │   ├── ThesisFormController.php # Form export (Word)
│   │   │   └── DashboardController.php  # Dashboard stats
│   │   ├── Middleware/
│   │   │   └── ApiTokenAuth.php        # Bearer token validation
│   │   └── Requests/               # Form request validation
│   │       ├── StoreTopicRequest.php
│   │       └── UpdateTopicRequest.php
│   ├── Models/                    # Eloquent models
│   │   ├── Student.php            # sinhvien table
│   │   ├── Teacher.php            # giangvien table
│   │   ├── Topic.php              # detai table
│   │   ├── Council.php            # hoidong table
│   │   ├── CouncilMember.php      # thanhvienhoidong junction
│   │   ├── Score.php              # diem table
│   │   ├── Setting.php            # cauhinh table (global settings)
│   │   ├── ThesisForm.php         # Thesis form metadata
│   │   └── User.php               # users table (basic CRUD)
│   └── Providers/                 # Service providers
│
├── bootstrap/
│   └── app.php                    # Application bootstrap & config
│
├── config/                        # Configuration files
│   ├── app.php
│   ├── auth.php
│   ├── cache.php
│   ├── cors.php
│   ├── database.php               # DB connection settings
│   ├── filesystems.php
│   ├── logging.php
│   ├── mail.php
│   ├── queue.php
│   ├── services.php
│   ├── session.php
│   └── view.php
│
├── database/
│   ├── migrations/                # ⚠️ NOT FOUND — using legacy SQL
│   ├── seeders/                   # Database seeders
│   └── factories/                 # Factories for testing
│
├── public/                        # Publicly accessible files
│   └── index.php                  # Laravel entry point
│
├── routes/                        # Route definitions
│   ├── web.php                    # Simple JSON routes (CRUD for users)
│   ├── api.php                    # REST API (main routes — 819 lines)
│   └── console.php                # Artisan commands
│
├── storage/                       # Runtime storage
│   ├── app/
│   ├── logs/
│   └── framework/
│
├── vendor/                        # Composer dependencies (git-ignored)
│
├── .env.example                   # Environment template
├── .dockerignore                  # Docker ignore file
├── .gitignore                     # Git ignore file
├── artisan                        # Laravel CLI entry point
├── composer.json                  # PHP dependencies
├── composer.lock                  # Dependency lock file
├── composer.phar                  # Composer binary
├── Dockerfile                     # Docker container config
├── readme.md                      # Backend README
└── render.yaml                    # Deployment config
```

### Key Backend Files

| File | Purpose |
|------|---------|
| `routes/api.php` | Main REST API — 819 lines, all protected endpoints |
| `routes/web.php` | Simple routes for GET /users, POST /users, etc. |
| `bootstrap/app.php` | App initialization, middleware config |
| `app/Http/Middleware/ApiTokenAuth.php` | Token validation middleware |
| `database/migrations/` | **NOT PRESENT** — using legacy SQL setup |

### Database Tables (from Models & API)

| Table | Model | Description |
|-------|-------|-------------|
| `giangvien` | `Teacher` | Lecturers (advisors, reviewers) |
| `sinhvien` | `Student` | Students |
| `detai` | `Topic` | Thesis topics |
| `hoidong` | `Council` | Defense councils |
| `thanhvienhoidong` | `CouncilMember` | Council member assignments (pivot) |
| `diem` | `Score` | Scores (midterm, advisor, reviewer, council) |
| `cauhinh` | `Setting` | Global settings (current stage, midterm status) |
| `thoiluan` | (implicit) | Forms/discussions (mentioned in schema) |
| `users` | `User` | Basic users table |

## Frontend (`frontend/`)

**React 18 + Vite SPA structure:**

```
frontend/
├── src/                           # Source code
│   ├── App.jsx                    # Root route component
│   ├── main.jsx                   # React entry point
│   ├── index.css                  # Global styles (Tailwind + custom)
│   │
│   ├── components/                # Reusable UI components
│   │   ├── AccessDenied.jsx       # Permission error
│   │   ├── FormField.jsx          # Form input wrapper
│   │   ├── LoadingSection.jsx     # Loading skeleton
│   │   ├── Modal.jsx              # Generic modal
│   │   ├── ThesisFormModal.jsx    # Form for thesis CRUD
│   │   ├── ThesisTable.jsx        # Topic table display
│   │   └── Toast.jsx              # Notification toast
│   │
│   ├── context/                   # React Context (state management)
│   │   └── AuthContext.jsx        # Authentication state (user, login, logout)
│   │
│   ├── hooks/                     # Custom React hooks (if any)
│   │
│   ├── layouts/                   # Page layouts
│   │   ├── AdminLayout.jsx        # Main app layout (navbar, sidebar)
│   │   └── ThesisLayout.jsx       # Thesis-specific layout
│   │
│   ├── pages/                     # Page components
│   │   ├── HomePage.jsx           # Landing page
│   │   ├── NotFoundPage.jsx       # 404 page
│   │   │
│   │   ├── users/
│   │   │   └── UsersPage.jsx      # User management (backend /users)
│   │   │
│   │   └── thesis/                # Thesis management pages
│   │       ├── LoginPage.jsx      # Login form
│   │       ├── Dashboard.jsx      # Main dashboard
│   │       ├── Assignment.jsx     # Assign students to advisors
│   │       ├── TopicManagement.jsx # Topic/thesis CRUD
│   │       ├── Midterm.jsx        # Midterm scoring
│   │       ├── Review.jsx         # Reviewer scoring
│   │       └── Council.jsx        # Council management
│   │
│   ├── services/                  # API client layer
│   │   ├── authService.js         # Auth endpoints
│   │   ├── studentService.js      # Student API calls
│   │   ├── lecturerService.js     # Lecturer API calls
│   │   ├── thesisService.js       # Topic/thesis API calls
│   │   ├── councilService.js      # Council API calls
│   │   ├── thesisFormService.js   # Export form endpoints
│   │   ├── dashboardService.js    # Dashboard stats
│   │   ├── userService.js         # User management API
│   │   └── index.js               # Export all services
│   │
│   ├── utils/                     # Helper functions
│   │   └── parseResponse.js       # Centralized API response parsing
│   │
│   ├── constants/                 # App constants (if any)
│   │
│   └── public/                    # Static assets
│       └── (favicon, etc.)
│
├── index.html                     # HTML entry point (Vite)
├── vite.config.js                 # Vite configuration
├── tailwind.config.js             # Tailwind CSS config (if exists)
├── postcss.config.js              # PostCSS config
├── eslint.config.js               # ESLint rules
├── eslint.config.cjs              # ESLint CommonJS config (legacy)
├── package.json                   # NPM dependencies
├── package-lock.json              # NPM lock file
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore
├── vercel.json                    # Vercel deployment config
├── readme.md                      # Frontend README
└── public/                        # Static assets (Vite build output)
```

### Key Frontend Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Route definitions (React Router v6) |
| `src/main.jsx` | React app bootstrap & BrowserRouter |
| `src/services/*.js` | API client functions (fetch calls) |
| `src/context/AuthContext.jsx` | Global auth state |
| `src/layouts/ThesisLayout.jsx` | Protected route layout |
| `vite.config.js` | Vite build config |
| `package.json` | Dependencies & scripts |

### Frontend Routes

| Route | Component | Protected | Purpose |
|-------|-----------|-----------|---------|
| `/` | HomePage | No | Landing page |
| `/users` | UsersPage | No | User CRUD demo |
| `/thesis/login` | LoginPage | No | Login form |
| `/thesis/dashboard` | Dashboard | Yes | Main dashboard |
| `/thesis/topicmanagement` | TopicManagement | Yes | Topic CRUD |
| `/thesis/assignment` | Assignment | Yes | Assign students |
| `/thesis/midterm` | Midterm | Yes | Midterm scoring |
| `/thesis/review` | Review | Yes | Reviewer scoring |
| `/thesis/council` | Council | Yes | Council management |
| `*` | NotFoundPage | No | 404 |

## Key Locations

| Purpose | Path | Notes |
|---------|------|-------|
| **API Routes** | `backend/routes/api.php` | Main REST API (819 lines) |
| **Web Routes** | `backend/routes/web.php` | Simple JSON routes |
| **Controllers** | `backend/app/Http/Controllers/` | Request handlers |
| **Models** | `backend/app/Models/` | Eloquent ORM |
| **Auth Middleware** | `backend/app/Http/Middleware/ApiTokenAuth.php` | Token validation |
| **Frontend App** | `frontend/src/App.jsx` | Route definitions |
| **Services** | `frontend/src/services/` | API client layer |
| **Components** | `frontend/src/components/` | Reusable UI |
| **Thesis Pages** | `frontend/src/pages/thesis/` | Main feature pages |
| **Auth Context** | `frontend/src/context/AuthContext.jsx` | State management |
| **Database Schema** | `temp_db/quanly_lvtn.sql` | Legacy SQL (no migrations) |
| **Docs/Templates** | `docs/thesis/` | Word templates for forms |
| **Project Rules** | `CLAUDE.md` | **READ FIRST** — guidelines |

## Naming Conventions

### Backend (PHP/Laravel)

**Files & Classes**
- Controller: `{Feature}Controller` (e.g., `StudentController`, `TopicController`)
- Model: `{Entity}` (e.g., `Student`, `Teacher`, `Topic`)
- Middleware: `{Behavior}` (e.g., `ApiTokenAuth`)
- Table names: Vietnamese, snake_case (e.g., `sinhvien`, `giangvien`, `detai`, `hoidong`)
- Column names: Vietnamese, camelCase (e.g., `mssv`, `hoTen`, `maGV`, `tenDeTai`)

**Functions & Methods**
- Controller methods: RESTful verbs (index, show, store, update, destroy)
- Model methods: descriptive, lowercase (e.g., `scopeForUser()`)
- Middleware: `handle()` method

**Routes**
- API endpoints: `/api/{resource}` (e.g., `/api/students`, `/api/lecturers`)
- Token key format: `api_token:{uuid}`

### Frontend (JavaScript/React)

**Files & Components**
- Component: `PascalCase.jsx` (e.g., `LoginPage.jsx`, `ThesisTable.jsx`)
- Service: `camelCaseService.js` (e.g., `authService.js`, `studentService.js`)
- Context: `{Feature}Context.jsx` (e.g., `AuthContext.jsx`)
- Hooks: `use{Feature}.js` (e.g., `useAuth()`)
- Utilities: `camelCase.js` (e.g., `parseResponse.js`)

**Variables & Functions**
- React state: `camelCase` with `use` prefix (e.g., `const [isLoading, setIsLoading]`)
- Event handlers: `handle{Event}` (e.g., `handleSubmit`, `handleLogout`)
- API functions: verb + noun (e.g., `fetchStudents()`, `createTopic()`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

**Environment Variables**
- Frontend: `VITE_*` prefix (Vite convention)
  - `VITE_API_BASE_URL`
  - `VITE_APP_NAME`

### Database

**Table Names**
- Vietnamese, lowercase (e.g., `sinhvien`, `giangvien`, `detai`, `hoidong`)
- Junction tables: combined names (e.g., `thanhvienhoidong`)

**Column Names**
- Vietnamese, camelCase (e.g., `mssv`, `hoTen`, `maGV`, `tenDeTai`)
- Prefixes for clarity: `ma*` (code), `ten*` (name), `so*` (number/quantity), `dia*` (location)
- Examples:
  - `mssv` (student ID)
  - `maGV` (teacher/lecturer ID)
  - `maDeTai` (topic ID)
  - `tenDeTai` (topic name)
  - `maHoiDong` (council ID)

**Relationships**
- Foreign keys: `ma{Entity}` (e.g., `maGV_HD` = advisor teacher ID)
- Pivot/junction: `{table1}_{table2}` or combined (e.g., `thanhvienhoidong`)

## Architecture Patterns & Observations

### Backend Patterns
- **RESTful API**: Standard HTTP methods (GET, POST, PUT, DELETE)
- **Eloquent ORM**: No Repository pattern — queries in controllers/models directly
- **Token-based Auth**: UUID tokens stored in file cache (TTL: 7 days)
- **Minimal Validation**: Inline `$request->validate()` in controllers
- **No Explicit Services**: Logic in controllers or model methods (no Service layer)

### Frontend Patterns
- **React Router v6**: Nested routes with Layout components
- **Context API**: Simple global state (auth user, token)
- **Service Layer**: Abstracted API calls (fetch wrapper in services/)
- **Utility Functions**: Shared helpers (parseResponse, etc.)
- **Component Composition**: Reusable UI components (Modal, FormField, etc.)

### Missing/Legacy Patterns
- **No Migrations**: Using legacy SQL dump instead of Laravel migrations
- **No Tests**: No test files found
- **No Docker Compose**: Docker file present but no docker-compose.yml for local dev
- **No Seeding**: No obvious seeder usage in code
- **No API Documentation**: No Swagger/OpenAPI docs

## Deployment & Configuration

**Backend**
- Dockerfile: Present for containerization
- render.yaml: Deployment config (likely for Render hosting)
- Bootstrap: `bootstrap/app.php` configures routing, middleware, exceptions

**Frontend**
- Vite build: Output to `dist/`
- vercel.json: Vercel deployment config
- Can be bundled into `backend/public/` for monolith deployment

**Database**
- Connection config: `config/database.php`
- No migrations present — using legacy SQL
- Setup: Run `temp_db/quanly_lvtn.sql` manually or via seeder

## Development Scripts

**Backend** (in `composer.json`)
```
composer setup     # Install + migrate + build frontend
composer dev       # Concurrent dev: serve + queue + vite
composer test      # Run tests (if any)
```

**Frontend** (in `package.json`)
```
npm run dev        # Vite dev server
npm run build      # Production build
npm run preview    # Preview build locally
```

## Notes

- **Legacy Database**: No Laravel migrations — SQL dump in `temp_db/` must be imported manually
- **No Seeders**: No database seeding observed
- **CSRF Disabled**: Disabled for all routes in `bootstrap/app.php` (internal tool)
- **Token Storage (BE)**: File cache — revocable, TTL-based
- **Token Storage (FE)**: localStorage — convenient, no httpOnly cookie (acceptable for internal tool)
- **Mixed Password Hashing**: Some plain text (legacy), some hashed (Hash::make)
- **Language Mix**: Vietnamese table/column names, English code structure
