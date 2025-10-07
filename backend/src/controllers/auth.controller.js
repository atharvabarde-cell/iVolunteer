import { authService } from "../services/auth.service.js";
import { createSession } from "../services/session.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { setCookies, clearCookies } from "../utils/jwt.utils.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { otpService } from "../services/otp.service.js";

const register = asyncHandler(async(req, res) => {
    console.log("Registration request received:", req.body);
    const user = await authService.register(req.body);
    console.log("User created with coins:", user.coins);

    // Wrap session creation in try/catch to catch errors
    let tokens;
    try {
        tokens = await createSession(user);
    } catch(err) {
        console.error("Session creation failed:", err);
        throw new ApiError(500, "Error while creating session");
    }

    setCookies(res, tokens.accessToken, tokens.refreshToken);

    // Return user info including coins
    const userResponse = {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        coins: user.coins
    };

    console.log("Registration response:", userResponse);

    return res.status(201).json({
        user: userResponse, 
        tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        },
        message: "User registered successfully! You've been awarded 50 coins as a welcome bonus!"
    });
});

const login = asyncHandler(async (req, res) => {
  // Step 1: Verify user credentials
  const user = await authService.login(req.body);

  // Step 2: Send OTP email
  await otpService.sendOtp(user.email);

  // Step 3: Return success message without tokens
  return res.status(200).json({
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
    },
    message: "OTP sent to your email. Please verify to complete login.",
  });
});


const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  await authService.logout(refreshToken);
  clearCookies(res);

  return res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
});

const getUser = asyncHandler(async (req, res) => {
  const id = req.user?._id;
  const user = await authService.getUser(id);

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User account fetched successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const id = req.user?._id;

  const result = await authService.changePassword(id, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, { result }, "Password changed successfully"));
});

const forgetPasswordRequest = asyncHandler(async (req, res) => {
  const user = await authService.forgetPasswordRequest(req.body);
  const resetLink = `${process.env.CLIENT_URL}/forget-password/${user.token}`;

  await sendPasswordResetEmail(user.email, resetLink);

  logger.info("Password reset link generated from this Id: ", {
    userId: user.userId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset email send successfully"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token;

  const user = await authService.resetPassword(token, req.body);
  await sendPasswResetSuccessEmail(user.email);

  logger.info("Password reset successful from this Id: ", {
    userId: user.userId,
  });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfull"));
});

export const authController = {
  register,
  login,
  logout,
  getUser,
  changePassword,
  forgetPasswordRequest,
  resetPassword,
};
