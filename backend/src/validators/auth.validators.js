import Joi from "joi";

const registerSchema = Joi.object({
    email: Joi.string().email({tlds: {allow: false}}).trim().lowercase().required().messages({
        "any.required": "Email is required",
        "string.email": "Email must be a valid email address",
        "string.base": "Email must be a string",
        "string.empty": "Email cannot be empty"
    }),

    name: Joi.string().trim().min(2).max(20).required().messages({
        "any.required": "Name is required",
        "string.base": "Name must be a string",
        "string.empty": "Name cannot be empty",
        "string.min": "Name must be at least 2 characters long",
        "string.max": "Name must be at most 20 characters long",
    }),

    password: Joi.string().min(8).max(16).pattern(new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$")).required().messages({
        "any.required": "Password is required",
        "string.min": "Password must be at lease 8 characters long",
        "string.max": "Password cannot exceed 20 characters",
        "string.pattern.base": "Password must contain at least one latter and one number",
        "stringe.empty": "Password cannot be empty",
    })

});

const loginSchema = Joi.object({
    email: Joi.string().email().trim().lowercase().required().messages({
        "string.email": "Email must be valid",
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty"
    }),

    password: Joi.string().min(8).max(16).required().messages({
        "any.required": "Password is required",
        "string.empty": "Password cannot be empty",
    })
});

export const authValidator = {
    registerSchema,
    loginSchema
}
