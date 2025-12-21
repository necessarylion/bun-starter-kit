import { Hono } from "hono"
import UserController from "@/app/modules/user/user.controller"
import { Controller } from "@/utils"

const route = new Hono().basePath("/api")

route.get("/users", Controller(UserController, "getUsers"))
route.post("/users", Controller(UserController, "createUser"))

export default route
