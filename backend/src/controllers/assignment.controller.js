import expressasyncHandler from 'express-async-handler';
import streamifier from 'streamifier';
import mongoose from 'mongoose';
import BatchModel from '../models/batch.model.js';
import AssignmentModel from '../models/assignment.model.js';
import cloudinary from '../config/cloudinary.js';

// Helper function to determine resource type
const getResourceType = (mimetype) => {
    if (mimetype.startsWith('image')) return 'image';
    // For PDFs, DOCX, etc., we use 'raw'
    return 'raw';
};

// create homework by the teacher of that batch
export const createAssignment = expressasyncHandler(async (req, res, next) => {
    try {
        const { batchIds } = req.body;
        const user = req.user;
        const files = req.files;

        // check for the files
        if (!files && files.length === 0) {
            return res.status(400).json({ error: "Files are required" });
        }

        // check for batchIds whether they are in array or not
        if (!batchIds) {
            return res.status(400).json({ error: "BatchIds are required" });
        }

        const batchIdArray = batchIds.split(',');
        // get the batches and check whether the current user is the teacer of that batch or not
        for (let batchId of batchIdArray) {
            // check for the batchId that whether the the id is an objectId or not
            if (!mongoose.Types.ObjectId.isValid(batchId)) {
                return res.status(400).json({ error: "Invalid batchIds" })
            }

            const batch = await BatchModel.findById(batchId);
            if (!batch) {
                return res.status(404).json({ error: "Batch not found" });
            }

            if (batch.teacher.toString() !== user._id.toString()) {
                return res.status(403).json({ error: "You are not authorized to create assignment for this batch" });
            }
        }
        // now upload the files to cloudinary
        // ... inside your createAssignment controller ...

        const uploadPromises = req.files.map(file => {
            const resourceType = getResourceType(file.mimetype); // Your helper function

            // --- THE CORRECT FIX ---
            // For 'raw' files, the public_id MUST include the file extension.
            // We simply use the full originalname provided by Multer.
            const publicId = file.originalname;

            return new Promise((resolve, reject) => {
                const cld_upload_stream = cloudinary.uploader.upload_stream({
                    resource_type: resourceType,
                    folder: 'Himalaya-Public-School',
                    // Use the full filename as the public_id
                    public_id: publicId,
                    // This prevents files with the same name from overwriting each other.
                    // Cloudinary will add a random suffix if a file with this name already exists.
                    overwrite: false
                }, (error, result) => {
                    if (error) {
                        console.error('Cloudinary Upload Error:', error);
                        reject(error);
                    } else {
                        resolve(result.secure_url);
                    }
                });
                streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
            });
        });

        // ... rest of your controller logic ...

        // wait for all uploads to complete
        try {
            const urls = await Promise.all(uploadPromises);
            // create the asignments
            const assignments = await AssignmentModel.create({
                batchIds: batchIdArray,
                homework: urls,
            })
            res.status(200).send({
                message: 'Files uploaded successfully',
                assignments
            });
        } catch (error) {
            res.status(500).send({ error: 'Failed to upload one or more files.', error });
        }

    } catch (error) {
        console.log("Error in create-assignment controller: " + error);
        next(error);
    }
});

// get homework of the perticular batch for the students
export const getAssignment = expressasyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        const { batchId } = req.params;

        if (!batchId) {
            return res.status(400).json({ message: "BatchId is required" });
        }

        // check if the current user is the student of that batch or not
        const batch = await BatchModel.findById(batchId);
        if (!batch) {
            return res.status(404).json({ error: "Batch not found" });
        }

        if (!batch.students.includes(user._id)) {
            return res.status(403).json({ error: "You are not a student of this batch" });
        }

        // now get the assignments
        const assignments = await AssignmentModel.aggregate([
            {
                $match: {
                    batchIds: { $in: [batch._id] }
                }
            },
            {
                $project: {
                    batchId: 1,
                    homework: 1,
                    createdAt: 1
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);

        return res.status(200).json({ assignments });

    } catch (error) {
        console.log("Error in get-assignment controller : " + error);
    }

});

// get all the assignments for the student for the date
export const getAllAssignmentsofToday = expressasyncHandler(async (req, res, next) => {
    try {
        const user = req.user;

        const batches = await BatchModel.aggregate([
            {
                $match: {
                    students: { $in: [user._id] }
                }
            },
            {
                $project: {
                    _id: 1,
                }
            }
        ])
        const currentDate = new Date().toISOString().split('T')[0];

        const assignments = await AssignmentModel.aggregate([
            {
                $match: {
                    batchIds: { $in: batches.map(batch => batch._id) },
                    createdAt: { $gte: new Date(`${currentDate}T00:00:00.000Z`), $lt: new Date(`${currentDate}T23:59:59.999Z`) }
                }
            },
            {
                $lookup: {
                    from: "batches",
                    localField: "batchIds",
                    foreignField: "_id",
                    as: "batchDetails"
                }
            },
            {
                $unwind: "$batchDetails"
            },
            {
                $project: {
                    homework: 1,
                    batchName: "$batchDetails.name"
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);

        return res.status(200).json({ assignments });

    } catch (error) {
        console.log("Error in getting all the assignments : " + error);
        next(error);
    }
})

// delete homeWork 
export const deleteAssignment = expressasyncHandler(async (req, res, next) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await AssignmentModel.findByIdAndDelete(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found" });
        }
        return res.status(200).json({ message: "Assignment deleted successfully" });
    } catch (error) {
        console.log("Error in delete-assignment controller: " + error);
        next(error);
    }
});