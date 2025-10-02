import razorpay from 'razorpay';
import dotenv from 'dotenv';
import { ENV } from './env.js';
dotenv.config();

export const createRazorpayInstance = () => {
    return new razorpay({
        key_id: ENV.RAZORPAY_KEY_ID,
        key_secret: ENV.RAZORPAY_KEY_SECRET
    });
};