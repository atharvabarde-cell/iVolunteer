import { authService } from "../services/auth.service.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { generateJwtToken, setCookies, clearCookies } from "../utils/jwt.utils.js"

const register = asyncHandler(async(req, res) => {
    const user = await authService.register(req.body)

    const jwtToken = generateJwtToken(user)
    setCookies(res, jwtToken)

    return res.status(201).json({user, message: "User register sucessfully"});
})

const login = asyncHandler(async(req, res) => {
    const user = await authService.login(req.body)

    const jwtToken = generateJwtToken(user)
    setCookies(res, jwtToken)

    return res.status(200).json({user, message: "Logged in sucessful"});
})

const logout = asyncHandler(async(req, res) => {
    if(!req.cookies.jwtToken){
        return res.status(400).json({ message: "No user logged in" });
    }
    
    clearCookies(res)

    return res.status(200).json({message: "Logged out successfully"});
})

export const authController = {
    register,
    login,
    logout
}