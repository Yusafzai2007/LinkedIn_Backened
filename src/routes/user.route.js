import { Router } from "express";
import { createaccount, edit_user, get_user, logout_user, user_login } from "../controllers/user.controller.js";
import { loginlimt } from "../middlewares/rateLimiter.js";
import { jwtverify } from "../middlewares/auth.middleware.js";

const route=Router()


route.post("/signup",createaccount)
route.post("/login",loginlimt,user_login)
route.get("/get_user",get_user)
route.put("/edit_user/:id",edit_user)
route.post("/logout_user",jwtverify,logout_user)
export default route