import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { errorHandler, notFoundHandler } from "./middlewares/globalErrorHandler.js"
import authRouter from "./routes/auth.routes.js"
import postRouter from "./routes/post.routes.js"
// import communityRouter from "./routes/community.routes.js"
import communityRouter from "./routes/community.routes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

function limiter(windowMs, max) {
  return rateLimit({
    windowMs,
    max,
    message: "Too many requests, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
  });
}

// global limiter, applies to all routes
const globalRateLimiting = limiter(15 * 60 * 1000, 1000); // 15 minutes, 1000 requests
app.use(globalRateLimiting);

const authLimiter = limiter(15 * 60 * 1000, 100);

app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/posts", globalRateLimiting, postRouter);
// app.use("/api/v1/communities", globalRateLimiting, communityRouter);

app.use(errorHandler);
app.use(notFoundHandler);

export { app };
