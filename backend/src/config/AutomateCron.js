import cron from "node-cron";
import AutomateGenerateFeeForStudents from "./AutomateGenerateFeeForStudents.js";
import { AutomateDeleteUser } from "./automateDeleteUser.js";

export const runScheduledJobs = async () => {
    // Runs both jobs sequentially so they can be triggered by Vercel Cron or manually.
    console.log("[CRON] Fee generation started");
    await AutomateGenerateFeeForStudents();
    console.log("[CRON] Fee generation completed");

    console.log("[CRON] Delete user generation started");
    await AutomateDeleteUser();
    console.log("[CRON] Delete user generation completed");
};

const startFeeCron = () => {
    // Runs once every day at 2:00 AM
    cron.schedule(
        "0 2 * * *",
        async () => {
            try {
                await runScheduledJobs();
            } catch (error) {
                console.error("[CRON] Scheduled jobs failed:", error);
            }
        },
        {
            scheduled: true,
            timezone: "Asia/Kolkata",
        }
    );
};

export default startFeeCron;
