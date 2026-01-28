# Model and Migration Skill

This skill guides you through creating database models and migrations using Lucid ORM and Knex.

## Database Architecture

**Dual Configuration:**
- **Knex** (`knexfile.ts`): Used for migrations only
- **Lucid ORM** (`config/database.ts`): Used for all application queries

Both use the same `DATABASE_URL` environment variable.

## Creating a New Migration

```bash
# Create migration file
bun run migration:create add_products_table

# Run migrations
bun run migration:run

# Rollback last batch
bun run migration:rollback
```

## Migration Pattern

```typescript
// migrations/20251228120000_add_products_table.ts
import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("products", (table) => {
    // Primary key
    table.increments("id").primary()

    // String columns
    table.string("name").notNullable()
    table.string("sku").unique().notNullable()
    table.string("slug").unique()

    // Text columns
    table.text("description").nullable()

    // Number columns
    table.decimal("price", 10, 2).notNullable().defaultTo(0)
    table.integer("quantity").unsigned().defaultTo(0)

    // Boolean columns
    table.boolean("is_active").defaultTo(true)

    // Enum columns
    table.enum("status", ["draft", "published", "archived"]).defaultTo("draft")

    // JSON columns
    table.json("metadata").nullable()

    // Foreign key
    table.integer("category_id").unsigned().nullable()
    table.foreign("category_id")
      .references("categories.id")
      .onDelete("SET NULL")

    // Required foreign key
    table.integer("user_id").unsigned().notNullable()
    table.foreign("user_id")
      .references("users.id")
      .onDelete("CASCADE")

    // Timestamps
    table.timestamp("published_at").nullable()
    table.timestamp("updated_at").nullable()
    table.timestamp("created_at").defaultTo(knex.fn.now())
  })

  // Create index
  await knex.schema.alterTable("products", (table) => {
    table.index(["category_id", "status"])
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("products")
}
```

## Model Pattern

```typescript
// app/modules/product/product.model.ts
import { Model } from "@/utils/lucid"
import { column, belongsTo, hasMany, computed } from "@adonisjs/lucid/orm"
import type { BelongsTo, HasMany } from "@adonisjs/lucid/types/relations"
import { DateTime } from "luxon"
import { ApiProperty } from "openapi-metadata/decorators"
import User from "../user/user.model"
import Category from "../category/category.model"

export default class Product extends Model {
  // Table name (optional - defaults to snake_case plural of class name)
  static table = "products"

  // Primary key
  @ApiProperty()
  @column({ isPrimary: true })
  id!: number

  // String columns
  @ApiProperty({ example: "Product Name" })
  @column()
  name!: string

  @ApiProperty()
  @column()
  sku!: string

  @ApiProperty()
  @column()
  slug!: string | null

  // Text columns
  @ApiProperty()
  @column()
  description!: string | null

  // Number columns
  @ApiProperty({ example: 99.99 })
  @column()
  price!: number

  @ApiProperty({ example: 100 })
  @column()
  quantity!: number

  // Boolean columns
  @ApiProperty()
  @column()
  isActive!: boolean

  // Enum columns
  @ApiProperty({ enum: ["draft", "published", "archived"] })
  @column()
  status!: "draft" | "published" | "archived"

  // JSON columns
  @ApiProperty()
  @column()
  metadata!: Record<string, unknown> | null

  // Foreign keys
  @column()
  categoryId!: number | null

  @column()
  userId!: number

  // DateTime columns
  @ApiProperty()
  @column.dateTime()
  publishedAt!: DateTime | null

  @ApiProperty()
  @column.dateTime({ autoCreate: true })
  createdAt!: DateTime

  @ApiProperty()
  @column.dateTime({ autoUpdate: true })
  updatedAt!: DateTime | null

  // Relationships
  @ApiProperty({ type: () => User })
  @belongsTo(() => User)
  user!: BelongsTo<typeof User>

  @ApiProperty({ type: () => Category })
  @belongsTo(() => Category)
  category!: BelongsTo<typeof Category>

  @ApiProperty({ type: () => [Review] })
  @hasMany(() => Review)
  reviews!: HasMany<typeof Review>

  // Computed property (not stored in DB)
  @computed()
  get inStock() {
    return this.quantity > 0
  }
}
```

## Column Decorators

```typescript
// Basic column
@column()
name!: string

// Primary key
@column({ isPrimary: true })
id!: number

// DateTime with auto-create
@column.dateTime({ autoCreate: true })
createdAt!: DateTime

// DateTime with auto-update
@column.dateTime({ autoUpdate: true })
updatedAt!: DateTime

// Custom column name
@column({ columnName: "user_name" })
name!: string

// Serialize/deserialize
@column({
  serialize: (value: Date) => value.toISOString(),
  consume: (value: string) => new Date(value)
})
date!: Date
```

## Relationship Decorators

