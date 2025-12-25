# Testing Guide

This directory contains HTTP tests for the Bun/Hono application using Bun's built-in test runner.

## Test Database

Tests use **SQLite** instead of MySQL for faster, isolated testing. The test database configuration is in `.env.test` and uses `test.db` file which is automatically created and cleaned up.

## Directory Structure

```
test/
├── api/          # API endpoint tests
├── web/          # Web route tests
└── utils/        # Test utilities and helpers
    ├── setup.ts       # Database setup and teardown
    ├── http-client.ts # HTTP request helper
    └── factories.ts   # Test data factories
```

## Running Tests

```bash
# Run all tests
bun test

# Run tests in watch mode
bun test:watch

# Run specific test file
bun test test/api/users.test.ts

# Run tests matching a pattern
bun test --test-name-pattern "should create"
```

## Writing Tests

### Basic HTTP Test

```typescript
import { describe, expect, test } from "bun:test"
import { http } from "../utils/http-client"
import "../utils/setup"

describe("My API", () => {
  test("should return data", async () => {
    const response = await http.get("/api/endpoint")

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty("id")
  })
})
```

### Testing POST with Form Data

```typescript
import { createFormData, createImageFile, createUserData } from "../utils/factories"
import { expectSuccess, expectProperties } from "../utils/assertions"
import type { UserResponse } from "../utils/types"

test("should create user", async () => {
  const userData = createUserData()
  const avatar = createImageFile()

  const formData = createFormData({
    ...userData,
    avatar,
  })

  const response = await http.post<UserResponse>("/api/users", formData)

  expectSuccess(response)
  expectProperties(response.data, ["id", "name", "email"])
})
```

### Testing Validation Errors

```typescript
import { expectValidationError } from "../utils/assertions"

test("should return 422 for invalid data", async () => {
  const formData = createFormData({ email: "invalid-email" })
  const response = await http.post("/api/users", formData)

  expectValidationError(response)
})
```

### Using Seeding Utilities

```typescript
import { seedUser, seedUsers } from "../utils/seeds"

test("should get user by id", async () => {
  // Create a user in the database
  const user = await seedUser({ name: "John Doe" })

  const response = await http.get(`/api/users/${user.id}`)

  expectSuccess(response)
  expect(response.data.name).toBe("John Doe")
})

test("should list multiple users", async () => {
  // Create 5 users in the database
  await seedUsers(5)

  const response = await http.get("/api/users")

  expect(response.data.length).toBeGreaterThanOrEqual(5)
})
```

## Test Utilities

### HttpClient (Axios)

The `http` client is a standard axios instance that makes requests to a test server running on port 3001:

- `http.get(url, config?)`
- `http.post(url, data?, config?)`
- `http.put(url, data?, config?)`
- `http.patch(url, data?, config?)`
- `http.delete(url, config?)`

**Response format:** Axios responses have a `data` property containing the parsed response body, and a `status` property for the HTTP status code.

**Error handling:** Configured with `validateStatus: () => true` so it doesn't throw errors. Tests manually check `response.status`.

### Factories

Helper functions for creating test data:

- `createUserData(overrides?)` - Generate user data with random email
- `createImageFile(filename?, options?)` - Create a test image file (supports png, jpg, jpeg, gif)
- `createInvalidFile(filename?, content?)` - Create a non-image file for validation testing
- `createFormData(data)` - Convert object to FormData

### Assertions

Helper functions for common test assertions:

- `expectSuccess(response)` - Assert response has 2xx status
- `expectValidationError(response, field?)` - Assert response has 422 status with validation errors
- `expectStatus(response, status)` - Assert response has specific status code
- `expectProperties(data, properties[])` - Assert data has specific properties
- `measureResponseTime(fn)` - Measure execution time of async function

### Seeding

Helper functions for creating database records:

- `seedUser(overrides?)` - Create a user in the database and return the response
- `seedUsers(count, overrides?)` - Create multiple users in the database

### Types

TypeScript types for API responses:

- `UserResponse` - User resource type
- `PostResponse` - Post resource type
- `ValidationErrorResponse` - Validation error format
- `ErrorResponse` - Generic error format
- `TypedAxiosResponse<T>` - Type helper for Axios responses

### Configuration

Test configuration constants in `test/utils/config.ts`:

- `TEST_CONFIG.PORT` - Test server port (3001)
- `TEST_CONFIG.BASE_URL` - Base URL for HTTP requests
- `TEST_CONFIG.REQUEST_TIMEOUT` - Request timeout in milliseconds (5000ms)

### Test Server

A Bun HTTP server starts on port 3001 before tests run and stops after all tests complete. The server runs your actual Hono app, so tests make real HTTP requests.

```typescript
import "../utils/setup"  // This starts the test server and runs migrations
```

**Note:** Tests use SQLite (configured in `.env.test`) while development uses MySQL (configured in `.env`). The test database is cleaned up after all tests finish.

## Best Practices

1. **Always import the setup file** - `import "../utils/setup"` to start the test server
2. **Use factories** - Create test data with factories instead of hardcoding values
3. **Use assertion helpers** - Use `expectSuccess()`, `expectValidationError()`, etc. instead of manual assertions
4. **Add type annotations** - Use TypeScript types for responses: `http.get<UserResponse>(...)`
5. **Test both success and error cases** - Cover happy path and validation errors
6. **Use seeding utilities** - Use `seedUser()` and `seedUsers()` for database setup
7. **Group tests logically** - Use nested `describe` blocks for organization
8. **Use descriptive test names** - Names should explain what is being tested
9. **Remember real HTTP** - Tests make actual HTTP requests to a running server
10. **Database isolation** - Each test runs in a transaction that's rolled back automatically
