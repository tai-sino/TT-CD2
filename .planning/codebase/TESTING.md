# Testing

## Framework

### Test Runner
- **Framework**: PHPUnit 11.5.3 (defined in `composer.json`)
- **Configuration**: Not found; uses Laravel defaults
- **Vendor**: Available in `vendor/phpunit/phpunit/`

### Additional Tools
- **Mockery 1.6**: For mocking objects in tests
- **Laravel Pint**: Code style fixer (available as dev dependency, not actively used)
- **Laravel Sail**: Docker development environment (optional)

### Running Tests
```bash
composer test
```

This script:
1. Clears config cache
2. Runs `php artisan test` (Laravel test runner, which uses PHPUnit)

---

## Structure

### Test Organization
**Current Status**: No tests directory exists in the project
- Location: `/backend/tests/` does not exist
- Autoload configured: `"Tests\\": "tests/"` in `composer.json`

### Expected Structure (if tests were present)
```
backend/tests/
├── Feature/          # Integration tests (test full flows)
│   ├── StudentTest.php
│   ├── TopicTest.php
│   └── CouncilTest.php
├── Unit/            # Unit tests (test individual components)
│   ├── Models/
│   ├── Requests/
│   └── Middleware/
└── TestCase.php     # Base test class with helpers
```

### Test Naming Convention (if tests exist)
- **Test Classes**: `{Entity}Test.php` or `{Entity}{Action}Test.php`
  - Example: `StudentTest.php`, `TopicStoreTest.php`
- **Test Methods**: `test_` prefix, descriptive names
  - Example: `test_store_student_with_valid_data()`
  - Example: `test_update_topic_fails_without_lecturer()`

---

## Coverage

### Currently Untested
**Entire application has no test coverage.** All of the following are untested:

#### Controllers
- `StudentController` (index, show, store, update, destroy, destroyAll)
- `TopicController` (index, store, update, destroy, updateStatus)
- `LecturerController` (index, show, store, update, destroy)
- `CouncilController` (index, store, update, destroy)
- `AuthController` (login, logout)
- `DashboardController` (not examined)
- `ThesisFormController` (index, store, show, update, destroy)

#### Models & Relations
- `Student`, `Topic`, `Teacher`, `Council`, `CouncilMember` models
- Eloquent relationships (hasMany, belongsTo, belongsToMany)
- Model scopes (`scopeForUser`)
- Model custom methods

#### Middleware
- `ApiTokenAuth` middleware (token validation, role extraction)
- Auth flow (bearer token → user resolution)

#### Validation
- Request validation rules in `StoreTopicRequest`, `UpdateTopicRequest`
- Inline validation in controller methods
- Rule uniqueness constraints

#### Business Logic
- Topic assignment to students
- Council member management
- Score calculations
- Status transitions

#### API Routes
- All endpoints in `routes/api.php`
- Authentication flow
- Error response formatting

#### Commands
- `MigrateLegacyData` command (data migration from old database)

### What Should Be Tested (Priority)

**High Priority** (core functionality):
1. Student CRUD operations
2. Topic assignment and management
3. Authentication (login/logout, token validation)
4. Authorization (role-based access)
5. Topic status transitions
6. Council member assignment

**Medium Priority** (important flows):
1. Lecturer can assign students to topics
2. Thesis form creation and updates
3. Validation rules (all edge cases)
4. Error handling (404, 401, 422 responses)

**Low Priority** (utilities):
1. DashboardController
2. Thesis form export (if implemented)
3. Data migration command (test-only scenario)

---

## Test Examples (If Written)

### Unit Test Example: Student Model
```php
namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Student;
use App\Models\Topic;

class StudentTest extends TestCase {
    public function test_student_has_topic_relation() {
        $topic = Topic::factory()->create();
        $student = Student::factory()->create(['maDeTai' => $topic->maDeTai]);
        
        $this->assertNotNull($student->topic);
        $this->assertEquals($topic->maDeTai, $student->topic->maDeTai);
    }
}
```

### Feature Test Example: Store Student
```php
namespace Tests\Feature\Controllers;

use Tests\TestCase;
use App\Models\Student;

class StudentControllerTest extends TestCase {
    public function test_store_student_with_valid_data() {
        $response = $this->post('/api/students', [
            'mssv' => 'SV001',
            'hoTen' => 'Nguyễn Văn A',
            'lop' => 'IT001',
            'email' => 'sv@stu.edu.vn',
        ]);
        
        $response->assertStatus(201);
        $this->assertDatabaseHas('sinhvien', ['mssv' => 'SV001']);
    }
    
    public function test_store_student_fails_without_mssv() {
        $response = $this->post('/api/students', [
            'hoTen' => 'Nguyễn Văn A',
        ]);
        
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('mssv');
    }
}
```

