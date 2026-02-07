import mongoose from 'mongoose';
const AssignmentSchema = new mongoose.Schema({
    batchIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        required: true
    }],
    homework: [{
        type: String,
        required: true
    }]
}, { timestamps: true });

const AssignmentModel = mongoose.model("assignment", AssignmentSchema);

export default AssignmentModel;