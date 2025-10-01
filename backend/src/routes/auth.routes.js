import express, {Router} from "express";
import { authController } from "../controllers/auth.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";
import { refreshAccessTokenController } from "../controllers/session.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authValidator } from "../validators/auth.validators.js";

const router = Router()

router.post("/register", validate(authValidator.registerSchema), authController.register);

router.post("/login", validate(authValidator.loginSchema), authController.login);

router.post("/logout", authentication, authController.logout);

router.post("/change-password", authentication, authController.changePassword);

router.post("/forget-password",authController.forgetPasswordRequest);

router.post("/reset-password/:token",authController.resetPassword)

router.get("/user", authentication, authController.getUser);

router.post("/refresh-access-token", authentication, refreshAccessTokenController);

export default router;