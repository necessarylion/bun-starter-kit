# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
bun run dev                    # Start dev server with hot reload on :3000

# Code Quality
bun run format                 # Format code with Biome
bun run lint                   # Lint and auto-fix with Biome

# Database Migrations
bun run migration:run          # Apply all pending migrations
bun run migration:rollback     # Rollback last migration batch
bun run migration:create name  # Create new TypeScript migration in migrations/

# Production
bun run build:prod            # Build standalone executable with bundled dependencies

# Docker
docker-compose up -d db       # Start MySQL database
docker-compose down           # Stop all services
```

## Architecture Overview

### Request Flow

1. **Entry Point** (`server.ts`): Imports `reflect-metadata` for Typedi, initializes Sentry, runs migrations in production, sets up Hono app with global middleware and routes
2. **Middleware** (`vineValidation`): Attaches `req.validate()` method to all requests for validation
3. **Routes** (`routes/api.ts`, `routes/web.ts`): Use `Controller()` helper to wire up controller methods
4. **Controller Helper** (`utils/index.ts`): Resolves controller instances from Typedi container, invokes methods, and returns appropriate responses (JSON/text/custom)
5. **Controllers**: Decorated with `@Service()`, inject dependencies via constructor
6. **Services**: Handle business logic, interact with models and external services
7. **Models**: Extend Lucid's `BaseModel` from `utils/lucid.ts`
8. **Error Handler** (`app/error-handler.ts`): Catches validation errors and other exceptions

### Dependency Injection (Typedi)

- All controllers and services must be decorated with `@Service()`
- Dependencies are injected via constructor parameters
- The `Controller()` helper in `utils/index.ts` resolves instances from the DI container
- `reflect-metadata` must be imported at the top of `server.ts`

Example:
```typescript
@Service()
export class MyController {
  constructor(private readonly myService: MyService) {}
}
```

### Database Architecture

**Dual Configuration**:
- **Knex** (`knexfile.ts`): Used exclusively for migrations via CLI
- **Lucid ORM** (`config/database.ts`): Used for all application queries, imports Knex config

Both configurations point to the same `DATABASE_URL` environment variable.

**Lucid Setup** (`utils/lucid.ts`):
- Custom initialization required for standalone usage outside AdonisJS
- Creates `Database` instance with logger and event emitter
- Sets up `BaseModel` with custom `SnakeCaseNamingStrategy` that uses lodash's `snakeCase`
- All models must extend the exported `Model` from `utils/lucid.ts`, not Lucid's BaseModel directly

**Migration Behavior**:
- In production (`NODE_ENV=production`), migrations run automatically on server startup via `runMigration()` in `utils/migration.ts`
- In development, run migrations manually with `bun run migration:run`
- Migration files export `up()` and `down()` functions using Knex schema builder

### Validation System

**Vine Validator Integration**:
- Global middleware (`app/middleware/vine_validation_middleware.ts`) adds `validate()` method to all requests
- Type augmentation in `types/hono.d.ts` extends `HonoRequest` interface
- Supports JSON, multipart/form-data, and query parameters
- Validators are defined in module directories (e.g., `user.validator.ts`)

Usage in controllers:
```typescript
const payload = await req.validate(myValidator)
// payload is fully typed based on validator schema
```

### File Storage (Flydrive)

- Configured in `config/drive.ts` with available drivers
- Current driver selected via `DRIVE_DISK` environment variable
- Imported as singleton `disk` from `utils/disk.ts`
- FSDriver stores files in `storage/` directory relative to project root

### Module Structure

Modules follow a consistent pattern in `app/modules/{module}/`:
- `{module}.model.ts` - Lucid ORM model with decorators
- `{module}.controller.ts` - Request handlers with `@Service()` decorator
- `{module}.service.ts` - Business logic with `@Service()` decorator
- `{module}.validator.ts` - Vine validation schemas

### Error Handling

Global error handler in `app/error-handler.ts`:
- Catches `E_VALIDATION_ERROR` from Vine and returns 422 with formatted errors
- All other errors return 500 with error message
- Sentry integration automatically captures exceptions

## Key Patterns

### Creating New API Endpoints

1. Create module directory: `app/modules/{name}/`
2. Define model extending `Model` from `utils/lucid.ts`
3. Create validator using `@vinejs/vine`
4. Create service decorated with `@Service()`
5. Create controller decorated with `@Service()`, inject service via constructor
6. Wire up routes in `routes/api.ts` using `Controller()` helper:
   ```typescript
   route.post("/path", Controller(MyController, "methodName"))
   ```

### Working with Models

```typescript
import { Model } from "@/utils/lucid"
import { column, hasMany } from "@adonisjs/lucid/orm"

export default class MyModel extends Model {
  @column({ isPrimary: true })
  declare id: number

  @hasMany(() => RelatedModel)
  declare related: HasMany<typeof RelatedModel>
}

// Querying
await MyModel.query().preload("related")
await MyModel.create({ ... })
```

### Creating Migrations

```bash
bun run migration:create add_my_table
```

Follow the pattern in existing migrations:
- Use snake_case for table and column names
- Define foreign keys with `.onDelete()` behavior
- Include `created_at` and `updated_at` timestamps
- Implement both `up()` and `down()` functions

## Environment Variables

Required:
- `APP_ENV` - `development` or `production`
- `DATABASE_URL` - MySQL connection string format: `mysql://user:pass@host:port/database`
- `DRIVE_DISK` - Flydrive disk driver (e.g., `fs`)

Optional:
- `SENTRY_DSN` - Error tracking
- `SENTRY_TRACES_SAMPLE_RATE` - Performance monitoring sample rate
