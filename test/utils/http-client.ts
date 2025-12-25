import axios from "axios"

// Simple axios instance - the server will be started in setup.ts
export const http = axios.create({
	baseURL: "http://localhost:3001",
	validateStatus: () => true, // Don't throw on any status code
})
