const workBlocks = [
  // Week 1 - Monday (2024-09-16)
  {
    id: 1, startTime: '2024-09-16T06:00:00Z', endTime: '2024-09-16T10:00:00Z', jobId: 101, userId: 1,
  },
  {
    id: 2, startTime: '2024-09-16T10:00:00Z', endTime: '2024-09-16T14:00:00Z', jobId: 102, userId: 1,
  },

  {
    id: 3, startTime: '2024-09-16T06:00:00Z', endTime: '2024-09-16T10:00:00Z', jobId: 101, userId: 2,
  }, // Working same time and job as user 1
  {
    id: 4, startTime: '2024-09-16T10:00:00Z', endTime: '2024-09-16T14:00:00Z', jobId: 104, userId: 2,
  },

  {
    id: 5, startTime: '2024-09-16T06:00:00Z', endTime: '2024-09-16T10:00:00Z', jobId: 105, userId: 3,
  },
  {
    id: 6, startTime: '2024-09-16T10:00:00Z', endTime: '2024-09-16T14:00:00Z', jobId: 102, userId: 3,
  }, // Working same time and job as user 1

  // Week 1 - Tuesday (2024-09-17) - User 1 takes the day off
  {
    id: 7, startTime: '2024-09-17T06:00:00Z', endTime: '2024-09-17T10:00:00Z', jobId: 103, userId: 2,
  },
  {
    id: 8, startTime: '2024-09-17T10:00:00Z', endTime: '2024-09-17T14:00:00Z', jobId: 105, userId: 2,
  },

  {
    id: 9, startTime: '2024-09-17T06:00:00Z', endTime: '2024-09-17T10:00:00Z', jobId: 104, userId: 3,
  },

  // Week 1 - Wednesday (2024-09-18) - User 3 skips work
  {
    id: 10, startTime: '2024-09-18T06:00:00Z', endTime: '2024-09-18T08:00:00Z', jobId: 105, userId: 1,
  },
  {
    id: 11, startTime: '2024-09-18T08:00:00Z', endTime: '2024-09-18T14:00:00Z', jobId: 101, userId: 1,
  },

  {
    id: 12, startTime: '2024-09-18T06:00:00Z', endTime: '2024-09-18T08:00:00Z', jobId: 105, userId: 2,
  }, // Working same time and job as user 1
  {
    id: 13, startTime: '2024-09-18T08:00:00Z', endTime: '2024-09-18T12:00:00Z', jobId: 103, userId: 2,
  },

  // Week 1 - Thursday (2024-09-19)
  {
    id: 14, startTime: '2024-09-19T06:00:00Z', endTime: '2024-09-19T10:00:00Z', jobId: 102, userId: 1,
  },
  {
    id: 15, startTime: '2024-09-19T10:00:00Z', endTime: '2024-09-19T14:00:00Z', jobId: 105, userId: 1,
  },

  {
    id: 16, startTime: '2024-09-19T06:00:00Z', endTime: '2024-09-19T10:00:00Z', jobId: 102, userId: 2,
  }, // Working same time and job as user 1
  {
    id: 17, startTime: '2024-09-19T10:00:00Z', endTime: '2024-09-19T12:00:00Z', jobId: 101, userId: 2,
  },

  {
    id: 18, startTime: '2024-09-19T06:00:00Z', endTime: '2024-09-19T08:00:00Z', jobId: 103, userId: 3,
  },
  {
    id: 19, startTime: '2024-09-19T08:00:00Z', endTime: '2024-09-19T14:00:00Z', jobId: 105, userId: 3,
  }, // Working same time and job as user 1

  // Week 1 - Friday (2024-09-20)
  {
    id: 20, startTime: '2024-09-20T06:00:00Z', endTime: '2024-09-20T10:00:00Z', jobId: 103, userId: 1,
  },
  {
    id: 21, startTime: '2024-09-20T10:00:00Z', endTime: '2024-09-20T14:00:00Z', jobId: 101, userId: 1,
  },

  {
    id: 22, startTime: '2024-09-20T06:00:00Z', endTime: '2024-09-20T10:00:00Z', jobId: 103, userId: 2,
  }, // Working same time and job as user 1
  {
    id: 23, startTime: '2024-09-20T10:00:00Z', endTime: '2024-09-20T14:00:00Z', jobId: 102, userId: 2,
  },

  {
    id: 24, startTime: '2024-09-20T06:00:00Z', endTime: '2024-09-20T10:00:00Z', jobId: 104, userId: 3,
  },
  {
    id: 25, startTime: '2024-09-20T10:00:00Z', endTime: '2024-09-20T14:00:00Z', jobId: 101, userId: 3,
  }, // Working same time and job as user 1

  // Week 2 - Monday (2024-09-23)
  {
    id: 26, startTime: '2024-09-23T06:00:00Z', endTime: '2024-09-23T10:00:00Z', jobId: 101, userId: 1,
  },
  {
    id: 27, startTime: '2024-09-23T10:00:00Z', endTime: '2024-09-23T14:00:00Z', jobId: 102, userId: 1,
  },

  {
    id: 28, startTime: '2024-09-23T06:00:00Z', endTime: '2024-09-23T12:00:00Z', jobId: 103, userId: 2,
  },

  {
    id: 29, startTime: '2024-09-23T06:00:00Z', endTime: '2024-09-23T08:00:00Z', jobId: 104, userId: 3,
  },
  {
    id: 30, startTime: '2024-09-23T08:00:00Z', endTime: '2024-09-23T12:00:00Z', jobId: 105, userId: 3,
  },

  // Week 2 - Tuesday (2024-09-24) - User 2 takes the day off
  {
    id: 31, startTime: '2024-09-24T06:00:00Z', endTime: '2024-09-24T10:00:00Z', jobId: 102, userId: 1,
  },
  {
    id: 32, startTime: '2024-09-24T10:00:00Z', endTime: '2024-09-24T14:00:00Z', jobId: 101, userId: 1,
  },

  {
    id: 33, startTime: '2024-09-24T06:00:00Z', endTime: '2024-09-24T12:00:00Z', jobId: 105, userId: 3,
  },

  // Week 2 - Wednesday (2024-09-25) - User 1 skips work
  {
    id: 34, startTime: '2024-09-25T06:00:00Z', endTime: '2024-09-25T10:00:00Z', jobId: 103, userId: 2,
  },
  {
    id: 35, startTime: '2024-09-25T10:00:00Z', endTime: '2024-09-25T14:00:00Z', jobId: 104, userId: 2,
  },

  {
    id: 36, startTime: '2024-09-25T06:00:00Z', endTime: '2024-09-25T08:00:00Z', jobId: 102, userId: 3,
  },
  {
    id: 37, startTime: '2024-09-25T08:00:00Z', endTime: '2024-09-25T14:00:00Z', jobId: 101, userId: 3,
  },

  // Week 2 - Thursday (2024-09-26)
  {
    id: 38, startTime: '2024-09-26T06:00:00Z', endTime: '2024-09-26T10:00:00Z', jobId: 105, userId: 1,
  },
  {
    id: 39, startTime: '2024-09-26T10:00:00Z', endTime: '2024-09-26T14:00:00Z', jobId: 101, userId: 1,
  },

  {
    id: 40, startTime: '2024-09-26T06:00:00Z', endTime: '2024-09-26T10:00:00Z', jobId: 103, userId: 2,
  }, // Working same time and job as user 1
  {
    id: 41, startTime: '2024-09-26T10:00:00Z', endTime: '2024-09-26T12:00:00Z', jobId: 104, userId: 2,
  },

  {
    id: 42, startTime: '2024-09-26T06:00:00Z', endTime: '2024-09-26T10:00:00Z', jobId: 102, userId: 3,
  },

  // Week 2 - Friday (2024-09-27) - User 3 takes the day off
  {
    id: 43, startTime: '2024-09-27T06:00:00Z', endTime: '2024-09-27T10:00:00Z', jobId: 101, userId: 1,
  },
  {
    id: 44, startTime: '2024-09-27T10:00:00Z', endTime: '2024-09-27T14:00:00Z', jobId: 102, userId: 1,
  },

  {
    id: 45, startTime: '2024-09-27T06:00:00Z', endTime: '2024-09-27T12:00:00Z', jobId: 105, userId: 2,
  },
];

const getWorkBlocks = (req, res) => {
  res.json(workBlocks);
};

export default getWorkBlocks;
