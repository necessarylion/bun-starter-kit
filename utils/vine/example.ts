import vine, {
	VineAny,
	VineDate,
	VineEnum,
	VineNativeEnum,
	VineNumber,
	VineString,
} from "@vinejs/vine"
import { EnumLike } from "@vinejs/vine/types"

type Options = {
	example: any
}

declare module "@vinejs/vine" {
	interface VineString {
		example(example: string): this
	}
	interface VineAny {
		example(example: any): this
	}
	interface VineNumber {
		example(example: number): this
	}
	// biome-ignore lint/correctness/noUnusedVariables: vine js required same type
	interface VineNativeEnum<Values extends EnumLike> {
		example(example: string): this
	}
	// biome-ignore lint/correctness/noUnusedVariables: vine js required same type
	interface VineEnum<Values extends readonly unknown[]> {
		example(example: any): this
	}
	interface VineDate {
		example(example: string): this
	}
}

export const exampleRule = vine.createRule((_: unknown, opt: Options) => {
	return opt.example
})

VineString.macro("example", function (this: VineString, example: string) {
	return this.use(exampleRule({ example }))
})
VineNumber.macro("example", function (this: VineNumber, example: number) {
	return this.use(exampleRule({ example }))
})
VineNativeEnum.macro(
	"example",
	function (this: VineNativeEnum<any>, example: string) {
		return this.use(exampleRule({ example }))
	},
)
VineEnum.macro("example", function (this: VineEnum<any>, example: any) {
	return this.use(exampleRule({ example }))
})
VineAny.macro("example", function (this: VineAny, example: any) {
	return this.use(exampleRule({ example }))
})
VineDate.macro("example", function (this: VineDate, example: string) {
	return this.use(exampleRule({ example }))
})
