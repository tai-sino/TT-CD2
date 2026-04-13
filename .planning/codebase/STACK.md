# Stack

## Runtime

### Backend
- Language: PHP
- Runtime version: ^8.2
- Package manager: Composer

### Frontend
- Language: JavaScript (ES Module)
- Runtime: Node.js (for build only)
- Package manager: npm

## Framework

### Backend
- Primary: Laravel
- Version: ^12.0
- Architecture: Monolith (API + optional Blade views)

### Frontend
- Primary: React
- Version: ^18.3.1
- Build tool: Vite ^7.0.0
- Styling: Tailwind CSS ^4.2.2

## Key Dependencies

### Backend (PHP/Laravel)
| Package | Version | Purpose |
|---------|---------|---------|
| laravel/framework | ^12.0 | Core framework |
| laravel/tinker | ^2.10.1 | Interactive REPL for debugging |
| phpoffice/phpspreadsheet | ^5.5 | Read/write Excel files (import students) |
| phpoffice/phpword | ^1.4 | Generate Word documents (export scoring sheets) |

### Backend (Dev Dependencies)
| Package | Version | Purpose |
|---------|---------|---------|
| fakerphp/faker | ^1.23 | Fake data generation for testing |
| laravel/pail | ^1.2.2 | Real-time log streaming |
| laravel/pint | ^1.24 | Code style checker/fixer |
| laravel/sail | ^1.41 | Docker development environment |
| mockery/mockery | ^1.6 | Mock objects for testing |
| nunomaduro/collision | ^8.6 | Error display enhancement |
| phpunit/phpunit | ^11.5.3 | Unit testing framework |

### Frontend (JavaScript)
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI library |
| react-dom | ^18.3.1 | React rendering to DOM |
| react-router-dom | ^6.30.1 | Client-side routing |
| @fortawesome/free-solid-svg-icons | ^7.2.0 | FontAwesome icons |
| @fortawesome/react-fontawesome | ^3.3.0 | React FontAwesome wrapper |
| react-icons | ^5.6.0 | Alternative icon library |
| lottie-react | ^2.4.1 | Animation library |
| tailwindcss | ^4.2.2 | Utility CSS framework |
| @tailwindcss/postcss | ^4.2.2 | Tailwind PostCSS plugin |
| postcss | ^8.5.8 | CSS transformation |
| vite | ^7.0.0 | Build tool and dev server |

### Frontend (Dev Dependencies)
| Package | Version | Purpose |
|---------|---------|---------|
| @vitejs/plugin-react | ^4.3.4 | Vite React plugin (JSX support) |

## Configuration

### Backend Primary Config Files
- `backend/.env.example` - Environment template (no secrets stored)
- `backend/config/app.php` - App name, timezone, locale settings
- `backend/config/database.php` - Database connections (MySQL/SQLite/MariaDB/PostgreSQL)
- `backend/config/auth.php` - Authentication guards and providers
- `backend/config/mail.php` - Mail driver configuration (default: log)
- `backend/config/queue.php` - Queue driver configuration (default: database)
- `backend/config/cache.php` - Cache store configuration
- `backend/config/filesystems.php` - File storage configuration
- `backend/config/cors.php` - CORS settings
- `backend/config/session.php` - Session storage and lifetime
- `backend/config/logging.php` - Log channel configuration

### Environment Variables (Backend)
From `.env.example`:
```
APP_NAME=QuanLyLVTN
APP_ENV=local
APP_KEY=                      # Generated via artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=quanly_lvtn
DB_USERNAME=root
DB_PASSWORD=                  # (empty for local dev)

SESSION_DRIVER=file
SESSION_LIFETIME=120
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database
CACHE_STORE=file

MAIL_MAILER=log
MAIL_FROM_ADDRESS=hello@example.com
MAIL_FROM_NAME=QuanLyLVTN
```

### Frontend Config
- `frontend/vite.config.js` - Vite build configuration
- `frontend/tailwind.config.js` - Tailwind CSS configuration
- `frontend/postcss.config.js` - PostCSS plugins
- `frontend/.env.example` - Frontend environment template (minimal)

### Database Configuration
- Driver: MySQL (default in `.env.example`)
- Port: 3306
- Database name: `quanly_lvtn`
- Character set: utf8mb4
- Collation: utf8mb4_unicode_ci
- Also supports: SQLite, MariaDB, PostgreSQL, SQL Server (via config)

### API Routes Structure
- Base URL: `/api`
- Authentication: File-based token cache (not database sessions)
- Auth middleware: `ApiTokenAuth` (custom)
- Protected routes: All routes under `middleware(ApiTokenAuth::class)` group
- Token storage: File cache (7-day expiry)

### Development Server
- Backend: `php artisan serve` (default port 8000)
- Frontend: Vite dev server (default port 5173)
- Combined: `npm run dev` (uses concurrently to run server + queue + vite)

### Build & Setup
Composer scripts available:
- `composer setup` - Full setup (install, generate key, migrate, npm install, build)
- `composer dev` - Development servers (Laravel + queue + Vite)
- `composer test` - Run tests with PHPUnit
