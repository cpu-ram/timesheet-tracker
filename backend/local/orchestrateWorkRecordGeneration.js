import startPostgresInstance from './start-postgres.js';
import generateDefaultWeeklyWorkRecords from '../src/services/generateDefaultWeeklyWorkRecordsService.js';
import dotenv from 'dotenv';

dotenv.config();

(async function orchestrate() {
  try {
    console.log("Initializing Colima and PostgreSQL...");
    await startPostgresInstance();

    console.log("Generating default weekly work records...");
    const jobId = process.env.JOB_ID;
    const employeeId = 10; // This is a dummy employee ID for testing purposes

    await generateDefaultWeeklyWorkRecords(jobId, employeeId);

    console.log("Work records generated successfully!");
  } catch (error) {
    console.error("An error occurred during execution:", error.message);
    process.exit(1);
  }
})();
