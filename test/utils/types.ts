import type { AxiosResponse } from "axios"

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
	data: T
	status: number
}

/**
 * User resource type
 */
export interface UserResponse {
	id: number
	name: string
	email: string
	avatar?: string
	posts?: PostResponse[]
	createdAt?: string
	updatedAt?: string
}

/**
 * Post resource type
 */
export interface PostResponse {
	id: number
	userId: number
	title: string
	content: string
	createdAt?: string
	updatedAt?: string
}

/**
 * Validation error response
 */
export interface ValidationErrorResponse {
	errors: Record<string, string[]> | Array<{ field: string; message: string }>
}

/**
 * Generic error response
 */
export interface ErrorResponse {
	message: string
	errors?: ValidationErrorResponse["errors"]
}

/**
 * Type helper for Axios responses
 */
export type TypedAxiosResponse<T> = AxiosResponse<T>
