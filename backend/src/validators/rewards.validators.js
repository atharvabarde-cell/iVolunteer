import Joi from "joi";

const pointsSchema = Joi.object({
    points: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": "Points must be a number",
            "number.min": "Points cannot be negative",
            "any.required": "Points amount is required"
        })
});

const coinsSchema = Joi.object({
    coins: Joi.number()
        .min(0)
        .required()
        .messages({
            "number.base": "Coins must be a number",
            "number.min": "Coins cannot be negative",
            "any.required": "Coins amount is required"
        })
});

const spendCoinsSchema = Joi.object({
    amount: Joi.number()
        .min(1)
        .required()
        .messages({
            "number.base": "Amount must be a number",
            "number.min": "Must spend at least 1 coin",
            "any.required": "Amount is required"
        }),
    itemName: Joi.string()
        .required()
        .messages({
            "string.base": "Item name must be a string",
            "any.required": "Item name is required"
        }),
    itemId: Joi.string()
        .optional()
        .messages({
            "string.base": "Item ID must be a string"
        })
});

const dailyRewardSchema = Joi.object({
    type: Joi.string()
        .valid("daily_quote", "login_bonus", "activity_completion")
        .default("daily_quote")
        .messages({
            "string.base": "Type must be a string",
            "any.only": "Type must be one of: daily_quote, login_bonus, activity_completion"
        })
});

export const rewardsValidator = {
    pointsSchema,
    coinsSchema,
    spendCoinsSchema,
    dailyRewardSchema
};