import mongoose from "mongoose";

const FeeSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    month:{
        type: String,
        required: true
    },
    transactionDetail: {
        order_id: {
            type: String,
        },
        payment_id: {
            type: String,
        },
    },
    mode: {
        type: String,
        enum: ['online', 'offline'],
    },
    paid: {
        type: Boolean,
        default: false
    },
    paidAt: {
        type: Date
    }
}, { timestamps: true });

const FeeModel = mongoose.model("fee", FeeSchema);

export default FeeModel;