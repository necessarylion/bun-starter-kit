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
    const data = await response.json()
    expect(data).toHaveProperty("id")
  })
})
```

### Testing POST with Form Data

```typescript
import { createFormData, createImageFile, createUserData } from "../utils/factories"

test("should create user", async () => {
  const userData = createUserData()
  const avatar = createImageFile()

  const formData = createFormData({
    ...userData,
    avatar,
  })

  const response = await http.postForm("/api/users", formData)
  expect(response.status).toBe(200)
})
```

### Testing Validation Errors

```typescript
test("should return 422 for invalid data", async () => {
  const response = await http.post("/api/users", {
    email: "invalid-email"
  })

  expect(response.status).toBe(422)
  const data = await response.json()
  expect(data).toHaveProperty("errors")
})
```

## Test Utilities

### HttpClient

The `http` client provides methods for making HTTP requests to the app:

- `http.get(path, headers?)`
- `http.post(path, body?, headers?)`
- `http.postForm(path, formData, headers?)`
- `http.put(path, body?, headers?)`
- `http.patch(path, body?, headers?)`
- `http.delete(path, headers?)`

### Factories

Helper functions for creating test data:

- `createUserData(overrides?)` - Generate user data
- `createImageFile(filename?)` - Create a test image file
- `createFormData(data)` - Convert object to FormData

### Database Transactions

Tests automatically run inside database transactions that are rolled back after each test, ensuring test isolation. Migrations are run automatically before tests start.

```typescript
import "../utils/setup"  // This enables automatic transaction handling and runs migrations
```

**Note:** Tests use SQLite (configured in `.env.test`) while development uses MySQL (configured in `.env`). This separation ensures tests are fast and don't interfere with your development database.

## Best Practices

1. Always import the setup file to enable database transaction rollback
2. Use factories to create test data instead of hardcoding values
3. Test both success and error cases
4. Test validation errors for all required fields
5. Use descriptive test names that explain what is being tested
6. Group related tests using `describe` blocks
