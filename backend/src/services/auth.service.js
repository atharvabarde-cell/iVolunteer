import { User } from "../models/User.js"
import { ApiError } from '../utils/ApiError.js';
import {hashPassword, comparePassword} from "../utils/password.utils.js"

const register = async(data) => {
    const email = data.email.toLowerCase().trim();
    const userExist = await User.findOne({email})

    if(userExist) {
        throw new ApiError(400, "An account with this email already exists");
    }

    const hashedPassword = await hashPassword(data.password)

    const user = new User({
        email,
        name: data.name,
        password: hashedPassword,
    });

    await user.save();

    return {userId: user._id, email: user.email, name: user.name}
}


const login = async (data) => {
    const email = data.email.toLowerCase().trim();
    
    const user = await User.findOne({email})
    if(!user){
        throw new ApiError(404, "User does not exist");
    }

    const isValidPass = await comparePassword(data.password, user.password)

    if(!isValidPass){
        throw new ApiError(401, "Invalid password");
    }

    return {userId: user._id, email: user.email, name: user.name}
}

export const authService = {
    register,
    login
}