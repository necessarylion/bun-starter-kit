import vine from "@vinejs/vine"

export const userCreateValidator = vine.create(
	vine.object({
		name: vine.string().example("John Doe"),
		email: vine.string().email().example("john.doe@example.com"),
		password: vine
			.string()
			.example("password123")
			.minLength(8)
			.maxLength(32)
			.confirmed(),
		password_confirmation: vine
			.string()
			.example("password123")
			.minLength(8)
			.maxLength(32)
			.optional(),
		avatar: vine.nativeFile().mimeTypes(["image/jpeg", "image/png"]),
	}),
)
