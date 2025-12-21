import type { Context } from "hono"
import { Service } from "typedi"
import UserService from "./user.service"
import { userCreateValidator } from "./user.validator"

@Service()
export default class UserController {
	constructor(private readonly userService: UserService) {}

	async getUsers(_c: Context) {
		return await this.userService.getUsers()
	}

	async createUser({ req }: Context) {
		const payload = await req.validate(userCreateValidator)
		return await this.userService.createUser(payload)
	}
}
