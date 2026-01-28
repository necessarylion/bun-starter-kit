# Testing Skill

This skill guides you through writing tests for this Bun + Hono project.

## Test Configuration

- **Test Runner**: Bun's built-in test runner
- **Test Database**: SQLite (`.env.test`)
- **HTTP Client**: Axios
- **Isolation**: Transaction rollback per test

## Directory Structure

```
test/
├── api/           # API endpoint tests
│   └── users.test.ts
├── web/           # Web route tests
│   └── home.test.ts
├── utils/         # Test utilities
│   ├── setup.ts       # Test server & DB setup
│   ├── http-client.ts # Axios instance
│   ├── factories.ts   # Test data factories
│   └── assertions.ts  # Custom assertions
└── README.md
```

## Writing a Basic Test

```typescript
import { describe, expect, test } from "bun:test"
import { http } from "../utils/http-client"
import "../utils/setup"  // Required: enables DB transaction rollback

describe("User API", () => {
  describe("GET /api/users", () => {
    test("should return user list", async () => {
      const response = await http.get("/api/users")

      expect(response.status).toBe(200)
      expect(Array.isArray(response.data)).toBe(true)
    })
  })

  describe("POST /api/users", () => {
    test("should create user with valid data", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        password_confirmation: "password123"
      }

      const response = await http.post("/api/users", userData)

      expect(response.status).toBe(200)
      expect(response.data).toHaveProperty("id")
      expect(response.data.name).toBe(userData.name)
    })

    test("should return 422 for invalid email", async () => {
      const response = await http.post("/api/users", {
        name: "Test",
        email: "invalid-email",
        password: "password123",
        password_confirmation: "password123"
      })

      expect(response.status).toBe(422)
      expect(response.data).toHaveProperty("errors")
    })
  })
})
```

## HTTP Client Usage

```typescript
import { http } from "../utils/http-client"

// GET request
const response = await http.get("/api/users")
const response = await http.get("/api/users?status=active")
const response = await http.get("/api/users/1")

// POST request (JSON)
const response = await http.post("/api/users", {
  name: "Test User",
  email: "test@example.com"
})

// POST request (FormData)
const formData = new FormData()
formData.append("name", "Test User")
formData.append("avatar", file)
const response = await http.post("/api/users", formData)

// PUT request
const response = await http.put("/api/users/1", { name: "Updated" })

// DELETE request
const response = await http.delete("/api/users/1")

// Response structure
response.status  // HTTP status code
response.data    // Response body (parsed JSON)
```

## Test Factories

```typescript
import {
  createUserData,
  createImageFile,
  createFormData
} from "../utils/factories"

// Create user data with defaults
const userData = createUserData()
// {
//   name: "Test User",
//   email: "test-{uuid}@example.com",
//   password: "password123",
//   password_confirmation: "password123"
// }

// Override specific fields
const userData = createUserData({
  name: "Custom Name",
  email: "custom@example.com"
})

// Create test image file
const avatar = createImageFile()
const avatar = createImageFile("custom-name.png")

// Create FormData from object
const formData = createFormData({
  name: "Test User",
  email: "test@example.com",
  avatar: createImageFile()
})
```

## Custom Assertions

```typescript
import {
  expectSuccess,
  expectValidationError,
  expectProperties
} from "../utils/assertions"

// Check successful response (2xx)
expectSuccess(response)

// Check validation error (422)
expectValidationError(response)
expectValidationError(response, "email")  // Check specific field

// Check object has properties
expectProperties(response.data, ["id", "name", "email"])
```

## Complete Test Example

```typescript
import { describe, expect, test, beforeEach } from "bun:test"
import { http } from "../utils/http-client"
import {
  createUserData,
  createImageFile,
  createFormData
} from "../utils/factories"
import {
  expectSuccess,
  expectValidationError,
  expectProperties
} from "../utils/assertions"
import "../utils/setup"

describe("User API", () => {
  describe("POST /api/users", () => {
    test("should create user with all fields", async () => {
      const userData = createUserData()
      const avatar = createImageFile()
      const formData = createFormData({ ...userData, avatar })

      const response = await http.post("/api/users", formData)

      expectSuccess(response)
      expectProperties(response.data, ["id", "name", "email", "avatar"])
      expect(response.data.name).toBe(userData.name)
      expect(response.data.email).toBe(userData.email)
    })

    test("should reject missing required fields", async () => {
      const response = await http.post("/api/users", {})

      expectValidationError(response)
    })

    test("should reject invalid email format", async () => {
      const userData = createUserData({ email: "not-an-email" })
      const formData = createFormData(userData)

      const response = await http.post("/api/users", formData)

      expectValidationError(response, "email")
    })

    test("should reject password mismatch", async () => {
      const userData = createUserData({
        password: "password123",
        password_confirmation: "different"
      })
      const formData = createFormData(userData)

      const response = await http.post("/api/users", formData)

      expectValidationError(response)
    })

    test("should reject short password", async () => {
      const userData = createUserData({
        password: "short",
        password_confirmation: "short"
      })
      const formData = createFormData(userData)

      const response = await http.post("/api/users", formData)

      expectValidationError(response)
    })
  })

  describe("GET /api/users", () => {
    test("should return empty array initially", async () => {
      const response = await http.get("/api/users")

      expectSuccess(response)
      expect(response.data).toEqual([])
    })

    test("should return created users", async () => {
      // Create a user first
      const userData = createUserData()
      const avatar = createImageFile()
      const formData = createFormData({ ...userData, avatar })
      await http.post("/api/users", formData)

      // Get users
      const response = await http.get("/api/users")

      expectSuccess(response)
      expect(response.data.length).toBe(1)
      expect(response.data[0].name).toBe(userData.name)
    })
  })
})
```

## Testing File Uploads

```typescript
import { createImageFile, createFormData } from "../utils/factories"

test("should upload avatar", async () => {
  const userData = createUserData()
  const avatar = createImageFile("avatar.png")
  const formData = createFormData({ ...userData, avatar })

  const response = await http.post("/api/users", formData)

  expectSuccess(response)
  expect(response.data.avatar).toContain("avatars/")
})

test("should reject invalid file type", async () => {
  const userData = createUserData()
  // Create non-image file
  const file = new File(["content"], "file.txt", { type: "text/plain" })
  const formData = createFormData({ ...userData, avatar: file })

  const response = await http.post("/api/users", formData)

  expectValidationError(response)
})
```

## Database Isolation

Tests are automatically isolated using database transactions:

```typescript
// test/utils/setup.ts
beforeEach(async () => {
  await lucid.db.beginGlobalTransaction()
})

afterEach(async () => {
  await lucid.db.rollbackGlobalTransaction()
})
```

Each test runs in its own transaction that gets rolled back, ensuring:
- Tests don't affect each other
- Database is clean for each test
- No cleanup code needed

## Running Tests

```bash
# Run all tests
bun run test

# Run specific test file
bun test test/api/users.test.ts

# Run tests in watch mode
bun run test:watch

# Run with coverage
bun test --coverage
```

## Test Checklist

- [ ] Test successful operations (happy path)
- [ ] Test validation errors for each field
- [ ] Test missing required fields
- [ ] Test invalid data formats
- [ ] Test edge cases (empty strings, null values)
- [ ] Test file upload validation (if applicable)
- [ ] Test authentication/authorization (if applicable)
- [ ] Test relationships and data integrity
