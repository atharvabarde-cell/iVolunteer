import { validationResult } from 'express-validator';
import { ApiError } from '../utils/ApiError.js';

export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Get the first error message
        const firstError = errors.array()[0];
        throw new ApiError(400, firstError.msg);
    }
    next();
};