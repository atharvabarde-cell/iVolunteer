import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export const connectDB = async () => {
    let maxRetries = 5;
    let retryDelay = 5000; // 5 seconds delay for restart server automatically

    for(let attempt = 1; attempt <= maxRetries; attempt++){
        try {
            const connect = await mongoose.connect(process.env.MONGODB_URI);

            logger.info(`🌐 MongoDB connected to ${connect.connection.host}`)

            return;
        } catch (error) {
            logger.error(`MongoDB connection attemp ${attempt} failed!`, {
                error: error.message,
                attempt: attempt,
                maxRetries: maxRetries,
                stack: error.stack,
            });

            if(attempt === maxRetries){
                logger.error("All MongoDB connection attempts failed, Exiting...");
                throw error;
            }

            logger.info(`Retrying in ${retryDelay}ms...(${attempt}/${maxRetries})`);

            await sleep(retryDelay);
        }
    }
}

function sleep(ms){
    return new Promise((resolve) => setTimeout(resolve, ms));
}
