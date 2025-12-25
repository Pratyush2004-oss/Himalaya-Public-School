import UserModel from "../models/auth.model.js";
import FeeModel from "../models/fee.model.js";
import { FeeMappingUsingStandard, BusFeeMapping } from "./FeeMappingUsingStandard.js";

const AutomateGenerateFeeForStudents = async () => {
    const students = await UserModel.aggregate([
        {
            $match: { role: "student" },
        },
        {
            $project: {
                _id: 1,
                standard: 1,
                bus: 1
            },
        }
    ]);

    if (students.length === 0) {
        return;
    }

    // generate fee for student as per the standard if the fee detail doesnot exist for the current month
    for (const student of students) {
        let fee = 0;
        // get the fee for the student as per the standard
        const standardFee = FeeMappingUsingStandard[student.standard];

        if (!standardFee) {
            continue;
        }

        if (student.bus && student.bus.useBus && student.bus.pickUp !== "") {
            const busFee = BusFeeMapping[student.bus.pickUp];
            if (busFee) {
                fee = busFee + standardFee;
            } else {
                fee = standardFee;
            }
        } else {
            fee = standardFee;
        }

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

export default AutomateGenerateFeeForStudents;