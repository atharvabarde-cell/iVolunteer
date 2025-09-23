import jwt from "jsonwebtoken"
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

const authentication = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const tokenFromHeader = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

        const jwtToken = req.cookies.jwtToken || tokenFromHeader;
        
        if (!jwtToken) {
            throw new ApiError(401, "Authentication token required");
        }

        // DEBUG: Log the token to see what we're working with
        logger.debug("JWT Token received", { token: jwtToken });
        
        const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
        
        // DEBUG: Log the entire decoded payload
        logger.debug("Decoded JWT payload", { 
            payload: decoded, 
            keys: Object.keys(decoded) 
        });
        
        // Try different possible field names for user ID
        const userId = decoded.userId || decoded._id || decoded.sub || decoded.id;
        
        if(!userId){
            logger.error("❌ Token payload missing user identifier", {
                payload: decoded,
                availableKeys: Object.keys(decoded)
            });
            
            // Return a more specific error response
            return res.status(401).json({
                success: false,
                message: "Invalid token payload",
                errorMessage: "Missing user identifier in token",
                debug: {
                    availableKeys: Object.keys(decoded),
                    payload: decoded
                }
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            logger.error("❌ User not found in database", { userId });
            throw new ApiError(401, "Invalid token - user not found");
        }

        req.user = user;
        next();
    } catch (error) {
        logger.error("❌ Authentication middleware error", {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        // Handle specific JWT errors
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
                errorMessage: error.message
            });
        } else if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: "Token expired",
                errorMessage: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            errorMessage: error.message
        });
    }
}

export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "Forbidden: Access denied");
        }
        next();
    };
}

// Export both the original name and the middleware alias
export const authMiddleware = authentication;
export { authentication };