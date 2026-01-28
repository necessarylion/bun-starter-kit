# API Design Skill

This skill guides you through creating new API endpoints following the project's established patterns.

## Checklist for New API Endpoint

1. **Create Module Directory**: `app/modules/{name}/`
2. **Define Model** extending `Model` from `utils/lucid.ts`
3. **Create Validator** using `@vinejs/vine`
4. **Create Service** decorated with `@Service()`
5. **Create Controller** decorated with `@Service()`, inject service via constructor
6. **Add OpenAPI Decorators** to controller methods
7. **Wire up Routes** in `routes/api.ts` using `Controller()` helper
8. **Register Controller** in `config/openapi.ts` controllers array

## Controller Pattern

```typescript
import { Service } from "typedi"
import { Context } from "hono"
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "openapi-metadata/decorators"
import { myValidator } from "./my.validator"
import MyService from "./my.service"
import MyModel from "./my.model"

@Service()
@ApiTags("ModuleName")
export default class MyController {
  constructor(private readonly service: MyService) {}

  @ApiOperation({
    methods: ["get"],
    path: "/api/items",
    summary: "Get all items"
  })
  @ApiResponse({ type: [MyModel] })
  async getItems(_c: Context) {
    return await this.service.getItems()
  }

  @ApiOperation({
    methods: ["post"],
    path: "/api/items",
    summary: "Create a new item"
  })
  @ApiBody({ type: () => myValidator, mediaType: "application/json" })
  @ApiResponse({ type: MyModel, status: 201 })
  async createItem({ req }: Context) {
    const payload = await req.validate(myValidator)
    return await this.service.createItem(payload)
  }

  @ApiOperation({
    methods: ["get"],
    path: "/api/items/:id",
    summary: "Get item by ID"
  })
  @ApiResponse({ type: MyModel })
  async getItem({ req }: Context) {
    const id = req.param("id")
    return await this.service.getItem(Number(id))
  }

  @ApiOperation({
    methods: ["put"],
    path: "/api/items/:id",
    summary: "Update item"
  })
  @ApiBody({ type: () => myUpdateValidator, mediaType: "application/json" })
  @ApiResponse({ type: MyModel })
  async updateItem({ req }: Context) {
    const id = req.param("id")
    const payload = await req.validate(myUpdateValidator)
    return await this.service.updateItem(Number(id), payload)
  }

  @ApiOperation({
    methods: ["delete"],
    path: "/api/items/:id",
    summary: "Delete item"
  })
  @ApiResponse({ status: 204 })
  async deleteItem({ req }: Context) {
    const id = req.param("id")
    await this.service.deleteItem(Number(id))
    return null
  }
}
```

## Validator Pattern

```typescript
import vine from "@vinejs/vine"

export const myValidator = vine.create(
  vine.object({
    name: vine.string().minLength(1).maxLength(255).example("Item Name"),
    description: vine.string().optional().example("Item description"),
    email: vine.string().email().example("test@example.com"),
    status: vine.enum(["active", "inactive"]).example("active"),
    count: vine.number().min(0).example(10)
  })
)

export const myUpdateValidator = vine.create(
  vine.object({
    name: vine.string().minLength(1).maxLength(255).optional(),
    description: vine.string().optional()
  })
)
```

## Service Pattern

```typescript
import { Service } from "typedi"
import { Infer } from "@vinejs/vine/types"
import { myValidator, myUpdateValidator } from "./my.validator"
import MyModel from "./my.model"

@Service()
export default class MyService {
  async getItems() {
    return await MyModel.query().orderBy("created_at", "desc")
  }

  async getItem(id: number) {
    return await MyModel.findOrFail(id)
  }

  async createItem(payload: Infer<typeof myValidator>) {
    return await MyModel.create(payload)
  }

  async updateItem(id: number, payload: Infer<typeof myUpdateValidator>) {
    const item = await MyModel.findOrFail(id)
    item.merge(payload)
    await item.save()
    return item
  }

  async deleteItem(id: number) {
    const item = await MyModel.findOrFail(id)
    await item.delete()
  }
}
```

## Route Registration

```typescript
// routes/api.ts
import { Hono } from "hono"
import MyController from "@/app/modules/my/my.controller"
import { Controller } from "@/utils"

const route = new Hono().basePath("/api")

// CRUD routes
route.get("/items", Controller(MyController, "getItems"))
route.post("/items", Controller(MyController, "createItem"))
route.get("/items/:id", Controller(MyController, "getItem"))
route.put("/items/:id", Controller(MyController, "updateItem"))
route.delete("/items/:id", Controller(MyController, "deleteItem"))

export default route
```

## OpenAPI Registration

```typescript
// config/openapi.ts
import MyController from "@/app/modules/my/my.controller"

export default {
  controllers: [
    // ... existing controllers
    MyController
  ],
  // ...
}
```

## Validation Options

- `vine.string()` - String validation
- `.email()` - Email format
- `.minLength(n)` / `.maxLength(n)` - Length constraints
- `.optional()` - Make field optional
- `.nullable()` - Allow null value
- `vine.number()` - Number validation
- `.min(n)` / `.max(n)` - Range constraints
- `vine.enum([])` - Enum values
- `vine.boolean()` - Boolean
- `vine.date()` - Date validation
- `vine.nativeFile()` - File upload
- `.mimeTypes([])` - Allowed file types
- `.confirmed()` - Must match `field_confirmation`
- `.example()` - OpenAPI example value

## Response Types

- Return object/array -> JSON response
- Return `c.text()` -> Text response
- Return `Response` -> Custom response
- Return `null` -> Empty 204 response
