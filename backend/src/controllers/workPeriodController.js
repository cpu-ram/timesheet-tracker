const workPeriods = [
  {
    id: 1, startTime: '2024-08-10T08:00:00Z', endTime: '2024-08-10T16:00:00Z', jobId: 101, userId: 1,
  },
  {
    id: 2, startTime: '2024-08-11T09:00:00Z', endTime: '2024-08-11T17:00:00Z', jobId: 102, userId: 2,
  },
];

export const getWorkPeriods = (req, res) => {
  res.json(workPeriods);
};
