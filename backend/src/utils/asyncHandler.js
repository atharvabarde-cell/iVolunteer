// utility to wrap async route handlers and forward errors to Express

export const asyncHandler = (requestHandler) => {
    return async(req, res, next) => {
        Promise.resolve(requestHandler(req, res, next))
            .catch((error) => next(error))
    }
}