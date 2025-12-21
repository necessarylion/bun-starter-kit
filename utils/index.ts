import type { Context } from "hono"
import Container from "typedi"

type Constructor<T> = new (...args: any[]) => T

export function C<T>(
	controller: Constructor<T>,
	func: keyof T,
): (c: Context) => Promise<Response> {
	const instance = Container.get(controller)
	return async (c: Context) => {
		const data = await (instance[func] as any)(c)

		// normal response
		if (data instanceof Response) {
			return data
		}

		// text response
		if (data instanceof String) {
			return c.text(data as string)
		}

		// json response
		return c.json(data)
	}
}
