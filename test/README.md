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

test("should create user", async () => {
  const userData = createUserData()
  const avatar = createImageFile()

  const formData = createFormData({
    ...userData,
    avatar,
  })

  const response = await http.post("/api/users", formData)
  expect(response.status).toBe(200)
  expect(response.data).toHaveProperty("id")
})
```

### Testing Validation Errors

```typescript
test("should return 422 for invalid data", async () => {
  const formData = createFormData({ email: "invalid-email" })
  const response = await http.post("/api/users", formData)

  expect(response.status).toBe(422)
  expect(response.data).toHaveProperty("errors")
})
```

## Test Utilities

### HttpClient (Axios)

The `http` client is a standard axios instance that makes requests to a test server running on port 3333:

- `http.get(url, config?)`
- `http.post(url, data?, config?)`
- `http.put(url, data?, config?)`
- `http.patch(url, data?, config?)`
- `http.delete(url, config?)`

**Response format:** Axios responses have a `data` property containing the parsed response body, and a `status` property for the HTTP status code.

**Error handling:** Configured with `validateStatus: () => true` so it doesn't throw errors. Tests manually check `response.status`.

### Factories

Helper functions for creating test data:

- `createUserData(overrides?)` - Generate user data
- `createImageFile(filename?)` - Create a test image file
- `createFormData(data)` - Convert object to FormData

### Test Server

A Bun HTTP server starts on port 3333 before tests run and stops after all tests complete. The server runs your actual Hono app, so tests make real HTTP requests.

```typescript
import "../utils/setup"  // This starts the test server and runs migrations
```

**Note:** Tests use SQLite (configured in `.env.test`) while development uses MySQL (configured in `.env`). The test database is cleaned up after all tests finish.

## Best Practices

1. Always import the setup file to start the test server
2. Use factories to create test data instead of hardcoding values
3. Test both success and error cases
4. Test validation errors for all required fields
5. Use descriptive test names that explain what is being tested
6. Group related tests using `describe` blocks
7. Remember that tests make real HTTP requests to a running server
