import expressAsyncHandler from "express-async-handler";
import BatchModel from "../models/batch.model.js";
import UserModel from "../models/auth.model.js";
import mongoose from "mongoose";
import AssignmentModel from "../models/assignment.model.js";

// controllers that only teacher can access

// get all the student list who are not in the batch
export const getAllStudents = expressAsyncHandler(async (req, res, next) => {
    try {
        const { batchId } = req.params;
        const batch = await BatchModel.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        // get all students
        const students = await UserModel.aggregate([
            {
                $match: {
                    role: "student",
                    isVerified: true,
                    standard: batch.standard,
                    _id: { $nin: batch.students }
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    UID: 1,
                    standard: 1,
                }
            }, {
                $sort: {
                    createdAt: -1
                }
            }
        ]);

        return res.status(200).json({ students });
    } catch (error) {
        console.log("Error in getAllStudents controller: " + error);
        next(error);
    }
});

// change Batch Joining code
export const changeBatchJoiningCode = expressAsyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        const { batchId } = req.params;

        if (!batchId) {
            return res.status(400).json({ message: "Batch ID is required" });
        }

        const batch = await BatchModel.findById(batchId);

        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        // check if the current user is the teacher of that batch or not
        if (batch.teacher.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to change the batch joining code" });
        }

        // change the code
        const batchJoiningCode = Math.floor(100000 + Math.random() * 900000);
        batch.batchJoiningCode = batchJoiningCode;
        await batch.save();
        return res.status(200).json({ message: "Batch joining code updated successfully" });


    } catch (error) {
        console.log("Error in changeBatchJoiningCode controller: " + error);
        next(error);
    }
})

// add students to the batch
export const addStudentsByTeacher = expressAsyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        const { batchId, studentIds } = req.body;

        if (!batchId) {
            return res.status(400).json({ message: "Batch ID is required" });
        }

        if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
            return res.status(400).json({ message: "At least one student ID is required" });
        }

        const batch = await BatchModel.findById(batchId);

        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        if (batch.teacher.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to add students to this batch" });
        }

        // check for the students who have same OrganizationIds as batch
        for (let studentId in studentIds) {
            if (!mongoose.Types.ObjectId.isValid(studentIds[studentId])) {
                continue;
            }
            const objectId = new mongoose.Types.ObjectId(studentIds[studentId]);
            const student = await UserModel.findById(objectId);
            if (!student) {
                continue;
            }
            if (!(student.role === "student" && student.isVerified && student.standard === batch.standard)) {
                continue;
            }
            if (batch.students.includes(student._id)) {
                continue;
            }
            batch.students.push(student._id);
        }

        await batch.save();

        return res.status(200).json({ message: "Students added to batch successfully", batch });

    } catch (error) {
        console.log("Error in addStudentsByTeacher controller: " + error);
        next(error);
    }
});

// remove student from batch
export const deleteStudentFromBatch = expressAsyncHandler(async (req, res, next) => {
    try {
        const { studentId, batchId } = req.body;
        const user = req.user;

        if (!studentId || !batchId) {
            return res.status(400).json({ message: "Student ID and batch ID are required" });
        }

        const batchToUpdate = await BatchModel.findById(batchId);

        if (!batchToUpdate) {
            return res.status(404).json({ message: "Batch not found" });
        }

        const student = await UserModel.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // check the user is actually the teacher of that batch
        if (batchToUpdate.teacher.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete students from this batch" });
        }

        // check whether the student is in the batch actually
        if (!batchToUpdate.students.includes(studentId)) {
            return res.status(404).json({ message: "Student not found in the batch" });
        }

        batchToUpdate.students.pull(studentId);
        await batchToUpdate.save();

        return res.status(200).json({ message: "Student removed from batch successfully" });
    } catch (error) {
        console.log("Error in deleteStudentFromBatch controller: " + error);
        next(error);
    }
});

// get All batches for teacher
export const getAllBatchesForTeacher = expressAsyncHandler(async (req, res, next) => {
    try {
        const user = req.user;

        // Aggregation pipeline:
        const batches = await BatchModel.aggregate([
            // 1. $match: Find batches where teacherId matches and Organization is in user's organizations
            {
                $match: {
                    teacher: new mongoose.Types.ObjectId(user._id),
                }
            },
            // 2. $project: Format output and add studentCount
            {
                $project: {
                    _id: 1,
                    name: 1,
                    standard:1,
                    batchJoiningCode: 1,
                    studentCount: { $size: "$students" }
                }
            }
        ]);

        return res.status(200).json({ batches });
    } catch (error) {
        console.log("Error in getAllBatchesForTeacher controller: " + error);
        next(error);
    }
})

