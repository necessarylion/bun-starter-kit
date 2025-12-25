import { describe, expect, test } from "bun:test"
import { http } from "../utils/http-client"
import "../utils/setup"

describe("Web Routes", () => {
	describe("GET /", () => {
		test("should return home page", async () => {
			const response = await http.get("/")

			expect(response.status).toBe(200)
			expect(response.data).toBeTruthy()
		})
	})
})
