import bcrypt from "bcrypt";
import crypto from "crypto";

export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}

// Function for generate cryto tokens for refreshToken or link
export const generateToken = () => {
    return crypto.randomBytes(32).toString("hex")
}

export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex")
}


