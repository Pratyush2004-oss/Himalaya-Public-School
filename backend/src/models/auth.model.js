import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        required: true
    },
    standard: {
        type: String
    },
    bus: {
        useBus: {
            type: Boolean,
            default: false
        },
        pickUp: {
            type: String
        }
    },
    UID: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    aadharNumber: {
        type: String,
        required: true,
        unique: true
    },
    parents: {
        name: {
            type: String,
        },
        phone: {
            type: String,
        }
    }
}, {
    timestamps: true
});

export const UserModel = mongoose.model('User', userSchema);
export default UserModel;