import { Hono } from "hono"
import WebController from "@/app/controllers/web_controller"
import { Controller } from "@/utils"

const route = new Hono()

route.get("/", Controller(WebController, "home"))

export default route
