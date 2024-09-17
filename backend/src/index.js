import express from 'express';

const app = express();
app.use(express.json());

const workPeriods = [
  {
    id: 1, startTime: '2024-08-10T08:00:00Z', endTime: '2024-08-10T16:00:00Z', jobId: 101, userId: 1,
  },
  {
    id: 2, startTime: '2024-08-11T09:00:00Z', endTime: '2024-08-11T17:00:00Z', jobId: 102, userId: 2,
  },
];

// Define routes in index.js
app.get('/work-periods', async (req, res) => {
  res.json(workPeriods);
});

export default app;  // Export the app instance
