import expressAsyncHandler from "express-async-handler";
import BatchModel from "../models/batch.model.js";
import UserModel from "../models/auth.model.js";
import mongoose from "mongoose";
import FeeModel from "../models/fee.model.js";
import AssignmentModel from "../models/assignment.model.js";

// Controllers that admin can access

// authentication 

// verify users
export const verifyUsers = expressAsyncHandler(async (req, res, next) => {
    try {
        const { userId } = req.body;

        // check if the userId valid or not
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.isVerified = true;
        await user.save();
        res.status(200).json({ message: "User verified successfully" });
    } catch (error) {
        console.log("Error in verifyIds controller: " + error);
        next(error);
    }
});

// get all the users
export const getAllUsers = expressAsyncHandler(async (req, res, next) => {
    try {
        const students = await UserModel.aggregate([
            {
                $match: {},
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    UID: 1,
                    standard: 1,
                    isVerified: 1,
                },
            },
            {
                $sort: { isVerified: 1 }
            }
        ]);
        const totalUserCount = await UserModel.countDocuments();
        const teacherCount = await UserModel.countDocuments({ role: "teacher" });
        const studentCount = await UserModel.countDocuments({ role: "student" });
        const verifiedCount = await UserModel.countDocuments({ isVerified: true });

        return res.status(200).json({ students, count: { totalUserCount, teacherCount, studentCount, verifiedCount } });

    } catch (error) {
        console.log("Error in getAllStudentList controller: " + error);
        next(error);
    }
});

// get student Information by Id
export const getStudentInfoByUserId = expressAsyncHandler(async (req, res, next) => {
    try {
        const { userId } = req.body;
        const user = await UserModel.findById(userId)
            .select("-password -updatedAt -__v");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // toDO:  get the user fee details and all
        const feeDetails = await FeeModel.aggregate([
            {
                $match: { student: user._id },
            },
            {
                $project: {
                    _id: 1,
                    amount: 1,
                    paid: 1,
                    transactionDetail: 1,
                    mode: 1,
                    paidAt: 1,
                    month: 1
                }
            }
        ])

        return res.status(200).json({ user, feeDetails });

    } catch (error) {
        console.log("Error in getStudentInfoByUserId controller: " + error);
        next(error);
    }
});

// get student Info By Searchig the User with the UID
export const getStudentInfoByUID = expressAsyncHandler(async (req, res, next) => {
    try {
        const { UIDNumber } = req.body;
        if (!UIDNumber) {
            return res.status(400).json({ message: "UID is required" });
        };
        const user = await UserModel.findOne({ UID: `STUD-${UIDNumber}`, role: "student" })
            .select("-password -updatedAt -__v");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // toDO:  get the user fee details and all
        const feeDetails = await FeeModel.aggregate([
            {
                $match: { student: user._id },
            },
            {
                $project: {
                    _id: 1,
                    amount: 1,
                    paid: 1,
                    transactionDetail: 1,
                    mode: 1,
                    paidAt: 1,
                    month: 1
                }
            }
        ]);
        res.status(200).json({ user, feeDetails })
    } catch (error) {
        console.log("Error in getStudentInfoByUID controller: " + error);
        next(error);
    }
});

// delete the selected user
export const deleteUser = expressAsyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // delete the fee detail of the user and pop the user from the batches where the user exist and then delete the user
        await FeeModel.deleteMany({ student: userId });
        await BatchModel.updateMany({ students: { $in: [userId] } }, { $pull: { students: userId } });
        await user.deleteOne();

        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.log("Error in deleteStudent controller: " + error);
        next(error);
    }
});

// batches

// create batch
export const createBatch = expressAsyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        const { name, teacher, standard } = req.body;

        if (!name || !teacher || !standard) {
            return res.status(400).json({ message: "Batch name and Teacher is required" });
        }

        // check if the batch name already exists
        const batch = await BatchModel.find({
            teacher,
            name
        });

        if (batch.length > 0) {
            return res.status(400).json({ message: "Batch name already exists" });
        }
        const batchJoiningCode = Math.floor(100000 + Math.random() * 900000);
        await BatchModel.create({
            name,
            teacher: user._id,
            batchJoiningCode,
            standard
        });
        return res.status(201).json({ message: "Batch created successfully" });
    } catch (error) {
        console.log("Error in createBatch controller: " + error);
        next(error);
    }
});

// get all the teachers
export const getAllTeachers = expressAsyncHandler(async (req, res, next) => {
    try {
        const teachers = await UserModel.aggregate([
            {
                $match: { role: "teacher", isVerified: true },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    UID: 1
                }
            }
        ])


        return res.status(200).json({ teachers });
    } catch (error) {
        console.log("Error in getAllTeachers controller: " + error);
        next(error);
    }
});

// get all the batches for admin
export const getAllBatchesForAdmin = expressAsyncHandler(async (req, res, next) => {
    try {
        const batches = await BatchModel.aggregate([
            // populate the teacher details
            {
                $lookup: {
                    from: "users",
                    localField: "teacher",
                    foreignField: "_id",
                    as: "teacher",
                },
            },
            {
                $unwind: "$teacher",
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    batchJoiningCode: 1,
                    standard: 1,
                    teacher: { name: "$teacher.name" },
                },
            }
        ]);
        const batchCount = await BatchModel.countDocuments();
        return res.status(200).json({ batches, batchCount });
    } catch (error) {
        console.log("Error in getAllBatchesForAdmin controller: " + error);
        next(error);
    }
});

// delete batch
export const deleteBatch = expressAsyncHandler(async (req, res, next) => {
    try {
        const { batchId } = req.params;
        const batch = await BatchModel.findOne(batchId);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }
        // delete the assignments of the selected batch
        const assignments = await AssignmentModel.find({ batch: batchId });
        for (const assignment of assignments) {
            // if the assignment has multiple batchids in the array then pop the deleted batchId
            if (assignment.batchIds.includes(batchId)) {
                assignment.batchIds.pull(batchId);
            }
            // if the batchIds have only one batchId then delete the assignment
            if (assignment.batchIds.length === 1) {
                await assignment.deleteOne();
            }
            await assignment.save();
        }

        await batch.deleteOne();
        return res.status(200).json({ message: "Batch deleted successfully" });
    } catch (error) {
        console.log("Error in deleteBatch controller: " + error);
        next(error);
    }
});

// fee

// verify the fee for the student who already paid the fee offline
export const verifyFeePayment = expressAsyncHandler(async (req, res, next) => {
    try {
        const { feeId } = req.body;
        const feeInfo = await FeeModel.findByIdAndUpdate(feeId, {
            paid: true,
            mode: "offline",
            paidAt: new Date()
        });

        if (!feeInfo) {
            return res.status(404).json({ message: "Fee not found" });
        }

        return res.status(200).json({ message: "Fee verified successfully" });
    } catch (error) {
        console.log("Error in verifyFeePayment controller: " + error);
        next(error);
    }
})