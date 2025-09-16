import express, {Router} from "express";
import { authController } from "../controllers/auth.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";

const router = Router()

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authentication, authController.logout);

export default router;