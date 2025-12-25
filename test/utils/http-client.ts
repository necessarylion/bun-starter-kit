// Import from server.ts directly to avoid picking up compiled binary
import app from "@/server"

interface RequestOptions {
	method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
	headers?: Record<string, string>
	body?: unknown
	formData?: FormData
}

export class HttpClient {
	private baseUrl: string

	constructor(baseUrl = "http://localhost:3000") {
		this.baseUrl = baseUrl
	}

	async request(path: string, options: RequestOptions = {}) {
		const { method = "GET", headers = {}, body, formData } = options

		const url = `${this.baseUrl}${path}`

		let requestBody: BodyInit | undefined
		const requestHeaders = { ...headers }

		if (formData) {
			requestBody = formData
			// Don't set Content-Type for FormData, let the browser set it with boundary
		} else if (body) {
			requestBody = JSON.stringify(body)
			requestHeaders["Content-Type"] = "application/json"
		}

		const request = new Request(url, {
			method,
			headers: requestHeaders,
			body: requestBody,
		})

		return await app.fetch(request)
	}

	async get(path: string, headers?: Record<string, string>) {
		return this.request(path, { method: "GET", headers })
	}

	async post(path: string, body?: unknown, headers?: Record<string, string>) {
		return this.request(path, { method: "POST", body, headers })
	}

	async postForm(
		path: string,
		formData: FormData,
		headers?: Record<string, string>,
	) {
		return this.request(path, { method: "POST", formData, headers })
	}

	async put(path: string, body?: unknown, headers?: Record<string, string>) {
		return this.request(path, { method: "PUT", body, headers })
	}

	async patch(path: string, body?: unknown, headers?: Record<string, string>) {
		return this.request(path, { method: "PATCH", body, headers })
	}

	async delete(path: string, headers?: Record<string, string>) {
		return this.request(path, { method: "DELETE", headers })
	}
}

export const http = new HttpClient()
