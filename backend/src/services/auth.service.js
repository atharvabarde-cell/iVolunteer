import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { Session } from "../models/Session.js";
import { RegistrationReward } from "../models/RegistrationReward.js";
import {
  hashPassword,
  comparePassword,
  hashToken,
} from "../utils/password.utils.js";
import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

const register = async (data) => {
  const email = data.email.toLowerCase().trim();
  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new ApiError(400, "An account with this email already exists");
  }

  const hashedPassword = await hashPassword(data.password);

  // Create the user with initial 50 coins and additional fields for NGOs/Corporates
  const userData = {
    email,
    name: data.name,
    password: hashedPassword,
    role: data.role,
    coins: 50, // Give 50 coins for registration
  };

  // Add NGO-specific fields if role is 'ngo'
  if (data.role === "ngo") {
    userData.organizationType = data.organizationType;
    userData.websiteUrl = data.websiteUrl;
    userData.yearEstablished = data.yearEstablished;
    userData.contactNumber = data.contactNumber;
    userData.address = {
      street: data.address?.street,
      city: data.address?.city,
      state: data.address?.state,
      zip: data.address?.zip,
      country: data.address?.country || "India",
    };
    userData.ngoDescription = data.ngoDescription;
    userData.focusAreas = data.focusAreas || [];
    userData.organizationSize = data.organizationSize;
  }

  // Add Corporate-specific fields if role is 'corporate'
  if (data.role === "corporate") {
    userData.companyType = data.companyType;
    userData.industrySector = data.industrySector;
    userData.companySize = data.companySize;
    userData.websiteUrl = data.websiteUrl;
    userData.yearEstablished = data.yearEstablished;
    userData.contactNumber = data.contactNumber;
    userData.address = {
      street: data.address?.street,
      city: data.address?.city,
      state: data.address?.state,
      zip: data.address?.zip,
      country: data.address?.country || "India",
    };
    userData.companyDescription = data.companyDescription;
    userData.csrFocusAreas = data.csrFocusAreas || [];
  }

  // Save user
  const user = await User.create(userData);

  // Save registration reward separately
  await RegistrationReward.create({
    userId: user._id,
    coins: 50,
    type: "registration_bonus",
  });

  logger.info("New user registered with welcome bonus", {
    userId: user._id,
    email: user.email,
    coins: 50,
  });

  return user;
};


const login = async (data) => {
  const email = data.email.toLowerCase().trim();

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isValidPass = await comparePassword(data.password, user.password);

  if (!isValidPass) {
    throw new ApiError(401, "Invalid password");
  }

  return {
    userId: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    coins: user.coins,
  };
};

const logout = async (refreshToken) => {
  const hashedToken = hashToken(refreshToken);
  const session = await Session.findOneAndDelete({ refreshToken: hashedToken });

  if (!session) throw new ApiError(403, "Unauthorized request");

  return { message: "Session invalidated successfully" };
};

const getUser = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw new ApiError(404, "User not found");

  return user;
};

const changePassword = async (id, data) => {
  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await comparePassword(
    data.oldPassword,
    user.password
  );
  if (!isPasswordValid) throw new ApiError(401, "Password is incorrect");

  if (data.newPassword !== data.confirmPassword) {
    throw new ApiError(401, "Password does not match with confirm password");
  }

  const newPassword = await hashPassword(data.newPassword);

  user.password = newPassword;

  await user.save();

  return { message: "Password changed successfully" };
};

const forgetPasswordRequest = async (data) => {
  const email = data.email.toLowerCase().trim();
  const user = await User.findOne({ email });

  if (!user) throw new ApiError(404, "User with this email does not exist");

  const rawToken = generateToken();
  const resetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  const hashedToken = hashToken(rawToken);

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpiresAt = resetTokenExpiresAt;

  await user.save();

  return { email: user.email, token: rawToken, userId: user._id };
};

const resetPassword = async (token, password) => {
  const hashedToken = hashToken(token);
  const user = await User.findOne({ resetPasswordToken: hashedToken });

  if (!user || user.resetPasswordExpiresAt.getTime() < Date.now()) {
    throw new ApiError(403, "Invalid or Expired reset token");
  }

  const newPassword = await hashPassword(password);
  user.password = newPassword;

  await user.save();

  return { email: user.email, userId: user._id };
};

export const authService = {
  register,
  login,
  logout,
  getUser,
  changePassword,
  forgetPasswordRequest,
  resetPassword,
};
