import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import connectDB from './config/db.js';
import AutomateGenerateFeeForStudents from './config/AutomateGenerateFeeForStudents.js';

// importing the routes
import authRoutes from './routes/auth.route.js';
import assignmentRoutes from './routes/assignment.routes.js';
import batchRoutes from './routes/batch.route.js';
import adminRoutes from './routes/admin.routes.js';

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

app.use((err, req, res, next) => {
    console.error("Unhandled error: ", err);
    res.status(500).json({ error: `Error in server : ${err.message}` || "Internal Server Error" })
});

const startServer = async () => {
    try {
        await connectDB();
        await AutomateGenerateFeeForStudents();
        // listen to local development
        if (ENV.NODE_ENV !== 'production') {
            app.listen(ENV.PORT, () => {
                console.log(`Server listening on port ${ENV.PORT}`);
            })
        }
    } catch (error) {
        console.log("Failed to start Server:" + error.message);
        process.exit(1);
    }
}
startServer();

export default app;