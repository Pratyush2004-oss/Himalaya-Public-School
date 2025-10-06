import expressAsyncHandler from 'express-async-handler';
import UserModel from '../models/auth.model.js';
import bcrypt from 'bcryptjs';
import { ENV } from '../config/env.js'
import jwt from 'jsonwebtoken';
import EventModel from '../models/events.model.js';

// generate the token
const generateToken = (id) => {
    return jwt.sign({ id }, ENV.JWT_SECRET);
}

// recursive function to generate UID for students as well as teachers of eight digits
const generateUID = (role) => {
    const IdNumber = Math.floor(Math.random() * 100000000);
    return role === "student" ? `STUD-${IdNumber}` : `TEACH-${IdNumber}`
}

// register controller
export const registerUser = expressAsyncHandler(async (req, res, next) => {
    try {
        const { name, standard, email, password, role } = req.body;
        // check  for all the fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // if the role is student and standard is not defined
        if (role === "student" && !standard) {
            return res.status(400).json({ message: "Standard is required for students" });
        }

        // check for existing user
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        };

        // generate the StudentId of 8 digits
        const UID = generateUID(role);

        // encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // check if the user is set to be verified or not
        const isVerified = ENV.ADMIN_IDS.includes(email);

        // create the user
        await UserModel.create({
            name,
            standard,
            email,
            password: hashedPassword,
            role,
            UID,
            isVerified
        });

        res.status(201).json({ message: isVerified ? "User registered successfully" : "User registered successfully, Verify account by admin" });

    } catch (error) {
        console.log("Error in register user controller: " + error);
        next(error);
    }
});

// login controller
export const loginUser = expressAsyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        // check for validation
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check for user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // check if the user is verified or not
        if (!user.isVerified) {
            return res.status(400).json({ message: "User is not verified" });
        }

        // check for password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const userDetails = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            UID: user.UID,
            standard: user.standard
        }

        // generate the token
        const token = generateToken(user._id);

        res.status(200).json({
            message: "User logged in successfully",
            token,
            user: userDetails
        });
    } catch (error) {
        console.log("Error in login user controller: " + error);
        next(error);
    }

});

// check for user
export const checkAuth = expressAsyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Unauthorized, user not found" });
        }
        res.status(200).json({ user });

    } catch (error) {
        console.log("Error in check-user controller: " + error);
        next(error);
    }
});

// check admin
export const checkAdmin = expressAsyncHandler(async (req, res, next) => {
    try {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ message: "Unauthorized, user not found" });
            }
            res.status(200).json({ isAdmin: true });
        } catch (error) {
            console.log("Error in check-admin controller : " + error);
            next(error);
        }
    } catch (error) {
        console.log("Error in check-admin controller: " + error);
        next(error);
    }

});

// change password
export const changePassword = expressAsyncHandler(async (req, res, next) => {
    try {
        const { password, newPassword } = req.body;
        const user = req.user;

        const userToUpdatePassword = await UserModel.findById(user._id);
        if (!userToUpdatePassword) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, userToUpdatePassword.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        userToUpdatePassword.password = hashedPassword;
        await userToUpdatePassword.save();
        res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.log("Error in change password controller: " + error);
        next(error);
    }
});

// get event list
export const getEventList = expressAsyncHandler(async (req, res, next) => {
    try {
        const events = await EventModel.aggregate({
            $match: {},
            $project: {
                _id: 1,
                title: 1,
                date: 1,
                description: 1,
                image: 1,
                public: 1
            },
            $sort: {
                updatedAt: -1
            }
        });

        res.status(200).json({ events });
    } catch (error) {

    }
});
