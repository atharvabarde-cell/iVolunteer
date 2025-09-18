import { logger } from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {
    if(res.headersSent){
        return next(err);
    }

    logger.error(err.message, {stack: err.stack});

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error ⚠️"
    })
}

// Catches 404 routes
export const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        errors: [],
        data: null,
    })
}