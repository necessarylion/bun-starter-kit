import WebController from "@/app/controllers/web_controller"
import UserController from "@/app/modules/user/user.controller"
import { description, version } from "@/package.json"
import { LuxonTypeLoader } from "@/utils/openapi/loaders/luxon"
import { VineTypeLoader } from "@/utils/openapi/loaders/vine"

export default {
	controllers: [WebController, UserController],
	loaders: [LuxonTypeLoader, VineTypeLoader],
	document: {
		info: {
			title: description,
			version,
		},
	},
}
