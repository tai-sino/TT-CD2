# Code Conventions

## Code Style

### PHP Style
- **Indentation**: 4 spaces (standard Laravel)
- **Line Length**: No strict limit enforced; practical limit ~120 characters
- **Namespace Usage**: PSR-4 autoloading
  - Controllers: `App\Http\Controllers`
  - Models: `App\Models`
  - Middleware: `App\Http\Middleware`
  - Requests: `App\Http\Requests`
  - Commands: `App\Console\Commands`
- **Opening Braces**: PSR-12 style (opening brace on same line for classes/functions)
- **Comments**: Minimal; only for complex logic or non-obvious intent
  - No docstrings on simple getters/setters
  - Short, natural comments when explaining "why" not "what"
  - Comments use Vietnamese when in context (per CLAUDE.md)

### JSON Responses
- Consistent structure for API endpoints:
  ```php
  response()->json([
      'success' => true,           // (optional, for some endpoints)
      'message' => '...',          // User-facing message in Vietnamese
      'data' => $resource,         // Actual payload
      'meta' => [...]              // (optional) metadata, pagination, etc.
  ], $statusCode);
  ```
- Status codes follow HTTP standards (200 success, 201 created, 404 not found, 422 validation, 401 auth)

---

## Naming Conventions

### Classes
- **Controllers**: PascalCase, suffixed with `Controller`
  - Example: `StudentController`, `TopicController`, `CouncilController`
- **Models**: PascalCase, singular (Eloquent models)
  - Example: `Student`, `Topic`, `Council`, `Teacher`
- **Middleware**: PascalCase, suffixed with `Middleware`
  - Example: `ApiTokenAuth`
- **FormRequests**: PascalCase, describe action
  - Example: `StoreTopicRequest`, `UpdateTopicRequest`

### Methods
- **Controller Actions**: camelCase, descriptive verbs
  - Standard CRUD: `index()`, `store()`, `show()`, `update()`, `destroy()`
  - Custom actions: `updateStatus()`, `destroyAll()` (verb + object)
- **Model Scopes**: camelCase, start with `scope`
  - Example: `scopeForUser($query, $user)`
- **Relations**: camelCase, plural for hasMany/belongsToMany
  - Example: `topics()`, `students()`, `councils()`

### Variables & Properties
- **Local variables**: camelCase, simple names acceptable
  - Example: `$user`, `$query`, `$data`, `$validated`, `$gv`
- **Protected/Private Properties**: camelCase with leading underscore (optional but not consistently used)
- **Database Columns**: camelCase (Vietnamese naming in some cases)
  - Example: `mssv`, `hoTen`, `maDeTai`, `tenGV`, `matKhau` (mixed: some English, some Vietnamese abbreviation)
  - Database table names: lowercase, plural or specific
    - Example: `sinhvien`, `giangvien`, `detai`, `hoidong`, `thanhvienhoidong`

### Files
- **Controllers**: `{Entity}Controller.php`
- **Models**: `{Entity}.php`
- **Migrations**: `YYYY_MM_DD_HHMMSS_create_{table}_table.php` (standard Laravel)
- **Seeders**: `{EntityName}Seeder.php`
- **Middleware**: `{Name}.php`
- **FormRequests**: `{Verb}{Entity}Request.php`

---

## Patterns Used

### Controller Pattern
- **Basic CRUD in Controllers**: Logic directly in controller methods
  - No separate Service layer unless business logic is complex
  - Validation using `$request->validate()` or FormRequest classes
  - Models queried directly with Eloquent
- **Example**:
  ```php
  public function store(Request $request) {
      $validated = $request->validate([...]);
      $model = Student::create($validated);
      return response()->json(['data' => $model], 201);
  }
  ```

### Model Pattern
- **Eloquent Models**: Direct use, no Repository Pattern
- **Table/Key Configuration**: Explicit when non-standard
  ```php
  protected $table = 'sinhvien';      // Non-standard table name
  protected $primaryKey = 'mssv';     // Non-standard primary key
  public $incrementing = false;       // UUID or string key
  public $timestamps = false;         // No created_at/updated_at
  ```
- **Relations**: Direct definition in model, no separate repository
  ```php
  public function topic() {
      return $this->belongsTo(Topic::class, 'maDeTai', 'maDeTai');
  }
  ```

### Validation Pattern
- **Inline Validation** (for simple forms):
  ```php
  $validated = $request->validate([
      'field' => 'required|string|max:100',
  ]);
  ```
- **FormRequest Classes** (for complex forms):
  - Used when validation rules are complex or conditional
  - Includes `rules()` and `authorize()` methods
  - Example: `StoreTopicRequest`, `UpdateTopicRequest`

### Middleware Pattern
- **Custom Middleware**: Used for cross-cutting concerns (auth, token validation)
- **Example**: `ApiTokenAuth` — validates Bearer token from request header
  - Sets request attributes: `auth_user`, `auth_role`, `api_token`
  - Returns JSON error responses on failure

### Route Organization
- **Web Routes** (`routes/web.php`): Basic REST endpoints for testing/setup
  - Simple inline closures for utilities (CRUD on User model)
