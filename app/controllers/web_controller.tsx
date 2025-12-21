import { Context } from "hono"
import { Service } from "typedi"
import { HomeView } from "@/views/home"

@Service()
export default class WebController {
	async home({ html }: Context) {
		return html(<HomeView />)
	}
}
