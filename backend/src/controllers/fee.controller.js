import expressAsyncHandler from "express-async-handler";
import FeeModel from "../models/fee.model";
import { createRazorpayInstance } from "../config/razorpay.config";
import { ENV } from "../config/env";

// oder fee via razorpay
export const feeOrder = expressAsyncHandler(async (req, res, next) => {
    try {
        const { feeId } = req.body;
        const feeInfo = await FeeModel.findById(feeId);
        if (!feeInfo) {
            return res.status(404).json({ message: "Fee not found" });
        }
        const options = {
            amount: feeInfo.amount * 100,   // amount in smallest currency unit
            currency: "INR",
            receipt: "receipt_order_1",
        };
        try {
            const razorpayInstance = createRazorpayInstance();

            razorpayInstance.orders.create(options, function (err, order) {
                if (err) {
                    next(err);
                }
                return res.status(200).json({ message: "success", order });
            })
        } catch (error) {
            console.log("Error in feeOrder controller: " + error);
            next(error);
        }
    } catch (error) {
        console.log("Error in feeOrder controller: " + error);
        next(error);
    }


});

// pay Fee 
export const payFee = expressAsyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        const { order_id, payment_id, signature, feeId } = req.body;
        const razorpaySecret = ENV.RAZORPAY_KEY_SECRET;

        // create an object
        const hmac = crypto.createHmac('sha256', razorpaySecret);
        hmac.update(order_id + "|" + payment_id);
        const digest = hmac.digest('hex');

        if (digest !== signature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        try {
            await FeeModel.findByIdAndUpdate(feeId, {
                transactionDetail: {
                    order_id,
                    payment_id
                },
                paid: true,
                mode: "online",
                paidAt: new Date()
            }, { new: true });
            return res.status(200).json({ message: "Fee paid successfully" });
        }
        catch (error) {
            console.log("Error in verification of Payment: " + error);
            next(error);
        }
    } catch (error) {
        console.log("Error in payFee controller: " + error);
        next(error);
    }

});

// get all the batches
export const getAllFeeOftheCurrentUser = expressAsyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        const FeesList = await FeeModel.aggregate([
            {
                $match: {
                    student: user._id,
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "student",
                    foreignField: "_id",
                    as: "studentDetails"
                }
            }, {
                $unwind: "$studentDetails"
            },
            {
                $project: {
                    _id: 1,
                    amount: 1,
                    student: { name: "$studentDetails.name" },
                    paid: 1,
                    mode: 1,
                    createdAt: 1
                }
            }
        ]);
        return res.status(200).json({ FeesList });
    } catch (error) {
        console.log("Error in getAllFeeOftheCurrentUser controller: " + error);
        next(error);
    }
});