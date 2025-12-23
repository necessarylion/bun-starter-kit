import { Infer } from "@vinejs/vine/types"
import { randomUUIDv7 } from "bun"
import { Service } from "typedi"
import { disk } from "@/utils/disk"
import User from "./user.model"
import { userCreateValidator } from "./user.validator"

@Service()
export default class UserService {
	async createUser(payload: Infer<typeof userCreateValidator>) {
		const avatarBuffer = await payload.avatar.arrayBuffer()
		const content = new Uint8Array(avatarBuffer)
		const fileName = `avatars/${randomUUIDv7()}.png`
		await disk.put(fileName, content)
		const data = await User.create({
			name: payload.name,
			email: payload.email,
			password: payload.password,
			avatar: fileName,
		})
		return data
	}

	async getUsers() {
		return await User.query().preload("posts")
	}
}
