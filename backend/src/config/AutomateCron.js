import cron from "node-cron";
import AutomateGenerateFeeForStudents from "./AutomateGenerateFeeForStudents.js";
import { AutomateDeleteUser } from "./automateDeleteUser.js";

const startFeeCron = () => {
    // Runs once every day at 2:00 AM
    cron.schedule(
        "0 2 * * *",
        async () => {
            try {
                console.log("[CRON] Fee generation started");
                await AutomateGenerateFeeForStudents();
                console.log("[CRON] Fee generation completed");
            } catch (error) {
                console.error("[CRON] Fee generation failed:", error);
            }
        },
        {
            scheduled: true,
            timezone: "Asia/Kolkata",
        }
    );

    //   automate delete users who are not verified after 10 days
    cron.schedule(
        "* * * * *",
        async () => {
            try {
                console.log("[CRON] Delete user generation started");
                await AutomateDeleteUser();
                console.log("[CRON] Delete user generation completed");
            } catch (error) {
                console.error("[CRON] Delete user generation failed:", error);
            }
        },
        {
            scheduled: true,
            timezone: "Asia/Kolkata",
        }
    );
};

export default startFeeCron;