// get batch by Id for teacher
export const getBatchByIdForTeacher = expressAsyncHandler(async (req, res, next) => {
    try {
        const { batchId } = req.params;
        const user = req.user;

        // Aggregation pipeline:
        const batches = await BatchModel.aggregate([
            // 1. $match: Find the batch by _id and teacherId
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(batchId),
                    teacher: new mongoose.Types.ObjectId(user._id)
                }
            },
            // 2. $lookup: Populate student details
            {
                $lookup: {
                    from: "users",
                    localField: "students",
                    foreignField: "_id",
                    as: "studentList"
                }
            },
            // 3. $project: Only student list with basic details
            {
                $project: {
                    students: {
                        $map: {
                            input: "$studentList",
                            as: "student",
                            in: {
                                _id: "$$student._id",
                                name: "$$student.name",
                                email: "$$student.email",
                                standard: "$$student.standard",
                                UID: "$$student.UID"
                            }
                        }
                    }
                }
            }
        ]);

        if (!batches || batches.length === 0) {
            return res.status(404).json({ message: "Batch not found or you are not authorized" });
        }

        // Return only the student list
        return res.status(200).json({ students: batches[0].students });
    } catch (error) {
        console.log("Error in getBatchByIdForTeacher controller: " + error);
        next(error);
    }
})

// delete batch by Id
export const deleteBatch = expressAsyncHandler(async (req, res, next) => {
    const { batchId } = req.params;
    const user = req.user;

    try {
        if (!batchId) {
            return res.status(400).json({ message: "Batch ID is required" });
        }

        const batch = await BatchModel.findById(batchId);

        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        // check the user is actually the teacher of that batch
        if (batch.teacher.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this batch" });
        }

        // delete all the related assignments of that batch
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
        // delete the batch
        await batch.deleteOne();

        res.status(200).json({ message: "Batch deleted successfully" });

    } catch (error) {
        console.log("Error in deleteBatch controller: " + error);
        next(error);
    }
})

// controllers that only students can access

// get all the batches for student
export const getAllBatchesForStudent = expressAsyncHandler(async (req, res, next) => {
    try {
        const user = req.user;

        // Aggregation pipeline:
        const batches = await BatchModel.aggregate([
            // 1. $match: Find batches where the user is in the students array
            {
                $match: {
                    students: new mongoose.Types.ObjectId(user._id)
                }
            },
            // 2. $lookup: Populate teacher details
            {
                $lookup: {
                    from: "users",
                    localField: "teacher",
                    foreignField: "_id",
                    as: "teacherDetails"
                }
            },
            {
                $unwind: "$teacherDetails"
            },
            // 4. $project: Format output and add studentCount
            {
                $project: {
                    _id: 1,
                    name: 1,
                    standard: 1,
                    teacher: { name: "$teacherDetails.name" },
                    studentCount: { $size: "$students" }
                }
            }
        ]);

        return res.status(200).json({ batches });
    } catch (error) {
        console.log("Error in getAllBatchesForStudent controller: " + error);
        next(error);
    }
})

// get all batches for students to join
export const getAllBatchesForStudentToJoin = expressAsyncHandler(async (req, res, next) => {
    try {
        const user = req.user;

        // Aggregation pipeline:
        const batches = await BatchModel.aggregate([
            // 1. $match: Find batches where the user is not in the students array
            {
                $match: {
                    standard: user.standard,
                    students: { $nin: [new mongoose.Types.ObjectId(user._id)] }
                }
            },
            // 2. $lookup: Populate teacher details
            {
                $lookup: {
                    from: "users",
                    localField: "teacher",
                    foreignField: "_id",
                    as: "teacherDetails"
                }
            },
            {
                $unwind: "$teacherDetails"
            },
            {
                // 4. $project: Format output and add isStudent flag
                $project: {
                    _id: 1,
                    name: 1,
                    standard: 1,
                    teacher: { name: "$teacherDetails.name" },
                }
            }
        ]);

        return res.status(200).json({ batchDetails: batches });
    } catch (error) {
        console.log("Error in getAllBatchesofOrganization controller: " + error);
        next(error);
    }
})

// leave batch
export const leaveBatch = expressAsyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        const { batchId } = req.body;

        if (!batchId) {
            return res.status(400).json({ message: "Batch ID is required" });
        }

        const batch = await BatchModel.findById(batchId);
        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        // Check if the user is a student in the batch
        if (!batch.students.includes(user._id)) {
            return res.status(403).json({ message: "You are not a student of this batch" });
        }

        // Remove the user from the batch's students array
        batch.students.pull(user._id);
        await batch.save();

        return res.status(200).json({ message: "You have left the batch successfully" });
    } catch (error) {
        console.log("Error in leaveBatch controller: " + error);
        next(error);
    }
})

// join batch
export const joinBatchByCode = expressAsyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        const { batchJoiningCode, batchId } = req.body;


        if (!batchJoiningCode || !batchId) {
            return res.status(400).json({ message: "Batch joining code and batch ID are required" });
        }

        const batch = await BatchModel.findById(batchId);

        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        // Check if the user is already a student in the batch
        if (batch.students.includes(user._id)) {
            return res.status(400).json({ message: "You are already a student of this batch" });
        }


        if (batch.batchJoiningCode !== batchJoiningCode) {
            return res.status(400).json({ message: "Invalid batch joining code" });
        }

        batch.students.push(user._id);
        await batch.save();

        return res.status(200).json({ message: "You are added to the batch successfully" });


    } catch (error) {
        console.log("Error in joinBatchByCode controller: " + error);
        next();
    }
})