import { Context } from "hono"
import { generateScalarUI } from "openapi-metadata/ui"
import { Service } from "typedi"
import { HomeView } from "@/views/home"

@Service()
export default class WebController {
	async home({ html }: Context) {
		return html(<HomeView />)
	}

	async docs({ html }: Context) {
		const ui = generateScalarUI("/openapi.json")
		return html(ui)
	}
}
