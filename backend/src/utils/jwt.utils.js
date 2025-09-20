import jwt from "jsonwebtoken";
import { generateToken } from "./password.utils.js";


export const generateJwtToken = (user) => {
    const accessToken = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, {
        expiresIn: "30m"
    });

    const refreshToken = generateToken();

    return {accessToken, refreshToken};
}

export const tokenExpiresAt = () => {
    return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
}


export const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", 
        maxAge: 30 * 60 * 1000, 
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", 
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })
}

export const clearCookies = (res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
}

