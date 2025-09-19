import Joi from "joi";

const applicationSchema = Joi.object({
    eventId: Joi.string().required().messages({
        "any.required": "Event ID is required",
        "string.empty": "Event ID cannot be empty"
    }),

    phone: Joi.string().pattern(/^\+?[\d\s-]{10,}$/).required().messages({
        "any.required": "Phone number is required",
        "string.pattern.base": "Please provide a valid phone number",
        "string.empty": "Phone number cannot be empty"
    }),

    message: Joi.string().max(500).optional().messages({
        "string.max": "Message cannot exceed 500 characters"
    })
});

export const eventApplicationValidator = {
    applicationSchema
};