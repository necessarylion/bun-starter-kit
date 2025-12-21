import "hono"
import type { VineValidator } from "@vinejs/vine"
import { Infer, SchemaTypes, ValidationOptions } from "@vinejs/vine/types"

declare module "hono" {
	interface HonoRequest {
		validate<TSchema extends SchemaTypes>(
			validator: VineValidator<TSchema, any>,
			options?: ValidationOptions<Record<string, any>> | undefined,
		): Promise<Infer<TSchema>>
	}
}
