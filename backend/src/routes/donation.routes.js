import express from "express";
import { donateToEvent } from "../controllers/donation.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const donationRouter = express.Router();

donationRouter.post("/donate", authMiddleware, donateToEvent);

export default donationRouter;
