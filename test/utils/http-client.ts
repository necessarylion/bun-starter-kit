import axios from "axios"
import { TEST_CONFIG } from "./config"

/**
 * HTTP client for making test requests
 * Configured to not throw on non-2xx status codes
 */
export const http = axios.create({
	baseURL: TEST_CONFIG.BASE_URL,
	timeout: TEST_CONFIG.REQUEST_TIMEOUT,
	validateStatus: () => true, // Don't throw on any status code
	headers: {
		Accept: "application/json",
	},
})
