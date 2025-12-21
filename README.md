# Bun Starter Kit

A modern, type-safe web application starter kit built with **Hono**, **Bun**, **Lucid ORM**, **Knex Migrations**, **Vine Validator**, and **Typedi** for automatic dependency injection.

## 🚀 Tech Stack

- **[Hono](https://hono.dev/)** - Ultra-fast web framework
- **[Bun](https://bun.sh/)** - Fast all-in-one JavaScript runtime
- **[Lucid ORM](https://lucid.adonisjs.com/)** - SQL ORM for Node.js
- **[Knex.js](https://knexjs.org/)** - SQL query builder and migration tool
- **[Vine Validator](https://vinejs.dev/)** - Schema-based validation library
- **[Typedi](https://github.com/typestack/typedi)** - Dependency injection container

## 📋 Prerequisites

- [Bun](https://bun.sh/) (latest version)
- Docker and Docker Compose (for database)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bun-starter-kit
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
APP_ENV=development
DATABASE_URL=mysql://hono:hono@localhost:3307/hono
SENTRY_DSN=your_sentry_dsn_here
SENTRY_TRACES_SAMPLE_RATE=1.0
```

4. Start the database:
```bash
docker-compose up -d db
```

## 🗄️ Database Migrations

This project uses **Knex.js** for database migrations. Migrations are automatically run in production when the server starts.

### Migration Scripts

The following scripts are available in `package.json`:

#### Run Migrations
Apply all pending migrations:
```bash
bun run migration:run
```
This executes `bunx --bun knex migrate:latest` which runs all migrations that haven't been applied yet.

#### Rollback Migrations
Rollback the last batch of migrations:
```bash
bun run migration:rollback
```
This executes `bunx --bun knex migrate:rollback` which reverts the most recent migration batch.

#### Create New Migration
Generate a new migration file:
```bash
bun run migration:create migration_name
```
This executes `bunx --bun knex migrate:make -x ts` which creates a new TypeScript migration file in the `migrations/` directory.

**Example:**
```bash
bun run migration:create add_posts_table
# Creates: migrations/YYYYMMDDHHMMSS_add_posts_table.ts
```

### Migration Files

Migrations are located in the `migrations/` directory. Each migration file exports:
- `up(knex: Knex)` - Function to apply the migration
- `down(knex: Knex)` - Function to rollback the migration

**Example migration structure:**
```typescript
import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary()
    table.string("email").notNullable().unique()
    // ... more columns
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users")
}
```

### Automatic Migrations

In production (`APP_ENV=production`), migrations run automatically when the server starts via the `runMigration()` function in `utils/migration.ts`.

## 🏃 Development

### Start Development Server
```bash
bun run dev
```
This starts the server with hot-reload enabled. The server will be available at `http://localhost:3000`.

### Code Formatting
```bash
bun run format
```
Formats code using Biome.

### Linting
```bash
bun run lint
```
Runs Biome linter with auto-fix.

### Production Build
```bash
bun run build:prod
```
Compiles the server into a standalone executable with all dependencies bundled.

## 📁 Project Structure

```
bun-starter-kit/
├── app/
│   ├── controllers/          # Request controllers
│   │   └── web_controller.tsx
│   ├── middleware/          # Custom middleware
│   │   └── vine_validation_middleware.ts
│   ├── modules/             # Feature modules
│   │   ├── post/
│   │   │   └── post.model.ts
│   │   └── user/
│   │       ├── user.controller.ts
│   │       ├── user.model.ts
│   │       ├── user.service.ts
│   │       └── user.validator.ts
│   └── error-handler.ts     # Global error handler
├── config/
│   └── database.ts          # Lucid database configuration
├── migrations/              # Knex migration files
│   └── 20251220144756_init.ts
├── routes/                  # Route definitions
│   ├── api.ts
│   └── web.ts
├── types/                   # TypeScript type definitions
│   ├── env.d.ts
│   └── hono.d.ts
├── utils/                   # Utility functions
│   ├── index.ts
│   ├── lucid.ts
│   ├── migration.ts        # Migration runner
│   └── sentry.ts
├── views/                   # JSX/TSX views
│   ├── components/
│   │   └── layout.tsx
│   └── home.tsx
├── docker-compose.yml       # Docker services configuration
├── knexfile.ts             # Knex configuration
├── LICENSE                  # MIT License
├── server.ts               # Application entry point
└── package.json
```

## 🐳 Docker

The project includes Docker Compose configuration for easy database setup:

```bash
# Start database
docker-compose up -d db

# Stop database
docker-compose down

# View logs
docker-compose logs -f db
```

## 🔧 Configuration

### Database Configuration

Database connection is configured in:
- `knexfile.ts` - Knex configuration (used for migrations)
- `config/database.ts` - Lucid ORM configuration

Both use the `DATABASE_URL` environment variable.

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_ENV` | Application environment (`development`, `production`) | - |
| `DATABASE_URL` | MySQL connection string | - |
| `SENTRY_DSN` | Sentry error tracking DSN | - |
| `SENTRY_TRACES_SAMPLE_RATE` | Sentry performance sampling rate | `1.0` |

## 📝 Features

- ✅ **Type-safe** - Full TypeScript support
- ✅ **Hot Reload** - Fast development with Bun's hot reload
- ✅ **ORM** - Lucid ORM for database operations
- ✅ **Migrations** - Knex migrations for database schema management
- ✅ **Validation** - Vine Validator for request validation
- ✅ **Dependency Injection** - Typedi for automatic DI
- ✅ **Error Tracking** - Sentry integration
- ✅ **Code Quality** - Biome for formatting and linting

## 🚀 Getting Started

1. Install dependencies: `bun install`
2. Start database: `docker-compose up -d db`
3. Run migrations: `bun run migration:run`
4. Start dev server: `bun run dev`
5. Open browser: `http://localhost:3000`

## 📚 Additional Resources

- [Hono Documentation](https://hono.dev/)
- [Bun Documentation](https://bun.sh/docs)
- [Lucid ORM Documentation](https://lucid.adonisjs.com/)
- [Knex.js Documentation](https://knexjs.org/)
- [Vine Validator Documentation](https://vinejs.dev/)
- [Typedi Documentation](https://github.com/typestack/typedi)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