### Feature Test Example: Middleware Auth
```php
namespace Tests\Feature\Middleware;

use Tests\TestCase;

class ApiTokenAuthTest extends TestCase {
    public function test_missing_token_returns_401() {
        $response = $this->getJson('/api/me');
        
        $response->assertStatus(401);
        $response->assertJson(['message' => 'Không thể xác thực bạn.']);
    }
    
    public function test_invalid_token_returns_401() {
        $response = $this->withHeader('Authorization', 'Bearer invalid_token')
            ->getJson('/api/me');
        
        $response->assertStatus(401);
        $response->assertJson(['message' => 'Token không hợp lệ hoặc đã hết hạn.']);
    }
}
```

---

## Mocking Strategy (If Tests Implemented)

### Mock Scenarios
1. **Database**: Use SQLite in-memory for test database
   - Configured in `phpunit.xml` (if created)
   - Each test gets fresh database state (migrations run)

2. **Cache**: Mock file cache for token storage
   ```php
   Cache::spy();  // or use Cache::fake()
   $cache = Cache::store('file');
   $cache->put('api_token:xyz', [...], expiry);
   ```

3. **External Services**: Mockery for future integrations
   ```php
   $mock = Mockery::mock('App\Services\ExportService');
   $mock->shouldReceive('export')->andReturn('file');
   ```

4. **Auth**: Create test users with specific roles
   ```php
   $teacher = Teacher::factory()->create(['maGV' => 'GV001']);
   $token = generateTestToken($teacher);  // helper
   ```

---

## Configuration (if needed)

### phpunit.xml (Example)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true">
    <testsuites>
        <testsuite name="Unit">
            <directory suffix="Test.php">./tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory suffix="Test.php">./tests/Feature</directory>
        </testsuite>
    </testsuites>
    
    <coverage processUncoveredFiles="true">
        <include>
            <directory suffix=".php">./app</directory>
        </include>
        <exclude>
            <directory>./app/Console</directory>
            <directory>./app/Http/Requests</directory>
        </exclude>
    </coverage>
    
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="APP_KEY" value="base64:..."/>
        <env name="DB_CONNECTION" value="sqlite"/>
        <env name="DB_DATABASE" value=":memory:"/>
    </php>
</phpunit>
```

---

## Test Factory Approach (if implemented)

### Model Factories
Need to create factories for test data generation:

```php
# database/factories/StudentFactory.php
namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

class StudentFactory extends Factory {
    protected $model = Student::class;
    
    public function definition(): array {
        return [
            'mssv' => $this->faker->unique()->regexify('[A-Z]{2}\d{4}'),
            'hoTen' => $this->faker->name('vi_VN'),
            'lop' => 'IT' . rand(1, 5) . '',
            'email' => $this->faker->unique()->safeEmail(),
            'soDienThoai' => $this->faker->phoneNumber(),
            'maDeTai' => null,
        ];
    }
}
```

---

## Current Testing Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Tests Directory** | ❌ Does Not Exist | Need to create `/backend/tests/` |
| **PHPUnit Config** | ❌ Not Found | Need `phpunit.xml` |
| **Test Cases** | ❌ None | Need to write all tests |
| **Factories** | ❌ None | Need database factories |
| **Coverage** | 0% | No code covered |
| **CI/CD Tests** | ❌ Not Integrated | No test runs in pipeline |

---

## Recommendations for Test Implementation

### Phase 1: Foundation (Critical)
1. Create `tests/` directory structure
2. Create `phpunit.xml` configuration
3. Set up test database (SQLite in-memory)
4. Create `TestCase.php` base class with helpers

### Phase 2: Core Logic (High Priority)
1. Write unit tests for models (relationships, scopes)
2. Write feature tests for auth middleware
3. Write feature tests for CRUD endpoints (Students, Topics)
4. Create test factories for model generation

### Phase 3: Comprehensive (Medium Priority)
1. Test validation rules (both inline and FormRequest)
2. Test error scenarios (404, 401, 422)
3. Test business logic (topic assignment, council management)
4. Add to CI/CD pipeline

### Phase 4: Polish (Nice to Have)
1. Achieve 70%+ code coverage
2. Test edge cases and complex flows
3. Performance/load testing if needed
4. Integration with external services (if added)

---

## Notes

- **No linting config** (no `.phpcs.xml`): Code style not enforced automatically
- **No pre-commit hooks**: Tests not run before commit
- **Manual testing** currently relied upon: Need to switch to automated testing
- **Database inconsistency**: Some validation rules reference `students` table but actual table is `sinhvien` — tests would catch this
