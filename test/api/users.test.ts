import { describe, expect, test } from "bun:test"
import {
	expectProperties,
	expectSuccess,
	expectValidationError,
} from "../utils/assertions"
import {
	createFormData,
	createImageFile,
	createInvalidFile,
	createUserData,
} from "../utils/factories"
import { http } from "../utils/http-client"
import type { UserResponse } from "../utils/types"
import "../utils/setup"

describe("User API", () => {
	describe("GET /api/users", () => {
		test("should return list of users", async () => {
			const response = await http.get<UserResponse[]>("/api/users")

			expectSuccess(response)
			expect(Array.isArray(response.data)).toBe(true)
		})

		test("should return users with posts preloaded", async () => {
			const response = await http.get<UserResponse[]>("/api/users")

			if (response.data.length > 0) {
				expectProperties(response.data[0], ["posts"])
			}
		})
	})

	describe("POST /api/users", () => {
		describe("success cases", () => {
			test("should create a new user with valid data", async () => {
				const userData = createUserData()
				const avatar = createImageFile()

				const formData = createFormData({
					...userData,
					avatar,
				})

				const response = await http.post<UserResponse>("/api/users", formData)

				expectSuccess(response)
				expectProperties(response.data, ["id", "name", "email", "avatar"])
				expect(response.data.name).toBe(userData.name)
				expect(response.data.email).toBe(userData.email)
			})
		})

		describe("validation", () => {
			test("should return 422 when name is missing", async () => {
				const userData = createUserData({ name: undefined })
				const avatar = createImageFile()

				const formData = createFormData({
					...userData,
					avatar,
				})

				const response = await http.post("/api/users", formData)

				expectValidationError(response)
			})

			test("should return 422 when email is invalid", async () => {
				const userData = createUserData({ email: "invalid-email" })
				const avatar = createImageFile()

				const formData = createFormData({
					...userData,
					avatar,
				})

				const response = await http.post("/api/users", formData)

				expectValidationError(response)
			})

			test("should return 422 when password is too short", async () => {
				const userData = createUserData({
					password: "short",
					password_confirmation: "short",
				})
				const avatar = createImageFile()

				const formData = createFormData({
					...userData,
					avatar,
				})

				const response = await http.post("/api/users", formData)

				expectValidationError(response)
			})

			test("should return 422 when password confirmation does not match", async () => {
				const userData = createUserData({
					password: "password123",
					password_confirmation: "different-password",
				})
				const avatar = createImageFile()

				const formData = createFormData({
					...userData,
					avatar,
				})

				const response = await http.post("/api/users", formData)

				expectValidationError(response)
			})

			test("should return 422 when avatar is missing", async () => {
				const userData = createUserData()

				const formData = createFormData(userData)

				const response = await http.post("/api/users", formData)

				expectValidationError(response)
			})

			test("should return 422 when avatar has invalid mime type", async () => {
				const userData = createUserData()
				const invalidFile = createInvalidFile()

				const formData = createFormData({
					...userData,
					avatar: invalidFile,
				})

				const response = await http.post("/api/users", formData)

				expectValidationError(response)
			})
		})
	})
})