- **API Routes** (`routes/api.php`): Main application endpoints
  - Resource routes grouped by middleware (e.g., `ApiTokenAuth`)
  - Mix of inline closures and controller methods

---

## Error Handling

### Exception Handling
- **try/catch blocks**: Used in Command classes for data migration
  - Catch generic `\Exception` and log to console
  - Continue processing on error (don't abort batch operations)
- **Explicit 404 handling**:
  ```php
  if (!$resource) {
      return response()->json(['message' => '...'], 404);
  }
  ```
- **Validation errors**: Automatically caught by Laravel; returns 422 with error messages

### API Error Responses
- **Authentication Failure** (401):
  ```json
  {"message": "Không thể xác thực bạn."}
  ```
- **Validation Failure** (422):
  ```json
  {"errors": {...}}  // Auto-generated by Laravel
  ```
- **Not Found** (404):
  ```json
  {"message": "Không tìm thấy..."}
  ```
- **Server Error** (5xx): Laravel default error page

### Logging
- **No explicit logging observed** in current codebase
- Uses Laravel's default `log` facade (configured in `.env`)

---

## Validation

### Validation Rules
- **Built-in Rules**: Standard Laravel validation
  - `required`, `string`, `max:N`, `email`, `unique:table,column`
  - `exists:table,column` (foreign key existence)
  - `nullable` (optional field)
  - `different:field` (field must differ from another)
- **Conditional Rules**: Rules depend on request context
  - Example: `StoreTopicRequest` has different rules for "Create Group" vs standard create

### Unique Constraints
- **Create**: `unique:table,column`
- **Update**: `Rule::unique('table', 'column')->ignore($model->id, 'id')`
  - Custom handling when primary key is non-standard (e.g., `mssv` instead of `id`)

### Custom Validation
- **Not observed** in current codebase
- Could use `Rule::whereNotIn()`, custom closures in future

---

## Database Naming

### Table Names
- Lowercase, descriptive but compact (Vietnamese-influenced)
  - `sinhvien` (students)
  - `giangvien` (teachers/lecturers)
  - `detai` (topics)
  - `hoidong` (councils)
  - `thanhvienhoidong` (council members)

### Column Names
- Lowercase, camelCase used in some places (inconsistent)
  - **Identifiers**: `mssv`, `maGV`, `maDeTai`, `maHoiDong`
  - **Names**: `hoTen`, `tenGV`, `tenDeTai`, `tenHoiDong`
  - **Contact**: `email`, `soDienThoai`
  - **Scores**: `diemGiuaKy`, `diemHuongDan`, `diemPhanBien`, `diemHoiDong`, `diemTongKet`
  - **Status**: `trangThaiGiuaKy`, `trangThaiHoiDong`
- **Foreign Keys**: Explicit reference column names (not just `table_id`)
  - Example: `maGV_HD`, `maGV_PB`, `maDeTai`

---

## Type System

### Declared Return Types
- **Methods**: Use return type declarations where appropriate
  ```php
  public function getRouteKeyName(): string { ... }
  public function authorize(): bool { ... }
  ```
- **Parameters**: Type hints used for model binding and standard types
  ```php
  public function show(Student $student) { ... }
  public function update(Request $request, int $id) { ... }
  ```

### Property Declarations
- **Fillable arrays**: Explicitly listed in models
- **Protected arrays**: `$fillable`, `$hidden`, `$table`, `$primaryKey`

---

## Code Observations & Inconsistencies

### Current State
1. **Password Storage**: Currently **plaintext in database** (temporary for development)
   - Seen in: `AuthController`, `MigrateLegacyData` command
   - Uses string comparison: `$user->matKhau === $credentials['password']`
   - Need to migrate to hashing before production

2. **Table/Key Inconsistency**: Mixed naming styles
   - Some models use English names (`Student`, `Topic`)
   - Some database tables use Vietnamese abbreviations (`sinhvien`, `detai`)
   - Column names mix English and Vietnamese (inconsistent)

3. **Validation Rules**: Some fields have conflicting table/column references
   - Example: `StoreTopicRequest` references `students` table but database has `sinhvien`
   - Suggests code may not be fully synchronized with database schema

4. **Middleware**: Custom token-based auth (cache-driven)
   - Uses file cache to store tokens with expiry (7 days)
   - Sets attributes on request for downstream use

5. **API Token Pattern**: Tokens are UUIDs stored in file cache
   - Not database-backed
   - Simple but not production-ready at scale

---

## Standards & Guidance

### When to Use What
- **Controller vs Service**: Keep in controller if <20 lines of business logic
- **Model Scope vs Query**: Use scope if reused in multiple places, else inline query
- **FormRequest vs Inline Validation**: Use FormRequest if >5 fields or conditional rules
- **Comment vs Self-Documenting**: Prefer clear variable/method names; comment only non-obvious intent

### Code Quality
- No strict linting enforced (no `.phpcs.xml`, no PHPStan config found)
- No pre-commit hooks observed
- Laravel conventions followed by convention, not tooling
