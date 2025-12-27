import type { Context } from "hono"
import {
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from "openapi-metadata/decorators"
import { Service } from "typedi"
import User from "./user.model"
import UserService from "./user.service"
import { userCreateValidator } from "./user.validator"

@Service()
@ApiTags("Users")
export default class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({
		methods: ["get"],
		path: "/api/users",
		summary: "Get User List",
	})
	@ApiResponse({ type: [User] })
	async getUsers(_c: Context) {
		return await this.userService.getUsers()
	}

	@ApiOperation({
		methods: ["post"],
		path: "/api/users",
		summary: "Create a new user",
	})
	@ApiBody({
		type: () => userCreateValidator,
		mediaType: "multipart/form-data",
	})
	@ApiResponse({ type: User, status: 201 })
	async createUser({ req }: Context) {
		const payload = await req.validate(userCreateValidator)
		return await this.userService.createUser(payload)
	}
}
