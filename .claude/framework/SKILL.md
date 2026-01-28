# Framework Skill

This skill documents the Hono + Bun framework patterns used in this project.

## Tech Stack

- **Runtime**: Bun (TypeScript/JavaScript runtime)
- **Web Framework**: Hono (lightweight, fast web framework)
- **ORM**: Lucid (AdonisJS ORM, standalone setup)
- **Database**: MySQL (production), SQLite (testing)
- **DI Container**: Typedi (dependency injection)
- **Validation**: VineJS
- **File Storage**: Flydrive
- **API Docs**: openapi-metadata

## Request Flow

```
Request → Middleware → Routes → Controller → Service → Model → Response
                                    ↓
                              Error Handler
```

## Entry Point (server.ts)

```typescript
import "reflect-metadata"  // Required for Typedi
import "@/utils/sentry"    // Error tracking
import { Hono } from "hono"
import { vineValidation } from "./app/middleware/vine_validation_middleware"
import api from "./routes/api"
import web from "./routes/web"
import errorHandler from "./app/error-handler"

const app = new Hono()

// Global middleware
app.use(vineValidation)

// Routes
app.route("/", web)
app.route("/", api)

// Error handler
app.onError(errorHandler)

export default { port: 3000, fetch: app.fetch }
```

## Hono Basics

### Route Definition

```typescript
import { Hono } from "hono"

const app = new Hono()

// Basic routes
app.get("/", (c) => c.text("Hello"))
app.post("/users", (c) => c.json({ id: 1 }))

// Route parameters
app.get("/users/:id", (c) => {
  const id = c.req.param("id")
  return c.json({ id })
})

// Query parameters
app.get("/search", (c) => {
  const q = c.req.query("q")
  return c.json({ query: q })
})

// Base path
const api = new Hono().basePath("/api")
api.get("/users", handler)  // /api/users

// Mount routes
app.route("/", api)
```

### Context Object

```typescript
app.get("/example", (c) => {
  // Request info
  c.req.url          // Full URL
  c.req.method       // HTTP method
  c.req.param("id")  // Route parameter
  c.req.query("q")   // Query parameter
  c.req.queries()    // All query params
  c.req.header("x-custom")  // Header value

  // Request body
  await c.req.json()      // JSON body
  await c.req.formData()  // Form data

  // Responses
  return c.json({ data })     // JSON response
  return c.text("Hello")      // Text response
  return c.html("<h1>Hi</h1>")// HTML response
  return c.redirect("/other") // Redirect
  return c.notFound()         // 404 response

  // Custom response
  return new Response("Custom", { status: 201 })
})
```

### Middleware

```typescript
import { Next } from "hono"
import type { Context } from "hono"

// Global middleware
app.use(async (c: Context, next: Next) => {
  console.log("Before request")
  await next()
  console.log("After request")
})

// Path-specific middleware
app.use("/api/*", authMiddleware)

// Multiple middleware
app.use("/admin/*", authMiddleware, adminMiddleware)
```

## Controller Helper

The `Controller()` helper resolves controllers from Typedi and handles responses:

```typescript
// utils/index.ts
export function Controller<T>(
  controller: Constructor<T>,
  func: keyof T
): (c: Context) => Promise<Response> {
  const instance = Container.get(controller)
  return async (c: Context) => {
    const data = await (instance[func] as any)(c)
    if (data instanceof Response) return data
    if (data instanceof String) return c.text(data)
    return c.json(data)
  }
}

// Usage in routes
route.get("/users", Controller(UserController, "getUsers"))
```

## Dependency Injection (Typedi)

```typescript
import { Service, Container } from "typedi"

// Mark classes with @Service()
@Service()
export default class UserService {
  async getUsers() {
    return await User.query()
  }
}

@Service()
export default class UserController {
  // Constructor injection
  constructor(private readonly userService: UserService) {}

  async getUsers() {
    return this.userService.getUsers()
  }
}

// Manual resolution
const instance = Container.get(UserController)
```

## Validation Middleware

```typescript
// Adds req.validate() to all requests
export const vineValidation = async ({ req }: Context, next: Next) => {
  (req as any).validate = async <T>(validator: VineValidator): Promise<T> => {
    // Collects data from JSON, form-data, and query params
    const payload = { ...params, ...jsonBody, ...formData }
    return await validator.validate(payload)
  }
  await next()
}

// Usage in controller
const payload = await req.validate(myValidator)
// payload is fully typed!
```

## Error Handling

```typescript
// app/error-handler.ts
export default function errorHandler(err: Error, c: Context) {
  // Validation errors -> 422
  if (err instanceof errors.E_VALIDATION_ERROR) {
    return c.json({
      success: false,
      message: err.message,
      errors: err.messages
    }, 422)
  }

  // Other errors -> 500
  return c.json({
    success: false,
    message: err.message || "Internal server error"
  }, 500)
}
```

## File Storage (Flydrive)

```typescript
import { disk } from "@/utils/disk"

// Store file
const fileName = `uploads/${randomUUIDv7()}.png`
await disk.put(fileName, content)

// Get URL
const url = await disk.getUrl(fileName)

// Delete file
await disk.delete(fileName)

// Check exists
const exists = await disk.exists(fileName)
```

## Environment Variables

```bash
# Required
APP_ENV=development|production|test
DATABASE_URL=mysql://user:pass@host:port/database
DRIVE_DISK=fs

# Optional
SENTRY_DSN=https://...
SENTRY_TRACES_SAMPLE_RATE=0.1
```

## Development Commands

```bash
bun run dev          # Start dev server with hot reload
bun run format       # Format code with Biome
bun run lint         # Lint and auto-fix
bun run test         # Run tests
bun run build:prod   # Build production executable
```

## Project Structure

```
├── app/
│   ├── controllers/     # Web controllers (views)
│   ├── middleware/      # Global middleware
│   ├── modules/         # Feature modules
│   │   └── {module}/
│   │       ├── {module}.controller.ts
│   │       ├── {module}.service.ts
│   │       ├── {module}.model.ts
│   │       └── {module}.validator.ts
│   └── error-handler.ts
├── config/              # Configuration files
├── migrations/          # Database migrations
├── routes/              # Route definitions
├── test/                # Tests
├── utils/               # Utilities
├── views/               # View templates
├── server.ts            # Entry point
└── knexfile.ts          # Knex config
```
