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
        const feeDetail = await FeeModel.findOne({ student: student._id, month: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }) });

        if (feeDetail) {
            continue;
        }
        // Generate fee for the student only on the first day of the month
        await FeeModel.create({
            amount: fee,
            student: student._id,
            month: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        })
    }
    console.log("Fee generated for students");
};

export default AutomateGenerateFeeForStudents