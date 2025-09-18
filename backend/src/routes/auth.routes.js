import express, {Router} from "express";
import { authController } from "../controllers/auth.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";
import {refreshAccessTokenController} from "../controllers/session.controller.js"

const router = Router()

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authentication, authController.logout);

router.post("/change-password", authentication, authController.changePassword);

router.post("/forget-password",authController.forgetPasswordRequest);

router.post("/reset-password/:token",authController.resetPassword)

router.get("/user", authentication, authController.getUser);

router.post("/refresh-access-token", authentication, refreshAccessTokenController);

export default router;