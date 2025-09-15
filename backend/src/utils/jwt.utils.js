const jwt = require("jsonwebtoken")

export const generateJwtToken = (user) => {
    const jwtToken = jwt.sign({userId: user._id, role: user.role}, process.env.JWT_TOKEN, {
        expiresIn: "7d"
    });
    return jwtToken;
}

export const setCookies = (res, jwtToken) => {
    res.cookie("jwtToken", jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", 
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
}

export const clearCookies = (res) => {
    res.clearCookie("jwtToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
}

