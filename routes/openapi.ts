import { Hono } from "hono"
import { generateDocument } from "openapi-metadata"
import openapiConfig from "@/config/openapi"

const route = new Hono()
const document = await generateDocument(openapiConfig)
route.get("/openapi.json", async (c) => {
	return c.json(document)
})

export default route
