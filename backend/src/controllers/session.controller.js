import { refreshAccessToken } from "../services/session.service.js";

import { setCookies } from "../utils/jwt.utils.js";

import { asyncHandler } from "../utils/asyncHandler.js";


export const refreshAccessTokenController = asyncHandler(async(req, res) => {
    const token = req.cookies.refreshToken
    const {accessToken, refreshToken} = await refreshAccessToken(token)

    setCookies(res, accessToken, refreshToken)

    return res.status(200).json({message: "Token refreshed successfully"});
})