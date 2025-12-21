import vine from "@vinejs/vine"

export const userCreateValidator = vine.create(
	vine.object({
		name: vine.string(),
		email: vine.string().email(),
		password: vine.string().minLength(8).maxLength(32).confirmed(),
		avatar: vine.nativeFile().mimeTypes(["image/jpeg", "image/png"]),
	}),
)
