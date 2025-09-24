import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js";

export const validate = (schema) => {
    return (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.body, {
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true
            });

            if (error) {
                const errorMessages = error.details.map(detail => detail.message);
                logger.warn("Validation failed", {
                    path: req.path,
                    method: req.method,
                    errors: errorMessages,
                    body: req.body
                });

                throw new ApiError(400, `Validation error: ${errorMessages.join(', ')}`);
            }

            // Replace request body with validated and sanitized data
            req.body = value;
            next();
        } catch (error) {
            logger.error("Validation middleware error", {
                error: error.message,
                stack: error.stack,
                path: req.path,
                method: req.method
            });

            const statusCode = error instanceof ApiError ? error.statusCode : 500;
            const message = error instanceof ApiError ? error.message : "Validation failed";
            
            return res.status(statusCode).json({
                success: false,
                message
            });
        }
    };
};