import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import connectDB from './config/db.js';

// importing the routes
import authRoutes from './routes/auth.route.js';
import assignmentRoutes from './routes/assignment.routes.js';
import batchRoutes from './routes/batch.route.js';
import adminRoutes from './routes/admin.routes.js';
import feeRoutes from './routes/fee.routes.js';
import startFeeCron, { runScheduledJobs } from './config/AutomateCron.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is now Live");
})

// routes setup
app.use('/api/auth', authRoutes);
app.use('/api/assignment', assignmentRoutes);
app.use('/api/batch', batchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/fee', feeRoutes);

// Endpoint for Vercel Cron to trigger scheduled jobs in a serverless-friendly way
app.get('/api/cron/run', async (req, res) => {
    try {
        await runScheduledJobs();
        res.json({ status: 'ok' });
    } catch (error) {
        console.error('[CRON] Manual trigger failed:', error);
        res.status(500).json({ message: error.message || 'Cron trigger failed' });
    }
});

app.use((err, req, res, next) => {
    console.error("Unhandled error: ", err);
    res.status(500).json({ message: `Error in server : ${err.message}` || "Internal Server Error" })
});

const startServer = async () => {
    try {
        await connectDB();

        // Keep node-cron only for long-running local dev
        if (ENV.NODE_ENV !== 'production') {
            startFeeCron();
        }

        // Always listen for incoming requests
        app.listen(ENV.PORT, () => {
            console.log(`Server listening on port ${ENV.PORT}`);
        })
    } catch (error) {
        console.log("Failed to start Server:" + error.message);
        process.exit(1);
    }
}
startServer();

export default app;