```typescript
import {
  belongsTo,
  hasMany,
  hasOne,
  manyToMany
} from "@adonisjs/lucid/orm"
import type {
  BelongsTo,
  HasMany,
  HasOne,
  ManyToMany
} from "@adonisjs/lucid/types/relations"

// Belongs to (foreign key on this model)
@belongsTo(() => User)
user!: BelongsTo<typeof User>

// Custom foreign key
@belongsTo(() => User, { foreignKey: "authorId" })
author!: BelongsTo<typeof User>

// Has many (foreign key on related model)
@hasMany(() => Post)
posts!: HasMany<typeof Post>

// Has one
@hasOne(() => Profile)
profile!: HasOne<typeof Profile>

// Many to many (pivot table)
@manyToMany(() => Tag, {
  pivotTable: "post_tags",
  pivotForeignKey: "post_id",
  pivotRelatedForeignKey: "tag_id"
})
tags!: ManyToMany<typeof Tag>
```

## Querying Models

```typescript
// Find all
const products = await Product.all()

// Find by primary key
const product = await Product.find(1)
const product = await Product.findOrFail(1)  // Throws if not found

// Find by column
const product = await Product.findBy("sku", "PROD-001")
const product = await Product.findByOrFail("sku", "PROD-001")

// Query builder
const products = await Product.query()
  .where("status", "published")
  .where("price", ">=", 100)
  .orderBy("created_at", "desc")
  .limit(10)

// With relationships
const products = await Product.query()
  .preload("user")
  .preload("category")
  .preload("reviews", (query) => {
    query.orderBy("created_at", "desc").limit(5)
  })

// Aggregates
const count = await Product.query().count("* as total")
const avg = await Product.query().avg("price as avgPrice")

// First result
const product = await Product.query()
  .where("status", "published")
  .first()
```

## Creating Records

```typescript
// Create single record
const product = await Product.create({
  name: "New Product",
  sku: "PROD-001",
  price: 99.99,
  userId: 1
})

// Create multiple records
const products = await Product.createMany([
  { name: "Product 1", sku: "P1", price: 10, userId: 1 },
  { name: "Product 2", sku: "P2", price: 20, userId: 1 }
])

// First or create (find existing or create new)
const product = await Product.firstOrCreate(
  { sku: "PROD-001" },           // Search criteria
  { name: "Product", price: 50 }  // Create attributes
)

// Update or create
const product = await Product.updateOrCreate(
  { sku: "PROD-001" },
  { name: "Updated Product", price: 75 }
)
```

## Updating Records

```typescript
// Update single record
const product = await Product.findOrFail(1)
product.name = "Updated Name"
product.price = 150
await product.save()

// Merge and save
const product = await Product.findOrFail(1)
product.merge({ name: "Updated Name", price: 150 })
await product.save()

// Update with query
await Product.query()
  .where("status", "draft")
  .update({ status: "published" })
```

## Deleting Records

```typescript
// Delete single record
const product = await Product.findOrFail(1)
await product.delete()

// Delete with query
await Product.query()
  .where("status", "archived")
  .delete()
```

## Working with Relationships

```typescript
// Create with relationship
const user = await User.findOrFail(1)
await user.related("posts").create({
  title: "New Post",
  content: "Content..."
})

// Associate belongs to
const product = await Product.findOrFail(1)
const category = await Category.findOrFail(2)
await product.related("category").associate(category)

// Dissociate
await product.related("category").dissociate()

// Attach many-to-many
const post = await Post.findOrFail(1)
await post.related("tags").attach([1, 2, 3])

// Detach
await post.related("tags").detach([1, 2])

// Sync (replace all)
await post.related("tags").sync([2, 3, 4])
```

## Migration Column Types Reference

```typescript
// Strings
table.string("name")                    // VARCHAR(255)
table.string("code", 50)                // VARCHAR(50)
table.text("description")               // TEXT

// Numbers
table.integer("count")                  // INTEGER
table.bigInteger("views")               // BIGINT
table.decimal("price", 10, 2)           // DECIMAL(10,2)
table.float("rating")                   // FLOAT

// Boolean
table.boolean("is_active")              // BOOLEAN

// Dates
table.date("birth_date")                // DATE
table.dateTime("published_at")          // DATETIME
table.timestamp("created_at")           // TIMESTAMP
table.time("start_time")                // TIME

// Others
table.json("metadata")                  // JSON
table.binary("data")                    // BLOB
table.uuid("uuid")                      // UUID
table.enum("status", ["a", "b", "c"])   // ENUM

// Modifiers
.notNullable()                          // NOT NULL
.nullable()                             // Allow NULL
.defaultTo(value)                       // Default value
.unique()                               // UNIQUE constraint
.unsigned()                             // UNSIGNED (for integers)
.primary()                              // PRIMARY KEY
.index()                                // Create index
```

## Migration Best Practices

1. **Use snake_case** for table and column names
2. **Always implement** both `up()` and `down()` functions
3. **Include timestamps**: `created_at` and `updated_at`
4. **Define foreign keys** with `.onDelete()` behavior
5. **Add indexes** for frequently queried columns
6. **Keep migrations atomic**: one logical change per migration
7. **Never edit** already-run migrations - create new ones

## Naming Conventions

| Type | Example |
|------|---------|
| Table | `users`, `products`, `user_profiles` |
| Column | `created_at`, `user_id`, `is_active` |
| Foreign Key | `user_id`, `category_id` |
| Pivot Table | `post_tags`, `user_roles` |
| Model | `User`, `Product`, `UserProfile` |
| Property | `createdAt`, `userId`, `isActive` |
