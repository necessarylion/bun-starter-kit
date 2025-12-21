import { Hono } from "hono"
import UserController from "@/app/modules/user/user.controller"
import { C } from "@/utils"

const route = new Hono().basePath("/api")

route.get("/users", C(UserController, "getUsers"))
route.post("/users", C(UserController, "createUser"))

export default route
