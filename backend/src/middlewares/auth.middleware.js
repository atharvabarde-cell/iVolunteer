import jwt from "jsonwebtoken"
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export const authentication = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const tokenFromHeader = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

        const jwtToken = req.cookies.jwtToken || tokenFromHeader

        if (!jwtToken) {
            throw new ApiError(401, "Authentication token is required");
        }
        
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        if(!decoded) throw new ApiError(400, "Invalid request");

        const userId = decoded.userId || decoded._id || decoded.sub 

        if(!userId){
            logger.error("❌ Token payload missing user identifier", {
                payload: decoded,
                availableKeys: Object.keys(decoded)
            })
            throw new ApiError(401, "Invalid token payload - missing user identifier");
        }

        const user = await User.findById(userId)
        if (!user) {
            logger.error("❌ User not found in database", { userId });
            throw new ApiError(401, "Invalid token - user not found");
        }

        req.user = user;
        next()
    } catch (error) {
        logger.error("❌ Authentication middleware error", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        const statusCode = error instanceof ApiError ? error.statusCode : 500;
        const message = error instanceof ApiError ? error.message : "Internal server error";
        
        return res.status(statusCode).json({
            success: false,
            message: message
        });
    }
}

export const authorizeRole = async(...role) => {
    return (req, res, next) => {
        if(!role.includes(req.user.role) || role !== "admin"){
            throw new ApiError(403, "Forbidden: Access denied");
        }
        next()
    }
}

// Export the middleware with both names for compatibility
export const authMiddleware = authentication;