import UserModel from "../models/auth.model.js";
import FeeModel from "../models/fee.model.js";
import { FeeMappingUsingStandard } from "./FeeMappingUsingStandard.js";

const AutomateGenerateFeeForStudents = async () => {
    const students = await UserModel.aggregate([
        {
            $match: { role: "student" },
        },
        {
            $project: {
                _id: 1,
                standard: 1,
            },
        }
    ]);

    if (students.length === 0) {
        return;
    }

    const today = new Date();
    const isFirstDayOfMonth = today.getDate() === 1;

    if (!isFirstDayOfMonth) {
        return;
    }

    for (const student of students) {
        // get the fee for the student as per the standard
        const fee = FeeMappingUsingStandard[student.standard];
        // Generate fee for the student only on the first day of the month
        await FeeModel.create({
            amount: fee,
            student: student._id,
        })
    }
};

export default AutomateGenerateFeeForStudents