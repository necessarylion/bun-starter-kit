import {
	JSONSchemaTypeLoader,
	StandardJSONSchemaTypeLoader,
} from "@martin.xyz/openapi-decorators/loaders"
import WebController from "@/app/controllers/web_controller"
import UserController from "@/app/modules/user/user.controller"
import { description, version } from "@/package.json"
import { LuxonTypeLoader } from "@/utils/openapi/loaders/luxon"

export default {
	controllers: [WebController, UserController],
	loaders: [
		LuxonTypeLoader,
		StandardJSONSchemaTypeLoader,
		JSONSchemaTypeLoader,
	],
	document: {
		info: {
			title: description,
			version,
		},
	},
}
