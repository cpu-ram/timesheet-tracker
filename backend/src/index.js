import express from 'express';
import workPeriodRoutes from './routes/workPeriodRoutes.js';

const app = express();
app.use(express.json());

// Define routes in index.js
app.use('/work_periods/', workPeriodRoutes)

export default app;  // Export the app instance
